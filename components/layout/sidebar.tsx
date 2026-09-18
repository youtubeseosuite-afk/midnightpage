// Path: components/layout/sidebar.tsx
// Status: NY
// Formål: Fast venstre-sidebar med navigation. Skjult på mobil bag en
// burger-knap/drawer, altid synlig på md+. Ruterne /library, /characters,
// /credits og /settings findes ikke endnu — de peger fremad mod trin 7-9 i
// roadmappen (Reader's Portal, Credit Store, Stripe).

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Home, Library, Users, CreditCard, Settings, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/library', label: 'My Library', icon: Library },
  { href: '/characters', label: 'Character Vault', icon: Users },
  { href: '/credits', label: 'Credit Store', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-md border border-border/50 bg-background/80 p-2 backdrop-blur-md md:hidden"
        aria-label="Åbn menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/50 bg-background/70 p-4 backdrop-blur-xl transition-transform duration-200 md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-lg font-semibold">Midnight Page</span>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md p-1 md:hidden"
            aria-label="Luk menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname?.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
