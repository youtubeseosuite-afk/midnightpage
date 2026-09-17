// Path: lib/types/database.ts
// Status: OPDATERET
// Formål: Rettet — @supabase/supabase-js's generiske typer kræver Row, Insert,
// Update og Relationships pr. tabel. Manglede de tre sidste, faldt alle queries
// tilbage til "never" ved type-check.

export type AppLanguage = 'da' | 'en' | 'es'
export type BookStatus = 'draft' | 'published' | 'archived'
export type CreditTxType = 'purchase' | 'ai_text' | 'ai_image' | 'refund' | 'bonus'

export interface Profile {
  id: string
  display_name: string | null
  preferred_language: AppLanguage
  credits_balance: number
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  synopsis: string | null
  language: AppLanguage
  created_at: string
  updated_at: string
}

export interface Character {
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

export interface Book {
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

export interface Chapter {
  id: string
  book_id: string
  title: string
  content: Record<string, unknown>
  order_index: number
  status: BookStatus
  created_at: string
  updated_at: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  type: CreditTxType
  amount: number
  tokens_used: number | null
  reference_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface Database {
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
  }
}
