/**
 * Secret Quest and Title System Type Definitions for CIVIKA
 */

export enum SecretQuestType {
    EXPLORATION = "exploration", // Find hidden locations
    COLLECTION = "collection", // Collect all items of a type
    SPEED = "speed", // Complete something very fast
    INTERACTION = "interaction", // Talk to hidden NPCs
    ACHIEVEMENT = "achievement", // Complete special tasks
    EASTER_EGG = "easter_egg", // Discover hidden secrets
}

export enum PlayerTitle {
    // Default
    NONE = "",
    CITIZEN = "Citizen",

    // Exploration Titles
    EXPLORER = "Explorer", // Visit all map corners
    PATHFINDER = "Pathfinder", // Discover all hidden areas
    WANDERER = "Wanderer", // Walk 10,000 steps

    // Collection Titles
    TREASURE_HUNTER = "Treasure Hunter", // Collect all items in both maps
    COIN_COLLECTOR = "Coin Collector", // Collect 1000 coins total
    BADGE_MASTER = "Badge Master", // Earn all 20 badges

    // Speed Titles
    SPEEDRUNNER = "Speedrunner", // Complete all missions in <2 hours
    LIGHTNING_MIND = "Lightning Mind", // All quizzes in <5 seconds
    TIME_KEEPER = "Time Keeper", // Never fail a timed quiz

    // Interaction Titles
    SOCIAL_BUTTERFLY = "Social Butterfly", // Talk to all NPCs multiple times
    FRIENDLY_NEIGHBOR = "Friendly Neighbor", // Complete all optional dialogues
    CIVIC_SAGE = "Civic Sage", // Discover all hidden knowledge

    // Achievement Titles
    PERFECT_CITIZEN = "Perfect Citizen", // 100% game completion
    LEGEND = "Legend", // Complete all secret quests
    MASTER_OF_CIVICS = "Master of Civics", // Max score + all achievements

    // Easter Egg Titles
    SECRET_KEEPER = "Secret Keeper", // Find all easter eggs
    HIDDEN_HERO = "Hidden Hero", // Complete hidden quest chain
    MYSTERIOUS_ONE = "Mysterious One", // Discover secret ending
}

export interface SecretQuest {
    id: string;
    name: string;
    description: string;
    type: SecretQuestType;
    reward: {
        title: PlayerTitle;
        coins: number;
        points: number;
        specialItem?: string; // Optional unique item
    };
    condition: SecretQuestCondition;
    hint?: string; // Cryptic hint for players
    hidden: boolean; // If true, doesn't show in quest log until discovered
    discovered: boolean; // Has player found this quest?
    completed: boolean; // Has player completed this quest?
    progress?: number; // Current progress (for multi-step quests)
}

export interface SecretQuestCondition {
    type:
        | "visit_location"
        | "collect_all"
        | "talk_to_npc"
        | "complete_in_time"
        | "find_item"
        | "sequence"
        | "combo";
    target?: string; // Target NPC, location, or item
    count?: number; // Required count
    timeLimit?: number; // Time limit in seconds
    sequence?: string[]; // Sequence of actions
}

export interface SecretLocation {
    id: string;
    name: string;
    percentX: number; // Background-relative position
    percentY: number;
    questId?: string; // Associated secret quest
    hint?: string;
    discovered: boolean;
}

export interface HiddenNPC {
    id: string;
    name: string;
    dialogue: string[];
    percentX: number;
    percentY: number;
    questId?: string;
    sprite: string;
    appears: boolean; // Only appears when conditions met
}

export interface PlayerTitleData {
    currentTitle: PlayerTitle;
    unlockedTitles: PlayerTitle[];
    titleUnlockedAt: Map<PlayerTitle, string>; // Timestamp when unlocked
}

