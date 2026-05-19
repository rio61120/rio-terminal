/**
 * Shared PTY / shell session logic for server.mjs and standalone socket server.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

/** Default shell working directory: user home (~). Override with TERMINAL_CWD. */
export function resolveTerminalCwd() {
  const raw = process.env.TERMINAL_CWD?.trim();
  if (!raw) return os.homedir();
  if (raw === '~') return os.homedir();
  if (raw.startsWith('~/')) return path.join(os.homedir(), raw.slice(2));
  return raw;
}

const ptyBridgeScript = path.join(projectRoot, 'scripts', 'pty-bridge.py');
const pythonBin = existsSync('/usr/bin/python3') ? '/usr/bin/python3' : 'python3';

let ptySpawn = null;
let ptyBackend = null;

for (const mod of ['@lydell/node-pty', 'node-pty']) {
  try {
    const pty = await import(mod);
    ptySpawn = pty.spawn;
    ptyBackend = mod;
    break;
  } catch {
    /* try next */
  }
}

function resolveShell() {
  const candidates =
    process.platform === 'win32'
      ? ['powershell.exe', 'cmd.exe']
      : [process.env.SHELL, '/bin/zsh', '/bin/bash', '/usr/bin/zsh', '/usr/bin/bash'].filter(
          Boolean,
        );

  for (const shell of candidates) {
    if (existsSync(shell)) return shell;
  }
  return process.platform === 'win32' ? 'powershell.exe' : '/bin/bash';
}

function probePty(cwd) {
  if (!ptySpawn) return false;
  try {
    const shell = resolveShell();
    const probe = ptySpawn(shell, ['-c', 'exit 0'], {
      name: 'xterm-256color',
      cols: 80,
      rows: 24,
      cwd,
      env: { ...process.env, TERM: 'xterm-256color' },
    });
    probe.kill();
    return true;
  } catch (err) {
    console.warn(`[terminal] ${ptyBackend} probe failed:`, err.message);
    ptySpawn = null;
    ptyBackend = null;
    return false;
  }
}

export function initTerminalShell() {
  const cwd = resolveTerminalCwd();
  if (ptySpawn && probePty(cwd)) {
    console.log(`[terminal] real shell via ${ptyBackend}`);
  } else {
    ptySpawn = null;
    console.log('[terminal] PTY native module unavailable; will use Python bridge or pipe');
  }
  return cwd;
}

function attachShellToSocket(socket, child, label, echo) {
  const writeOut = (chunk) => {
    if (socket.connected) socket.emit('output', chunk.toString());
  };

  child.stdout?.on('data', writeOut);
  child.stderr?.on('data', writeOut);

  child.on('error', (err) => {
    socket.emit('output', `\r\n\x1b[31mShell error: ${err.message}\x1b[0m\r\n`);
  });

  child.on('exit', (code) => {
    socket.emit('output', `\r\n\x1b[33m[Shell exited: ${code ?? 0}]\x1b[0m\r\n`);
  });

  socket.on('input', (data) => {
    if (child.stdin?.writable) child.stdin.write(data);
  });

  socket.on('resize', ({ cols, rows }) => {
    if (child.resize && cols > 0 && rows > 0) {
      try {
        child.resize(cols, rows);
      } catch {
        /* pipe shells */
      }
    }
  });

  socket.on('disconnect', () => {
    try {
      if (child.kill) child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  });

  socket.emit('session', { echo, backend: echo === 'remote' ? 'pty' : 'pipe' });
  socket.emit('output', `\r\n\x1b[32m●\x1b[0m RIO Terminal (\x1b[36m${label}\x1b[0m)\r\n\r\n`);
}

function spawnPtyShell(socket, cwd) {
  const shell = resolveShell();
  const ptyProcess = ptySpawn(shell, ['-il'], {
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd,
    env: { ...process.env, TERM: 'xterm-256color', COLORTERM: 'truecolor' },
  });

  ptyProcess.onData((data) => socket.emit('output', data));
  socket.on('input', (data) => ptyProcess.write(data));
  socket.on('resize', ({ cols, rows }) => {
    if (cols > 0 && rows > 0) ptyProcess.resize(cols, rows);
  });
  socket.on('disconnect', () => {
    try {
      ptyProcess.kill();
    } catch {
      /* ignore */
    }
  });

  socket.emit('session', { echo: 'remote', backend: 'pty' });
  socket.emit(
    'output',
    `\r\n\x1b[32m●\x1b[0m RIO Terminal (\x1b[36m${path.basename(shell)}\x1b[0m · real PTY)\r\n\r\n`,
  );
  return ptyProcess;
}

function spawnPipeShell(socket, cwd) {
  const shell = resolveShell();
  const isWin = process.platform === 'win32';
  const args = isWin ? ['-NoLogo'] : ['-il'];

  const child = spawn(shell, args, {
    cwd,
    env: {
      ...process.env,
      TERM: 'xterm-256color',
      COLORTERM: 'truecolor',
      FORCE_COLOR: '1',
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  attachShellToSocket(socket, child, shell, 'local');
  return child;
}

function spawnPythonPtyShell(socket, cwd) {
  if (!existsSync(ptyBridgeScript)) return null;

  const child = spawn(pythonBin, [ptyBridgeScript, cwd], {
    cwd,
    env: {
      ...process.env,
      TERM: 'xterm-256color',
      COLORTERM: 'truecolor',
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  attachShellToSocket(socket, child, 'python pty', 'remote');
  return child;
}

export function createShellSession(socket, cwd) {
  if (ptySpawn) {
    try {
      return spawnPtyShell(socket, cwd);
    } catch (err) {
      console.warn('[terminal] pty spawn failed:', err.message);
    }
  }

  try {
    const py = spawnPythonPtyShell(socket, cwd);
    if (py) return py;
  } catch (err) {
    console.warn('[terminal] python pty failed:', err.message);
  }

  console.warn('[terminal] falling back to pipe shell (limited — install @lydell/node-pty)');
  return spawnPipeShell(socket, cwd);
}

export { resolveShell };
