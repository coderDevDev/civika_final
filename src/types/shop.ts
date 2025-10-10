/**
 * Shop and Reward System Type Definitions for CIVIKA
 */

export enum ShopItemCategory {
    POWERUPS = "powerups",
    COSMETICS = "cosmetics",
    BOOSTERS = "boosters",
    SPECIAL = "special",
}

export enum ShopItemRarity {
    COMMON = "common",
    UNCOMMON = "uncommon",
    RARE = "rare",
    LEGENDARY = "legendary",
}

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    category: ShopItemCategory;
    rarity: ShopItemRarity;
    price: number; // Cost in coins
    icon: string; // Emoji or sprite key
    effect?: ShopItemEffect;
    unlockLevel?: number; // Minimum level required to purchase
    limited?: boolean; // Limited-time item
    maxPurchases?: number; // Maximum times this can be purchased (undefined = unlimited)
}

export interface ShopItemEffect {
    type:
        | "speed_boost"
        | "coin_multiplier"
        | "score_boost"
        | "hint"
        | "time_freeze"
        | "cosmetic";
    duration?: number; // Duration in seconds (for temporary effects)
    multiplier?: number; // Multiplier value (e.g., 2 for 2x coins)
    value?: number; // Bonus value (e.g., +100 score)
}

export interface PurchasedItem {
    itemId: string;
    purchaseDate: string;
    quantity: number;
    used?: boolean; // For consumable items
}

export interface PlayerInventory {
    purchasedItems: PurchasedItem[];
    activeEffects: ActiveEffect[];
}

export interface ActiveEffect {
    itemId: string;
    effectType: string;
    startTime: number;
    endTime: number;
    multiplier?: number;
}

export interface NPCReward {
    npcName: string;
    missionId: number;
    rewardType: "coins" | "item" | "both";
    coins?: number;
    item?: string; // Item ID from shop
    message: string;
    given: boolean;
}

export interface DailyChallenge {
    id: string;
    title: string;
    description: string;
    objective: string;
    requirement: number; // Number of times to complete objective
    coinReward: number;
    pointsReward: number;
    expiresAt: string; // ISO date string
    completed: boolean;
    progress: number; // Current progress towards requirement
}
