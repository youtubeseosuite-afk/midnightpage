// Path: components/dashboard/create-project-dialog.tsx
// Status: NY
// Formål: Modal til "Create New Project". Fuldt kontrolleret udefra (open +
// onOpenChange), så både EmptyState-knappen og "+"-kortet i grid'et kan åbne
// den samme dialog. UI-only for nu — onCreate er en placeholder-callback,
// indtil dashboardet forbindes til Supabase.

'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate?: (data: { title: string; genre: string; language: 'da' | 'en' | 'es' }) => void
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateProjectDialogProps) {
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [language, setLanguage] = useState<'da' | 'en' | 'es'>('da')

  function handleSubmit() {
    onCreate?.({ title, genre, language })
    onOpenChange(false)
    setTitle('')
    setGenre('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nyt projekt</DialogTitle>
          <DialogDescription>
            Placeholder — kobles til Supabase, når dashboardet forbindes til rigtige data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium" htmlFor="dialog-title">
              Titel
            </label>
            <input
              id="dialog-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="dialog-genre">
              Genre
            </label>
            <input
              id="dialog-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="dialog-language">
              Sprog
            </label>
            <select
              id="dialog-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'da' | 'en' | 'es')}
              className="mt-1 w-full rounded-md border px-3 py-2"
            >
              <option value="da">Dansk</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Opret
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
