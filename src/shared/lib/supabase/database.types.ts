// RUTA: src/shared/lib/supabase/database.types.ts
/**
 * @file database.types.ts
 * @description SSoT para los tipos generados desde el esquema de Supabase.
 *              ¡ESTE ARCHIVO ES GENERADO AUTOMÁTICAMENTE!
 * @version 12.0.0 (Holistic Schema Restoration & Elite Compliance)
 * @author L.I.A. Legacy (Re-Forged & Verified)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      anonymous_campaign_events: {
        Row: {
          id: string;
          created_at: string;
          fingerprint_id: string;
          session_id: string;
          workspace_id: string;
          campaign_id: string;
          variant_id: string;
          event_type: string;
          payload: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          fingerprint_id: string;
          session_id: string;
          workspace_id: string;
          campaign_id: string;
          variant_id: string;
          event_type: string;
          payload?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          fingerprint_id?: string;
          session_id?: string;
          workspace_id?: string;
          campaign_id?: string;
          variant_id?: string;
          event_type?: string;
          payload?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "anonymous_campaign_events_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      aura_insights: {
        Row: {
          id: string;
          created_at: string;
          workspace_id: string;
          title: string;
          description: string;
          severity: "low" | "medium" | "high" | "critical";
          recommendation: string;
          related_data: Json | null;
          is_resolved: boolean;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          workspace_id: string;
          title: string;
          description: string;
          severity: "low" | "medium" | "high" | "critical";
          recommendation: string;
          related_data?: Json | null;
          is_resolved?: boolean;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          workspace_id?: string;
          title?: string;
          description?: string;
          severity?: "low" | "medium" | "high" | "critical";
          recommendation?: string;
          related_data?: Json | null;
          is_resolved?: boolean;
          resolved_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "aura_insights_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      bavi_assets: {
        Row: {
          asset_id: string;
          workspace_id: string;
          user_id: string;
          status: string;
          provider: string;
          description: string | null;
          prompt_id: string | null;
          tags: Json | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          asset_id: string;
          workspace_id: string;
          user_id: string;
          status?: string;
          provider?: string;
          description?: string | null;
          prompt_id?: string | null;
          tags?: Json | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          asset_id?: string;
          workspace_id?: string;
          user_id?: string;
          status?: string;
          provider?: string;
          description?: string | null;
          prompt_id?: string | null;
          tags?: Json | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bavi_assets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bavi_assets_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      bavi_variants: {
        Row: {
          variant_id: string;
          asset_id: string;
          public_id: string;
          state: string;
          width: number;
          height: number;
          created_at: string;
        };
        Insert: {
          variant_id: string;
          asset_id: string;
          public_id: string;
          state: string;
          width: number;
          height: number;
          created_at?: string;
        };
        Update: {
          variant_id?: string;
          asset_id?: string;
          public_id?: string;
          state?: string;
          width?: number;
          height?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bavi_variants_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "bavi_assets";
            referencedColumns: ["asset_id"];
          },
        ];
      };
      campaign_artifacts: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          draft_id: string;
          storage_path: string;
          version: number;
          file_size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          draft_id: string;
          storage_path: string;
          version?: number;
          file_size: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          draft_id?: string;
          storage_path?: string;
          version?: number;
          file_size?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_artifacts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaign_artifacts_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      campaign_drafts: {
        Row: {
          draft_id: string;
          user_id: string;
          workspace_id: string;
          draft_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          draft_id: string;
          user_id: string;
          workspace_id: string;
          draft_data: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          draft_id?: string;
          user_id?: string;
          workspace_id?: string;
          draft_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_drafts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaign_drafts_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      campaign_templates: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          name: string;
          description: string | null;
          source_campaign_id: string;
          draft_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          name: string;
          description?: string | null;
          source_campaign_id: string;
          draft_data: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          source_campaign_id?: string;
          draft_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "campaign_templates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "campaign_templates_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      cogniread_articles: {
        Row: {
          id: string;
          status: string;
          study_dna: Json;
          content: Json;
          tags: string[] | null;
          available_languages: string[] | null;
          bavi_hero_image_id: string | null;
          related_prompt_ids: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          status?: string;
          study_dna: Json;
          content: Json;
          tags?: string[] | null;
          available_languages?: string[] | null;
          bavi_hero_image_id?: string | null;
          related_prompt_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          status?: string;
          study_dna?: Json;
          content?: Json;
          tags?: string[] | null;
          available_languages?: string[] | null;
          bavi_hero_image_id?: string | null;
          related_prompt_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      commerce_orders: {
        Row: {
          id: string;
          stripe_payment_intent_id: string;
          user_id: string | null;
          amount: number;
          currency: string;
          status: string;
          customer_email: string;
          items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          stripe_payment_intent_id: string;
          user_id?: string | null;
          amount: number;
          currency: string;
          status: string;
          customer_email: string;
          items: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          stripe_payment_intent_id?: string;
          user_id?: string | null;
          amount?: number;
          currency?: string;
          status?: string;
          customer_email?: string;
          items?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "commerce_orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      community_comments: {
        Row: {
          id: string;
          article_id: string;
          user_id: string;
          author_name: string;
          author_avatar_url: string | null;
          comment_text: string;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          user_id: string;
          author_name: string;
          author_avatar_url?: string | null;
          comment_text: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          user_id?: string;
          author_name?: string;
          author_avatar_url?: string | null;
          comment_text?: string;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_comments_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "cogniread_articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "community_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          is_read: boolean;
          type: "info" | "success" | "warning" | "error";
          message: string;
          link: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          is_read?: boolean;
          type: "info" | "success" | "warning" | "error";
          message: string;
          link?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          is_read?: boolean;
          type?: "info" | "success" | "warning" | "error";
          message?: string;
          link?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          provider_name: string | null;
          provider_avatar_url: string | null;
          created_at: string;
          updated_at: string;
          last_sign_in_at: string | null;
          last_sign_in_ip: string | null;
          last_sign_in_location: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          provider_name?: string | null;
          provider_avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_sign_in_at?: string | null;
          last_sign_in_ip?: string | null;
          last_sign_in_location?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          provider_name?: string | null;
          provider_avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          last_sign_in_at?: string | null;
          last_sign_in_ip?: string | null;
          last_sign_in_location?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      razprompts_entries: {
        Row: {
          id: string;
          user_id: string;
          workspace_id: string;
          title: string;
          status: string;
          ai_service: string;
          keywords: string[] | null;
          versions: Json;
          tags: Json | null;
          bavi_asset_ids: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          workspace_id: string;
          title: string;
          status?: string;
          ai_service: string;
          keywords?: string[] | null;
          versions: Json;
          tags?: Json | null;
          bavi_asset_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workspace_id?: string;
          title?: string;
          status?: string;
          ai_service?: string;
          keywords?: string[] | null;
          versions?: Json;
          tags?: Json | null;
          bavi_asset_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "razprompts_entries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "razprompts_entries_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      theme_presets: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          name: string;
          description: string | null;
          theme_config: Json;
          created_at: string;
          updated_at: string;
          type: "color" | "font" | "geometry";
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          name: string;
          description?: string | null;
          theme_config: Json;
          created_at?: string;
          updated_at?: string;
          type: "color" | "font" | "geometry";
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          theme_config?: Json;
          created_at?: string;
          updated_at?: string;
          type?: "color" | "font" | "geometry";
        };
        Relationships: [
          {
            foreignKeyName: "theme_presets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "theme_presets_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      // --- TABLA FALTANTE AÑADIDA ---
      theme_fragments: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          name: string;
          type: "color" | "font" | "geometry";
          data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          name: string;
          type: "color" | "font" | "geometry";
          data: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          name?: string;
          type?: "color" | "font" | "geometry";
          data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "theme_fragments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "theme_fragments_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      user_activity_events: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          workspace_id: string;
          session_id: string;
          event_type: string;
          payload: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          workspace_id: string;
          session_id: string;
          event_type: string;
          payload?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          workspace_id?: string;
          session_id?: string;
          event_type?: string;
          payload?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_activity_events_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_activity_events_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      user_profile_summary: {
        Row: {
          id: string;
          user_type: string;
          total_sessions: number;
          total_events: number;
          total_conversions: number;
          first_seen_at: string | null;
          last_seen_at: string | null;
          most_frequent_country: string | null;
          last_campaign_id_seen: string | null;
          last_variant_id_seen: string | null;
          last_insight_generated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_type: string;
          total_sessions?: number;
          total_events?: number;
          total_conversions?: number;
          first_seen_at?: string | null;
          last_seen_at?: string | null;
          most_frequent_country?: string | null;
          last_campaign_id_seen?: string | null;
          last_variant_id_seen?: string | null;
          last_insight_generated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_type?: string;
          total_sessions?: number;
          total_events?: number;
          total_conversions?: number;
          first_seen_at?: string | null;
          last_seen_at?: string | null;
          most_frequent_country?: string | null;
          last_campaign_id_seen?: string | null;
          last_variant_id_seen?: string | null;
          last_insight_generated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_profile_summary_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      visitor_campaign_events: {
        Row: {
          event_id: string;
          session_id: string;
          campaign_id: string;
          variant_id: string;
          event_type: string;
          payload: Json | null;
          created_at: string;
          referer: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
        };
        Insert: {
          event_id?: string;
          session_id: string;
          campaign_id: string;
          variant_id: string;
          event_type: string;
          payload?: Json | null;
          created_at?: string;
          referer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
        Update: {
          event_id?: string;
          session_id?: string;
          campaign_id?: string;
          variant_id?: string;
          event_type?: string;
          payload?: Json | null;
          created_at?: string;
          referer?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "visitor_campaign_events_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "visitor_sessions";
            referencedColumns: ["session_id"];
          },
        ];
      };
      visitor_sessions: {
        Row: {
          session_id: string;
          fingerprint_id: string | null;
          user_id: string | null;
          workspace_id: string | null;
          ip_address_encrypted: string | null;
          user_agent_encrypted: string | null;
          geo_encrypted: Json | null;
          first_seen_at: string;
          last_seen_at: string;
        };
        Insert: {
          session_id: string;
          fingerprint_id?: string | null;
          user_id?: string | null;
          workspace_id?: string | null;
          ip_address_encrypted?: string | null;
          user_agent_encrypted?: string | null;
          geo_encrypted?: Json | null;
          first_seen_at?: string;
          last_seen_at?: string;
        };
        Update: {
          session_id?: string;
          fingerprint_id?: string | null;
          user_id?: string | null;
          workspace_id?: string | null;
          ip_address_encrypted?: string | null;
          user_agent_encrypted?: string | null;
          geo_encrypted?: Json | null;
          first_seen_at?: string;
          last_seen_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "visitor_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "visitor_sessions_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspaces: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      workspace_members: {
        Row: {
          workspace_id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          workspace_id: string;
          user_id: string;
          role: string;
          created_at?: string;
        };
        Update: {
          workspace_id?: string;
          user_id?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_campaign_analytics: {
        Args: { p_user_id: string };
        Returns: Json;
      };
      get_public_table_names: {
        Args: Record<PropertyKey, never>;
        Returns: { table_name: string }[];
      };
      get_system_diagnostics: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_user_role_in_workspace: {
        Args: { workspace_id_to_check: string };
        Returns: string;
      };
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      is_workspace_member: {
        Args: { workspace_id_to_check: string; min_role?: string };
        Returns: boolean;
      };
      link_fingerprint_to_user: {
        Args: { p_fingerprint_id: string; p_user_id: string };
        Returns: undefined;
      };
      update_cogniread_available_languages: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      notification_type: "info" | "success" | "warning" | "error";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
