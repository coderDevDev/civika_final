import React from "react";

interface Mission {
    id: string;
    title: string;
    description: string;
    tasks: string[];
    npc: string;
    location: string;
    reward: string;
}

interface MissionSystemProps {
    mission: Mission;
    onStartQuiz: () => void;
    onClose: () => void;
}

export const MissionSystem: React.FC<MissionSystemProps> = ({
    mission,
    onStartQuiz,
    onClose,
}) => {
    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl mx-2 sm:mx-4 max-h-[95vh] overflow-y-auto">
                {/* Mission System Container */}
                <div className="wooden-frame rounded-lg p-3 sm:p-6">
                    {/* Metal corners */}
                    <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tl-lg z-10" />
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tr-lg z-10" />
                    <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-bl-lg z-10" />
                    <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-br-lg z-10" />

                    {/* Parchment content */}
                    <div className="parchment-bg rounded-md p-3 sm:p-6 relative">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-2xl font-bold text-amber-900 game-element-border rounded-md py-1 sm:py-2 px-2 sm:px-4">
                                📜 Mission Details
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 text-sm sm:text-base"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Mission Info */}
                        <div className="space-y-3 sm:space-y-4">
                            {/* Mission Title */}
                            <div className="game-element-border rounded-lg p-3 sm:p-4 bg-gradient-to-r from-amber-100 to-amber-200">
                                <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 flex items-center space-x-1 sm:space-x-2">
                                    <span>⚔️</span>
                                    <span>{mission.title}</span>
                                </h3>
                                <p className="text-amber-800 text-sm sm:text-base">
                                    {mission.description}
                                </p>
                            </div>

                            {/* NPC Info */}
                            <div className="game-element-border rounded-lg p-3 sm:p-4">
                                <div className="flex items-center">
                                    <div className="text-xl sm:text-2xl mr-2 sm:mr-3">
                                        👤
                                    </div>
                                    <div>
                                        <h4 className="text-base sm:text-lg font-bold text-amber-800">
                                            NPC: {mission.npc}
                                        </h4>
                                        <p className="text-amber-700 text-sm sm:text-base">
                                            📍 Location: {mission.location}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tasks */}
                            <div className="game-element-border rounded-lg p-3 sm:p-4">
                                <h4 className="text-base sm:text-lg font-bold text-amber-800 mb-2 sm:mb-3 flex items-center space-x-1 sm:space-x-2">
                                    <span>📋</span>
                                    <span>Tasks to Complete:</span>
                                </h4>
                                <ul className="space-y-2">
                                    {mission.tasks.map((task, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5">
                                                {index + 1}
                                            </div>
                                            <span className="text-amber-700 text-sm sm:text-base">
                                                {task}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Reward */}
                            <div className="game-element-border rounded-lg p-3 sm:p-4">
                                <div className="flex items-center">
                                    <div className="text-xl sm:text-2xl mr-2 sm:mr-3">
                                        🏆
                                    </div>
                                    <div>
                                        <h4 className="text-base sm:text-lg font-bold text-amber-800">
                                            Reward:
                                        </h4>
                                        <p className="text-amber-700 text-sm sm:text-base">
                                            {mission.reward}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                            <button
                                onClick={onStartQuiz}
                                className="game-button-frame px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300 game-glow"
                            >
                                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>📝</span>
                                    <span>Start Quiz</span>
                                </div>
                            </button>
                            <button
                                onClick={onClose}
                                className="game-button-frame px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300 game-glow"
                            >
                                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>🚪</span>
                                    <span>Close</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
