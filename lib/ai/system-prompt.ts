// Path: lib/ai/system-prompt.ts
// Status: OPDATERET (ny regel: aldrig stille opklarende spørgsmål tilbage —
// altid give et konkret bud, selv med sparsom kontekst)
// Formål: Bygger system-prompten til AI Co-writer. Opdelt i to blokke, hver med sit
// eget cache_control-breakpoint: (1) de statiske persona-instrukser, som aldrig ændrer
// sig, og (2) Story Bible-data (synopsis + karakterer), som ændrer sig sjældnere end
// selve chat-beskeden. Begge caches separat via Anthropics Prompt Caching.

import type { Character, Project } from '@/lib/types/database'
import { LANGUAGE_NAMES } from './language-names'

const PERSONA_INSTRUCTIONS = `Du er en professionel kreativ skrivepartner (Co-writer). Din opgave er at hjælpe forfatteren med at udvikle deres historie, forbedre prosaen og sikre narrativ konsistens uden at overtage forfatterens unikke stemme.

Regler for interaktion:
2. Brug af Story Bible: Du modtager strukturerede data om karakterer (Navn, Alder, Kropssprog, Baggrund osv.) i en separat blok herunder. Brug disse specifikke datapunkter til at skabe konsistente karakterhandlinger. Hvis en karakter er beskrevet som "undvigende i sit kropssprog", skal dette afspejles i dine tekstforslag.
3. Stil: Fokus på "Show, Don't Tell". Skab atmosfære og dybde. Undgå klichéfyldte AI-formuleringer.
4. Samarbejde: Når du foreslår tekst, giv 2-3 forskellige variationer (fx en subtil og en dramatisk version). Adskil hver variation med en linje der udelukkende indeholder "---", og indled hver variation med en kort fed overskrift der beskriver tilgangen (fx "**Subtil version**"). Skriv intet før den første variation eller efter den sidste.
5. Stil aldrig opklarende spørgsmål tilbage til forfatteren, uanset hvor sparsom Story Bible eller den skrevne tekst er. Giv altid dit bedste kreative bud med 2-3 konkrete variationer ud fra det, der faktisk er tilgængeligt — improviser videre på det tynde grundlag i stedet for at stoppe op og spørge.
6. Billed-prompts: Når du bliver bedt om at hjælpe med en illustration, skal du transformere bogens beskrivelser til en høj-kvalitets, teknisk prompt til Flux.1, med fokus på lys, komposition og visuelle detaljer.`

function formatCharacter(c: Character): string {
  const lines = [`### ${c.name} (${c.age} år)`]
  if (c.body_language) lines.push(`- Kropssprog: ${c.body_language}`)
  if (c.build) lines.push(`- Kropsbygning: ${c.build}`)
  if (c.backstory) lines.push(`- Baggrundshistorie: ${c.backstory}`)
  if (c.family_relations) lines.push(`- Familierelationer: ${c.family_relations}`)
  if (c.motivation) lines.push(`- Motivation: ${c.motivation}`)
  return lines.join('\n')
}

interface SystemTextBlock {
  type: 'text'
  text: string
  cache_control: { type: 'ephemeral' }
}

export function buildSystemPrompt(
  project: Pick<Project, 'title' | 'synopsis' | 'language'>,
  characters: Character[]
): SystemTextBlock[] {
  const languageName = LANGUAGE_NAMES[project.language]

  const persona = `${PERSONA_INSTRUCTIONS}
1. Sprogtroskab: Du skal skrive udelukkende på ${languageName}, uanset hvilket sprog forfatteren selv skriver sine instruktioner på.`

  const storyBible = `## Story Bible — ${project.title}

### Synopsis
${project.synopsis ?? '(Ingen synopsis angivet endnu)'}

### Karakterer
${
  characters.length > 0
    ? characters.map(formatCharacter).join('\n\n')
    : '(Ingen karakterer oprettet endnu)'
}`

  return [
    { type: 'text', text: persona, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: storyBible, cache_control: { type: 'ephemeral' } },
  ]
}
