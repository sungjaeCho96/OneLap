CREATE TABLE IF NOT EXISTS "f1_pit_strategy_cache" (
  "session_key" integer PRIMARY KEY NOT NULL,
  "data" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);
