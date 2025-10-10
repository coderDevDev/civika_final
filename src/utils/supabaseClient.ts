/**
 * Supabase Client Configuration for CIVIKA
 *
 * This file initializes the Supabase client for database operations.
 * Make sure to set up environment variables in .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Warn if credentials are missing
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "⚠️ Supabase credentials not found in environment variables. Leaderboard features will not work."
    );
    console.warn(
        "Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Test the connection to Supabase
 * @returns Promise<boolean> - true if connection successful
 */
export const testConnection = async (): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from("leaderboard")
            .select("count")
            .limit(1);

        if (error) throw error;
        console.log("✅ Supabase connected successfully");
        return true;
    } catch (error) {
        console.error("❌ Supabase connection failed:", error);
        console.error("Make sure you have:");
        console.error("1. Created a Supabase project");
        console.error("2. Set up the database schema");
        console.error("3. Added credentials to .env.local");
        return false;
    }
};

/**
 * Check if Supabase is configured
 * @returns boolean - true if credentials are present
 */
export const isSupabaseConfigured = (): boolean => {
    return !!(supabaseUrl && supabaseAnonKey);
};
