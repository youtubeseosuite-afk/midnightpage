// Path: components/layout/language-dropdown.tsx
// Status: NY
// Formål: Dropdown til at vælge UI-sprog. Rent visuelt for nu — der er endnu
// intet i18n-system til at skifte selve UI-teksten (det kommer i trin 9).

'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const LANGUAGES = [
  { code: 'da', label: 'Dansk' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
] as const

type LanguageCode = (typeof LANGUAGES)[number]['code']

interface LanguageDropdownProps {
  defaultLanguage?: LanguageCode
}

export function LanguageDropdown({ defaultLanguage = 'da' }: LanguageDropdownProps) {
  const [current, setCurrent] = useState<LanguageCode>(defaultLanguage)
  const currentLabel = LANGUAGES.find((l) => l.code === current)?.label ?? 'Dansk'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem key={lang.code} onClick={() => setCurrent(lang.code)}>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
