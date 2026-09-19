// Path: app/read/layout.tsx
// Status: NY
// Formål: Egen visuel identitet for Reader's Portal — bevidst adskilt fra
// Writer-appens lys/mørk/sepia-tema, da dette er en offentlig, altid-mørk
// oplevelse ("mørket er rummet"). Tre skrifttyper: Fraunces til overskrifter,
// Literata (designet til skærmlæsning) til selve læseteksten, Libre Franklin
// til UI-chrome. latin-ext med for æ/ø/å og spansk diakritik.

import { Fraunces, Literata, Libre_Franklin } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
})

const literata = Literata({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-reading',
  display: 'swap',
})

const libreFranklin = Libre_Franklin({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-ui',
  display: 'swap',
})

export default function ReadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${fraunces.variable} ${literata.variable} ${libreFranklin.variable} min-h-screen bg-[#13141F] font-ui text-[#F2E8D5]`}
    >
      {children}
    </div>
  )
}
