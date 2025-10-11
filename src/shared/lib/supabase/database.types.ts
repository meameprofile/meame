export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          context_key: string;
          conversation_id: string;
          created_at: string;
          messages: Json;
          updated_at: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          context_key: string;
          conversation_id?: string;
          created_at?: string;
          messages?: Json;
          updated_at?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          context_key?: string;
          conversation_id?: string;
          created_at?: string;
          messages?: Json;
          updated_at?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_conversations_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      anonymous_campaign_events: {
        Row: {
          campaign_id: string;
          created_at: string;
          event_type: string;
          fingerprint_id: string;
          id: string;
          payload: Json | null;
          session_id: string;
          variant_id: string;
          workspace_id: string;
        };
        Insert: {
          campaign_id: string;
          created_at?: string;
          event_type: string;
          fingerprint_id: string;
          id?: string;
          payload?: Json | null;
          session_id: string;
          variant_id: string;
          workspace_id: string;
        };
        Update: {
          campaign_id?: string;
          created_at?: string;
          event_type?: string;
          fingerprint_id?: string;
          id?: string;
          payload?: Json | null;
          session_id?: string;
          variant_id?: string;
          workspace_id?: string;
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
          created_at: string;
          description: string;
          id: string;
          is_resolved: boolean;
          recommendation: string | null;
          related_data: Json | null;
          resolved_at: string | null;
          severity: Database["public"]["Enums"]["insight_severity"];
          title: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          is_resolved?: boolean;
          recommendation?: string | null;
          related_data?: Json | null;
          resolved_at?: string | null;
          severity: Database["public"]["Enums"]["insight_severity"];
          title: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          is_resolved?: boolean;
          recommendation?: string | null;
          related_data?: Json | null;
          resolved_at?: string | null;
          severity?: Database["public"]["Enums"]["insight_severity"];
          title?: string;
          workspace_id?: string;
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
          created_at: string;
          description: string | null;
          metadata: Json | null;
          prompt_id: string | null;
          provider: string;
          status: string;
          tags: Json | null;
          updated_at: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          asset_id: string;
          created_at?: string;
          description?: string | null;
          metadata?: Json | null;
          prompt_id?: string | null;
          provider?: string;
          status?: string;
          tags?: Json | null;
          updated_at?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          asset_id?: string;
          created_at?: string;
          description?: string | null;
          metadata?: Json | null;
          prompt_id?: string | null;
          provider?: string;
          status?: string;
          tags?: Json | null;
          updated_at?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
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
          asset_id: string;
          created_at: string;
          height: number;
          public_id: string;
          state: string;
          variant_id: string;
          width: number;
        };
        Insert: {
          asset_id: string;
          created_at?: string;
          height: number;
          public_id: string;
          state: string;
          variant_id: string;
          width: number;
        };
        Update: {
          asset_id?: string;
          created_at?: string;
          height?: number;
          public_id?: string;
          state?: string;
          variant_id?: string;
          width?: number;
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
          created_at: string;
          draft_id: string;
          file_size: number;
          id: string;
          storage_path: string;
          user_id: string;
          version: number;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          draft_id: string;
          file_size: number;
          id?: string;
          storage_path: string;
          user_id: string;
          version?: number;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          draft_id?: string;
          file_size?: number;
          id?: string;
          storage_path?: string;
          user_id?: string;
          version?: number;
          workspace_id?: string;
        };
        Relationships: [
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
          created_at: string;
          draft_data: Json;
          draft_id: string;
          updated_at: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          draft_data: Json;
          draft_id: string;
          updated_at?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          draft_data?: Json;
          draft_id?: string;
          updated_at?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
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
          created_at: string;
          description: string | null;
          draft_data: Json;
          id: string;
          name: string;
          source_campaign_id: string;
          updated_at: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          draft_data: Json;
          id?: string;
          name: string;
          source_campaign_id: string;
          updated_at?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          draft_data?: Json;
          id?: string;
          name?: string;
          source_campaign_id?: string;
          updated_at?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
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
          available_languages: string[] | null;
          bavi_hero_image_id: string | null;
          content: Json;
          created_at: string;
          id: string;
          related_prompt_ids: string[] | null;
          status: string;
          study_dna: Json;
          tags: string[] | null;
          updated_at: string;
        };
        Insert: {
          available_languages?: string[] | null;
          bavi_hero_image_id?: string | null;
          content: Json;
          created_at?: string;
          id: string;
          related_prompt_ids?: string[] | null;
          status?: string;
          study_dna: Json;
          tags?: string[] | null;
          updated_at?: string;
        };
        Update: {
          available_languages?: string[] | null;
          bavi_hero_image_id?: string | null;
          content?: Json;
          created_at?: string;
          id?: string;
          related_prompt_ids?: string[] | null;
          status?: string;
          study_dna?: Json;
          tags?: string[] | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      commerce_orders: {
        Row: {
          amount: number;
          created_at: string;
          currency: string;
          customer_email: string;
          id: string;
          items: Json;
          status: string;
          stripe_payment_intent_id: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          currency: string;
          customer_email: string;
          id: string;
          items: Json;
          status: string;
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          currency?: string;
          customer_email?: string;
          id?: string;
          items?: Json;
          status?: string;
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      community_comments: {
        Row: {
          article_id: string;
          author_avatar_url: string | null;
          author_name: string;
          comment_text: string;
          created_at: string;
          id: string;
          parent_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          article_id: string;
          author_avatar_url?: string | null;
          author_name: string;
          comment_text: string;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          article_id?: string;
          author_avatar_url?: string | null;
          author_name?: string;
          comment_text?: string;
          created_at?: string;
          id?: string;
          parent_id?: string | null;
          updated_at?: string;
          user_id?: string;
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
        ];
      };
      heimdall_events: {
        Row: {
          context: Json | null;
          created_at: string;
          duration_ms: number | null;
          event_id: string;
          event_name: string;
          payload: Json | null;
          status: string;
          step_name: string | null;
          task_id: string | null;
          timestamp: string;
          trace_id: string;
        };
        Insert: {
          context?: Json | null;
          created_at?: string;
          duration_ms?: number | null;
          event_id: string;
          event_name: string;
          payload?: Json | null;
          status: string;
          step_name?: string | null;
          task_id?: string | null;
          timestamp?: string;
          trace_id: string;
        };
        Update: {
          context?: Json | null;
          created_at?: string;
          duration_ms?: number | null;
          event_id?: string;
          event_name?: string;
          payload?: Json | null;
          status?: string;
          step_name?: string | null;
          task_id?: string | null;
          timestamp?: string;
          trace_id?: string;
        };
        Relationships: [];
      };
      i18n_content_entries: {
        Row: {
          created_at: string;
          domain: string | null;
          entry_key: string;
          last_modified_by: string | null;
          translations: Json;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          domain?: string | null;
          entry_key: string;
          last_modified_by?: string | null;
          translations: Json;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          domain?: string | null;
          entry_key?: string;
          last_modified_by?: string | null;
          translations?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          created_at: string;
          id: string;
          invited_by_user_id: string;
          invitee_email: string;
          status: Database["public"]["Enums"]["invitation_status"];
          token: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          invited_by_user_id: string;
          invitee_email: string;
          status?: Database["public"]["Enums"]["invitation_status"];
          token: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          invited_by_user_id?: string;
          invitee_email?: string;
          status?: Database["public"]["Enums"]["invitation_status"];
          token?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invitations_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          is_read: boolean;
          link: string | null;
          message: string;
          type: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_read?: boolean;
          link?: string | null;
          message: string;
          type: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_read?: boolean;
          link?: string | null;
          message?: string;
          type?: Database["public"]["Enums"]["notification_type"];
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          last_sign_in_at: string | null;
          last_sign_in_ip: string | null;
          last_sign_in_location: string | null;
          provider_avatar_url: string | null;
          provider_name: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          last_sign_in_at?: string | null;
          last_sign_in_ip?: string | null;
          last_sign_in_location?: string | null;
          provider_avatar_url?: string | null;
          provider_name?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          last_sign_in_at?: string | null;
          last_sign_in_ip?: string | null;
          last_sign_in_location?: string | null;
          provider_avatar_url?: string | null;
          provider_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      razprompts_entries: {
        Row: {
          ai_service: string;
          bavi_asset_ids: string[] | null;
          created_at: string;
          id: string;
          keywords: string[] | null;
          status: string;
          tags: Json | null;
          title: string;
          updated_at: string;
          user_id: string;
          versions: Json;
          workspace_id: string;
        };
        Insert: {
          ai_service: string;
          bavi_asset_ids?: string[] | null;
          created_at?: string;
          id: string;
          keywords?: string[] | null;
          status?: string;
          tags?: Json | null;
          title: string;
          updated_at?: string;
          user_id: string;
          versions: Json;
          workspace_id: string;
        };
        Update: {
          ai_service?: string;
          bavi_asset_ids?: string[] | null;
          created_at?: string;
          id?: string;
          keywords?: string[] | null;
          status?: string;
          tags?: Json | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
          versions?: Json;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "razprompts_entries_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      task_health_summary: {
        Row: {
          context: Json | null;
          created_at: string;
          duration_ms: number | null;
          status: Database["public"]["Enums"]["task_status"];
          task_id: string;
          task_name: string;
          timestamp: string;
          user_id: string | null;
          workspace_id: string | null;
        };
        Insert: {
          context?: Json | null;
          created_at?: string;
          duration_ms?: number | null;
          status: Database["public"]["Enums"]["task_status"];
          task_id: string;
          task_name: string;
          timestamp: string;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Update: {
          context?: Json | null;
          created_at?: string;
          duration_ms?: number | null;
          status?: Database["public"]["Enums"]["task_status"];
          task_id?: string;
          task_name?: string;
          timestamp?: string;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "task_health_summary_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      theme_fragments: {
        Row: {
          created_at: string;
          data: Json;
          id: string;
          name: string;
          type: string;
          updated_at: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          data: Json;
          id?: string;
          name: string;
          type: string;
          updated_at?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          data?: Json;
          id?: string;
          name?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "theme_fragments_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      theme_presets: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          theme_config: Json;
          type: string;
          updated_at: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          theme_config: Json;
          type: string;
          updated_at?: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          theme_config?: Json;
          type?: string;
          updated_at?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "theme_presets_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      user_activity_events: {
        Row: {
          created_at: string;
          event_type: string;
          id: string;
          payload: Json | null;
          session_id: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          event_type: string;
          id?: string;
          payload?: Json | null;
          session_id: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          event_type?: string;
          id?: string;
          payload?: Json | null;
          session_id?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_activity_events_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      user_preferences: {
        Row: {
          locale: string | null;
          theme: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          locale?: string | null;
          theme?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          locale?: string | null;
          theme?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_profile_summary: {
        Row: {
          created_at: string;
          first_seen_at: string | null;
          id: string;
          last_campaign_id_seen: string | null;
          last_insight_generated_at: string | null;
          last_seen_at: string | null;
          last_variant_id_seen: string | null;
          most_frequent_country: string | null;
          total_conversions: number;
          total_events: number;
          total_sessions: number;
          updated_at: string;
          user_type: string;
        };
        Insert: {
          created_at?: string;
          first_seen_at?: string | null;
          id: string;
          last_campaign_id_seen?: string | null;
          last_insight_generated_at?: string | null;
          last_seen_at?: string | null;
          last_variant_id_seen?: string | null;
          most_frequent_country?: string | null;
          total_conversions?: number;
          total_events?: number;
          total_sessions?: number;
          updated_at?: string;
          user_type: string;
        };
        Update: {
          created_at?: string;
          first_seen_at?: string | null;
          id?: string;
          last_campaign_id_seen?: string | null;
          last_insight_generated_at?: string | null;
          last_seen_at?: string | null;
          last_variant_id_seen?: string | null;
          most_frequent_country?: string | null;
          total_conversions?: number;
          total_events?: number;
          total_sessions?: number;
          updated_at?: string;
          user_type?: string;
        };
        Relationships: [];
      };
      visitor_campaign_events: {
        Row: {
          campaign_id: string;
          created_at: string;
          event_id: string;
          event_type: string;
          payload: Json | null;
          referer: string | null;
          session_id: string;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          variant_id: string;
        };
        Insert: {
          campaign_id: string;
          created_at?: string;
          event_id?: string;
          event_type: string;
          payload?: Json | null;
          referer?: string | null;
          session_id: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          variant_id: string;
        };
        Update: {
          campaign_id?: string;
          created_at?: string;
          event_id?: string;
          event_type?: string;
          payload?: Json | null;
          referer?: string | null;
          session_id?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          variant_id?: string;
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
      visitor_consents: {
        Row: {
          consent_status: Database["public"]["Enums"]["consent_status_type"];
          consented_at: string;
          fingerprint_id: string;
          id: string;
          ip_address_encrypted: string | null;
          session_id: string;
          user_agent_encrypted: string | null;
        };
        Insert: {
          consent_status: Database["public"]["Enums"]["consent_status_type"];
          consented_at?: string;
          fingerprint_id: string;
          id?: string;
          ip_address_encrypted?: string | null;
          session_id: string;
          user_agent_encrypted?: string | null;
        };
        Update: {
          consent_status?: Database["public"]["Enums"]["consent_status_type"];
          consented_at?: string;
          fingerprint_id?: string;
          id?: string;
          ip_address_encrypted?: string | null;
          session_id?: string;
          user_agent_encrypted?: string | null;
        };
        Relationships: [];
      };
      visitor_sessions: {
        Row: {
          fingerprint_id: string | null;
          first_seen_at: string;
          geo_encrypted: Json | null;
          ip_address_encrypted: string | null;
          last_seen_at: string;
          session_id: string;
          user_agent_encrypted: string | null;
          user_id: string | null;
          workspace_id: string | null;
        };
        Insert: {
          fingerprint_id?: string | null;
          first_seen_at?: string;
          geo_encrypted?: Json | null;
          ip_address_encrypted?: string | null;
          last_seen_at?: string;
          session_id: string;
          user_agent_encrypted?: string | null;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Update: {
          fingerprint_id?: string | null;
          first_seen_at?: string;
          geo_encrypted?: Json | null;
          ip_address_encrypted?: string | null;
          last_seen_at?: string;
          session_id?: string;
          user_agent_encrypted?: string | null;
          user_id?: string | null;
          workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "visitor_sessions_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspace_members: {
        Row: {
          created_at: string;
          role: string;
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          role: string;
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          role?: string;
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
        ];
      };
      workspaces: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          owner_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      analyze_behavior_patterns: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_superuser_etl_notification: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_campaign_analytics: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_prompts_count: {
        Args: { p_query?: string; p_tags?: Json; p_workspace_id: string };
        Returns: number;
      };
      get_public_table_names: {
        Args: Record<PropertyKey, never>;
        Returns: {
          table_name: string;
        }[];
      };
      get_system_diagnostics: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_task_health_summaries: {
        Args: { p_limit?: number };
        Returns: {
          duration_ms: number;
          task_id: string;
          task_name: string;
          task_status: string;
          task_timestamp: string;
          user_id: string;
          workspace_id: string;
        }[];
      };
      get_user_role_in_workspace: {
        Args: { workspace_id_to_check: string };
        Returns: string;
      };
      is_workspace_member: {
        Args: { min_role?: string; workspace_id_to_check: string };
        Returns: boolean;
      };
      link_fingerprint_to_user: {
        Args: { p_fingerprint_id: string; p_user_id: string };
        Returns: undefined;
      };
      run_daily_etl_and_notify: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_user_profile_summaries: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      consent_status_type: "accepted" | "rejected";
      insight_severity: "low" | "medium" | "high" | "critical";
      invitation_status: "pending" | "accepted" | "declined";
      notification_type: "info" | "success" | "warning" | "error";
      task_status: "SUCCESS" | "FAILURE";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      consent_status_type: ["accepted", "rejected"],
      insight_severity: ["low", "medium", "high", "critical"],
      invitation_status: ["pending", "accepted", "declined"],
      notification_type: ["info", "success", "warning", "error"],
      task_status: ["SUCCESS", "FAILURE"],
    },
  },
} as const;
