import React, { useState } from "react";

interface CharacterCreationProps {
    onCharacterCreated: (name: string, color: string) => void;
}

const colorOptions = [
    { name: "Green", value: "#00ff00", bg: "bg-green-500" },
    { name: "Blue", value: "#0066ff", bg: "bg-blue-500" },
    { name: "Red", value: "#ff0000", bg: "bg-red-500" },
    { name: "Yellow", value: "#ffff00", bg: "bg-yellow-500" },
    { name: "Purple", value: "#9900ff", bg: "bg-purple-500" },
    { name: "Orange", value: "#ff6600", bg: "bg-orange-500" },
];

export const CharacterCreation: React.FC<CharacterCreationProps> = ({
    onCharacterCreated,
}) => {
    const [playerName, setPlayerName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#00ff00");

    const handleSubmit = () => {
        if (playerName.trim()) {
            onCharacterCreated(playerName.trim(), selectedColor);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-sky-300 via-blue-200 to-green-300 flex items-center justify-center z-50 overflow-y-auto">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-32 w-12 h-12 bg-red-400/20 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 right-20 w-20 h-20 bg-cyan-400/20 rounded-full animate-pulse delay-2000"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border-4 border-yellow-400 max-w-2xl w-full mx-4 my-8">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-red-500 mb-6 sm:mb-8 text-center drop-shadow-lg">
                    Create Your Character
                </h1>
                <p className="text-lg sm:text-xl text-blue-600 mb-6 sm:mb-8 text-center font-medium">
                    Customize your 2D avatar
                </p>

                {/* Character Preview */}
                <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="relative">
                        <div
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-800 shadow-2xl flex items-center justify-center text-4xl sm:text-5xl md:text-6xl"
                            style={{ backgroundColor: selectedColor }}
                        >
                            👤
                        </div>
                        {/* Glow effect */}
                        <div
                            className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full animate-ping opacity-30"
                            style={{ backgroundColor: selectedColor }}
                        ></div>
                    </div>
                </div>

                {/* Name Input */}
                <div className="mb-6 sm:mb-8">
                    <label className="block text-base sm:text-lg font-bold text-gray-700 mb-2 sm:mb-3">
                        Enter your name:
                    </label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => {
                            console.log("Input changed:", e.target.value);
                            setPlayerName(e.target.value);
                        }}
                        placeholder="Type your name here..."
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 text-gray-900 bg-white"
                        maxLength={20}
                        autoFocus
                    />
                    {/* Debug display */}
                    <div className="mt-2 text-xs sm:text-sm text-gray-600">
                        Current value: "{playerName}" (Length:{" "}
                        {playerName.length})
                    </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6 sm:mb-8">
                    <label className="block text-base sm:text-lg font-bold text-gray-700 mb-2 sm:mb-3">
                        Choose your color:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        {colorOptions.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setSelectedColor(color.value)}
                                className={`p-3 sm:p-4 rounded-xl border-4 transition-all duration-200 hover:scale-105 ${
                                    selectedColor === color.value
                                        ? "border-yellow-400 shadow-lg"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full ${color.bg} mx-auto mb-1 sm:mb-2 shadow-md`}
                                ></div>
                                <div className="text-xs sm:text-sm font-medium text-gray-700">
                                    {color.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={!playerName.trim()}
                        className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white text-lg sm:text-xl font-bold rounded-2xl shadow-2xl hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-4 border-blue-800 hover:border-yellow-400"
                    >
                        Create Character
                    </button>
                </div>
            </div>
        </div>
    );
};
