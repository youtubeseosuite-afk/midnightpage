// Path: middleware.ts
// Status: NY
// Formål: Kører på hvert request. Sørger for at Supabase-sessionen refreshes,
// og redirecter uautentificerede brugere væk fra Writer's Space.

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
