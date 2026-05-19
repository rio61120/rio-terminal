/**
 * Dev / Docker server: Next.js + Socket.IO + real shell.
 * Run: `npm run dev` or `bun run dev`
 */
import { createServer } from 'node:http';
import { parse } from 'node:url';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import next from 'next';
import { Server } from 'socket.io';
import {
  createShellSession,
  initTerminalShell,
  resolveShell,
} from './lib/terminal-shell.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME ?? 'localhost';
const port = parseInt(process.env.PORT ?? '3000', 10);
const workspaceCwd = initTerminalShell();

const corsOrigins = process.env.TERMINAL_CORS_ORIGIN?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer((req, res) => {
  handle(req, res, parse(req.url, true));
});

const io = new Server(httpServer, {
  path: '/api/terminal/io',
  addTrailingSlash: false,
  cors: corsOrigins?.length
    ? { origin: corsOrigins, credentials: true }
    : undefined,
});

io.on('connection', (socket) => {
  console.log('[terminal] client connected', socket.id);
  try {
    createShellSession(socket, workspaceCwd);
  } catch (err) {
    socket.emit('output', `\r\n\x1b[31mFailed to start shell: ${err.message}\x1b[0m\r\n`);
    console.error('[terminal]', err);
  }
});

httpServer.listen(port, () => {
  console.log(`> RIO Terminal ready on http://${hostname}:${port}`);
  console.log(`> Terminal: ${resolveShell()} @ ${workspaceCwd}`);
});
