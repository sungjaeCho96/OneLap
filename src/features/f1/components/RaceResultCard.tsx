import type { F1RaceResult } from '@/features/f1/api'

const RED = '#E10600'

const TEAM_COLORS: Record<string, string> = {
  'Mercedes': '#00D2BE',
  'Ferrari': '#E8002D',
  'Red Bull': '#3671C6',
  'McLaren': '#FF8000',
  'Aston Martin': '#358C75',
  'Alpine F1 Team': '#0093CC',
  'Williams': '#64C4FF',
  'RB F1 Team': '#6692FF',
  'Haas F1 Team': '#B6BABD',
  'Audi': '#C5B830',
  'Cadillac F1 Team': '#B40000',
}

function teamColor(team: string): string {
  return TEAM_COLORS[team] ?? '#857A6A'
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

function PosChangeBadge({ change }: { change: number }) {
  if (change === 0) return (
    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A' }}>—</span>
  )
  const up = change > 0
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: 11,
      fontWeight: 700,
      color: up ? '#2fd27a' : '#ff4d4d',
    }}>
      {up ? `▲${change}` : `▼${Math.abs(change)}`}
    </span>
  )
}

interface Props {
  result: F1RaceResult
}

export default function RaceResultCard({ result }: Props) {
  const podium = result.results.slice(0, 3)
  const rest = result.results.slice(3, 10)
  const flDriver = result.results.find((r) => r.fastestLap)

  return (
    <section style={{ background: '#F2EFE8', borderBottom: '1px solid #E0D9CB', padding: '64px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 36, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: RED, marginBottom: 10 }}>
              Last Race · Round {result.round}
            </div>
            <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
              {result.raceName}
            </h2>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#857A6A', marginTop: 10 }}>
              {result.locality}, {result.country} · {formatDate(result.date)}
            </div>
          </div>
          {flDriver && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #E0D9CB', borderRadius: 4, padding: '10px 16px', flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', letterSpacing: '0.1em', marginBottom: 3 }}>FASTEST LAP</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700 }}>
                  {flDriver.code}
                  <span style={{ fontWeight: 400, color: '#857A6A', marginLeft: 6 }}>{flDriver.team}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 포디움 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 2 }}>
          {podium.map((d, i) => {
            const isWinner = i === 0
            const tc = teamColor(d.team)
            return (
              <div key={d.code} style={{
                background: isWinner ? '#15120D' : '#fff',
                color: isWinner ? '#F2EFE8' : '#15120D',
                padding: '24px 20px',
                borderTop: `3px solid ${isWinner ? RED : tc}`,
                position: 'relative',
              }}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 56, lineHeight: 0.85, opacity: 0.08, position: 'absolute', right: 16, top: 14 }}>
                  P{d.pos}
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: isWinner ? RED : '#857A6A', marginBottom: 12 }}>
                  P{d.pos}
                </div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 22 }}>{d.code}</span>
                  {d.fastestLap && (
                    <span style={{ marginLeft: 8, fontSize: 12, color: '#b45cff' }}>⚡FL</span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: isWinner ? '#C9C1B2' : '#4A4338', marginBottom: 12, lineHeight: 1.3 }}>
                  {d.firstName} {d.lastName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: tc, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: isWinner ? '#9A9081' : '#857A6A' }}>{d.team}</span>
                </div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, marginTop: 14, color: isWinner ? '#F2EFE8' : '#15120D' }}>
                  {i === 0 ? d.time : d.time ? `+${d.time}` : d.status}
                </div>
                <div style={{ marginTop: 8 }}>
                  <PosChangeBadge change={d.posChange} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: isWinner ? '#6b6457' : '#C9C1B2', marginLeft: 5 }}>
                    (그리드 P{d.grid})
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* P4~P10 결과 테이블 */}
        <div style={{ background: '#fff', border: '1px solid #E0D9CB' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '36px 52px 1fr 1fr 80px 56px', gap: 0, padding: '8px 16px', borderBottom: '1px solid #E0D9CB' }}>
            {['POS', 'GRD', '드라이버', '팀', '기록', '변동'].map((h) => (
              <span key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', letterSpacing: '0.08em' }}>{h}</span>
            ))}
          </div>
          {rest.map((d) => {
            const tc = teamColor(d.team)
            const isRetired = d.status === 'Retired' || d.status === 'Did not start'
            return (
              <div key={d.code} style={{
                display: 'grid',
                gridTemplateColumns: '36px 52px 1fr 1fr 80px 56px',
                gap: 0,
                alignItems: 'center',
                padding: '10px 16px',
                borderBottom: '1px solid #F0EBE3',
                opacity: isRetired ? 0.5 : 1,
              }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: '#15120D' }}>P{d.pos}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A' }}>{d.grid}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700 }}>
                  {d.code}
                  {d.fastestLap && <span style={{ marginLeft: 5, fontSize: 10, color: '#b45cff' }}>⚡</span>}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: tc, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#4A4338', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.team}</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#4A4338' }}>
                  {d.time ? `+${d.time}` : d.status}
                </span>
                <PosChangeBadge change={d.posChange} />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
