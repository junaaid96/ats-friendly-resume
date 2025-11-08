# Deployment Guide - Arvix Resume Builder

## Vercel Postgres Setup (Free Tier)

This application uses **Vercel Postgres** for persistent storage. The free tier includes:
- 256 MB storage
- 60 hours compute time per month
- Perfect for small to medium applications

### Step 1: Create Vercel Postgres Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create a new one)
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name for your database (e.g., `arvix-resume-db`)
7. Select the **Hobby** (free) plan
8. Click **Create**

### Step 2: Run Database Schema

1. After creating the database, go to the **Storage** tab in your project
2. Click on your Postgres database
3. Go to the **Data** tab
4. Click **Connect** or use the **SQL Editor**
5. Copy and paste the SQL from `lib/schema.sql`:

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

6. Click **Run** to execute the SQL

### Step 3: Environment Variables

Vercel automatically sets the `POSTGRES_URL` environment variable when you create a Postgres database. No manual configuration needed!

The app will automatically:
- Use Postgres when `POSTGRES_URL` is available (Vercel production)
- Fall back to file system when not available (local development)

### Step 4: Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js
4. The database connection will be automatically configured
5. Deploy!

### Local Development

For local development, the app uses file-based storage (no database required):

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Resumes will be saved to `data/resumes.json` locally

### Testing the Deployment

1. Visit your deployed Vercel URL
2. Create a resume
3. Verify it persists after page refresh
4. Check the Vercel Postgres dashboard to see your data

### Migration from File System to Postgres

If you have existing resumes in `data/resumes.json`, you can migrate them:

1. Export your local resumes (they're in JSON format)
2. Use the Vercel Postgres SQL Editor to insert them
3. Or create a migration script (optional)

### Troubleshooting

**Issue: Resumes not persisting on Vercel**
- Check that Vercel Postgres is connected to your project
- Verify the schema was created successfully
- Check Vercel logs for database connection errors

**Issue: Database connection errors**
- Ensure `POSTGRES_URL` is set in Vercel environment variables
- Verify the database is in the same project/region
- Check Vercel Postgres status

**Issue: Schema errors**
- Make sure you ran the SQL schema creation
- Check that the table name is `resumes` (lowercase)
- Verify JSONB columns are properly formatted

### Free Tier Limits

- **Storage**: 256 MB (thousands of resumes)
- **Compute**: 60 hours/month (plenty for a resume builder)
- **Connections**: Unlimited

For production with high traffic, consider upgrading to the Pro plan.

