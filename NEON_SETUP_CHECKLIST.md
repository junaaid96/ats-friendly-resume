# Neon Database Setup Checklist ✅

## ✅ Step 1: Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Key**: `POSTGRES_URL`
   - **Value**: `postgresql://neondb_owner:npg_QWsO5ZvqTDU6@ep-solitary-sunset-a1h5e0nu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development

**Important**: Vercel might have automatically added this when you connected Neon. Check if it's already there!

## ✅ Step 2: Run Database Schema

1. Go to your **Neon Dashboard** (https://console.neon.tech)
2. Select your database project
3. Click on **SQL Editor** in the left sidebar
4. Copy and paste this SQL:

```sql
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

CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON resumes(updated_at DESC);
```

5. Click **Run** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
6. You should see "Success" message

## ✅ Step 3: Verify Schema Created

1. In Neon Dashboard, go to **Tables** in the left sidebar
2. You should see a `resumes` table
3. Click on it to verify the columns exist

## ✅ Step 4: Redeploy Your Application

1. Go to your Vercel project dashboard
2. Navigate to **Deployments** tab
3. Click the **"⋯"** (three dots) menu on your latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete

**OR** push a new commit to trigger automatic deployment:
```bash
git add .
git commit -m "Configure Neon database"
git push
```

## ✅ Step 5: Test Your Application

1. Visit your deployed Vercel URL
2. Create a new resume
3. Verify it saves successfully
4. Refresh the page - the resume should still be there
5. Check Neon Dashboard → Tables → `resumes` → Data to see your saved resume

## 🔍 Troubleshooting

### Issue: "Table does not exist" error
- **Solution**: Make sure you ran the SQL schema in Step 2
- Verify the table exists in Neon Dashboard → Tables

### Issue: Connection errors
- **Solution**: 
  - Verify `POSTGRES_URL` is set in Vercel Environment Variables
  - Check that the database is not paused (Neon free tier auto-pauses)
  - In Neon Dashboard, click "Resume" if the database is paused

### Issue: Resumes not saving
- **Solution**:
  - Check Vercel deployment logs for errors
  - Verify environment variables are set for the correct environment (Production/Preview)
  - Make sure the schema was created successfully

### Issue: Database is paused
- **Solution**: 
  - Neon free tier databases auto-pause after inactivity
  - Go to Neon Dashboard and click "Resume" to wake it up
  - The first request after pausing may take a few seconds

## 🎉 Success!

Once you've completed all steps, your application should be:
- ✅ Connected to Neon database
- ✅ Saving resumes to PostgreSQL
- ✅ Persisting data across deployments
- ✅ Ready for production use!

## 📝 Notes

- **Local Development**: The app will still use file system storage (`data/resumes.json`) when `POSTGRES_URL` is not set locally
- **Free Tier**: Neon free tier is perfect for development and small projects
- **Auto-pause**: Free tier databases auto-pause after inactivity - this is normal and they resume automatically on first request

