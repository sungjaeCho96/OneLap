import type { RaceSession } from '@/types'

function tbc(name: string, date: string): RaceSession {
  return { name, dateStart: date, tbc: true }
}

export interface SuperRaceData {
  round: number
  name: string
  circuit: string
  loc: string
  raceDate: string   // 결승 ISO UTC (KST−9)
  eventLabel: string // 나이트레이스 / 전남 GT / 최종전 등
  tip: string
  sessions: RaceSession[]
}

// ─────────────────────────────────────────────────────────────────
// 2026 오네(O-NE) 슈퍼레이스 챔피언십 (미래 라운드만)
// 출처: super-race.com 공식 사이트, cjnews.cj.net 공식 발표 (2026-06-19 기준)
//
// 라운드 1(4/18), 2(4/19), 3(5/24) 이미 완료
// 라운드 4–8: 미래 일정
//
// 세션 시간: 경기 2-3주 전 공식 타임테이블 발표됨
// → 날짜만 확정, 시간 TBC 처리
// ─────────────────────────────────────────────────────────────────
export const SUPERRACE_ROUNDS_2026: SuperRaceData[] = [
  {
    round: 4,
    name: 'Round 4 · 인제',
    circuit: 'Inje Speedium',
    loc: '강원 인제',
    // 나이트레이스 결승 약 20:00 KST = 11:00 UTC
    raceDate: '2026-07-18T11:00:00Z',
    eventLabel: '나이트레이스',
    tip: '강원 국제 모터페스타와 함께. 인제 스피디움의 야간 조명 아래 펼쳐지는 나이트레이스.',
    sessions: [
      tbc('예선', '2026-07-18'),
      tbc('결승', '2026-07-18'),
    ],
  },
  {
    round: 5,
    name: 'Round 5 · 용인',
    circuit: '에버랜드 스피드웨이',
    loc: '경기 용인',
    // 나이트레이스 결승 약 20:00 KST = 11:00 UTC
    raceDate: '2026-08-22T11:00:00Z',
    eventLabel: '용인 나이트레이스',
    tip: '수도권 유일의 나이트레이스. 에버랜드 스피드웨이에서 화려한 조명 속 박진감 넘치는 레이스.',
    sessions: [
      tbc('예선', '2026-08-22'),
      tbc('결승', '2026-08-22'),
    ],
  },
  {
    round: 6,
    name: 'Round 6 · 영암',
    circuit: 'KIC',
    loc: '전남 영암',
    // 결승 9/13 (일) 약 13:00 KST = 04:00 UTC
    raceDate: '2026-09-13T04:00:00Z',
    eventLabel: '전남 GT',
    tip: '전남GT와 함께하는 영암 KIC. 5.6km 국제 서킷에서 세계적 수준의 레이스를 경험하라.',
    sessions: [
      tbc('예선', '2026-09-12'),
      tbc('결승', '2026-09-13'),
    ],
  },
  {
    round: 7,
    name: 'Round 7 · 용인',
    circuit: '에버랜드 스피드웨이',
    loc: '경기 용인',
    // 결승 10/24 (토) 약 13:00 KST = 04:00 UTC
    raceDate: '2026-10-24T04:00:00Z',
    eventLabel: 'GOLDEN MOMENTS',
    tip: '최종전 첫날. 챔피언십 타이틀을 향한 승부가 시작된다.',
    sessions: [
      tbc('예선', '2026-10-24'),
      tbc('결승', '2026-10-24'),
    ],
  },
  {
    round: 8,
    name: 'Round 8 · 용인',
    circuit: '에버랜드 스피드웨이',
    loc: '경기 용인',
    // 결승 10/25 (일) 약 13:00 KST = 04:00 UTC
    raceDate: '2026-10-25T04:00:00Z',
    eventLabel: '시즌 최종전',
    tip: '2026 시즌 챔피언이 결정되는 날. GOLDEN MOMENTS 최종전에서 드라마의 결말이 쓰인다.',
    sessions: [
      tbc('결승', '2026-10-25'),
    ],
  },
]
