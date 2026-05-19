import { ImageResponse } from 'next/og';
import { SEO_TAGLINE } from '@/lib/seo/site';

export const alt = 'RIO Terminal — terminal online, sync local terminal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f0f14 0%, #1a1028 40%, #241b2f 100%)',
          padding: 64,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f0f14',
              fontSize: 28,
              fontWeight: 800,
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            R
          </div>
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 700, color: '#e4e4ef' }}>
            RIO Terminal
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#f4f4f5',
            }}
          >
            Terminal online.
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#a78bfa',
            }}
          >
            Sync local terminal.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 22,
            color: 'rgba(228,228,239,0.65)',
          }}
        >
          {SEO_TAGLINE} — real shell in your browser.
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 32,
          }}
        >
          {['RIO Terminal', 'terminal online', 'sync local terminal'].map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                padding: '8px 16px',
                borderRadius: 999,
                border: '1px solid rgba(167,139,250,0.35)',
                background: 'rgba(167,139,250,0.12)',
                color: '#c4b5fd',
                fontSize: 16,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
