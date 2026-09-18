// Path: components/dashboard/character-forge.tsx
// Status: NY
// Formål: Horisontal quick-access-række med senest oprettede karakterer.
// avatarUrl er placeholder for nu — AI-genererede avatarer via Replicate er
// ikke bygget endnu, så feltet er valgfrit og falder tilbage til initialer.

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ForgeCharacter {
  id: string
  name: string
  role: string
  avatarUrl?: string | null
}

interface CharacterForgeProps {
  characters: ForgeCharacter[]
}

export function CharacterForge({ characters }: CharacterForgeProps) {
  if (characters.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-medium">Character Forge</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {characters.map((c) => (
          <div
            key={c.id}
            className="flex w-32 flex-shrink-0 flex-col items-center rounded-xl border border-border/50 bg-background/60 p-4 text-center backdrop-blur-xl"
          >
            <Avatar className="h-14 w-14">
              {c.avatarUrl && <AvatarImage src={c.avatarUrl} alt={c.name} />}
              <AvatarFallback>{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <p className="mt-2 text-sm font-medium">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
