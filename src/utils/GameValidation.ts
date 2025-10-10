/**
 * CIVIKA Game Logic Validation System
 * Ensures proper game state management, validation, and progression
 */

export interface GameProgress {
    playerName: string;
    level: number;
    coins: number;
    badges: string[];
    completedMissions: number[];
    completedQuizzes: number[];
    totalScore: number;
    correctAnswers: number;
    totalQuestions: number;
    lastPlayedDate: string;
    playtime: number; // in minutes
    collectedItems?: string[]; // IDs of collected items (e.g., "barangay-coin-1", "city-badge-2")
    totalItemsCollected?: number; // Total count of all collected items
    speedChallenges?: {
        excellentAnswers: number; // Answered in ≤10s
        greatAnswers: number; // Answered in ≤20s
        goodAnswers: number; // Answered in ≤30s
    };
    fastestQuizTime?: number; // Fastest quiz completion time
    purchasedItems?: string[]; // IDs of purchased shop items
    npcRewardsReceived?: string[]; // IDs of NPC rewards already claimed
    currentTitle?: string; // Player's currently equipped title
    totalCoinsEarned?: number; // Total coins earned throughout the game (for secret quest tracking)
    totalStepsTaken?: number; // Total steps/distance walked (for wanderer title)
}

export interface MissionReward {
    missionId: number;
    badge: string;
    coins: number;
    points: number;
    prerequisite?: number[]; // Required completed missions
}

export interface QuizResult {
    missionId: number;
    questionIndex: number;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
    points: number;
}

export interface CollectibleItem {
    id: string;
    type: "coin" | "badge" | "powerup" | "treasure";
    name: string;
    description: string;
    value: number; // coins awarded
    points: number; // score points awarded
    rarity: "common" | "uncommon" | "rare" | "legendary";
    percentX: number; // Background-relative X position
    percentY: number; // Background-relative Y position
    icon: string; // Emoji or sprite key
}

export class GameValidation {
    private static readonly MISSION_REWARDS: Record<number, MissionReward> = {
        // Level 1: Barangay Missions (1-10)
        1: { missionId: 1, badge: "Eco-Kabataan", coins: 20, points: 100 },
        2: {
            missionId: 2,
            badge: "Registered Voter",
            coins: 15,
            points: 100,
            prerequisite: [1],
        },
        3: {
            missionId: 3,
            badge: "Community Explorer",
            coins: 25,
            points: 150,
            prerequisite: [1, 2],
        },
        4: {
            missionId: 4,
            badge: "Law Reader",
            coins: 30,
            points: 150,
            prerequisite: [1, 2, 3],
        },
        5: {
            missionId: 5,
            badge: "Digital Defender",
            coins: 35,
            points: 200,
            prerequisite: [1, 2, 3, 4],
        },
        6: {
            missionId: 6,
            badge: "Public Service Aide",
            coins: 25,
            points: 150,
            prerequisite: [1, 2, 3],
        },
        7: {
            missionId: 7,
            badge: "Peacekeeper",
            coins: 40,
            points: 200,
            prerequisite: [4, 5, 6],
        },
        8: {
            missionId: 8,
            badge: "Historian",
            coins: 45,
            points: 250,
            prerequisite: [1, 2, 3, 4, 5],
        },
        9: {
            missionId: 9,
            badge: "Health Advocate",
            coins: 35,
            points: 200,
            prerequisite: [3, 6],
        },
        10: {
            missionId: 10,
            badge: "Youth Leader",
            coins: 50,
            points: 300,
            prerequisite: [7, 8, 9],
        },

        // Level 2: City Missions (11-20) - Require all Level 1 completion
        11: {
            missionId: 11,
            badge: "Municipal Councilor",
            coins: 40,
            points: 300,
            prerequisite: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // All Level 1 missions
        },
        12: {
            missionId: 12,
            badge: "Financial Steward",
            coins: 45,
            points: 350,
            prerequisite: [11],
        },
        13: {
            missionId: 13,
            badge: "Infrastructure Expert",
            coins: 50,
            points: 400,
            prerequisite: [11, 12],
        },
        14: {
            missionId: 14,
            badge: "Commerce Facilitator",
            coins: 55,
            points: 450,
            prerequisite: [11, 12, 13],
        },
        15: {
            missionId: 15,
            badge: "Urban Planner",
            coins: 60,
            points: 500,
            prerequisite: [11, 12, 13, 14],
        },
        16: {
            missionId: 16,
            badge: "Green Champion",
            coins: 50,
            points: 400,
            prerequisite: [11, 12, 13],
        },
        17: {
            missionId: 17,
            badge: "Safety Coordinator",
            coins: 65,
            points: 550,
            prerequisite: [14, 15, 16],
        },
        18: {
            missionId: 18,
            badge: "Cultural Guardian",
            coins: 70,
            points: 600,
            prerequisite: [11, 12, 13, 14, 15],
        },
        19: {
            missionId: 19,
            badge: "Health Administrator",
            coins: 60,
            points: 500,
            prerequisite: [13, 16],
        },
        20: {
            missionId: 20,
            badge: "City Leader",
            coins: 80,
            points: 750,
            prerequisite: [17, 18, 19], // Requires key leadership areas
        },
    };

