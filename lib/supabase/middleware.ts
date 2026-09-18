// Path: lib/supabase/middleware.ts
// Status: OPDATERET (redirect-mål rettet fra /login til /writer/login)
// Formål: Refresher Supabase auth-cookies på hvert request (kræves af @supabase/ssr)
// og redirecter til /login hvis en uautentificeret bruger rammer /projects.

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Vigtigt: rør ikke ved koden mellem createServerClient og getUser() —
  // det kan give svær-at-debugge session-bugs (se Supabase SSR-docs).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    request.nextUrl.pathname.startsWith('/projects') &&
    !request.nextUrl.pathname.startsWith('/writer')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/writer/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
