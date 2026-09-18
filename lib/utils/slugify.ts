// Path: lib/utils/slugify.ts
// Status: NY
// Formål: Genererer en URL-sikker, unik slug til bøger (bruges ved publicering).

export function slugify(title: string): string {
  const replacements: Record<string, string> = {
    æ: 'ae',
    ø: 'o',
    å: 'a',
    Æ: 'ae',
    Ø: 'o',
    Å: 'a',
  }

  const base = title
    .split('')
    .map((ch) => replacements[ch] ?? ch)
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const suffix = Math.random().toString(36).slice(2, 7)
  return `${base}-${suffix}`
}
