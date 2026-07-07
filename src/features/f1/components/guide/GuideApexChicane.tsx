import { SecHead, Hl } from './primitives'

// 트랙 도해 공통 팔레트 — 라이트 테마 카드 위에서 보이도록 다크 아스팔트 대신 중간톤 그레이 트랙 사용
const TRACK_EDGE = '#4A4338'
const TRACK_FILL = '#857A6A'
const CENTER_DASH = '#F2EFE8'
const RED = '#E10600' // 커브(연석) 스트라이프 · 에이펙스 점
const LINE = '#15120D' // 레이싱 라인 · 방향 화살표

// 트랙(그레이)과 카드 배경(크림) 어느 쪽에 겹쳐도 읽히도록 흰 헤일로를 텍스트 뒤에 깐다
const labelHalo = {
  paintOrder: 'stroke' as const,
  stroke: '#F2EFE8',
  strokeWidth: 4,
  strokeLinejoin: 'round' as const,
}

function ApexDiagram() {
  return (
    <svg viewBox="0 0 460 360" role="img" aria-label="하나의 코너와 에이펙스를 지나는 레이싱 라인" className="w-full h-auto block">
      <path d="M 40 66 L 250 66 Q 384 66 384 200 L 384 356" fill="none" stroke={TRACK_EDGE} strokeWidth={82} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 40 66 L 250 66 Q 384 66 384 200 L 384 356" fill="none" stroke={TRACK_FILL} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 40 66 L 250 66 Q 384 66 384 200 L 384 356" fill="none" stroke={CENTER_DASH} strokeWidth={1.5} strokeDasharray="10 12" opacity={0.5} />

      <path d="M 288 96 Q 320 112 345 150 Q 356 168 360 186" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="butt" />
      <path d="M 288 96 Q 320 112 345 150 Q 356 168 360 186" fill="none" stroke={RED} strokeWidth={9} strokeDasharray="9 9" strokeLinecap="butt" />

      <path
        d="M 40 40 Q 250 40 326 148 Q 384 232 414 356"
        fill="none"
        stroke={LINE}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={900}
        strokeDashoffset={900}
      >
        <animate attributeName="stroke-dashoffset" from="900" to="0" dur="1.4s" fill="freeze" />
      </path>
      <path d="M 70 40 l -14 -6 l 4 6 l -4 6 z" fill={LINE} />

      <circle cx={326} cy={148} r={12} fill="none" stroke={RED} strokeWidth={2} opacity={0.5}>
        <animate attributeName="r" from="12" to="20" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from=".5" to="0" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={326} cy={148} r={8} fill={RED} />

      <text x={40} y={26} fill="#4A4338" className="text-[12.5px] font-light font-noto" style={labelHalo}>진입 (넓게)</text>
      <text x={326} y={148} dx={18} dy={-14} fill={LINE} className="text-[15px] font-bold font-noto" style={labelHalo}>에이펙스</text>
      <text x={326} y={148} dx={18} dy={4} fill="#4A4338" className="text-[12.5px] font-light font-noto" style={labelHalo}>이 점을 스치듯 통과</text>
      <text x={414} y={350} dx={-96} fill="#4A4338" className="text-[12.5px] font-light font-noto" textAnchor="end" style={labelHalo}>탈출 (넓게)</text>
    </svg>
  )
}

