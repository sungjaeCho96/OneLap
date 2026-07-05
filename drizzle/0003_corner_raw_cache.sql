CREATE TABLE IF NOT EXISTS "f1_corner_raw_cache" (
  "session_key" integer PRIMARY KEY NOT NULL,
  "data" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now()
);
