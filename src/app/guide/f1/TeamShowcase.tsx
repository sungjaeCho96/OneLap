'use client'

import { useState } from 'react'

const RED = '#E10600'

interface Driver {
  name: string
  num: string
}

interface Team {
  id: string
  name: string
  fullName: string
  color: string
  country: string
  flag: string
  logoUrl: string
  abbr: string
  drivers: Driver[]
  trait: string
  watchPoint: string
}

const TEAMS: Team[] = [
  {
    id: 'redbull',
    name: '레드불 레이싱',
    fullName: 'ORACLE RED BULL RACING',
    color: '#3671C6',
    country: '오스트리아',
    flag: '🇦🇹',
    logoUrl: 'https://media.formula1.com/image/upload/c_fit,h_64/q_auto/v1740000001/common/f1/2025/redbullracing/2025redbullracinglogo.webp',
    abbr: 'RBR',
    drivers: [
      { name: '막스 베르스타펜', num: '3' },
      { name: '아이작 하자르', num: '6' },
    ],
    trait: '에너지드링크 회사 레드불이 2005년 재규어 레이싱을 인수해 만든 팀으로 베텔·베르스타펜 두 명의 월드 챔피언을 탄생시켰습니다. 2026년엔 혼다 파워유닛과 결별하고 포드와 함께 만든 첫 자체 파워유닛으로, 새 규정 첫해를 정면 돌파합니다.',
    watchPoint: '챔피언에게 주어지는 1번을 노리스에게 내준 베르스타펜이 #3을 달고 반격합니다. 18세 최연소 우승, 한 시즌 19승의 기록 보유자죠. 21살 신예 하자르가 그 옆자리를 버텨낼지도 관전 포인트입니다.',
  },
  {
    id: 'ferrari',
    name: '페라리',
    fullName: 'SCUDERIA FERRARI',
    color: '#E8002D',
    country: '이탈리아',
    flag: '🇮🇹',
    logoUrl: 'https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/ferrari/2026ferrarilogo.webp',
    abbr: 'SF',
    drivers: [
      { name: '샤를 르클레르', num: '16' },
      { name: '루이스 해밀턴', num: '44' },
    ],
    trait: 'F1 창립 이래 한 번도 빠지지 않은 유일한 팀이자 가장 많은 우승을 기록한 명문. 2025년 7회 챔피언 해밀턴이 합류해 르클레르와 슈퍼팀을 이뤘습니다.',
    watchPoint: '전 세계에서 가장 팬이 많은 팀(티포시). 빨간 차가 앞서면 관중석이 들썩입니다. 해밀턴 vs 르클레르 팀 내 신경전이 시즌 내내 이어집니다.',
  },
  {
    id: 'mercedes',
    name: '메르세데스',
    fullName: 'MERCEDES-AMG PETRONAS',
    color: '#27F4D2',
    country: '독일',
    flag: '🇩🇪',
    logoUrl: 'https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedeslogo.webp',
    abbr: 'MER',
    drivers: [
      { name: '조지 러셀', num: '63' },
      { name: '키미 안토넬리', num: '12' },
    ],
    trait: '2014~2021 터보 하이브리드 시대를 지배한 8연속 컨스트럭터 챔피언. 해밀턴이 떠난 뒤 러셀이 리더가 됐고, 18세 신성 안토넬리가 미래를 짊어집니다.',
    watchPoint: '2026 엔진 규정 변화에서 메르세데스 파워유닛이 가장 강할 거란 예측이 많아요. 엔진 경쟁력이 부활하는지 지켜보세요.',
  },
  {
    id: 'mclaren',
    name: '맥라렌',
    fullName: 'McLAREN FORMULA 1 TEAM',
    color: '#FF8000',
    country: '영국',
    flag: '🇬🇧',
    logoUrl: 'https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarenlogo.webp',
    abbr: 'MCL',
    drivers: [
      { name: '랜도 노리스', num: '1' },
      { name: '오스카 피아스트리', num: '81' },
    ],
    trait: '2024~2025 컨스트럭터 챔피언을 거머쥔 현재의 최강팀. 노리스와 피아스트리, 둘 다 우승 가능한 젊은 듀오로 가장 균형 잡힌 라인업을 자랑합니다.',
    watchPoint: '팀메이트 둘이 실력이 비슷해 매 경기 진짜 싸움이 벌어집니다. 같은 차로 누가 더 빠른지 보는 가장 순수한 재미가 있어요.',
  },
  {
    id: 'aston',
    name: '애스턴 마틴',
    fullName: 'ASTON MARTIN ARAMCO',
    color: '#229971',
    country: '영국',
    flag: '🇬🇧',
    logoUrl: 'https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/astonmartin/2026astonmartinlogo.webp',
    abbr: 'AMR',
    drivers: [
      { name: '페르난도 알론소', num: '14' },
      { name: '랜스 스트롤', num: '18' },
    ],
    trait: '2026년 전설적 설계자 에이드리언 뉴이가 합류하고 혼다 워크스 엔진을 쓰는 다크호스. 2회 챔피언 알론소의 노련함이 팀을 끌어올립니다.',
    watchPoint: '알론소는 44세에도 가장 영리한 드라이버로 꼽혀요. 뉴이의 신차가 통하면 단숨에 우승권으로 도약할 수 있는 팀입니다.',
  },
  {
    id: 'alpine',
    name: '알핀',
    fullName: 'BWT ALPINE F1 TEAM',
    color: '#0093CC',
    country: '프랑스',
    flag: '🇫🇷',
    logoUrl: 'https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/alpine/2026alpinelogo.webp',
    abbr: 'ALP',
    drivers: [
      { name: '피에르 가슬리', num: '10' },
      { name: '프랑코 콜라핀토', num: '43' },
    ],
    trait: '르노 그룹이 소유한 프랑스 국적 팀. 2026년부터 자체 엔진을 포기하고 메르세데스 엔진으로 전환해 중위권 반등을 노립니다.',
    watchPoint: '프랑스 유일의 팩토리 팀이라는 자존심. 가슬리가 중위권에서 보여주는 알뜰한 포인트 사냥을 지켜보세요.',
  },
  {
    id: 'williams',
    name: '윌리엄스',
    fullName: 'WILLIAMS RACING',
    color: '#64C4FF',
    country: '영국',
    flag: '🇬🇧',
    logoUrl: 'https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000001/common/f1/2026/williams/2026williamslogo.webp',
    abbr: 'WIL',
    drivers: [
      { name: '알렉스 알본', num: '23' },
      { name: '카를로스 사인츠', num: '55' },
    ],
    trait: '9회 컨스트럭터 챔피언의 유서 깊은 명문이지만 최근엔 하위권. 2025년 페라리 출신 사인츠를 영입하며 중위권 복귀에 시동을 걸었습니다.',
    watchPoint: '한때 세나가 몰던 전통의 강호. 사인츠가 옛 명문을 되살릴 수 있을지가 시즌 내내 흥미로운 스토리입니다.',
  },
  {
    id: 'rb',
    name: '레이싱 불스',
    fullName: 'VISA CASH APP RB',
    color: '#6692FF',
    country: '이탈리아',
    flag: '🇮🇹',
    logoUrl: 'https://media.formula1.com/image/upload/c_fit,h_64/q_auto/v1740000001/common/f1/2026/racingbulls/2026racingbullslogo.webp',
    abbr: 'RB',
    drivers: [
      { name: '리암 로슨', num: '30' },
      { name: '아비드 린드블라드', num: '41' },
    ],
    trait: '레드불의 자매팀(B팀). 레드불 본팀으로 올라갈 영 드라이버를 키우는 육성소 역할을 합니다. 본팀과 부품을 일부 공유해요.',
    watchPoint: '여기서 잘하면 레드불 본팀으로 승격됩니다. 미래의 스타가 누구인지 가장 먼저 볼 수 있는 팀이에요.',
  },
  {
    id: 'haas',
    name: '하스',
    fullName: 'MoneyGram HAAS F1 TEAM',
    color: '#B6BABD',
    country: '미국',
    flag: '🇺🇸',
    logoUrl: 'https://media.formula1.com/image/upload/c_fit,h_64/q_auto/v1740000001/common/f1/2026/haas/2026haaslogo.webp',
    abbr: 'HAA',
    drivers: [
      { name: '에스테반 오콘', num: '31' },
      { name: '올리버 베어먼', num: '87' },
    ],
    trait: '가장 작은 예산으로 운영되는 미국 팀. 페라리의 엔진과 다수 부품을 사 와 효율적으로 차를 만드는 알뜰 운영의 대명사입니다.',
    watchPoint: '적은 돈으로 거대 팀들과 싸우는 언더독. 가끔 터지는 깜짝 입상이 이 팀을 응원하게 만드는 매력이에요.',
  },
  {
    id: 'audi',
    name: '아우디',
    fullName: 'AUDI F1 TEAM (ex-SAUBER)',
    color: '#F50537',
    country: '독일',
    flag: '🇩🇪',
    logoUrl: 'https://media.formula1.com/image/upload/c_fit,h_64/q_auto/v1740000001/common/f1/2026/audi/2026audilogo.webp',
    abbr: 'AUD',
    drivers: [
      { name: '니코 휠켄베르크', num: '27' },
      { name: '가브리엘 보르톨레토', num: '5' },
    ],
    trait: '기존 킥 자우버가 2026년부터 완전한 아우디 워크스 팀으로 전환. 독일 자동차 거인이 자체 엔진을 들고 F1에 정식 진입하는 빅 프로젝트입니다.',
    watchPoint: '대형 제조사의 신규 진입은 보통 몇 년의 적응기가 필요해요. 아우디가 얼마나 빨리 경쟁력을 갖추는지가 장기 관전 포인트.',
  },
  {
    id: 'cadillac',
    name: '캐딜락',
    fullName: 'CADILLAC F1 TEAM',
    color: '#8B0000',
    country: '미국',
    flag: '🇺🇸',
    logoUrl: 'https://media.formula1.com/image/upload/c_fit,h_64/q_auto/v1740000001/common/f1/2026/cadillac/2026cadillaclogo.webp',
    abbr: 'CAD',
    drivers: [
      { name: '세르히오 페레스', num: '11' },
      { name: '발테리 보타스', num: '77' },
    ],
    trait: '2026년 새로 합류하는 11번째 팀. GM 캐딜락 브랜드로 참가하며 베테랑 페레스와 보타스를 영입해 신생팀의 약점인 경험 부족을 메웠습니다.',
    watchPoint: '완전한 신생팀이 첫 시즌 어떻게 살아남는지 보는 것 자체가 역사적인 장면. 베테랑 듀오의 노련함이 핵심입니다.',
  },
]

