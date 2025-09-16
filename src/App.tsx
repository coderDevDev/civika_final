import { useRef, useState, useEffect } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { MainMenu } from "./components/MainMenu";
import { CharacterCreation } from "./components/CharacterCreation";
import { QuizSystem } from "./components/QuizSystem";
import { MissionSystem } from "./components/MissionSystem";
import { VirtualJoystick } from "./components/VirtualJoystick";
import { MobileInteractionButton } from "./components/MobileInteractionButton";
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
    const [isMobile, setIsMobile] = useState(false);
    const [joystickDirection, setJoystickDirection] = useState({ x: 0, y: 0 });

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

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            const mobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                ) ||
                window.innerWidth <= 768 ||
                "ontouchstart" in window;
            setIsMobile(mobile);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

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

    // Send joystick input to Phaser game
    useEffect(() => {
        if (phaserRef.current?.game && isMobile) {
            // Send joystick direction to Phaser game
            phaserRef.current.game.registry.set(
                "joystickDirection",
                joystickDirection
            );
        }
    }, [joystickDirection, isMobile]);

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
                <div className="w-full h-full flex items-center justify-center">
                    <div
                        id="game-container"
                        className="relative w-full h-full max-w-full max-h-full"
                    >
                        <PhaserGame
                            ref={phaserRef}
                            currentActiveScene={currentScene}
                        />
                    </div>
                </div>
            )}

            {/* Mobile Controls - React Overlay */}
            {isMobile &&
                !showMainMenu &&
                !showCharacterCreation &&
                !showQuiz &&
                !showMission && (
                    <>
                        <VirtualJoystick
                            onMove={(direction) =>
                                setJoystickDirection(direction)
                            }
                            onStop={() => setJoystickDirection({ x: 0, y: 0 })}
                            isVisible={true}
                        />
                        <MobileInteractionButton
                            onInteract={() => {
                                // Trigger interaction in Phaser game
                                if (phaserRef.current?.game) {
                                    phaserRef.current.game.events.emit(
                                        "mobile-interact"
                                    );
                                }
                            }}
                            isVisible={true}
                        />
                    </>
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
                        {/* HUD - Top Left - Compact */}
                        <div className="absolute top-2 left-2 pointer-events-auto">
                            <div className="flex space-x-1">
                                {/* Player Name */}
                                <div className="text-xs font-bold text-amber-800 game-element-border rounded px-1 py-0.5 text-center">
                                    👤 {gameInfo.playerName || "Citizen"}
                                </div>

                                {/* Badges */}
                                <div className="text-xs font-bold text-amber-800 game-element-border rounded px-1 py-0.5 text-center">
                                    🏆 {gameInfo.badges}/10
                                </div>

                                {/* Coins */}
                                <div className="text-xs font-bold text-amber-800 game-element-border rounded px-1 py-0.5 text-center">
                                    💰 {gameInfo.coins}
                                </div>

                                {/* Debug button - hidden on mobile */}
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
                                    className="hidden md:block text-xs font-bold text-amber-800 game-element-border rounded px-1 py-0.5 text-center hover:bg-red-600 hover:text-white transition-all duration-200"
                                >
                                    🔧
                                </button>
                            </div>
                        </div>

                        {/* Quick Actions - Top Right */}
                        <div className="absolute top-2 right-2 pointer-events-auto">
                            <div className="flex space-x-1">
                                <button
                                    onClick={() =>
                                        setShowQuestLog(!showQuestLog)
                                    }
                                    className="game-button-frame px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 game-glow"
                                >
                                    <div className="text-white font-bold text-xs flex items-center space-x-1">
                                        <span>📋</span>
                                        <span className="hidden sm:inline">
                                            Quest
                                        </span>
                                    </div>
                                </button>
                                <button
                                    onClick={() =>
                                        setShowInventory(!showInventory)
                                    }
                                    className="game-button-frame px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 game-glow"
                                >
                                    <div className="text-white font-bold text-xs flex items-center space-x-1">
                                        <span>🎒</span>
                                        <span className="hidden sm:inline">
                                            Items
                                        </span>
                                    </div>
                                </button>
                                <button
                                    onClick={() =>
                                        setShowPauseMenu(!showPauseMenu)
                                    }
                                    className="game-button-frame px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 game-glow"
                                >
                                    <div className="text-white font-bold text-xs flex items-center space-x-1">
                                        <span>⏸️</span>
                                        <span className="hidden sm:inline">
                                            Menu
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Pause Menu Overlay */}
                        {showPauseMenu && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
                                <div className="wooden-frame rounded-lg p-6 max-w-md w-full mx-4">
                                    {/* Metal corners */}
                                    <div className="absolute -top-2 -left-2 w-6 h-6 metal-corner rounded-tl-lg z-10" />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 metal-corner rounded-tr-lg z-10" />
                                    <div className="absolute -bottom-2 -left-2 w-6 h-6 metal-corner rounded-bl-lg z-10" />
                                    <div className="absolute -bottom-2 -right-2 w-6 h-6 metal-corner rounded-br-lg z-10" />

                                    {/* Parchment content */}
                                    <div className="parchment-bg rounded-md p-6 relative">
                                        <button
                                            onClick={() =>
                                                setShowPauseMenu(false)
                                            }
                                            className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20"
                                        >
                                            ✕
                                        </button>

                                        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center game-element-border rounded-md py-2 px-4">
                                            ⚔️ Game Menu
                                        </h2>
                                        <div className="space-y-4">
                                            <button
                                                onClick={() =>
                                                    setShowPauseMenu(false)
                                                }
                                                className="w-full game-button-frame py-3 px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-2">
                                                    <span>▶️</span>
                                                    <span>Resume Game</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setShowQuestLog(true)
                                                }
                                                className="w-full game-button-frame py-3 px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-2">
                                                    <span>📋</span>
                                                    <span>Quest Log</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setShowInventory(true)
                                                }
                                                className="w-full game-button-frame py-3 px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-2">
                                                    <span>🎒</span>
                                                    <span>Inventory</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    window.location.reload()
                                                }
                                                className="w-full game-button-frame py-3 px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-2">
                                                    <span>🔄</span>
                                                    <span>Restart Game</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quest Log Overlay */}
                        {showQuestLog && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
                                <div className="wooden-frame rounded-lg p-6 max-w-2xl w-full mx-4 medieval-scrollbar">
                                    {/* Metal corners */}
                                    <div className="absolute -top-2 -left-2 w-6 h-6 metal-corner rounded-tl-lg z-10" />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 metal-corner rounded-tr-lg z-10" />
                                    <div className="absolute -bottom-2 -left-2 w-6 h-6 metal-corner rounded-bl-lg z-10" />
                                    <div className="absolute -bottom-2 -right-2 w-6 h-6 metal-corner rounded-br-lg z-10" />

                                    {/* Parchment content */}
                                    <div className="parchment-bg rounded-md p-6 relative">
                                        <button
                                            onClick={() =>
                                                setShowQuestLog(false)
                                            }
                                            className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20"
                                        >
                                            ✕
                                        </button>

                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-amber-900 game-element-border rounded-md py-2 px-4">
                                                📋 Quest Log
                                            </h2>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="game-element-border rounded-lg p-4">
                                                <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center space-x-2">
                                                    <span>🎯</span>
                                                    <span>Main Objective</span>
                                                </h3>
                                                <p className="text-amber-700">
                                                    Complete 10 civic missions
                                                    to unlock the next area and
                                                    become a true community
                                                    leader!
                                                </p>
                                            </div>
                                            <div className="game-element-border rounded-lg p-4">
                                                <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center space-x-2">
                                                    <span>📊</span>
                                                    <span>Progress</span>
                                                </h3>
                                                <p className="text-amber-700 mb-3">
                                                    Badges Collected:{" "}
                                                    <span className="font-bold text-green-600">
                                                        {gameInfo.badges}
                                                    </span>
                                                    /10
                                                </p>
                                                <div className="w-full bg-amber-200 rounded-full h-3 border-2 border-amber-400">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300 border border-green-700"
                                                        style={{
                                                            width: `${
                                                                (gameInfo.badges /
                                                                    10) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="text-center mt-2 text-sm text-amber-600">
                                                    {Math.round(
                                                        (gameInfo.badges / 10) *
                                                            100
                                                    )}
                                                    % Complete
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Inventory Overlay */}
                        {showInventory && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
                                <div className="wooden-frame rounded-lg p-6 max-w-2xl w-full mx-4">
                                    {/* Metal corners */}
                                    <div className="absolute -top-2 -left-2 w-6 h-6 metal-corner rounded-tl-lg z-10" />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 metal-corner rounded-tr-lg z-10" />
                                    <div className="absolute -bottom-2 -left-2 w-6 h-6 metal-corner rounded-bl-lg z-10" />
                                    <div className="absolute -bottom-2 -right-2 w-6 h-6 metal-corner rounded-br-lg z-10" />

                                    {/* Parchment content */}
                                    <div className="parchment-bg rounded-md p-6 relative">
                                        <button
                                            onClick={() =>
                                                setShowInventory(false)
                                            }
                                            className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20"
                                        >
                                            ✕
                                        </button>

                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-2xl font-bold text-amber-900 game-element-border rounded-md py-2 px-4">
                                                🎒 Inventory
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="game-element-border rounded-lg p-4 text-center">
                                                <div className="text-3xl mb-2">
                                                    💰
                                                </div>
                                                <div className="text-amber-800 font-bold text-xl">
                                                    {gameInfo.coins}
                                                </div>
                                                <div className="text-sm text-amber-600 font-semibold">
                                                    Gold Coins
                                                </div>
                                            </div>
                                            <div className="game-element-border rounded-lg p-4 text-center">
                                                <div className="text-3xl mb-2">
                                                    🏆
                                                </div>
                                                <div className="text-amber-800 font-bold text-xl">
                                                    {gameInfo.badges}
                                                </div>
                                                <div className="text-sm text-amber-600 font-semibold">
                                                    Achievement Badges
                                                </div>
                                            </div>
                                            <div className="game-element-border rounded-lg p-4 text-center">
                                                <div className="text-3xl mb-2">
                                                    📜
                                                </div>
                                                <div className="text-amber-800 font-bold text-xl">
                                                    0
                                                </div>
                                                <div className="text-sm text-amber-600 font-semibold">
                                                    Quest Items
                                                </div>
                                            </div>
                                            <div className="game-element-border rounded-lg p-4 text-center">
                                                <div className="text-3xl mb-2">
                                                    ⭐
                                                </div>
                                                <div className="text-amber-800 font-bold text-xl">
                                                    0
                                                </div>
                                                <div className="text-sm text-amber-600 font-semibold">
                                                    Experience Points
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 p-4 game-element-border rounded-lg">
                                            <h3 className="text-lg font-bold text-amber-800 mb-2 text-center">
                                                📈 Character Stats
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="text-center">
                                                    <div className="text-amber-700 font-semibold">
                                                        Level
                                                    </div>
                                                    <div className="text-amber-800 font-bold">
                                                        1
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-amber-700 font-semibold">
                                                        Reputation
                                                    </div>
                                                    <div className="text-amber-800 font-bold">
                                                        Novice
                                                    </div>
                                                </div>
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
