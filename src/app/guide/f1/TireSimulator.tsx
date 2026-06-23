'use client'

import { useState } from 'react'

const TOTAL = 52

const TIRES = [
  { c: '#ff2e55', abbr: 'S', nm: '소프트',  en: 'SOFT',   pitLap: 15, maxLaps: 18 },
  { c: '#f4c13b', abbr: 'M', nm: '미디엄',  en: 'MEDIUM', pitLap: 27, maxLaps: 32 },
  { c: '#8fa0b0', abbr: 'H', nm: '하드',    en: 'HARD',   pitLap: 39, maxLaps: 46 },
]

const STRATEGIES: Record<string, { ok: boolean; label: string; accent: string; desc: string }> = {
  'S-M': {
    ok: false, label: '타이어 수명 초과', accent: '#E10600',
    desc: '소프트로 15랩 후 교체하면 미디엄이 37랩을 더 달려야 합니다. 미디엄 수명(최대 32랩)을 5랩 초과해 완주가 불가합니다. 소프트 다음엔 하드가 필요해요.',
  },
  'S-H': {
    ok: true, label: '공격 전략', accent: '#E10600',
    desc: '소프트로 초반 순위를 최대한 올린 뒤, 하드로 끝까지 버팁니다. 스타트와 첫 몇 코너에서 포지션을 확보하는 게 핵심입니다.',
  },
  'M-S': {
    ok: false, label: '타이어 수명 초과', accent: '#E10600',
    desc: '미디엄으로 27랩 후 교체하면 소프트가 25랩을 버텨야 합니다. 소프트 수명(최대 18랩)을 크게 초과해 레이스 후반에 타이어가 먼저 나가버립니다.',
  },
  'M-H': {
    ok: true, label: '균형 전략', accent: '#f4c13b',
    desc: '가장 많이 쓰이는 클래식 1스톱 조합입니다. 미디엄으로 안정적인 페이스를 유지하다 하드로 확실하게 마무리합니다.',
  },
  'H-S': {
    ok: true, label: '언더컷 전략', accent: '#b45cff',
    desc: '하드로 최대한 길게 달리다 소프트로 교체합니다. 새 타이어의 폭발적인 속도로 상대가 피트에 들어오기 전에 앞서 나오는 전략입니다.',
  },
  'H-M': {
    ok: true, label: '보수 전략', accent: '#8fa0b0',
    desc: '하드로 최대한 버티고 미디엄으로 마무리합니다. 타이어 관리에 능한 드라이버에게 유리한 꾸준한 페이스 전략입니다.',
  },
}

