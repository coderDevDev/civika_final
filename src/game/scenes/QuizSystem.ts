import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class QuizSystem extends Scene {
    background: GameObjects.Rectangle;
    questionText: GameObjects.Text;
    options: GameObjects.Text[] = [];
    optionBackgrounds: GameObjects.Rectangle[] = [];
    selectedOption: number = -1;
    submitButton: GameObjects.Text;
    resultText: GameObjects.Text;
    quizData: any;
    missionId: number;

    // NEW: Multiple questions support
    quizQuestions: any[] = [];
    currentQuestionIndex: number = 0;
    correctAnswersCount: number = 0;
    totalQuestions: number = 0;
    progressText: GameObjects.Text | null = null;

    constructor() {
        super("QuizSystem");
    }

    init(data: any) {
        this.missionId = data.missionId;
        
        // Support both array and single object for backward compatibility
        if (Array.isArray(data.quiz)) {
            this.quizQuestions = data.quiz;
        } else {
            // Convert single question to array for backward compatibility
            this.quizQuestions = [data.quiz];
        }
        
        this.totalQuestions = this.quizQuestions.length;
        this.currentQuestionIndex = 0;
        this.correctAnswersCount = 0;
        this.quizData = this.quizQuestions[0];
        
        console.log(`Quiz initialized: ${this.totalQuestions} questions for Mission ${this.missionId}`);
    }

    create() {
        // Pokémon-style background overlay
        this.background = this.add.rectangle(
            512,
            384,
            1024,
            768,
            0x000000,
            0.8
        );

        // Pokémon-style quiz panel
        this.createPokemonQuizPanel();

        EventBus.emit("current-scene-ready", this);
    }

    createPokemonQuizPanel() {
        // Panel background with Pokémon styling
        const panel = this.add.rectangle(512, 384, 750, 650, 0x2e86ab);
        panel.setStrokeStyle(6, 0xffd700);
        panel.setDepth(100);

        // Panel shadow
        const shadow = this.add.rectangle(515, 387, 750, 650, 0x000000, 0.3);
        shadow.setDepth(99);

        // Progress indicator
        this.progressText = this.add
            .text(
                512,
                150,
                `Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}`,
                {
                    fontFamily: "Arial Black",
                    fontSize: 18,
                    color: "#4ECDC4",
                    stroke: "#000000",
                    strokeThickness: 3,
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(101);

        // Question with Pokémon styling
        this.questionText = this.add
            .text(512, 200, this.quizData.question, {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#FFD700",
                stroke: "#FFFFFF",
                strokeThickness: 4,
                align: "center",
                wordWrap: { width: 680 },
                shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    color: "#000000",
                    blur: 6,
                    fill: true,
                },
            })
            .setOrigin(0.5)
            .setDepth(101);

        // Options with Pokémon styling
        this.createPokemonOptions();

        // Submit button with Pokémon styling
        this.createPokemonSubmitButton();
    }

    createPokemonOptions() {
        const startY = 280;
        const spacing = 60;

        this.quizData.options.forEach((option: string, index: number) => {
            // Option background
            const optionBg = this.add.rectangle(
                512,
                startY + index * spacing,
                600,
                50,
                0x4ecdc4
            );
            optionBg.setStrokeStyle(3, 0x2e86ab);
            optionBg.setDepth(100);

            // Store reference to background
            this.optionBackgrounds.push(optionBg);

            const optionText = this.add
                .text(
                    512,
                    startY + index * spacing,
                    `${String.fromCharCode(65 + index)}. ${option}`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 18,
                        color: "#FFFFFF",
                        stroke: "#2E86AB",
                        strokeThickness: 2,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(101)
                .setInteractive()
                .on("pointerdown", () => this.selectOption(index))
                .on("pointerover", () => {
                    optionText.setColor("#FFD700");
                    optionBg.setFillStyle(0xff6b6b);
                    optionBg.setStrokeStyle(3, 0xffd700);
                })
                .on("pointerout", () => {
                    if (this.selectedOption !== index) {
                        optionText.setColor("#FFFFFF");
                        optionBg.setFillStyle(0x4ecdc4);
                        optionBg.setStrokeStyle(3, 0x2e86ab);
                    }
                });

            this.options.push(optionText);
        });
    }

    createPokemonSubmitButton() {
        // Submit button background
        const submitBg = this.add.rectangle(512, 500, 250, 50, 0x26de81);
        submitBg.setStrokeStyle(4, 0x2e86ab);
        submitBg.setDepth(100);

        this.submitButton = this.add
            .text(512, 500, "SUBMIT ANSWER", {
                fontFamily: "Arial Black",
                fontSize: 20,
                color: "#FFFFFF",
                stroke: "#2E86AB",
                strokeThickness: 3,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(101)
            .setInteractive()
            .on("pointerdown", () => this.submitAnswer())
            .on("pointerover", () => {
                this.submitButton.setColor("#FFD700");
                submitBg.setFillStyle(0xff6b6b);
                submitBg.setStrokeStyle(4, 0xffd700);
            })
            .on("pointerout", () => {
                this.submitButton.setColor("#FFFFFF");
                submitBg.setFillStyle(0x26de81);
                submitBg.setStrokeStyle(4, 0x2e86ab);
            });
    }

    createOptions() {
        const startY = 280;
        const spacing = 50;

        this.quizData.options.forEach((option: string, index: number) => {
            const optionText = this.add
                .text(
                    512,
                    startY + index * spacing,
                    `${String.fromCharCode(65 + index)}. ${option}`,
                    {
                        fontFamily: "Arial",
                        fontSize: 16,
                        color: "#FFFFFF",
                        stroke: "#000000",
                        strokeThickness: 1,
                        align: "center",
                        backgroundColor: "#4169E1",
                        padding: { x: 15, y: 8 },
                    }
                )
                .setOrigin(0.5)
                .setInteractive()
                .on("pointerdown", () => this.selectOption(index))
                .on("pointerover", () => optionText.setColor("#FFD700"))
                .on("pointerout", () => {
                    if (this.selectedOption !== index) {
                        optionText.setColor("#FFFFFF");
                    }
                });

            this.options.push(optionText);
        });
    }

    selectOption(index: number) {
        this.selectedOption = index;

        // Update visual selection with Pokémon styling
        this.options.forEach((option, i) => {
            if (i === index) {
                option.setColor("#FFD700");
                // Use stored reference to background
                if (this.optionBackgrounds[i]) {
                    this.optionBackgrounds[i].setFillStyle(0xffd700);
                    this.optionBackgrounds[i].setStrokeStyle(3, 0xff6b6b);
                }
            } else {
                option.setColor("#FFFFFF");
                // Use stored reference to background
                if (this.optionBackgrounds[i]) {
                    this.optionBackgrounds[i].setFillStyle(0x4ecdc4);
                    this.optionBackgrounds[i].setStrokeStyle(3, 0x2e86ab);
                }
            }
        });
    }

    submitAnswer() {
        if (this.selectedOption === -1) {
            this.showMessage("Please select an answer!");
            return;
        }

        const isCorrect = this.selectedOption === this.quizData.correct;

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    handleCorrectAnswer() {
        this.correctAnswersCount++;
        
        // Check if there are more questions
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            // Show "Correct!" message with progress
            this.resultText = this.add
                .text(
                    512,
                    350,
                    `Correct! (${this.currentQuestionIndex + 1}/${this.totalQuestions})`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 24,
                        color: "#00FF00",
                        stroke: "#000000",
                        strokeThickness: 2,
                        align: "center",
                    }
                )
                .setOrigin(0.5)
                .setDepth(102);
            
            // Move to next question after delay
            this.time.delayedCall(1500, () => {
                this.loadNextQuestion();
            });
        } else {
            // All questions completed - show final success
            this.resultText = this.add
                .text(
                    512,
                    350,
                    `Perfect! ${this.correctAnswersCount}/${this.totalQuestions} Correct!`,
                    {
                        fontFamily: "Arial Black",
                        fontSize: 24,
                        color: "#00FF00",
                        stroke: "#000000",
                        strokeThickness: 2,
                        align: "center",
                    }
                )
                .setOrigin(0.5);
            
            // Award badge and coins
            this.awardReward();
            
            // Close quiz after delay
            this.time.delayedCall(2000, () => {
                this.scene.stop();
            });
        }
    }

    handleIncorrectAnswer() {
        // Show failure message
        this.resultText = this.add
            .text(
                512,
                350,
                `Incorrect! Score: ${this.correctAnswersCount}/${this.totalQuestions}`,
                {
                    fontFamily: "Arial Black",
                    fontSize: 24,
                    color: "#FF0000",
                    stroke: "#000000",
                    strokeThickness: 2,
                    align: "center",
                }
            )
            .setOrigin(0.5);

        // Show correct answer
        const correctAnswer = this.add
            .text(
                512,
                380,
                `Correct answer: ${String.fromCharCode(
                    65 + this.quizData.correct
                )}. ${this.quizData.options[this.quizData.correct]}`,
                {
                    fontFamily: "Arial",
                    fontSize: 16,
                    color: "#FFFFFF",
                    stroke: "#000000",
                    strokeThickness: 1,
                    align: "center",
                }
            )
            .setOrigin(0.5);

        // Fail the mission - close quiz after delay
        this.time.delayedCall(3000, () => {
            this.scene.stop();
        });
    }

    loadNextQuestion() {
        // Clear previous UI elements
        this.children.removeAll();
        
        // Reset selection
        this.selectedOption = -1;
        this.options = [];
        this.optionBackgrounds = [];
        
        // Move to next question
        this.currentQuestionIndex++;
        this.quizData = this.quizQuestions[this.currentQuestionIndex];
        
        console.log(`Loading question ${this.currentQuestionIndex + 1}/${this.totalQuestions}`);
        
        // Recreate the quiz panel with new question
        this.background = this.add.rectangle(
            512,
            384,
            1024,
            768,
            0x000000,
            0.8
        );
        this.createPokemonQuizPanel();
    }

    awardReward() {
        // Get current progress
        const badges = this.registry.get("badges") || [];
        const coins = this.registry.get("coins") || 0;
        const completedMissions = this.registry.get("completedMissions") || [];

        // Mission rewards
        const missionRewards = {
            1: { badge: "Eco-Kabataan", coins: 20 },
            2: { badge: "Registered Voter", coins: 15 },
            3: { badge: "Community Explorer", coins: 0 },
            4: { badge: "Law Reader", coins: 0 },
            5: { badge: "Digital Defender", coins: 30 },
            6: { badge: "Public Service Aide", coins: 0 },
            7: { badge: "Peacekeeper", coins: 0 },
            8: { badge: "Historian", coins: 0 },
            9: { badge: "Health Advocate", coins: 0 },
            10: { badge: "Youth Leader", coins: 0 },
        };

        const reward = missionRewards[this.missionId];

        // Add badge if not already earned
        if (!badges.includes(reward.badge)) {
            badges.push(reward.badge);
            this.registry.set("badges", badges);
        }

        // Add coins
        this.registry.set("coins", coins + reward.coins);

        // Mark mission as completed
        if (!completedMissions.includes(this.missionId)) {
            completedMissions.push(this.missionId);
            this.registry.set("completedMissions", completedMissions);
        }

        // Emit event to notify React of data change
        EventBus.emit("game-data-updated");

        // Check if player can proceed to next level
        this.checkProgression();
    }

    checkProgression() {
        const badges = this.registry.get("badges") || [];
        const completedMissions = this.registry.get("completedMissions") || [];

        if (badges.length >= 8 && completedMissions.length >= 8) {
            // Show final challenge option
            this.time.delayedCall(2000, () => {
                this.showFinalChallenge();
            });
        }
    }

    showFinalChallenge() {
        const challengeText = this.add
            .text(
                512,
                420,
                "You've earned enough badges! Ready for the final Barangay Civic Challenge?",
                {
                    fontFamily: "Arial",
                    fontSize: 16,
                    color: "#FFD700",
                    stroke: "#000000",
                    strokeThickness: 2,
                    align: "center",
                    wordWrap: { width: 600 },
                }
            )
            .setOrigin(0.5);

        const challengeButton = this.add
            .text(512, 480, "TAKE FINAL CHALLENGE", {
                fontFamily: "Arial Black",
                fontSize: 18,
                color: "#FFFFFF",
                stroke: "#000000",
                strokeThickness: 2,
                align: "center",
                backgroundColor: "#FF4500",
                padding: { x: 20, y: 10 },
            })
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerdown", () => this.startFinalChallenge())
            .on("pointerover", () => challengeButton.setColor("#FFD700"))
            .on("pointerout", () => challengeButton.setColor("#FFFFFF"));
    }

    startFinalChallenge() {
        // This would start the final 5-question civic exam
        this.scene.stop();
        // In a full implementation, you'd launch a final exam scene here
    }

    showMessage(text: string) {
        const messageBox = this.add.rectangle(512, 550, 600, 50, 0x000000, 0.8);
        const messageText = this.add
            .text(512, 550, text, {
                fontFamily: "Arial",
                fontSize: 16,
                color: "#FFFFFF",
                align: "center",
            })
            .setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            messageBox.destroy();
            messageText.destroy();
        });
    }
}
