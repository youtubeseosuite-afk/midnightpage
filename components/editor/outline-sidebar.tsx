// Path: components/editor/outline-sidebar.tsx
// Status: NY
// Formål: Venstre-panelet i three-pane-layoutet. Drag-and-drop bruger @dnd-kit
// (standarden i React-økosystemet). Rækkefølge gemmes optimistisk lokalt og
// sendes til /api/chapters/reorder; RLS sikrer kun ejeren kan opdatere.

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

interface OutlineChapter {
  id: string
  title: string
  order_index: number
}

interface OutlineSidebarProps {
  projectId: string
  bookId: string
  chapters: OutlineChapter[]
}

function SortableChapterItem({
  chapter,
  href,
  isActive,
}: {
  chapter: OutlineChapter
  href: string
  isActive: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chapter.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn('flex items-center gap-1 rounded-md text-sm', isDragging && 'opacity-50')}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground"
        aria-label="Flyt kapitel"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Link
        href={href}
        className={cn(
          'flex-1 truncate rounded-md px-2 py-1.5 hover:bg-accent',
          isActive && 'bg-accent font-medium'
        )}
      >
        {chapter.title}
      </Link>
    </li>
  )
}

export function OutlineSidebar({ projectId, bookId, chapters: initialChapters }: OutlineSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [chapters, setChapters] = useState(
    [...initialChapters].sort((a, b) => a.order_index - b.order_index)
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = chapters.findIndex((c) => c.id === active.id)
    const newIndex = chapters.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(chapters, oldIndex, newIndex)
    setChapters(reordered)

    await fetch('/api/chapters/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookId,
        orderedIds: reordered.map((c) => c.id),
      }),
    })
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border/50 text-muted-foreground hover:bg-accent"
        aria-label="Vis outline"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    )
  }

  return (
    <div className="w-56 shrink-0">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Kapitler</h2>
        <button
          onClick={() => setCollapsed(true)}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent"
          aria-label="Skjul outline"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={chapters.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <ul className="mt-2 space-y-0.5">
            {chapters.map((chapter) => {
              const href = `/projects/${projectId}/books/${bookId}/chapters/${chapter.id}`
              return (
                <SortableChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  href={href}
                  isActive={pathname === href}
                />
              )
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}
