import React from "react";

interface MainMenuProps {
    onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 flex items-center justify-center overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-16 h-16 bg-amber-400/30 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-32 w-12 h-12 bg-orange-400/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 right-20 w-20 h-20 bg-yellow-400/30 rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-20 left-40 w-14 h-14 bg-amber-500/30 rounded-full animate-pulse delay-500"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center max-w-4xl mx-4">
                {/* Main Menu Container */}
                <div className="wooden-frame rounded-lg p-8">
                    {/* Metal corners */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 metal-corner rounded-tl-lg z-10" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 metal-corner rounded-tr-lg z-10" />
                    <div className="absolute -bottom-3 -left-3 w-8 h-8 metal-corner rounded-bl-lg z-10" />
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 metal-corner rounded-br-lg z-10" />

                    {/* Parchment content */}
                    <div className=" rounded-md p-8 relative">
                        {/* Logo */}
                        <div className="mb-8">
                            <div className="relative inline-block">
                                <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce game-element-border">
                                    <span className="text-6xl">🏛️</span>
                                </div>
                                {/* Glow effect */}
                                <div className="absolute inset-0 w-32 h-32 bg-amber-400/30 rounded-full animate-ping"></div>
                            </div>
                        </div>

                        {/* Title */}
                        <h1
                            className="text-6xl font-black text-amber-400 mb-4 drop-shadow-2xl rounded-md py-4 px-6"
                            style={{
                                textShadow: `
                                -3px -3px 0px #8B4513,
                                3px -3px 0px #8B4513,
                                -3px 3px 0px #8B4513,
                                3px 3px 0px #8B4513,
                                -2px -2px 0px #A0522D,
                                2px -2px 0px #A0522D,
                                -2px 2px 0px #A0522D,
                                2px 2px 0px #A0522D,
                                0px 0px 10px rgba(139, 69, 19, 0.5)
                            `,
                                WebkitTextStroke: "2px #8B4513",
                            }}
                        >
                            CIVIKA
                        </h1>
                        {/* <div className="text-2xl font-bold text-amber-800 mb-12 drop-shadow-lg game-element-border rounded-md py-2 px-4">
                            🏰 A Civic Education Adventure 🏰
                        </div> */}

                        {/* Game Menu Buttons */}
                        <div className="flex flex-col items-center space-y-4 mb-12">
                            {/* Start Game Button */}
                            <button
                                onClick={onStartGame}
                                className="game-button-frame px-12 py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-64"
                            >
                                <div className="text-white font-bold text-lg flex items-center justify-center space-x-3">
                                    <span>Start New Game</span>
                                </div>
                            </button>

                            {/* Load Game Button */}
                            <button
                                onClick={() => {
                                    // TODO: Implement load game functionality
                                    console.log("Load game clicked");
                                }}
                                className="game-button-frame px-12 py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-64"
                            >
                                <div className="text-white font-bold text-lg flex items-center justify-center space-x-3">
                                    <span>Load Game</span>
                                </div>
                            </button>

                            {/* Settings Button */}
                            <button
                                onClick={() => {
                                    // TODO: Implement settings functionality
                                    console.log("Settings clicked");
                                }}
                                className="game-button-frame px-12 py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-64"
                            >
                                <div className="text-white font-bold text-lg flex items-center justify-center space-x-3">
                                    <span>Settings</span>
                                </div>
                            </button>

                            {/* Credits Button */}
                            <button
                                onClick={() => {
                                    // TODO: Implement credits functionality
                                    console.log("Credits clicked");
                                }}
                                className="game-button-frame px-12 py-4 rounded-full transition-all duration-200 hover:scale-105 game-glow w-64"
                            >
                                <div className="text-white font-bold text-lg flex items-center justify-center space-x-3">
                                    <span>Credits</span>
                                </div>
                            </button>
                        </div>

                        {/* Subtitle */}
                        {/* <p className="mt-8 text-lg text-amber-700 font-medium game-element-border rounded-md py-2 px-4">
                            🏰 Learn about civic responsibility through
                            interactive missions 🏰
                        </p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

