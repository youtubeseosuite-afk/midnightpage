// Path: lib/ai/language-names.ts
// Status: NY
// Formål: Delt opslag fra sprogkode til visningsnavn, brugt i AI-prompts
// (Co-writer og karakter-forslag), så det kun findes ét sted.

import type { AppLanguage } from '@/lib/types/database'

export const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  da: 'Dansk',
  en: 'English',
  es: 'Español',
}
