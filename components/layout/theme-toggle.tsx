// Path: components/layout/theme-toggle.tsx
// Status: NY
// Formål: Dropdown til at vælge Lys/Mørk/Sepia. Gemmes i localStorage under
// 'mp-theme' — samme key som det blokerende script i app/layout.tsx læser,
// så valget holder ved genindlæsning uden flash.

'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun, BookOpen } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

type Theme = 'light' | 'dark' | 'sepia'

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Lys', icon: Sun },
  { value: 'dark', label: 'Mørk', icon: Moon },
  { value: 'sepia', label: 'Sepia', icon: BookOpen },
]

function applyTheme(theme: Theme) {
  document.documentElement.classList.remove('dark', 'sepia')
  if (theme !== 'light') {
    document.documentElement.classList.add(theme)
  }
  localStorage.setItem('mp-theme', theme)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const stored = localStorage.getItem('mp-theme')
    if (stored === 'dark' || stored === 'sepia') setTheme(stored)
  }, [])

  function select(value: Theme) {
    setTheme(value)
    applyTheme(value)
  }

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[0]
  const CurrentIcon = current.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          {current.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map((t) => {
          const Icon = t.icon
          return (
            <DropdownMenuItem key={t.value} onClick={() => select(t.value)}>
              <Icon className="mr-2 h-4 w-4" />
              {t.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
