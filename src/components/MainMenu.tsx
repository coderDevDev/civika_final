import React, { useState } from "react";

interface MainMenuProps {
    onStartGame: () => void;
    onLoadGame?: () => void;
    onShowSettings?: () => void;
    onShowExtras?: () => void;
    onShowCredits?: () => void;
    onShowLeaderboard?: () => void;
    onExit?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
    onStartGame,
    onLoadGame,
    onShowSettings,
    onShowExtras,
    onShowCredits,
    onShowLeaderboard,
    onExit,
}) => {
    const [showSubMenu, setShowSubMenu] = useState<string | null>(null);

    const handleLoadGame = () => {
        // Check if there's saved progress
        const savedProgress = localStorage.getItem("civika-game-progress");
        if (savedProgress) {
            onLoadGame?.();
        } else {
            alert("No saved game found! Start a new game first.");
        }
    };

    const handleExit = () => {
        if (window.confirm("Are you sure you want to exit CIVIKA?")) {
            onExit?.();
            // For web, we can close the tab/window or redirect
            window.close();
        }
    };
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 flex items-center justify-center overflow-hidden p-2 sm:p-4">
            {/* Background decorative elements - responsive positioning */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 sm:top-20 sm:left-20 w-8 h-8 sm:w-16 sm:h-16 bg-amber-400/30 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-8 sm:top-32 sm:right-32 w-6 h-6 sm:w-12 sm:h-12 bg-orange-400/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-10 right-4 sm:bottom-40 sm:right-20 w-10 h-10 sm:w-20 sm:h-20 bg-yellow-400/30 rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-4 left-8 sm:bottom-20 sm:left-40 w-7 h-7 sm:w-14 sm:h-14 bg-amber-500/30 rounded-full animate-pulse delay-500"></div>
            </div>

            {/* Main content - Mobile first responsive */}
            <div className="relative z-10 text-center w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
                {/* Main Menu Container */}
                <div className="wooden-frame rounded-lg p-3 sm:p-4 md:p-6 lg:p-8">
                    {/* Metal corners - responsive sizing */}
                    <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-tl-lg z-10" />
                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-tr-lg z-10" />
                    <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-bl-lg z-10" />
                    <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-br-lg z-10" />

                    {/* Parchment content */}
                    <div className="rounded-md p-4 sm:p-6 md:p-8 relative max-h-[90vh] overflow-y-auto medieval-scrollbar">
                        {/* Logo - Mobile responsive */}
                        <div className="mb-4 sm:mb-6 md:mb-8">
                            <div className="relative inline-block">
                                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce game-element-border p-2 sm:p-3 md:p-4">
                                    <img
                                        src="/logo.png"
                                        alt="CIVIKA Logo"
                                        className="w-full h-full object-contain drop-shadow-lg"
                                    />
                                </div>
                                {/* Glow effect - responsive */}
                                <div className="absolute inset-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-amber-400/30 rounded-full animate-ping"></div>
                            </div>
                        </div>

                        {/* Title - Mobile responsive */}
                        {/* <h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-amber-400 mb-3 sm:mb-4 drop-shadow-2xl rounded-md py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6"
                            style={{
                                textShadow: `
                                -2px -2px 0px #8B4513,
                                2px -2px 0px #8B4513,
                                -2px 2px 0px #8B4513,
                                2px 2px 0px #8B4513,
                                -1px -1px 0px #A0522D,
                                1px -1px 0px #A0522D,
                                -1px 1px 0px #A0522D,
                                1px 1px 0px #A0522D,
                                0px 0px 8px rgba(139, 69, 19, 0.5)
                            `,
                                WebkitTextStroke: "1px #8B4513",
                            }}
                        >
                            CIVIKA
                        </h1> */}
                        {/* <div className="text-2xl font-bold text-amber-800 mb-12 drop-shadow-lg game-element-border rounded-md py-2 px-4">
                            🏰 A Civic Education Adventure 🏰
                        </div> */}

                        {/* Game Menu Buttons - Mobile responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12 w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto">
                            {/* New Game Button */}
                            <button
                                onClick={onStartGame}
                                className="game-button-frame px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-full sm:col-span-2"
                            >
                                <div className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2 sm:space-x-3">
                                    <span>🆕</span>
                                    <span>New Game</span>
                                </div>
                            </button>

                            {/* Continue/Load Game Button */}
                            <button
                                onClick={handleLoadGame}
                                className="game-button-frame px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-full"
                            >
                                <div className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>💾</span>
                                    <span className="hidden sm:inline">
                                        Continue
                                    </span>
                                    <span className="sm:hidden">Load</span>
                                </div>
                            </button>

                            {/* Settings Button */}
                            <button
                                onClick={() => onShowSettings?.()}
                                className="game-button-frame px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-full"
                            >
                                <div className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>⚙️</span>
                                    <span>Settings</span>
                                </div>
                            </button>

                            {/* Leaderboard Button */}
                            <button
                                onClick={() => onShowLeaderboard?.()}
                                className="game-button-frame px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-full"
                            >
                                <div className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>🏆</span>
                                    <span>Leaderboard</span>
                                </div>
                            </button>

                            {/* Extras Button */}
                            <button
                                onClick={() => onShowExtras?.()}
                                className="game-button-frame px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-full"
                            >
                                <div className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>🎨</span>
                                    <span>Extras</span>
                                </div>
                            </button>

                            {/* Credits Button */}
                            <button
                                onClick={() => onShowCredits?.()}
                                className="game-button-frame px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-full"
                            >
                                <div className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>👥</span>
                                    <span>Credits</span>
                                </div>
                            </button>

                            {/* Exit Button */}
                            <button
                                onClick={handleExit}
                                className="game-button-frame px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-full border-red-600"
                            >
                                <div className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>🚪</span>
                                    <span>Exit</span>
                                </div>
                            </button>
                        </div>

                        {/* Optional Subtitle - uncomment if needed */}
                        {/* <p className="mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg text-amber-700 font-medium game-element-border rounded-md py-2 px-4">
                            🏰 Learn about civic responsibility through interactive missions 🏰
                        </p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

