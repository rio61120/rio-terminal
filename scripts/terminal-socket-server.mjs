/**
 * Standalone Socket.IO terminal server (no Next.js).
 * Deploy on Railway/Fly/Render and point Vercel at it via NEXT_PUBLIC_TERMINAL_SOCKET_URL.
 *
 *   TERMINAL_CORS_ORIGIN=https://your-app.vercel.app npm run terminal:server
 */
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { createShellSession, initTerminalShell, resolveShell } from '../lib/terminal-shell.mjs';

const port = parseInt(process.env.PORT ?? '3001', 10);
const cwd = initTerminalShell();

const corsOrigins = process.env.TERMINAL_CORS_ORIGIN?.split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const httpServer = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('RIO Terminal socket server\n');
});

const io = new Server(httpServer, {
  path: '/api/terminal/io',
  addTrailingSlash: false,
  cors: corsOrigins?.length
    ? { origin: corsOrigins, credentials: true }
    : { origin: true, credentials: true },
});

io.on('connection', (socket) => {
  console.log('[terminal] client connected', socket.id);
  try {
    createShellSession(socket, cwd);
  } catch (err) {
    socket.emit('output', `\r\n\x1b[31mFailed to start shell: ${err.message}\x1b[0m\r\n`);
    console.error('[terminal]', err);
  }
});

httpServer.listen(port, () => {
  console.log(`> Terminal socket server on http://0.0.0.0:${port}`);
  console.log(`> Socket path: /api/terminal/io`);
  console.log(`> Shell: ${resolveShell()} @ ${cwd}`);
  if (corsOrigins?.length) {
    console.log(`> CORS origins: ${corsOrigins.join(', ')}`);
  }
});
