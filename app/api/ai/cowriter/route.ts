// Path: app/api/ai/cowriter/route.ts
// Status: OPDATERET (Anthropic-kaldet er nu i try/catch — uden det crashede
// hele endpointet uden om JSON ved fejl, så klienten kun så en generisk
// "kunne ikke kontakte"-besked i stedet for den faktiske årsag)
// Formål: AI Co-writer-endpoint. Henter Story Bible (synopsis + karakterer), kalder
// Claude med Prompt Caching, og trækker credits fra brugerens saldo efter kaldet
// baseret på det faktiske token-forbrug (inkl. cache-oprettelse).

import { createClient } from '@/lib/supabase/server'
import { buildSystemPrompt } from '@/lib/ai/system-prompt'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MODELS = {
  sonnet: 'claude-sonnet-5',
  haiku: 'claude-haiku-4-5',
} as const

// Simpel takst: 1 credit pr. 200 tokens (input + output + cache-oprettelse).
// Justér til jeres egen prisstruktur, når den er lagt fast.
const TOKENS_PER_CREDIT = 200

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { projectId, prompt, model = 'sonnet' } = await request.json()

  if (!projectId || !prompt) {
    return NextResponse.json(
      { error: 'projectId og prompt er påkrævet' },
      { status: 400 }
    )
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
    .select('id, title, synopsis, language, user_id')
    .eq('id', projectId)
    .single()

  if (!project || project.user_id !== user.id) {
    return NextResponse.json({ error: 'Projekt ikke fundet' }, { status: 404 })
  }

  const { data: characters } = await supabase
    .from('characters')
    .select('*')
    .eq('project_id', projectId)

  const system = buildSystemPrompt(project, characters ?? [])
  const modelId = MODELS[model as keyof typeof MODELS] ?? MODELS.sonnet

  let response
  try {
    response = await anthropic.messages.create({
      model: modelId,
      max_tokens: 2048,
      system,
      messages: [{ role: 'user', content: prompt }],
    })
  } catch (error) {
    console.error('Anthropic-kald fejlede:', error)
    return NextResponse.json(
      { error: 'Kald til Claude fejlede — tjek ANTHROPIC_API_KEY og Vercel-logs' },
      { status: 502 }
    )
  }

  const textBlock = response.content.find((block) => block.type === 'text')
  const text = textBlock && textBlock.type === 'text' ? textBlock.text : ''

  const totalTokens =
    response.usage.input_tokens +
    response.usage.output_tokens +
    (response.usage.cache_creation_input_tokens ?? 0)
  const creditsUsed = Math.max(1, Math.ceil(totalTokens / TOKENS_PER_CREDIT))

  await supabase.from('credit_transactions').insert({
    user_id: user.id,
    type: 'ai_text',
    amount: -creditsUsed,
    tokens_used: totalTokens,
    reference_id: projectId,
    metadata: {
      model: modelId,
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      cache_read_input_tokens: response.usage.cache_read_input_tokens ?? 0,
      cache_creation_input_tokens: response.usage.cache_creation_input_tokens ?? 0,
    },
  })

  return NextResponse.json({ text, creditsUsed })
}
