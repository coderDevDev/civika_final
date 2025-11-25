import { useRef, useState, useEffect } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { MainMenu } from "./components/MainMenu";
import { CharacterCreation } from "./components/CharacterCreation";
import { QuizSystem } from "./components/QuizSystem";
import { MissionSystem } from "./components/MissionSystem";
import { VirtualJoystick } from "./components/VirtualJoystick";
import { MobileInteractionButton } from "./components/MobileInteractionButton";
import { GameDebugPanel } from "./components/GameDebugPanel";
import { Settings } from "./components/Settings";
import { Extras } from "./components/Extras";
import { Credits } from "./components/Credits";
import { Leaderboard } from "./components/Leaderboard";
import { Shop } from "./components/Shop";
import { DailyChallenges } from "./components/DailyChallenges";
import { SecretQuests } from "./components/SecretQuests";
import { CollisionEditor } from "./components/CollisionEditor";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { LandscapePrompt } from "./components/LandscapePrompt";
import { LoadingScreen } from "./components/LoadingScreen";
import { Tutorial } from "./components/Tutorial";
import {
    GameNotification,
    NotificationData,
} from "./components/GameNotification";
import { EventBus } from "./game/EventBus";
import { GameStateManager } from "./utils/GameStateManager";
import { GameProgress } from "./utils/GameValidation";
import { audioManager } from "./utils/AudioManager";
import LeaderboardService from "./services/LeaderboardService";
import ShopService from "./services/ShopService";
import SecretQuestService from "./services/SecretQuestService";

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const gameStateManager = useRef(GameStateManager.getInstance());
    const [gameInfo, setGameInfo] = useState({
        currentScene: "MainMenu",
        playerName: "",
        badges: 0,
        coins: 0,
        totalScore: 0,
        accuracy: "0%",
        level: 1,
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
    const [notification, setNotification] = useState<NotificationData | null>(
        null
    );
    const [showNotification, setShowNotification] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showExtras, setShowExtras] = useState(false);
    const [showCredits, setShowCredits] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [showDailyChallenges, setShowDailyChallenges] = useState(false);
    const [showSecretQuests, setShowSecretQuests] = useState(false);
    const [showCollisionEditor, setShowCollisionEditor] = useState(false);
    const [currentMapForEditor, setCurrentMapForEditor] = useState<
        "BarangayMap" | "CityMap"
    >("BarangayMap");
    const leaderboardService = useRef(LeaderboardService.getInstance());
    const shopService = useRef(ShopService.getInstance());
    const secretQuestService = useRef(SecretQuestService.getInstance());
    
    // New feature states
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);
    
    // Developer/Testing Mode - allows bypassing level requirements
    const [developerMode, setDeveloperMode] = useState(false);

    const currentScene = (scene: Phaser.Scene) => {
        console.log("Current scene:", scene.scene.key);
        setGameInfo((prev) => ({
            ...prev,
            currentScene: scene.scene.key,
        }));

        // Track current map for collision editor
        if (
            scene.scene.key === "BarangayMap" ||
            scene.scene.key === "CityMap"
        ) {
            setCurrentMapForEditor(
                scene.scene.key as "BarangayMap" | "CityMap"
            );
        }

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

    // Initialize audio manager
    useEffect(() => {
        const initAudio = async () => {
            try {
                await audioManager.initialize();
                audioManager.playLevelMusic("MainMenu");
            } catch (error) {
                console.warn("Audio initialization failed:", error);
            }
        };

        // Initialize audio on first user interaction
        const handleFirstInteraction = () => {
            initAudio();
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);
        };

        document.addEventListener("click", handleFirstInteraction);
        document.addEventListener("keydown", handleFirstInteraction);

        return () => {
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);
        };
    }, []);

    // Simulate loading screen with progress
    useEffect(() => {
        // Simulate asset loading progress
        const progressInterval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                // Random progress increment for realistic loading feel
                return Math.min(prev + Math.random() * 15 + 5, 100);
            });
        }, 200);

        // Minimum loading time of 2 seconds for UX
        const minLoadTime = setTimeout(() => {
            setLoadingProgress(100);
        }, 2000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(minLoadTime);
        };
    }, []);

    // Handle loading complete
    const handleLoadingComplete = () => {
        setIsLoading(false);
        // Check if user has seen tutorial before
        const hasSeenTutorial = localStorage.getItem("civika-hasSeenTutorial");
        if (!hasSeenTutorial && !showTutorial) {
            // Don't show tutorial immediately, wait for character creation
            console.log("First-time player detected - tutorial will show after character creation");
        }
    };

    // Game flow handlers
    const handleStartGame = () => {
        audioManager.playEffect("button-click");
        // Don't start level music here - wait until character is created and scene starts
        setShowMainMenu(false);
        setShowCharacterCreation(true);
    };

    const handleLoadGame = () => {
        audioManager.playEffect("button-click");
        const savedProgress = localStorage.getItem("civika-game-progress");
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                const playerName = progress.playerName || "Citizen";
                handleCharacterCreated(playerName, "male"); // Default gender
            } catch (error) {
                console.error("Failed to load game:", error);
                alert("Failed to load saved game. Please start a new game.");
            }
        } else {
            alert("No saved game found! Start a new game first.");
        }
    };

    const handleShowSettings = () => {
        audioManager.playEffect("menu-open");
        setShowSettings(true);
    };

    const handleShowExtras = () => {
        audioManager.playEffect("menu-open");
        setShowExtras(true);
    };

    const handleShowCredits = () => {
        audioManager.playEffect("menu-open");
        setShowCredits(true);
    };

    const handleShowLeaderboard = () => {
        audioManager.playEffect("menu-open");
        setShowLeaderboard(true);
    };

    const handleShowTutorial = () => {
        audioManager.playEffect("menu-open");
        setShowTutorial(true);
    };

    const handleExit = () => {
        audioManager.playEffect("button-click");
        // Exit functionality is handled in MainMenu component
    };

    const handleCharacterCreated = (name: string, gender: string) => {
        console.log("Character created:", name, gender);
        setShowCharacterCreation(false);

        // Check if first-time player and show tutorial
        const hasSeenTutorial = localStorage.getItem("civika-hasSeenTutorial");
        if (!hasSeenTutorial) {
            setShowTutorial(true);
            return; // Wait for tutorial to complete before starting game
        }

        // Stop any current music to ensure clean transition
        audioManager.stopMusic();

        // Initialize game state with validation
        const progress = gameStateManager.current.initializeGame(name);
        updateGameInfoFromProgress(progress);

        // Show welcome notification for new players
        if (progress.completedMissions.length === 0) {
            setTimeout(() => {
                showGameNotification({
                    type: "info",
                    title: `Welcome to CIVIKA, ${name}! 👋`,
                    message: `Welcome to the barangay! You're about to embark on an exciting journey to become a civic leader. Look for NPCs with "!" symbols to start missions and learn about community governance. Good luck!`,
                    icon: "🏛️",
                    actions: [
                        {
                            label: "Start My Journey!",
                            action: closeNotification,
                            style: "primary",
                        },
                    ],
                });
            }, 2000); // Show after game world loads
        }

        // Wait for Phaser game to be ready, then start the appropriate scene based on level
        let retryCount = 0;
        const maxRetries = 50; // 5 seconds max

        const startGameWorld = () => {
            if (phaserRef.current?.game) {
                console.log("Phaser game found, setting registry...");
                phaserRef.current.game.registry.set("playerName", name);
                phaserRef.current.game.registry.set("playerGender", gender);

                // Sync game state with Phaser registry
                syncGameStateWithPhaser(progress);

                // Check available scenes
                const availableScenes =
                    phaserRef.current.game.scene.getScenes();
                console.log(
                    "Available scenes:",
                    availableScenes.map((s) => s.scene.key)
                );

                // Determine which scene to start based on player level
                const startScene =
                    progress.level >= 2 ? "CityMap" : "BarangayMap";
                console.log(
                    `Starting ${startScene} scene for Level ${progress.level}...`
                );

                // Play level-specific music
                audioManager.crossfadeToLevel(
                    startScene as "BarangayMap" | "CityMap"
                );

                phaserRef.current.game.scene.start(startScene);
                console.log(`${startScene} scene started successfully`);

                // Show Level 2 welcome message if player is returning to city
                if (
                    progress.level >= 2 &&
                    progress.completedMissions.length >= 10
                ) {
                    setTimeout(() => {
                        showGameNotification({
                            type: "info",
                            title: `Welcome to City Hall, ${name}! 🏛️`,
                            message: `Welcome back to the municipal government! You've proven yourself as a capable barangay leader and are now ready for city-level challenges. The mayor and city officials are waiting for your expertise in municipal governance. Good luck with your advanced civic missions!`,
                            icon: "🏢",
                            actions: [
                                {
                                    label: "Begin City Service!",
                                    action: closeNotification,
                                    style: "primary",
                                },
                            ],
                        });
                    }, 3000); // Show after scene loads
                }
            } else if (retryCount < maxRetries) {
                retryCount++;
                console.log(
                    `Phaser game still not ready, retrying in 100ms... (${retryCount}/${maxRetries})`
                );
                setTimeout(startGameWorld, 100);
            } else {
                console.log("Failed to start game scene after maximum retries");
            }
        };

        // Start the game world with retry logic
        startGameWorld();
    };

    // Tutorial handlers
    const handleTutorialComplete = () => {
        console.log("Tutorial completed");
        setShowTutorial(false);
        localStorage.setItem("civika-hasSeenTutorial", "true");
        
        // Now proceed with game initialization
        const savedProgress = localStorage.getItem("civika-game-progress");
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                const playerName = progress.playerName || "Citizen";
                // Re-trigger character creation flow but skip tutorial check
                audioManager.stopMusic();
                const updatedProgress = gameStateManager.current.initializeGame(playerName);
                updateGameInfoFromProgress(updatedProgress);
                startGameAfterTutorial(playerName, "default");
            } catch (error) {
                console.error("Failed to load after tutorial:", error);
            }
        }
    };

    const handleTutorialSkip = () => {
        console.log("Tutorial skipped");
        setShowTutorial(false);
        localStorage.setItem("civika-hasSeenTutorial", "true");
        
        // Proceed with game initialization
        const savedProgress = localStorage.getItem("civika-game-progress");
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                const playerName = progress.playerName || "Citizen";
                audioManager.stopMusic();
                const updatedProgress = gameStateManager.current.initializeGame(playerName);
                updateGameInfoFromProgress(updatedProgress);
                startGameAfterTutorial(playerName, "default");
            } catch (error) {
                console.error("Failed to load after skipping tutorial:", error);
            }
        }
    };

    const startGameAfterTutorial = (name: string, color: string) => {
        const progress = gameStateManager.current.getProgress();
        if (!progress) return;

        // Show welcome notification for new players
        if (progress.completedMissions.length === 0) {
            setTimeout(() => {
                showGameNotification({
                    type: "info",
                    title: `Welcome to CIVIKA, ${name}! 👋`,
                    message: `Welcome to the barangay! You're about to embark on an exciting journey to become a civic leader. Look for NPCs with "!" symbols to start missions and learn about community governance. Good luck!`,
                    icon: "🏛️",
                    actions: [
                        {
                            label: "Start My Journey!",
                            action: closeNotification,
                            style: "primary",
                        },
                    ],
                });
            }, 2000);
        }

        // Start game world
        let retryCount = 0;
        const maxRetries = 50;

        const startGameWorld = () => {
            if (phaserRef.current?.game) {
                phaserRef.current.game.registry.set("playerName", name);
                phaserRef.current.game.registry.set("playerGender", gender);
                syncGameStateWithPhaser(progress);

                const startScene = progress.level >= 2 ? "CityMap" : "BarangayMap";
                audioManager.crossfadeToLevel(startScene as "BarangayMap" | "CityMap");
                phaserRef.current.game.scene.start(startScene);
            } else if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(startGameWorld, 100);
            }
        };

        startGameWorld();
    };

    const handleQuizAnswer = (isCorrect: boolean) => {
        if (currentMission && currentQuiz) {
            try {
                const missionId = parseInt(currentMission.id);
                const selectedAnswer = isCorrect
                    ? currentQuiz.correctAnswer
                    : (currentQuiz.correctAnswer + 1) %
                      currentQuiz.options.length;

                // Submit answer through game state manager
                const { result, updated } =
                    gameStateManager.current.submitQuizAnswer(
                        missionId,
                        selectedAnswer,
                        currentQuiz.correctAnswer
                    );

                console.log("Quiz submission result:", { result, updated });

                // Update UI with new progress
                const progress = gameStateManager.current.getProgress();
                if (progress) {
                    updateGameInfoFromProgress(progress);
                    syncGameStateWithPhaser(progress);

                    // Update NPC indicators in real-time for active scene
                    if (phaserRef.current?.game) {
                        const activeScenes =
                            phaserRef.current.game.scene.getScenes(true);
                        activeScenes.forEach((scene: any) => {
                            if (
                                scene.updateNPCIndicators &&
                                (scene.scene.key === "BarangayMap" ||
                                    scene.scene.key === "CityMap")
                            ) {
                                scene.updateNPCIndicators();
                            }
                        });
                    }
                }

                // Record speed challenge if answer is correct
                if (isCorrect && result.timeSpent) {
                    gameStateManager.current.recordSpeedChallenge(
                        result.timeSpent
                    );

                    // Check for speed achievements
                    const speedAchievements =
                        gameStateManager.current.checkSpeedAchievements();
                    if (speedAchievements.length > 0) {
                        console.log(
                            "Speed achievements earned:",
                            speedAchievements
                        );
                    }

                    // Update daily challenge progress for speed
                    if (result.timeSpent <= 10) {
                        shopService.current.updateChallengeProgress(
                            "excellent quiz",
                            1
                        );
                    }
                }

                // Show result feedback with notifications
                if (updated) {
                    console.log(`Mission ${missionId} completed successfully!`);
                    const progress = gameStateManager.current.getProgress();
                    if (progress) {
                        const mission = currentMission;
                        // Define reward coins for both Level 1 and Level 2 missions
                        const allRewardCoins = [
                            // Level 1 (missions 1-10)
                            20, 15, 25, 30, 35, 25, 40, 45, 35, 50,
                            // Level 2 (missions 11-20)
                            40, 45, 50, 55, 60, 50, 65, 70, 60, 80,
                        ];
                        const rewardCoins = allRewardCoins[missionId - 1] || 0;
                        const leveledUp = progress.level > gameInfo.level;

                        if (leveledUp) {
                            // Play level up sound effect
                            audioManager.playEffect("level-up");

                            // Show level up notification and transition to new scene
                            setTimeout(() => {
                                showGameNotification({
                                    type: "success",
                                    title: "LEVEL UP! 🌟",
                                    message: `Amazing! You've reached Level ${
                                        progress.level
                                    }! ${
                                        progress.level === 2
                                            ? "You've mastered barangay governance and are now ready for city-level challenges! Welcome to municipal government!"
                                            : "You've completed all missions with excellent accuracy and are ready for the next area. Great job, civic leader!"
                                    }`,
                                    icon: "🏛️",
                                    actions: [
                                        {
                                            label:
                                                progress.level === 2
                                                    ? "Enter City Hall!"
                                                    : "Continue!",
                                            action: () => {
                                                closeNotification();
                                                // Transition to appropriate scene based on new level
                                                if (
                                                    phaserRef.current?.game &&
                                                    progress.level === 2
                                                ) {
                                                    console.log(
                                                        "Transitioning to CityMap for Level 2..."
                                                    );
                                                    audioManager.crossfadeToLevel(
                                                        "CityMap"
                                                    );
                                                    phaserRef.current.game.scene.start(
                                                        "CityMap"
                                                    );
                                                }
                                            },
                                            style: "primary",
                                        },
                                    ],
                                });
                            }, 2000); // Show after mission completion notification
                        }

                        // Play mission completion sounds
                        audioManager.playEffect("mission-complete");
                        audioManager.playEffect("badge-earned");
                        audioManager.playEffect("coin-collect");

                        // Submit score to leaderboard
                        leaderboardService.current.submitScore(progress);

                        // Update daily challenge progress for missions
                        shopService.current.updateChallengeProgress(
                            "missions",
                            1
                        );

                        showGameNotification({
                            type: "success",
                            title: "Mission Completed! 🎉",
                            message: `Congratulations! You've completed "${
                                mission?.title
                            }" and earned the "${
                                progress.badges[progress.badges.length - 1]
                            }" badge! You received ${rewardCoins} coins and ${
                                result.points + 100
                            } points!`,
                            icon: "🏆",
                            actions: [
                                {
                                    label: "Continue Playing",
                                    action: closeNotification,
                                    style: "primary",
                                },
                            ],
                        });
                    }
                } else if (!result.isCorrect) {
                    console.log(
                        `Quiz failed for mission ${missionId}. Try again!`
                    );

                    // Play quiz wrong sound effect
                    audioManager.playEffect("quiz-wrong");

                    showGameNotification({
                        type: "warning",
                        title: "Quiz Failed",
                        message: `Oops! That wasn't the correct answer. Don't worry, you can try again! Study the mission information and give it another shot.`,
                        icon: "📚",
                        actions: [
                            {
                                label: "Try Again",
                                action: closeNotification,
                                style: "secondary",
                            },
                        ],
                    });
                } else {
                    // Correct answer but mission not completed (shouldn't happen in current logic)
                    audioManager.playEffect("quiz-correct");
                }
            } catch (error) {
                console.error("Error handling quiz answer:", error);
            }
        }

        setShowQuiz(false);
        setCurrentQuiz(null);
    };

    const handleMissionStart = () => {
        if (currentMission) {
            const missionId = parseInt(currentMission.id);

            // Check if mission is accessible
            if (!gameStateManager.current.canAccessMission(missionId)) {
                console.warn(`Mission ${missionId} is not accessible yet`);
                return;
            }

            // Check if mission is already completed
            if (gameStateManager.current.isMissionCompleted(missionId)) {
                console.log(`Mission ${missionId} is already completed`);
                setShowMission(false);
                return;
            }

            // Start quiz tracking
            gameStateManager.current.startQuiz(missionId);

            setShowMission(false);
            setShowQuiz(true);
            setCurrentQuiz(getQuizForMission(currentMission.id));

            // Play quiz start music
            audioManager.crossfadeToLevel("Quiz");
        }
    };

    const getQuizForMission = (missionId: string) => {
        // Progressive quiz system: Mission N has N questions
        const progressiveQuizzes = {
            // Mission 1: 1 question
            "1": [
                {
                    question: "Which of the following is classified as biodegradable waste?",
                    options: [
                        "Plastic bottle",
                        "Banana peel",
                        "Aluminum can",
                        "Glass jar",
                    ],
                    correctAnswer: 1,
                    explanation: "Banana peel is biodegradable waste that can decompose naturally and be composted.",
                }
            ],
            // Mission 2: 2 questions
            "2": [
                {
                    question: "What is the minimum age to register and vote in the Philippines?",
                    options: ["16", "17", "18", "21"],
                    correctAnswer: 2,
                    explanation: "The minimum age for voter registration in the Philippines is 18 years old.",
                },
                {
                    question: "What document is required for voter registration?",
                    options: [
                        "Birth Certificate",
                        "Valid ID with photo and address",
                        "Passport only",
                        "Driver's license only",
                    ],
                    correctAnswer: 1,
                    explanation: "A valid ID with photo and address is required for voter registration.",
                }
            ],
            // Mission 3: 3 questions
            "3": [
                {
                    question: "What is the main duty of a Barangay Captain?",
                    options: [
                        "Clean streets",
                        "Approve national laws",
                        "Lead barangay governance and implement ordinances",
                        "Collect taxes for the BIR",
                    ],
                    correctAnswer: 2,
                    explanation: "The Barangay Captain leads barangay governance and implements local ordinances.",
                },
                {
                    question: "Who assists the Barangay Captain in governance?",
                    options: [
                        "Barangay Kagawads",
                        "City Mayor",
                        "Police Chief",
                        "School Principal",
                    ],
                    correctAnswer: 0,
                    explanation: "Barangay Kagawads assist the Barangay Captain in local governance.",
                },
                {
                    question: "What is the role of the Barangay Secretary?",
                    options: [
                        "Clean the barangay hall",
                        "Keep records and prepare reports",
                        "Collect garbage",
                        "Teach students",
                    ],
                    correctAnswer: 1,
                    explanation: "The Barangay Secretary keeps records and prepares official reports.",
                }
            ],
            // Mission 4: 4 questions
            "4": [
                {
                    question: "Which of the following is an example of a barangay ordinance?",
                    options: [
                        "Increase in national income tax",
                        "Road widening for highways", 
                        "Curfew for minors",
                        "National ID registration",
                    ],
                    correctAnswer: 2,
                    explanation: "Curfew for minors is an example of a barangay ordinance that addresses local community safety.",
                },
                {
                    question: "Who can propose a barangay ordinance?",
                    options: [
                        "Any resident",
                        "Barangay Kagawads",
                        "City Mayor only",
                        "President",
                    ],
                    correctAnswer: 1,
                    explanation: "Barangay Kagawads have the authority to propose ordinances for their community.",
                },
                {
                    question: "How are barangay ordinances approved?",
                    options: [
                        "By the President",
                        "By majority vote of Sangguniang Barangay",
                        "By the City Mayor",
                        "Automatically",
                    ],
                    correctAnswer: 1,
                    explanation: "Barangay ordinances must be approved by majority vote of the Sangguniang Barangay.",
                },
                {
                    question: "What happens if you violate a barangay ordinance?",
                    options: [
                        "Nothing",
                        "Imprisonment only",
                        "Fine or community service",
                        "Deportation",
                    ],
                    correctAnswer: 2,
                    explanation: "Violating barangay ordinances typically results in fines or community service as penalties.",
                }
            ],
            // Mission 5: 5 questions
            "5": [
                {
                    question: "How can you verify if news online is fake?",
                    options: [
                        "If it has many likes",
                        "If a celebrity shares it",
                        "By checking official sources or fact-checking websites",
                        "If it matches your opinion",
                    ],
                    correctAnswer: 2,
                    explanation: "Fact-checking requires verifying the source and cross-referencing information with multiple reliable and credible sources.",
                },
                {
                    question: "What is a common sign of fake news?",
                    options: [
                        "Professional website design",
                        "Sensational headlines and emotional language",
                        "Multiple credible sources",
                        "Author credentials listed",
                    ],
                    correctAnswer: 1,
                    explanation: "Fake news often uses sensational headlines and emotional language to manipulate readers.",
                },
                {
                    question: "What should you do before sharing news online?",
                    options: [
                        "Share immediately if it's shocking",
                        "Verify the source and check facts",
                        "Share only if friends shared it",
                        "Add your own opinion first",
                    ],
                    correctAnswer: 1,
                    explanation: "Always verify the source and check facts before sharing any news online.",
                },
                {
                    question: "Which website helps verify fake news in the Philippines?",
                    options: [
                        "Facebook",
                        "Vera Files or Rappler fact-check",
                        "Twitter",
                        "Instagram",
                    ],
                    correctAnswer: 1,
                    explanation: "Vera Files and Rappler have dedicated fact-checking sections for Filipino news.",
                },
                {
                    question: "Why is spreading fake news harmful?",
                    options: [
                        "It's not harmful",
                        "It misinforms people and can cause panic",
                        "It makes you popular",
                        "It's just entertainment",
                    ],
                    correctAnswer: 1,
                    explanation: "Fake news misinforms people, can cause unnecessary panic, and undermines trust in legitimate information.",
                }
            ],
            // Mission 6: 6 questions
            "6": [
                {
                    question: "Which barangay official is responsible for implementing local projects?",
                    options: [
                        "Barangay Treasurer",
                        "Barangay Kagawad",
                        "City Mayor",
                        "Barangay Clerk",
                    ],
                    correctAnswer: 1,
                    explanation: "Barangay Kagawads are responsible for implementing local projects and programs.",
                },
                {
                    question: "What is the role of the Barangay Treasurer?",
                    options: [
                        "Fix roads",
                        "Manage barangay funds and budget",
                        "Arrest criminals",
                        "Teach children",
                    ],
                    correctAnswer: 1,
                    explanation: "The Barangay Treasurer manages barangay funds and budget allocation.",
                },
                {
                    question: "Who maintains peace and order in the barangay?",
                    options: [
                        "Barangay Tanod",
                        "Teachers",
                        "Doctors",
                        "Engineers",
                    ],
                    correctAnswer: 0,
                    explanation: "Barangay Tanods are responsible for maintaining peace and order in the community.",
                },
                {
                    question: "What service does the barangay provide for infrastructure?",
                    options: [
                        "Building airports",
                        "Road repairs and street lighting",
                        "Building malls",
                        "Operating trains",
                    ],
                    correctAnswer: 1,
                    explanation: "Barangays provide basic infrastructure services like road repairs and street lighting.",
                },
                {
                    question: "How can residents request barangay services?",
                    options: [
                        "Through social media only",
                        "By filing a request at the barangay hall",
                        "By calling the President",
                        "Services are not available",
                    ],
                    correctAnswer: 1,
                    explanation: "Residents can request services by filing formal requests at the barangay hall.",
                },
                {
                    question: "What is 'Bayanihan' in community service?",
                    options: [
                        "A type of food",
                        "Community cooperation and helping each other",
                        "A government office",
                        "A type of tax",
                    ],
                    correctAnswer: 1,
                    explanation: "Bayanihan represents the Filipino spirit of community cooperation and mutual assistance.",
                }
            ],
            // Mission 7: 7 questions
            "7": [
                {
                    question: "What is the best first step in resolving neighbor conflicts?",
                    options: [
                        "Shout at them",
                        "Post on social media",
                        "Talk calmly or seek mediation",
                        "Ignore it completely",
                    ],
                    correctAnswer: 2,
                    explanation: "Calm dialogue and mediation are the most effective first steps in resolving conflicts.",
                },
                {
                    question: "What is the role of a barangay mediator?",
                    options: [
                        "Punish wrongdoers",
                        "Help parties reach peaceful agreement",
                        "Take sides",
                        "Call the police immediately",
                    ],
                    correctAnswer: 1,
                    explanation: "Barangay mediators help conflicting parties reach peaceful agreements.",
                },
                {
                    question: "What is 'Katarungang Pambarangay'?",
                    options: [
                        "A barangay festival",
                        "Barangay justice system for settling disputes",
                        "A type of food",
                        "A barangay official",
                    ],
                    correctAnswer: 1,
                    explanation: "Katarungang Pambarangay is the barangay-level justice system for dispute resolution.",
                },
                {
                    question: "What should you bring to a barangay mediation?",
                    options: [
                        "Weapons",
                        "Evidence and witnesses",
                        "Angry friends",
                        "Nothing",
                    ],
                    correctAnswer: 1,
                    explanation: "Bring relevant evidence and witnesses to support your case in mediation.",
                },
                {
                    question: "What happens if mediation fails?",
                    options: [
                        "Nothing can be done",
                        "Case can be brought to court",
                        "Fight it out",
                        "Move away",
                    ],
                    correctAnswer: 1,
                    explanation: "If barangay mediation fails, the case can be escalated to formal court proceedings.",
                },
                {
                    question: "Why is mediation better than going to court?",
                    options: [
                        "It's not better",
                        "It's faster, cheaper, and preserves relationships",
                        "You always win",
                        "It's more expensive",
                    ],
                    correctAnswer: 1,
                    explanation: "Mediation is faster, cheaper, and helps preserve community relationships.",
                },
                {
                    question: "What attitude should you have during mediation?",
                    options: [
                        "Aggressive and demanding",
                        "Open-minded and willing to compromise",
                        "Defensive and angry",
                        "Silent and uncooperative",
                    ],
                    correctAnswer: 1,
                    explanation: "An open-minded and compromising attitude leads to successful mediation outcomes.",
                }
            ],
            // Mission 8: 8 questions
            "8": [
                {
                    question: "What year was the current Philippine Constitution ratified?",
                    options: ["1898", "1945", "1973", "1987"],
                    correctAnswer: 3,
                    explanation: "The current Philippine Constitution was ratified in 1987.",
                },
                {
                    question: "Who is known as the 'Father of the Philippine Constitution'?",
                    options: [
                        "Jose Rizal",
                        "Claro M. Recto",
                        "Emilio Aguinaldo",
                        "Andres Bonifacio",
                    ],
                    correctAnswer: 1,
                    explanation: "Claro M. Recto is known as the Father of the Philippine Constitution.",
                },
                {
                    question: "What is the Bill of Rights?",
                    options: [
                        "A list of government officials",
                        "Constitutional provisions protecting individual freedoms",
                        "A tax document",
                        "A barangay ordinance",
                    ],
                    correctAnswer: 1,
                    explanation: "The Bill of Rights contains constitutional provisions that protect individual freedoms.",
                },
                {
                    question: "How many articles are in the 1987 Philippine Constitution?",
                    options: ["10", "15", "18", "20"],
                    correctAnswer: 2,
                    explanation: "The 1987 Philippine Constitution contains 18 articles.",
                },
                {
                    question: "What is the national language of the Philippines?",
                    options: ["English", "Spanish", "Filipino", "Tagalog only"],
                    correctAnswer: 2,
                    explanation: "Filipino is the national language of the Philippines.",
                },
                {
                    question: "What does 'sovereignty resides in the people' mean?",
                    options: [
                        "The President has all power",
                        "The people are the source of government authority",
                        "Only rich people have power",
                        "Foreigners control the country",
                    ],
                    correctAnswer: 1,
                    explanation: "This means the people are the ultimate source of government authority and power.",
                },
                {
                    question: "What is the term of office for a Philippine President?",
                    options: [
                        "4 years, renewable",
                        "6 years, no re-election",
                        "5 years, renewable once",
                        "Lifetime",
                    ],
                    correctAnswer: 1,
                    explanation: "The Philippine President serves a 6-year term with no re-election allowed.",
                },
                {
                    question: "What are the three branches of Philippine government?",
                    options: [
                        "Federal, State, Local",
                        "Executive, Legislative, Judicial",
                        "President, Senate, Mayor",
                        "Army, Navy, Air Force",
                    ],
                    correctAnswer: 1,
                    explanation: "The three branches are Executive, Legislative, and Judicial.",
                }
            ],
            // Mission 9: 9 questions
            "9": [
                {
                    question: "Which of the following is a common barangay health service?",
                    options: [
                        "Surgery",
                        "Blood donation and immunization",
                        "Ambulance repair",
                        "Pharmacy sales",
                    ],
                    correctAnswer: 1,
                    explanation: "Blood donation drives and immunization are common barangay health services.",
                },
                {
                    question: "What is the purpose of barangay health centers?",
                    options: [
                        "Sell medicine for profit",
                        "Provide basic healthcare and preventive services",
                        "Replace hospitals",
                        "Train doctors",
                    ],
                    correctAnswer: 1,
                    explanation: "Barangay health centers provide basic healthcare and preventive services to the community.",
                },
                {
                    question: "What does 'Oplan Bakuna' promote?",
                    options: [
                        "Exercise programs",
                        "Vaccination and immunization",
                        "Healthy eating only",
                        "Sports competitions",
                    ],
                    correctAnswer: 1,
                    explanation: "Oplan Bakuna promotes vaccination and immunization programs.",
                },
                {
                    question: "Who are Barangay Health Workers (BHWs)?",
                    options: [
                        "Doctors from hospitals",
                        "Volunteer community health advocates",
                        "Government soldiers",
                        "Foreign health experts",
                    ],
                    correctAnswer: 1,
                    explanation: "BHWs are volunteer community health advocates who serve their barangays.",
                },
                {
                    question: "What is the importance of pre-natal care?",
                    options: [
                        "It's not important",
                        "Ensures health of mother and baby during pregnancy",
                        "Only for rich families",
                        "Only needed after birth",
                    ],
                    correctAnswer: 1,
                    explanation: "Pre-natal care ensures the health of both mother and baby during pregnancy.",
                },
                {
                    question: "What is 'Nutrition Month' in the Philippines?",
                    options: [
                        "December",
                        "July",
                        "January",
                        "October",
                    ],
                    correctAnswer: 1,
                    explanation: "Nutrition Month in the Philippines is celebrated in July.",
                },
                {
                    question: "What service helps prevent dengue in barangays?",
                    options: [
                        "Building more roads",
                        "Mosquito control and clean-up drives",
                        "Planting more trees only",
                        "Building more houses",
                    ],
                    correctAnswer: 1,
                    explanation: "Mosquito control and clean-up drives help prevent dengue outbreaks.",
                },
                {
                    question: "What is the '4Ps' health component?",
                    options: [
                        "A sports program",
                        "Health check-ups and deworming for beneficiaries",
                        "A scholarship program",
                        "A housing program",
                    ],
                    correctAnswer: 1,
                    explanation: "The 4Ps program includes health check-ups and deworming for beneficiaries.",
                },
                {
                    question: "Why is handwashing important?",
                    options: [
                        "It's not important",
                        "Prevents spread of diseases and infections",
                        "Makes hands smell good only",
                        "Wastes water",
                    ],
                    correctAnswer: 1,
                    explanation: "Handwashing prevents the spread of diseases and infections.",
                }
            ],
            // Mission 10: 10 questions
            "10": [
                {
                    question: "What should you do during a barangay meeting?",
                    options: [
                        "Shout your opinions",
                        "Sleep silently",
                        "Listen, respect turns, and speak politely",
                        "Record secretly without consent",
                    ],
                    correctAnswer: 2,
                    explanation: "Effective participation requires listening, respecting others' turns, and speaking politely.",
                },
                {
                    question: "What is a barangay assembly?",
                    options: [
                        "A party",
                        "A meeting where residents discuss community issues",
                        "A sports event",
                        "A religious gathering",
                    ],
                    correctAnswer: 1,
                    explanation: "A barangay assembly is a meeting where residents discuss community issues.",
                },
                {
                    question: "How often should barangay assemblies be held?",
                    options: [
                        "Once a year",
                        "At least twice a year",
                        "Never",
                        "Every day",
                    ],
                    correctAnswer: 1,
                    explanation: "Barangay assemblies should be held at least twice a year.",
                },
                {
                    question: "Who can attend barangay assemblies?",
                    options: [
                        "Only officials",
                        "All residents of voting age",
                        "Only men",
                        "Only property owners",
                    ],
                    correctAnswer: 1,
                    explanation: "All residents of voting age can attend barangay assemblies.",
                },
                {
                    question: "What topics are discussed in barangay assemblies?",
                    options: [
                        "Celebrity gossip",
                        "Community problems, projects, and budget",
                        "Personal issues only",
                        "National politics only",
                    ],
                    correctAnswer: 1,
                    explanation: "Assemblies discuss community problems, projects, and budget matters.",
                },
                {
                    question: "Can residents propose projects in assemblies?",
                    options: [
                        "No, never",
                        "Yes, residents can suggest community projects",
                        "Only if they pay",
                        "Only officials can propose",
                    ],
                    correctAnswer: 1,
                    explanation: "Residents can suggest and propose community projects during assemblies.",
                },
                {
                    question: "What is a quorum in barangay assemblies?",
                    options: [
                        "A type of food",
                        "Minimum number of attendees needed for valid decisions",
                        "A barangay official",
                        "A voting machine",
                    ],
                    correctAnswer: 1,
                    explanation: "A quorum is the minimum number of attendees needed to make valid decisions.",
                },
                {
                    question: "Why is citizen participation important in assemblies?",
                    options: [
                        "It's not important",
                        "It ensures community voices are heard in governance",
                        "To waste time",
                        "Only for entertainment",
                    ],
                    correctAnswer: 1,
                    explanation: "Citizen participation ensures community voices are heard in local governance.",
                },
                {
                    question: "What is 'transparency' in barangay governance?",
                    options: [
                        "Invisible walls",
                        "Open and honest sharing of information with residents",
                        "Secret meetings",
                        "Hiding documents",
                    ],
                    correctAnswer: 1,
                    explanation: "Transparency means open and honest sharing of information with residents.",
                },
                {
                    question: "How can youth participate in barangay governance?",
                    options: [
                        "They cannot participate",
                        "Through Sangguniang Kabataan and attending assemblies",
                        "Only by watching",
                        "Only when they're old",
                    ],
                    correctAnswer: 1,
                    explanation: "Youth can participate through Sangguniang Kabataan and by attending assemblies.",
                }
            ],

            // Level 2: City Government Quizzes (11-20) - Progressive format
            // Mission 11: 1 question
            "11": [
                {
                    question: "What is the primary function of city ordinances?",
                    options: [
                        "To replace national laws",
                        "To regulate local affairs and implement policies",
                        "To collect more taxes from residents",
                        "To create jobs for city officials",
                    ],
                    correctAnswer: 1,
                    explanation: "City ordinances are local laws that regulate specific affairs within the city's jurisdiction.",
                }
            ],
            // Mission 12: 2 questions  
            "12": [
                {
                    question: "What is the main source of municipal revenue in Philippine cities?",
                    options: [
                        "Donations from private companies",
                        "Local taxes, fees, and national government allocations",
                        "International aid",
                        "Loans from banks only",
                    ],
                    correctAnswer: 1,
                    explanation: "Municipal revenue comes from local taxes, fees, and the Internal Revenue Allotment (IRA).",
                },
                {
                    question: "What is the Internal Revenue Allotment (IRA)?",
                    options: [
                        "A city tax",
                        "National government fund allocation to local governments",
                        "A business permit fee",
                        "A property tax",
                    ],
                    correctAnswer: 1,
                    explanation: "IRA is the national government's fund allocation to local government units.",
                }
            ],
            // Mission 13: 3 questions
            "13": [
                {
                    question: "Who is primarily responsible for city infrastructure planning?",
                    options: [
                        "Private construction companies",
                        "City Engineer and Planning Office",
                        "National government only",
                        "Local business owners",
                    ],
                    correctAnswer: 1,
                    explanation: "The City Engineer and Planning Office are responsible for infrastructure planning.",
                },
                {
                    question: "What is urban infrastructure?",
                    options: [
                        "Only roads",
                        "Roads, bridges, water systems, and public facilities",
                        "Only buildings",
                        "Only parks",
                    ],
                    correctAnswer: 1,
                    explanation: "Urban infrastructure includes roads, bridges, water systems, and public facilities.",
                },
                {
                    question: "Why is infrastructure maintenance important?",
                    options: [
                        "It's not important",
                        "Ensures safety and functionality of public facilities",
                        "To spend money",
                        "To create jobs only",
                    ],
                    correctAnswer: 1,
                    explanation: "Infrastructure maintenance ensures safety and functionality of public facilities.",
                }
            ],
            // Mission 14: 4 questions
            "14": [
                {
                    question: "What is required to operate a business legally in a city?",
                    options: [
                        "Only a national business registration",
                        "Mayor's personal approval only",
                        "Business permit and compliance with local regulations",
                        "Recommendation from local politicians",
                    ],
                    correctAnswer: 2,
                    explanation: "Businesses must obtain proper permits and comply with local regulations.",
                },
                {
                    question: "What is a business permit?",
                    options: [
                        "A suggestion",
                        "Official authorization to operate a business",
                        "A loan",
                        "An advertisement",
                    ],
                    correctAnswer: 1,
                    explanation: "A business permit is official authorization to operate a business.",
                },
                {
                    question: "Which office issues business permits?",
                    options: [
                        "Police station",
                        "Business Permits and Licensing Office",
                        "Fire department",
                        "Hospital",
                    ],
                    correctAnswer: 1,
                    explanation: "The Business Permits and Licensing Office issues business permits.",
                },
                {
                    question: "What happens if you operate without a permit?",
                    options: [
                        "Nothing",
                        "You get a reward",
                        "Penalties, fines, or closure",
                        "Free advertising",
                    ],
                    correctAnswer: 2,
                    explanation: "Operating without a permit can result in penalties, fines, or closure.",
                }
            ],
            // Mission 15: 5 questions
            "15": [
                {
                    question: "What is the purpose of urban zoning?",
                    options: [
                        "To segregate people by income",
                        "To organize land use for orderly development",
                        "To increase property prices",
                        "To limit population",
                    ],
                    correctAnswer: 1,
                    explanation: "Urban zoning organizes land use for orderly development.",
                },
                {
                    question: "What are the main zoning types?",
                    options: [
                        "Rich and poor",
                        "Residential, commercial, and industrial",
                        "Old and new",
                        "Big and small",
                    ],
                    correctAnswer: 1,
                    explanation: "Main zoning types are residential, commercial, and industrial.",
                },
                {
                    question: "Why is city planning important?",
                    options: [
                        "To make cities pretty",
                        "To ensure sustainable development",
                        "To spend money",
                        "To create jobs",
                    ],
                    correctAnswer: 1,
                    explanation: "City planning ensures sustainable development and quality of life.",
                },
                {
                    question: "What is a comprehensive land use plan?",
                    options: [
                        "A map",
                        "A long-term development guide",
                        "A list of owners",
                        "A tax plan",
                    ],
                    correctAnswer: 1,
                    explanation: "A comprehensive land use plan is a long-term development guide.",
                },
                {
                    question: "Who approves city development plans?",
                    options: [
                        "The President",
                        "City Council",
                        "Barangay Captain",
                        "Business owners",
                    ],
                    correctAnswer: 1,
                    explanation: "The City Council approves city development plans.",
                }
            ],
            // Mission 16: 6 questions
            "16": [
                {
                    question: "What is a city's environmental responsibility?",
                    options: [
                        "Monitor global climate only",
                        "Manage local waste, air, and water quality",
                        "Protect foreign wildlife",
                        "Regulate international trade",
                    ],
                    correctAnswer: 1,
                    explanation: "Cities manage local waste, air, and water quality.",
                },
                {
                    question: "What is solid waste management?",
                    options: [
                        "Throwing garbage anywhere",
                        "Systematic collection and disposal of waste",
                        "Burning all waste",
                        "Burying waste anywhere",
                    ],
                    correctAnswer: 1,
                    explanation: "Solid waste management involves systematic collection and disposal.",
                },
                {
                    question: "What is the 3Rs principle?",
                    options: [
                        "Read, Write, Recite",
                        "Reduce, Reuse, Recycle",
                        "Run, Rest, Repeat",
                        "Rich, Rare, Royal",
                    ],
                    correctAnswer: 1,
                    explanation: "The 3Rs are Reduce, Reuse, and Recycle.",
                },
                {
                    question: "What is water quality monitoring?",
                    options: [
                        "Counting bottles",
                        "Testing water safety standards",
                        "Measuring temperature only",
                        "Checking color only",
                    ],
                    correctAnswer: 1,
                    explanation: "Water quality monitoring tests water safety standards.",
                },
                {
                    question: "What is air quality management?",
                    options: [
                        "Ignoring pollution",
                        "Monitoring and controlling air pollution",
                        "Only for factories",
                        "Only for vehicles",
                    ],
                    correctAnswer: 1,
                    explanation: "Air quality management monitors and controls air pollution.",
                },
                {
                    question: "Why do cities need environmental ordinances?",
                    options: [
                        "To make money",
                        "To protect public health and environment",
                        "To punish residents",
                        "To create jobs",
                    ],
                    correctAnswer: 1,
                    explanation: "Environmental ordinances protect public health and the environment.",
                }
            ],
            // Mission 17: 7 questions
            "17": [
                {
                    question: "How should cities coordinate public safety?",
                    options: [
                        "Rely only on police",
                        "Integrate police, fire, medical, and emergency services",
                        "Hire private security only",
                        "Depend on volunteers only",
                    ],
                    correctAnswer: 1,
                    explanation: "Cities integrate police, fire, medical, and emergency services.",
                },
                {
                    question: "What is the PNP's role?",
                    options: [
                        "Collect taxes",
                        "Maintain peace and order",
                        "Build roads",
                        "Manage hospitals",
                    ],
                    correctAnswer: 1,
                    explanation: "The PNP maintains peace and order.",
                },
                {
                    question: "What is the BFP's main function?",
                    options: [
                        "Prevent and suppress fires",
                        "Arrest criminals",
                        "Collect garbage",
                        "Issue permits",
                    ],
                    correctAnswer: 0,
                    explanation: "The BFP prevents and suppresses fires.",
                },
                {
                    question: "What is disaster risk reduction?",
                    options: [
                        "Ignoring disasters",
                        "Preparing for and minimizing disaster impacts",
                        "Causing disasters",
                        "Moving away",
                    ],
                    correctAnswer: 1,
                    explanation: "Disaster risk reduction prepares for and minimizes disaster impacts.",
                },
                {
                    question: "What should cities do during emergencies?",
                    options: [
                        "Panic",
                        "Activate emergency response plans",
                        "Do nothing",
                        "Wait for help",
                    ],
                    correctAnswer: 1,
                    explanation: "Cities activate emergency response plans during emergencies.",
                },
                {
                    question: "What is community-based policing?",
                    options: [
                        "Police working alone",
                        "Police partnering with communities",
                        "Police avoiding communities",
                        "Communities policing alone",
                    ],
                    correctAnswer: 1,
                    explanation: "Community-based policing involves police partnering with communities.",
                },
                {
                    question: "Why is emergency preparedness important?",
                    options: [
                        "It's not important",
                        "To quickly respond and save lives",
                        "To spend money",
                        "To create fear",
                    ],
                    correctAnswer: 1,
                    explanation: "Emergency preparedness enables quick response to save lives.",
                }
            ],
            // Mission 18: 8 questions
            "18": [
                {
                    question: "Why is cultural heritage preservation important?",
                    options: [
                        "Only for tourists",
                        "Preserves identity and educates citizens",
                        "Increases costs",
                        "Prevents development",
                    ],
                    correctAnswer: 1,
                    explanation: "Cultural heritage preserves identity and educates citizens.",
                },
                {
                    question: "What are examples of cultural heritage?",
                    options: [
                        "Only old buildings",
                        "Historic sites, traditions, and festivals",
                        "Only museums",
                        "Only statues",
                    ],
                    correctAnswer: 1,
                    explanation: "Cultural heritage includes historic sites, traditions, and festivals.",
                },
                {
                    question: "What is the National Cultural Heritage Act?",
                    options: [
                        "A tax law",
                        "A law protecting Philippine cultural heritage",
                        "A business regulation",
                        "A traffic law",
                    ],
                    correctAnswer: 1,
                    explanation: "The Act protects Philippine cultural heritage.",
                },
                {
                    question: "How can cities promote local culture?",
                    options: [
                        "Ban cultural activities",
                        "Support festivals and cultural programs",
                        "Ignore traditions",
                        "Copy other cities",
                    ],
                    correctAnswer: 1,
                    explanation: "Cities support festivals and cultural programs.",
                },
                {
                    question: "What is cultural tourism?",
                    options: [
                        "Any travel",
                        "Tourism focused on experiencing local culture",
                        "Only beaches",
                        "Only malls",
                    ],
                    correctAnswer: 1,
                    explanation: "Cultural tourism focuses on experiencing local culture.",
                },
                {
                    question: "Why preserve historical buildings?",
                    options: [
                        "They're old and useless",
                        "They represent history and identity",
                        "They take up space",
                        "They're expensive",
                    ],
                    correctAnswer: 1,
                    explanation: "Historical buildings represent history and identity.",
                },
                {
                    question: "What is intangible cultural heritage?",
                    options: [
                        "Buildings",
                        "Traditions and knowledge passed down",
                        "Money",
                        "Technology",
                    ],
                    correctAnswer: 1,
                    explanation: "Intangible heritage includes traditions and knowledge.",
                },
                {
                    question: "How can youth participate in cultural preservation?",
                    options: [
                        "Ignore traditions",
                        "Learn and share cultural traditions",
                        "Focus on modern culture only",
                        "Move away",
                    ],
                    correctAnswer: 1,
                    explanation: "Youth learn and share cultural traditions.",
                }
            ],
            // Mission 19: 9 questions
            "19": [
                {
                    question: "What is the city's role in healthcare?",
                    options: [
                        "Replace private hospitals",
                        "Provide basic health services",
                        "Only handle emergencies",
                        "Focus on insurance only",
                    ],
                    correctAnswer: 1,
                    explanation: "Cities provide basic health services and coordinate programs.",
                },
                {
                    question: "What are city health centers?",
                    options: [
                        "Private hospitals",
                        "Government facilities providing basic healthcare",
                        "Pharmacies",
                        "Fitness gyms",
                    ],
                    correctAnswer: 1,
                    explanation: "City health centers provide basic healthcare services.",
                },
                {
                    question: "What is public health?",
                    options: [
                        "Individual treatment",
                        "Protecting community health through prevention",
                        "Private healthcare",
                        "Hospital management",
                    ],
                    correctAnswer: 1,
                    explanation: "Public health protects community health through prevention.",
                },
                {
                    question: "What is disease surveillance?",
                    options: [
                        "Spying on sick people",
                        "Monitoring disease patterns",
                        "Treating patients",
                        "Selling medicine",
                    ],
                    correctAnswer: 1,
                    explanation: "Disease surveillance monitors disease patterns.",
                },
                {
                    question: "What is immunization?",
                    options: [
                        "Taking vitamins",
                        "Vaccination to prevent diseases",
                        "Exercise programs",
                        "Eating healthy",
                    ],
                    correctAnswer: 1,
                    explanation: "Immunization involves vaccination to prevent diseases.",
                },
                {
                    question: "What is maternal and child health care?",
                    options: [
                        "Only for rich families",
                        "Healthcare services for mothers and children",
                        "Only for emergencies",
                        "Only for fathers",
                    ],
                    correctAnswer: 1,
                    explanation: "Maternal and child health care serves mothers and children.",
                },
                {
                    question: "What is health promotion?",
                    options: [
                        "Selling products",
                        "Educating about healthy lifestyles",
                        "Building hospitals",
                        "Hiring doctors",
                    ],
                    correctAnswer: 1,
                    explanation: "Health promotion educates about healthy lifestyles.",
                },
                {
                    question: "What is PhilHealth?",
                    options: [
                        "A fitness program",
                        "National health insurance program",
                        "A hospital chain",
                        "A medicine brand",
                    ],
                    correctAnswer: 1,
                    explanation: "PhilHealth is the national health insurance program.",
                },
                {
                    question: "Why is preventive healthcare important?",
                    options: [
                        "It's not important",
                        "Prevents diseases before they occur",
                        "It's expensive",
                        "Only for rich people",
                    ],
                    correctAnswer: 1,
                    explanation: "Preventive healthcare prevents diseases before they occur.",
                }
            ],
            // Mission 20: 10 questions
            "20": [
                {
                    question: "What demonstrates effective city leadership?",
                    options: [
                        "Making decisions without consultation",
                        "Transparent governance and citizen participation",
                        "Focusing only on economy",
                        "Avoiding difficult decisions",
                    ],
                    correctAnswer: 1,
                    explanation: "Effective leadership involves transparent governance and citizen participation.",
                },
                {
                    question: "What is good governance?",
                    options: [
                        "Doing whatever you want",
                        "Accountable, transparent, and participatory leadership",
                        "Secret decision-making",
                        "Ignoring citizens",
                    ],
                    correctAnswer: 1,
                    explanation: "Good governance is accountable, transparent, and participatory.",
                },
                {
                    question: "What is transparency in government?",
                    options: [
                        "Invisible walls",
                        "Open sharing of information with citizens",
                        "Secret meetings",
                        "Hiding documents",
                    ],
                    correctAnswer: 1,
                    explanation: "Transparency means open sharing of information with citizens.",
                },
                {
                    question: "What is accountability?",
                    options: [
                        "Blaming others",
                        "Taking responsibility for actions and decisions",
                        "Avoiding responsibility",
                        "Making excuses",
                    ],
                    correctAnswer: 1,
                    explanation: "Accountability means taking responsibility for actions and decisions.",
                },
                {
                    question: "Why is citizen participation important?",
                    options: [
                        "It's not important",
                        "Ensures government serves the people's needs",
                        "To waste time",
                        "For entertainment",
                    ],
                    correctAnswer: 1,
                    explanation: "Citizen participation ensures government serves the people's needs.",
                },
                {
                    question: "What is participatory governance?",
                    options: [
                        "Government working alone",
                        "Citizens actively involved in decision-making",
                        "Only officials decide",
                        "No citizen input",
                    ],
                    correctAnswer: 1,
                    explanation: "Participatory governance involves citizens in decision-making.",
                },
                {
                    question: "What is inter-agency coordination?",
                    options: [
                        "Agencies working separately",
                        "Government agencies working together",
                        "Competing with each other",
                        "Ignoring each other",
                    ],
                    correctAnswer: 1,
                    explanation: "Inter-agency coordination means government agencies working together.",
                },
                {
                    question: "Why is long-term planning important for cities?",
                    options: [
                        "It's not important",
                        "Ensures sustainable development for future generations",
                        "To spend more money",
                        "To delay projects",
                    ],
                    correctAnswer: 1,
                    explanation: "Long-term planning ensures sustainable development for future generations.",
                },
                {
                    question: "What is inclusive governance?",
                    options: [
                        "Only for certain groups",
                        "Ensuring all citizens can participate regardless of background",
                        "Excluding minorities",
                        "Only for the wealthy",
                    ],
                    correctAnswer: 1,
                    explanation: "Inclusive governance ensures all citizens can participate.",
                },
                {
                    question: "How can citizens hold leaders accountable?",
                    options: [
                        "They cannot",
                        "Through voting, participation, and monitoring government actions",
                        "By complaining only",
                        "By doing nothing",
                    ],
                    correctAnswer: 1,
                    explanation: "Citizens hold leaders accountable through voting, participation, and monitoring.",
                }
            ]
        };

        return (
            progressiveQuizzes[missionId as keyof typeof progressiveQuizzes] || [{
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
            }]
        );
    };

    // Helper function to update UI from game progress
    const updateGameInfoFromProgress = (progress: GameProgress) => {
        const stats = gameStateManager.current.getPlayerStats();
        setGameInfo((prev) => ({
            ...prev,
            playerName: progress.playerName,
            badges: progress.badges.length,
            coins: progress.coins,
            totalScore: progress.totalScore,
            accuracy: stats?.accuracy || "0%",
            level: progress.level,
        }));
    };

    // Helper function to sync game state with Phaser registry
    const syncGameStateWithPhaser = (progress: GameProgress) => {
        if (phaserRef.current?.game) {
            phaserRef.current.game.registry.set(
                "playerName",
                progress.playerName
            );
            phaserRef.current.game.registry.set("coins", progress.coins);
            phaserRef.current.game.registry.set("badges", progress.badges);
            phaserRef.current.game.registry.set(
                "completedMissions",
                progress.completedMissions
            );
            phaserRef.current.game.registry.set(
                "totalScore",
                progress.totalScore
            );
            phaserRef.current.game.registry.set("level", progress.level);
        }
    };

    // Helper function to show notifications
    const showGameNotification = (notificationData: NotificationData) => {
        setNotification(notificationData);
        setShowNotification(true);
    };

    // Helper function to close notifications
    const closeNotification = () => {
        setShowNotification(false);
        setTimeout(() => setNotification(null), 300); // Delay to allow animation
    };

    // Subscribe to game state changes
    useEffect(() => {
        const unsubscribe = gameStateManager.current.subscribe((progress) => {
            updateGameInfoFromProgress(progress);
        });

        return unsubscribe;
    }, []);

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

    // Set up interval to update game data periodically and validate state
    useEffect(() => {
        const interval = setInterval(() => {
            // Validate game state periodically
            if (!gameStateManager.current.validateCurrentState()) {
                console.warn(
                    "Game state validation failed - potential tampering detected"
                );
            }

            // Update playtime tracking
            gameStateManager.current.updatePlaytime(1 / 60); // 1 minute every 60 seconds

            // Sync with Phaser registry if needed
            const progress = gameStateManager.current.getProgress();
            if (progress && phaserRef.current?.game?.registry) {
                // Check if Phaser registry is out of sync
                const phaserCoins =
                    phaserRef.current.game.registry.get("coins") || 0;
                if (phaserCoins !== progress.coins) {
                    syncGameStateWithPhaser(progress);
                }
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

    // Listen for mission and notification events from Phaser
    useEffect(() => {
        const handleShowMission = (data: any) => {
            console.log("Mission event received:", data);
            setCurrentMission(data.mission);
            setShowMission(true);
        };

        const handleGameNotification = (data: NotificationData) => {
            console.log("Notification event received:", data);
            showGameNotification(data);
        };

        const handleOpenQuestLog = () => {
            console.log("Quest Log open event received");
            setShowQuestLog(true);
            // Close any open notification when quest log opens
            closeNotification();
        };

        const handleDailyChallengeUpdate = (data: any) => {
            console.log("Daily challenge update:", data);
            shopService.current.updateChallengeProgress(data.type, data.amount);
        };

        // Listen for events using EventBus
        EventBus.on("show-mission", handleShowMission);
        EventBus.on("show-notification", handleGameNotification);
        EventBus.on("open-quest-log", handleOpenQuestLog);
        EventBus.on("update-daily-challenge", handleDailyChallengeUpdate);
        EventBus.on("close-notification", closeNotification);

        return () => {
            EventBus.off("show-mission", handleShowMission);
            EventBus.off("show-notification", handleGameNotification);
            EventBus.off("open-quest-log", handleOpenQuestLog);
            EventBus.off("update-daily-challenge", handleDailyChallengeUpdate);
            EventBus.off("close-notification", closeNotification);
        };
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-sky-300 via-blue-200 to-green-300">
            {/* Loading Screen - Shows first on app load */}
            {isLoading && (
                <LoadingScreen
                    progress={loadingProgress}
                    onComplete={handleLoadingComplete}
                />
            )}

            {/* Tutorial - Shows after character creation for first-time players */}
            {showTutorial && (
                <Tutorial
                    onComplete={handleTutorialComplete}
                    onSkip={handleTutorialSkip}
                />
            )}

            {/* Landscape Orientation Overlay - Blocks game until rotated */}
            <LandscapePrompt />

            {/* React UI Components */}
            {!isLoading && showMainMenu && (
                <MainMenu
                    onStartGame={handleStartGame}
                    onLoadGame={handleLoadGame}
                    onShowSettings={handleShowSettings}
                    onShowExtras={handleShowExtras}
                    onShowCredits={handleShowCredits}
                    onShowLeaderboard={handleShowLeaderboard}
                    onShowTutorial={handleShowTutorial}
                    onExit={handleExit}
                />
            )}
            {showCharacterCreation && (
                <CharacterCreation
                    onCharacterCreated={handleCharacterCreated}
                    onBack={() => {
                        setShowCharacterCreation(false);
                        setShowMainMenu(true);
                    }}
                />
            )}
            {showQuiz && currentQuiz && (
                <QuizSystem
                    question={currentQuiz}
                    onAnswer={handleQuizAnswer}
                    onClose={() => setShowQuiz(false)}
                    missionId={currentMission?.id}
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
                            <div className="flex flex-col space-y-1">
                                <div className="flex space-x-1">
                                    {/* Player Name & Title */}
                                    <div className="text-xs font-bold text-amber-800 game-element-border rounded px-1 py-0.5 text-center">
                                        👤 {gameInfo.playerName || "Citizen"}
                                    </div>

                                    {/* Level */}
                                    <div className="text-xs font-bold text-amber-800 game-element-border rounded px-1 py-0.5 text-center">
                                        ⭐ L{gameInfo.level}
                                    </div>
                                </div>

                                {/* Player Title */}
                                {secretQuestService.current.getCurrentTitle() && (
                                    <div className="text-xs font-bold text-purple-800 game-element-border rounded px-1 py-0.5 text-center bg-gradient-to-r from-purple-100 to-pink-100">
                                        👑{" "}
                                        {secretQuestService.current.getCurrentTitle()}
                                    </div>
                                )}

                                <div className="flex space-x-1">
                                    {/* Badges */}
                                    <div className="text-xs font-bold text-amber-800 game-element-border rounded px-1 py-0.5 text-center">
                                        🏆 {gameInfo.badges}/10
                                    </div>

                                    {/* Coins */}
                                    <div className="text-xs font-bold text-amber-800 game-element-border rounded px-1 py-0.5 text-center">
                                        💰 {gameInfo.coins}
                                    </div>

                                    {/* Score */}
                                    <div className="text-xs font-bold text-amber-800 game-element-border rounded px-1 py-0.5 text-center">
                                        📊 {gameInfo.totalScore}
                                    </div>
                                </div>
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
                                    onClick={() => setShowShop(!showShop)}
                                    className="game-button-frame px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 game-glow"
                                >
                                    <div className="text-white font-bold text-xs flex items-center space-x-1">
                                        <span>🏪</span>
                                        <span className="hidden sm:inline">
                                            Shop
                                        </span>
                                    </div>
                                </button>
                                <button
                                    onClick={() =>
                                        setShowDailyChallenges(
                                            !showDailyChallenges
                                        )
                                    }
                                    className="game-button-frame px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 game-glow"
                                >
                                    <div className="text-white font-bold text-xs flex items-center space-x-1">
                                        <span>📅</span>
                                        <span className="hidden sm:inline">
                                            Daily
                                        </span>
                                    </div>
                                </button>
                                <button
                                    onClick={() =>
                                        setShowSecretQuests(!showSecretQuests)
                                    }
                                    className="game-button-frame px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 game-glow"
                                >
                                    <div className="text-white font-bold text-xs flex items-center space-x-1">
                                        <span>🔐</span>
                                        <span className="hidden sm:inline">
                                            Secrets
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
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-2 sm:p-4">
                                <div className="wooden-frame rounded-lg p-3 sm:p-6 w-full max-w-xs sm:max-w-md mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
                                    {/* Metal corners */}
                                    <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tl-lg z-10" />
                                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tr-lg z-10" />
                                    <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-bl-lg z-10" />
                                    <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-br-lg z-10" />

                                    {/* Parchment content */}
                                    <div className="parchment-bg rounded-md p-3 sm:p-6 relative">
                                        <button
                                            onClick={() =>
                                                setShowPauseMenu(false)
                                            }
                                            className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20 text-sm sm:text-base"
                                        >
                                            ✕
                                        </button>

                                        <h2 className="text-lg sm:text-2xl font-bold text-amber-900 mb-4 sm:mb-6 text-center game-element-border rounded-md py-1 sm:py-2 px-2 sm:px-4">
                                            ⚔️ Game Menu
                                        </h2>
                                        <div className="space-y-2 sm:space-y-4">
                                            <button
                                                onClick={() =>
                                                    setShowPauseMenu(false)
                                                }
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                                                    <span>▶️</span>
                                                    <span>Resume Game</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setShowQuestLog(true)
                                                }
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                                                    <span>📋</span>
                                                    <span>Quest Log</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowPauseMenu(false);
                                                    setShowInventory(true);
                                                }}
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                                                    <span>🎒</span>
                                                    <span>Inventory</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowPauseMenu(false);
                                                    setShowShop(true);
                                                }}
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                                                    <span>🏪</span>
                                                    <span>Shop</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowPauseMenu(false);
                                                    setShowDailyChallenges(
                                                        true
                                                    );
                                                }}
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                                                    <span>📅</span>
                                                    <span>
                                                        Daily Challenges
                                                    </span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowPauseMenu(false);
                                                    setShowSecretQuests(true);
                                                }}
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:space-x-2 text-sm sm:text-base">
                                                    <span>🔐</span>
                                                    <span>Secret Quests</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowPauseMenu(false);
                                                    setShowLeaderboard(true);
                                                }}
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                                                    <span>🏆</span>
                                                    <span>Leaderboard</span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowPauseMenu(false);
                                                    setShowCollisionEditor(
                                                        true
                                                    );
                                                }}
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow border-2 border-purple-600"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                                                    <span>🎨</span>
                                                    <span>
                                                        Collision Editor
                                                    </span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newMode = !developerMode;
                                                    setDeveloperMode(newMode);
                                                    gameStateManager.current.setDeveloperMode(newMode);
                                                    audioManager.playEffect("button-click");
                                                }}
                                                className={`w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow border-2 ${
                                                    developerMode
                                                        ? "border-green-500 bg-green-900/30"
                                                        : "border-orange-600"
                                                }`}
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                                                    <span>{developerMode ? "✅" : "🔧"}</span>
                                                    <span>
                                                        Developer Mode: {developerMode ? "ON" : "OFF"}
                                                    </span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Switch between BarangayMap and CityMap
                                                    const targetScene =
                                                        gameInfo.currentScene ===
                                                        "BarangayMap"
                                                            ? "CityMap"
                                                            : "BarangayMap";
                                                    const scene =
                                                        phaserRef.current
                                                            ?.scene;
                                                    if (scene) {
                                                        scene.scene.stop(
                                                            gameInfo.currentScene
                                                        );
                                                        scene.scene.start(
                                                            targetScene
                                                        );
                                                        setShowPauseMenu(false);
                                                    }
                                                }}
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow border-2 border-blue-600"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                                                    <span>🗺️</span>
                                                    <span>
                                                        {gameInfo.currentScene ===
                                                        "BarangayMap"
                                                            ? "Go to City Map"
                                                            : gameInfo.currentScene ===
                                                              "CityMap"
                                                            ? "Go to Barangay Map"
                                                            : "Switch Map"}
                                                    </span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    window.location.reload()
                                                }
                                                className="w-full game-button-frame py-2 sm:py-3 px-3 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                            >
                                                <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base">
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
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-2 sm:p-4">
                                <div className="wooden-frame rounded-lg p-3 sm:p-6 w-full max-w-sm sm:max-w-lg lg:max-w-2xl mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto medieval-scrollbar">
                                    {/* Metal corners */}
                                    <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tl-lg z-10" />
                                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tr-lg z-10" />
                                    <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-bl-lg z-10" />
                                    <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-br-lg z-10" />

                                    {/* Parchment content */}
                                    <div className="parchment-bg rounded-md p-3 sm:p-6 relative">
                                        <button
                                            onClick={() =>
                                                setShowQuestLog(false)
                                            }
                                            className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20 text-sm sm:text-base"
                                        >
                                            ✕
                                        </button>

                                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                                            <h2 className="text-lg sm:text-2xl font-bold text-amber-900 game-element-border rounded-md py-1 sm:py-2 px-2 sm:px-4">
                                                📋 Quest Log
                                            </h2>
                                        </div>
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="game-element-border rounded-lg p-3 sm:p-4">
                                                <h3 className="text-base sm:text-lg font-bold text-amber-800 mb-2 flex items-center space-x-1 sm:space-x-2">
                                                    <span>🎯</span>
                                                    <span>Main Objective</span>
                                                </h3>
                                                <p className="text-amber-700 text-sm sm:text-base">
                                                    {gameInfo.level === 1
                                                        ? "Complete 10 barangay missions to unlock city government and become a true community leader!"
                                                        : gameInfo.level === 2
                                                        ? "Complete 10 city missions to master municipal governance and unlock the next government level!"
                                                        : "You've mastered civic governance! Continue serving your community with excellence."}
                                                </p>
                                            </div>
                                            <div className="game-element-border rounded-lg p-3 sm:p-4">
                                                <h3 className="text-base sm:text-lg font-bold text-amber-800 mb-2 flex items-center space-x-1 sm:space-x-2">
                                                    <span>📊</span>
                                                    <span>Progress</span>
                                                </h3>
                                                <p className="text-amber-700 mb-3 text-sm sm:text-base">
                                                    {gameInfo.level === 1
                                                        ? "Barangay Badges"
                                                        : "City Badges"}{" "}
                                                    Collected:{" "}
                                                    <span className="font-bold text-green-600">
                                                        {gameInfo.level === 1
                                                            ? Math.min(
                                                                  gameInfo.badges,
                                                                  10
                                                              )
                                                            : Math.max(
                                                                  0,
                                                                  gameInfo.badges -
                                                                      10
                                                              )}
                                                    </span>
                                                    /10
                                                </p>
                                                <div className="w-full bg-amber-200 rounded-full h-2 sm:h-3 border-2 border-amber-400">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300 border border-green-700"
                                                        style={{
                                                            width: `${
                                                                gameInfo.level ===
                                                                1
                                                                    ? (Math.min(
                                                                          gameInfo.badges,
                                                                          10
                                                                      ) /
                                                                          10) *
                                                                      100
                                                                    : (Math.max(
                                                                          0,
                                                                          gameInfo.badges -
                                                                              10
                                                                      ) /
                                                                          10) *
                                                                      100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="text-center mt-2 text-xs sm:text-sm text-amber-600">
                                                    {gameInfo.level === 1
                                                        ? Math.round(
                                                              (Math.min(
                                                                  gameInfo.badges,
                                                                  10
                                                              ) /
                                                                  10) *
                                                                  100
                                                          )
                                                        : Math.round(
                                                              (Math.max(
                                                                  0,
                                                                  gameInfo.badges -
                                                                      10
                                                              ) /
                                                                  10) *
                                                                  100
                                                          )}
                                                    % Complete
                                                </div>
                                            </div>
                                            <div className="game-element-border rounded-lg p-3 sm:p-4">
                                                <h3 className="text-base sm:text-lg font-bold text-amber-800 mb-2 flex items-center space-x-1 sm:space-x-2">
                                                    <span>🏛️</span>
                                                    <span>Current Level</span>
                                                </h3>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-amber-700 text-sm sm:text-base font-semibold">
                                                            {gameInfo.level ===
                                                            1
                                                                ? "Barangay Government"
                                                                : "City Government"}
                                                        </span>
                                                        <span className="text-amber-800 font-bold">
                                                            Level{" "}
                                                            {gameInfo.level}
                                                        </span>
                                                    </div>
                                                    <div className="text-amber-600 text-xs sm:text-sm">
                                                        {gameInfo.level === 1
                                                            ? "Learning community-level governance and civic responsibility"
                                                            : "Mastering municipal administration and city leadership"}
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs sm:text-sm">
                                                        <span className="text-amber-700">
                                                            Accuracy:
                                                        </span>
                                                        <span className="font-bold text-green-600">
                                                            {gameInfo.accuracy}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs sm:text-sm">
                                                        <span className="text-amber-700">
                                                            Total Score:
                                                        </span>
                                                        <span className="font-bold text-blue-600">
                                                            {
                                                                gameInfo.totalScore
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Inventory Overlay */}
                        {showInventory && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-2 sm:p-4">
                                <div className="wooden-frame rounded-lg p-3 sm:p-6 w-full max-w-sm sm:max-w-lg lg:max-w-2xl mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
                                    {/* Metal corners */}
                                    <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tl-lg z-10" />
                                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tr-lg z-10" />
                                    <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-bl-lg z-10" />
                                    <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-br-lg z-10" />

                                    {/* Parchment content */}
                                    <div className="parchment-bg rounded-md p-3 sm:p-6 relative">
                                        <button
                                            onClick={() =>
                                                setShowInventory(false)
                                            }
                                            className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20 text-sm sm:text-base"
                                        >
                                            ✕
                                        </button>

                                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                                            <h2 className="text-lg sm:text-2xl font-bold text-amber-900 game-element-border rounded-md py-1 sm:py-2 px-2 sm:px-4">
                                                🎒 Inventory
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                            <div className="game-element-border rounded-lg p-2 sm:p-4 text-center">
                                                <div className="text-xl sm:text-3xl mb-1 sm:mb-2">
                                                    💰
                                                </div>
                                                <div className="text-amber-800 font-bold text-base sm:text-xl">
                                                    {gameInfo.coins}
                                                </div>
                                                <div className="text-xs sm:text-sm text-amber-600 font-semibold">
                                                    Gold Coins
                                                </div>
                                            </div>
                                            <div className="game-element-border rounded-lg p-2 sm:p-4 text-center">
                                                <div className="text-xl sm:text-3xl mb-1 sm:mb-2">
                                                    🏆
                                                </div>
                                                <div className="text-amber-800 font-bold text-base sm:text-xl">
                                                    {gameInfo.badges}
                                                </div>
                                                <div className="text-xs sm:text-sm text-amber-600 font-semibold">
                                                    {gameInfo.level === 1
                                                        ? "Barangay Badges"
                                                        : "Total Badges"}
                                                </div>
                                            </div>
                                            <div className="game-element-border rounded-lg p-2 sm:p-4 text-center">
                                                <div className="text-xl sm:text-3xl mb-1 sm:mb-2">
                                                    📜
                                                </div>
                                                <div className="text-amber-800 font-bold text-base sm:text-xl">
                                                    0
                                                </div>
                                                <div className="text-xs sm:text-sm text-amber-600 font-semibold">
                                                    Quest Items
                                                </div>
                                            </div>
                                            <div className="game-element-border rounded-lg p-2 sm:p-4 text-center">
                                                <div className="text-xl sm:text-3xl mb-1 sm:mb-2">
                                                    ⭐
                                                </div>
                                                <div className="text-amber-800 font-bold text-base sm:text-xl">
                                                    {gameInfo.totalScore}
                                                </div>
                                                <div className="text-xs sm:text-sm text-amber-600 font-semibold">
                                                    Experience Points
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 sm:mt-6 p-2 sm:p-4 game-element-border rounded-lg">
                                            <h3 className="text-base sm:text-lg font-bold text-amber-800 mb-2 text-center">
                                                📈 Character Stats
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                                                <div className="text-center">
                                                    <div className="text-amber-700 font-semibold">
                                                        Level
                                                    </div>
                                                    <div className="text-amber-800 font-bold">
                                                        {gameInfo.level}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-amber-700 font-semibold">
                                                        Reputation
                                                    </div>
                                                    <div className="text-amber-800 font-bold">
                                                        {gameInfo.level === 1
                                                            ? gameInfo.badges >=
                                                              10
                                                                ? "Barangay Leader"
                                                                : gameInfo.badges >=
                                                                  5
                                                                ? "Active Citizen"
                                                                : "Novice"
                                                            : gameInfo.badges >=
                                                              20
                                                            ? "Municipal Leader"
                                                            : gameInfo.badges >=
                                                              15
                                                            ? "City Official"
                                                            : "Municipal Aide"}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-amber-700 font-semibold">
                                                        Government Level
                                                    </div>
                                                    <div className="text-amber-800 font-bold">
                                                        {gameInfo.level === 1
                                                            ? "Barangay"
                                                            : "Municipal"}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-amber-700 font-semibold">
                                                        Quiz Accuracy
                                                    </div>
                                                    <div className="text-amber-800 font-bold">
                                                        {gameInfo.accuracy}
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

            {/* Game Notification Modal */}
            <GameNotification
                notification={notification}
                onClose={closeNotification}
                isVisible={showNotification}
            />

            {/* Settings Modal */}
            <Settings
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowSettings(false);
                }}
                isVisible={showSettings}
                onShowTutorial={handleShowTutorial}
            />

            {/* Extras Modal */}
            <Extras
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowExtras(false);
                }}
                isVisible={showExtras}
            />

            {/* Credits Modal */}
            <Credits
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowCredits(false);
                }}
                isVisible={showCredits}
            />

            {/* Leaderboard Modal */}
            <Leaderboard
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowLeaderboard(false);
                }}
                isVisible={showLeaderboard}
            />

            {/* Shop Modal */}
            <Shop
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowShop(false);
                }}
                isVisible={showShop}
            />

            {/* Daily Challenges Modal */}
            <DailyChallenges
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowDailyChallenges(false);
                }}
                isVisible={showDailyChallenges}
            />

            {/* Secret Quests Modal */}
            <SecretQuests
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowSecretQuests(false);
                }}
                isVisible={showSecretQuests}
            />

            {/* Collision Editor Modal */}
            <CollisionEditor
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowCollisionEditor(false);
                }}
                isVisible={showCollisionEditor}
                mapName={currentMapForEditor}
                backgroundImage={
                    currentMapForEditor === "BarangayMap"
                        ? "/barangay-background.png"
                        : "/assets/city-background.png"
                }
            />

            {/* Debug Panel for Development */}
            <GameDebugPanel />

            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
        </div>
    );
}

export default App;
