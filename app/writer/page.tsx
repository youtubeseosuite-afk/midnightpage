// Path: app/writer/page.tsx
// Status: OPDATERET (fuld landingpage — erstatter den tidligere minimale version)
// Formål: Platformens offentlige landingpage. Tilpasset fra et udkast: navn
// rettet til Midnight Page, CTA-knapperne peger nu på de rigtige ruter
// (/writer/signup, /writer/login, /read), og "Claude 3.5" er rettet til
// Sonnet 5 — den model, koden faktisk bruger.

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Globe, BookOpen, Users, Zap, PenTool } from 'lucide-react'

export default function WriterLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* --- NAVIGATION --- */}
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            M
          </div>
          Midnight Page
        </div>
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#features" className="transition-colors hover:text-primary">
            Features
          </a>
          <a href="#languages" className="transition-colors hover:text-primary">
            Sprog
          </a>
          <a href="#faq" className="transition-colors hover:text-primary">
            FAQ
          </a>
        </div>
        <Button asChild className="rounded-full px-6">
          <Link href="/writer/signup">Kom i gang gratis</Link>
        </Button>
      </nav>

      <main className="flex-1">
        {/* --- HERO --- */}
        <section className="relative mx-auto w-full max-w-7xl px-6 py-20 text-center md:py-32">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 opacity-50 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent opacity-50 blur-3xl" />
          </div>

          <Badge variant="outline" className="mb-4 border-primary/30 px-3 py-1 text-primary">
            ✨ Bygget med Claude Sonnet 5 & Flux.1
          </Badge>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Skriv din historie. <br />
            Udgiv til verden.
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Det samlede økosystem for forfattere. Kombinér AI co-writing,
            struktureret world-building og global selvudgivelse i ét flow.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg">
              <Link href="/writer/signup">Begynd at skrive gratis</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg">
              <Link href="/read">Udforsk biblioteket</Link>
            </Button>
          </div>
        </section>

        {/* --- FEATURES --- */}
        <section id="features" className="mx-auto w-full max-w-7xl px-6 py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Bygget til kreativitet</h2>
            <p className="text-muted-foreground">
              Stop med at kæmpe mod mapper og blokke. Begynd at skabe.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="border-none shadow-lg transition-all hover:ring-2 hover:ring-primary">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <PenTool size={24} />
                </div>
                <CardTitle>AI Co-Writer</CardTitle>
                <CardDescription>
                  Din intelligente sparringspartner — fra plot twists til finpudset prosa.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Drevet af Claude Sonnet 5 for narrativ kvalitet og konsistens.
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg transition-all hover:ring-2 hover:ring-primary">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users size={24} />
                </div>
                <CardTitle>Character Forge</CardTitle>
                <CardDescription>
                  Byg dybe, konsistente karakterer med strukturerede profiler og AI-visuals.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Generér karakter-portrætter med Flux.1 via Replicate.
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg transition-all hover:ring-2 hover:ring-primary">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap size={24} />
                </div>
                <CardTitle>Udgiv med ét klik</CardTitle>
                <CardDescription>
                  Fra kladde til udgivet bog på sekunder. Global rækkevidde, ingen friktion.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Øjeblikkeligt tilgængelig på dansk, engelsk og spansk.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* --- LANGUAGES --- */}
        <section id="languages" className="bg-primary px-6 py-20 text-primary-foreground">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 md:flex-row">
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">En global scene for enhver stemme</h2>
              <p className="mb-8 text-lg opacity-90">
                Historier bør ikke have grænser. Platformen er bygget til de tre sprog,
                vores forfattere skriver på.
              </p>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <Badge className="bg-background px-4 py-2 text-sm font-bold text-foreground">
                  Dansk 🇩🇰
                </Badge>
                <Badge className="bg-background px-4 py-2 text-sm font-bold text-foreground">
                  English 🇺🇸
                </Badge>
                <Badge className="bg-background px-4 py-2 text-sm font-bold text-foreground">
                  Español 🇪🇸
                </Badge>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-4">
              <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-6 text-center backdrop-blur-md">
                <Globe className="mx-auto mb-2 opacity-80" />
                <span className="text-sm font-medium">Global rækkevidde</span>
              </div>
              <div className="rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-6 text-center backdrop-blur-md">
                <BookOpen className="mx-auto mb-2 opacity-80" />
                <span className="text-sm font-medium">Læsning på tværs af sprog</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- FAQ --- */}
        <section id="faq" className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ofte stillede spørgsmål</h2>
            <p className="text-muted-foreground">Alt du skal vide om Midnight Page.</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Hvordan fungerer AI Co-Writeren egentlig?</AccordionTrigger>
              <AccordionContent>
                Vores AI skriver ikke bare for dig — den arbejder sammen med dig. Ved hjælp
                af Claude Sonnet 5 læser Midnight Page din Story Bible (karakterer og
                plot-noter) for at give kontekstbevidste forslag, der holder historien
                konsistent.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Er det virkelig en selvudgivelses-platform?</AccordionTrigger>
              <AccordionContent>
                Ja. Når din bog er færdig, gør ét klik den tilgængelig i vores Reader&apos;s
                Portal, hvor læsere globalt kan finde og læse dit værk på deres foretrukne
                sprog.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Hvordan genereres AI-billederne?</AccordionTrigger>
              <AccordionContent>
                Vi bruger Flux.1-modellen via Replicate. Markér den tekst, du vil visualisere,
                og AI&apos;en genererer et billede, der passer direkte ind i dit manuskript.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 border-t px-6 py-12 md:flex-row">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Midnight Page.
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary">
            Privatlivspolitik
          </a>
          <a href="#" className="hover:text-primary">
            Vilkår
          </a>
          <a href="#" className="hover:text-primary">
            Kontakt
          </a>
        </div>
      </footer>
    </div>
  )
}
