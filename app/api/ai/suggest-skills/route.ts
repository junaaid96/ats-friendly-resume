import { NextRequest, NextResponse } from 'next/server';
import { suggestSkills } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, currentSkills } = await request.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    const skills = await suggestSkills(jobTitle, currentSkills || []);

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error in suggest-skills API:', error);
    return NextResponse.json(
      { error: 'Failed to suggest skills' },
      { status: 500 }
    );
  }
}
