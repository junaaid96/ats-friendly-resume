import { NextRequest, NextResponse } from 'next/server';
import { getAllResumes, saveResume } from '@/lib/storage';
import { Resume } from '@/types/resume';

export async function GET() {
  try {
    const resumes = await getAllResumes();
    return NextResponse.json(resumes, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
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

    const savedResume = await saveResume(resume);
    return NextResponse.json(savedResume, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
