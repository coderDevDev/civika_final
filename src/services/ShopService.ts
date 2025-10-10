/**
 * Shop Service for CIVIKA
 * Handles shop items, purchases, inventory, and rewards
 */

import {
    ShopItem,
    ShopItemCategory,
    ShopItemRarity,
    PurchasedItem,
    PlayerInventory,
    ActiveEffect,
    NPCReward,
    DailyChallenge,
} from "../types/shop";
import { GameStateManager } from "../utils/GameStateManager";

export class ShopService {
    private static instance: ShopService;
    private inventory: PlayerInventory;

    // Shop catalog with all available items
    private readonly SHOP_CATALOG: ShopItem[] = [
        // ===== POWERUPS =====
        {
            id: "speed-boost-1",
            name: "Speed Boost",
            description: "Move 50% faster for 60 seconds",
            category: ShopItemCategory.POWERUPS,
            rarity: ShopItemRarity.COMMON,
            price: 50,
            icon: "⚡",
            effect: {
                type: "speed_boost",
                duration: 60,
                multiplier: 1.5,
            },
        },
        {
            id: "coin-magnet-1",
            name: "Coin Magnet",
            description: "2x coins for 120 seconds",
            category: ShopItemCategory.POWERUPS,
            rarity: ShopItemRarity.UNCOMMON,
            price: 100,
            icon: "🧲",
            effect: {
                type: "coin_multiplier",
                duration: 120,
                multiplier: 2,
            },
        },
        {
            id: "score-booster-1",
            name: "Score Booster",
            description: "1.5x points for next 3 quizzes",
            category: ShopItemCategory.BOOSTERS,
            rarity: ShopItemRarity.UNCOMMON,
            price: 150,
            icon: "📈",
            effect: {
                type: "score_boost",
                multiplier: 1.5,
            },
        },
        {
            id: "hint-token-1",
            name: "Hint Token",
            description: "Reveals one wrong answer in a quiz",
            category: ShopItemCategory.POWERUPS,
            rarity: ShopItemRarity.COMMON,
            price: 75,
            icon: "💡",
            effect: {
                type: "hint",
            },
            maxPurchases: 10,
        },
        {
            id: "time-freeze-1",
            name: "Time Freeze",
            description: "Pause quiz timer for 15 seconds",
            category: ShopItemCategory.POWERUPS,
            rarity: ShopItemRarity.RARE,
            price: 200,
            icon: "⏸️",
            effect: {
                type: "time_freeze",
                duration: 15,
            },
        },

        // ===== COSMETICS =====
        {
            id: "gold-badge-1",
            name: "Golden Badge",
            description: "Show off your achievements with style",
            category: ShopItemCategory.COSMETICS,
            rarity: ShopItemRarity.UNCOMMON,
            price: 120,
            icon: "🏅",
            effect: {
                type: "cosmetic",
            },
        },
        {
            id: "crown-1",
            name: "Civic Crown",
            description: "Crown of the civic leader",
            category: ShopItemCategory.COSMETICS,
            rarity: ShopItemRarity.RARE,
            price: 300,
            icon: "👑",
            effect: {
                type: "cosmetic",
            },
            unlockLevel: 2,
        },
        {
            id: "trophy-display-1",
            name: "Trophy Display",
            description: "Showcase your accomplishments",
            category: ShopItemCategory.COSMETICS,
            rarity: ShopItemRarity.LEGENDARY,
            price: 500,
            icon: "🏆",
            effect: {
                type: "cosmetic",
            },
            unlockLevel: 2,
        },

        // ===== SPECIAL ITEMS =====
        {
            id: "mystery-box-1",
            name: "Mystery Box",
            description: "Contains a random reward!",
            category: ShopItemCategory.SPECIAL,
            rarity: ShopItemRarity.RARE,
            price: 250,
            icon: "🎁",
        },
        {
            id: "lucky-charm-1",
            name: "Lucky Charm",
            description: "Increases collectible spawn rate",
            category: ShopItemCategory.SPECIAL,
            rarity: ShopItemRarity.LEGENDARY,
            price: 400,
            icon: "🍀",
            unlockLevel: 2,
        },
    ];

    private constructor() {
        this.inventory = this.loadInventory();
    }

    public static getInstance(): ShopService {
        if (!ShopService.instance) {
            ShopService.instance = new ShopService();
        }
        return ShopService.instance;
    }

    /**
     * Get all shop items
     */
    public getShopCatalog(): ShopItem[] {
        return [...this.SHOP_CATALOG];
    }

    /**
     * Get items by category
     */
    public getItemsByCategory(category: ShopItemCategory): ShopItem[] {
        return this.SHOP_CATALOG.filter((item) => item.category === category);
    }

    /**
     * Get available items for player's level
     */
    public getAvailableItems(playerLevel: number): ShopItem[] {
        return this.SHOP_CATALOG.filter(
            (item) => !item.unlockLevel || item.unlockLevel <= playerLevel
        );
    }

