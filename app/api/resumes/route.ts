import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createResume } from '@/lib/storage';
import { sanitizeResume } from '@/lib/sanitize';

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// There is deliberately no GET here: resumes hold personal contact details,
// so they are only readable one at a time by their unguessable share link.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const id = `resume-${Date.now()}-${randomBytes(9).toString('base64url')}`;
    const resume = sanitizeResume(body, id);

    if (!resume) {
      return NextResponse.json({ error: 'Invalid resume data' }, { status: 400 });
    }

    const { resume: saved, editToken } = await createResume(resume);
    // The edit token is only ever returned here; the client keeps it locally.
    return NextResponse.json({ ...saved, editToken }, { status: 201, headers: NO_STORE });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
