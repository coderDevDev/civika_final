/**
 * CIVIKA Game State Manager
 * Centralized game state management with validation and persistence
 */

import { GameValidation, GameProgress, QuizResult } from "./GameValidation";

export class GameStateManager {
    private static instance: GameStateManager;
    private gameProgress: GameProgress | null = null;
    private listeners: Array<(progress: GameProgress) => void> = [];
    private quizStartTime: number = 0;
    private developerMode: boolean = false; // Developer/Testing mode to bypass requirements

    private constructor() {}

    public static getInstance(): GameStateManager {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }

    /**
     * Initialize game state
     */
    public initializeGame(playerName: string): GameProgress {
        // Try to load existing progress
        const savedProgress = GameValidation.loadProgress();

        if (savedProgress && savedProgress.playerName === playerName) {
            this.gameProgress = savedProgress;
            console.log("Loaded existing game progress:", savedProgress);
        } else {
            // Create new progress
            this.gameProgress =
                GameValidation.initializeGameProgress(playerName);
            this.saveProgress();
            console.log("Created new game progress:", this.gameProgress);
        }

        this.notifyListeners();
        return this.gameProgress;
    }

    /**
     * Get current game progress
     */
    public getProgress(): GameProgress | null {
        return this.gameProgress;
    }

    /**
     * Start a quiz (record start time)
     */
    public startQuiz(missionId: number): void {
        this.quizStartTime = Date.now();
        console.log(`Quiz started for mission ${missionId}`);
    }

    /**
     * Submit quiz answer and update progress
     */
    public submitQuizAnswer(
        missionId: number,
        selectedAnswer: number,
        correctAnswer: number
    ): { result: QuizResult; updated: boolean } {
        if (!this.gameProgress) {
            throw new Error("Game not initialized");
        }

        // Calculate time spent
        const timeSpent = this.quizStartTime
            ? (Date.now() - this.quizStartTime) / 1000
            : 0;

        // Validate quiz answer
        const quizResult = GameValidation.validateQuizAnswer(
            missionId,
            selectedAnswer,
            correctAnswer,
            timeSpent
        );

        console.log("Quiz result:", quizResult);

        // Update progress if answer is correct
        let updated = false;
        if (quizResult.isCorrect) {
            try {
                this.gameProgress = GameValidation.completeMission(
                    missionId,
                    quizResult,
                    this.gameProgress
                );
                this.saveProgress();
                updated = true;
                console.log("Mission completed successfully:", missionId);
            } catch (error) {
                console.error("Failed to complete mission:", error);
            }
        } else {
            // Still update question count for failed attempts
            this.gameProgress = {
                ...this.gameProgress,
                totalQuestions: this.gameProgress.totalQuestions + 1,
                lastPlayedDate: new Date().toISOString(),
            };
            this.saveProgress();
        }

        this.notifyListeners();
        return { result: quizResult, updated };
    }

    /**
     * Get available missions
     */
    public getAvailableMissions(): number[] {
        if (!this.gameProgress) return [];
        return GameValidation.getAvailableMissions(
            this.gameProgress.completedMissions
        );
    }

    /**
     * Check if mission is accessible
     */
    public canAccessMission(missionId: number): boolean {
        if (!this.gameProgress) return false;
        // Developer mode bypasses all mission requirements
        if (this.developerMode) return true;
        return GameValidation.canAccessMission(
            missionId,
            this.gameProgress.completedMissions
        );
    }

