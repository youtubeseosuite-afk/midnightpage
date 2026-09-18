// Path: components/dashboard/empty-state.tsx
// Status: NY
// Formål: Vises i stedet for Project Grid, når brugeren ikke har projekter endnu.

import { FilePlus2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreateClick?: () => void
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background/40 p-12 text-center backdrop-blur-md">
      <FilePlus2 className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 font-medium">Ingen projekter endnu</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Opret dit første projekt for at komme i gang med at bygge din Story Bible.
      </p>
      <Button onClick={onCreateClick} className="mt-6">
        Opret dit første projekt
      </Button>
    </div>
  )
}
