/**
 * Dev server: Next.js + Socket.IO + real shell.
 * Run: `npm run dev` or `bun run dev`
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { parse } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import next from 'next';
import { Server } from 'socket.io';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME ?? 'localhost';
const port = parseInt(process.env.PORT ?? '3000', 10);
const workspaceCwd = __dirname;

/** Prefer @lydell/node-pty — stock node-pty often fails with posix_spawnp on macOS. */
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

const ptyBridgeScript = path.join(__dirname, 'scripts', 'pty-bridge.py');
const pythonBin = existsSync('/usr/bin/python3') ? '/usr/bin/python3' : 'python3';

function probePty() {
  if (!ptySpawn) return false;
  try {
    const shell = resolveShell();
    const probe = ptySpawn(shell, ['-c', 'exit 0'], {
      name: 'xterm-256color',
      cols: 80,
      rows: 24,
      cwd: workspaceCwd,
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

if (ptySpawn && probePty()) {
  console.log(`[terminal] real shell via ${ptyBackend}`);
} else {
  ptySpawn = null;
  console.log('[terminal] PTY native module unavailable; will use Python bridge or pipe');
}

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer((req, res) => {
  handle(req, res, parse(req.url, true));
});

const io = new Server(httpServer, {
  path: '/api/terminal/io',
  addTrailingSlash: false,
});

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
    if (child.stdin?.writable) {
      child.stdin.write(data);
    }
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

function spawnPtyShell(socket) {
  const shell = resolveShell();
  const ptyProcess = ptySpawn(shell, ['-il'], {
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd: workspaceCwd,
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

function spawnPipeShell(socket) {
  const shell = resolveShell();
  const isWin = process.platform === 'win32';
  const args = isWin ? ['-NoLogo'] : ['-il'];

  const child = spawn(shell, args, {
    cwd: workspaceCwd,
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

function spawnPythonPtyShell(socket) {
  if (!existsSync(ptyBridgeScript)) return null;

  const child = spawn(pythonBin, [ptyBridgeScript, workspaceCwd], {
    cwd: workspaceCwd,
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

function createShellSession(socket) {
  if (ptySpawn) {
    try {
      return spawnPtyShell(socket);
    } catch (err) {
      console.warn('[terminal] pty spawn failed:', err.message);
    }
  }

  try {
    const py = spawnPythonPtyShell(socket);
    if (py) return py;
  } catch (err) {
    console.warn('[terminal] python pty failed:', err.message);
  }

  console.warn('[terminal] falling back to pipe shell (limited — install @lydell/node-pty)');
  return spawnPipeShell(socket);
}

io.on('connection', (socket) => {
  console.log('[terminal] client connected', socket.id);
  try {
    createShellSession(socket);
  } catch (err) {
    socket.emit('output', `\r\n\x1b[31mFailed to start shell: ${err.message}\x1b[0m\r\n`);
    console.error('[terminal]', err);
  }
});

httpServer.listen(port, () => {
  console.log(`> RIO Terminal ready on http://${hostname}:${port}`);
  console.log(`> Terminal: ${resolveShell()} @ ${workspaceCwd}`);
});
