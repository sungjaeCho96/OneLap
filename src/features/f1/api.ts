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
const ERGAST_RACES_URL = 'https://api.jolpi.ca/ergast/f1/2026/races/'

interface ErgastSession {
  date: string
  time: string
}

interface ErgastRace {
  round: string
  raceName: string
  Circuit: {
    circuitName: string
    Location: { locality: string; country: string }
  }
  date: string
  time?: string
  FirstPractice?: ErgastSession
  SecondPractice?: ErgastSession
  ThirdPractice?: ErgastSession
  Qualifying?: ErgastSession
  Sprint?: ErgastSession
  SprintQualifying?: ErgastSession
}

function toIso(date: string, time?: string): string {
  return time ? `${date}T${time}` : `${date}T00:00:00Z`
}

async function fetchF1RacesFromErgast(): Promise<F1RaceWithSessions[]> {
  const res = await fetch(ERGAST_RACES_URL, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Ergast API error')

  const json = await res.json()
  const races: ErgastRace[] = json?.MRData?.RaceTable?.Races ?? []

  return races.map((race) => {
    const sessions: RaceSession[] = []

    const push = (name: string, s?: ErgastSession) => {
      if (!s) return
      sessions.push({ name, dateStart: toIso(s.date, s.time), dateEnd: toIso(s.date, s.time) })
    }

    push('FP1', race.FirstPractice)
    push('FP2', race.SecondPractice)
    push('스프린트 예선', race.SprintQualifying)
    push('스프린트', race.Sprint)
    push('FP3', race.ThirdPractice)
    push('예선', race.Qualifying)
    sessions.push({
      name: '결승',
      dateStart: toIso(race.date, race.time),
      dateEnd: toIso(race.date, race.time),
    })

    const locality = race.Circuit.Location.locality

    return {
      sport: 'f1' as const,
      round: parseInt(race.round),
      name: race.raceName,
      circuit: race.Circuit.circuitName,
      loc: `${locality}, ${race.Circuit.Location.country}`,
      date: toIso(race.date, race.time),
      laps: 'F1 RACE',
      extra: '퍼머넌트',
      tip: getTip('', locality),
      sessions,
    }
  })
}

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

    // OpenF1가 에러 메시지 JSON을 200이 아닌 형태로 내려보내는 경우도 있어 배열 여부 확인
    if (!Array.isArray(meetings) || !Array.isArray(allSessions)) throw new Error('OpenF1 API error')

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
    return fetchF1RacesFromErgast().catch(() => [])
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

export interface F1DriverResult {
  pos: number
  grid: number
  code: string
  firstName: string
  lastName: string
  team: string
  time: string
  status: string
  fastestLap: boolean
  posChange: number
}

export interface F1RaceResult {
  raceName: string
  round: number
  date: string
  circuit: string
  locality: string
  country: string
  results: F1DriverResult[]
}

// ─── OpenF1 session result types ────────────────────────────────────────────

interface OpenF1RaceSession {
  session_key: number
  meeting_key: number
  date_start: string
  date_end: string
  location: string
  country_name: string
  circuit_short_name: string
}

interface OpenF1ResultEntry {
  position: number | null
  driver_number: number
  number_of_laps: number
  dnf: boolean
  dns: boolean
  dsq: boolean
  duration: number | null
  gap_to_leader: number | string | null
}

interface OpenF1DriverEntry {
  driver_number: number
  name_acronym: string
  first_name: string
  last_name: string
  team_name: string
}

interface OpenF1MeetingEntry {
  meeting_key: number
  meeting_name: string
  location: string
  country_name: string
  circuit_short_name: string
}

function formatRaceTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${h}:${String(m).padStart(2, '0')}:${s.toFixed(3).padStart(6, '0')}`
}

function gapToTimeStr(
  gap: number | string | null,
  isWinner: boolean,
  duration: number | null,
): string {
  if (isWinner) return duration != null ? formatRaceTime(duration) : ''
  if (gap == null) return ''
  if (typeof gap === 'string') return gap.replace(/^\+/, '')
  return gap.toFixed(3)
}

// ─── 공통 헬퍼 ───────────────────────────────────────────────────────────────

function buildDriverResults(
  results: OpenF1ResultEntry[],
  driverMap: Map<number, OpenF1DriverEntry>,
  gridMap: Map<number, number>,
): F1DriverResult[] {
  const finishers = results
    .filter((r) => r.position != null)
    .sort((a, b) => (a.position as number) - (b.position as number))
  const dnfDrivers = results
    .filter((r) => r.position == null)
    .sort((a, b) => b.number_of_laps - a.number_of_laps)

  return [...finishers, ...dnfDrivers].map((r, idx) => {
    const driver = driverMap.get(r.driver_number)
    const pos = r.position ?? (idx + 1)
    const isWinner = pos === 1
    const finished = !r.dnf && !r.dns && !r.dsq
    const status = r.dsq
      ? 'Disqualified'
      : r.dns
        ? 'Did not start'
        : r.dnf
          ? 'Retired'
          : 'Finished'
    const grid = gridMap.get(r.driver_number) ?? pos
    return {
      pos,
      grid,
      code: driver?.name_acronym ?? String(r.driver_number),
      firstName: driver?.first_name ?? '',
      lastName: driver?.last_name ?? '',
      team: driver?.team_name ?? '',
      time: finished ? gapToTimeStr(r.gap_to_leader, isWinner, r.duration) : '',
      status,
      fastestLap: false,
      posChange: grid - pos,
    }
  })
}

// ─── 단일 레이스 (최신) ───────────────────────────────────────────────────────

async function fetchCompletedRaceSessions(): Promise<{
  sessions: OpenF1RaceSession[]
  qualiKeyMap: Map<number, number>
  meetingMap: Map<number, OpenF1MeetingEntry>
}> {
  const now = Date.now()

  const [raceRes, qualiRes, meetingsRes] = await Promise.all([
    fetch('https://api.openf1.org/v1/sessions?session_name=Race&year=2026', { next: { revalidate: 300 } }),
    fetch('https://api.openf1.org/v1/sessions?session_name=Qualifying&year=2026', { next: { revalidate: 3600 } }),
    fetch('https://api.openf1.org/v1/meetings?year=2026', { next: { revalidate: 3600 } }),
  ])

  if (!raceRes.ok || !qualiRes.ok || !meetingsRes.ok) throw new Error('OpenF1 metadata error')

  const [allRaceSessions, allQualiSessions, allMeetings]: [
    OpenF1RaceSession[],
    OpenF1RaceSession[],
    OpenF1MeetingEntry[],
  ] = await Promise.all([raceRes.json(), qualiRes.json(), meetingsRes.json()])

  if (!Array.isArray(allRaceSessions) || !Array.isArray(allQualiSessions) || !Array.isArray(allMeetings))
    throw new Error('Invalid metadata')

  const sessions = allRaceSessions
    .filter((s) => s.date_end && new Date(s.date_end).getTime() < now)
    .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())

  const qualiKeyMap = new Map<number, number>(
    allQualiSessions.map((s) => [s.meeting_key, s.session_key]),
  )
  const meetingMap = new Map<number, OpenF1MeetingEntry>(
    allMeetings.map((m) => [m.meeting_key, m]),
  )

  return { sessions, qualiKeyMap, meetingMap }
}

async function fetchOneRaceResult(
  session: OpenF1RaceSession,
  round: number,
  qualiKey: number | undefined,
  meeting: OpenF1MeetingEntry | undefined,
  isLatest = false,
): Promise<F1RaceResult> {
  // 과거 경기 결과는 바뀌지 않으므로 1일 캐시, 최신 경기만 1시간
  const resultTtl = isLatest ? 3600 : 86400
  const fetches: Promise<Response>[] = [
    fetch(`https://api.openf1.org/v1/session_result?session_key=${session.session_key}`, { next: { revalidate: resultTtl } }),
    fetch(`https://api.openf1.org/v1/drivers?session_key=${session.session_key}`, { next: { revalidate: 86400 } }),
    ...(qualiKey
      ? [fetch(`https://api.openf1.org/v1/session_result?session_key=${qualiKey}`, { next: { revalidate: 86400 } })]
      : []),
  ]

  const responses = await Promise.all(fetches)
  const [results, drivers]: [OpenF1ResultEntry[], OpenF1DriverEntry[]] = await Promise.all([
    responses[0].json(),
    responses[1].json(),
  ])

  if (!Array.isArray(results) || results.length === 0) throw new Error('No results')

  const gridMap = new Map<number, number>()
  if (qualiKey && responses[2]?.ok) {
    const qualiResults: OpenF1ResultEntry[] = await responses[2].json()
    if (Array.isArray(qualiResults)) {
      for (const q of qualiResults) {
        if (q.position != null) gridMap.set(q.driver_number, q.position)
      }
    }
  }

  const driverMap = new Map<number, OpenF1DriverEntry>(drivers.map((d) => [d.driver_number, d]))

  return {
    raceName: meeting?.meeting_name ?? `Race ${round}`,
    round,
    date: session.date_start,
    circuit: meeting?.circuit_short_name ?? '',
    locality: meeting?.location ?? '',
    country: meeting?.country_name ?? '',
    results: buildDriverResults(results, driverMap, gridMap),
  }
}

