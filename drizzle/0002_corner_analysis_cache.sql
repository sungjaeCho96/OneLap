CREATE TABLE IF NOT EXISTS "f1_corner_analysis_cache" (
  "session_key" integer NOT NULL,
  "algo_version" integer NOT NULL,
  "data" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  UNIQUE ("session_key", "algo_version")
);