function ChicaneDiagram() {
  return (
    <svg viewBox="0 0 460 360" role="img" aria-label="좌우로 꺾이는 시케인과 두 개의 에이펙스" className="w-full h-auto block">
      <path d="M 30 258 L 150 258 C 208 258 214 128 272 128 L 440 128" fill="none" stroke={TRACK_EDGE} strokeWidth={82} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 30 258 L 150 258 C 208 258 214 128 272 128 L 440 128" fill="none" stroke={TRACK_FILL} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 30 258 L 150 258 C 208 258 214 128 272 128 L 440 128" fill="none" stroke={CENTER_DASH} strokeWidth={1.5} strokeDasharray="10 12" opacity={0.5} />

      <path d="M 150 296 Q 185 296 205 276" fill="none" stroke="#fff" strokeWidth={9} />
      <path d="M 150 296 Q 185 296 205 276" fill="none" stroke={RED} strokeWidth={9} strokeDasharray="9 9" />
      <path d="M 262 90 Q 292 90 322 90" fill="none" stroke="#fff" strokeWidth={9} />
      <path d="M 262 90 Q 292 90 322 90" fill="none" stroke={RED} strokeWidth={9} strokeDasharray="9 9" />

      <path
        d="M 30 262 L 150 262 Q 196 260 214 236 Q 240 202 258 168 Q 276 134 322 132 L 440 132"
        fill="none"
        stroke={LINE}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={1000}
        strokeDashoffset={1000}
      >
        <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="1.6s" fill="freeze" />
      </path>
      <path d="M 60 262 l -14 -6 l 4 6 l -4 6 z" fill={LINE} />

      <circle cx={205} cy={252} r={8} fill={RED} />
      <circle cx={205} cy={252} r={12} fill="none" stroke={RED} strokeWidth={2} opacity={0.5}>
        <animate attributeName="r" from="12" to="19" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from=".5" to="0" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={272} cy={104} r={8} fill={RED} />
      <circle cx={272} cy={104} r={12} fill="none" stroke={RED} strokeWidth={2} opacity={0.5}>
        <animate attributeName="r" from="12" to="19" dur="1.6s" begin=".4s" repeatCount="indefinite" />
        <animate attributeName="opacity" from=".5" to="0" dur="1.6s" begin=".4s" repeatCount="indefinite" />
      </circle>

      <text x={35} y={300} fill="#4A4338" className="text-[12.5px] font-light font-noto" style={labelHalo}>직선에서 진입 →</text>
      <text x={205} y={252} dx={-14} dy={34} fill={LINE} className="text-[12.5px] font-bold font-noto" textAnchor="middle" style={labelHalo}>에이펙스 ①</text>
      <text x={272} y={104} dx={6} dy={-16} fill={LINE} className="text-[12.5px] font-bold font-noto" style={labelHalo}>에이펙스 ②</text>
      <text x={360} y={132} dy={-30} fill="#4A4338" className="text-[12.5px] font-light font-noto" style={labelHalo}>← 다시 직선</text>
    </svg>
  )
}

function ComparePanel({
  accentColor,
  tag,
  title,
  titleKo,
  kind,
  diagram,
  desc,
}: {
  accentColor: string
  tag: string
  title: string
  titleKo: string
  kind: string
  diagram: React.ReactNode
  desc: React.ReactNode
}) {
  return (
    <div className="bg-white border border-border rounded-lg p-6" style={{ borderTop: `4px solid ${accentColor}` }}>
      <span
        className="font-mono text-[10px] tracking-[0.16em] uppercase border border-border rounded-sm px-2 py-1 inline-block"
        style={{ color: accentColor }}
      >
        {tag}
      </span>
      <div className="mt-3.5">
        <div className="font-archivo font-black text-2xl uppercase tracking-wide leading-none" style={{ color: accentColor }}>
          {title}
        </div>
        <div className="font-noto font-bold text-lg mt-1">{titleKo}</div>
      </div>
      <div className="font-mono text-[11px] mt-2 tracking-[0.02em]" style={{ color: accentColor }}>{kind}</div>
      <div className="mt-3.5">{diagram}</div>
      <p className="text-sm text-text-mid leading-[1.6] mt-1.5">{desc}</p>
    </div>
  )
}

const COMPARE_ROWS: { label: string; apex: React.ReactNode; chicane: React.ReactNode }[] = [
  { label: '정체', apex: <>코너 안쪽의 한 <Hl>점</Hl></>, chicane: <>좌우로 꺾이는 <Hl>구간</Hl></> },
  { label: '어디에', apex: '모든 코너에 존재', chicane: '주로 직선 중간에 인위적으로 설치' },
  { label: '목적', apex: '빠른 코너 탈출의 기준점', chicane: '차 속도를 강제로 줄이기 위함' },
  { label: '개수', apex: '코너당 1개 (잡는 위치는 선택)', chicane: '그 안에 코너·에이펙스가 여러 개' },
  { label: '비유', apex: "커브를 도는 '순간'의 한 점", chicane: "여러 커브가 묶인 '지그재그 골목'" },
]

