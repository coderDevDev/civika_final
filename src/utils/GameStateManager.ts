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
        return GameValidation.canAccessMission(
            missionId,
            this.gameProgress.completedMissions
        );
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

        this.gameProgress = {
            ...this.gameProgress,
            coins: this.gameProgress.coins + amount,
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
     * Get debug information
     */
    public getDebugInfo(): any {
        return {
            hasProgress: !!this.gameProgress,
            listenerCount: this.listeners.length,
            isValid: this.validateCurrentState(),
            availableMissions: this.getAvailableMissions(),
            stats: this.getPlayerStats(),
        };
    }
}
