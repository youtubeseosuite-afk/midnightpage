// Path: app/api/projects/[id]/route.ts
// Status: NY
// Formål: Generisk PATCH-endpoint til projekt-felter. Bruges lige nu kun til
// plot_notes (autosave fra Story Bible-panelet), men holdt generisk så andre
// felter kan opdateres samme vej senere.

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plot_notes } = await request.json()

  const { error } = await supabase
    .from('projects')
    .update({ plot_notes })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
