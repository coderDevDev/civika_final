/**
 * Secret Quest Service for CIVIKA
 * Handles secret quests, hidden achievements, and player titles
 */

import {
    SecretQuest,
    SecretQuestType,
    PlayerTitle,
    SecretLocation,
    HiddenNPC,
    PlayerTitleData,
} from "../types/secretQuest";
import { GameStateManager } from "../utils/GameStateManager";

export class SecretQuestService {
    private static instance: SecretQuestService;
    private secretQuests: SecretQuest[] = [];
    private secretLocations: SecretLocation[] = [];
    private hiddenNPCs: HiddenNPC[] = [];
    private playerTitles: PlayerTitleData;

    private constructor() {
        this.initializeSecretQuests();
        this.initializeSecretLocations();
        this.initializeHiddenNPCs();
        this.playerTitles = this.loadPlayerTitles();
    }

    public static getInstance(): SecretQuestService {
        if (!SecretQuestService.instance) {
            SecretQuestService.instance = new SecretQuestService();
        }
        return SecretQuestService.instance;
    }

    /**
     * Initialize all secret quests
     */
    private initializeSecretQuests(): void {
        this.secretQuests = [
            // ===== EXPLORATION QUESTS =====
            {
                id: "secret-explorer-1",
                name: "The Four Corners",
                description:
                    "Visit all four corners of the Barangay map to unlock the Explorer title",
                type: SecretQuestType.EXPLORATION,
                reward: {
                    title: PlayerTitle.EXPLORER,
                    coins: 100,
                    points: 200,
                },
                condition: {
                    type: "visit_location",
                    count: 4,
                },
                hint: "🗺️ The edges of the map hold secrets...",
                hidden: true,
                discovered: false,
                completed: false,
                progress: 0,
            },
            {
                id: "secret-pathfinder-1",
                name: "Hidden Paths",
                description: "Discover all 5 hidden locations across both maps",
                type: SecretQuestType.EXPLORATION,
                reward: {
                    title: PlayerTitle.PATHFINDER,
                    coins: 200,
                    points: 400,
                    specialItem: "pathfinder-compass",
                },
                condition: {
                    type: "visit_location",
                    count: 5,
                },
                hint: "🧭 Some places are not marked on any map...",
                hidden: true,
                discovered: false,
                completed: false,
                progress: 0,
            },

            // ===== COLLECTION QUESTS =====
            {
                id: "secret-treasure-hunter-1",
                name: "Master Collector",
                description:
                    "Collect ALL collectibles in both Barangay and City maps",
                type: SecretQuestType.COLLECTION,
                reward: {
                    title: PlayerTitle.TREASURE_HUNTER,
                    coins: 300,
                    points: 500,
                },
                condition: {
                    type: "collect_all",
                    count: 18, // 8 barangay + 10 city
                },
                hint: "💎 Every treasure tells a story...",
                hidden: true,
                discovered: false,
                completed: false,
                progress: 0,
            },
            {
                id: "secret-coin-master-1",
                name: "Golden Hoarder",
                description:
                    "Accumulate 1000 coins (total earned, not current)",
                type: SecretQuestType.COLLECTION,
                reward: {
                    title: PlayerTitle.COIN_COLLECTOR,
                    coins: 250,
                    points: 300,
                },
                condition: {
                    type: "find_item",
                    target: "coins",
                    count: 1000,
                },
                hint: "💰 Wealth comes to those who persevere...",
                hidden: true,
                discovered: false,
                completed: false,
                progress: 0,
            },

            // ===== SPEED QUESTS =====
            {
                id: "secret-speedrun-1",
                name: "Lightning Campaign",
                description:
                    "Complete all 20 missions in under 2 hours playtime",
                type: SecretQuestType.SPEED,
                reward: {
                    title: PlayerTitle.SPEEDRUNNER,
                    coins: 500,
                    points: 1000,
                },
                condition: {
                    type: "complete_in_time",
                    timeLimit: 7200, // 2 hours in seconds
                },
                hint: "⚡ Time waits for no one...",
                hidden: true,
                discovered: false,
                completed: false,
            },
            {
                id: "secret-lightning-1",
                name: "Thunder Mind",
                description: "Complete 10 quizzes in under 5 seconds each",
                type: SecretQuestType.SPEED,
                reward: {
                    title: PlayerTitle.LIGHTNING_MIND,
                    coins: 400,
                    points: 800,
                },
                condition: {
                    type: "complete_in_time",
                    count: 10,
                    timeLimit: 5,
                },
                hint: "⚡⚡⚡ Think fast, act faster...",
                hidden: true,
                discovered: false,
                completed: false,
                progress: 0,
            },

            // ===== INTERACTION QUESTS =====
            {
                id: "secret-social-1",
                name: "Community Connector",
                description:
                    "Talk to every NPC at least 3 times (even after completing missions)",
                type: SecretQuestType.INTERACTION,
                reward: {
                    title: PlayerTitle.SOCIAL_BUTTERFLY,
                    coins: 150,
                    points: 250,
                },
                condition: {
                    type: "talk_to_npc",
                    count: 3,
                },
                hint: "💬 Everyone has more to say than you think...",
                hidden: true,
                discovered: false,
                completed: false,
                progress: 0,
            },
            {
                id: "secret-sage-1",
                name: "The Wise One",
                description: "Find and talk to the 3 hidden wise NPCs",
                type: SecretQuestType.INTERACTION,
                reward: {
                    title: PlayerTitle.CIVIC_SAGE,
                    coins: 350,
                    points: 600,
                    specialItem: "wisdom-scroll",
                },
                condition: {
                    type: "talk_to_npc",
                    target: "hidden",
                    count: 3,
                },
                hint: "📜 Wisdom is hidden in unexpected places...",
                hidden: true,
                discovered: false,
                completed: false,
                progress: 0,
            },

            // ===== ACHIEVEMENT QUESTS =====
            {
                id: "secret-perfect-1",
                name: "Perfect Civic Leader",
                description:
                    "Complete all missions with 100% accuracy and all collectibles",
                type: SecretQuestType.ACHIEVEMENT,
                reward: {
                    title: PlayerTitle.PERFECT_CITIZEN,
                    coins: 1000,
                    points: 2000,
                },
                condition: {
                    type: "combo",
                },
                hint: "🌟 Perfection is the ultimate achievement...",
                hidden: true,
                discovered: false,
                completed: false,
            },
            {
                id: "secret-legend-1",
                name: "The Legend",
                description: "Complete ALL secret quests to become a Legend",
                type: SecretQuestType.ACHIEVEMENT,
                reward: {
                    title: PlayerTitle.LEGEND,
                    coins: 2000,
                    points: 5000,
                },
                condition: {
                    type: "combo",
                },
                hint: "🏆 Only the most dedicated will earn this...",
                hidden: true,
                discovered: false,
                completed: false,
            },

            // ===== EASTER EGG QUESTS =====
            {
                id: "secret-egg-1",
                name: "The Hidden Message",
                description:
                    "Find the secret message hidden in the Barangay Hall",
                type: SecretQuestType.EASTER_EGG,
                reward: {
                    title: PlayerTitle.SECRET_KEEPER,
                    coins: 100,
                    points: 150,
                },
                condition: {
                    type: "visit_location",
                    target: "secret-message-location",
                },
                hint: "📖 Not all wisdom is spoken aloud...",
                hidden: true,
                discovered: false,
                completed: false,
            },
            {
                id: "secret-sequence-1",
                name: "The Konami Code",
                description: "Visit NPCs in a specific secret sequence",
                type: SecretQuestType.EASTER_EGG,
                reward: {
                    title: PlayerTitle.HIDDEN_HERO,
                    coins: 500,
                    points: 1000,
                },
                condition: {
                    type: "sequence",
                    sequence: [
                        "barangay-captain",
                        "health-worker",
                        "librarian",
                        "barangay-captain",
                    ],
                },
                hint: "🎮 Old school gamers know the way...",
                hidden: true,
                discovered: false,
                completed: false,
            },
        ];
    }

