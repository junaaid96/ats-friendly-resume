# AI-Enhanced Resume Builder

This branch includes powerful AI features powered by **Groq API** using the **LLaMA 3.3 70B** model.

## Features Overview

### 1. AI Assistant (Resume Creation)

An integrated AI assistant that helps you create professional resume content:

- **Summary Generation**: Generate 3 professional summary variations based on your job title, experience, and skills
- **Bullet Point Improvement**: Transform basic job descriptions into achievement-oriented statements
- **Skill Suggestions**: Get relevant skill recommendations based on your role
- **ATS Optimization**: Real-time analysis of your resume's ATS compatibility
- **Template Recommendations**: AI-powered template suggestions based on your profile

### 2. ATS Analyzer (Resume Review)

Comprehensive ATS compatibility analysis for completed resumes:

- **ATS Score**: Get a 0-100 compatibility score
- **Improvement Suggestions**: Specific actionable recommendations
- **Keyword Recommendations**: Industry-relevant keywords to include
- **Visual Report**: Beautiful, easy-to-understand analysis display

### 3. 12 ATS-Friendly Templates

Choose from 12 professionally designed templates:

1. Classic Red - Traditional and bold
2. Modern Blue - Clean and corporate
3. Professional Navy - Executive and authoritative
4. Creative Purple - Vibrant and innovative
5. Tech Teal - Modern tech professional
6. Elegant Emerald - Growth and prosperity
7. Minimalist Slate - Simple and timeless
8. Warm Orange - Energetic and dynamic
9. Corporate Indigo - Serious and dependable
10. Vibrant Pink - Creative and confident
11. Traditional Black - Ultra-professional
12. Fresh Cyan - Innovative and modern

All templates maintain ATS compatibility with:
- Simple, clean layouts
- Semantic HTML structure
- Black text on white background for printing
- No complex graphics or tables

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Optional: Database Configuration
POSTGRES_URL=your_postgres_url
DATABASE_URL=your_database_url
```

### 2. Get Groq API Key

1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## AI Features Usage

### During Resume Creation

1. **Template Selection**: Choose from 12 templates or get AI recommendations
2. **AI Assistant Panel**: Located below template selection
   - **Summary Tab**: Generate professional summaries
   - **Bullet Points Tab**: Improve your achievements
   - **Skills Tab**: Get skill suggestions
   - **ATS Score Tab**: Check compatibility score
   - **Template Tab**: Get AI template recommendations

### After Resume Creation

1. Navigate to your completed resume
2. Click **"Analyze ATS Compatibility"** button
3. View comprehensive analysis:
   - ATS Score (0-100)
   - Specific improvement suggestions
   - Recommended keywords
4. Make improvements and re-analyze

## API Endpoints

All AI features are accessible via REST API:

### Generate Summary
```
POST /api/ai/generate-summary
Body: { jobTitle, yearsExperience, keySkills }
```

### Improve Bullet Point
```
POST /api/ai/improve-bullet
Body: { bulletPoint, jobTitle }
```

### Suggest Skills
```
POST /api/ai/suggest-skills
Body: { jobTitle, currentSkills }
```

### Analyze ATS
```
POST /api/ai/analyze-ats
Body: { resume object }
```

### Recommend Template
```
POST /api/ai/recommend-template
Body: { resume object }
```

### Generate Improvement Report
```
POST /api/ai/improvement-report
Body: { resume object }
```

## Technical Architecture

### AI Service Layer (`lib/ai-service.ts`)

Core AI functions that interact with Groq API:
- `generateSummary()` - Create professional summaries
- `improveBulletPoint()` - Enhance bullet points
- `analyzeATSOptimization()` - Analyze ATS compatibility
- `recommendTemplate()` - Suggest best template
- `suggestSkills()` - Recommend relevant skills
- `generateImprovementReport()` - Comprehensive resume review

### Components

- **AIAssistant** (`components/AIAssistant.tsx`) - Multi-tab AI assistant interface
- **ATSAnalyzer** (`components/ATSAnalyzer.tsx`) - Visual ATS analysis component
- **TemplateSelector** (`components/TemplateSelector.tsx`) - Template selection with previews

### API Routes

Located in `app/api/ai/`:
- `generate-summary/route.ts`
- `improve-bullet/route.ts`
- `suggest-skills/route.ts`
- `analyze-ats/route.ts`
- `recommend-template/route.ts`
- `improvement-report/route.ts`

## Model Information

**Model**: LLaMA 3.3 70B Versatile
**Provider**: Groq
**Speed**: Ultra-fast inference (~800 tokens/sec)
**Cost**: Free tier available
**Context**: 32,768 tokens

## Best Practices

### For Users

1. **Be Specific**: Provide detailed job titles and experience levels for better AI suggestions
2. **Iterate**: Use AI suggestions as starting points and refine them
3. **ATS Optimization**: Run ATS analysis before finalizing your resume
4. **Keywords**: Incorporate suggested keywords naturally throughout your resume
5. **Template Choice**: Consider AI template recommendations but choose what feels right

### For Developers

1. **API Key Security**: Never commit API keys to version control
2. **Error Handling**: AI calls may fail - always have fallbacks
3. **Rate Limiting**: Groq free tier has limits - implement rate limiting if needed
4. **Caching**: Consider caching AI responses to reduce API calls
5. **User Experience**: Show loading states clearly during AI operations

## Troubleshooting

### API Key Not Working

- Verify key is correctly set in `.env.local`
- Restart development server after adding environment variables
- Check Groq console for usage limits

### AI Responses are Slow

- Groq is typically very fast; check your internet connection
- Ensure you're using the correct model (`llama-3.3-70b-versatile`)

### JSON Parsing Errors

- AI responses may occasionally not be valid JSON
- Error handling includes fallbacks for these cases
- Check console logs for detailed error messages

### Build Errors

- Run `npx tsc --noEmit` to check for TypeScript errors
- Ensure all dependencies are installed: `npm install`

## Future Enhancements

Potential improvements for future versions:

- [ ] Resume scoring algorithm
- [ ] Industry-specific resume templates
- [ ] Multi-language resume support
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Resume comparison tool
- [ ] Export to more formats (DOCX, LaTeX)
- [ ] Integration with job boards
- [ ] Real-time collaboration
- [ ] Version history and tracking

## Contributing

When adding new AI features:

1. Add service function to `lib/ai-service.ts`
2. Create API route in `app/api/ai/`
3. Update components to use new API
4. Add documentation to this file
5. Test thoroughly with various inputs

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review Groq API documentation: [https://console.groq.com/docs](https://console.groq.com/docs)

---

**Note**: This is an educational project showcasing AI integration with modern web applications. Always review and customize AI-generated content before using in real job applications.
