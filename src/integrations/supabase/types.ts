export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chat_messages: {
        Row: {
          id: string
          is_from_user: boolean
          message_metadata: Json | null
          message_text: string
          mood_detected: string | null
          sentiment_score: number | null
          session_id: string | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          is_from_user: boolean
          message_metadata?: Json | null
          message_text: string
          mood_detected?: string | null
          sentiment_score?: number | null
          session_id?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          is_from_user?: boolean
          message_metadata?: Json | null
          message_text?: string
          mood_detected?: string | null
          sentiment_score?: number | null
          session_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_sessions: {
        Row: {
          ai_recommendations: string[] | null
          created_at: string | null
          id: string
          language_used: string | null
          mood_analysis: Json | null
          session_end: string | null
          session_start: string | null
          session_summary: string | null
          user_id: string | null
        }
        Insert: {
          ai_recommendations?: string[] | null
          created_at?: string | null
          id?: string
          language_used?: string | null
          mood_analysis?: Json | null
          session_end?: string | null
          session_start?: string | null
          session_summary?: string | null
          user_id?: string | null
        }
        Update: {
          ai_recommendations?: string[] | null
          created_at?: string | null
          id?: string
          language_used?: string | null
          mood_analysis?: Json | null
          session_end?: string | null
          session_start?: string | null
          session_summary?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      album_photos: {
        Row: {
          album_id: string
          created_at: string
          file_name: string
          file_size: number
          file_type: string
          id: string
          storage_path: string
          thumbnail_url: string | null
          upload_url: string
        }
        Insert: {
          album_id: string
          created_at?: string
          file_name: string
          file_size: number
          file_type: string
          id?: string
          storage_path: string
          thumbnail_url?: string | null
          upload_url: string
        }
        Update: {
          album_id?: string
          created_at?: string
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          storage_path?: string
          thumbnail_url?: string | null
          upload_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "photo_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          payment_amount: number | null
          payment_status: string | null
          status: string | null
          therapist_id: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          status?: string | null
          therapist_id: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          status?: string | null
          therapist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_feedback: {
        Row: {
          comment: string | null
          complaint_id: string | null
          created_at: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          complaint_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          complaint_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaint_feedback_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_votes: {
        Row: {
          complaint_id: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          complaint_id: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          complaint_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaint_votes_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          admin_response: string | null
          category: Database["public"]["Enums"]["complaint_category"]
          complaint_id: string | null
          created_at: string | null
          description: string
          id: string
          is_anonymous: boolean | null
          location_lat: number | null
          location_lng: number | null
          location_text: string | null
          phone: string | null
          photo_url: string | null
          priority: number | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["complaint_status"] | null
          title: string
          updated_at: string | null
          user_id: string | null
          voice_memo_url: string | null
          vote_count: number | null
        }
        Insert: {
          admin_response?: string | null
          category: Database["public"]["Enums"]["complaint_category"]
          complaint_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_anonymous?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          location_text?: string | null
          phone?: string | null
          photo_url?: string | null
          priority?: number | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["complaint_status"] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          voice_memo_url?: string | null
          vote_count?: number | null
        }
        Update: {
          admin_response?: string | null
          category?: Database["public"]["Enums"]["complaint_category"]
          complaint_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_anonymous?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          location_text?: string | null
          phone?: string | null
          photo_url?: string | null
          priority?: number | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["complaint_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          voice_memo_url?: string | null
          vote_count?: number | null
        }
        Relationships: []
      }
      content_library: {
        Row: {
          audio_url: string | null
          category: string | null
          content_type: string | null
          created_at: string | null
          description_en: string | null
          description_th: string | null
          duration_minutes: number | null
          id: string
          is_premium: boolean | null
          thumbnail_url: string | null
          title_en: string
          title_th: string
        }
        Insert: {
          audio_url?: string | null
          category?: string | null
          content_type?: string | null
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          duration_minutes?: number | null
          id?: string
          is_premium?: boolean | null
          thumbnail_url?: string | null
          title_en: string
          title_th: string
        }
        Update: {
          audio_url?: string | null
          category?: string | null
          content_type?: string | null
          created_at?: string | null
          description_en?: string | null
          description_th?: string | null
          duration_minutes?: number | null
          id?: string
          is_premium?: boolean | null
          thumbnail_url?: string | null
          title_en?: string
          title_th?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      daily_moods: {
        Row: {
          activities_done: string[] | null
          afternoon_mood: string | null
          created_at: string | null
          date: string
          energy_level: number | null
          evening_mood: string | null
          gratitude_notes: string | null
          id: string
          mood_notes: string | null
          morning_mood: string | null
          overall_mood: string | null
          sleep_quality: number | null
          stress_level: number | null
          user_id: string | null
        }
        Insert: {
          activities_done?: string[] | null
          afternoon_mood?: string | null
          created_at?: string | null
          date: string
          energy_level?: number | null
          evening_mood?: string | null
          gratitude_notes?: string | null
          id?: string
          mood_notes?: string | null
          morning_mood?: string | null
          overall_mood?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id?: string | null
        }
        Update: {
          activities_done?: string[] | null
          afternoon_mood?: string | null
          created_at?: string | null
          date?: string
          energy_level?: number | null
          evening_mood?: string | null
          gratitude_notes?: string | null
          id?: string
          mood_notes?: string | null
          morning_mood?: string | null
          overall_mood?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string | null
          feedback_type: string | null
          id: string
          is_resolved: boolean | null
          message: string | null
          rating: number | null
          screen_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          is_resolved?: boolean | null
          message?: string | null
          rating?: number | null
          screen_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          is_resolved?: boolean | null
          message?: string | null
          rating?: number | null
          screen_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      heart_rate_data: {
        Row: {
          created_at: string
          device_id: string | null
          heart_rate: number
          id: string
          recorded_at: string
          stress_level: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          heart_rate: number
          id?: string
          recorded_at: string
          stress_level?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          heart_rate?: number
          id?: string
          recorded_at?: string
          stress_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "heart_rate_data_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "smartwatch_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      meditation_content: {
        Row: {
          audio_url_en: string | null
          audio_url_th: string | null
          background_image_url: string | null
          created_at: string | null
          cultural_context: string | null
          description_en: string | null
          description_th: string | null
          difficulty_level: number | null
          duration_minutes: number
          id: string
          instructor_name: string | null
          is_premium: boolean | null
          meditation_type: string
          tags: string[] | null
          title_en: string
          title_th: string
        }
        Insert: {
          audio_url_en?: string | null
          audio_url_th?: string | null
          background_image_url?: string | null
          created_at?: string | null
          cultural_context?: string | null
          description_en?: string | null
          description_th?: string | null
          difficulty_level?: number | null
          duration_minutes: number
          id?: string
          instructor_name?: string | null
          is_premium?: boolean | null
          meditation_type: string
          tags?: string[] | null
          title_en: string
          title_th: string
        }
        Update: {
          audio_url_en?: string | null
          audio_url_th?: string | null
          background_image_url?: string | null
          created_at?: string | null
          cultural_context?: string | null
          description_en?: string | null
          description_th?: string | null
          difficulty_level?: number | null
          duration_minutes?: number
          id?: string
          instructor_name?: string | null
          is_premium?: boolean | null
          meditation_type?: string
          tags?: string[] | null
          title_en?: string
          title_th?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          ai_analysis: Json | null
          created_at: string | null
          id: string
          mood_score: number | null
          mood_text: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string | null
          id?: string
          mood_score?: number | null
          mood_text?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string | null
          id?: string
          mood_score?: number | null
          mood_text?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_complaint_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_complaint_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_complaint_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_complaint_id_fkey"
            columns: ["related_complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_albums: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_albums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          meditation_minutes: number | null
          mood_streak: number | null
          onboarding_completed: boolean | null
          preferred_language: string | null
          premium_member: boolean | null
          streak_count: number | null
          updated_at: string | null
          wellness_score: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          meditation_minutes?: number | null
          mood_streak?: number | null
          onboarding_completed?: boolean | null
          preferred_language?: string | null
          premium_member?: boolean | null
          streak_count?: number | null
          updated_at?: string | null
          wellness_score?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          meditation_minutes?: number | null
          mood_streak?: number | null
          onboarding_completed?: boolean | null
          preferred_language?: string | null
          premium_member?: boolean | null
          streak_count?: number | null
          updated_at?: string | null
          wellness_score?: number | null
        }
        Relationships: []
      }
      sleep_data: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          sleep_duration_minutes: number
          sleep_end: string
          sleep_quality: string | null
          sleep_start: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          sleep_duration_minutes: number
          sleep_end: string
          sleep_quality?: string | null
          sleep_start: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          sleep_duration_minutes?: number
          sleep_end?: string
          sleep_quality?: string | null
          sleep_start?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sleep_data_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "smartwatch_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      smartwatch_devices: {
        Row: {
          created_at: string
          device_name: string | null
          device_type: string
          id: string
          is_connected: boolean | null
          last_sync_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_name?: string | null
          device_type: string
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_name?: string | null
          device_type?: string
          id?: string
          is_connected?: boolean | null
          last_sync_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      smartwatch_notifications: {
        Row: {
          device_id: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          sent_at: string
          title: string
          user_id: string
        }
        Insert: {
          device_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          sent_at?: string
          title: string
          user_id: string
        }
        Update: {
          device_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          sent_at?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "smartwatch_notifications_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "smartwatch_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      therapists: {
        Row: {
          availability: Json | null
          availability_schedule: Json | null
          bio_en: string | null
          bio_th: string | null
          created_at: string | null
          credentials: string[] | null
          email: string
          full_name: string
          hourly_rate: number | null
          hourly_rate_thb: number | null
          id: string
          is_verified: boolean | null
          languages: string[] | null
          languages_spoken: string[] | null
          location_province: string | null
          offers_in_person_sessions: boolean | null
          offers_online_sessions: boolean | null
          phone: string | null
          profile_image_url: string | null
          rating: number | null
          specializations: string[] | null
          total_reviews: number | null
          years_of_experience: number | null
        }
        Insert: {
          availability?: Json | null
          availability_schedule?: Json | null
          bio_en?: string | null
          bio_th?: string | null
          created_at?: string | null
          credentials?: string[] | null
          email: string
          full_name: string
          hourly_rate?: number | null
          hourly_rate_thb?: number | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          languages_spoken?: string[] | null
          location_province?: string | null
          offers_in_person_sessions?: boolean | null
          offers_online_sessions?: boolean | null
          phone?: string | null
          profile_image_url?: string | null
          rating?: number | null
          specializations?: string[] | null
          total_reviews?: number | null
          years_of_experience?: number | null
        }
        Update: {
          availability?: Json | null
          availability_schedule?: Json | null
          bio_en?: string | null
          bio_th?: string | null
          created_at?: string | null
          credentials?: string[] | null
          email?: string
          full_name?: string
          hourly_rate?: number | null
          hourly_rate_thb?: number | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          languages_spoken?: string[] | null
          location_province?: string | null
          offers_in_person_sessions?: boolean | null
          offers_online_sessions?: boolean | null
          phone?: string | null
          profile_image_url?: string | null
          rating?: number | null
          specializations?: string[] | null
          total_reviews?: number | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_name_en: string | null
          achievement_name_th: string | null
          achievement_type: string
          description: string | null
          description_en: string | null
          description_th: string | null
          earned_at: string | null
          icon_name: string | null
          id: string
          is_milestone: boolean | null
          points: number | null
          points_earned: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_name_en?: string | null
          achievement_name_th?: string | null
          achievement_type: string
          description?: string | null
          description_en?: string | null
          description_th?: string | null
          earned_at?: string | null
          icon_name?: string | null
          id?: string
          is_milestone?: boolean | null
          points?: number | null
          points_earned?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_name_en?: string | null
          achievement_name_th?: string | null
          achievement_type?: string
          description?: string | null
          description_en?: string | null
          description_th?: string | null
          earned_at?: string | null
          icon_name?: string | null
          id?: string
          is_milestone?: boolean | null
          points?: number | null
          points_earned?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_meditation_sessions: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          duration_minutes: number | null
          id: string
          meditation_content_id: string | null
          mood_after: string | null
          mood_before: string | null
          session_notes: string | null
          started_at: string | null
          user_id: string | null
          was_interrupted: boolean | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          duration_minutes?: number | null
          id?: string
          meditation_content_id?: string | null
          mood_after?: string | null
          mood_before?: string | null
          session_notes?: string | null
          started_at?: string | null
          user_id?: string | null
          was_interrupted?: boolean | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          duration_minutes?: number | null
          id?: string
          meditation_content_id?: string | null
          mood_after?: string | null
          mood_before?: string | null
          session_notes?: string | null
          started_at?: string | null
          user_id?: string | null
          was_interrupted?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_meditation_sessions_meditation_content_id_fkey"
            columns: ["meditation_content_id"]
            isOneToOne: false
            referencedRelation: "meditation_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          points: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          village: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          village?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          village?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      analyze_stress_from_hr: {
        Args: { heart_rate: number }
        Returns: string
      }
      award_points: {
        Args: { user_uuid: string; points_to_add: number }
        Returns: undefined
      }
      create_notification: {
        Args: {
          user_uuid: string
          notification_title: string
          notification_message: string
          complaint_uuid?: string
        }
        Returns: undefined
      }
      generate_complaint_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      complaint_category:
        | "road"
        | "water"
        | "waste"
        | "electricity"
        | "public_safety"
        | "environment"
        | "other"
      complaint_status: "open" | "in_progress" | "resolved" | "closed"
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
      user_role: "resident" | "admin" | "official"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      complaint_category: [
        "road",
        "water",
        "waste",
        "electricity",
        "public_safety",
        "environment",
        "other",
      ],
      complaint_status: ["open", "in_progress", "resolved", "closed"],
      pricing_plan_interval: ["day", "week", "month", "year"],
      pricing_type: ["one_time", "recurring"],
      subscription_status: [
        "trialing",
        "active",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "past_due",
        "unpaid",
      ],
      user_role: ["resident", "admin", "official"],
    },
  },
} as const
