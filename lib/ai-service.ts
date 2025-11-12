/**
 * AI Service for Resume Enhancement using Groq API
 *
 * Features:
 * - Resume content generation and improvement
 * - ATS keyword optimization
 * - Template recommendations
 * - Professional writing suggestions
 */

import { Resume } from '@/types/resume';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Free tier model

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Call Groq API with streaming disabled
 */
async function callGroqAPI(messages: GroqMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data: GroqResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
}

/**
 * Generate professional summary suggestions
 */
export async function generateSummary(
  jobTitle: string,
  yearsExperience: string,
  keySkills: string[]
): Promise<string[]> {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an expert resume writer specializing in creating ATS-friendly professional summaries. Provide 3 different variations of professional summaries that are concise (2-3 sentences), impactful, and keyword-rich.',
    },
    {
      role: 'user',
      content: `Generate 3 professional summary variations for:
Job Title: ${jobTitle}
Years of Experience: ${yearsExperience}
Key Skills: ${keySkills.join(', ')}

Format: Return ONLY a JSON array of 3 strings, nothing else. Example: ["summary1", "summary2", "summary3"]`,
    },
  ];

  try {
    const response = await callGroqAPI(messages);
    const summaries = JSON.parse(response);
    return Array.isArray(summaries) ? summaries : [response];
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary suggestions');
  }
}

/**
 * Improve work experience bullet points
 */
export async function improveBulletPoint(bulletPoint: string, jobTitle: string): Promise<string[]> {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an expert resume writer. Improve resume bullet points to be more impactful, quantifiable, and ATS-friendly. Use strong action verbs and include metrics when possible.',
    },
    {
      role: 'user',
      content: `Improve this resume bullet point for a ${jobTitle}:
"${bulletPoint}"

Provide 3 improved versions that are:
- Action-oriented (start with strong verbs)
- Quantifiable (include metrics if applicable)
- Achievement-focused
- ATS-friendly

Format: Return ONLY a JSON array of 3 strings, nothing else.`,
    },
  ];

  try {
    const response = await callGroqAPI(messages);
    const improvements = JSON.parse(response);
    return Array.isArray(improvements) ? improvements : [response];
  } catch (error) {
    console.error('Error improving bullet point:', error);
    throw new Error('Failed to improve bullet point');
  }
}

/**
 * Analyze resume for ATS optimization
 */
export async function analyzeATSOptimization(resume: Partial<Resume>): Promise<{
  score: number;
  suggestions: string[];
  keywords: string[];
}> {
  const resumeText = JSON.stringify({
    summary: resume.summary,
    experience: resume.experience?.map(exp => ({
      position: exp.position,
      company: exp.company,
      responsibilities: exp.responsibilities,
    })),
    skills: resume.skills,
  });

  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an ATS (Applicant Tracking System) optimization expert. Analyze resumes and provide actionable suggestions to improve ATS compatibility and keyword optimization.',
    },
    {
      role: 'user',
      content: `Analyze this resume for ATS optimization:
${resumeText}

Provide:
1. An ATS compatibility score (0-100)
2. 5-7 specific improvement suggestions
3. 8-10 important keywords that should be included

Format: Return ONLY a JSON object with this exact structure:
{
  "score": number,
  "suggestions": ["suggestion1", "suggestion2", ...],
  "keywords": ["keyword1", "keyword2", ...]
}`,
    },
  ];

  try {
    const response = await callGroqAPI(messages);
    const analysis = JSON.parse(response);
    return {
      score: analysis.score || 70,
      suggestions: analysis.suggestions || [],
      keywords: analysis.keywords || [],
    };
  } catch (error) {
    console.error('Error analyzing ATS optimization:', error);
    throw new Error('Failed to analyze resume');
  }
}

/**
 * Recommend template based on resume content
 */
export async function recommendTemplate(resume: Partial<Resume>): Promise<{
  templateId: string;
  reason: string;
}> {
  const resumeProfile = {
    summary: resume.summary?.substring(0, 200),
    yearsExperience: resume.experience?.length || 0,
    hasProjects: (resume.projects?.length || 0) > 0,
    hasCertifications: (resume.certifications?.length || 0) > 0,
    skillCount: resume.skills?.length || 0,
  };

  const templates = [
    'classic-red', 'modern-blue', 'professional-navy', 'creative-purple',
    'tech-teal', 'elegant-emerald', 'minimalist-slate', 'warm-orange',
    'corporate-indigo', 'vibrant-pink', 'traditional-black', 'fresh-cyan'
  ];

  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are a resume design consultant. Recommend the most appropriate template based on the candidate\'s profile and industry.',
    },
    {
      role: 'user',
      content: `Based on this resume profile:
${JSON.stringify(resumeProfile, null, 2)}

Available templates:
${templates.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Recommend the best template and explain why in 1-2 sentences.

Format: Return ONLY a JSON object:
{
  "templateId": "template-name",
  "reason": "Brief explanation"
}`,
    },
  ];

  try {
    const response = await callGroqAPI(messages);
    const recommendation = JSON.parse(response);
    return {
      templateId: recommendation.templateId || 'classic-red',
      reason: recommendation.reason || 'Recommended based on your profile',
    };
  } catch (error) {
    console.error('Error recommending template:', error);
    return {
      templateId: 'classic-red',
      reason: 'Default professional template',
    };
  }
}

/**
 * Generate skill suggestions based on job title and experience
 */
export async function suggestSkills(
  jobTitle: string,
  currentSkills: string[]
): Promise<string[]> {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are a career advisor. Suggest relevant technical and soft skills for specific job roles.',
    },
    {
      role: 'user',
      content: `For a ${jobTitle} position, suggest 10 relevant skills that are not in this list:
Current skills: ${currentSkills.join(', ')}

Focus on:
- Technical skills
- Industry-standard tools
- Soft skills
- Certifications

Format: Return ONLY a JSON array of 10 skill strings.`,
    },
  ];

  try {
    const response = await callGroqAPI(messages);
    const skills = JSON.parse(response);
    return Array.isArray(skills) ? skills : [];
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return [];
  }
}

/**
 * Generate complete resume improvement report
 */
export async function generateImprovementReport(resume: Partial<Resume>): Promise<{
  overall: string;
  sections: {
    summary: string[];
    experience: string[];
    skills: string[];
    format: string[];
  };
}> {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are a professional resume reviewer. Provide comprehensive, actionable feedback to improve resume quality and ATS compatibility.',
    },
    {
      role: 'user',
      content: `Review this resume and provide specific improvement suggestions:
${JSON.stringify(resume, null, 2)}

Format: Return ONLY a JSON object:
{
  "overall": "2-3 sentence overall assessment",
  "sections": {
    "summary": ["suggestion1", "suggestion2"],
    "experience": ["suggestion1", "suggestion2", "suggestion3"],
    "skills": ["suggestion1", "suggestion2"],
    "format": ["suggestion1", "suggestion2"]
  }
}`,
    },
  ];

  try {
    const response = await callGroqAPI(messages);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating improvement report:', error);
    throw new Error('Failed to generate improvement report');
  }
}
