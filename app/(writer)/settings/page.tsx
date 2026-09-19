// Path: app/(writer)/settings/page.tsx
// Status: OPDATERET ("Foretrukket sprog" fjernet — kun dansk understøttes nu)
// Formål: "Settings"-sidebar-linket. Grundlæggende kontoindstillinger — kun navn.

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function updateSettings(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const display_name = formData.get('display_name') as string

  await supabase.from('profiles').update({ display_name }).eq('id', user.id)

  redirect('/settings')
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>

      <form action={updateSettings} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="display_name">
            Navn
          </label>
          <input
            id="display_name"
            name="display_name"
            defaultValue={profile?.display_name ?? ''}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Gem
        </button>
      </form>
    </div>
  )
}
