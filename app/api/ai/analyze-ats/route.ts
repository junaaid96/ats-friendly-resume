import { NextRequest, NextResponse } from 'next/server';
import { analyzeATSOptimization } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const resume = await request.json();

    const analysis = await analyzeATSOptimization(resume);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze-ats API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
