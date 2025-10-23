import React, { useState } from "react";
import { BackButton } from "./BackButton";

interface CharacterCreationProps {
    onCharacterCreated: (name: string, gender: string) => void;
    onBack?: () => void; // Optional back handler
}

const genderOptions = [
    { name: "Male", value: "male", icon: "👨", sprite: "/assets/student-sprites/front/front-1-removebg-preview.png" },
    { name: "Female", value: "female", icon: "👩", sprite: "/assets/student-sprites/front/front-1-removebg-preview.png" },
];

export const CharacterCreation: React.FC<CharacterCreationProps> = ({
    onCharacterCreated,
    onBack,
}) => {
    const [playerName, setPlayerName] = useState("");
    const [selectedGender, setSelectedGender] = useState("male");

    const handleSubmit = () => {
        if (playerName.trim()) {
            onCharacterCreated(playerName.trim(), selectedGender);
        }
    };

    const getCurrentSprite = () => {
        const gender = genderOptions.find(g => g.value === selectedGender);
        return gender?.sprite || genderOptions[0].sprite;
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 flex items-center justify-center z-50 overflow-y-auto">
            {/* Back Button */}
            {onBack && (
                <BackButton
                    onBack={onBack}
                    label="Back to Menu"
                    confirmMessage={playerName.trim() ? "Are you sure? Your character name will be lost." : undefined}
                />
            )}
            
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-16 h-16 bg-amber-400/30 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-32 w-12 h-12 bg-orange-400/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 right-20 w-20 h-20 bg-yellow-400/30 rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-20 left-40 w-14 h-14 bg-amber-500/30 rounded-full animate-pulse delay-500"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-xl w-full mx-4 my-4">
                {/* Character Creation Container */}
                <div className="wooden-frame rounded-lg p-4">
                    {/* Metal corners */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 metal-corner rounded-tl-lg z-10" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 metal-corner rounded-tr-lg z-10" />
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 metal-corner rounded-bl-lg z-10" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 metal-corner rounded-br-lg z-10" />

                    {/* Parchment content */}
                    <div className=" rounded-md p-4 relative">
                        {/* Title with Logo */}
                        <div className="flex items-center justify-center mb-3">
                            <img
                                src="/logo.png"
                                alt="CIVIKA Logo"
                                className="w-10 h-10 mr-3 drop-shadow-lg"
                            />
                            <h1
                                className="text-2xl sm:text-3xl font-black text-amber-400 text-center drop-shadow-lg"
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
                                    WebkitTextStroke: "1.5px #8B4513",
                                }}
                            >
                                Create Your Character
                            </h1>
                        </div>
                        {/* <p className="text-lg sm:text-xl text-amber-700 mb-6 sm:mb-8 text-center font-medium game-element-border rounded-md py-2 px-4">
                            🏰 Customize your civic hero 🏰
                        </p> */}

                        {/* Character Preview */}
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="game-element-border rounded-lg p-2 shadow-2xl">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-3 border-amber-800 shadow-2xl overflow-hidden">
                                        <img
                                            src={getCurrentSprite()}
                                            alt="Character Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Glow effect */}
                                <div
                                    className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg animate-ping opacity-20 bg-amber-400"
                                ></div>
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => {
                                    console.log(
                                        "Input changed:",
                                        e.target.value
                                    );
                                    setPlayerName(e.target.value);
                                }}
                                placeholder="Enter your name..."
                                className="w-full px-3 py-2 text-sm sm:text-base border-3 border-amber-700 rounded-lg focus:border-amber-500 focus:outline-none transition-colors duration-200 text-amber-900 bg-amber-50 game-element-border"
                                maxLength={20}
                                autoFocus
                            />
                            {/* Debug display */}
                            {/* <div className="mt-1 text-xs text-amber-600 text-center">
                                Current value: "{playerName}" (Length:{" "}
                                {playerName.length})
                            </div> */}
                        </div>

                        {/* Gender Selection */}
                        <div className="mb-4">
                            <label
                                className="block text-sm font-bold 
                            text-amber-400 mb-2
                          
                              rounded-md py-1 px-2 text-center"
                            >
                                Choose your gender:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {genderOptions.map((gender) => (
                                    <button
                                        key={gender.value}
                                        onClick={() =>
                                            setSelectedGender(gender.value)
                                        }
                                        className={`p-4 rounded-lg border-3 transition-all duration-200 hover:scale-105 game-element-border ${
                                            selectedGender === gender.value
                                                ? "border-amber-400 shadow-lg bg-amber-100"
                                                : "border-amber-700 hover:border-amber-500 bg-amber-50"
                                        }`}
                                    >
                                        <div className="text-3xl sm:text-4xl mb-2">
                                            {gender.icon}
                                        </div>
                                        <div className="text-sm sm:text-base font-bold text-amber-800">
                                            {gender.name}
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
                                className="game-button-frame px-6 py-2 text-white text-base font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none game-glow"
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <span>Create Character</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
