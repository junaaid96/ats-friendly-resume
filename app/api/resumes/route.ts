import { NextRequest, NextResponse } from 'next/server';
import { getAllResumes, saveResume } from '@/lib/storage';
import { Resume } from '@/types/resume';

// Explicitly export runtime configuration for Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const resumes = await getAllResumes();
    return NextResponse.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resume: Resume = body;

    // Validate required fields
    if (!resume.personalInfo || !resume.summary) {
      return NextResponse.json(
        { error: 'Missing required fields: personalInfo and summary are required' },
        { status: 400 }
      );
    }

    // Generate ID if not provided
    if (!resume.id) {
      resume.id = `resume-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }

    const savedResume = await saveResume(resume);
    return NextResponse.json(savedResume, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create resume', details: errorMessage },
      { status: 500 }
    );
  }
}