    private static readonly QUIZ_SCORING = {
        CORRECT_ANSWER: 50,
        PERFECT_SCORE_BONUS: 25, // Bonus for getting all questions correct
        TIME_BONUS_THRESHOLDS: {
            EXCELLENT: { maxTime: 10, bonus: 30 }, // Answer in 10s or less
            GREAT: { maxTime: 20, bonus: 20 }, // Answer in 20s or less
            GOOD: { maxTime: 30, bonus: 10 }, // Answer in 30s or less
        },
        QUIZ_TIME_LIMIT: 60, // Maximum time allowed per quiz (seconds)
    };

    private static readonly PROGRESSION_REQUIREMENTS = {
        LEVEL_1_TO_2: {
            BADGES_REQUIRED: 10, // All Level 1 badges
            MIN_SCORE_PERCENTAGE: 70,
        },
        LEVEL_2_TO_3: {
            BADGES_REQUIRED: 20, // All Level 1 + Level 2 badges
            MIN_SCORE_PERCENTAGE: 75,
        },
    };

    /**
     * Initialize default game progress
     */
    public static initializeGameProgress(playerName: string): GameProgress {
        return {
            playerName,
            level: 1,
            coins: 0,
            badges: [],
            completedMissions: [],
            completedQuizzes: [],
            totalScore: 0,
            correctAnswers: 0,
            totalQuestions: 0,
            lastPlayedDate: new Date().toISOString(),
            playtime: 0,
            collectedItems: [], // Initialize empty collectibles array
            totalItemsCollected: 0, // Initialize item count
            speedChallenges: {
                excellentAnswers: 0,
                greatAnswers: 0,
                goodAnswers: 0,
            },
            fastestQuizTime: Infinity,
            purchasedItems: [],
            npcRewardsReceived: [],
            currentTitle: "Citizen", // Start with Citizen title
            totalCoinsEarned: 0,
            totalStepsTaken: 0,
        };
    }

    /**
     * Validate quiz answer and calculate score
     */
    public static validateQuizAnswer(
        missionId: number,
        selectedAnswer: number,
        correctAnswer: number,
        timeSpent: number
    ): QuizResult {
        const isCorrect = selectedAnswer === correctAnswer;
        let points = 0;

        if (isCorrect) {
            points = this.QUIZ_SCORING.CORRECT_ANSWER;

            // Tiered time bonus for quick answers
            if (
                timeSpent <=
                this.QUIZ_SCORING.TIME_BONUS_THRESHOLDS.EXCELLENT.maxTime
            ) {
                points +=
                    this.QUIZ_SCORING.TIME_BONUS_THRESHOLDS.EXCELLENT.bonus;
                console.log(
                    `⚡ EXCELLENT speed bonus: +${this.QUIZ_SCORING.TIME_BONUS_THRESHOLDS.EXCELLENT.bonus} points!`
                );
            } else if (
                timeSpent <=
                this.QUIZ_SCORING.TIME_BONUS_THRESHOLDS.GREAT.maxTime
            ) {
                points += this.QUIZ_SCORING.TIME_BONUS_THRESHOLDS.GREAT.bonus;
                console.log(
                    `⚡ GREAT speed bonus: +${this.QUIZ_SCORING.TIME_BONUS_THRESHOLDS.GREAT.bonus} points!`
                );
            } else if (
                timeSpent <=
                this.QUIZ_SCORING.TIME_BONUS_THRESHOLDS.GOOD.maxTime
            ) {
                points += this.QUIZ_SCORING.TIME_BONUS_THRESHOLDS.GOOD.bonus;
                console.log(
                    `⚡ GOOD speed bonus: +${this.QUIZ_SCORING.TIME_BONUS_THRESHOLDS.GOOD.bonus} points!`
                );
            }
        }

        return {
            missionId,
            questionIndex: 0, // Will be updated when we have multiple questions per mission
            selectedAnswer,
            correctAnswer,
            isCorrect,
            timeSpent,
            points,
        };
    }

