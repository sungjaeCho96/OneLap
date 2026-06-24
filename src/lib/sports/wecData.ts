import type { RaceSession } from '@/types'

// 세션 이름 한국어 매핑
const SESSION_KR: Record<string, string> = {
  'Free Practice 1': 'FP1',
  'Free Practice 2': 'FP2',
  'Free Practice 3': 'FP3',
  'Qualifying - LMGT3': 'LMGT3 예선',
  'Hyperpole - LMGT3': 'LMGT3 하이퍼폴',
  'Qualifying - HYPERCAR': '하이퍼카 예선',
  'Hyperpole - HYPERCAR': '하이퍼카 하이퍼폴',
  'Race': '결승',
}

function s(name: string, dateStart: string, tbc = false): RaceSession {
  return { name: SESSION_KR[name] ?? name, dateStart, tbc }
}

// tbc 세션: 날짜만 있고 시간 미확정
function tbcDay(name: string, date: string): RaceSession {
  return s(name, date, true)
}

export interface WecRaceData {
  round: number
  name: string
  officialName: string
  circuit: string
  loc: string
  country: string
  raceDate: string       // 결승 ISO UTC
  duration: string       // '6 HOURS' | '8 HOURS' | '24 HOURS' | '1812KM'
  tip: string
  sessions: RaceSession[]
}

// ─────────────────────────────────────────
// 2026 FIA WEC 시즌 (미래 라운드만)
// 출처: fiawec.com 공식 사이트 (2026-06-19 기준)
// 라운드 1-3 (Imola, Spa, Le Mans) 은 이미 완료
// ─────────────────────────────────────────
export const WEC_RACES_2026: WecRaceData[] = [
  {
    round: 4,
    name: '6H of São Paulo',
    officialName: 'Rolex 6 Hours of São Paulo',
    circuit: 'Interlagos',
    loc: 'São Paulo, BR',
    country: 'BR',
    raceDate: '2026-07-12T14:30:00Z',
    duration: '6 HOURS',
    tip: '인테를라고스의 급격한 고도 차와 빡빡한 트래픽. 클래스 간 오버테이크가 드라마를 만든다.',
    // 현지 시간 BRT(UTC-3) → UTC 변환 완료
    sessions: [
      s('Free Practice 1',       '2026-07-10T14:00:00Z'),
      s('Free Practice 2',       '2026-07-10T18:50:00Z'),
      s('Free Practice 3',       '2026-07-11T13:10:00Z'),
      s('Qualifying - LMGT3',    '2026-07-11T17:30:00Z'),
      s('Hyperpole - LMGT3',     '2026-07-11T17:50:00Z'),
      s('Qualifying - HYPERCAR', '2026-07-11T18:25:00Z'),
      s('Hyperpole - HYPERCAR',  '2026-07-11T18:45:00Z'),
      s('Race',                  '2026-07-12T14:30:00Z'),
    ],
  },
  {
    round: 5,
    name: 'Lone Star Le Mans',
    officialName: 'Lone Star Le Mans',
    circuit: 'Circuit of the Americas',
    loc: 'Austin, TX, USA',
    country: 'USA',
    raceDate: '2026-09-06T00:00:00Z',
    duration: '6 HOURS',
    tip: '텍사스의 롤러코스터 COTA. T1 낙하 구간은 WEC 하이퍼카도 숨을 멈추게 한다.',
    sessions: [
      tbcDay('Free Practice 1',       '2026-09-04'),
      tbcDay('Free Practice 2',       '2026-09-04'),
      tbcDay('Free Practice 3',       '2026-09-05'),
      tbcDay('Qualifying - LMGT3',    '2026-09-05'),
      tbcDay('Hyperpole - LMGT3',     '2026-09-05'),
      tbcDay('Qualifying - HYPERCAR', '2026-09-05'),
      tbcDay('Hyperpole - HYPERCAR',  '2026-09-05'),
      tbcDay('Race',                  '2026-09-06'),
    ],
  },
  {
    round: 6,
    name: '6H of Fuji',
    officialName: '6 Hours of Fuji',
    circuit: 'Fuji Speedway',
    loc: 'Shizuoka, JP',
    country: 'JP',
    raceDate: '2026-09-27T00:00:00Z',
    duration: '6 HOURS',
    tip: '후지산을 배경으로 달리는 낭만. 토요타의 홈 서킷에서 일본 팬들의 열기가 폭발한다.',
    sessions: [
      tbcDay('Free Practice 1',       '2026-09-25'),
      tbcDay('Free Practice 2',       '2026-09-25'),
      tbcDay('Free Practice 3',       '2026-09-26'),
      tbcDay('Qualifying - LMGT3',    '2026-09-26'),
      tbcDay('Hyperpole - LMGT3',     '2026-09-26'),
      tbcDay('Qualifying - HYPERCAR', '2026-09-26'),
      tbcDay('Hyperpole - HYPERCAR',  '2026-09-26'),
      tbcDay('Race',                  '2026-09-27'),
    ],
  },
  {
    round: 7,
    name: 'Qatar 1812km',
    officialName: 'Qatar 1812km',
    circuit: 'Lusail International Circuit',
    loc: 'Lusail, QAT',
    country: 'QAT',
    raceDate: '2026-10-24T00:00:00Z',
    duration: '1812KM',
    tip: '사막의 밤을 달리는 1812km. 거리 기반 레이스라 전략 계산이 더욱 복잡해진다.',
    sessions: [
      tbcDay('Free Practice 1',       '2026-10-22'),
      tbcDay('Free Practice 2',       '2026-10-22'),
      tbcDay('Free Practice 3',       '2026-10-23'),
      tbcDay('Qualifying - LMGT3',    '2026-10-23'),
      tbcDay('Hyperpole - LMGT3',     '2026-10-23'),
      tbcDay('Qualifying - HYPERCAR', '2026-10-23'),
      tbcDay('Hyperpole - HYPERCAR',  '2026-10-23'),
      tbcDay('Race',                  '2026-10-24'),
    ],
  },
  {
    round: 8,
    name: '8H of Bahrain',
    officialName: 'Bapco Energies 8 Hours of Bahrain',
    circuit: 'Bahrain International Circuit',
    loc: 'Sakhir, BHR',
    country: 'BHR',
    raceDate: '2026-11-07T00:00:00Z',
    duration: '8 HOURS',
    tip: '시즌 최종전. 챔피언십 결정의 무대. 8시간이 모자라도록 치열한 막판 스퍼트가 펼쳐진다.',
    sessions: [
      tbcDay('Free Practice 1',       '2026-11-05'),
      tbcDay('Free Practice 2',       '2026-11-05'),
      tbcDay('Free Practice 3',       '2026-11-06'),
      tbcDay('Qualifying - LMGT3',    '2026-11-06'),
      tbcDay('Hyperpole - LMGT3',     '2026-11-06'),
      tbcDay('Qualifying - HYPERCAR', '2026-11-06'),
      tbcDay('Hyperpole - HYPERCAR',  '2026-11-06'),
      tbcDay('Race',                  '2026-11-07'),
    ],
  },
]
