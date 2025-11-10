import { NextRequest, NextResponse } from 'next/server';
import { generateImprovementReport } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const resume = await request.json();

    const report = await generateImprovementReport(resume);

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error in improvement-report API:', error);
    return NextResponse.json(
      { error: 'Failed to generate improvement report' },
      { status: 500 }
    );
  }
}
