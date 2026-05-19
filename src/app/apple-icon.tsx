import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #1a1028 0%, #0f0f14 55%, #241b2f 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 20,
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div
              key={c}
              style={{ width: 14, height: 14, borderRadius: 99, background: c }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            background: 'linear-gradient(90deg, #c4b5fd, #a78bfa, #7c3aed)',
            backgroundClip: 'text',
            color: 'transparent',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: -2,
          }}
        >
          RIO
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 18,
            color: 'rgba(228,228,239,0.55)',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          }}
        >
          Terminal
        </div>
      </div>
    ),
    { ...size },
  );
}
