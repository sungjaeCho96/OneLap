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
  dateStart: string
  dateEnd: string
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