    /**
     * Set developer/testing mode (bypasses level requirements)
     */
    public setDeveloperMode(enabled: boolean): void {
        this.developerMode = enabled;
        console.log(`Developer mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
    }

    /**
     * Get developer mode status
     */
    public getDeveloperMode(): boolean {
        return this.developerMode;
    }

    /**
     * Check if mission is completed
     */
    public isMissionCompleted(missionId: number): boolean {
        if (!this.gameProgress) return false;
        return this.gameProgress.completedMissions.includes(missionId);
    }

    /**
     * Get player statistics
     */
    public getPlayerStats() {
        if (!this.gameProgress) return null;
        return GameValidation.getPlayerStats(this.gameProgress);
    }

    /**
     * Add coins (for special events, bonuses, etc.)
     */
    public addCoins(amount: number, reason: string = "bonus"): void {
        if (!this.gameProgress || amount < 0) return;

        // Initialize totalCoinsEarned if not exists
        if (this.gameProgress.totalCoinsEarned === undefined) {
            this.gameProgress.totalCoinsEarned = this.gameProgress.coins;
        }

        this.gameProgress = {
            ...this.gameProgress,
            coins: this.gameProgress.coins + amount,
            totalCoinsEarned: this.gameProgress.totalCoinsEarned + amount,
            lastPlayedDate: new Date().toISOString(),
        };

        this.saveProgress();
        this.notifyListeners();
        console.log(`Added ${amount} coins for: ${reason}`);
    }

    /**
     * Spend coins (for future shop features)
     */
    public spendCoins(amount: number, item: string = "item"): boolean {
        if (
            !this.gameProgress ||
            amount < 0 ||
            this.gameProgress.coins < amount
        ) {
            return false;
        }

        this.gameProgress = {
            ...this.gameProgress,
            coins: this.gameProgress.coins - amount,
            lastPlayedDate: new Date().toISOString(),
        };

        this.saveProgress();
        this.notifyListeners();
        console.log(`Spent ${amount} coins on: ${item}`);
        return true;
    }

    /**
     * Update playtime
     */
    public updatePlaytime(minutes: number): void {
        if (!this.gameProgress) return;

        this.gameProgress = {
            ...this.gameProgress,
            playtime: this.gameProgress.playtime + minutes,
            lastPlayedDate: new Date().toISOString(),
        };

        this.saveProgress();
    }

    /**
     * Subscribe to progress updates
     */
    public subscribe(listener: (progress: GameProgress) => void): () => void {
        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Reset game progress
     */
    public resetProgress(): void {
        GameValidation.clearProgress();
        this.gameProgress = null;
        this.notifyListeners();
        console.log("Game progress reset");
    }

    /**
     * Export game progress for backup
     */
    public exportProgress(): string | null {
        if (!this.gameProgress) return null;

        try {
            return JSON.stringify(
                {
                    ...this.gameProgress,
                    exportDate: new Date().toISOString(),
                    version: "1.0.0",
                },
                null,
                2
            );
        } catch (error) {
            console.error("Failed to export progress:", error);
            return null;
        }
    }

    /**
     * Import game progress from backup
     */
    public importProgress(progressData: string): boolean {
        try {
            const imported = JSON.parse(progressData);

            // Basic validation
            if (!imported.playerName || !Array.isArray(imported.badges)) {
                throw new Error("Invalid progress data format");
            }

            // Validate game state
            if (!GameValidation.validateGameState(imported)) {
                throw new Error("Progress data validation failed");
            }

            this.gameProgress = imported;
            this.saveProgress();
            this.notifyListeners();
            console.log("Game progress imported successfully");
            return true;
        } catch (error) {
            console.error("Failed to import progress:", error);
            return false;
        }
    }

    /**
     * Validate current game state
     */
    public validateCurrentState(): boolean {
        if (!this.gameProgress) return false;
        return GameValidation.validateGameState(this.gameProgress);
    }

    /**
     * Private: Save progress to storage
     */
    private saveProgress(): void {
        if (this.gameProgress) {
            GameValidation.saveProgress(this.gameProgress);
        }
    }

    /**
     * Private: Notify all listeners of progress update
     */
    private notifyListeners(): void {
        if (this.gameProgress) {
            this.listeners.forEach((listener) => {
                try {
                    listener(this.gameProgress!);
                } catch (error) {
                    console.error("Error in progress listener:", error);
                }
            });
        }
    }

    /**
     * Collect an item and update progress
     */
    public collectItem(itemId: string, coins: number, points: number): boolean {
        if (!this.gameProgress) {
            console.error("Game not initialized");
            return false;
        }

        // Ensure collectibles arrays exist
        if (!this.gameProgress.collectedItems) {
            this.gameProgress.collectedItems = [];
        }
        if (this.gameProgress.totalItemsCollected === undefined) {
            this.gameProgress.totalItemsCollected = 0;
        }

        // Check if item already collected
        if (this.gameProgress.collectedItems.includes(itemId)) {
            console.log(`Item ${itemId} already collected`);
            return false;
        }

        // Add item to collected list
        this.gameProgress.collectedItems.push(itemId);
        this.gameProgress.totalItemsCollected += 1;
        this.gameProgress.coins += coins;
        this.gameProgress.totalScore += points;
        this.gameProgress.lastPlayedDate = new Date().toISOString();

        console.log(
            `Collected item ${itemId}: +${coins} coins, +${points} points`
        );

        // Save and notify
        this.saveProgress();
        this.notifyListeners();

        return true;
    }

    /**
     * Check if an item has been collected
     */
    public isItemCollected(itemId: string): boolean {
        if (!this.gameProgress || !this.gameProgress.collectedItems) {
            return false;
        }
        return this.gameProgress.collectedItems.includes(itemId);
    }

    /**
     * Get total collected items count
     */
    public getTotalCollectedItems(): number {
        if (!this.gameProgress) return 0;
        return this.gameProgress.totalItemsCollected || 0;
    }

    /**
     * Get all collected items
     */
    public getCollectedItems(): string[] {
        if (!this.gameProgress || !this.gameProgress.collectedItems) {
            return [];
        }
        return [...this.gameProgress.collectedItems];
    }

    /**
     * Record speed challenge performance
     */
    public recordSpeedChallenge(timeSpent: number): void {
        if (!this.gameProgress) return;

        // Initialize if not exists
        if (!this.gameProgress.speedChallenges) {
            this.gameProgress.speedChallenges = {
                excellentAnswers: 0,
                greatAnswers: 0,
                goodAnswers: 0,
            };
        }

        // Track speed category
        if (timeSpent <= 10) {
            this.gameProgress.speedChallenges.excellentAnswers += 1;
        } else if (timeSpent <= 20) {
            this.gameProgress.speedChallenges.greatAnswers += 1;
        } else if (timeSpent <= 30) {
            this.gameProgress.speedChallenges.goodAnswers += 1;
        }

        // Track fastest time
        if (
            !this.gameProgress.fastestQuizTime ||
            timeSpent < this.gameProgress.fastestQuizTime
        ) {
            this.gameProgress.fastestQuizTime = timeSpent;
        }

        this.saveProgress();
        console.log(`Speed challenge recorded: ${timeSpent}s`);
    }

    /**
     * Get speed challenge statistics
     */
    public getSpeedChallengeStats(): any {
        if (!this.gameProgress || !this.gameProgress.speedChallenges) {
            return {
                excellentAnswers: 0,
                greatAnswers: 0,
                goodAnswers: 0,
                fastestTime: Infinity,
            };
        }

        return {
            excellentAnswers:
                this.gameProgress.speedChallenges.excellentAnswers,
            greatAnswers: this.gameProgress.speedChallenges.greatAnswers,
            goodAnswers: this.gameProgress.speedChallenges.goodAnswers,
            fastestTime: this.gameProgress.fastestQuizTime || Infinity,
        };
    }

    /**
     * Check for speed challenge achievements
     */
    public checkSpeedAchievements(): string[] {
        const achievements: string[] = [];
        const stats = this.getSpeedChallengeStats();

        // Speed Demon: 5 excellent answers
        if (stats.excellentAnswers >= 5) {
            achievements.push("Speed Demon");
        }

        // Quick Thinker: 10 great answers
        if (stats.greatAnswers >= 10) {
            achievements.push("Quick Thinker");
        }

        // Lightning Fast: Answer in under 5 seconds
        if (stats.fastestTime < 5) {
            achievements.push("Lightning Fast");
        }

        // Perfect Speed: 10 excellent answers
        if (stats.excellentAnswers >= 10) {
            achievements.push("Perfect Speed");
        }

        return achievements;
    }

    /**
     * Get debug information
     */
    public getDebugInfo(): any {
        return {
            hasProgress: !!this.gameProgress,
            listenerCount: this.listeners.length,
            isValid: this.validateCurrentState(),
            availableMissions: this.getAvailableMissions(),
            stats: this.getPlayerStats(),
            collectedItems: this.getTotalCollectedItems(),
            speedChallenges: this.getSpeedChallengeStats(),
        };
    }
}
