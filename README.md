# Arvix Resume Builder - ATS Friendly Resume Creator

A modern, minimalist resume builder application that creates ATS-friendly resumes. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✅ **ATS-Optimized** - Creates resumes that pass applicant tracking systems
- ✅ **AI-Powered** - Groq LLaMA 3.3 AI for content generation and optimization
- ✅ **12 Professional Templates** - Choose from 12 ATS-friendly designs
- ✅ **AI Assistant** - Summary generation, bullet point improvement, skill suggestions
- ✅ **ATS Analyzer** - Real-time compatibility scoring and recommendations
- ✅ **Modern UI/UX** - Clean, minimalist design with customizable themes
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

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local and add your Groq API key
# Get a free API key from: https://console.groq.com/
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

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

### Required for AI Features
- `GROQ_API_KEY` - Your Groq API key for AI features (get one free at [console.groq.com](https://console.groq.com/))

### Production (Vercel)
- `POSTGRES_URL` - Automatically set by Vercel when you create a Postgres database

### Local Development
- `GROQ_API_KEY` - Required for AI features
- File system storage used by default (no database needed)

## Storage

- **Production**: Vercel Postgres (free tier - 256 MB)
- **Local Dev**: File system (`data/resumes.json`)

The app automatically detects the environment and uses the appropriate storage method.

## AI Features

### Template Selection
Choose from **12 professionally designed ATS-friendly templates**:
- Classic Red, Modern Blue, Professional Navy, Creative Purple
- Tech Teal, Elegant Emerald, Minimalist Slate, Warm Orange
- Corporate Indigo, Vibrant Pink, Traditional Black, Fresh Cyan

### AI Assistant (During Resume Creation)
- **Summary Generation**: Create 3 professional summary variations
- **Bullet Point Improvement**: Transform descriptions into achievement statements
- **Skill Suggestions**: Get relevant skills for your role
- **ATS Score**: Check real-time compatibility
- **Template Recommendations**: AI-powered design suggestions

### ATS Analyzer (After Resume Creation)
- Comprehensive ATS compatibility analysis
- Score from 0-100
- Specific improvement suggestions
- Keyword recommendations

For detailed AI features documentation, see [AI_FEATURES.md](./AI_FEATURES.md)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

This project is open source and available under the MIT License.