    /**
     * Check if player can access a mission
     */
    public static canAccessMission(
        missionId: number,
        completedMissions: number[]
    ): boolean {
        const mission = this.MISSION_REWARDS[missionId];
        if (!mission) return false;

        // Check prerequisites
        if (mission.prerequisite) {
            return mission.prerequisite.every((reqId) =>
                completedMissions.includes(reqId)
            );
        }

        return true;
    }

    /**
     * Validate and award mission completion
     */
    public static completeMission(
        missionId: number,
        quizResult: QuizResult,
        currentProgress: GameProgress
    ): GameProgress {
        // Validate mission access
        if (
            !this.canAccessMission(missionId, currentProgress.completedMissions)
        ) {
            throw new Error(`Mission ${missionId} prerequisites not met`);
        }

        // Check if mission already completed
        if (currentProgress.completedMissions.includes(missionId)) {
            console.warn(`Mission ${missionId} already completed`);
            return currentProgress;
        }

        // Get mission reward
        const missionReward = this.MISSION_REWARDS[missionId];
        if (!missionReward) {
            throw new Error(`Invalid mission ID: ${missionId}`);
        }

        // Only award if quiz was passed
        if (!quizResult.isCorrect) {
            console.log(`Mission ${missionId} not completed - quiz failed`);
            return {
                ...currentProgress,
                totalQuestions: currentProgress.totalQuestions + 1,
                lastPlayedDate: new Date().toISOString(),
            };
        }

        // Calculate total points (mission points + quiz points)
        const totalMissionPoints = missionReward.points + quizResult.points;

        // Update progress
        const updatedProgress: GameProgress = {
            ...currentProgress,
            coins: currentProgress.coins + missionReward.coins,
            badges: [...currentProgress.badges, missionReward.badge],
            completedMissions: [
                ...currentProgress.completedMissions,
                missionId,
            ],
            completedQuizzes: [...currentProgress.completedQuizzes, missionId],
            totalScore: currentProgress.totalScore + totalMissionPoints,
            correctAnswers: currentProgress.correctAnswers + 1,
            totalQuestions: currentProgress.totalQuestions + 1,
            lastPlayedDate: new Date().toISOString(),
        };

        // Check for level progression
        if (this.canProgressToNextLevel(updatedProgress)) {
            updatedProgress.level += 1;
        }

        return updatedProgress;
    }

    /**
     * Check if player can progress to next level
     */
    public static canProgressToNextLevel(progress: GameProgress): boolean {
        if (progress.level === 1) {
            // Level 1 to Level 2 progression
            const hasRequiredBadges =
                progress.badges.length >=
                this.PROGRESSION_REQUIREMENTS.LEVEL_1_TO_2.BADGES_REQUIRED;
            const hasMinScore =
                progress.totalQuestions > 0 &&
                (progress.correctAnswers / progress.totalQuestions) * 100 >=
                    this.PROGRESSION_REQUIREMENTS.LEVEL_1_TO_2
                        .MIN_SCORE_PERCENTAGE;

            return hasRequiredBadges && hasMinScore;
        } else if (progress.level === 2) {
            // Level 2 to Level 3 progression (future expansion)
            const hasRequiredBadges =
                progress.badges.length >=
                this.PROGRESSION_REQUIREMENTS.LEVEL_2_TO_3.BADGES_REQUIRED;
            const hasMinScore =
                progress.totalQuestions > 0 &&
                (progress.correctAnswers / progress.totalQuestions) * 100 >=
                    this.PROGRESSION_REQUIREMENTS.LEVEL_2_TO_3
                        .MIN_SCORE_PERCENTAGE;

            return hasRequiredBadges && hasMinScore;
        }

        return false; // No progression beyond implemented levels
    }

