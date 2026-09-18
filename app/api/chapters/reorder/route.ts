// Path: app/api/chapters/reorder/route.ts
// Status: NY
// Formål: Opdaterer order_index for kapitler i en bog efter drag-and-drop i
// Outline sidebar. RLS på chapters (via books.user_id) sikrer at kun ejeren
// kan opdatere.

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { bookId, orderedIds } = await request.json()

  if (!bookId || !Array.isArray(orderedIds)) {
    return NextResponse.json({ error: 'Ugyldige felter' }, { status: 400 })
  }

  await Promise.all(
    orderedIds.map((chapterId: string, index: number) =>
      supabase
        .from('chapters')
        .update({ order_index: index })
        .eq('id', chapterId)
        .eq('book_id', bookId)
    )
  )

  return NextResponse.json({ ok: true })
}
