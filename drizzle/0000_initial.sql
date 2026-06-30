CREATE TABLE IF NOT EXISTS "f1_sessions" (
  "session_key" integer PRIMARY KEY NOT NULL,
  "circuit_short_name" text NOT NULL,
  "country_name" text NOT NULL,
  "date_start" timestamp with time zone,
  "year" integer,
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "f1_drivers" (
  "id" serial PRIMARY KEY NOT NULL,
  "session_key" integer NOT NULL REFERENCES "f1_sessions"("session_key"),
  "driver_number" integer NOT NULL,
  "name_acronym" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "team_name" text NOT NULL,
  "team_colour" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  UNIQUE ("session_key", "driver_number")
);

CREATE TABLE IF NOT EXISTS "f1_track_speed_cache" (
  "id" serial PRIMARY KEY NOT NULL,
  "session_key" integer NOT NULL,
  "driver_number_a" integer NOT NULL,
  "driver_number_b" integer NOT NULL,
  "circuit_short_name" text NOT NULL,
  "speed_min" integer NOT NULL,
  "speed_max" integer NOT NULL,
  "view_box" integer NOT NULL,
  "driver_a_code" text NOT NULL,
  "driver_a_team_colour" text NOT NULL,
  "driver_a_lap_number" integer NOT NULL,
  "driver_a_lap_duration" real NOT NULL,
  "driver_a_points" jsonb NOT NULL,
  "driver_b_code" text NOT NULL,
  "driver_b_team_colour" text NOT NULL,
  "driver_b_lap_number" integer NOT NULL,
  "driver_b_lap_duration" real NOT NULL,
  "driver_b_points" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  UNIQUE ("session_key", "driver_number_a", "driver_number_b")
);
