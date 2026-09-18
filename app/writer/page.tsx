// Path: app/writer/page.tsx
// Status: NY
// Formål: Platformens indgang — offentlig landingpage med links til signup og login.

import Link from 'next/link'

export default function WriterLandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Midnight Page</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Din AI-drevne skrivepartner. Byg karakterer, skriv kapitler, og udgiv dine
        historier — på dit eget sprog.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/writer/signup"
          className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Opret konto
        </Link>
        <Link href="/writer/login" className="rounded-md border px-6 py-3 text-sm font-medium">
          Log ind
        </Link>
      </div>
    </div>
  )
}
