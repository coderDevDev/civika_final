import React from "react";

interface MainMenuProps {
    onStartGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-300 via-blue-200 to-green-300 flex items-center justify-center overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-16 h-16 bg-yellow-400/30 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-32 w-12 h-12 bg-red-400/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 right-20 w-20 h-20 bg-cyan-400/30 rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-20 left-40 w-14 h-14 bg-orange-400/30 rounded-full animate-pulse delay-500"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center max-w-4xl mx-4">
                {/* Logo */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                            <span className="text-6xl">🏛️</span>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 w-32 h-32 bg-yellow-400/30 rounded-full animate-ping"></div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl font-black text-red-500 mb-4 drop-shadow-2xl">
                    CIVIKA
                </h1>
                <div className="text-2xl font-bold text-blue-600 mb-12 drop-shadow-lg">
                    A Civic Education Adventure
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Learning Card */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border-4 border-yellow-400 hover:bg-white/95 transition-all duration-300 transform hover:scale-105">
                        <div className="text-4xl mb-4">📚</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Interactive Learning
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Engage with civic concepts through hands-on
                            activities and real-world scenarios.
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border-4 border-blue-400 hover:bg-white/95 transition-all duration-300 transform hover:scale-105">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Mission-Based
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Complete 10 unique missions that teach different
                            aspects of civic responsibility.
                        </p>
                    </div>

                    {/* Community Card */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border-4 border-green-400 hover:bg-white/95 transition-all duration-300 transform hover:scale-105">
                        <div className="text-4xl mb-4">🤝</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Community Focus
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Learn about barangay governance, community service,
                            and local democracy.
                        </p>
                    </div>
                </div>

                {/* Start Button */}
                <button
                    onClick={onStartGame}
                    className="group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-2xl font-bold rounded-2xl shadow-2xl hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 border-4 border-blue-800 hover:border-yellow-400"
                >
                    <span className="relative z-10">START GAME</span>
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </button>

                {/* Subtitle */}
                <p className="mt-8 text-lg text-gray-700 font-medium">
                    Learn about civic responsibility through interactive
                    missions
                </p>
            </div>
        </div>
    );
};