    /**
     * Initialize secret locations
     */
    private initializeSecretLocations(): void {
        this.secretLocations = [
            {
                id: "corner-nw",
                name: "Northwest Sanctuary",
                percentX: 5,
                percentY: 5,
                questId: "secret-explorer-1",
                hint: "A peaceful corner away from the bustle",
                discovered: false,
            },
            {
                id: "corner-ne",
                name: "Northeast Overlook",
                percentX: 95,
                percentY: 5,
                questId: "secret-explorer-1",
                hint: "Where the sun rises over the community",
                discovered: false,
            },
            {
                id: "corner-sw",
                name: "Southwest Grove",
                percentX: 5,
                percentY: 95,
                questId: "secret-explorer-1",
                hint: "Trees whisper secrets in the wind",
                discovered: false,
            },
            {
                id: "corner-se",
                name: "Southeast Garden",
                percentX: 95,
                percentY: 95,
                questId: "secret-explorer-1",
                hint: "Where flowers bloom in solitude",
                discovered: false,
            },
            {
                id: "hidden-shrine",
                name: "The Old Civic Shrine",
                percentX: 50,
                percentY: 85,
                questId: "secret-pathfinder-1",
                hint: "An ancient monument to civic duty",
                discovered: false,
            },
        ];
    }

    /**
     * Initialize hidden NPCs
     */
    private initializeHiddenNPCs(): void {
        this.hiddenNPCs = [
            {
                id: "wise-elder-1",
                name: "The Wise Elder",
                dialogue: [
                    "Welcome, young citizen. You have found me.",
                    "True wisdom comes from serving others.",
                    "The path to civic excellence is long but rewarding.",
                ],
                percentX: 12,
                percentY: 88,
                questId: "secret-sage-1",
                sprite: "elderly-resident",
                appears: false, // Appears after completing 5 missions
            },
            {
                id: "mysterious-scholar-1",
                name: "The Mysterious Scholar",
                dialogue: [
                    "Ah, a seeker of knowledge!",
                    "The greatest lessons are learned through experience.",
                    "Your journey has only just begun...",
                ],
                percentX: 88,
                percentY: 12,
                questId: "secret-sage-1",
                sprite: "librarian",
                appears: false, // Appears after collecting 10 items
            },
            {
                id: "ancient-guardian-1",
                name: "The Ancient Guardian",
                dialogue: [
                    "Few find their way here.",
                    "You possess the qualities of a true leader.",
                    "Continue your quest, civic champion.",
                ],
                percentX: 50,
                percentY: 50,
                questId: "secret-sage-1",
                sprite: "barangay-captain",
                appears: false, // Appears after reaching Level 2
            },
        ];
    }

