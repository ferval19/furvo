import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function LigaOGImage({ params }: { params: { id: string } }) {
  let leagueName = 'Liga privada'
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('leagues')
      .select('name')
      .eq('invite_code', params.id)
      .single()
    if (data?.name) leagueName = data.name
  } catch {}

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
        {/* Wordmark + badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: 38,
              color: '#4fd87a',
              lineHeight: 1,
            }}
          >
            Furvo
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 15,
              color: '#d4a847',
              background: '#2a2210',
              border: '1px solid #3d3215',
              borderRadius: 999,
              padding: '6px 16px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Mundial &#39;26
          </div>
        </div>

        {/* League name */}
        <div
          style={{
            marginTop: 60,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 18,
              color: '#7a9080',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            Liga privada · Porra del Mundial
          </div>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontSize: leagueName.length > 20 ? 64 : 82,
              color: '#f2f7f2',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            {leagueName}
          </div>
        </div>

        {/* Footer */}
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
              gap: 5,
            }}
          >
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 16,
                color: '#7a9080',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Únete con código
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 32,
                color: '#4fd87a',
                letterSpacing: '0.25em',
                fontWeight: 700,
              }}
            >
              {params.id}
            </div>
          </div>
          <div style={{ fontSize: 56 }}>⚽</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
