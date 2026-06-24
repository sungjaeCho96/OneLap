import type { Race, RaceSession } from '@/types'

interface OpenF1Meeting {
  meeting_key: number
  meeting_name: string
  location: string
  country_name: string
  circuit_short_name: string
  circuit_type: string
  gmt_offset: string
  date_start: string
  date_end: string
  year: number
  is_cancelled: boolean
}

interface OpenF1Session {
  meeting_key: number
  session_name: string
  date_start: string
  date_end: string
  location: string
}

export interface F1RaceWithSessions extends Race {
  sessions: RaceSession[]
}

const CIRCUIT_TIPS: Record<string, string> = {
  Melbourne: '시즌 첫 전투. 스트리트 서킷의 좁은 코너가 오프닝 랩을 아슬아슬하게 만든다.',
  Shanghai: '긴 백스트레이트와 헤어핀이 공존하는 DRS 찬스의 보고.',
  Suzuka: '8자형 레이아웃의 스즈카. S자 코너를 풀 스로틀로 통과하면 전설이 된다.',
  Miami: '화려한 마이애미 가든. 스프린트와 함께 주말 내내 달아오른다.',
  Montreal: '헤어핀의 벽이 무서운 질 빌뇌브 서킷. 오버테이크의 묘미가 가득하다.',
  'Monte Carlo': '모나코의 좁은 골목길. 추월은 불가능에 가깝지만 피트 전략이 판도를 뒤흔든다.',
  Catalunya: '바르셀로나의 뜨거운 태양 아래 타이어 전략이 승부를 가른다.',
  Spielberg: '오스트리아의 고지대 서킷. 짧은 랩타임에 피트 타이밍이 핵심이다.',
  Silverstone: '영국 팬들의 열정이 넘치는 모터스포츠의 성지. 고속 코너가 연속된다.',
  'Spa-Francorchamps': 'Eau Rouge를 풀 스로틀로 공략하는 용기. 날씨가 결과를 바꾼다.',
  Hungaroring: '서머 브레이크 전 마지막 레이스. 좁은 헝가리링은 오버테이크가 쉽지 않다.',
  Zandvoort: '모래 언덕 위의 네덜란드 팬들의 오렌지 물결. 뱅크드 코너가 특이하다.',
  Monza: '이탈리아의 신전. 340km/h 최고속 직선과 치카네의 극적인 대비.',
  Madring: '마드리드의 신규 서킷. 도시를 달리는 짜릿한 스트리트 레이스.',
  Baku: '바쿠 올드 시티를 달리는 스트리트 레이스. 긴 직선과 급코너의 조합.',
  Singapore: '야간 레이스의 진수. 싱가포르의 야경을 배경으로 벌어지는 전략 싸움.',
  Austin: '미국의 가장 역동적인 서킷. 1번 코너 돌진은 언제나 손에 땀을 쥐게 한다.',
  'Mexico City': '고도 2200m. 얇은 공기가 에어로 효율을 떨어뜨리고 엔진을 혹사시킨다.',
  Interlagos: '브라질의 열정. 짧고 강렬한 인테를라고스에서 챔피언십이 결정된다.',
  'Las Vegas': '네온사인 아래 새벽의 라스베이거스. 긴 직선에서 최고속 배틀이 펼쳐진다.',
  Lusail: '카타르의 스프린트 위크엔드. 조명 아래 펼쳐지는 야간 레이스.',
  'Yas Marina Circuit': '시즌 마지막 레이스. 챔피언의 이름이 여기서 확정된다.',
}

const SESSION_NAME_KR: Record<string, string> = {
  'Practice 1': 'FP1',
  'Practice 2': 'FP2',
  'Practice 3': 'FP3',
  'Qualifying': '예선',
  'Sprint Qualifying': '스프린트 예선',
  'Sprint': '스프린트',
  'Race': '결승',
}

const SESSION_ORDER: Record<string, number> = {
  'Practice 1': 1,
  'Practice 2': 2,
  'Practice 3': 3,
  'Sprint Qualifying': 4,
  'Sprint': 5,
  'Qualifying': 6,
  'Race': 7,
}

