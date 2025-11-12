# Quick Start Guide - AI Features

Your 12 ATS-friendly templates and AI features are already integrated! Follow these steps to see them in action:

## Step 1: Get Your Free Groq API Key

1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up for a **free account** (no credit card required)
3. Navigate to **API Keys** section
4. Click **"Create API Key"**
5. Copy the key (you'll need it in the next step)

## Step 2: Set Up Environment Variables

### Option A: Create .env.local file manually

1. Create a file named `.env.local` in the root directory
2. Add this line (replace with your actual key):
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

### Option B: Use the example file

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local with your favorite editor
# Replace 'your_groq_api_key_here' with your actual key
```

## Step 3: Restart Your Development Server

**IMPORTANT**: You must restart the server after adding environment variables!

```bash
# Stop the current server (Ctrl+C)
# Then start it again
npm run dev
```

## Step 4: See the Features!

1. Open [http://localhost:3000](http://localhost:3000)
2. Click **"Create Resume"** button
3. You should now see:
   - **12 Template Options** at the top of the form
   - **AI Assistant Panel** with 5 tabs (Summary, Bullet Points, Skills, ATS Score, Template)

## Features You'll See

### 1. Template Selector
- Grid of 12 colorful template cards
- Live preview of each template
- Click any template to select it

### 2. AI Assistant
Located below the template selector with these tabs:

- **📝 Summary** - Generate professional summaries
- **✨ Bullet Points** - Improve achievement descriptions
- **🎯 Skills** - Get skill suggestions for your role
- **📊 ATS Score** - Real-time compatibility check
- **🎨 Template** - AI template recommendations

### 3. ATS Analyzer
After creating a resume:
- Click **"Analyze ATS Compatibility"**
- Get a score from 0-100
- See specific improvements and keywords

## Troubleshooting

### Templates not showing?
- ✅ Check that you're on the `/create` page
- ✅ Templates appear at the top of the form
- ✅ Look for "Choose Your Template" heading

### AI Assistant not working?
- ❌ **Most common issue**: No API key or server not restarted
- ✅ Verify `GROQ_API_KEY` is in `.env.local`
- ✅ Restart the dev server (stop and run `npm run dev` again)
- ✅ Check browser console for errors (F12)

### "GROQ_API_KEY is not configured" error?
- ✅ Make sure the file is named exactly `.env.local` (not `.env` or `.env.txt`)
- ✅ The key should be on a new line with no spaces around the `=`
- ✅ Restart the development server

### AI responses are slow?
- ✅ Groq is usually very fast (~800 tokens/sec)
- ✅ Check your internet connection
- ✅ Wait up to 5-10 seconds for first response

## Visual Guide

When you visit `/create`, you should see:

```
┌─────────────────────────────────────────────┐
│  [Back to Home]                             │
│                                             │
│         Create Your Resume                  │
│  Fill in your professional information      │
├─────────────────────────────────────────────┤
│  Choose Your Template                       │
│  [Template 1] [Template 2] [Template 3]...  │ ← 12 Templates
├─────────────────────────────────────────────┤
│  ⚡ AI Assistant                            │
│  📝 Summary | ✨ Bullet | 🎯 Skills | ...   │ ← AI Tabs
│  [AI features panel]                        │
├─────────────────────────────────────────────┤
│  Personal Information                       │
│  [Form fields...]                           │
│                                             │
│  ... rest of the form                       │
└─────────────────────────────────────────────┘
```

## Need More Help?

- Check [AI_FEATURES.md](./AI_FEATURES.md) for detailed documentation
- Check [README.md](./README.md) for general setup
- Look at browser console (F12) for error messages
- Make sure you're using Node.js 18+

## Success Checklist

- ✅ Groq API key obtained from console.groq.com
- ✅ `.env.local` file created with `GROQ_API_KEY=...`
- ✅ Development server restarted
- ✅ Can see 12 template options at `/create`
- ✅ Can see AI Assistant panel with 5 tabs
- ✅ AI features respond when clicked

If all boxes are checked, you're all set! 🎉
