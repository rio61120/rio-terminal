/** Socket.IO client options for the browser terminal. */

const SOCKET_PATH = '/api/terminal/io';

/** Remote terminal backend (required when the Next app is on Vercel). */
export function getTerminalSocketUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_TERMINAL_SOCKET_URL?.trim();
  return url || undefined;
}

export function getTerminalSocketPath(): string {
  return SOCKET_PATH;
}

export function isVercelHostedFrontend(): boolean {
  return process.env.NEXT_PUBLIC_VERCEL === '1';
}

export function isTerminalBackendConfigured(): boolean {
  if (getTerminalSocketUrl()) return true;
  return !isVercelHostedFrontend();
}

export type TerminalConnectionHint = {
  lines: string[];
};

/** User-facing hints when Socket.IO cannot connect. */
export function getTerminalConnectionHint(): TerminalConnectionHint {
  if (isVercelHostedFrontend() && !getTerminalSocketUrl()) {
    return {
      lines: [
        '⚠ Terminal server is not available on Vercel alone.',
        '',
        'Vercel hosts the UI only — the shell runs on a separate Node server.',
        '',
        '1. Deploy the backend: npm run terminal:server',
        '   (Railway, Fly.io, Render, or Docker)',
        '2. In Vercel → Settings → Environment Variables, set:',
        '   NEXT_PUBLIC_TERMINAL_SOCKET_URL=https://your-backend.example.com',
        '3. On the backend, set TERMINAL_CORS_ORIGIN=https://rio-terminal.vercel.app',
        '4. Redeploy both apps',
      ],
    };
  }

  if (getTerminalSocketUrl()) {
    return {
      lines: [
        '⚠ Cannot reach the terminal backend.',
        '',
        `Configured: ${getTerminalSocketUrl()}`,
        'Check that the server is running and TERMINAL_CORS_ORIGIN includes this site.',
      ],
    };
  }

  return {
    lines: [
      '⚠ Terminal server not connected.',
      '',
      'Run the app with the custom server (includes Socket.IO + shell):',
      '  bun run dev   or   npm run dev',
    ],
  };
}
