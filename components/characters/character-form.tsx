// Path: components/characters/character-form.tsx
// Status: NY
// Formål: Karakter-formular med "Foreslå"-knap på hvert valgfrit felt. Henter 3
// forslag fra /api/ai/character-suggestions og lader forfatteren klikke ét ind i
// feltet. Server actionen (createCharacter) gives som prop fra den kaldende
// Server Component, så selve oprettelsen stadig sker server-side.

'use client'

import { useState } from 'react'

type FieldKey = 'body_language' | 'build' | 'backstory' | 'family_relations' | 'motivation'

interface FieldConfig {
  key: FieldKey
  label: string
  multiline?: boolean
}

const FIELDS: FieldConfig[] = [
  { key: 'body_language', label: 'Kropssprog' },
  { key: 'build', label: 'Kropsbygning' },
  { key: 'backstory', label: 'Baggrundshistorie', multiline: true },
  { key: 'family_relations', label: 'Familierelationer', multiline: true },
  { key: 'motivation', label: 'Motivation', multiline: true },
]

interface CharacterFormProps {
  projectId: string
  action: (formData: FormData) => void
}

export function CharacterForm({ projectId, action }: CharacterFormProps) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [values, setValues] = useState<Partial<Record<FieldKey, string>>>({})
  const [suggestions, setSuggestions] = useState<Partial<Record<FieldKey, string[]>>>({})
  const [loadingField, setLoadingField] = useState<FieldKey | null>(null)
  const [fieldError, setFieldError] = useState<Partial<Record<FieldKey, string>>>({})

  async function suggest(fieldKey: FieldKey) {
    if (!name.trim() || !age) {
      setFieldError((prev) => ({ ...prev, [fieldKey]: 'Udfyld navn og alder først' }))
      return
    }
    setLoadingField(fieldKey)
    setFieldError((prev) => ({ ...prev, [fieldKey]: undefined }))

    try {
      const res = await fetch('/api/ai/character-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, field: fieldKey, name, age: Number(age) }),
      })
      const data = await res.json()

      if (!res.ok) {
        setFieldError((prev) => ({ ...prev, [fieldKey]: data.error ?? 'Noget gik galt' }))
        return
      }
      setSuggestions((prev) => ({ ...prev, [fieldKey]: data.suggestions }))
    } catch {
      setFieldError((prev) => ({ ...prev, [fieldKey]: 'Kunne ikke hente forslag' }))
    } finally {
      setLoadingField(null)
    }
  }

  function pick(fieldKey: FieldKey, suggestion: string) {
    setValues((prev) => ({ ...prev, [fieldKey]: suggestion }))
    setSuggestions((prev) => ({ ...prev, [fieldKey]: [] }))
  }

  return (
    <form action={action} className="mt-10 space-y-4 border-t pt-6">
      <h2 className="text-lg font-medium">Ny karakter</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="name">
            Navn *
          </label>
          <input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="age">
            Alder *
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={0}
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>

      {FIELDS.map((field) => (
        <div key={field.key}>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium" htmlFor={field.key}>
              {field.label}
            </label>
            <button
              type="button"
              onClick={() => suggest(field.key)}
              disabled={loadingField === field.key}
              className="text-xs text-primary underline disabled:opacity-50"
            >
              {loadingField === field.key ? 'Henter…' : 'Foreslå'}
            </button>
          </div>

          {field.multiline ? (
            <textarea
              id={field.key}
              name={field.key}
              rows={field.key === 'backstory' ? 3 : 2}
              value={values[field.key] ?? ''}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          ) : (
            <input
              id={field.key}
              name={field.key}
              value={values[field.key] ?? ''}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          )}

          {fieldError[field.key] && (
            <p className="mt-1 text-xs text-destructive">{fieldError[field.key]}</p>
          )}

          {(suggestions[field.key]?.length ?? 0) > 0 && (
            <ul className="mt-2 space-y-1">
              {suggestions[field.key]!.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => pick(field.key, s)}
                    className="w-full rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Opret karakter
      </button>
    </form>
  )
}
