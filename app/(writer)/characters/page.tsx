// Path: app/(writer)/characters/page.tsx
// Status: NY
// Formål: "Character Vault"-sidebar-linket. Karakterer har kun project_id, ikke
// user_id, så vi henter først brugerens project-id'er og filtrerer characters
// på dem (undgår embedded/join-selects, som vores Relationships-typer ikke
// understøtter pænt).

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CharacterVaultPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/writer/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, title')
    .eq('user_id', user.id)

  const projectIds = projects?.map((p) => p.id) ?? []

  const { data: characters } = projectIds.length
    ? await supabase
        .from('characters')
        .select('id, name, age, motivation, project_id')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false })
    : { data: [] }

  const projectTitleById = new Map(projects?.map((p) => [p.id, p.title]))

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Character Vault</h1>

      <ul className="mt-6 space-y-3">
        {characters?.map((c) => (
          <li key={c.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Link
                href={`/projects/${c.project_id}/characters`}
                className="font-medium hover:underline"
              >
                {c.name} <span className="text-muted-foreground">({c.age})</span>
              </Link>
              <span className="text-xs text-muted-foreground">
                {projectTitleById.get(c.project_id)}
              </span>
            </div>
            {c.motivation && (
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{c.motivation}</p>
            )}
          </li>
        ))}
        {characters?.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ingen karakterer endnu. Opret dem fra et projekts karakter-side.
          </p>
        )}
      </ul>
    </div>
  )
}
