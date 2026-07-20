export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event: string
          id: string
          ip_hash: string | null
          metadata: Json
          path: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: string
          ip_hash?: string | null
          metadata?: Json
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          ip_hash?: string | null
          metadata?: Json
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          diff: Json | null
          id: string
          row_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: string
          row_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          diff?: Json | null
          id?: string
          row_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          content_status: Database["public"]["Enums"]["content_status"]
          cover_url: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          id: string
          published_at: string | null
          reading_minutes: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published_at?: string | null
          reading_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published_at?: string | null
          reading_minutes?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          content_status: Database["public"]["Enums"]["content_status"]
          created_at: string
          credential_id: string | null
          credential_url: string | null
          expires_on: string | null
          featured: boolean
          id: string
          image_url: string | null
          issued_on: string | null
          issuer: string
          skills: string[]
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expires_on?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          issued_on?: string | null
          issuer: string
          skills?: string[]
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          expires_on?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          issued_on?: string | null
          issuer?: string
          skills?: string[]
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          content_status: Database["public"]["Enums"]["content_status"]
          created_at: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          ended_on: string | null
          highlights: string[]
          id: string
          is_current: boolean
          location: string | null
          logo_url: string | null
          role: string
          sort_order: number
          started_on: string
          summary: string | null
          technologies: string[]
          updated_at: string
          url: string | null
        }
        Insert: {
          company: string
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          ended_on?: string | null
          highlights?: string[]
          id?: string
          is_current?: boolean
          location?: string | null
          logo_url?: string | null
          role: string
          sort_order?: number
          started_on: string
          summary?: string | null
          technologies?: string[]
          updated_at?: string
          url?: string | null
        }
        Update: {
          company?: string
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          ended_on?: string | null
          highlights?: string[]
          id?: string
          is_current?: boolean
          location?: string | null
          logo_url?: string | null
          role?: string
          sort_order?: number
          started_on?: string
          summary?: string | null
          technologies?: string[]
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      hero_projects: {
        Row: {
          accent: string
          category: string | null
          cover_url: string | null
          cover_variants: Json | null
          created_at: string
          created_by: string | null
          host: string | null
          id: string
          is_active: boolean
          mobile_url: string | null
          mobile_variants: Json | null
          sort_order: number
          status: string
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          accent?: string
          category?: string | null
          cover_url?: string | null
          cover_variants?: Json | null
          created_at?: string
          created_by?: string | null
          host?: string | null
          id?: string
          is_active?: boolean
          mobile_url?: string | null
          mobile_variants?: Json | null
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          accent?: string
          category?: string | null
          cover_url?: string | null
          cover_variants?: Json | null
          created_at?: string
          created_by?: string | null
          host?: string | null
          id?: string
          is_active?: boolean
          mobile_url?: string | null
          mobile_variants?: Json | null
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          body: string | null
          content_status: Database["public"]["Enums"]["content_status"]
          created_at: string
          id: string
          stage: string | null
          summary: string | null
          tags: string[]
          title: string
          updated_at: string
          upvotes: number
        }
        Insert: {
          body?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          id?: string
          stage?: string | null
          summary?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          upvotes?: number
        }
        Update: {
          body?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          id?: string
          stage?: string | null
          summary?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          upvotes?: number
        }
        Relationships: []
      }
      media: {
        Row: {
          alt: string | null
          caption: string | null
          created_at: string
          filename: string | null
          height: number | null
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          mime_type: string | null
          size_bytes: number | null
          storage_path: string | null
          tags: string[]
          updated_at: string
          uploaded_by: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          filename?: string | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[]
          updated_at?: string
          uploaded_by?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          caption?: string | null
          created_at?: string
          filename?: string | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[]
          updated_at?: string
          uploaded_by?: string | null
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          budget: string | null
          created_at: string
          email: string
          id: string
          inquiry_type: string | null
          ip_hash: string | null
          message: string
          name: string
          notes: string | null
          source: string | null
          status: Database["public"]["Enums"]["message_status"]
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          budget?: string | null
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string | null
          ip_hash?: string | null
          message: string
          name: string
          notes?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          budget?: string | null
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string | null
          ip_hash?: string | null
          message?: string
          name?: string
          notes?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          content_status: Database["public"]["Enums"]["content_status"]
          cover_url: string | null
          created_at: string
          currency: string
          description: string | null
          external_url: string | null
          featured: boolean
          gallery: Json
          id: string
          name: string
          price_cents: number | null
          slug: string
          sort_order: number
          tagline: string | null
          tags: string[]
          updated_at: string
        }
        Insert: {
          content_status?: Database["public"]["Enums"]["content_status"]
          cover_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          external_url?: string | null
          featured?: boolean
          gallery?: Json
          id?: string
          name: string
          price_cents?: number | null
          slug: string
          sort_order?: number
          tagline?: string | null
          tags?: string[]
          updated_at?: string
        }
        Update: {
          content_status?: Database["public"]["Enums"]["content_status"]
          cover_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          external_url?: string | null
          featured?: boolean
          gallery?: Json
          id?: string
          name?: string
          price_cents?: number | null
          slug?: string
          sort_order?: number
          tagline?: string | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          client: string | null
          content_status: Database["public"]["Enums"]["content_status"]
          cover_url: string | null
          created_at: string
          description: string | null
          design_process: string | null
          development: string | null
          featured: boolean
          gallery: Json
          github_url: string | null
          goals: string[]
          id: string
          lessons: string[]
          live_url: string | null
          metrics: Json
          problem: string | null
          published_at: string | null
          research: string | null
          results: Json
          role: string | null
          slug: string
          solution: string | null
          sort_order: number
          status: Database["public"]["Enums"]["project_status"]
          summary: string | null
          tags: string[]
          technologies: string[]
          testimonial: Json | null
          timeline: string | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          category?: string | null
          client?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          design_process?: string | null
          development?: string | null
          featured?: boolean
          gallery?: Json
          github_url?: string | null
          goals?: string[]
          id?: string
          lessons?: string[]
          live_url?: string | null
          metrics?: Json
          problem?: string | null
          published_at?: string | null
          research?: string | null
          results?: Json
          role?: string | null
          slug: string
          solution?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          summary?: string | null
          tags?: string[]
          technologies?: string[]
          testimonial?: Json | null
          timeline?: string | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          category?: string | null
          client?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          cover_url?: string | null
          created_at?: string
          description?: string | null
          design_process?: string | null
          development?: string | null
          featured?: boolean
          gallery?: Json
          github_url?: string | null
          goals?: string[]
          id?: string
          lessons?: string[]
          live_url?: string | null
          metrics?: Json
          problem?: string | null
          published_at?: string | null
          research?: string | null
          results?: Json
          role?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["project_status"]
          summary?: string | null
          tags?: string[]
          technologies?: string[]
          testimonial?: Json | null
          timeline?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      services: {
        Row: {
          benefits: Json
          content_status: Database["public"]["Enums"]["content_status"]
          cover_url: string | null
          created_at: string
          currency: string
          deliverables: string[]
          faq: Json
          featured: boolean
          features: Json
          icon: string | null
          id: string
          overview: string | null
          slug: string
          sort_order: number
          starting_price_cents: number | null
          summary: string | null
          tagline: string | null
          technologies: string[]
          timeline: string | null
          title: string
          updated_at: string
          workflow: Json
        }
        Insert: {
          benefits?: Json
          content_status?: Database["public"]["Enums"]["content_status"]
          cover_url?: string | null
          created_at?: string
          currency?: string
          deliverables?: string[]
          faq?: Json
          featured?: boolean
          features?: Json
          icon?: string | null
          id?: string
          overview?: string | null
          slug: string
          sort_order?: number
          starting_price_cents?: number | null
          summary?: string | null
          tagline?: string | null
          technologies?: string[]
          timeline?: string | null
          title: string
          updated_at?: string
          workflow?: Json
        }
        Update: {
          benefits?: Json
          content_status?: Database["public"]["Enums"]["content_status"]
          cover_url?: string | null
          created_at?: string
          currency?: string
          deliverables?: string[]
          faq?: Json
          featured?: boolean
          features?: Json
          icon?: string | null
          id?: string
          overview?: string | null
          slug?: string
          sort_order?: number
          starting_price_cents?: number | null
          summary?: string | null
          tagline?: string | null
          technologies?: string[]
          timeline?: string | null
          title?: string
          updated_at?: string
          workflow?: Json
        }
        Relationships: []
      }
      site_content: {
        Row: {
          created_at: string
          description: string | null
          group_name: string
          id: string
          image_url: string | null
          key: string
          kind: string
          label: string | null
          metadata: Json
          sort_order: number
          updated_at: string
          value_ar: string | null
          value_en: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          image_url?: string | null
          key: string
          kind?: string
          label?: string | null
          metadata?: Json
          sort_order?: number
          updated_at?: string
          value_ar?: string | null
          value_en?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          image_url?: string | null
          key?: string
          kind?: string
          label?: string | null
          metadata?: Json
          sort_order?: number
          updated_at?: string
          value_ar?: string | null
          value_en?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          color: string | null
          content_status: Database["public"]["Enums"]["content_status"]
          created_at: string
          featured: boolean
          icon: string | null
          id: string
          level: number | null
          name: string
          sort_order: number
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          featured?: boolean
          icon?: string | null
          id?: string
          level?: number | null
          name: string
          sort_order?: number
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          category?: string | null
          color?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          featured?: boolean
          icon?: string | null
          id?: string
          level?: number | null
          name?: string
          sort_order?: number
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_company: string | null
          author_name: string
          author_role: string | null
          avatar_url: string | null
          content_status: Database["public"]["Enums"]["content_status"]
          created_at: string
          featured: boolean
          id: string
          project_id: string | null
          quote: string
          rating: number | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          author_company?: string | null
          author_name: string
          author_role?: string | null
          avatar_url?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          featured?: boolean
          id?: string
          project_id?: string | null
          quote: string
          rating?: number | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          author_company?: string | null
          author_name?: string
          author_role?: string | null
          avatar_url?: string | null
          content_status?: Database["public"]["Enums"]["content_status"]
          created_at?: string
          featured?: boolean
          id?: string
          project_id?: string | null
          quote?: string
          rating?: number | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
      content_status: "draft" | "published" | "archived"
      employment_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "freelance"
        | "internship"
      media_kind: "image" | "video" | "document" | "audio" | "other"
      message_status: "new" | "read" | "replied" | "archived" | "spam"
      project_status: "concept" | "in_progress" | "live" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
      content_status: ["draft", "published", "archived"],
      employment_type: [
        "full_time",
        "part_time",
        "contract",
        "freelance",
        "internship",
      ],
      media_kind: ["image", "video", "document", "audio", "other"],
      message_status: ["new", "read", "replied", "archived", "spam"],
      project_status: ["concept", "in_progress", "live", "archived"],
    },
  },
} as const
