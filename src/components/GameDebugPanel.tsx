import React, { useState, useEffect } from "react";
import { GameStateManager } from "../utils/GameStateManager";

export const GameDebugPanel: React.FC = () => {
    const [debugInfo, setDebugInfo] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const gameStateManager = GameStateManager.getInstance();

    useEffect(() => {
        if (isVisible) {
            const info = gameStateManager.getDebugInfo();
            setDebugInfo(info);
        }
    }, [isVisible]);

    const handleExportProgress = () => {
        const exported = gameStateManager.exportProgress();
        if (exported) {
            const blob = new Blob([exported], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `civika-progress-${
                new Date().toISOString().split("T")[0]
            }.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleImportProgress = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                if (gameStateManager.importProgress(content)) {
                    alert("Progress imported successfully!");
                    setDebugInfo(gameStateManager.getDebugInfo());
                } else {
                    alert("Failed to import progress. Invalid file format.");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleResetProgress = () => {
        if (
            confirm(
                "Are you sure you want to reset all progress? This cannot be undone."
            )
        ) {
            gameStateManager.resetProgress();
            setDebugInfo(gameStateManager.getDebugInfo());
        }
    };

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full text-xs z-50 hover:bg-gray-700"
            >
                🔧
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm text-xs z-50 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm">Game Debug Panel</h3>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>

            {debugInfo && (
                <div className="space-y-2">
                    <div>
                        <strong>Status:</strong>{" "}
                        <span
                            className={
                                debugInfo.isValid
                                    ? "text-green-400"
                                    : "text-red-400"
                            }
                        >
                            {debugInfo.isValid ? "Valid" : "Invalid"}
                        </span>
                    </div>

                    <div>
                        <strong>Progress:</strong>{" "}
                        {debugInfo.hasProgress ? "Loaded" : "None"}
                    </div>

                    <div>
                        <strong>Available Missions:</strong> [
                        {debugInfo.availableMissions?.join(", ") || "None"}]
                    </div>

                    {debugInfo.stats && (
                        <div>
                            <strong>Stats:</strong>
                            <div className="ml-2 mt-1 space-y-1">
                                <div>Level: {debugInfo.stats.level}</div>
                                <div>Coins: {debugInfo.stats.coins}</div>
                                <div>
                                    Badges: {debugInfo.stats.badgeCount}/10
                                </div>
                                <div>Score: {debugInfo.stats.totalScore}</div>
                                <div>Accuracy: {debugInfo.stats.accuracy}</div>
                                <div>
                                    Completion:{" "}
                                    {debugInfo.stats.completionPercentage}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-2 border-t border-gray-600 space-y-2">
                        <button
                            onClick={handleExportProgress}
                            className="w-full bg-blue-600 hover:bg-blue-700 py-1 px-2 rounded text-xs"
                        >
                            Export Progress
                        </button>

                        <div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportProgress}
                                className="hidden"
                                id="import-progress"
                            />
                            <label
                                htmlFor="import-progress"
                                className="block w-full bg-green-600 hover:bg-green-700 py-1 px-2 rounded text-xs text-center cursor-pointer"
                            >
                                Import Progress
                            </label>
                        </div>

                        <button
                            onClick={handleResetProgress}
                            className="w-full bg-red-600 hover:bg-red-700 py-1 px-2 rounded text-xs"
                        >
                            Reset Progress
                        </button>

                        <button
                            onClick={() =>
                                setDebugInfo(gameStateManager.getDebugInfo())
                            }
                            className="w-full bg-gray-600 hover:bg-gray-700 py-1 px-2 rounded text-xs"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
