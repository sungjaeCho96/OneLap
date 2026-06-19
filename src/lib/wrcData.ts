import type { RaceSession } from '@/types'

// 확정 시간 세션 헬퍼
function s(name: string, dateStart: string): RaceSession {
  return { name, dateStart }
}

// TBC 세션 (날짜만 확정, 시간 미확정)
function tbc(name: string, date: string): RaceSession {
  return { name, dateStart: date, tbc: true }
}

export interface WrcRaceData {
  round: number
  name: string
  circuit: string   // 서비스파크 도시
  loc: string       // 도시, 국가코드
  country: string   // 2자리 국가코드
  raceDate: string  // 파워스테이지 또는 최종일 ISO UTC
  totalSS: string   // 스테이지 수·거리 요약
  surface: string   // 노면 특성
  tip: string
  sessions: RaceSession[]
}

// ─────────────────────────────────────────────────────────────────
// 2026 FIA WRC 시즌 (미래 라운드만, 라운드 1-7 완료)
// 출처: wrc.com 공식 이티너레리 (Playwright 스크래핑, 2026-06-19 기준)
//
// 확정 이티너레리: Greece (R8), Finland (R10)
// 날짜만 확정 (시간 미정): Estonia, Paraguay, Chile, Sardegna, Saudi Arabia
//
// 세션 구조: 쉐이크다운 → SS1 → 1일차(Leg1) → 2일차(Leg2) → 3일차 → 파워스테이지
// 현지시각 → UTC 변환 완료
// ─────────────────────────────────────────────────────────────────
export const WRC_RACES_2026: WrcRaceData[] = [
  {
    round: 8,
    name: 'Acropolis Rally Greece',
    circuit: 'Loutraki',
    loc: 'Loutraki, GR',
    country: 'GR',
    // 파워스테이지 SS17 14:15 UTC+3 → 11:15 UTC
    raceDate: '2026-06-28T11:15:00Z',
    totalSS: '17 SS · 323 KM',
    surface: '자갈',
    tip: '"신들의 랠리"가 아테네 근교 루트라키로 이전. 코린토스만을 배경으로 거친 자갈 스테이지가 펼쳐진다.',
    // 현지시간 UTC+3 → UTC (−3시간)
    sessions: [
      s('쉐이크다운',    '2026-06-25T06:01:00Z'), // 09:01 UTC+3
      s('SS1',          '2026-06-25T16:05:00Z'), // 19:05 UTC+3 EKO SSS
      s('1일차',        '2026-06-26T05:48:00Z'), // 08:48 UTC+3 SS2 첫 스테이지
      s('2일차',        '2026-06-27T04:54:00Z'), // 07:54 UTC+3 SS8 첫 스테이지
      s('3일차',        '2026-06-28T05:28:00Z'), // 08:28 UTC+3 SS14 첫 스테이지
      s('파워스테이지', '2026-06-28T11:15:00Z'), // 14:15 UTC+3 SS17 Loutraki 2
    ],
  },
  {
    round: 9,
    name: 'Delfi Rally Estonia',
    circuit: 'Tartu',
    loc: 'Tartu, EE',
    country: 'EE',
    raceDate: '2026-07-19T00:00:00Z',
    totalSS: '320 KM SS',
    surface: '자갈',
    tip: '에스토니아의 고속 자갈 코스. 넓은 도로와 엄청난 속도감이 WRC 최고의 점프 스펙타클을 만들어낸다.',
    sessions: [
      tbc('쉐이크다운',    '2026-07-17'),
      tbc('1일차',        '2026-07-18'),
      tbc('파워스테이지', '2026-07-19'),
    ],
  },
  {
    round: 10,
    name: 'Secto Rally Finland',
    circuit: 'Jyväskylä',
    loc: 'Jyväskylä, FI',
    country: 'FI',
    // 파워스테이지 SS20 13:15 UTC+3 → 10:15 UTC
    raceDate: '2026-08-02T10:15:00Z',
    totalSS: '20 SS · 316 KM',
    surface: '자갈',
    tip: '점프의 천국 핀란드. 히모스-얌사 파워스테이지 30km는 WRC 최장 단일 스테이지 중 하나다.',
    // 현지시간 UTC+3 → UTC (−3시간)
    sessions: [
      s('쉐이크다운',    '2026-07-30T06:01:00Z'), // 09:01 UTC+3 Ruuhimäki
      s('SS1',          '2026-07-30T16:05:00Z'), // 19:05 UTC+3 SSS1 Harju 1
      s('1일차',        '2026-07-31T05:44:00Z'), // 08:44 UTC+3 SS2 Laukaa 1
      s('2일차',        '2026-08-01T05:01:00Z'), // 08:01 UTC+3 SS11 Parkkola 1
      s('3일차',        '2026-08-02T07:35:00Z'), // 10:35 UTC+3 SS19 Himos-Jämsä 1
      s('파워스테이지', '2026-08-02T10:15:00Z'), // 13:15 UTC+3 SS20 Himos-Jämsä 2
    ],
  },
  {
    round: 11,
    name: 'ueno Rally del Paraguay',
    circuit: 'Asunción',
    loc: 'Asunción, PY',
    country: 'PY',
    raceDate: '2026-08-30T00:00:00Z',
    totalSS: '320 KM SS',
    surface: '자갈',
    tip: '남미 첫 WRC 파라과이. 고온다습한 환경에서 타이어 관리가 승부를 갈른다.',
    sessions: [
      tbc('쉐이크다운',    '2026-08-27'),
      tbc('1일차',        '2026-08-28'),
      tbc('2일차',        '2026-08-29'),
      tbc('파워스테이지', '2026-08-30'),
    ],
  },
  {
    round: 12,
    name: 'Rally Chile Bio Bío',
    circuit: 'Concepción',
    loc: 'Concepción, CL',
    country: 'CL',
    raceDate: '2026-09-13T00:00:00Z',
    totalSS: '320 KM SS',
    surface: '자갈',
    tip: '칠레 안데스 산록의 빽빽한 숲길. 나무 사이를 스치듯 달리는 고속 스테이지가 압도적이다.',
    sessions: [
      tbc('쉐이크다운',    '2026-09-10'),
      tbc('1일차',        '2026-09-11'),
      tbc('2일차',        '2026-09-12'),
      tbc('파워스테이지', '2026-09-13'),
    ],
  },
  {
    round: 13,
    name: 'Rally Italia Sardegna',
    circuit: 'Alghero',
    loc: 'Alghero, IT',
    country: 'IT',
    raceDate: '2026-10-04T00:00:00Z',
    totalSS: '320 KM SS',
    surface: '자갈',
    tip: '사르데냐의 깊은 관목 숲 스테이지. 파손된 도로와 돌출된 바위가 서스펜션을 시험한다.',
    sessions: [
      tbc('쉐이크다운',    '2026-10-01'),
      tbc('1일차',        '2026-10-02'),
      tbc('2일차',        '2026-10-03'),
      tbc('파워스테이지', '2026-10-04'),
    ],
  },
  {
    round: 14,
    name: 'Rally Saudi Arabia',
    circuit: 'Riyadh',
    loc: 'Riyadh, SA',
    country: 'SA',
    raceDate: '2026-11-14T00:00:00Z',
    totalSS: '320 KM SS',
    surface: '자갈',
    tip: '시즌 최종전. 아라비아 반도의 사막 자갈 코스에서 챔피언십 타이틀의 주인이 결정된다.',
    sessions: [
      tbc('쉐이크다운',    '2026-11-11'),
      tbc('1일차',        '2026-11-12'),
      tbc('2일차',        '2026-11-13'),
      tbc('파워스테이지', '2026-11-14'),
    ],
  },
]