    /**
     * Purchase an item
     */
    public purchaseItem(itemId: string): {
        success: boolean;
        message: string;
        item?: ShopItem;
    } {
        const item = this.SHOP_CATALOG.find((i) => i.id === itemId);
        if (!item) {
            return { success: false, message: "Item not found" };
        }

        const gameStateManager = GameStateManager.getInstance();
        const progress = gameStateManager.getProgress();
        if (!progress) {
            return { success: false, message: "Game not initialized" };
        }

        // Check level requirement
        if (item.unlockLevel && progress.level < item.unlockLevel) {
            return {
                success: false,
                message: `Requires Level ${item.unlockLevel}`,
            };
        }

        // Check purchase limit
        if (item.maxPurchases) {
            const purchased = this.getPurchaseCount(itemId);
            if (purchased >= item.maxPurchases) {
                return {
                    success: false,
                    message: `Maximum ${item.maxPurchases} purchases reached`,
                };
            }
        }

        // Check if player has enough coins
        if (progress.coins < item.price) {
            return {
                success: false,
                message: `Not enough coins. Need ${item.price}, have ${progress.coins}`,
            };
        }

        // Deduct coins
        const spent = gameStateManager.spendCoins(item.price, item.name);
        if (!spent) {
            return { success: false, message: "Failed to deduct coins" };
        }

        // Add to inventory
        this.addToInventory(itemId);

        // Activate effect if applicable
        if (item.effect && item.effect.duration) {
            this.activateEffect(itemId, item.effect);
        }

        return {
            success: true,
            message: `Successfully purchased ${item.name}!`,
            item,
        };
    }

    /**
     * Add item to inventory
     */
    private addToInventory(itemId: string): void {
        const existing = this.inventory.purchasedItems.find(
            (i) => i.itemId === itemId
        );

        if (existing) {
            existing.quantity += 1;
        } else {
            this.inventory.purchasedItems.push({
                itemId,
                purchaseDate: new Date().toISOString(),
                quantity: 1,
                used: false,
            });
        }

        this.saveInventory();
        console.log(`Item ${itemId} added to inventory`);
    }

    /**
     * Get purchase count for an item
     */
    private getPurchaseCount(itemId: string): number {
        const item = this.inventory.purchasedItems.find(
            (i) => i.itemId === itemId
        );
        return item?.quantity || 0;
    }

    /**
     * Activate item effect
     */
    private activateEffect(itemId: string, effect: any): void {
        if (!effect.duration) return;

        const now = Date.now();
        const activeEffect: ActiveEffect = {
            itemId,
            effectType: effect.type,
            startTime: now,
            endTime: now + effect.duration * 1000,
            multiplier: effect.multiplier,
        };

        this.inventory.activeEffects.push(activeEffect);
        this.saveInventory();

        console.log(`Effect activated: ${effect.type} for ${effect.duration}s`);
    }

    /**
     * Check if an effect is active
     */
    public hasActiveEffect(effectType: string): boolean {
        const now = Date.now();
        return this.inventory.activeEffects.some(
            (effect) => effect.effectType === effectType && effect.endTime > now
        );
    }

    /**
     * Get active multiplier for a type
     */
    public getActiveMultiplier(effectType: string): number {
        const now = Date.now();
        const activeEffect = this.inventory.activeEffects.find(
            (effect) => effect.effectType === effectType && effect.endTime > now
        );
        return activeEffect?.multiplier || 1;
    }

    /**
     * Clean up expired effects
     */
    private cleanupExpiredEffects(): void {
        const now = Date.now();
        this.inventory.activeEffects = this.inventory.activeEffects.filter(
            (effect) => effect.endTime > now
        );
        this.saveInventory();
    }

    /**
     * Get player inventory
     */
    public getInventory(): PlayerInventory {
        this.cleanupExpiredEffects();
        return { ...this.inventory };
    }

    /**
     * Get purchased items
     */
    public getPurchasedItems(): PurchasedItem[] {
        return [...this.inventory.purchasedItems];
    }

    /**
     * Save inventory to localStorage
     */
    private saveInventory(): void {
        try {
            localStorage.setItem(
                "civika-shop-inventory",
                JSON.stringify(this.inventory)
            );
        } catch (error) {
            console.error("Failed to save inventory:", error);
        }
    }

    /**
     * Load inventory from localStorage
     */
    private loadInventory(): PlayerInventory {
        try {
            const saved = localStorage.getItem("civika-shop-inventory");
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error("Failed to load inventory:", error);
        }

        return {
            purchasedItems: [],
            activeEffects: [],
        };
    }

    /**
     * Use a consumable item
     */
    public useItem(itemId: string): {
        success: boolean;
        message: string;
    } {
        const purchased = this.inventory.purchasedItems.find(
            (i) => i.itemId === itemId
        );

        if (!purchased || purchased.quantity === 0) {
            return { success: false, message: "Item not in inventory" };
        }

        const item = this.SHOP_CATALOG.find((i) => i.id === itemId);
        if (!item) {
            return { success: false, message: "Item not found" };
        }

        // Activate effect
        if (item.effect) {
            this.activateEffect(itemId, item.effect);
        }

        // Mark as used for consumables
        purchased.used = true;
        purchased.quantity -= 1;

        if (purchased.quantity === 0) {
            this.inventory.purchasedItems =
                this.inventory.purchasedItems.filter(
                    (i) => i.itemId !== itemId
                );
        }

        this.saveInventory();

        return {
            success: true,
            message: `${item.name} activated!`,
        };
    }

