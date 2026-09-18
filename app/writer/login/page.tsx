// Path: app/writer/login/page.tsx
// Status: NY
// Formål: Login-side. Bruger den delte AuthForm i login-mode.

import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Log ind</h1>
      <div className="mt-6">
        <AuthForm mode="login" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Ingen konto?{' '}
        <Link href="/writer/signup" className="text-primary underline">
          Opret en her
        </Link>
      </p>
    </div>
  )
}