async function fetchLatestRaceResultFromOpenF1(): Promise<F1RaceResult | null> {
  const { sessions, qualiKeyMap, meetingMap } = await fetchCompletedRaceSessions()
  if (sessions.length === 0) return null

  const latest = sessions[sessions.length - 1]
  const round = sessions.length

  return fetchOneRaceResult(
    latest,
    round,
    qualiKeyMap.get(latest.meeting_key),
    meetingMap.get(latest.meeting_key),
  )
}

// ─── 시즌 전체 레이스 결과 ────────────────────────────────────────────────────

async function fetchAllRaceResultsFromOpenF1(): Promise<F1RaceResult[]> {
  const { sessions, qualiKeyMap, meetingMap } = await fetchCompletedRaceSessions()
  if (sessions.length === 0) return []

  const latestIdx = sessions.length - 1

  // 3개씩 배치 처리 — 33개 동시 요청 대신 배치당 ~9개로 rate limit 방지
  const BATCH_SIZE = 3
  const results: (F1RaceResult | null)[] = []

  for (let i = 0; i < sessions.length; i += BATCH_SIZE) {
    const batch = sessions.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map((session, batchIdx) => {
        const idx = i + batchIdx
        return fetchOneRaceResult(
          session,
          idx + 1,
          qualiKeyMap.get(session.meeting_key),
          meetingMap.get(session.meeting_key),
          idx === latestIdx,
        ).catch(() => null)
      }),
    )
    results.push(...batchResults)
  }

  return results
    .filter((r): r is F1RaceResult => r !== null)
    .reverse() // 최신 레이스가 index 0
}

