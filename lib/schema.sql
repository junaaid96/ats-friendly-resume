-- Vercel Postgres Schema for Arvix Resume Builder
-- Run this SQL in your Vercel Postgres database after creating it

CREATE TABLE IF NOT EXISTS resumes (
  id VARCHAR(255) PRIMARY KEY,
  personal_info JSONB NOT NULL,
  summary TEXT NOT NULL,
  experience JSONB NOT NULL DEFAULT '[]'::jsonb,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  template VARCHAR(50) DEFAULT 'classic-red',
  -- Section order / visibility chosen in the editor
  settings JSONB DEFAULT '{}'::jsonb,
  -- SHA-256 of the owner's edit token (the token itself is only kept in their browser)
  edit_token_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);

-- Create index on updated_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON resumes(updated_at DESC);


-- Upgrading an existing database (the app also runs these automatically on first use):
-- ALTER TABLE resumes ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;
-- ALTER TABLE resumes ADD COLUMN IF NOT EXISTS edit_token_hash TEXT;
