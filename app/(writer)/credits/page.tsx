// Path: app/(writer)/credits/page.tsx
// Status: NY
// Formål: "Credit Store"-sidebar-linket. Viser den faktiske saldo fra
// profiles.credits_balance. Selve købsflowet (Stripe) er trin 8 i roadmappen
// og er ikke bygget endnu, så det er markeret ærligt som kommende.

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CreditsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', user.id)
    .single()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Credit Store</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Din nuværende saldo: <strong>{profile?.credits_balance ?? 0} credits</strong>
      </p>

      <div className="mt-8 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        Køb af credits via Stripe er endnu ikke sat op — det er trin 8 i roadmappen.
      </div>
    </div>
  )
}
