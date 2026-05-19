# RIO Terminal

**Terminal online · Sync local terminal**

RIO Terminal is a modern browser terminal that syncs with your local shell. Run zsh, npm, and git with a real PTY session — beautiful UI, themes, and animations.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev   # Next.js + Socket.IO + shell (server.mjs)
```

Open [http://localhost:3000/en](http://localhost:3000/en) or [http://localhost:3000/en/terminal](http://localhost:3000/en/terminal).

## SEO assets

| Asset | Path |
|-------|------|
| Favicon (SVG) | `/favicon.svg` |
| Favicon (PNG) | `/icon` |
| Apple touch icon | `/apple-icon` |
| Open Graph / Twitter | `/opengraph-image` (1200×630) |

Set `NEXT_PUBLIC_APP_URL` in production so OG URLs resolve correctly.

## Deploying to Vercel

**The interactive terminal does not run on Vercel serverless.** Vercel only builds the Next.js UI (`next build`). The shell needs a long-running Node server with WebSockets and PTY support.

### Recommended setup (Vercel + backend)

1. **Frontend** — Deploy this repo to Vercel as usual (`next build`).
2. **Terminal backend** — Deploy the socket server on [Railway](https://railway.app), [Fly.io](https://fly.io), Render, or Docker:

   ```bash
   npm run terminal:server
   ```

   Default port `3001`, path `/api/terminal/io`.

3. **Vercel env** (Settings → Environment Variables):

   | Variable | Example |
   |----------|---------|
   | `NEXT_PUBLIC_TERMINAL_SOCKET_URL` | `https://your-app.up.railway.app` |
   | `NEXT_PUBLIC_APP_URL` | `https://rio-terminal.vercel.app` |

4. **Backend env** on Railway/Fly:

   | Variable | Example |
   |----------|---------|
   | `TERMINAL_CORS_ORIGIN` | `https://rio-terminal.vercel.app` |
   | `TERMINAL_CWD` | `~` (optional, default is home directory) |

5. Redeploy both apps.

### Full stack (Docker / VPS)

Use `npm run dev` or Docker (`docker compose up`) — `server.mjs` serves Next.js and the terminal on one port. No `NEXT_PUBLIC_TERMINAL_SOCKET_URL` needed.
