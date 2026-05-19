import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #1a1028 0%, #0f0f14 100%)',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
            color: '#0f0f14',
            fontSize: 11,
            fontWeight: 800,
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          R
        </div>
      </div>
    ),
    { ...size },
  );
}
