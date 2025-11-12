import { NextRequest, NextResponse } from 'next/server';
import { recommendTemplate } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const resume = await request.json();

    const recommendation = await recommendTemplate(resume);

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error('Error in recommend-template API:', error);
    return NextResponse.json(
      { error: 'Failed to recommend template' },
      { status: 500 }
    );
  }
}
