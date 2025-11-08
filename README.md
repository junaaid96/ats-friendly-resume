# Arvix Resume Builder - ATS Friendly Resume Creator

A modern, minimalist resume builder application that creates ATS-friendly resumes. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ **ATS-Optimized** - Creates resumes that pass applicant tracking systems
- ✅ **Modern UI/UX** - Clean, minimalist design with red theme
- ✅ **Easy to Use** - Simple form-based resume creation
- ✅ **Free Forever** - Completely free to use
- ✅ **Persistent Storage** - Resumes saved to Vercel Postgres (free tier)
- ✅ **Print/PDF Export** - Export resumes as PDF
- ✅ **Shareable Links** - Share resumes with unique URLs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Vercel Postgres (free tier)
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ats-friendly-resume
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Local Storage

For local development, resumes are saved to `data/resumes.json`. No database setup required for local development!

## Deployment to Vercel

This app uses **Vercel Postgres** for persistent storage in production. The free tier is perfect for this application.

### Quick Deploy

1. **Create Vercel Postgres Database**:
   - Go to your Vercel Dashboard
   - Select your project → Storage tab
   - Click "Create Database" → Select "Postgres"
   - Choose "Hobby" (free) plan
   - Create the database

2. **Run Database Schema**:
   - Go to your Postgres database → Data tab
   - Use SQL Editor to run the schema from `lib/schema.sql`

3. **Deploy**:
   - Push your code to GitHub
   - Import repository in Vercel
   - Vercel will automatically configure the database connection
   - Deploy!

### Detailed Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## Project Structure

```
├── app/
│   ├── api/resumes/        # API routes for resumes
│   ├── create/             # Resume creation page
│   ├── resume/[id]/        # Resume view page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── ResumeForm.tsx      # Resume creation form
│   ├── PrintButton.tsx     # Print/PDF export
│   └── ShareResume.tsx     # Share functionality
├── lib/
│   ├── storage.ts          # Storage abstraction (Postgres/File)
│   └── schema.sql          # Database schema
└── types/
    └── resume.ts           # TypeScript interfaces
```

## Environment Variables

### Production (Vercel)
- `POSTGRES_URL` - Automatically set by Vercel when you create a Postgres database

### Local Development
- No environment variables needed (uses file system storage)

## Storage

- **Production**: Vercel Postgres (free tier - 256 MB)
- **Local Dev**: File system (`data/resumes.json`)

The app automatically detects the environment and uses the appropriate storage method.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

This project is open source and available under the MIT License.
