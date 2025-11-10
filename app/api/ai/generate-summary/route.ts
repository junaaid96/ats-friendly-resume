import { NextRequest, NextResponse } from 'next/server';
import { generateSummary } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, yearsExperience, keySkills } = await request.json();

    if (!jobTitle || !yearsExperience || !keySkills) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const summaries = await generateSummary(jobTitle, yearsExperience, keySkills);

    return NextResponse.json({ summaries });
  } catch (error) {
    console.error('Error in generate-summary API:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
