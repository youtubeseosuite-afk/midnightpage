// Path: app/api/ai/character-suggestions/route.ts
// Status: NY
// Formål: Giver 3 kontrastfyldte forslag til ét karakterfelt ad gangen, ud fra
// navn, alder og (hvis muligt) projektets synopsis som genre-fingerpeg. Bruger
// Haiku, da opgaven er kort og ikke kræver Sonnets fulde kapacitet.

import { createClient } from '@/lib/supabase/server'
import { LANGUAGE_NAMES } from '@/lib/ai/language-names'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TOKENS_PER_CREDIT = 200

const FIELD_LABELS = {
  body_language: 'Kropssprog',
  build: 'Kropsbygning',
  backstory: 'Baggrundshistorie',
  family_relations: 'Familierelationer',
  motivation: 'Motivation',
} as const

type FieldKey = keyof typeof FIELD_LABELS

function isFieldKey(value: unknown): value is FieldKey {
  return typeof value === 'string' && value in FIELD_LABELS
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId, field, name, age } = await request.json()

  if (!projectId || !isFieldKey(field) || !name || typeof age !== 'number') {
    return NextResponse.json({ error: 'Ugyldige felter' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', user.id)
    .single()

  if (!profile || profile.credits_balance <= 0) {
    return NextResponse.json({ error: 'Ingen credits tilbage' }, { status: 402 })
  }

  const { data: project } = await supabase
    .from('projects')
    .select('id, synopsis, language, user_id')
    .eq('id', projectId)
    .single()

  if (!project || project.user_id !== user.id) {
    return NextResponse.json({ error: 'Projekt ikke fundet' }, { status: 404 })
  }

  const languageName = LANGUAGE_NAMES[project.language]
  const fieldLabel = FIELD_LABELS[field]

  const system = `Du er en ekspert i karakter-udvikling og psykologi. Din opgave er at hjælpe forfattere med at udfylde detaljer i deres karakter-profiler baseret på minimal information.

Krav:
- Forslagene skal være korte, skarpe og inspirerende.
- De skal passe til bogens overordnede genre og være skrevet på ${languageName}.
- Undgå stereotyper; skab karakterer med dybde og indre konflikter.

Format: Returnér kun de 3 forslag som en punktliste uden indledende tekst.`

  const userPrompt = `Karakter: ${name}, ${age} år.
${project.synopsis ? `Bogens synopsis (til genre-fornemmelse): ${project.synopsis}` : ''}

Giv 3 forskellige, kontrastfyldte forslag til feltet "${fieldLabel}".`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 512,
    system,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((block) => block.type === 'text')
  const raw = textBlock && textBlock.type === 'text' ? textBlock.text : ''

  const suggestions = raw
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 3)

  const totalTokens = response.usage.input_tokens + response.usage.output_tokens
  const creditsUsed = Math.max(1, Math.ceil(totalTokens / TOKENS_PER_CREDIT))

  await supabase.from('credit_transactions').insert({
    user_id: user.id,
    type: 'ai_text',
    amount: -creditsUsed,
    tokens_used: totalTokens,
    reference_id: projectId,
    metadata: {
      model: 'claude-haiku-4-5',
      field,
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    },
  })

  return NextResponse.json({ suggestions, creditsUsed })
}
