/**
 * Leaderboard Component for CIVIKA
 *
 * Displays global rankings with multiple leaderboard types:
 * - Overall: Top scores
 * - Daily: Today's best performers
 * - Speed: Fastest quiz times
 * - Collectors: Most collectibles found
 */

import React, { useState, useEffect } from "react";
import LeaderboardService from "../services/LeaderboardService";
import { LeaderboardEntry, LeaderboardType } from "../types/leaderboard";
import { GameStateManager } from "../utils/GameStateManager";

interface LeaderboardProps {
    onClose: () => void;
    isVisible: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
    onClose,
    isVisible,
}) => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
        []
    );
    const [selectedTab, setSelectedTab] = useState<LeaderboardType>(
        LeaderboardType.OVERALL
    );
    const [loading, setLoading] = useState(false);
    const [playerRank, setPlayerRank] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const leaderboardService = LeaderboardService.getInstance();
    const gameStateManager = GameStateManager.getInstance();

    useEffect(() => {
        if (isVisible) {
            loadLeaderboard();

            // Subscribe to real-time updates if enabled
            if (leaderboardService.isEnabled()) {
                const channel = leaderboardService.subscribeToLeaderboard(
                    () => {
                        console.log("Leaderboard updated, refreshing...");
                        loadLeaderboard();
                    }
                );

                return () => {
                    leaderboardService.unsubscribeFromLeaderboard(channel);
                };
            }
        }
    }, [isVisible, selectedTab]);

    const loadLeaderboard = async () => {
        setLoading(true);
        setError(null);

        // Check if leaderboard is enabled
        if (!leaderboardService.isEnabled()) {
            setError(
                "Leaderboard is not configured. Please set up Supabase to enable this feature."
            );
            setLoading(false);
            return;
        }

        try {
            let data: LeaderboardEntry[] = [];

            switch (selectedTab) {
                case LeaderboardType.OVERALL:
                    data = await leaderboardService.getTopPlayers(100);
                    break;
                case LeaderboardType.SPEED:
                    data = await leaderboardService.getSpeedLeaderboard(50);
                    break;
                case LeaderboardType.COLLECTORS:
                    data = await leaderboardService.getCollectorLeaderboard(50);
                    break;
                case LeaderboardType.DAILY:
                    const dailyData =
                        await leaderboardService.getDailyLeaderboard(50);
                    // Convert to LeaderboardEntry format
                    data = dailyData.map((d) => ({
                        player_name: d.player_name,
                        total_score: d.score,
                        level: 0,
                        badges: 0,
                        coins: 0,
                        completed_missions: 0,
                        accuracy: 0,
                        playtime: 0,
                    }));
                    break;
            }

            setLeaderboardData(data);

            // Get player's rank
            const progress = gameStateManager.getProgress();
            if (progress && selectedTab === LeaderboardType.OVERALL) {
                const rank = await leaderboardService.getPlayerRank(
                    progress.playerName
                );
                setPlayerRank(rank);
            } else {
                setPlayerRank(null);
            }
        } catch (error) {
            console.error("Failed to load leaderboard:", error);
            setError(
                "Failed to load leaderboard. Please check your connection."
            );
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank: number): string => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `${rank}`;
    };

    const isCurrentPlayer = (entry: LeaderboardEntry): boolean => {
        const progress = gameStateManager.getProgress();
        return progress?.playerName === entry.player_name;
    };

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-2 sm:p-4 z-50">
            <div className="wooden-frame rounded-lg p-3 sm:p-6 w-full max-w-sm sm:max-w-2xl lg:max-w-4xl mx-2 sm:mx-4 max-h-[95vh] overflow-hidden">
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-4 text-center game-element-border rounded-md py-2 px-4">
                        🏆 LEADERBOARD 🏆
                    </h2>

                    {/* Player's Rank Display */}
                    {playerRank && (
                        <div className="mb-4 p-3 game-element-border rounded-lg bg-gradient-to-r from-amber-200 to-yellow-200">
                            <div className="flex items-center justify-between">
                                <span className="text-amber-800 font-bold">
                                    Your Rank:
                                </span>
                                <span className="text-2xl font-bold text-amber-900">
                                    {getRankIcon(playerRank)} #{playerRank}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex space-x-2 mb-4 overflow-x-auto">
                        {[
                            {
                                type: LeaderboardType.OVERALL,
                                icon: "🏆",
                                label: "Overall",
                            },
                            {
                                type: LeaderboardType.DAILY,
                                icon: "📅",
                                label: "Daily",
                            },
                            {
                                type: LeaderboardType.SPEED,
                                icon: "⚡",
                                label: "Speed",
                            },
                            {
                                type: LeaderboardType.COLLECTORS,
                                icon: "💎",
                                label: "Collectors",
                            },
                        ].map((tab) => (
                            <button
                                key={tab.type}
                                onClick={() => setSelectedTab(tab.type)}
                                className={`px-3 sm:px-4 py-2 rounded-lg font-bold transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                                    selectedTab === tab.type
                                        ? "game-button-frame text-white scale-105"
                                        : "game-element-border text-amber-800 hover:scale-105"
                                }`}
                            >
                                <span className="mr-1">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Leaderboard Content */}
                    <div className="flex-1 overflow-y-auto medieval-scrollbar">
                        {error ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">⚠️</div>
                                <p className="text-red-700 font-bold mb-2">
                                    {error}
                                </p>
                                <p className="text-amber-600 text-sm">
                                    Check the console for more details or refer
                                    to LEADERBOARD_SETUP_GUIDE.md
                                </p>
                            </div>
                        ) : loading ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4 animate-bounce">
                                    ⏳
                                </div>
                                <p className="text-amber-700 font-bold">
                                    Loading leaderboard...
                                </p>
                            </div>
                        ) : leaderboardData.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">📜</div>
                                <p className="text-amber-700 font-bold mb-2">
                                    No entries yet!
                                </p>
                                <p className="text-amber-600 text-sm">
                                    Be the first to appear on the leaderboard.
                                    Complete missions to submit your score!
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[500px]">
                                    <thead className="sticky top-0 bg-amber-100 game-element-border">
                                        <tr className="text-amber-900 font-bold text-xs sm:text-sm">
                                            <th className="p-2 text-center">
                                                Rank
                                            </th>
                                            <th className="p-2 text-left">
                                                Player
                                            </th>
                                            <th className="p-2 text-center">
                                                Score
                                            </th>
                                            <th className="p-2 text-center">
                                                Badges
                                            </th>
                                            {selectedTab ===
                                                LeaderboardType.SPEED && (
                                                <th className="p-2 text-center">
                                                    Fastest
                                                </th>
                                            )}
                                            {selectedTab ===
                                                LeaderboardType.COLLECTORS && (
                                                <th className="p-2 text-center">
                                                    Items
                                                </th>
                                            )}
                                            {selectedTab ===
                                                LeaderboardType.OVERALL && (
                                                <th className="p-2 text-center hidden sm:table-cell">
                                                    Level
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboardData.map((entry, index) => {
                                            const rank = index + 1;
                                            const isPlayer =
                                                isCurrentPlayer(entry);

                                            return (
                                                <tr
                                                    key={entry.id || index}
                                                    className={`border-b border-amber-300 transition-all duration-200 hover:bg-amber-50 text-xs sm:text-sm ${
                                                        isPlayer
                                                            ? "bg-gradient-to-r from-amber-200 to-yellow-200 font-bold"
                                                            : "bg-amber-50"
                                                    }`}
                                                >
                                                    <td className="p-2 text-center text-lg sm:text-xl">
                                                        {getRankIcon(rank)}
                                                    </td>
                                                    <td className="p-2 text-amber-900">
                                                        {isPlayer && (
                                                            <span className="mr-1">
                                                                ⭐
                                                            </span>
                                                        )}
                                                        {entry.player_name}
                                                        {isPlayer && (
                                                            <span className="ml-1">
                                                                ⭐
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-2 text-center text-amber-800 font-semibold">
                                                        {entry.total_score.toLocaleString()}
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <span className="inline-block px-2 py-1 bg-amber-200 rounded-full text-xs font-bold">
                                                            🏆 {entry.badges}
                                                        </span>
                                                    </td>
                                                    {selectedTab ===
                                                        LeaderboardType.SPEED && (
                                                        <td className="p-2 text-center text-green-700 font-bold">
                                                            ⚡{" "}
                                                            {entry.fastest_quiz_time?.toFixed(
                                                                1
                                                            ) || "-"}
                                                            s
                                                        </td>
                                                    )}
                                                    {selectedTab ===
                                                        LeaderboardType.COLLECTORS && (
                                                        <td className="p-2 text-center text-purple-700 font-bold">
                                                            💎{" "}
                                                            {entry.total_collectibles ||
                                                                0}
                                                        </td>
                                                    )}
                                                    {selectedTab ===
                                                        LeaderboardType.OVERALL && (
                                                        <td className="p-2 text-center hidden sm:table-cell">
                                                            <span className="inline-block px-2 py-1 bg-blue-200 rounded-full text-xs font-bold">
                                                                L{entry.level}
                                                            </span>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 text-center text-xs text-amber-600">
                        {leaderboardService.isEnabled() ? (
                            <>
                                🔄 Updates every 30 seconds • 🌍 Global Rankings
                            </>
                        ) : (
                            <>
                                ⚠️ Leaderboard not configured • See
                                LEADERBOARD_SETUP_GUIDE.md
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
