# Troubleshooting 405 Method Not Allowed Error

## Issue
Getting `405 Method Not Allowed` when trying to POST to `/api/resumes`

## Solutions

### 1. **Verify Route File is Deployed**
The route file must be present in your deployment. Check:
- ✅ File exists at `app/api/resumes/route.ts`
- ✅ File exports both `GET` and `POST` functions
- ✅ No syntax errors in the route file

### 2. **Clear Build Cache and Redeploy**
Vercel might have cached an old build:

1. Go to Vercel Dashboard → Your Project → Settings
2. Scroll to "Build & Development Settings"
3. Clear build cache (if available)
4. Go to Deployments → Redeploy latest deployment

OR push a new commit:
```bash
git add .
git commit -m "Fix API route 405 error"
git push
```

### 3. **Verify Environment Variables**
Make sure `POSTGRES_URL` is set in Vercel:
- Go to Settings → Environment Variables
- Verify `POSTGRES_URL` exists and is set for Production/Preview

### 4. **Check Database Schema**
Ensure the database table exists:
- Go to Neon Dashboard → SQL Editor
- Run: `SELECT * FROM resumes LIMIT 1;`
- If table doesn't exist, run the schema from `lib/schema.sql`

### 5. **Test Route Locally**
Test the route works locally:
```bash
npm run dev
# Then test: curl -X POST http://localhost:3000/api/resumes -H "Content-Type: application/json" -d '{"personalInfo":{"fullName":"Test"},"summary":"Test"}'
```

### 6. **Check Vercel Logs**
1. Go to Vercel Dashboard → Your Project → Logs
2. Look for errors related to `/api/resumes`
3. Check for database connection errors

### 7. **Verify Next.js Version Compatibility**
The project uses Next.js 16.0.1. Make sure route handlers are supported:
- Route handlers should be in `app/api/[route]/route.ts`
- Export named functions: `export async function GET()`, `export async function POST()`

### 8. **Force Dynamic Rendering**
The route now includes:
```typescript
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
```
This ensures the route is handled correctly in production.

## Quick Fix Checklist

- [ ] Route file exists at `app/api/resumes/route.ts`
- [ ] Route file exports `POST` function
- [ ] No TypeScript/syntax errors
- [ ] Environment variables set in Vercel
- [ ] Database schema created
- [ ] Latest code deployed to Vercel
- [ ] Build cache cleared
- [ ] Checked Vercel logs for errors

## If Still Not Working

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Look for `/api/resumes` function
   - Check for runtime errors

2. **Test with curl**:
   ```bash
   curl -X POST https://arvix-resume.vercel.app/api/resumes \
     -H "Content-Type: application/json" \
     -d '{"personalInfo":{"fullName":"Test"},"summary":"Test summary"}'
   ```

3. **Verify Route is Accessible**:
   - Try GET: `https://arvix-resume.vercel.app/api/resumes`
   - Should return `[]` if no resumes, or an error if route doesn't exist

4. **Check for Middleware Issues**:
   - Verify no middleware is blocking the route
   - Check `middleware.ts` file if it exists

