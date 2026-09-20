// Path: app/api/chapters/[id]/route.ts
// Status: OPDATERET (kan nu også opdatere title, ikke kun content — bruges af
// det redigerbare titel-felt i ChapterEditor)
// Formål: PATCH-endpoint kaldt af autosave i ChapterEditor. RLS sikrer at kun
// ejeren af bogen kan opdatere kapitlet.

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

  const { content, title } = await request.json()

  const update: { content?: Record<string, unknown>; title?: string } = {}
  if (content !== undefined) update.content = content
  if (title !== undefined) update.title = title

  const { error } = await supabase.from('chapters').update(update).eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
