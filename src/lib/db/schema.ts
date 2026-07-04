import { pgTable, serial, integer, text, real, jsonb, timestamp, unique } from 'drizzle-orm/pg-core'
import type { TrackPoint } from '@/features/f1/trackSpeed'
import type { PitStrategyData } from '@/features/f1/pitStrategy'
import type { CornerAnalysisData } from '@/features/f1/cornerAnalysisBuild'

export const f1Sessions = pgTable('f1_sessions', {
  sessionKey: integer('session_key').primaryKey(),
  circuitShortName: text('circuit_short_name').notNull(),
  countryName: text('country_name').notNull(),
  dateStart: timestamp('date_start', { withTimezone: true }),
  year: integer('year'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const f1Drivers = pgTable('f1_drivers', {
  id: serial('id').primaryKey(),
  sessionKey: integer('session_key')
    .notNull()
    .references(() => f1Sessions.sessionKey),
  driverNumber: integer('driver_number').notNull(),
  nameAcronym: text('name_acronym').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  teamName: text('team_name').notNull(),
  teamColour: text('team_colour').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  unique().on(table.sessionKey, table.driverNumber),
])

export const f1PitStrategyCache = pgTable('f1_pit_strategy_cache', {
  sessionKey: integer('session_key').primaryKey(),
  data: jsonb('data').notNull().$type<PitStrategyData>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const f1CornerAnalysisCache = pgTable('f1_corner_analysis_cache', {
  sessionKey: integer('session_key').notNull(),
  algoVersion: integer('algo_version').notNull(),
  data: jsonb('data').notNull().$type<CornerAnalysisData>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  unique().on(table.sessionKey, table.algoVersion),
])

export const f1TrackSpeedCache = pgTable('f1_track_speed_cache', {
  id: serial('id').primaryKey(),
  sessionKey: integer('session_key').notNull(),
  // 항상 driverNumberA < driverNumberB 로 정렬하여 저장 (역순 요청도 동일 row 반환)
  driverNumberA: integer('driver_number_a').notNull(),
  driverNumberB: integer('driver_number_b').notNull(),
  circuitShortName: text('circuit_short_name').notNull(),
  speedMin: integer('speed_min').notNull(),
  speedMax: integer('speed_max').notNull(),
  viewBox: integer('view_box').notNull(),
  driverACode: text('driver_a_code').notNull(),
  driverATeamColour: text('driver_a_team_colour').notNull(),
  driverALapNumber: integer('driver_a_lap_number').notNull(),
  driverALapDuration: real('driver_a_lap_duration').notNull(),
  driverAPoints: jsonb('driver_a_points').notNull().$type<TrackPoint[]>(),
  driverBCode: text('driver_b_code').notNull(),
  driverBTeamColour: text('driver_b_team_colour').notNull(),
  driverBLapNumber: integer('driver_b_lap_number').notNull(),
  driverBLapDuration: real('driver_b_lap_duration').notNull(),
  driverBPoints: jsonb('driver_b_points').notNull().$type<TrackPoint[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => [
  unique().on(table.sessionKey, table.driverNumberA, table.driverNumberB),
])
