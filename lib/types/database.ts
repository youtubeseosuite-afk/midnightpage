// Path: lib/types/database.ts
// Status: OPDATERET
// Formål: Rettet — nyere @supabase/supabase-js (2.74+) kræver et __InternalSupabase-
// felt i Database-typen, ellers matcher createServerClient (fra @supabase/ssr) ikke
// typerne, og alle queries falder tilbage til "never". Se supabase-js issue #1738.

export type AppLanguage = 'da' | 'en' | 'es'
export type BookStatus = 'draft' | 'published' | 'archived'
export type CreditTxType = 'purchase' | 'ai_text' | 'ai_image' | 'refund' | 'bonus'

export type Profile = {
  id: string
  display_name: string | null
  preferred_language: AppLanguage
  credits_balance: number
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  user_id: string
  title: string
  synopsis: string | null
  language: AppLanguage
  created_at: string
  updated_at: string
}

export type Character = {
  id: string
  project_id: string
  name: string
  age: number
  body_language: string | null
  build: string | null
  backstory: string | null
  family_relations: string | null
  motivation: string | null
  created_at: string
  updated_at: string
}

export type Book = {
  id: string
  project_id: string
  user_id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  language: AppLanguage
  status: BookStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

export type Chapter = {
  id: string
  book_id: string
  title: string
  content: Record<string, unknown>
  order_index: number
  status: BookStatus
  created_at: string
  updated_at: string
}

export type CreditTransaction = {
  id: string
  user_id: string
  type: CreditTxType
  amount: number
  tokens_used: number | null
  reference_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
        Relationships: []
      }
      projects: {
        Row: Project
        Insert: Partial<Project> & { title: string; user_id: string }
        Update: Partial<Project>
        Relationships: []
      }
      characters: {
        Row: Character
        Insert: Partial<Character> & {
          project_id: string
          name: string
          age: number
        }
        Update: Partial<Character>
        Relationships: []
      }
      books: {
        Row: Book
        Insert: Partial<Book> & {
          project_id: string
          user_id: string
          title: string
          slug: string
        }
        Update: Partial<Book>
        Relationships: []
      }
      chapters: {
        Row: Chapter
        Insert: Partial<Chapter> & { book_id: string; title: string }
        Update: Partial<Chapter>
        Relationships: []
      }
      credit_transactions: {
        Row: CreditTransaction
        Insert: Partial<CreditTransaction> & {
          user_id: string
          type: CreditTxType
          amount: number
        }
        Update: Partial<CreditTransaction>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
