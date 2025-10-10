/**
 * Leaderboard Service for CIVIKA
 *
 * Handles all interactions with the Supabase leaderboard database,
 * including score submission, fetching rankings, and real-time updates.
 */

import { supabase, isSupabaseConfigured } from "../utils/supabaseClient";
import {
    LeaderboardEntry,
    SpeedChallenge,
    DailyScore,
} from "../types/leaderboard";
import { GameProgress } from "../utils/GameValidation";

export class LeaderboardService {
    private static instance: LeaderboardService;
    private enabled: boolean;

    private constructor() {
        this.enabled = isSupabaseConfigured();
        if (!this.enabled) {
            console.warn(
                "⚠️ LeaderboardService: Supabase not configured. Leaderboard features are disabled."
            );
        }
    }

    /**
     * Sanitize numeric value to ensure it's a safe integer
     * @param value - The number to sanitize
     * @returns Safe integer value
     */
    private sanitizeInteger(value: number | undefined): number {
        if (value === undefined || value === null || isNaN(value)) {
            return 0;
        }
        if (!isFinite(value)) {
            return 0;
        }
        return Math.round(value);
    }

    /**
     * Sanitize decimal value to ensure it has max 2 decimal places
     * @param value - The number to sanitize
     * @returns Safe decimal value with 2 decimal places
     */
    private sanitizeDecimal(value: number | undefined): number | undefined {
        if (value === undefined || value === null || isNaN(value)) {
            return undefined;
        }
        if (!isFinite(value)) {
            return undefined;
        }
        return parseFloat(value.toFixed(2));
    }

    public static getInstance(): LeaderboardService {
        if (!LeaderboardService.instance) {
            LeaderboardService.instance = new LeaderboardService();
        }
        return LeaderboardService.instance;
    }

