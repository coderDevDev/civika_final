import React, { useState, useEffect } from "react";

interface SettingsProps {
    onClose: () => void;
    isVisible: boolean;
}

interface GameSettings {
    masterVolume: number;
    musicVolume: number;
    effectsVolume: number;
    enableMusic: boolean;
    enableEffects: boolean;
    fullscreen: boolean;
    language: string;
    difficulty: string;
    showTutorials: boolean;
}

const defaultSettings: GameSettings = {
    masterVolume: 0.7,
    musicVolume: 0.8,
    effectsVolume: 0.9,
    enableMusic: true,
    enableEffects: true,
    fullscreen: false,
    language: "en",
    difficulty: "normal",
    showTutorials: true,
};

export const Settings: React.FC<SettingsProps> = ({ onClose, isVisible }) => {
    const [settings, setSettings] = useState<GameSettings>(defaultSettings);
    const [activeTab, setActiveTab] = useState<
        "audio" | "graphics" | "gameplay"
    >("audio");

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("civika-settings");
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...defaultSettings, ...parsed });
            } catch (error) {
                console.error("Failed to load settings:", error);
            }
        }

        // Listen for fullscreen changes to keep settings in sync
        const handleFullscreenChange = () => {
            const isFullscreen = !!document.fullscreenElement;
            setSettings((prev) => ({ ...prev, fullscreen: isFullscreen }));
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener(
            "webkitfullscreenchange",
            handleFullscreenChange
        );
        document.addEventListener(
            "mozfullscreenchange",
            handleFullscreenChange
        );
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
            document.removeEventListener(
                "webkitfullscreenchange",
                handleFullscreenChange
            );
            document.removeEventListener(
                "mozfullscreenchange",
                handleFullscreenChange
            );
            document.removeEventListener(
                "MSFullscreenChange",
                handleFullscreenChange
            );
        };
    }, []);

    // Save settings to localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem("civika-settings", JSON.stringify(settings));

        // Apply settings immediately
        applySettings(settings);
    }, [settings]);

    const applySettings = (newSettings: GameSettings) => {
        // Apply audio settings
        if (window.gameAudioManager) {
            window.gameAudioManager.setMasterVolume(newSettings.masterVolume);
            window.gameAudioManager.setMusicVolume(newSettings.musicVolume);
            window.gameAudioManager.setEffectsVolume(newSettings.effectsVolume);
            window.gameAudioManager.setMusicEnabled(newSettings.enableMusic);
            window.gameAudioManager.setEffectsEnabled(
                newSettings.enableEffects
            );
        }

        // Apply graphics settings with proper fullscreen checks
        if (newSettings.fullscreen && !document.fullscreenElement) {
            // Enter fullscreen only if not already in fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch((error) => {
                    console.warn("Failed to enter fullscreen:", error);
                });
            }
        } else if (!newSettings.fullscreen && document.fullscreenElement) {
            // Exit fullscreen only if currently in fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((error) => {
                    console.warn("Failed to exit fullscreen:", error);
                });
            }
        }

        // Emit settings change event for other components
        window.dispatchEvent(
            new CustomEvent("civika-settings-changed", {
                detail: newSettings,
            })
        );
    };

    const updateSetting = <K extends keyof GameSettings>(
        key: K,
        value: GameSettings[K]
    ) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const resetToDefaults = () => {
        if (window.confirm("Reset all settings to default values?")) {
            setSettings(defaultSettings);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
            <div className="wooden-frame rounded-lg p-4 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Metal corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 metal-corner rounded-tl-lg z-10" />
                <div className="absolute -top-2 -right-2 w-6 h-6 metal-corner rounded-tr-lg z-10" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 metal-corner rounded-bl-lg z-10" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 metal-corner rounded-br-lg z-10" />

                {/* Parchment content */}
                <div className="parchment-bg rounded-md p-6 relative">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20 text-sm"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-amber-900 game-element-border rounded-md py-2 px-4">
                            ⚙️ Game Settings
                        </h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-6 space-x-2">
                        {[
                            { id: "audio", label: "🔊 Audio", icon: "🎵" },
                            {
                                id: "graphics",
                                label: "🖥️ Graphics",
                                icon: "🎨",
                            },
                            {
                                id: "gameplay",
                                label: "🎮 Gameplay",
                                icon: "⚙️",
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? "game-button-frame text-white"
                                        : "bg-stone-300 text-stone-700 hover:bg-stone-400"
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                <span className="hidden sm:inline">
                                    {tab.label.split(" ")[1]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Settings Content */}
                    <div className="space-y-4">
                        {/* Audio Settings */}
                        {activeTab === "audio" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-amber-800 border-b border-amber-300 pb-2">
                                    🎵 Audio Settings
                                </h3>

                                {/* Master Volume */}
                                <div className="flex justify-between items-center">
                                    <label className="text-amber-700 font-semibold">
                                        Master Volume:
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={settings.masterVolume}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "masterVolume",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-32"
                                        />
                                        <span className="w-12 text-amber-800 font-bold">
                                            {Math.round(
                                                settings.masterVolume * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Music Volume */}
                                <div className="flex justify-between items-center">
                                    <label className="text-amber-700 font-semibold">
                                        Music Volume:
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={settings.musicVolume}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "musicVolume",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-32"
                                            disabled={!settings.enableMusic}
                                        />
                                        <span className="w-12 text-amber-800 font-bold">
                                            {Math.round(
                                                settings.musicVolume * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Effects Volume */}
                                <div className="flex justify-between items-center">
                                    <label className="text-amber-700 font-semibold">
                                        Sound Effects:
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={settings.effectsVolume}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "effectsVolume",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-32"
                                            disabled={!settings.enableEffects}
                                        />
                                        <span className="w-12 text-amber-800 font-bold">
                                            {Math.round(
                                                settings.effectsVolume * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Enable Music */}
                                <div className="flex justify-between items-center">
                                    <label className="text-amber-700 font-semibold">
                                        Enable Music:
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.enableMusic}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "enableMusic",
                                                    e.target.checked
                                                )
                                            }
                                            className="form-checkbox h-5 w-5 text-amber-600"
                                        />
                                        <span className="text-amber-800">
                                            {settings.enableMusic
                                                ? "On"
                                                : "Off"}
                                        </span>
                                    </label>
                                </div>

                                {/* Enable Effects */}
                                <div className="flex justify-between items-center">
                                    <label className="text-amber-700 font-semibold">
                                        Enable Sound Effects:
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.enableEffects}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "enableEffects",
                                                    e.target.checked
                                                )
                                            }
                                            className="form-checkbox h-5 w-5 text-amber-600"
                                        />
                                        <span className="text-amber-800">
                                            {settings.enableEffects
                                                ? "On"
                                                : "Off"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Graphics Settings */}
                        {activeTab === "graphics" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-amber-800 border-b border-amber-300 pb-2">
                                    🎨 Graphics Settings
                                </h3>

                                {/* Fullscreen */}
                                <div className="flex justify-between items-center">
                                    <label className="text-amber-700 font-semibold">
                                        Fullscreen Mode:
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.fullscreen}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "fullscreen",
                                                    e.target.checked
                                                )
                                            }
                                            className="form-checkbox h-5 w-5 text-amber-600"
                                        />
                                        <span className="text-amber-800">
                                            {settings.fullscreen ? "On" : "Off"}
                                        </span>
                                    </label>
                                </div>

                                <div className="text-amber-600 text-sm bg-amber-100 p-3 rounded-md border border-amber-300">
                                    💡 <strong>Tip:</strong> Graphics settings
                                    are optimized for best performance across
                                    all devices.
                                </div>
                            </div>
                        )}

                        {/* Gameplay Settings */}
                        {activeTab === "gameplay" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-amber-800 border-b border-amber-300 pb-2">
                                    ⚙️ Gameplay Settings
                                </h3>

                                {/* Language */}
                                <div className="flex justify-between items-center">
                                    <label className="text-amber-700 font-semibold">
                                        Language:
                                    </label>
                                    <select
                                        value={settings.language}
                                        onChange={(e) =>
                                            updateSetting(
                                                "language",
                                                e.target.value
                                            )
                                        }
                                        className="px-3 py-1 rounded border border-amber-300 bg-white text-amber-800"
                                    >
                                        <option value="en">🇺🇸 English</option>
                                        <option value="fil">🇵🇭 Filipino</option>
                                        <option value="ceb">🇵🇭 Cebuano</option>
                                        <option value="ilo">🇵🇭 Ilocano</option>
                                    </select>
                                </div>

                                {/* Difficulty */}
                                <div className="flex justify-between items-center">
                                    <label className="text-amber-700 font-semibold">
                                        Difficulty:
                                    </label>
                                    <select
                                        value={settings.difficulty}
                                        onChange={(e) =>
                                            updateSetting(
                                                "difficulty",
                                                e.target.value
                                            )
                                        }
                                        className="px-3 py-1 rounded border border-amber-300 bg-white text-amber-800"
                                    >
                                        <option value="easy">😊 Easy</option>
                                        <option value="normal">
                                            😐 Normal
                                        </option>
                                        <option value="hard">😤 Hard</option>
                                        <option value="expert">
                                            🤯 Expert
                                        </option>
                                    </select>
                                </div>

                                {/* Show Tutorials */}
                                <div className="flex justify-between items-center">
                                    <label className="text-amber-700 font-semibold">
                                        Show Tutorials:
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.showTutorials}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "showTutorials",
                                                    e.target.checked
                                                )
                                            }
                                            className="form-checkbox h-5 w-5 text-amber-600"
                                        />
                                        <span className="text-amber-800">
                                            {settings.showTutorials
                                                ? "On"
                                                : "Off"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-8 space-x-4">
                        <button
                            onClick={resetToDefaults}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 border-2 border-orange-800"
                        >
                            🔄 Reset to Defaults
                        </button>
                        <button
                            onClick={onClose}
                            className="game-button-frame px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                        >
                            <span className="text-white">✅ Apply & Close</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Global audio manager type declaration
declare global {
    interface Window {
        gameAudioManager?: {
            setMasterVolume: (volume: number) => void;
            setMusicVolume: (volume: number) => void;
            setEffectsVolume: (volume: number) => void;
            setMusicEnabled: (enabled: boolean) => void;
            setEffectsEnabled: (enabled: boolean) => void;
        };
    }
}
