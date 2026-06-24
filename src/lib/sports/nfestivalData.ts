import type { RaceSession } from '@/types'

function s(name: string, dateStart: string): RaceSession {
  return { name, dateStart }
}

function tbc(name: string, date: string): RaceSession {
  return { name, dateStart: date, tbc: true }
}

export interface NFestivalData {
  round: number
  name: string
  circuit: string
  loc: string
  raceDate: string  // 메인 결승 ISO UTC
  tip: string
  sessions: RaceSession[]
}

// ─────────────────────────────────────────────────────────────────
// 2026 현대 N 페스티벌 (미래 라운드만, 라운드 1 완료)
// 출처: hyundai-n.com/ko/experience/n-festival/calendar (Playwright 스크래핑, 2026-06-19 기준)
//
// 클래스: 금호 N1, 그란 투리스모 eN1, 넥센 N2 (마스터즈/챌린지), 넥센 N3
// R2 세션: 공식 타임테이블 확정 (6/20 토 기준, KST → UTC −9h)
// R3–R6: 날짜만 확정, 세션 시간 미발표 → TBC
// ─────────────────────────────────────────────────────────────────
export const NFESTIVAL_ROUNDS_2026: NFestivalData[] = [
  {
    round: 2,
    name: 'N Cup 라운드 2',
    circuit: 'KIC',
    loc: '전남 영암',
    // 첫 결승(N3) 13:55 KST = 04:55 UTC
    raceDate: '2026-06-20T04:55:00Z',
    tip: '영암 KIC에서 펼쳐지는 두 번째 라운드. 아반떼 N·IONIQ 5 N 기반 4개 클래스가 동일 사양으로 겨룬다.',
    // 6/20 (토) KST → UTC: 웜업 09:00/예선 10:05/결승 13:55~18:05
    sessions: [
      s('웜업',           '2026-06-20T00:00:00Z'), // 09:00 KST
      s('예선',           '2026-06-20T01:05:00Z'), // 10:05 KST (eN1 첫 예선)
      s('결승 (N3·N1)',   '2026-06-20T04:55:00Z'), // 13:55 KST N3 결승
      s('결승 (N2·eN1)', '2026-06-20T06:20:00Z'), // 15:20 KST N2 마스터즈 결승
      tbc('2일차',        '2026-06-21'),
    ],
  },
  {
    round: 3,
    name: 'N Cup 라운드 3',
    circuit: 'Inje Speedium',
    loc: '강원 인제',
    raceDate: '2026-07-12T04:00:00Z', // 13:00 KST 예상
    tip: '인제 스피디움의 구불구불한 산악 코스. 해발 700m의 박진감 넘치는 레이스.',
    sessions: [
      tbc('예선', '2026-07-11'),
      tbc('결승', '2026-07-11'),
      tbc('결승', '2026-07-12'),
    ],
  },
  {
    round: 4,
    name: 'N Cup 라운드 4',
    circuit: 'Inje Speedium',
    loc: '강원 인제',
    raceDate: '2026-10-04T04:00:00Z', // 13:00 KST 예상
    tip: '가을 단풍이 물드는 인제 스피디움. 시즌 후반 챔피언십 승부가 가속화된다.',
    sessions: [
      tbc('예선', '2026-10-03'),
      tbc('결승', '2026-10-03'),
      tbc('결승', '2026-10-04'),
    ],
  },
  {
    round: 5,
    name: 'N Cup 라운드 5',
    circuit: '에버랜드 스피드웨이',
    loc: '경기 용인',
    raceDate: '2026-10-31T04:00:00Z', // 13:00 KST 예상
    tip: '시즌 최종전 첫날. 에버랜드 스피드웨이에서 챔피언십 타이틀 향방이 드러나기 시작한다.',
    sessions: [
      tbc('예선', '2026-10-31'),
      tbc('결승', '2026-10-31'),
    ],
  },
  {
    round: 6,
    name: 'N Cup 라운드 6',
    circuit: '에버랜드 스피드웨이',
    loc: '경기 용인',
    raceDate: '2026-11-01T04:00:00Z', // 13:00 KST 예상
    tip: '2026 현대 N 페스티벌 시즌 최종전. 아반떼 N 드라이버 중 진짜 챔피언이 탄생한다.',
    sessions: [
      tbc('결승', '2026-11-01'),
    ],
  },
]
