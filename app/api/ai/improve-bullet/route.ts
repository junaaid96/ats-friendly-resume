import { NextRequest, NextResponse } from 'next/server';
import { improveBulletPoint } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { bulletPoint, jobTitle } = await request.json();

    if (!bulletPoint || !jobTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const improvements = await improveBulletPoint(bulletPoint, jobTitle);

    return NextResponse.json({ improvements });
  } catch (error) {
    console.error('Error in improve-bullet API:', error);
    return NextResponse.json(
      { error: 'Failed to improve bullet point' },
      { status: 500 }
    );
  }
}
