import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Only allow internal redirects (prevent open redirect)
  const rawNext = url.searchParams.get('next') ?? '/';
  const next = rawNext.startsWith('/') ? rawNext : '/';

  return NextResponse.redirect(new URL(next, url.origin));
}