// ─── Ergast fallback ─────────────────────────────────────────────────────────

const LAST_RESULT_URL = 'https://api.jolpi.ca/ergast/f1/current/last/results/'

async function fetchLatestRaceResultFromErgast(): Promise<F1RaceResult | null> {
  const res = await fetch(LAST_RESULT_URL, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error('Race result API error')

  const json = await res.json()
  const races: {
    raceName: string
    round: string
    date: string
    Circuit: { circuitName: string; Location: { locality: string; country: string } }
    Results: {
      position: string
      grid: string
      Driver: { code: string; givenName: string; familyName: string }
      Constructor: { name: string }
      Time?: { time: string }
      status: string
      FastestLap?: { rank: string }
    }[]
  }[] = json?.MRData?.RaceTable?.Races ?? []

  if (races.length === 0) return null

  const race = races[0]
  return {
    raceName: race.raceName,
    round: parseInt(race.round),
    date: race.date,
    circuit: race.Circuit.circuitName,
    locality: race.Circuit.Location.locality,
    country: race.Circuit.Location.country,
    results: race.Results.map((r) => {
      const pos = parseInt(r.position)
      const grid = parseInt(r.grid) || pos
      return {
        pos,
        grid,
        code: r.Driver.code ?? '???',
        firstName: r.Driver.givenName,
        lastName: r.Driver.familyName,
        team: r.Constructor.name,
        time: r.Time?.time ?? '',
        status: r.status,
        fastestLap: r.FastestLap?.rank === '1',
        posChange: grid - pos,
      }
    }),
  }
}

export async function fetchLatestRaceResult(): Promise<F1RaceResult | null> {
  try {
    return await fetchLatestRaceResultFromOpenF1()
  } catch {
    return fetchLatestRaceResultFromErgast().catch(() => null)
  }
}

async function fetchAllRaceResultsFromErgast(): Promise<F1RaceResult[]> {
  const res = await fetch(
    'https://api.jolpi.ca/ergast/f1/2026/results/?limit=500',
    { next: { revalidate: 3600 } },
  )
  if (!res.ok) throw new Error('Ergast results error')

  const json = await res.json()
  const races: {
    raceName: string
    round: string
    date: string
    Circuit: { circuitName: string; Location: { locality: string; country: string } }
    Results: {
      position: string
      grid: string
      Driver: { code: string; givenName: string; familyName: string }
      Constructor: { name: string }
      Time?: { time: string }
      status: string
      FastestLap?: { rank: string }
    }[]
  }[] = json?.MRData?.RaceTable?.Races ?? []

  if (races.length === 0) throw new Error('No Ergast results')

  return races
    .map((race) => {
      const round = parseInt(race.round)
      return {
        raceName: race.raceName,
        round,
        date: race.date,
        circuit: race.Circuit.circuitName,
        locality: race.Circuit.Location.locality,
        country: race.Circuit.Location.country,
        results: race.Results.map((r) => {
          const pos = parseInt(r.position)
          const grid = parseInt(r.grid) || pos
          return {
            pos,
            grid,
            code: r.Driver.code ?? '???',
            firstName: r.Driver.givenName,
            lastName: r.Driver.familyName,
            team: r.Constructor.name,
            time: r.Time?.time ?? '',
            status: r.status,
            fastestLap: r.FastestLap?.rank === '1',
            posChange: grid - pos,
          }
        }),
      }
    })
    .reverse() // 최신 레이스가 index 0
}

export async function fetchAllRaceResults(): Promise<F1RaceResult[]> {
  try {
    return await fetchAllRaceResultsFromOpenF1()
  } catch {
    return fetchAllRaceResultsFromErgast().catch(() => [])
  }
}