    /**
     * Check if leaderboard is enabled
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Submit player score to leaderboard
     * @param progress - Current game progress
     * @returns Promise<boolean> - true if submission successful
     */
    async submitScore(progress: GameProgress): Promise<boolean> {
        if (!this.enabled) {
            console.log("Leaderboard disabled - skipping score submission");
            return false;
        }

        try {
            // Prepare entry data with proper data type formatting using sanitization helpers
            const entry: Omit<LeaderboardEntry, "id"> = {
                player_name: progress.playerName,
                level: this.sanitizeInteger(progress.level),
                total_score: this.sanitizeInteger(progress.totalScore),
                badges: this.sanitizeInteger(progress.badges.length),
                coins: this.sanitizeInteger(progress.coins),
                completed_missions: this.sanitizeInteger(
                    progress.completedMissions.length
                ),
                accuracy:
                    this.sanitizeDecimal(
                        progress.totalQuestions > 0
                            ? (progress.correctAnswers /
                                  progress.totalQuestions) *
                                  100
                            : 0
                    ) || 0,
                playtime: this.sanitizeInteger(progress.playtime),
                fastest_quiz_time: this.sanitizeDecimal(
                    progress.fastestQuizTime
                ),
                excellent_answers: this.sanitizeInteger(
                    progress.speedChallenges?.excellentAnswers
                ),
                great_answers: this.sanitizeInteger(
                    progress.speedChallenges?.greatAnswers
                ),
                good_answers: this.sanitizeInteger(
                    progress.speedChallenges?.goodAnswers
                ),
                total_collectibles: this.sanitizeInteger(
                    progress.totalItemsCollected
                ),
            };

            // Comprehensive logging for debugging
            console.log("📊 Submitting leaderboard entry:", {
                player: entry.player_name,
                level: entry.level,
                score: entry.total_score,
                badges: entry.badges,
                coins: entry.coins,
                missions: entry.completed_missions,
                accuracy: entry.accuracy,
                playtime: entry.playtime,
                fastestTime: entry.fastest_quiz_time,
                excellent: entry.excellent_answers,
                great: entry.great_answers,
                good: entry.good_answers,
                collectibles: entry.total_collectibles,
            });

            // Final validation to catch any remaining issues
            console.log("✅ Data sanitization complete, validating types...");

            // Type assertions to ensure TypeScript compliance
            entry.total_score = this.sanitizeInteger(entry.total_score);
            entry.coins = this.sanitizeInteger(entry.coins);
            entry.playtime = this.sanitizeInteger(entry.playtime);
            entry.badges = this.sanitizeInteger(entry.badges);
            entry.completed_missions = this.sanitizeInteger(
                entry.completed_missions
            );
            entry.excellent_answers = this.sanitizeInteger(
                entry.excellent_answers
            );
            entry.great_answers = this.sanitizeInteger(entry.great_answers);
            entry.good_answers = this.sanitizeInteger(entry.good_answers);
            entry.total_collectibles = this.sanitizeInteger(
                entry.total_collectibles
            );
            entry.level = this.sanitizeInteger(entry.level);

            // Sanitize decimals
            if (entry.accuracy !== undefined) {
                entry.accuracy = this.sanitizeDecimal(entry.accuracy) || 0;
            }
            if (entry.fastest_quiz_time !== undefined) {
                entry.fastest_quiz_time = this.sanitizeDecimal(
                    entry.fastest_quiz_time
                );
            }

            console.log("✅ Final sanitized entry ready for database:", entry);

            // Check if player already exists
            const { data: existing, error: selectError } = await supabase
                .from("leaderboard")
                .select("id, total_score")
                .eq("player_name", progress.playerName)
                .maybeSingle();

            if (selectError && selectError.code !== "PGRST116") {
                throw selectError;
            }

            if (existing) {
                // Update existing entry if new score is higher
                if (entry.total_score > existing.total_score) {
                    console.log(
                        "📝 Updating existing leaderboard entry:",
                        entry
                    );
                    const { error: updateError } = await supabase
                        .from("leaderboard")
                        .update({
                            ...entry,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", existing.id);

                    if (updateError) {
                        console.error("❌ Update failed:", updateError);
                        console.error(
                            "Entry that failed:",
                            JSON.stringify(entry, null, 2)
                        );
                        throw updateError;
                    }
                    console.log(
                        "✅ Leaderboard updated for",
                        progress.playerName
                    );
                    return true;
                } else {
                    console.log(
                        "Score not higher - skipping update",
                        entry.total_score,
                        "vs",
                        existing.total_score
                    );
                    return false;
                }
            } else {
                // Insert new entry
                console.log("📝 Inserting new leaderboard entry:", entry);
                const { error: insertError } = await supabase
                    .from("leaderboard")
                    .insert([entry]);

                if (insertError) {
                    console.error("❌ Insert failed:", insertError);
                    console.error(
                        "Entry that failed:",
                        JSON.stringify(entry, null, 2)
                    );
                    throw insertError;
                }
                console.log(
                    "✅ New leaderboard entry created for",
                    progress.playerName
                );
                return true;
            }
        } catch (error) {
            console.error("Failed to submit score to leaderboard:", error);
            console.error(
                "Full error details:",
                JSON.stringify(error, null, 2)
            );
            return false;
        }
    }

    /**
     * Get top players (overall leaderboard)
     * @param limit - Number of entries to fetch (default: 100)
     * @returns Promise<LeaderboardEntry[]>
     */
    async getTopPlayers(limit: number = 100): Promise<LeaderboardEntry[]> {
        if (!this.enabled) return [];

        try {
            const { data, error } = await supabase
                .from("leaderboard")
                .select("*")
                .order("total_score", { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
            return [];
        }
    }

    /**
     * Get leaderboard by level
     * @param level - Game level (1 or 2)
     * @param limit - Number of entries to fetch
     * @returns Promise<LeaderboardEntry[]>
     */
    async getLeaderboardByLevel(
        level: number,
        limit: number = 50
    ): Promise<LeaderboardEntry[]> {
        if (!this.enabled) return [];

        try {
            const { data, error } = await supabase
                .from("leaderboard")
                .select("*")
                .eq("level", level)
                .order("total_score", { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Failed to fetch level leaderboard:", error);
            return [];
        }
    }

    /**
     * Get speed challenge leaderboard (fastest quiz times)
     * @param limit - Number of entries to fetch
     * @returns Promise<LeaderboardEntry[]>
     */
    async getSpeedLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
        if (!this.enabled) return [];

        try {
            const { data, error } = await supabase
                .from("leaderboard")
                .select("*")
                .not("fastest_quiz_time", "is", null)
                .order("fastest_quiz_time", { ascending: true })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Failed to fetch speed leaderboard:", error);
            return [];
        }
    }

    /**
     * Get collector leaderboard (most collectibles found)
     * @param limit - Number of entries to fetch
     * @returns Promise<LeaderboardEntry[]>
     */
    async getCollectorLeaderboard(
        limit: number = 50
    ): Promise<LeaderboardEntry[]> {
        if (!this.enabled) return [];

        try {
            const { data, error } = await supabase
                .from("leaderboard")
                .select("*")
                .order("total_collectibles", { ascending: false })
                .order("total_score", { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Failed to fetch collector leaderboard:", error);
            return [];
        }
    }

    /**
     * Get player's rank in overall leaderboard
     * @param playerName - Player's name
     * @returns Promise<number | null> - Rank (1-indexed) or null if not found
     */
    async getPlayerRank(playerName: string): Promise<number | null> {
        if (!this.enabled) return null;

        try {
            // Get all players ordered by score
            const { data, error } = await supabase
                .from("leaderboard")
                .select("player_name, total_score")
                .order("total_score", { ascending: false });

            if (error) throw error;
            if (!data) return null;

            // Find player's position
            const rank = data.findIndex(
                (entry: { player_name: string }) =>
                    entry.player_name === playerName
            );
            return rank >= 0 ? rank + 1 : null;
        } catch (error) {
            console.error("Failed to get player rank:", error);
            return null;
        }
    }

    /**
     * Get daily leaderboard (resets every day)
     * @param limit - Number of entries to fetch
     * @returns Promise<DailyScore[]>
     */
    async getDailyLeaderboard(limit: number = 50): Promise<DailyScore[]> {
        if (!this.enabled) return [];

        try {
            const today = new Date().toISOString().split("T")[0];

            const { data, error } = await supabase
                .from("daily_scores")
                .select("*")
                .eq("challenge_date", today)
                .order("score", { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Failed to fetch daily leaderboard:", error);
            return [];
        }
    }

    /**
     * Submit daily score
     * @param playerName - Player's name
     * @param score - Today's score
     * @returns Promise<boolean> - true if submission successful
     */
    async submitDailyScore(
        playerName: string,
        score: number
    ): Promise<boolean> {
        if (!this.enabled) return false;

        try {
            const today = new Date().toISOString().split("T")[0];

            const { error } = await supabase.from("daily_scores").upsert(
                [
                    {
                        player_name: playerName,
                        score: Math.round(score), // Ensure integer
                        challenge_date: today,
                    },
                ],
                {
                    onConflict: "player_name,challenge_date",
                }
            );

            if (error) throw error;
            console.log("✅ Daily score submitted for", playerName);
            return true;
        } catch (error) {
            console.error("Failed to submit daily score:", error);
            return false;
        }
    }

    /**
     * Record speed challenge
     * @param playerName - Player's name
     * @param missionId - Mission ID
     * @param timeTaken - Time taken in seconds
     * @param timeBonus - Bonus points earned
     * @returns Promise<boolean> - true if recording successful
     */
    async recordSpeedChallenge(
        playerName: string,
        missionId: number,
        timeTaken: number,
        timeBonus: number
    ): Promise<boolean> {
        if (!this.enabled) return false;

        try {
            const challenge: Omit<SpeedChallenge, "id"> = {
                player_name: playerName,
                mission_id: missionId,
                time_taken: parseFloat(timeTaken.toFixed(2)), // Round to 2 decimal places
                time_bonus: Math.round(timeBonus), // Ensure integer
            };

            const { error } = await supabase
                .from("speed_challenges")
                .insert([challenge]);

            if (error) throw error;
            console.log("✅ Speed challenge recorded for", playerName);
            return true;
        } catch (error) {
            console.error("Failed to record speed challenge:", error);
            return false;
        }
    }

    /**
     * Subscribe to real-time leaderboard updates
     * @param callback - Function to call when leaderboard updates
     * @returns Subscription channel (save to unsubscribe later)
     */
    subscribeToLeaderboard(callback: (payload: any) => void) {
        if (!this.enabled) {
            console.warn("Leaderboard disabled - cannot subscribe to updates");
            return null;
        }

        return supabase
            .channel("leaderboard-changes")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "leaderboard" },
                callback
            )
            .subscribe();
    }

    /**
     * Unsubscribe from real-time updates
     * @param channel - Channel returned from subscribeToLeaderboard
     */
    unsubscribeFromLeaderboard(channel: any) {
        if (channel) {
            supabase.removeChannel(channel);
        }
    }
}

export default LeaderboardService;
