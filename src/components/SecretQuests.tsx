/**
 * Secret Quests Component for CIVIKA
 * Displays discovered secret quests, player titles, and hidden achievements
 */

import React, { useState, useEffect } from "react";
import SecretQuestService from "../services/SecretQuestService";
import { SecretQuest, PlayerTitle } from "../types/secretQuest";

interface SecretQuestsProps {
    onClose: () => void;
    isVisible: boolean;
}

export const SecretQuests: React.FC<SecretQuestsProps> = ({
    onClose,
    isVisible,
}) => {
    const [secretQuests, setSecretQuests] = useState<SecretQuest[]>([]);
    const [currentTitle, setCurrentTitle] = useState<PlayerTitle>(
        PlayerTitle.CITIZEN
    );
    const [unlockedTitles, setUnlockedTitles] = useState<PlayerTitle[]>([]);
    const [showTitles, setShowTitles] = useState(false);
    const secretQuestService = SecretQuestService.getInstance();

    useEffect(() => {
        if (isVisible) {
            loadData();
        }
    }, [isVisible]);

    const loadData = () => {
        const quests = secretQuestService.getSecretQuests();
        setSecretQuests(quests);

        const current = secretQuestService.getCurrentTitle();
        setCurrentTitle(current);

        const unlocked = secretQuestService.getUnlockedTitles();
        setUnlockedTitles(unlocked);
    };

    const handleTitleChange = (title: PlayerTitle) => {
        const success = secretQuestService.setActiveTitle(title);
        if (success) {
            setCurrentTitle(title);
        }
    };

    const getTitleColor = (
        rarity: "common" | "uncommon" | "rare" | "legendary"
    ): string => {
        switch (rarity) {
            case "legendary":
                return "from-yellow-400 to-orange-500";
            case "rare":
                return "from-purple-400 to-pink-500";
            case "uncommon":
                return "from-blue-400 to-cyan-500";
            default:
                return "from-gray-400 to-gray-500";
        }
    };

    const getQuestIcon = (quest: SecretQuest): string => {
        if (quest.completed) return "✅";
        if (quest.discovered) return "🎯";
        return "❓";
    };

    if (!isVisible) return null;

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        // Close when clicking the backdrop (dark area)
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleContentClick = (e: React.MouseEvent) => {
        // Prevent closing when clicking inside the modal content
        e.stopPropagation();
    };

    return (
        <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-2 sm:p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div
                className="wooden-frame rounded-lg p-3 sm:p-6 w-full max-w-sm sm:max-w-3xl mx-2 sm:mx-4 max-h-[95vh] overflow-hidden relative"
                onClick={handleContentClick}
            >
                {/* Metal corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 metal-corner rounded-tl-lg z-10" />
                <div className="absolute -top-2 -right-2 w-6 h-6 metal-corner rounded-tr-lg z-10" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 metal-corner rounded-bl-lg z-10" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 metal-corner rounded-br-lg z-10" />

                {/* Parchment content */}
                <div className="parchment-bg rounded-md p-4 sm:p-6 relative max-h-[90vh] flex flex-col">
                    <button
                        onClick={handleClose}
                        className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-4 text-center game-element-border rounded-md py-2 px-4">
                        🔐 SECRET QUESTS
                    </h2>

                    {/* Current Title Display */}
                    <div className="mb-4 p-4 game-element-border rounded-lg bg-gradient-to-r from-amber-100 to-yellow-100">
                        <div className="text-center">
                            <p className="text-sm text-amber-700 mb-1">
                                Current Title:
                            </p>
                            <h3
                                className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${getTitleColor(
                                    secretQuestService.getTitleRarity(
                                        currentTitle
                                    )
                                )} bg-clip-text text-transparent`}
                            >
                                {currentTitle || "Citizen"}
                            </h3>
                            <p className="text-xs text-amber-600 mt-1">
                                {secretQuestService.getTitleDescription(
                                    currentTitle
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-2 mb-4">
                        <button
                            onClick={() => setShowTitles(false)}
                            className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm ${
                                !showTitles
                                    ? "game-button-frame text-white scale-105"
                                    : "game-element-border text-amber-800 hover:scale-105"
                            }`}
                        >
                            🎯 Secret Quests
                        </button>
                        <button
                            onClick={() => setShowTitles(true)}
                            className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all duration-200 text-sm ${
                                showTitles
                                    ? "game-button-frame text-white scale-105"
                                    : "game-element-border text-amber-800 hover:scale-105"
                            }`}
                        >
                            👑 Titles ({unlockedTitles.length})
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto medieval-scrollbar">
                        {!showTitles ? (
                            // Secret Quests View
                            <div className="space-y-3">
                                {secretQuests.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">❓</div>
                                        <p className="text-amber-200 font-bold mb-2">
                                            No secret quests discovered yet!
                                        </p>
                                        <p className="text-amber-600 text-sm">
                                            Explore the map to uncover hidden
                                            secrets...
                                        </p>
                                    </div>
                                ) : (
                                    secretQuests.map((quest) => (
                                        <div
                                            key={quest.id}
                                            className={`game-element-border rounded-lg p-3 sm:p-4 ${
                                                quest.completed
                                                    ? "bg-green-100"
                                                    : ""
                                            }`}
                                        >
                                            {/* Quest Header */}
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-start space-x-2 flex-1">
                                                    <span className="text-2xl">
                                                        {getQuestIcon(quest)}
                                                    </span>
                                                    <div>
                                                        <h3 className="text-base sm:text-lg font-bold text-amber-900">
                                                            {quest.name}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-amber-700 mt-1">
                                                            {quest.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress */}
                                            {quest.progress !== undefined &&
                                                quest.condition.count && (
                                                    <div className="mb-2">
                                                        <div className="flex justify-between text-xs text-amber-700 mb-1">
                                                            <span>
                                                                Progress:{" "}
                                                                {quest.progress}
                                                                /
                                                                {
                                                                    quest
                                                                        .condition
                                                                        .count
                                                                }
                                                            </span>
                                                            <span>
                                                                {Math.round(
                                                                    (quest.progress /
                                                                        quest
                                                                            .condition
                                                                            .count) *
                                                                        100
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-amber-200 rounded-full h-2 border-2 border-amber-400">
                                                            <div
                                                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-300"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        (quest.progress /
                                                                            (quest
                                                                                .condition
                                                                                .count ||
                                                                                1)) *
                                                                            100,
                                                                        100
                                                                    )}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Hint */}
                                            {quest.hint && !quest.completed && (
                                                <div className="mb-2 p-2 bg-purple-100 rounded text-xs">
                                                    <span className="font-bold text-purple-800">
                                                        Hint:
                                                    </span>{" "}
                                                    <span className="text-purple-700 italic">
                                                        {quest.hint}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Rewards */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center space-x-1">
                                                        <span>💰</span>
                                                        <span className="font-bold text-amber-800">
                                                            +
                                                            {quest.reward.coins}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <span>⭐</span>
                                                        <span className="font-bold text-blue-800">
                                                            +
                                                            {
                                                                quest.reward
                                                                    .points
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getTitleColor(
                                                        secretQuestService.getTitleRarity(
                                                            quest.reward.title
                                                        )
                                                    )}`}
                                                >
                                                    👑 {quest.reward.title}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            // Titles View
                            <div className="space-y-3">
                                {unlockedTitles.map((title) => {
                                    const rarity =
                                        secretQuestService.getTitleRarity(
                                            title
                                        );
                                    const isActive = title === currentTitle;

                                    return (
                                        <div
                                            key={title}
                                            className={`game-element-border rounded-lg p-3 transition-all duration-200 hover:scale-102 cursor-pointer ${
                                                isActive
                                                    ? "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-500"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleTitleChange(title)
                                            }
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4
                                                        className={`text-lg font-bold bg-gradient-to-r ${getTitleColor(
                                                            rarity
                                                        )} bg-clip-text text-transparent`}
                                                    >
                                                        {title}
                                                    </h4>
                                                    <p className="text-xs text-amber-700">
                                                        {secretQuestService.getTitleDescription(
                                                            title
                                                        )}
                                                    </p>
                                                </div>
                                                {isActive && (
                                                    <div className="text-2xl">
                                                        ✅
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 p-3 game-element-border rounded-lg bg-amber-50">
                        <div className="text-center text-sm text-amber-800">
                            <p className="font-bold">
                                🔐 Discover secrets to unlock unique titles!
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                                {
                                    secretQuests.filter((q) => q.discovered)
                                        .length
                                }{" "}
                                / {secretQuests.length} secrets discovered
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
