// Path: app/layout.tsx
// Status: OPDATERET (tilføjet theme-script for at undgå flash af forkert tema)
// Formål: Root layout. Scriptet i <head> kører før første paint og sætter
// dark/sepia-class ud fra localStorage, inden React overhovedet hydrerer —
// derfor suppressHydrationWarning på <html>, da klassen sættes uden om React.

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Midnight Page',
  description: 'AI-drevet skrive- og publiceringsplatform',
}

const themeScript = `
(function () {
  try {
    var theme = localStorage.getItem('mp-theme');
    if (theme === 'dark' || theme === 'sepia') {
      document.documentElement.classList.add(theme);
    }
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
