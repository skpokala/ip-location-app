import { NextResponse } from 'next/server';

export async function GET() {
  // Get the base URL from environment variable
  const baseUrl = process.env.NEXTAUTH_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { error: 'NEXTAUTH_URL not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: baseUrl });
}
