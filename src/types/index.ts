export type SportId = 'f1' | 'wec' | 'wrc' | 'superrace' | 'nfestival'

export interface Series {
  id: SportId
  short: string
  name: string
  kr: string
  color: string
  tag: string
  blurb: string
  facts: [string, string][]
}

export interface Race {
  sport: SportId
  round: number
  name: string
  circuit: string
  loc: string
  date: string
  laps: string
  extra: string
  tip: string
}

export interface RaceSession {
  name: string
  dateStart: string  // ISO 8601 또는 'YYYY-MM-DD' (시간 미확정)
  dateEnd?: string
  tbc?: boolean      // 시간 미확정
}

export interface RaceDisplay extends Race {
  color: string
  sportName: string
  sportShort: string
  sportKr: string
  roundLabel: string
  day: string
  month: string
  wday: string
  dateLong: string
  ts: number
  timeLabel: string
  isLive: boolean
  sessions?: RaceSession[]
}

export interface NewsItem {
  sport: SportId
  tag: string
  title: string
  excerpt: string
  author: string
  read: string
  big?: boolean
  imageUrl?: string
}

export interface NewsDisplay extends NewsItem {
  color: string
  sportShort: string
}

export interface FilterOption {
  id: string
  label: string
}