    /**
     * Get all secret quests
     */
    public getSecretQuests(): SecretQuest[] {
        return this.secretQuests.filter((q) => q.discovered || !q.hidden);
    }

    /**
     * Get completed secret quests
     */
    public getCompletedSecretQuests(): SecretQuest[] {
        return this.secretQuests.filter((q) => q.completed);
    }

    /**
     * Check if location is a secret location
     */
    public checkLocation(
        percentX: number,
        percentY: number
    ): { location: SecretLocation; newlyDiscovered: boolean } | null {
        const PROXIMITY = 5; // 5% proximity threshold

        for (const location of this.secretLocations) {
            const distanceX = Math.abs(location.percentX - percentX);
            const distanceY = Math.abs(location.percentY - percentY);

            if (distanceX <= PROXIMITY && distanceY <= PROXIMITY) {
                const wasDiscovered = location.discovered;
                if (!location.discovered) {
                    this.discoverLocation(location.id);
                }
                return { location, newlyDiscovered: !wasDiscovered };
            }
        }

        return null;
    }

    /**
     * Discover a secret location
     */
    private discoverLocation(locationId: string): void {
        const location = this.secretLocations.find((l) => l.id === locationId);
        if (!location) return;

        location.discovered = true;
        this.saveProgress();

        console.log(`🗺️ Secret location discovered: ${location.name}`);

        // Check if this completes a secret quest
        this.updateQuestProgress(location.questId || "");
    }

