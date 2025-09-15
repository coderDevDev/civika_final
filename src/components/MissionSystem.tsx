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
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl border-4 border-blue-400">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-black text-blue-600">
                        Mission Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Mission Info */}
                <div className="space-y-6">
                    {/* Mission Title */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-2">
                            {mission.title}
                        </h3>
                        <p className="text-lg opacity-90">
                            {mission.description}
                        </p>
                    </div>

                    {/* NPC Info */}
                    <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded-xl">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">👤</div>
                            <div>
                                <h4 className="text-lg font-bold text-yellow-800">
                                    NPC: {mission.npc}
                                </h4>
                                <p className="text-yellow-700">
                                    Location: {mission.location}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="bg-green-100 border-2 border-green-400 p-6 rounded-xl">
                        <h4 className="text-xl font-bold text-green-800 mb-4">
                            Tasks to Complete:
                        </h4>
                        <ul className="space-y-2">
                            {mission.tasks.map((task, index) => (
                                <li key={index} className="flex items-start">
                                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                        {index + 1}
                                    </div>
                                    <span className="text-green-700 text-lg">
                                        {task}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Reward */}
                    <div className="bg-purple-100 border-2 border-purple-400 p-4 rounded-xl">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">🏆</div>
                            <div>
                                <h4 className="text-lg font-bold text-purple-800">
                                    Reward:
                                </h4>
                                <p className="text-purple-700">
                                    {mission.reward}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                    <button
                        onClick={onStartQuiz}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
                    >
                        Start Quiz
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-lg font-bold rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
