// Path: components/credits/credit-badge.tsx
// Status: NY
// Formål: Visuel indikator for credit-saldo i Top-baren. Tager balance som
// prop (placeholder-data for nu) — kobles til profiles.credits_balance, når
// dashboardet forbindes til Supabase.

import { Coins } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface CreditBadgeProps {
  balance: number
}

export function CreditBadge({ balance }: CreditBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1.5 px-3 py-1">
      <Coins className="h-3.5 w-3.5" />
      {balance.toLocaleString('da-DK')} credits
    </Badge>
  )
}