    /**
     * Update secret quest progress
     */
    private updateQuestProgress(questId: string): void {
        const quest = this.secretQuests.find((q) => q.id === questId);
        if (!quest || quest.completed) return;

        // Discover quest if hidden
        if (!quest.discovered) {
            quest.discovered = true;
            console.log(`🎯 Secret quest discovered: ${quest.name}`);
        }

        // Update progress
        if (quest.progress !== undefined) {
            quest.progress += 1;
        } else {
            quest.progress = 1;
        }

        // Check if completed
        if (quest.condition.count && quest.progress >= quest.condition.count) {
            this.completeSecretQuest(quest.id);
        }

        this.saveProgress();
    }

    /**
     * Complete a secret quest
     */
    public completeSecretQuest(questId: string): boolean {
        const quest = this.secretQuests.find((q) => q.id === questId);
        if (!quest || quest.completed) return false;

        quest.completed = true;

        // Award title
        this.unlockTitle(quest.reward.title);

        // Award coins and points
        const gameStateManager = GameStateManager.getInstance();
        gameStateManager.addCoins(
            quest.reward.coins,
            `Secret Quest: ${quest.name}`
        );

        const progress = gameStateManager.getProgress();
        if (progress) {
            progress.totalScore += quest.reward.points;
        }

        this.saveProgress();

        console.log(`🏆 Secret quest completed: ${quest.name}`);
        console.log(`✨ Title unlocked: ${quest.reward.title}`);

        return true;
    }

    /**
     * Unlock a player title
     */
    public unlockTitle(title: PlayerTitle): void {
        if (!this.playerTitles.unlockedTitles.includes(title)) {
            this.playerTitles.unlockedTitles.push(title);
            this.playerTitles.titleUnlockedAt.set(
                title,
                new Date().toISOString()
            );
            this.savePlayerTitles();
            console.log(`✨ New title unlocked: ${title}`);
        }
    }

    /**
     * Set current active title
     */
    public setActiveTitle(title: PlayerTitle): boolean {
        if (!this.playerTitles.unlockedTitles.includes(title)) {
            console.warn(`Title ${title} is not unlocked`);
            return false;
        }

        this.playerTitles.currentTitle = title;
        this.savePlayerTitles();
        console.log(`👑 Active title changed to: ${title}`);
        return true;
    }

    /**
     * Get current active title
     */
    public getCurrentTitle(): PlayerTitle {
        return this.playerTitles.currentTitle || PlayerTitle.CITIZEN;
    }

    /**
     * Get all unlocked titles
     */
    public getUnlockedTitles(): PlayerTitle[] {
        return [...this.playerTitles.unlockedTitles];
    }

    /**
     * Check secret quest conditions automatically
     */
    public checkSecretQuestConditions(): void {
        const gameStateManager = GameStateManager.getInstance();
        const progress = gameStateManager.getProgress();
        if (!progress) return;

        // Check treasure hunter (all collectibles)
        const totalCollected = progress.totalItemsCollected || 0;
        if (totalCollected >= 18) {
            this.completeSecretQuest("secret-treasure-hunter-1");
        }

        // Check coin collector (1000 coins earned)
        // Note: This should track TOTAL earned, not current balance
        // You might need to add a totalCoinsEarned field to GameProgress

        // Check perfect citizen (100% completion)
        if (
            progress.completedMissions.length === 20 &&
            progress.totalQuestions > 0 &&
            progress.correctAnswers === progress.totalQuestions &&
            totalCollected >= 18
        ) {
            this.completeSecretQuest("secret-perfect-1");
        }

        // Check speedrunner (complete all in <2 hours)
        if (
            progress.completedMissions.length === 20 &&
            progress.playtime < 120
        ) {
            // 120 minutes = 2 hours
            this.completeSecretQuest("secret-speedrun-1");
        }

        // Check lightning mind (10 quizzes <5s)
        const lightningQuest = this.secretQuests.find(
            (q) => q.id === "secret-lightning-1"
        );
        if (
            lightningQuest &&
            progress.fastestQuizTime &&
            progress.fastestQuizTime < 5
        ) {
            // This would need more sophisticated tracking of individual quiz times
            // For now, we'll just check if they have the capability
        }

        // Check legend (complete all secret quests)
        const completedSecrets = this.secretQuests.filter(
            (q) => q.completed && q.id !== "secret-legend-1"
        ).length;
        if (completedSecrets >= this.secretQuests.length - 1) {
            this.completeSecretQuest("secret-legend-1");
        }
    }

