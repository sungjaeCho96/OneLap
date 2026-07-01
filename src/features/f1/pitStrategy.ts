export type TyreCompound = 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET' | 'UNKNOWN'

export const TYRE_COLORS: Record<TyreCompound, string> = {
  SOFT: '#E8002D',
  MEDIUM: '#FFF200',
  HARD: '#FFFFFF',
  INTERMEDIATE: '#39B54A',
  WET: '#0067FF',
  UNKNOWN: '#857A6A',
} as const

export const TYRE_LABELS: Record<TyreCompound, string> = {
  SOFT: '소프트',
  MEDIUM: '미디엄',
  HARD: '하드',
  INTERMEDIATE: '인터미디엇',
  WET: '웻',
  UNKNOWN: '미상',
} as const

export interface RaceSession {
  sessionKey: number
  circuitShortName: string
  countryName: string
  dateStart: string
  round: number
}

export interface Stint {
  stintNumber: number
  compound: TyreCompound
  lapStart: number
  lapEnd: number
  lapCount: number
  tyreAgeAtStart: number
  pitDuration: number | null // 첫 스틴트는 null
}

export type RaceStatus = 'DNF' | 'DNS' | 'DSQ' | null

export interface DriverStrategy {
  driverNumber: number
  nameAcronym: string
  teamName: string
  teamColour: string // 항상 '#RRGGBB'
  stints: readonly Stint[]
  pitCount: number
  totalLaps: number
  raceStatus: RaceStatus // 완주는 null
}

export interface PitStrategyData {
  sessionKey: number
  circuitShortName: string
  countryName: string
  totalLaps: number
  drivers: readonly DriverStrategy[]
}

export interface PitStrategyResponse {
  success: boolean
  data?: PitStrategyData
  error?: string
}
