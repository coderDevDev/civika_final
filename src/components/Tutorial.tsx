import { useState } from "react";

interface TutorialProps {
    onComplete: () => void;
    onSkip: () => void;
}

interface TutorialStep {
    title: string;
    description: string;
    icon: string;
    highlight?: string; // Element to highlight (for future enhancement)
}

const tutorialSteps: TutorialStep[] = [
    {
        title: "Welcome to CIVIKA! 🏛️",
        description:
            "Learn about Philippine civic governance through fun missions and interactive gameplay. You'll explore barangay and city government operations while earning rewards!",
        icon: "🎮",
    },
    {
        title: "How to Move",
        description:
            "🖥️ Desktop: Use Arrow Keys or WASD to move your character.\n\n📱 Mobile: Use the virtual joystick on the bottom-left to move around the map.",
        icon: "🕹️",
    },
    {
        title: "Interacting with NPCs",
        description:
            "Look for NPCs (characters) with special symbols above them:\n\n⚡ Available mission\n✓ Completed mission\n🔒 Locked mission\n\nPress SPACE (desktop) or tap the button (mobile) to talk to them!",
        icon: "💬",
    },
    {
        title: "Understanding Your HUD",
        description:
            "Top-left corner shows:\n👤 Your name and level\n🏆 Badges earned (complete missions)\n💰 Coins collected\n📊 Total score\n\nTop-right has quick access to Quest Log, Shop, and Settings!",
        icon: "📊",
    },
    {
        title: "Completing Missions",
        description:
            "1. Find NPCs with ⚡ symbols\n2. Talk to them to learn about civic topics\n3. Take a quiz to test your knowledge\n4. Earn badges, coins, and points!\n5. Unlock new missions as you progress",
        icon: "🎯",
    },
    {
        title: "Exploration & Collectibles",
        description:
            "Explore the map to find:\n💰 Coins - Currency for the shop\n🏅 Badges - Special achievements\n💎 Treasures - Rare valuable items\n⚡ Power-ups - Boost your abilities\n\nUse the minimap to track your location!",
        icon: "🗺️",
    },
    {
        title: "Level Progression",
        description:
            "Complete all 10 barangay missions to unlock Level 2!\n\n🏘️ Level 1: Barangay Government\n🏛️ Level 2: City Government\n\nEach level teaches you more advanced civic concepts!",
        icon: "⭐",
    },
    {
        title: "Ready to Begin!",
        description:
            "You're all set! Remember:\n\n✓ Learn at your own pace\n✓ Replay missions to improve scores\n✓ Collect all items for achievements\n✓ Have fun while learning!\n\nYou can replay this tutorial anytime from Settings.",
        icon: "🚀",
    },
];

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const currentTutorial = tutorialSteps[currentStep];
    const isLastStep = currentStep === tutorialSteps.length - 1;
    const isFirstStep = currentStep === 0;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn p-4">
            <div className="wooden-frame rounded-lg p-4 sm:p-6 max-w-2xl mx-2 animate-scaleIn max-h-[90vh] overflow-y-auto medieval-scrollbar">
                {/* Metal corners */}
                <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-tl-lg z-10" />
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-tr-lg z-10" />
                <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-bl-lg z-10" />
                <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-br-lg z-10" />

                <div className="parchment-bg rounded-md p-6 sm:p-8 relative">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="text-5xl sm:text-6xl mb-4 animate-bounce-slow">
                            {currentTutorial.icon}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-amber-900 mb-2 game-element-border rounded-md py-2 px-4">
                            {currentTutorial.title}
                        </h2>
                        <div className="flex justify-center gap-2 mt-4">
                            {tutorialSteps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentStep
                                            ? "w-8 bg-amber-600"
                                            : index < currentStep
                                            ? "w-2 bg-green-600"
                                            : "w-2 bg-amber-300"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <p className="text-amber-200 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                            {currentTutorial.description}
                        </p>
                    </div>

                    {/* Step counter */}
                    <div className="text-center text-sm text-amber-700 font-semibold mb-6 game-element-border rounded-md py-1 px-3 inline-block">
                        Step {currentStep + 1} of {tutorialSteps.length}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between mt-6">
                        <button
                            onClick={onSkip}
                            className="px-4 py-2 sm:px-6 sm:py-3 bg-stone-600 hover:bg-stone-700 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-stone-800"
                        >
                            Skip Tutorial
                        </button>

                        <div className="flex gap-3">
                            {!isFirstStep && (
                                <button
                                    onClick={handlePrevious}
                                    className="px-4 py-2 sm:px-6 sm:py-3 game-button-frame text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 game-glow"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    <span className="hidden sm:inline">
                                        Back
                                    </span>
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                className="px-4 py-2 sm:px-6 sm:py-3 game-button-frame text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg game-glow"
                            >
                                {isLastStep ? "✅ Start Playing!" : "Next"}
                                {!isLastStep && (
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

