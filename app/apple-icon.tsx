import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0b1710',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 38,
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: 118,
            fontWeight: 400,
            color: '#4fd87a',
            lineHeight: 1,
            marginTop: 10,
          }}
        >
          F
        </div>
      </div>
    ),
    { ...size },
  )
}