    /**
     * Get secret locations
     */
    public getSecretLocations(): SecretLocation[] {
        return [...this.secretLocations];
    }

    /**
     * Get discovered locations
     */
    public getDiscoveredLocations(): SecretLocation[] {
        return this.secretLocations.filter((l) => l.discovered);
    }

    /**
     * Get hidden NPCs that should appear
     */
    public getVisibleHiddenNPCs(): HiddenNPC[] {
        const gameStateManager = GameStateManager.getInstance();
        const progress = gameStateManager.getProgress();
        if (!progress) return [];

        // Determine which NPCs should appear based on conditions
        return this.hiddenNPCs.filter((npc) => {
            if (npc.id === "wise-elder-1") {
                return progress.completedMissions.length >= 5;
            }
            if (npc.id === "mysterious-scholar-1") {
                return (progress.totalItemsCollected || 0) >= 10;
            }
            if (npc.id === "ancient-guardian-1") {
                return progress.level >= 2;
            }
            return false;
        });
    }

    /**
     * Talk to hidden NPC
     */
    public talkToHiddenNPC(npcId: string): void {
        const npc = this.hiddenNPCs.find((n) => n.id === npcId);
        if (!npc) return;

        console.log(`💬 Talked to hidden NPC: ${npc.name}`);

        // Update quest progress
        if (npc.questId) {
            this.updateQuestProgress(npc.questId);
        }
    }

    /**
     * Get quest hints for discovered quests
     */
    public getQuestHints(): string[] {
        return this.secretQuests
            .filter((q) => q.discovered && !q.completed && q.hint)
            .map((q) => q.hint!);
    }

