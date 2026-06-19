import type { Series, Race, NewsItem, SportId, RaceDisplay, NewsDisplay, RaceSession } from '@/types'
import { WEC_RACES_2026 } from './wecData'
import { WRC_RACES_2026 } from './wrcData'

export const SERIES: Series[] = [
  {
    id: 'f1',
    short: 'F1',
    name: 'Formula 1',
    kr: '포뮬러 원',
    color: '#E10600',
    tag: '최정상',
    blurb: '세계 최고의 드라이버와 제조사가 겨루는 모터스포츠의 정점. 0.001초가 승패를 결정한다.',
    facts: [['시즌', '3월–12월'], ['경기', '연 24회'], ['포인트', '상위 10위'], ['타이어', '피렐리']],
  },
  {
    id: 'wec',
    short: 'WEC',
    name: 'FIA WEC',
    kr: '세계 내구 레이스',
    color: '#0E8C5A',
    tag: '인내',
    blurb: '르망 24시를 정점으로, 팀원 3인이 교대하며 밤낮을 달리는 내구 레이스의 명성.',
    facts: [['시즌', '3월–11월'], ['라운드', '연 8전'], ['하이라이트', '르망 24시'], ['클래스', '하이퍼카·GT3']],
  },
  {
    id: 'wrc',
    short: 'WRC',
    name: 'World Rally',
    kr: '세계 랠리 선수권',
    color: '#E8842B',
    tag: '공도',
    blurb: '코드라이버의 페이스노트에 의지해 눈·자갈·아스팔트를 가리지 않고 질주한다.',
    facts: [['시즌', '1월–11월'], ['라운드', '연 13전'], ['스테이지', '수백 km'], ['노면', '믹스드']],
  },
  {
    id: 'superrace',
    short: 'SR',
    name: 'CJ SuperRace',
    kr: '슈퍼레이스 챔피언십',
    color: '#2C5BD6',
    tag: '가장 가까운',
    blurb: '6.2L V8 스톡카가 굉음을 내뿜는, 한국에서 가장 가까이서 즐기는 현장의 레이스.',
    facts: [['시즌', '4월–11월'], ['라운드', '연 8전'], ['머신', '슈퍼6000'], ['홈', '인제·영암']],
  },
  {
    id: 'nfestival',
    short: 'N',
    name: 'Hyundai N Festival',
    kr: '현대 N 페스티벌',
    color: '#00A5C4',
    tag: '같은 출발',
    blurb: '동일 사양 양산차로 겨루는 원메이크. 차이를 만드는 건 오직 드라이버의 실력뿐이다.',
    facts: [['시즌', '4월–11월'], ['라운드', '연 6전'], ['머신', '아반떼 N'], ['클래스', '오픈·마스터즈']],
  },
]

export const SERIES_MAP: Record<SportId, Series> = Object.fromEntries(
  SERIES.map((s) => [s.id, s])
) as Record<SportId, Series>

// WEC 2026 → Race 인터페이스로 변환
const WEC_RACES: (Race & { sessions: RaceSession[] })[] = WEC_RACES_2026.map((w) => ({
  sport: 'wec' as const,
  round: w.round,
  name: w.name,
  circuit: w.circuit,
  loc: w.loc,
  date: w.raceDate,
  laps: w.duration,
  extra: w.country,
  tip: w.tip,
  sessions: w.sessions,
}))

// WRC 2026 → Race 인터페이스로 변환
const WRC_RACES: (Race & { sessions: RaceSession[] })[] = WRC_RACES_2026.map((w) => ({
  sport: 'wrc' as const,
  round: w.round,
  name: w.name,
  circuit: w.circuit,
  loc: w.loc,
  date: w.raceDate,
  laps: w.totalSS,
  extra: w.surface,
  tip: w.tip,
  sessions: w.sessions,
}))

const NON_WEC_RACES: Race[] = [
  { sport: 'superrace', round: 4, name: 'Round 4 · 인제', circuit: 'Inje Speedium', loc: '강원 인제', date: '2026-07-05T05:00:00Z', laps: '슈퍼6000', extra: '예선 토요일', tip: '한국 최고의 레이싱 트랙. 주말 현장의 열정이 뜨겁다.' },
  { sport: 'superrace', round: 5, name: 'Round 5 · 영암', circuit: 'KIC', loc: '전남 영암', date: '2026-08-09T05:00:00Z', laps: '슈퍼6000', extra: '나이트 경기', tip: '환상의 밤 경기. 헤드라이트 아래 펼쳐지는 드라마.' },
]

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function toRaceDisplay(r: Race & { sessions?: RaceSession[] }): RaceDisplay {
  const s = SERIES_MAP[r.sport]
  const d = new Date(r.date)
  const dd = String(d.getDate()).padStart(2, '0')
  return {
    ...r,
    color: s.color,
    sportName: s.name,
    sportShort: s.short,
    sportKr: s.kr,
    roundLabel: 'ROUND ' + r.round,
    day: dd,
    month: MONTHS[d.getMonth()],
    wday: WEEKDAYS[d.getDay()],
    dateLong: `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${dd}`,
    ts: d.getTime(),
    sessions: r.sessions,
  }
}

export function buildSchedule(f1Races: (Race & { sessions?: RaceSession[] })[] = []): RaceDisplay[] {
  const now = Date.now()
  const all = [...f1Races, ...WEC_RACES, ...WRC_RACES, ...NON_WEC_RACES]
  return all
    .map(toRaceDisplay)
    .filter((r) => r.ts > now - 3 * 60 * 60 * 1000)
    .sort((a, b) => a.ts - b.ts)
}

export const NEWS_ITEMS: NewsItem[] = [
  { sport: 'f1', tag: '분석', title: '미드시즌 판도 변화: 바닥 재설계의 이유', excerpt: '상위 팀들의 세컨드카가 대거 새로운 사양으로 투입된다. 무엇이 바뀐 걸까?', author: '편집부', read: '6분 읽기', big: true },
  { sport: 'wec', tag: '프리뷰', title: '르망 이후, 하이퍼카의 패배자들', excerpt: '3개 팀의 각축 중, 한 팀은 반드시 뒤처진다. 상파울루에서의 역전은 가능할까?', author: 'J. KIM', read: '4분 읽기' },
  { sport: 'wrc', tag: '피처', title: '페이스노트의 과학: 2초 안에 코스를 읽다', excerpt: '시속 180km에서 복잡한 턴을 암기하는 사람들의 언어 시스템을 해부했다.', author: '편집부', read: '5분 읽기' },
  { sport: 'superrace', tag: '국내', title: '슈퍼6000, 시즌 중반 라이벌 탄생', excerpt: '신인 드라이버들의 발전이 시리즈를 다시 쓰고 있다. 누가 최종 챔피언이 될까?', author: '박성진', read: '3분 읽기' },
  { sport: 'nfestival', tag: '입문', title: '아반떼 N, 같은 차로 펼치는 실력 싸움', excerpt: '원메이크 레이스에서는 모든 드라이버가 같은 출발선에 선다. 여기서 비로소 본질이 드러난다.', author: '편집부', read: '4분 읽기' },
]

export function buildNews(): NewsDisplay[] {
  return NEWS_ITEMS.map((n) => ({
    ...n,
    color: SERIES_MAP[n.sport].color,
    sportShort: SERIES_MAP[n.sport].short,
  }))
}