    /**
     * Get player statistics
     */
    public static getPlayerStats(progress: GameProgress) {
        const accuracy =
            progress.totalQuestions > 0
                ? Math.round(
                      (progress.correctAnswers / progress.totalQuestions) * 100
                  )
                : 0;

        const completionPercentage = Math.round(
            (progress.completedMissions.length /
                Object.keys(this.MISSION_REWARDS).length) *
                100
        );

        return {
            level: progress.level,
            coins: progress.coins,
            badgeCount: progress.badges.length,
            totalScore: progress.totalScore,
            accuracy: `${accuracy}%`,
            completionPercentage: `${completionPercentage}%`,
            correctAnswers: progress.correctAnswers,
            totalQuestions: progress.totalQuestions,
            playtime: progress.playtime,
        };
    }

    /**
     * Get available missions for current progress
     */
    public static getAvailableMissions(completedMissions: number[]): number[] {
        return Object.keys(this.MISSION_REWARDS)
            .map((id) => parseInt(id))
            .filter(
                (missionId) =>
                    !completedMissions.includes(missionId) &&
                    this.canAccessMission(missionId, completedMissions)
            );
    }

    /**
     * Validate game state integrity
     */
    public static validateGameState(progress: GameProgress): boolean {
        try {
            // Check if badges match completed missions
            const expectedBadges = progress.completedMissions
                .map((id) => this.MISSION_REWARDS[id]?.badge)
                .filter(Boolean);
            const badgesMatch = expectedBadges.every((badge) =>
                progress.badges.includes(badge)
            );

            // Check if coins are reasonable
            const expectedMinCoins = progress.completedMissions.reduce(
                (total, id) => {
                    return total + (this.MISSION_REWARDS[id]?.coins || 0);
                },
                0
            );
            const coinsValid = progress.coins >= expectedMinCoins;

            // Check if score is reasonable
            const scoreValid =
                progress.totalScore >= 0 &&
                progress.correctAnswers <= progress.totalQuestions;

            return badgesMatch && coinsValid && scoreValid;
        } catch (error) {
            console.error("Game state validation error:", error);
            return false;
        }
    }

    /**
     * Save game progress to localStorage
     */
    public static saveProgress(progress: GameProgress): void {
        try {
            const serialized = JSON.stringify({
                ...progress,
                lastPlayedDate: new Date().toISOString(),
                checksum: this.generateChecksum(progress),
            });
            localStorage.setItem("civika-game-progress", serialized);
            console.log("Game progress saved successfully");
        } catch (error) {
            console.error("Failed to save game progress:", error);
        }
    }

    /**
     * Load game progress from localStorage
     */
    public static loadProgress(): GameProgress | null {
        try {
            const saved = localStorage.getItem("civika-game-progress");
            if (!saved) return null;

            const parsed = JSON.parse(saved);
            const { checksum, ...progress } = parsed;

            // Validate checksum
            if (this.generateChecksum(progress) !== checksum) {
                console.warn(
                    "Game progress checksum mismatch - possible tampering"
                );
                return null;
            }

            // Validate game state
            if (!this.validateGameState(progress)) {
                console.warn("Game progress validation failed");
                return null;
            }

            return progress;
        } catch (error) {
            console.error("Failed to load game progress:", error);
            return null;
        }
    }

    /**
     * Generate simple checksum for save data integrity
     */
    private static generateChecksum(progress: GameProgress): string {
        const data = `${progress.playerName}-${progress.coins}-${progress.badges.length}-${progress.totalScore}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    }

    /**
     * Clear all game progress (for testing or reset)
     */
    public static clearProgress(): void {
        localStorage.removeItem("civika-game-progress");
        console.log("Game progress cleared");
    }
}
