/**
 * Shop Component for CIVIKA
 * Displays shop items, handles purchases, and shows player inventory
 */

import React, { useState, useEffect } from "react";
import ShopService from "../services/ShopService";
import {
    ShopItem,
    ShopItemCategory,
    ShopItemRarity,
    PurchasedItem,
} from "../types/shop";
import { GameStateManager } from "../utils/GameStateManager";

interface ShopProps {
    onClose: () => void;
    isVisible: boolean;
}

export const Shop: React.FC<ShopProps> = ({ onClose, isVisible }) => {
    const [selectedCategory, setSelectedCategory] = useState<ShopItemCategory>(
        ShopItemCategory.POWERUPS
    );
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [playerCoins, setPlayerCoins] = useState(0);
    const [playerLevel, setPlayerLevel] = useState(1);
    const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
    const [showInventory, setShowInventory] = useState(false);
    const shopService = ShopService.getInstance();
    const gameStateManager = GameStateManager.getInstance();

    useEffect(() => {
        if (isVisible) {
            loadShopData();
        }
    }, [isVisible, selectedCategory]);

    const loadShopData = () => {
        // Get player data
        const progress = gameStateManager.getProgress();
        if (progress) {
            setPlayerCoins(progress.coins);
            setPlayerLevel(progress.level);
        }

        // Get shop items for current category and player level
        const availableItems = shopService.getAvailableItems(
            progress?.level || 1
        );
        const categoryItems = availableItems.filter(
            (item) => item.category === selectedCategory
        );
        setShopItems(categoryItems);

        // Get purchased items
        const inventory = shopService.getInventory();
        setPurchasedItems(inventory.purchasedItems);
    };

    const handlePurchase = (item: ShopItem) => {
        const result = shopService.purchaseItem(item.id);

        if (result.success) {
            // Show success notification
            alert(
                `✅ ${result.message}\n\n${
                    item.effect
                        ? "Effect activated!"
                        : "Added to your collection!"
                }`
            );
            loadShopData(); // Refresh shop data
        } else {
            // Show error
            alert(`❌ ${result.message}`);
        }
    };

    const getRarityColor = (rarity: ShopItemRarity): string => {
        switch (rarity) {
            case ShopItemRarity.LEGENDARY:
                return "from-yellow-400 to-orange-500";
            case ShopItemRarity.RARE:
                return "from-purple-400 to-pink-500";
            case ShopItemRarity.UNCOMMON:
                return "from-blue-400 to-cyan-500";
            case ShopItemRarity.COMMON:
            default:
                return "from-gray-400 to-gray-500";
        }
    };

    const getRarityBadge = (rarity: ShopItemRarity): string => {
        switch (rarity) {
            case ShopItemRarity.LEGENDARY:
                return "⭐⭐⭐";
            case ShopItemRarity.RARE:
                return "⭐⭐";
            case ShopItemRarity.UNCOMMON:
                return "⭐";
            case ShopItemRarity.COMMON:
            default:
                return "";
        }
    };

    const canAfford = (item: ShopItem): boolean => {
        return playerCoins >= item.price;
    };

    const isUnlocked = (item: ShopItem): boolean => {
        return !item.unlockLevel || playerLevel >= item.unlockLevel;
    };

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-2 sm:p-4 z-50">
            <div className="wooden-frame rounded-lg p-3 sm:p-6 w-full max-w-sm sm:max-w-3xl lg:max-w-5xl mx-2 sm:mx-4 max-h-[95vh] overflow-hidden">
                {/* Metal corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 metal-corner rounded-tl-lg z-10" />
                <div className="absolute -top-2 -right-2 w-6 h-6 metal-corner rounded-tr-lg z-10" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 metal-corner rounded-bl-lg z-10" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 metal-corner rounded-br-lg z-10" />

                {/* Parchment content */}
                <div className="parchment-bg rounded-md p-4 sm:p-6 relative max-h-[90vh] flex flex-col">
                    <button
                        onClick={onClose}
                        className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 game-element-border rounded-md py-2 px-4">
                            🏪 CIVIC SHOP
                        </h2>
                        <div className="game-element-border rounded-lg px-4 py-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">💰</span>
                                <span className="text-xl font-bold text-amber-900">
                                    {playerCoins}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex space-x-2 mb-4 overflow-x-auto">
                        <button
                            onClick={() => setShowInventory(false)}
                            className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 whitespace-nowrap text-sm ${
                                !showInventory
                                    ? "game-button-frame text-white scale-105"
                                    : "game-element-border text-amber-800 hover:scale-105"
                            }`}
                        >
                            🏪 Shop
                        </button>
                        <button
                            onClick={() => setShowInventory(true)}
                            className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 whitespace-nowrap text-sm ${
                                showInventory
                                    ? "game-button-frame text-white scale-105"
                                    : "game-element-border text-amber-800 hover:scale-105"
                            }`}
                        >
                            🎒 Inventory ({purchasedItems.length})
                        </button>
                    </div>

                    {!showInventory ? (
                        <>
                            {/* Shop Categories */}
                            <div className="flex space-x-2 mb-4 overflow-x-auto">
                                {[
                                    {
                                        cat: ShopItemCategory.POWERUPS,
                                        icon: "⚡",
                                        label: "Powerups",
                                    },
                                    {
                                        cat: ShopItemCategory.BOOSTERS,
                                        icon: "📈",
                                        label: "Boosters",
                                    },
                                    {
                                        cat: ShopItemCategory.COSMETICS,
                                        icon: "👑",
                                        label: "Cosmetics",
                                    },
                                    {
                                        cat: ShopItemCategory.SPECIAL,
                                        icon: "🎁",
                                        label: "Special",
                                    },
                                ].map((category) => (
                                    <button
                                        key={category.cat}
                                        onClick={() =>
                                            setSelectedCategory(category.cat)
                                        }
                                        className={`px-3 py-2 rounded-lg font-bold transition-all duration-200 whitespace-nowrap text-xs sm:text-sm ${
                                            selectedCategory === category.cat
                                                ? "game-button-frame text-white scale-105"
                                                : "game-element-border text-amber-800 hover:scale-105"
                                        }`}
                                    >
                                        <span className="mr-1">
                                            {category.icon}
                                        </span>
                                        <span>{category.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Shop Items Grid */}
                            <div className="flex-1 overflow-y-auto medieval-scrollbar">
                                {shopItems.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">📦</div>
                                        <p className="text-amber-700">
                                            No items in this category yet!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                        {shopItems.map((item) => {
                                            const affordable = canAfford(item);
                                            const unlocked = isUnlocked(item);

                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`game-element-border rounded-lg p-3 sm:p-4 transition-all duration-200 hover:scale-105 ${
                                                        !unlocked
                                                            ? "opacity-50"
                                                            : ""
                                                    }`}
                                                >
                                                    {/* Item Header */}
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="text-4xl">
                                                            {item.icon}
                                                        </div>
                                                        <div
                                                            className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(
                                                                item.rarity
                                                            )}`}
                                                        >
                                                            {getRarityBadge(
                                                                item.rarity
                                                            )}{" "}
                                                            {item.rarity.toUpperCase()}
                                                        </div>
                                                    </div>

                                                    {/* Item Name */}
                                                    <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-1">
                                                        {item.name}
                                                    </h3>

                                                    {/* Item Description */}
                                                    <p className="text-xs sm:text-sm text-amber-700 mb-3">
                                                        {item.description}
                                                    </p>

                                                    {/* Item Effect */}
                                                    {item.effect && (
                                                        <div className="mb-3 p-2 bg-blue-100 rounded text-xs">
                                                            <span className="font-bold text-blue-800">
                                                                Effect:
                                                            </span>{" "}
                                                            {item.effect
                                                                .duration && (
                                                                <span className="text-blue-700">
                                                                    {
                                                                        item
                                                                            .effect
                                                                            .duration
                                                                    }
                                                                    s duration
                                                                </span>
                                                            )}
                                                            {item.effect
                                                                .multiplier && (
                                                                <span className="text-blue-700">
                                                                    {" "}
                                                                    {
                                                                        item
                                                                            .effect
                                                                            .multiplier
                                                                    }
                                                                    x multiplier
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Price & Buy Button */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-1">
                                                            <span className="text-xl">
                                                                💰
                                                            </span>
                                                            <span className="text-lg font-bold text-amber-800">
                                                                {item.price}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                handlePurchase(
                                                                    item
                                                                )
                                                            }
                                                            disabled={
                                                                !affordable ||
                                                                !unlocked
                                                            }
                                                            className={`px-3 py-1 rounded-lg font-bold text-sm transition-all duration-200 ${
                                                                !unlocked
                                                                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                                                    : affordable
                                                                    ? "game-button-frame text-white hover:scale-110"
                                                                    : "bg-red-400 text-white cursor-not-allowed"
                                                            }`}
                                                        >
                                                            {!unlocked
                                                                ? `🔒 L${item.unlockLevel}`
                                                                : affordable
                                                                ? "Buy"
                                                                : "No Coins"}
                                                        </button>
                                                    </div>

                                                    {/* Purchase Limit */}
                                                    {item.maxPurchases && (
                                                        <div className="mt-2 text-xs text-amber-600 text-center">
                                                            Max:{" "}
                                                            {item.maxPurchases}{" "}
                                                            purchases
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // Inventory View
                        <div className="flex-1 overflow-y-auto medieval-scrollbar">
                            {purchasedItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-4xl mb-4">🎒</div>
                                    <p className="text-amber-700 font-bold mb-2">
                                        Your inventory is empty!
                                    </p>
                                    <p className="text-amber-600 text-sm">
                                        Purchase items from the shop to fill
                                        your inventory.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {purchasedItems.map((purchased) => {
                                        const item = shopService
                                            .getShopCatalog()
                                            .find(
                                                (i) => i.id === purchased.itemId
                                            );
                                        if (!item) return null;

                                        return (
                                            <div
                                                key={purchased.itemId}
                                                className="game-element-border rounded-lg p-3 text-center"
                                            >
                                                <div className="text-3xl mb-2">
                                                    {item.icon}
                                                </div>
                                                <h4 className="text-sm font-bold text-amber-900 mb-1">
                                                    {item.name}
                                                </h4>
                                                <div className="text-xs text-amber-700 mb-2">
                                                    Qty: {purchased.quantity}
                                                </div>
                                                {item.effect?.duration && (
                                                    <button
                                                        onClick={() => {
                                                            const result =
                                                                shopService.useItem(
                                                                    item.id
                                                                );
                                                            alert(
                                                                result.success
                                                                    ? `✅ ${result.message}`
                                                                    : `❌ ${result.message}`
                                                            );
                                                            loadShopData();
                                                        }}
                                                        className="w-full px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold"
                                                    >
                                                        Use
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-4 text-center text-xs text-amber-600">
                        💡 Earn coins by completing missions and collecting
                        items!
                    </div>
                </div>
            </div>
        </div>
    );
};
