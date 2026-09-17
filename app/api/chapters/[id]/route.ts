// Path: app/api/chapters/[id]/route.ts
// Status: NY
// Formål: PATCH-endpoint kaldt af autosave i ChapterEditor. Opdaterer kun content-kolonnen.
// RLS sikrer at kun ejeren af bogen kan opdatere kapitlet.

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

  const { content } = await request.json()

  const { error } = await supabase
    .from('chapters')
    .update({ content })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
