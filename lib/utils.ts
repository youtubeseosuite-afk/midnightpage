// Path: lib/utils.ts
// Status: NY
// Formål: Standard shadcn/ui cn()-helper — merger className-strenge og løser
// Tailwind-konflikter (fx to forskellige padding-klasser) korrekt.

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
