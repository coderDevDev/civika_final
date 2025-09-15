import { useRef, useState, useEffect } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { MainMenu } from "./components/MainMenu";
import { CharacterCreation } from "./components/CharacterCreation";
import { QuizSystem } from "./components/QuizSystem";
import { MissionSystem } from "./components/MissionSystem";
import { EventBus } from "./game/EventBus";

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [gameInfo, setGameInfo] = useState({
        currentScene: "MainMenu",
        playerName: "",
        badges: 0,
        coins: 0,
    });
    const [showPauseMenu, setShowPauseMenu] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [showQuestLog, setShowQuestLog] = useState(false);
    const [showMainMenu, setShowMainMenu] = useState(true);
    const [showCharacterCreation, setShowCharacterCreation] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showMission, setShowMission] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState<any>(null);
    const [currentMission, setCurrentMission] = useState<any>(null);

    const currentScene = (scene: Phaser.Scene) => {
        console.log("Current scene:", scene.scene.key);
        setGameInfo((prev) => ({
            ...prev,
            currentScene: scene.scene.key,
        }));

        // Update game data from Phaser registry
        if (scene.game && scene.game.registry) {
            const playerName = scene.game.registry.get("playerName") || "";
            const badges = scene.game.registry.get("badges") || [];
            const coins = scene.game.registry.get("coins") || 0;

            setGameInfo((prev) => ({
                ...prev,
                playerName,
                badges: badges.length,
                coins,
            }));
        }

        // Listen for preloader complete event
        if (scene.scene.key === "Preloader") {
            scene.events.on("preloader-complete", () => {
                // Ensure MainMenu is shown when preloader completes
                setShowMainMenu(true);
            });
        }
    };

    // Handle keyboard events for UI
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowPauseMenu(!showPauseMenu);
            } else if (event.key === "i" || event.key === "I") {
                setShowInventory(!showInventory);
            } else if (event.key === "q" || event.key === "Q") {
                setShowQuestLog(!showQuestLog);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [showPauseMenu, showInventory, showQuestLog]);

    // Game flow handlers
    const handleStartGame = () => {
        setShowMainMenu(false);
        setShowCharacterCreation(true);
    };

    const handleCharacterCreated = (name: string, color: string) => {
        console.log("Character created:", name, color);
        setShowCharacterCreation(false);
        setGameInfo((prev) => ({ ...prev, playerName: name }));

        // Wait for Phaser game to be ready, then start BarangayMap
        let retryCount = 0;
        const maxRetries = 50; // 5 seconds max

        const startGameWorld = () => {
            if (phaserRef.current?.game) {
                console.log("Phaser game found, setting registry...");
                phaserRef.current.game.registry.set("playerName", name);
                phaserRef.current.game.registry.set("playerColor", color);

                // Check available scenes
                const availableScenes =
                    phaserRef.current.game.scene.getScenes();
                console.log(
                    "Available scenes:",
                    availableScenes.map((s) => s.scene.key)
                );

                console.log("Starting BarangayMap scene...");
                phaserRef.current.game.scene.start("BarangayMap");
                console.log("BarangayMap scene started successfully");
            } else if (retryCount < maxRetries) {
                retryCount++;
                console.log(
                    `Phaser game still not ready, retrying in 100ms... (${retryCount}/${maxRetries})`
                );
                setTimeout(startGameWorld, 100);
            } else {
                console.log(
                    "Failed to start BarangayMap scene after maximum retries"
                );
            }
        };

        // Start the game world with retry logic
        startGameWorld();
    };

    const handleQuizAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            const currentCoins =
                phaserRef.current?.game?.registry.get("coins") || 0;
            const currentBadges =
                phaserRef.current?.game?.registry.get("badges") || [];
            phaserRef.current?.game?.registry.set("coins", currentCoins + 10);
            phaserRef.current?.game?.registry.set("badges", [
                ...currentBadges,
                "quiz_badge",
            ]);
        }
        setShowQuiz(false);
        setCurrentQuiz(null);
    };

    const handleMissionStart = () => {
        setShowMission(false);
        setShowQuiz(true);
        // Use the current mission's quiz data
        if (currentMission) {
            setCurrentQuiz(getQuizForMission(currentMission.id));
        }
    };

    const getQuizForMission = (missionId: string) => {
        const quizzes = {
            "1": {
                question:
                    "What is the main purpose of waste segregation in the barangay?",
                options: [
                    "To make the area look cleaner",
                    "To reduce environmental pollution and promote recycling",
                    "To save money on garbage collection",
                    "To follow government orders",
                ],
                correctAnswer: 1,
                explanation:
                    "Waste segregation helps reduce environmental pollution, promotes recycling, and creates a healthier community environment.",
            },
            "2": {
                question:
                    "What is the minimum age requirement for voter registration in the Philippines?",
                options: [
                    "16 years old",
                    "17 years old",
                    "18 years old",
                    "21 years old",
                ],
                correctAnswer: 2,
                explanation:
                    "The minimum age for voter registration in the Philippines is 18 years old, as stated in the 1987 Constitution.",
            },
            "3": {
                question:
                    "What is the best way to help elderly residents in your community?",
                options: [
                    "Ignore them and focus on younger people",
                    "Provide assistance with daily tasks and show respect",
                    "Only help during emergencies",
                    "Let their families handle everything",
                ],
                correctAnswer: 1,
                explanation:
                    "Helping elderly residents with daily tasks, showing respect, and maintaining regular contact strengthens community bonds and shows civic responsibility.",
            },
            "4": {
                question: "What is a barangay ordinance?",
                options: [
                    "A national law passed by Congress",
                    "A local law passed by the barangay council",
                    "A rule made by the mayor",
                    "A suggestion from residents",
                ],
                correctAnswer: 1,
                explanation:
                    "A barangay ordinance is a local law passed by the barangay council to address specific needs and issues within the barangay.",
            },
            "5": {
                question:
                    "What is the first step in fact-checking information?",
                options: [
                    "Share it immediately on social media",
                    "Verify the source and check multiple reliable sources",
                    "Ask friends for their opinion",
                    "Assume it's true if it sounds reasonable",
                ],
                correctAnswer: 1,
                explanation:
                    "Fact-checking requires verifying the source and cross-referencing information with multiple reliable and credible sources.",
            },
            "6": {
                question:
                    "What is the primary goal of community infrastructure projects?",
                options: [
                    "To spend government budget",
                    "To improve the quality of life for residents",
                    "To create jobs for politicians",
                    "To make the area look modern",
                ],
                correctAnswer: 1,
                explanation:
                    "Community infrastructure projects aim to improve the quality of life for residents by providing better facilities, services, and living conditions.",
            },
            "7": {
                question:
                    "What is the best approach to resolve community conflicts?",
                options: [
                    "Ignore the problem until it goes away",
                    "Use mediation and peaceful dialogue",
                    "Let the police handle everything",
                    "Take sides and support one party",
                ],
                correctAnswer: 1,
                explanation:
                    "Mediation and peaceful dialogue are the most effective ways to resolve community conflicts while maintaining harmony and understanding.",
            },
            "8": {
                question:
                    "What is the significance of knowing Philippine history for civic engagement?",
                options: [
                    "It's not important for modern civic life",
                    "It helps understand democratic principles and civic responsibilities",
                    "It's only useful for history students",
                    "It's required by law",
                ],
                correctAnswer: 1,
                explanation:
                    "Understanding Philippine history helps citizens appreciate democratic principles, learn from past experiences, and better understand their civic responsibilities.",
            },
            "9": {
                question:
                    "What is the most effective way to promote health in the community?",
                options: [
                    "Only during health emergencies",
                    "Through regular health campaigns and education",
                    "By building more hospitals",
                    "By hiring more doctors",
                ],
                correctAnswer: 1,
                explanation:
                    "Regular health campaigns, education, and preventive measures are the most effective ways to promote community health and wellness.",
            },
            "10": {
                question: "What is the main purpose of barangay meetings?",
                options: [
                    "To socialize with neighbors",
                    "To discuss and decide on community issues",
                    "To collect fees from residents",
                    "To announce new rules",
                ],
                correctAnswer: 1,
                explanation:
                    "Barangay meetings serve as a platform for residents to discuss community issues, participate in decision-making, and exercise democratic participation at the local level.",
            },
        };

        return (
            quizzes[missionId] || {
                question: "What is the primary purpose of a barangay?",
                options: [
                    "To collect taxes",
                    "To provide basic services to residents",
                    "To manage national defense",
                    "To control international trade",
                ],
                correctAnswer: 1,
                explanation:
                    "A barangay is the smallest administrative unit in the Philippines and provides basic services to its residents.",
            }
        );
    };

    // Set up interval to update game data periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (phaserRef.current?.game?.registry) {
                const playerName =
                    phaserRef.current.game.registry.get("playerName") || "";
                const badges =
                    phaserRef.current.game.registry.get("badges") || [];
                const coins = phaserRef.current.game.registry.get("coins") || 0;

                setGameInfo((prev) => ({
                    ...prev,
                    playerName,
                    badges: badges.length,
                    coins,
                }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Listen for mission events from Phaser
    useEffect(() => {
        const handleShowMission = (data: any) => {
            console.log("Mission event received:", data);
            setCurrentMission(data.mission);
            setShowMission(true);
        };

        // Listen for the show-mission event using EventBus
        EventBus.on("show-mission", handleShowMission);

        return () => {
            EventBus.off("show-mission", handleShowMission);
        };
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-sky-300 via-blue-200 to-green-300">
            {/* React UI Components */}
            {showMainMenu && <MainMenu onStartGame={handleStartGame} />}
            {showCharacterCreation && (
                <div>
                    <div className="fixed top-4 left-4 bg-red-500 text-white p-2 rounded z-50">
                        Character Creation Active:{" "}
                        {showCharacterCreation.toString()}
                    </div>
                    <CharacterCreation
                        onCharacterCreated={handleCharacterCreated}
                    />
                </div>
            )}
            {showQuiz && currentQuiz && (
                <QuizSystem
                    question={currentQuiz}
                    onAnswer={handleQuizAnswer}
                    onClose={() => setShowQuiz(false)}
                />
            )}
            {showMission && currentMission && (
                <MissionSystem
                    mission={currentMission}
                    onStartQuiz={handleMissionStart}
                    onClose={() => setShowMission(false)}
                />
            )}

            {/* Phaser Game Canvas - Show when in game world */}
            {!showMainMenu && !showCharacterCreation && (
                <div className="flex items-center justify-center min-h-screen">
                    <div id="game-container" className="relative">
                        <PhaserGame
                            ref={phaserRef}
                            currentActiveScene={currentScene}
                        />
                    </div>
                </div>
            )}

            {/* React Overlay UI - Positioned above Phaser canvas */}
            {!showMainMenu &&
                !showCharacterCreation &&
                !showQuiz &&
                !showMission && (
                    <div
                        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                        style={{ zIndex: 10 }}
                    >
                        {/* HUD - Top Left */}
                        <div className="absolute top-4 left-4 pointer-events-auto">
                            <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white shadow-2xl border border-white/20">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-blue-300">
                                        Scene: {gameInfo.currentScene}
                                    </div>
                                    <div className="text-lg font-bold text-yellow-400">
                                        {gameInfo.playerName || "Citizen"}
                                    </div>
                                    <div className="flex space-x-4 text-sm">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                            <span>
                                                Badges: {gameInfo.badges}/10
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span>Coins: {gameInfo.coins}</span>
                                        </div>
                                    </div>
                                    {/* Debug button */}
                                    <button
                                        onClick={() => {
                                            console.log(
                                                "Manual BarangayMap start..."
                                            );
                                            if (phaserRef.current?.game) {
                                                phaserRef.current.game.scene.start(
                                                    "BarangayMap"
                                                );
                                            }
                                        }}
                                        className="mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded"
                                    >
                                        Start BarangayMap
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions - Top Right */}
                        <div className="absolute top-4 right-4 pointer-events-auto">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() =>
                                        setShowQuestLog(!showQuestLog)
                                    }
                                    className="bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-blue-400/50 shadow-lg"
                                >
                                    📋 Quest Log
                                </button>
                                <button
                                    onClick={() =>
                                        setShowInventory(!showInventory)
                                    }
                                    className="bg-purple-600/80 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-purple-400/50 shadow-lg"
                                >
                                    🎒 Inventory
                                </button>
                                <button
                                    onClick={() =>
                                        setShowPauseMenu(!showPauseMenu)
                                    }
                                    className="bg-gray-600/80 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-400/50 shadow-lg"
                                >
                                    ⏸️ Menu
                                </button>
                            </div>
                        </div>

                        {/* Pause Menu Overlay */}
                        {showPauseMenu && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
                                <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20 shadow-2xl">
                                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                                        Game Menu
                                    </h2>
                                    <div className="space-y-4">
                                        <button
                                            onClick={() =>
                                                setShowPauseMenu(false)
                                            }
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium"
                                        >
                                            Resume Game
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowQuestLog(true)
                                            }
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium"
                                        >
                                            Quest Log
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowInventory(true)
                                            }
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium"
                                        >
                                            Inventory
                                        </button>
                                        <button
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium"
                                        >
                                            Restart Game
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quest Log Overlay */}
                        {showQuestLog && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
                                <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4 border border-white/20 shadow-2xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-white">
                                            Quest Log
                                        </h2>
                                        <button
                                            onClick={() =>
                                                setShowQuestLog(false)
                                            }
                                            className="text-gray-400 hover:text-white text-2xl"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-blue-600/20 border border-blue-400/50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-blue-300 mb-2">
                                                Main Objective
                                            </h3>
                                            <p className="text-white/80">
                                                Complete 10 civic missions to
                                                unlock the next area
                                            </p>
                                        </div>
                                        <div className="bg-green-600/20 border border-green-400/50 rounded-lg p-4">
                                            <h3 className="text-lg font-semibold text-green-300 mb-2">
                                                Progress
                                            </h3>
                                            <p className="text-white/80">
                                                Badges Collected:{" "}
                                                {gameInfo.badges}
                                                /10
                                            </p>
                                            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-green-400 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${
                                                            (gameInfo.badges /
                                                                10) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Inventory Overlay */}
                        {showInventory && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
                                <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4 border border-white/20 shadow-2xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-white">
                                            Inventory
                                        </h2>
                                        <button
                                            onClick={() =>
                                                setShowInventory(false)
                                            }
                                            className="text-gray-400 hover:text-white text-2xl"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="bg-yellow-600/20 border border-yellow-400/50 rounded-lg p-4 text-center">
                                            <div className="text-2xl mb-2">
                                                💰
                                            </div>
                                            <div className="text-yellow-300 font-bold">
                                                {gameInfo.coins}
                                            </div>
                                            <div className="text-xs text-white/60">
                                                Coins
                                            </div>
                                        </div>
                                        <div className="bg-blue-600/20 border border-blue-400/50 rounded-lg p-4 text-center">
                                            <div className="text-2xl mb-2">
                                                🏆
                                            </div>
                                            <div className="text-blue-300 font-bold">
                                                {gameInfo.badges}
                                            </div>
                                            <div className="text-xs text-white/60">
                                                Badges
                                            </div>
                                        </div>
                                        <div className="bg-gray-600/20 border border-gray-400/50 rounded-lg p-4 text-center">
                                            <div className="text-2xl mb-2">
                                                📜
                                            </div>
                                            <div className="text-gray-300 font-bold">
                                                0
                                            </div>
                                            <div className="text-xs text-white/60">
                                                Items
                                            </div>
                                        </div>
                                        <div className="bg-green-600/20 border border-green-400/50 rounded-lg p-4 text-center">
                                            <div className="text-2xl mb-2">
                                                ⭐
                                            </div>
                                            <div className="text-green-300 font-bold">
                                                0
                                            </div>
                                            <div className="text-xs text-white/60">
                                                XP
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
}

export default App;
