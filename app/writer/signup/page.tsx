// Path: app/writer/signup/page.tsx
// Status: NY
// Formål: Signup-side. Bruger den delte AuthForm i signup-mode.

import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'

export default function SignupPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Opret konto</h1>
      <div className="mt-6">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Har du allerede en konto?{' '}
        <Link href="/writer/login" className="text-primary underline">
          Log ind her
        </Link>
      </p>
    </div>
  )
}
