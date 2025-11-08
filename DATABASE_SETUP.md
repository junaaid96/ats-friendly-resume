# Database Setup Guide

## Quick Setup Instructions

### Step 1: Choose Your Database Provider

**Recommended: Neon (Serverless Postgres)**
- Go to your Vercel project → Storage tab
- Under "Marketplace Database Providers", click **"Create"** under **Neon**
- Choose the **Free** tier (perfect for development)
- Complete the setup

**Alternative: Vercel Postgres (if available)**
- Click **"Create Database"** button
- Select **Postgres**
- Choose **Hobby** (free) plan

### Step 2: Run Database Schema

After creating your database:

1. **For Vercel Postgres:**
   - Go to Storage tab → Click on your Postgres database
   - Go to **Data** tab → Click **SQL Editor**
   - Copy and paste the SQL from `lib/schema.sql`
   - Click **Run**

2. **For Neon:**
   - Go to your Neon dashboard
   - Open **SQL Editor**
   - Copy and paste the SQL from `lib/schema.sql`
   - Click **Run**

### Step 3: Verify Environment Variables

Vercel should automatically set the `POSTGRES_URL` environment variable. To verify:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Check that `POSTGRES_URL` is set (it should be auto-configured)

### Step 4: Redeploy

After setting up the database:

1. Go to **Deployments** tab
2. Click the **"⋯"** menu on your latest deployment
3. Click **Redeploy**

Or push a new commit to trigger automatic deployment.

## Schema SQL

```sql
-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id VARCHAR(255) PRIMARY KEY,
  personal_info JSONB NOT NULL,
  summary TEXT NOT NULL,
  experience JSONB NOT NULL DEFAULT '[]'::jsonb,
  education JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON resumes(updated_at DESC);
```

## Troubleshooting

### Database Connection Issues

If you're getting connection errors:

1. **Check Environment Variables:**
   - Make sure `POSTGRES_URL` is set in Vercel
   - The variable should be available in all environments (Production, Preview, Development)

2. **Check Database Status:**
   - Ensure your database is running (not paused)
   - For Neon free tier, databases auto-pause after inactivity

3. **Verify Schema:**
   - Make sure you've run the schema SQL
   - Check that the `resumes` table exists

### Local Development

For local development, the app uses file system storage (`data/resumes.json`) when `POSTGRES_URL` is not set. No database setup needed for local dev!

## Support

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Neon Docs](https://neon.tech/docs)
- [Supabase Docs](https://supabase.com/docs)

