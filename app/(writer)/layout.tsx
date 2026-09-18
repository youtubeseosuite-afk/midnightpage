// Path: app/(writer)/layout.tsx
// Status: NY
// Formål: Fælles skal for hele Writer's Space (inkl. /dashboard, /projects osv.).
// Henter brugerens navn og credit-saldo server-side og giver dem videre til Topbar.

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

export default async function WriterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/writer/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, credits_balance')
    .eq('id', user.id)
    .single()

  const userName = profile?.display_name || user.email?.split('@')[0] || 'Forfatter'
  const creditsBalance = profile?.credits_balance ?? 0

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="md:pl-64">
        <Topbar creditsBalance={creditsBalance} userName={userName} />
        <main>{children}</main>
      </div>
    </div>
  )
}
