// Path: app/api/ai/generate-image/route.ts
// Status: NY
// Formål: Genererer et billede via Replicate fra markeret tekst. Billeder
// afregnes med en fast credit-pris (IMAGE_CREDIT_COST), i modsætning til
// tekst der afregnes pr. token — matcher kommentaren i schema.sql.
// extractImageUrl er defensiv, fordi Replicates output-format for
// billed-modeller varierer (streng, array, eller FileOutput-objekt med
// .url()) afhængig af model og SDK-version.

import { createClient } from '@/lib/supabase/server'
import Replicate from 'replicate'
import { NextResponse } from 'next/server'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

const MODEL = 'black-forest-labs/flux-schnell'
const IMAGE_CREDIT_COST = 20

function extractImageUrl(output: unknown): string | null {
  if (typeof output === 'string') return output

  if (Array.isArray(output) && output.length > 0) {
    const first = output[0] as unknown
    if (typeof first === 'string') return first
    if (first && typeof (first as { url?: unknown }).url === 'function') {
      return (first as { url: () => string }).url()
    }
    if (first && typeof (first as { url?: unknown }).url === 'string') {
      return (first as { url: string }).url
    }
  }

  if (output && typeof (output as { url?: unknown }).url === 'function') {
    return (output as { url: () => string }).url()
  }

  return null
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { prompt, projectId } = await request.json()

  if (!prompt || !projectId) {
    return NextResponse.json(
      { error: 'prompt og projectId er påkrævet' },
      { status: 400 }
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', user.id)
    .single()

  if (!profile || profile.credits_balance < IMAGE_CREDIT_COST) {
    return NextResponse.json({ error: 'Ikke nok credits til et billede' }, { status: 402 })
  }

  let imageUrl: string | null = null

  try {
    const output = await replicate.run(MODEL, {
      input: { prompt, num_outputs: 1 },
    })
    imageUrl = extractImageUrl(output)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Billedgenerering fejlede' }, { status: 502 })
  }

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Kunne ikke udtrække billed-URL fra Replicate-svaret' },
      { status: 502 }
    )
  }

  await supabase.from('credit_transactions').insert({
    user_id: user.id,
    type: 'ai_image',
    amount: -IMAGE_CREDIT_COST,
    reference_id: projectId,
    metadata: { model: MODEL, prompt },
  })

  return NextResponse.json({ url: imageUrl })
}
