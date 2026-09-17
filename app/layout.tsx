// Path: app/layout.tsx
// Status: NY
// Formål: Obligatorisk root layout for App Router. Indlæser globals.css og
// definerer html/body-strukturen som alle sider (inkl. (writer)-gruppen) arver.

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Midnight Page',
  description: 'AI-drevet skrive- og publiceringsplatform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  )
}
