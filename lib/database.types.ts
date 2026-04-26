// Auto-generate with: npx supabase gen types typescript --project-id YOUR_ID > lib/database.types.ts

export type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: { code: string; name: string; flag: string | null; group_letter: string | null };
        Insert: { code: string; name: string; flag?: string | null; group_letter?: string | null };
        Update: { code?: string; name?: string; flag?: string | null; group_letter?: string | null };
        Relationships: [];
      };
      matches: {
        Row: {
          id: string;
          jornada_number: number;
          phase: string;
          home_team: string;
          away_team: string;
          kickoff_at: string;
          venue: string | null;
          home_score: number | null;
          away_score: number | null;
          status: 'scheduled' | 'live' | 'finished';
          special: 'double' | 'exact' | null;
          created_at: string;
        };
        Insert: {
          id: string;
          jornada_number: number;
          home_team: string;
          away_team: string;
          kickoff_at: string;
          phase?: string;
          venue?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          status?: 'scheduled' | 'live' | 'finished';
          special?: 'double' | 'exact' | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          jornada_number?: number;
          home_team?: string;
          away_team?: string;
          kickoff_at?: string;
          phase?: string;
          venue?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          status?: 'scheduled' | 'live' | 'finished';
          special?: 'double' | 'exact' | null;
        };
        Relationships: [
          { foreignKeyName: 'matches_home_team_fkey'; columns: ['home_team']; isOneToOne: false; referencedRelation: 'teams'; referencedColumns: ['code'] },
          { foreignKeyName: 'matches_away_team_fkey'; columns: ['away_team']; isOneToOne: false; referencedRelation: 'teams'; referencedColumns: ['code'] },
        ];
      };
      profiles: {
        Row: { id: string; handle: string; name: string; avatar_color: string | null; avatar_url: string | null; created_at: string };
        Insert: { id: string; handle: string; name: string; avatar_color?: string | null; avatar_url?: string | null; created_at?: string };
        Update: { handle?: string; name?: string; avatar_color?: string | null; avatar_url?: string | null };
        Relationships: [
          { foreignKeyName: 'profiles_id_fkey'; columns: ['id']; isOneToOne: true; referencedRelation: 'users'; referencedColumns: ['id'] },
        ];
      };
      leagues: {
        Row: { id: string; name: string; invite_code: string; owner_id: string; created_at: string };
        Insert: { id?: string; name: string; owner_id: string; invite_code?: string; created_at?: string };
        Update: { name?: string };
        Relationships: [
          { foreignKeyName: 'leagues_owner_id_fkey'; columns: ['owner_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
        ];
      };
      league_members: {
        Row: { league_id: string; user_id: string; joined_at: string };
        Insert: { league_id: string; user_id: string; joined_at?: string };
        Update: { joined_at?: string };
        Relationships: [
          { foreignKeyName: 'league_members_league_id_fkey'; columns: ['league_id']; isOneToOne: false; referencedRelation: 'leagues'; referencedColumns: ['id'] },
          { foreignKeyName: 'league_members_user_id_fkey'; columns: ['user_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
        ];
      };
      predictions: {
        Row: {
          id: string;
          user_id: string;
          league_id: string;
          match_id: string;
          pick: '1' | 'X' | '2' | null;
          exact_home: number | null;
          exact_away: number | null;
          submitted_at: string | null;
          points: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          league_id: string;
          match_id: string;
          pick?: '1' | 'X' | '2' | null;
          exact_home?: number | null;
          exact_away?: number | null;
          submitted_at?: string | null;
          points?: number | null;
        };
        Update: {
          pick?: '1' | 'X' | '2' | null;
          exact_home?: number | null;
          exact_away?: number | null;
          submitted_at?: string | null;
          points?: number | null;
        };
        Relationships: [
          { foreignKeyName: 'predictions_user_id_fkey'; columns: ['user_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'predictions_league_id_fkey'; columns: ['league_id']; isOneToOne: false; referencedRelation: 'leagues'; referencedColumns: ['id'] },
          { foreignKeyName: 'predictions_match_id_fkey'; columns: ['match_id']; isOneToOne: false; referencedRelation: 'matches'; referencedColumns: ['id'] },
        ];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          league_id: string | null;
          type: string;
          payload: Json;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          league_id?: string | null;
          payload?: Json;
          read_at?: string | null;
          created_at?: string;
        };
        Update: { read_at?: string | null };
        Relationships: [
          { foreignKeyName: 'notifications_user_id_fkey'; columns: ['user_id']; isOneToOne: false; referencedRelation: 'profiles'; referencedColumns: ['id'] },
          { foreignKeyName: 'notifications_league_id_fkey'; columns: ['league_id']; isOneToOne: false; referencedRelation: 'leagues'; referencedColumns: ['id'] },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_league: {
        Args: { league_name: string };
        Returns: string;
      };
      join_league_by_code: {
        Args: { code: string };
        Returns: string;
      };
      get_standings: {
        Args: { league_uuid: string };
        Returns: {
          user_id: string;
          handle: string;
          name: string;
          avatar_color: string;
          total_points: number;
          hits: number;
          predictions_count: number;
        }[];
      };
    };
  };
}