export default function TireSimulator() {
  const [s1, setS1] = useState<string | null>(null)
  const [s2, setS2] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const t1 = TIRES.find(t => t.abbr === s1)
  const t2 = TIRES.find(t => t.abbr === s2)
  const stratKey = t1 && t2 ? `${t1.abbr}-${t2.abbr}` : null
  const strat = stratKey ? STRATEGIES[stratKey] : null
  const remaining = t1 ? TOTAL - t1.pitLap : 0
  const step = !s1 ? 1 : !s2 ? 2 : 3

  const reset = () => { setS1(null); setS2(null) }

  return (
    <div style={{ marginTop: 32, border: '1px solid #E0D9CB', borderRadius: 4, overflow: 'hidden' }}>

      {/* Step header */}
      <div style={{ background: '#15120D', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[
            { n: 1, label: '출발 타이어 선택' },
            { n: 2, label: '교체 타이어 선택' },
            { n: 3, label: '전략 결과' },
          ].map(({ n, label }, i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: step > n ? '#2fd27a' : step === n ? '#E10600' : 'transparent',
                border: `1px solid ${step > n ? '#2fd27a' : step === n ? '#E10600' : '#3A352C'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: '#fff',
              }}>
                {step > n ? '✓' : n}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.04em', color: step === n ? '#fff' : '#4A3F35' }}>
                {label}
              </span>
              {i < 2 && <span style={{ color: '#3A352C', margin: '0 4px' }}>›</span>}
            </div>
          ))}
        </div>
        {s1 && (
          <button onClick={reset} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4A3F35', background: 'none', border: 'none', cursor: 'pointer' }}>
            RESET
          </button>
        )}
      </div>

      <div style={{ padding: 24 }}>

        {/* Tire selection grid */}
        {step < 3 && (
          <>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
              {step === 1
                ? '처음 장착할 타이어를 고르세요'
                : `${t1!.nm} 타이어로 ${t1!.pitLap}랩 후 피트스톱 — 교체 타이어를 선택하세요`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {TIRES.filter(t => step === 1 || t.abbr !== s1).map(t => (
                <button
                  key={t.abbr}
                  onClick={() => step === 1 ? setS1(t.abbr) : setS2(t.abbr)}
                  onMouseEnter={() => setHovered(t.abbr)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: hovered === t.abbr ? '#fff' : '#F2EFE8',
                    border: `2px solid ${t.c}`,
                    borderRadius: 4, padding: '20px 14px', textAlign: 'center',
                    cursor: 'pointer',
                    transform: hovered === t.abbr ? 'translateY(-3px)' : 'none',
                    boxShadow: hovered === t.abbr ? `0 6px 16px ${t.c}33` : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', margin: '0 auto 12px',
                    background: '#fff', border: `4px solid ${t.c}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 15, color: t.c,
                  }}>
                    {t.abbr}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.nm}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', marginTop: 2, letterSpacing: '0.08em' }}>{t.en}</div>
                  <div style={{ marginTop: 10, fontFamily: "'Space Mono', monospace", fontSize: 10, color: t.c, border: `1px solid ${t.c}`, padding: '3px 8px', display: 'inline-block', borderRadius: 2 }}>
                    최대 {t.maxLaps}랩
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Race bar */}
        {t1 && (
          <div style={{ marginTop: step === 3 ? 0 : 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A' }}>
              <span>LAP 1</span>
              <span>총 {TOTAL}랩 · 피트스톱 1회</span>
            </div>

            <div style={{ height: 32, background: '#E8E2D5', borderRadius: 2, position: 'relative', overflow: 'visible' }}>
              {/* Stint 1 */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${(t1.pitLap / TOTAL) * 100}%`,
                background: t1.c, display: 'flex', alignItems: 'center', paddingLeft: 10,
                transition: 'width 0.4s ease',
              }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: t1.abbr === 'H' ? '#15120D' : '#fff', whiteSpace: 'nowrap' }}>
                  {t1.abbr} · {t1.pitLap}랩
                </span>
              </div>

              {/* Stint 2 */}
              {t2 && (
                <div style={{
                  position: 'absolute', left: `${(t1.pitLap / TOTAL) * 100}%`, top: 0, bottom: 0,
                  width: `${(remaining / TOTAL) * 100}%`,
                  background: strat?.ok ? t2.c : 'rgba(225,6,0,0.35)',
                  display: 'flex', alignItems: 'center', paddingLeft: 8,
                  transition: 'all 0.4s ease',
                }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: (t2.abbr === 'H' && strat?.ok) ? '#15120D' : '#fff', whiteSpace: 'nowrap' }}>
                    {t2.abbr} · {remaining}랩{!strat?.ok ? ` (수명 초과!)` : ''}
                  </span>
                </div>
              )}

              {/* Pit marker */}
              <div style={{ position: 'absolute', left: `${(t1.pitLap / TOTAL) * 100}%`, top: -8, bottom: -8, width: 2, background: '#15120D', zIndex: 3 }}>
                <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontFamily: "'Space Mono', monospace", fontSize: 9, fontWeight: 700, color: '#15120D', whiteSpace: 'nowrap' }}>
                  PIT {t1.pitLap}랩
                </div>
              </div>
            </div>

            {/* Stint info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: t2 ? '1fr 1fr' : '1fr', gap: 10, marginTop: 14 }}>
              <div style={{ background: '#F2EFE8', borderLeft: `3px solid ${t1.c}`, padding: '10px 14px', borderRadius: 2 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: t1.c, fontWeight: 700, marginBottom: 4 }}>스틴트 1 · {t1.nm}</div>
                <div style={{ fontSize: 13, color: '#15120D' }}>{t1.pitLap}랩 주행 후 피트스톱</div>
              </div>
              {t2 && (
                <div style={{ background: '#F2EFE8', borderLeft: `3px solid ${strat?.ok ? t2.c : '#E10600'}`, padding: '10px 14px', borderRadius: 2 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: strat?.ok ? t2.c : '#E10600', fontWeight: 700, marginBottom: 4 }}>스틴트 2 · {t2.nm}</div>
                  <div style={{ fontSize: 13, color: '#15120D' }}>
                    {remaining}랩 필요 · 최대 {t2.maxLaps}랩
                    {!strat?.ok && (
                      <span style={{ color: '#E10600', marginLeft: 6, fontWeight: 700 }}>({remaining - t2.maxLaps}랩 부족)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Strategy result */}
        {step === 3 && strat && (
          <div style={{
            marginTop: 20,
            background: strat.ok ? '#15120D' : 'rgba(225,6,0,0.04)',
            border: `1px solid ${strat.ok ? '#2C271F' : 'rgba(225,6,0,0.2)'}`,
            borderRadius: 4, padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                background: strat.accent,
                color: strat.accent === '#8fa0b0' ? '#15120D' : '#fff',
                padding: '5px 12px', borderRadius: 2,
              }}>
                {strat.label}
              </span>
              {t1 && t2 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: t1.c, display: 'inline-block' }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: strat.ok ? '#C9C1B2' : '#4A4338' }}>{t1.nm}</span>
                  <span style={{ color: strat.ok ? '#4A3F35' : '#857A6A' }}>→</span>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: t2.c, display: 'inline-block' }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, color: strat.ok ? '#C9C1B2' : '#4A4338' }}>{t2.nm}</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: strat.ok ? '#C9C1B2' : '#4A4338', maxWidth: '56ch' }}>
              {strat.desc}
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: 16, fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: strat.ok ? '#C9C1B2' : '#E10600',
                background: 'none',
                border: `1px solid ${strat.ok ? '#3A352C' : 'rgba(225,6,0,0.35)'}`,
                padding: '9px 16px', cursor: 'pointer', borderRadius: 2,
              }}
            >
              다른 전략 시도하기
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
