import { NextRequest, NextResponse } from 'next/server';
import { getResumeById, updateResume, deleteResume, OwnershipError } from '@/lib/storage';
import { sanitizeResume } from '@/lib/sanitize';

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

const EDIT_TOKEN_HEADER = 'x-edit-token';

function ownershipError(error: OwnershipError) {
  return error === 'not_found'
    ? NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    : NextResponse.json(
        { error: 'You can only change resumes created in this browser' },
        { status: 403 }
      );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resume = await getResumeById(id);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resume, { headers: NO_STORE });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resume = sanitizeResume(await request.json().catch(() => null), id);
    if (!resume) {
      return NextResponse.json({ error: 'Invalid resume data' }, { status: 400 });
    }

    const result = await updateResume(id, resume, request.headers.get(EDIT_TOKEN_HEADER));
    if (typeof result === 'string') return ownershipError(result);

    return NextResponse.json(result, { headers: NO_STORE });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteResume(id, request.headers.get(EDIT_TOKEN_HEADER));
    if (result !== true) return ownershipError(result);

    return NextResponse.json(
      { message: 'Resume deleted successfully' },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
