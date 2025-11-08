import { NextRequest, NextResponse } from 'next/server';
import { getAllResumes, saveResume } from '@/lib/storage';
import { Resume } from '@/types/resume';

export async function GET() {
  try {
    const resumes = getAllResumes();
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
    const resume: Resume = await request.json();

    // Generate ID if not provided
    if (!resume.id) {
      resume.id = `resume-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const savedResume = saveResume(resume);
    return NextResponse.json(savedResume, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
