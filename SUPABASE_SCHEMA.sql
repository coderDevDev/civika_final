-- ==========================================
-- CIVIKA Leaderboard Database Schema
-- For Supabase PostgreSQL
-- ==========================================

-- 1. LEADERBOARD TABLE
-- Stores player rankings and overall game statistics
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    total_score INTEGER NOT NULL DEFAULT 0,
    badges INTEGER NOT NULL DEFAULT 0,
    coins INTEGER NOT NULL DEFAULT 0,
    completed_missions INTEGER NOT NULL DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0.00,
    playtime INTEGER DEFAULT 0, -- in minutes
    fastest_quiz_time DECIMAL(6,2),
    excellent_answers INTEGER DEFAULT 0,
    great_answers INTEGER DEFAULT 0,
    good_answers INTEGER DEFAULT 0,
    total_collectibles INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_level ON leaderboard(level);
CREATE INDEX IF NOT EXISTS idx_leaderboard_badges ON leaderboard(badges DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_speed ON leaderboard(fastest_quiz_time ASC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_collectibles ON leaderboard(total_collectibles DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_player ON leaderboard(player_name);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON leaderboard;
DROP POLICY IF EXISTS "Enable insert for all users" ON leaderboard;
DROP POLICY IF EXISTS "Enable update for users based on player_name" ON leaderboard;

-- Create policies (allow anyone to read, insert, and update)
CREATE POLICY "Enable read access for all users" 
    ON leaderboard FOR SELECT 
    USING (true);

CREATE POLICY "Enable insert for all users" 
    ON leaderboard FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Enable update for users based on player_name" 
    ON leaderboard FOR UPDATE 
    USING (true);

-- ==========================================
-- 2. SPEED CHALLENGES TABLE
-- Tracks individual quiz speed records
CREATE TABLE IF NOT EXISTS speed_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    mission_id INTEGER NOT NULL,
    time_taken DECIMAL(6,2) NOT NULL,
    time_bonus INTEGER DEFAULT 0,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_speed_player ON speed_challenges(player_name);
CREATE INDEX IF NOT EXISTS idx_speed_time ON speed_challenges(time_taken ASC);
CREATE INDEX IF NOT EXISTS idx_speed_mission ON speed_challenges(mission_id);

-- Enable RLS
ALTER TABLE speed_challenges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON speed_challenges;
DROP POLICY IF EXISTS "Enable insert for all users" ON speed_challenges;

-- Create policies
CREATE POLICY "Enable read access for all users" 
    ON speed_challenges FOR SELECT 
    USING (true);

CREATE POLICY "Enable insert for all users" 
    ON speed_challenges FOR INSERT 
    WITH CHECK (true);

-- ==========================================
-- 3. DAILY SCORES TABLE
-- Tracks daily challenge scores (resets daily)
CREATE TABLE IF NOT EXISTS daily_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    challenge_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique constraint: one entry per player per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_player_date 
    ON daily_scores(player_name, challenge_date);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_score ON daily_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_scores(challenge_date DESC);

-- Enable RLS
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON daily_scores;
DROP POLICY IF EXISTS "Enable insert for all users" ON daily_scores;
DROP POLICY IF EXISTS "Enable update for all users" ON daily_scores;

-- Create policies
CREATE POLICY "Enable read access for all users" 
    ON daily_scores FOR SELECT 
    USING (true);

CREATE POLICY "Enable insert for all users" 
    ON daily_scores FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Enable update for all users" 
    ON daily_scores FOR UPDATE 
    USING (true);

-- ==========================================
-- VERIFICATION QUERIES
-- Run these to verify tables were created successfully
-- ==========================================

-- Check leaderboard table
SELECT 'Leaderboard table exists' AS status, COUNT(*) AS rows FROM leaderboard;

-- Check speed_challenges table
SELECT 'Speed challenges table exists' AS status, COUNT(*) AS rows FROM speed_challenges;

-- Check daily_scores table
SELECT 'Daily scores table exists' AS status, COUNT(*) AS rows FROM daily_scores;

-- Check indexes
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE tablename IN ('leaderboard', 'speed_challenges', 'daily_scores')
ORDER BY tablename, indexname;

-- ==========================================
-- SAMPLE DATA (Optional - for testing)
-- ==========================================

-- Insert sample leaderboard entries
INSERT INTO leaderboard (player_name, level, total_score, badges, coins, completed_missions, accuracy, playtime, fastest_quiz_time, excellent_answers, great_answers, good_answers, total_collectibles)
VALUES
    ('Alex', 2, 5420, 15, 850, 15, 95.5, 180, 7.5, 12, 3, 0, 18),
    ('Maria', 2, 5180, 14, 820, 14, 92.8, 165, 8.2, 10, 4, 0, 15),
    ('Juan', 1, 4950, 13, 780, 13, 90.1, 150, 9.1, 8, 5, 0, 12),
    ('Sofia', 1, 4750, 12, 720, 12, 88.5, 140, 10.5, 6, 6, 0, 10),
    ('Carlos', 1, 4600, 12, 680, 12, 85.2, 135, 11.2, 5, 7, 0, 8)
ON CONFLICT DO NOTHING;

-- Check sample data
SELECT * FROM leaderboard ORDER BY total_score DESC LIMIT 5;

-- ==========================================
-- MAINTENANCE QUERIES
-- ==========================================

-- Clean up old daily scores (older than 30 days)
DELETE FROM daily_scores WHERE challenge_date < CURRENT_DATE - INTERVAL '30 days';

-- Get leaderboard statistics
SELECT 
    COUNT(*) AS total_players,
    AVG(total_score) AS avg_score,
    MAX(total_score) AS max_score,
    MIN(total_score) AS min_score
FROM leaderboard;

-- ==========================================
-- END OF SCHEMA
-- ==========================================

