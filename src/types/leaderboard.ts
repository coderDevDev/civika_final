/**
 * Leaderboard Type Definitions for CIVIKA
 */

export interface LeaderboardEntry {
    id?: string;
    player_name: string;
    level: number;
    total_score: number;
    badges: number;
    coins: number;
    completed_missions: number;
    accuracy: number;
    playtime: number;
    fastest_quiz_time?: number;
    excellent_answers?: number;
    great_answers?: number;
    good_answers?: number;
    total_collectibles?: number;
    created_at?: string;
    updated_at?: string;
}

export interface SpeedChallenge {
    id?: string;
    player_name: string;
    mission_id: number;
    time_taken: number;
    time_bonus: number;
    achieved_at?: string;
}

export interface DailyScore {
    id?: string;
    player_name: string;
    score: number;
    challenge_date?: string;
    created_at?: string;
}

export enum LeaderboardType {
    OVERALL = "overall",
    DAILY = "daily",
    SPEED = "speed",
    COLLECTORS = "collectors",
}
