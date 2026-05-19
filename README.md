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