function getTip(circuitShortName: string, location: string): string {
  return (
    CIRCUIT_TIPS[circuitShortName] ??
    CIRCUIT_TIPS[location] ??
    `${location}에서 펼쳐지는 F1 그랑프리. 세계 최고의 드라이버들이 격돌한다.`
  )
}

const MEETINGS_URL = 'https://api.openf1.org/v1/meetings?year=2026'
const ALL_SESSIONS_URL = 'https://api.openf1.org/v1/sessions?year=2026'

export async function fetchF1Races(): Promise<F1RaceWithSessions[]> {
  try {
    const [meetingsRes, sessionsRes] = await Promise.all([
      fetch(MEETINGS_URL, { next: { revalidate: 3600 } }),
      fetch(ALL_SESSIONS_URL, { next: { revalidate: 3600 } }),
    ])

    if (!meetingsRes.ok || !sessionsRes.ok) throw new Error('OpenF1 API error')

    const [meetings, allSessions]: [OpenF1Meeting[], OpenF1Session[]] = await Promise.all([
      meetingsRes.json(),
      sessionsRes.json(),
    ])

    // Group all sessions by meeting_key
    const sessionsByMeeting = new Map<number, OpenF1Session[]>()
    for (const s of allSessions) {
      const list = sessionsByMeeting.get(s.meeting_key) ?? []
      list.push(s)
      sessionsByMeeting.set(s.meeting_key, list)
    }

    // Find the Race session per meeting (used for the main race date)
    const raceSessionMap = new Map<number, OpenF1Session>()
    for (const s of allSessions) {
      if (s.session_name === 'Race') raceSessionMap.set(s.meeting_key, s)
    }

    const TEST_KEYS = new Set([1304, 1305])

    const raceMeetings = meetings
      .filter(
        (m) =>
          !m.is_cancelled &&
          !TEST_KEYS.has(m.meeting_key) &&
          raceSessionMap.has(m.meeting_key)
      )
      .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())

    return raceMeetings.map((m, idx) => {
      const raceSession = raceSessionMap.get(m.meeting_key)!
      const meetingSessions = (sessionsByMeeting.get(m.meeting_key) ?? [])
        .filter((s) => s.session_name in SESSION_ORDER)
        .sort(
          (a, b) =>
            (SESSION_ORDER[a.session_name] ?? 99) - (SESSION_ORDER[b.session_name] ?? 99)
        )

      const sessions: RaceSession[] = meetingSessions.map((s) => ({
        name: SESSION_NAME_KR[s.session_name] ?? s.session_name,
        dateStart: s.date_start,
        dateEnd: s.date_end,
      }))

      return {
        sport: 'f1',
        round: idx + 1,
        name: m.meeting_name,
        circuit: m.circuit_short_name,
        loc: `${m.location}, ${m.country_name}`,
        date: raceSession.date_start,
        laps: 'F1 RACE',
        extra: m.circuit_type.includes('Street') ? '스트리트' : '퍼머넌트',
        tip: getTip(m.circuit_short_name, m.location),
        sessions,
      }
    })
  } catch {
    return []
  }
}

export interface F1DriverStanding {
  pos: number
  code: string
  team: string
  points: number
  gap: string  // P1: "146pts", P2+: "-12pts"
}

const STANDINGS_URL = 'https://api.jolpi.ca/ergast/f1/2026/driverStandings/'

export async function fetchF1DriverStandings(): Promise<F1DriverStanding[]> {
  try {
    const res = await fetch(STANDINGS_URL, { next: { revalidate: 86400 } })
    if (!res.ok) throw new Error('Standings API error')

    const json = await res.json()
    const list: {
      position: string
      points: string
      Driver: { code: string }
      Constructors: { name: string }[]
    }[] = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []

    if (list.length === 0) return []

    return list.slice(0, 4).map((d) => {
      const pts = parseFloat(d.points)
      return {
        pos: parseInt(d.position),
        code: d.Driver.code ?? '???',
        team: d.Constructors[0]?.name ?? '',
        points: pts,
        gap: `${pts}pts`,
      }
    })
  } catch {
    return []
  }
}
