import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0b1710',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 80px',
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: 44,
            color: '#4fd87a',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          Furvo
        </div>

        {/* Hero copy */}
        <div
          style={{
            marginTop: 56,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: 82,
              color: '#f2f7f2',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            La porra del
          </div>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: 96,
              color: '#4fd87a',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
            }}
          >
            Mundial &#39;26
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 18,
                color: '#7a9080',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Liga privada con tus amigos
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 15,
                color: '#4b6655',
                letterSpacing: '0.1em',
              }}
            >
              furvo.com
            </div>
          </div>
          <div style={{ fontSize: 64 }}>⚽</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