export default function GuideApexChicane() {
  return (
    <section className="py-[72px] border-t border-border">
      <div className="max-w-[1280px] mx-auto px-6">
        <SecHead
          num="06-B"
          title="에이펙스 vs 시케인"
          sub="둘은 '코너를 부르는 다른 이름'이 아니에요. 에이펙스는 코너 안의 한 '점', 시케인은 좌우로 꺾이는 '구간'입니다. 층위가 다르죠 — 시케인 안에 에이펙스가 여러 개 들어 있어요."
        />

        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
          <ComparePanel
            accentColor={RED}
            tag="A Point · 지점"
            title="APEX"
            titleKo="에이펙스 (정점)"
            kind="코너 안쪽의 가장 가까운 한 점"
            diagram={<ApexDiagram />}
            desc={
              <>
                코너에 <Hl>넓게 진입</Hl>해 안쪽 정점을 <Hl>살짝 스치고</Hl> 다시 넓게 빠져나가는 게 기본. 이 정점이
                에이펙스예요. <Hl>모든 코너</Hl>에 하나씩 있고, 어디를 정점으로 잡느냐가 탈출 속도를 가릅니다.
              </>
            }
          />
          <ComparePanel
            accentColor="#E8842B"
            tag="A Section · 구간"
            title="CHICANE"
            titleKo="시케인"
            kind="차를 늦추려 만든 좌우 꺾임 구간"
            diagram={<ChicaneDiagram />}
            desc={
              <>
                보통 직선 중간에 <Hl>속도를 강제로 줄이려고</Hl> 설치해요. 좌우로 빠르게 꺾이는 <Hl>S자 구간</Hl>이라,
                그 안에 <Hl>코너가 둘 이상</Hl> — 즉 <Hl>에이펙스도 여러 개</Hl>죠. 최대한 곧게 잇는 게 관건이에요.
              </>
            }
          />
        </div>

        <div className="flex flex-wrap gap-4 mt-5 px-5 py-4 bg-bg-alt border border-border rounded text-[13px] text-text-muted">
          <span className="flex items-center gap-2">
            <span className="w-[22px] h-[3px] rounded-sm inline-block" style={{ background: LINE }} /> 레이싱 라인 (이상적인 주행 궤적)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: RED, boxShadow: `0 0 6px ${RED}` }} /> 에이펙스 (정점)
          </span>
          <span className="flex items-center gap-2">
            <span
              className="w-[22px] h-[9px] rounded-sm inline-block"
              style={{ background: `repeating-linear-gradient(90deg, ${RED} 0 5px, #fff 5px 10px)` }}
            />
            커브 (연석 · 코너 안쪽 경계)
          </span>
        </div>

        <div className="mt-5 bg-[rgba(225,6,0,0.06)] border border-[rgba(225,6,0,0.25)] rounded px-[18px] py-4">
          <h4 className="text-[15px] font-bold text-accent mb-1.5">핵심 관계</h4>
          <p className="text-sm text-text-mid leading-[1.65]">
            둘은 경쟁 관계가 아니라 <Hl>포함 관계</Hl>예요. <Hl>에이펙스는 &apos;점&apos;</Hl>,{' '}
            <Hl>시케인은 &apos;구간&apos;</Hl>. 시케인은 코너 여러 개로 이뤄진 구간이니, <Hl>하나의 시케인 안에 에이펙스가 여러 개</Hl>{' '}
            들어 있습니다. 위 그림의 빨간 점 두 개가 바로 그거예요.
          </p>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse text-sm min-w-[420px]">
            <thead>
              <tr>
                <th className="text-left font-mono text-[11px] tracking-[0.08em] uppercase text-text-muted font-normal px-3.5 py-3 border-b border-border">구분</th>
                <th className="text-left font-mono text-[11px] tracking-[0.08em] uppercase font-normal px-3.5 py-3 border-b border-border" style={{ color: RED }}>에이펙스</th>
                <th className="text-left font-mono text-[11px] tracking-[0.08em] uppercase font-normal px-3.5 py-3 border-b border-border" style={{ color: '#E8842B' }}>시케인</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label}>
                  <td className="text-text-muted font-light px-3.5 py-3.5 border-b border-border align-top w-[26%]">{row.label}</td>
                  <td className="text-text-mid font-light px-3.5 py-3.5 border-b border-border align-top">{row.apex}</td>
                  <td className="text-text-mid font-light px-3.5 py-3.5 border-b border-border align-top">{row.chicane}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
