// Path: components/layout/topbar.tsx
// Status: OPDATERET (tilføjet ThemeToggle)
// Formål: Samler CreditBadge, LanguageDropdown, ThemeToggle og user-avatar i
// én sticky top-bar. Tager brugerdata som placeholder-props for nu.

import { CreditBadge } from '@/components/credits/credit-badge'
import { LanguageDropdown } from '@/components/layout/language-dropdown'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface TopbarProps {
  creditsBalance: number
  userName: string
  userAvatarUrl?: string | null
}

export function Topbar({ creditsBalance, userName, userAvatarUrl }: TopbarProps) {
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-end gap-4 border-b border-border/50 bg-background/60 px-6 py-3 backdrop-blur-xl">
      <CreditBadge balance={creditsBalance} />
      <LanguageDropdown />
      <ThemeToggle />
      <div className="flex items-center gap-2">
        <Avatar>
          {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userName} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium sm:inline">{userName}</span>
      </div>
    </header>
  )
}