export default function TeamShowcase() {
  const [activeId, setActiveId] = useState<string>('redbull')
  const [imgError, setImgError] = useState<Record<string, boolean>>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeTeam = TEAMS.find((t) => t.id === activeId) ?? TEAMS[0]

  return (
    <div style={{ marginTop: 32, border: '1px solid #E0D9CB', borderRadius: 4, overflow: 'hidden' }}>

      {/* 헤더 */}
      <div style={{ background: '#15120D', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>2026 GRID</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#4A3F35' }}>·</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#4A3F35', letterSpacing: '0.06em' }}>11 TEAMS</span>
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#4A3F35', letterSpacing: '0.06em' }}>팀 로고를 눌러 상세 정보 확인</span>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* 로고 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {TEAMS.map((team) => {
            const isActive = team.id === activeId
            const isHovered = hoveredId === team.id
            return (
              <button
                key={team.id}
                onClick={() => setActiveId(team.id)}
                onMouseEnter={() => setHoveredId(team.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: isActive ? '#fff' : isHovered ? '#fafaf8' : '#F2EFE8',
                  border: `2px solid ${isActive ? team.color : isHovered ? team.color + '66' : '#E0D9CB'}`,
                  borderRadius: 4,
                  padding: '12px 8px 10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transform: isHovered && !isActive ? 'translateY(-2px)' : 'none',
                  boxShadow: isActive ? `0 4px 16px ${team.color}33` : 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: team.color, borderRadius: '2px 2px 0 0',
                  }} />
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 4, margin: '0 auto 8px',
                  // background: team.color, border: '1px solid #E0D9CB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {imgError[team.id] ? (
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: team.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 9,
                      color: '#fff',
                    }}>
                      {team.abbr}
                    </div>
                  ) : (
                    <img
                      src={team.logoUrl}
                      alt={team.name}
                      loading="lazy"
                      onError={() => setImgError((prev) => ({ ...prev, [team.id]: true }))}
                      style={{ width: 36, height: 36, objectFit: 'contain' }}
                    />
                  )}
                </div>
                <div style={{
                  fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: 10,
                  color: isActive ? '#15120D' : '#4A4338', lineHeight: 1.3,
                  wordBreak: 'keep-all',
                }}>
                  {team.name}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 상세 패널 */}
      <div
        key={activeId}
        style={{
          margin: 20,
          background: '#fff',
          border: '1px solid #E0D9CB',
          borderLeft: `4px solid ${activeTeam.color}`,
          borderRadius: 4,
          padding: '22px 24px',
        }}
      >
        {/* 팀명 + 국기 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{activeTeam.flag}</span>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                color: activeTeam.color, letterSpacing: '0.08em', border: `1px solid ${activeTeam.color}33`,
                padding: '2px 8px', borderRadius: 2,
              }}>
                {activeTeam.country}
              </span>
            </div>
            <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 900, fontSize: 22, lineHeight: 1.1, marginBottom: 2 }}>
              {activeTeam.name}
            </h3>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', letterSpacing: '0.08em' }}>
              {activeTeam.fullName}
            </div>
          </div>

          {/* 드라이버 */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {activeTeam.drivers.map((d) => (
              <div
                key={d.num}
                style={{
                  background: '#F2EFE8', borderRadius: 4, padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 8, minWidth: 140,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: activeTeam.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 10,
                  color: '#fff',
                }}>
                  {d.num}
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#857A6A', letterSpacing: '0.08em', marginBottom: 2 }}>DRIVER</div>
                  <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>{d.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 팀 특징 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: '#857A6A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7 }}>
            팀 특징
          </div>
          <p style={{ fontSize: 14, color: '#3A352C', lineHeight: 1.7 }}>
            {activeTeam.trait}
          </p>
        </div>

        {/* 관전 포인트 */}
        <div style={{
          background: `${activeTeam.color}08`,
          border: `1px solid ${activeTeam.color}33`,
          borderLeft: `3px solid ${activeTeam.color}`,
          borderRadius: 2, padding: '14px 16px',
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
            color: activeTeam.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7,
          }}>
            초심자 관전 포인트
          </div>
          <p style={{ fontSize: 14, color: '#3A352C', lineHeight: 1.7 }}>
            {activeTeam.watchPoint}
          </p>
        </div>
      </div>

    </div>
  )
}
