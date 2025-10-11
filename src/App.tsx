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
                handleCharacterCreated(playerName, "default");
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

    const handleExit = () => {
        audioManager.playEffect("button-click");
        // Exit functionality is handled in MainMenu component
    };

    const handleCharacterCreated = (name: string, color: string) => {
        console.log("Character created:", name, color);
        setShowCharacterCreation(false);

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
                phaserRef.current.game.registry.set("playerColor", color);

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
        const quizzes = {
            // Level 1: Barangay Quizzes (1-10)
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

            // Level 2: City Government Quizzes (11-20)
            "11": {
                question: "What is the primary function of city ordinances?",
                options: [
                    "To replace national laws",
                    "To regulate local affairs and implement policies",
                    "To collect more taxes from residents",
                    "To create jobs for city officials",
                ],
                correctAnswer: 1,
                explanation:
                    "City ordinances are local laws that regulate specific affairs within the city's jurisdiction and implement policies for the welfare of residents.",
            },
            "12": {
                question:
                    "What is the main source of municipal revenue in Philippine cities?",
                options: [
                    "Donations from private companies",
                    "Local taxes, fees, and national government allocations",
                    "International aid",
                    "Loans from banks only",
                ],
                correctAnswer: 1,
                explanation:
                    "Municipal revenue comes from local taxes (real property tax, business permits), fees, and the Internal Revenue Allotment (IRA) from the national government.",
            },
            "13": {
                question:
                    "Who is primarily responsible for city infrastructure planning?",
                options: [
                    "Private construction companies",
                    "City Engineer and Planning Office",
                    "National government only",
                    "Local business owners",
                ],
                correctAnswer: 1,
                explanation:
                    "The City Engineer and Planning Office are responsible for infrastructure planning, ensuring projects meet safety standards and development needs.",
            },
            "14": {
                question:
                    "What is required to operate a business legally in a city?",
                options: [
                    "Only a national business registration",
                    "Mayor's personal approval only",
                    "Business permit and compliance with local regulations",
                    "Recommendation from local politicians",
                ],
                correctAnswer: 2,
                explanation:
                    "Businesses must obtain proper permits and comply with local regulations including zoning, health, and safety requirements to operate legally.",
            },
            "15": {
                question:
                    "What is the purpose of urban zoning in city planning?",
                options: [
                    "To segregate people by income level",
                    "To organize land use for orderly development",
                    "To increase property prices",
                    "To limit population growth",
                ],
                correctAnswer: 1,
                explanation:
                    "Urban zoning organizes land use (residential, commercial, industrial) to ensure orderly development, reduce conflicts, and promote sustainable growth.",
            },
            "16": {
                question:
                    "What is a city's primary environmental responsibility?",
                options: [
                    "Monitoring global climate change only",
                    "Managing local waste, air, and water quality",
                    "Protecting wildlife in other countries",
                    "Regulating international trade",
                ],
                correctAnswer: 1,
                explanation:
                    "Cities are responsible for local environmental management including waste disposal, air quality monitoring, and water resource protection.",
            },
            "17": {
                question:
                    "How should cities coordinate public safety effectively?",
                options: [
                    "Rely only on national police",
                    "Integrate local police, fire, medical, and emergency services",
                    "Hire private security companies only",
                    "Depend on volunteer groups exclusively",
                ],
                correctAnswer: 1,
                explanation:
                    "Effective public safety requires coordinated integration of police, fire departments, medical services, and emergency response systems.",
            },
            "18": {
                question:
                    "Why is cultural heritage preservation important for cities?",
                options: [
                    "It only benefits tourists",
                    "It preserves identity, promotes tourism, and educates citizens",
                    "It increases construction costs",
                    "It prevents modern development",
                ],
                correctAnswer: 1,
                explanation:
                    "Cultural heritage preservation maintains local identity, attracts tourism, provides educational value, and contributes to community pride.",
            },
            "19": {
                question: "What is the city government's role in healthcare?",
                options: [
                    "Replace all private hospitals",
                    "Provide basic health services and coordinate public health programs",
                    "Only handle medical emergencies",
                    "Focus solely on health insurance",
                ],
                correctAnswer: 1,
                explanation:
                    "City governments provide basic health services, operate public health facilities, and coordinate disease prevention and health promotion programs.",
            },
            "20": {
                question: "What demonstrates effective city leadership?",
                options: [
                    "Making all decisions without consultation",
                    "Transparent governance, citizen participation, and inter-agency coordination",
                    "Focusing only on economic development",
                    "Avoiding difficult decisions",
                ],
                correctAnswer: 1,
                explanation:
                    "Effective city leadership involves transparent governance, meaningful citizen participation, and coordinated efforts across all city departments.",
            },
        };

        return (
            quizzes[missionId as keyof typeof quizzes] || {
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

        return () => {
            EventBus.off("show-mission", handleShowMission);
            EventBus.off("show-notification", handleGameNotification);
            EventBus.off("open-quest-log", handleOpenQuestLog);
            EventBus.off("update-daily-challenge", handleDailyChallengeUpdate);
        };
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-sky-300 via-blue-200 to-green-300">
            {/* React UI Components */}
            {showMainMenu && (
                <MainMenu
                    onStartGame={handleStartGame}
                    onLoadGame={handleLoadGame}
                    onShowSettings={handleShowSettings}
                    onShowExtras={handleShowExtras}
                    onShowCredits={handleShowCredits}
                    onShowLeaderboard={handleShowLeaderboard}
                    onExit={handleExit}
                />
            )}
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
                        : "/city-background.png"
                }
            />

            {/* Debug Panel for Development */}
            <GameDebugPanel />
        </div>
    );
}

export default App;