    /**
     * Save progress
     */
    private saveProgress(): void {
        try {
            const data = {
                quests: this.secretQuests,
                locations: this.secretLocations,
                npcs: this.hiddenNPCs,
            };
            localStorage.setItem("civika-secret-quests", JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save secret quest progress:", error);
        }
    }

    /**
     * Load progress
     */
    private loadProgress(): void {
        try {
            const saved = localStorage.getItem("civika-secret-quests");
            if (saved) {
                const data = JSON.parse(saved);
                if (data.quests) this.secretQuests = data.quests;
                if (data.locations) this.secretLocations = data.locations;
                if (data.npcs) this.hiddenNPCs = data.npcs;
            }
        } catch (error) {
            console.error("Failed to load secret quest progress:", error);
        }
    }

    /**
     * Save player titles
     */
    private savePlayerTitles(): void {
        try {
            const data = {
                currentTitle: this.playerTitles.currentTitle,
                unlockedTitles: this.playerTitles.unlockedTitles,
                titleUnlockedAt: Array.from(
                    this.playerTitles.titleUnlockedAt.entries()
                ),
            };
            localStorage.setItem("civika-player-titles", JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save player titles:", error);
        }
    }

    /**
     * Load player titles
     */
    private loadPlayerTitles(): PlayerTitleData {
        try {
            const saved = localStorage.getItem("civika-player-titles");
            if (saved) {
                const data = JSON.parse(saved);
                return {
                    currentTitle: data.currentTitle || PlayerTitle.CITIZEN,
                    unlockedTitles: data.unlockedTitles || [
                        PlayerTitle.CITIZEN,
                    ],
                    titleUnlockedAt: new Map(data.titleUnlockedAt || []),
                };
            }
        } catch (error) {
            console.error("Failed to load player titles:", error);
        }

        return {
            currentTitle: PlayerTitle.CITIZEN,
            unlockedTitles: [PlayerTitle.CITIZEN],
            titleUnlockedAt: new Map(),
        };
    }

    /**
     * Get title description
     */
    public getTitleDescription(title: PlayerTitle): string {
        const descriptions: Record<PlayerTitle, string> = {
            [PlayerTitle.NONE]: "",
            [PlayerTitle.CITIZEN]: "A member of the community",
            [PlayerTitle.EXPLORER]: "Discovered all corners of the map",
            [PlayerTitle.PATHFINDER]: "Found all hidden locations",
            [PlayerTitle.WANDERER]: "Traveled 10,000 steps",
            [PlayerTitle.TREASURE_HUNTER]: "Collected all treasures",
            [PlayerTitle.COIN_COLLECTOR]: "Earned 1,000 coins",
            [PlayerTitle.BADGE_MASTER]: "Earned all 20 badges",
            [PlayerTitle.SPEEDRUNNER]: "Completed game in under 2 hours",
            [PlayerTitle.LIGHTNING_MIND]: "Lightning-fast quiz master",
            [PlayerTitle.TIME_KEEPER]: "Never failed a timed quiz",
            [PlayerTitle.SOCIAL_BUTTERFLY]: "Befriended everyone",
            [PlayerTitle.FRIENDLY_NEIGHBOR]: "Completed all dialogues",
            [PlayerTitle.CIVIC_SAGE]: "Discovered all hidden knowledge",
            [PlayerTitle.PERFECT_CITIZEN]: "Achieved 100% completion",
            [PlayerTitle.LEGEND]: "Completed all secret quests",
            [PlayerTitle.MASTER_OF_CIVICS]: "Mastered everything",
            [PlayerTitle.SECRET_KEEPER]: "Found all easter eggs",
            [PlayerTitle.HIDDEN_HERO]: "Discovered the secret path",
            [PlayerTitle.MYSTERIOUS_ONE]: "Uncovered the mystery",
        };

        return descriptions[title] || "Unknown title";
    }

    /**
     * Get title rarity/color
     */
    public getTitleRarity(
        title: PlayerTitle
    ): "common" | "uncommon" | "rare" | "legendary" {
        const legendary = [
            PlayerTitle.LEGEND,
            PlayerTitle.PERFECT_CITIZEN,
            PlayerTitle.MASTER_OF_CIVICS,
            PlayerTitle.MYSTERIOUS_ONE,
        ];
        const rare = [
            PlayerTitle.PATHFINDER,
            PlayerTitle.TREASURE_HUNTER,
            PlayerTitle.SPEEDRUNNER,
            PlayerTitle.CIVIC_SAGE,
            PlayerTitle.HIDDEN_HERO,
        ];
        const uncommon = [
            PlayerTitle.EXPLORER,
            PlayerTitle.COIN_COLLECTOR,
            PlayerTitle.LIGHTNING_MIND,
            PlayerTitle.SOCIAL_BUTTERFLY,
            PlayerTitle.SECRET_KEEPER,
        ];

        if (legendary.includes(title)) return "legendary";
        if (rare.includes(title)) return "rare";
        if (uncommon.includes(title)) return "uncommon";
        return "common";
    }

    /**
     * Reset all secret quest progress (for testing)
     */
    public resetSecretQuests(): void {
        localStorage.removeItem("civika-secret-quests");
        localStorage.removeItem("civika-player-titles");
        this.initializeSecretQuests();
        this.initializeSecretLocations();
        this.initializeHiddenNPCs();
        this.playerTitles = {
            currentTitle: PlayerTitle.CITIZEN,
            unlockedTitles: [PlayerTitle.CITIZEN],
            titleUnlockedAt: new Map(),
        };
        console.log("Secret quests reset");
    }
}

export default SecretQuestService;