    /**
     * Get NPC rewards (gifts given by NPCs after mission completion)
     */
    public getNPCRewards(): NPCReward[] {
        return [
            {
                npcName: "Barangay Captain",
                missionId: 10,
                rewardType: "both",
                coins: 100,
                item: "crown-1",
                message:
                    "Congratulations on completing all barangay missions! Here's a special crown and bonus coins!",
                given: false,
            },
            {
                npcName: "Mayor",
                missionId: 20,
                rewardType: "both",
                coins: 200,
                item: "trophy-display-1",
                message:
                    "You've mastered civic governance! Accept this trophy and bonus as recognition!",
                given: false,
            },
            {
                npcName: "Barangay Health Worker",
                missionId: 9,
                rewardType: "coins",
                coins: 50,
                message:
                    "Thank you for promoting community health! Here's a bonus!",
                given: false,
            },
        ];
    }

    /**
     * Generate daily challenges
     */
    public generateDailyChallenges(): DailyChallenge[] {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        return [
            {
                id: `daily-collect-${today.toISOString().split("T")[0]}`,
                title: "Treasure Hunter",
                description: "Collect 5 items today",
                objective: "Collect collectibles",
                requirement: 5,
                coinReward: 50,
                pointsReward: 100,
                expiresAt: tomorrow.toISOString(),
                completed: false,
                progress: 0,
            },
            {
                id: `daily-speed-${today.toISOString().split("T")[0]}`,
                title: "Speed Demon",
                description: "Complete 3 quizzes with excellent time (≤10s)",
                objective: "Excellent quiz times",
                requirement: 3,
                coinReward: 75,
                pointsReward: 150,
                expiresAt: tomorrow.toISOString(),
                completed: false,
                progress: 0,
            },
            {
                id: `daily-missions-${today.toISOString().split("T")[0]}`,
                title: "Daily Duty",
                description: "Complete 2 missions today",
                objective: "Complete missions",
                requirement: 2,
                coinReward: 100,
                pointsReward: 200,
                expiresAt: tomorrow.toISOString(),
                completed: false,
                progress: 0,
            },
        ];
    }

    /**
     * Get daily challenges from localStorage
     */
    public getDailyChallenges(): DailyChallenge[] {
        try {
            const saved = localStorage.getItem("civika-daily-challenges");
            if (saved) {
                const challenges: DailyChallenge[] = JSON.parse(saved);

                // Check if challenges are still valid (not expired)
                const now = new Date();
                const validChallenges = challenges.filter(
                    (c) => new Date(c.expiresAt) > now
                );

                // If any expired, generate new ones
                if (validChallenges.length < challenges.length) {
                    const newChallenges = this.generateDailyChallenges();
                    this.saveDailyChallenges(newChallenges);
                    return newChallenges;
                }

                return validChallenges;
            }
        } catch (error) {
            console.error("Failed to load daily challenges:", error);
        }

        // Generate new challenges if none exist
        const newChallenges = this.generateDailyChallenges();
        this.saveDailyChallenges(newChallenges);
        return newChallenges;
    }

    /**
     * Save daily challenges
     */
    private saveDailyChallenges(challenges: DailyChallenge[]): void {
        try {
            localStorage.setItem(
                "civika-daily-challenges",
                JSON.stringify(challenges)
            );
        } catch (error) {
            console.error("Failed to save daily challenges:", error);
        }
    }

    /**
     * Update challenge progress
     */
    public updateChallengeProgress(
        objectiveType: string,
        amount: number = 1
    ): void {
        const challenges = this.getDailyChallenges();
        let updated = false;

        challenges.forEach((challenge) => {
            if (
                !challenge.completed &&
                challenge.objective
                    .toLowerCase()
                    .includes(objectiveType.toLowerCase())
            ) {
                challenge.progress += amount;

                if (challenge.progress >= challenge.requirement) {
                    challenge.completed = true;
                    this.awardChallengeReward(challenge);
                    updated = true;
                }
            }
        });

        if (updated) {
            this.saveDailyChallenges(challenges);
        }
    }

    /**
     * Award challenge reward
     */
    private awardChallengeReward(challenge: DailyChallenge): void {
        const gameStateManager = GameStateManager.getInstance();

        // Award coins
        gameStateManager.addCoins(
            challenge.coinReward,
            `Daily Challenge: ${challenge.title}`
        );

        // Award points
        const progress = gameStateManager.getProgress();
        if (progress) {
            progress.totalScore += challenge.pointsReward;
            console.log(
                `✅ Daily challenge completed: +${challenge.coinReward} coins, +${challenge.pointsReward} points`
            );
        }
    }

    /**
     * Reset inventory (for testing)
     */
    public resetInventory(): void {
        this.inventory = {
            purchasedItems: [],
            activeEffects: [],
        };
        this.saveInventory();
        console.log("Inventory reset");
    }
}

export default ShopService;
