import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: 23,
            fontWeight: 400,
            color: '#4fd87a',
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          F
        </div>
      </div>
    ),
    { ...size },
  )
}
