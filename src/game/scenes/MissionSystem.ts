import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class MissionSystem extends Scene {
    background: GameObjects.Rectangle;
    title: GameObjects.Text;
    description: GameObjects.Text;
    npcName: GameObjects.Text;
    startButton: GameObjects.Text;
    closeButton: GameObjects.Text;
    missionData: any;

    // Mission definitions based on the prompt
    missions = {
        1: {
            name: "Basura Patrol",
            npc: "Barangay Tanod",
            description:
                "Help clean the streets. Talk to 3 residents about proper segregation.",
            reward: "Eco-Kabataan Badge + 20 coins",
            task: "Talk to 3 residents about waste segregation",
            quiz: {
                question:
                    "Which of the following is classified as biodegradable waste?",
                options: [
                    "Plastic bottle",
                    "Banana peel",
                    "Aluminum can",
                    "Glass jar",
                ],
                correct: 1,
            },
        },
        2: {
            name: "Taga Rehistro",
            npc: "COMELEC Volunteer",
            description: "Assist in a voter registration drive simulation.",
            reward: "Registered Voter Badge + 15 coins",
            task: "Help with voter registration process",
            quiz: {
                question:
                    "What is the minimum age to register and vote in the Philippines?",
                options: ["16", "17", "18", "21"],
                correct: 2,
            },
        },
        3: {
            name: "Kapitbahay Ko, Alamin Ko",
            npc: "Elderly Resident",
            description: "Interview 3 NPCs about their role in the barangay.",
            reward: "Community Explorer Badge + Map access to hidden area",
            task: "Interview 3 NPCs about their barangay roles",
            quiz: {
                question: "What is the main duty of a Barangay Captain?",
                options: [
                    "Clean streets",
                    "Approve national laws",
                    "Lead barangay governance and implement ordinances",
                    "Collect taxes for the BIR",
                ],
                correct: 2,
            },
        },
        4: {
            name: "Ordinansa Time",
            npc: "Barangay Secretary",
            description:
                "Read the local barangay ordinance and attend a mock public hearing.",
            reward: "Law Reader Badge + Unlock new quest options",
            task: "Read ordinance and attend public hearing",
            quiz: {
                question:
                    "Which of the following is an example of a barangay ordinance?",
                options: [
                    "Increase in national income tax",
                    "Road widening for highways",
                    "Curfew for minors",
                    "National ID registration",
                ],
                correct: 2,
            },
        },
        5: {
            name: "Fake or Fact?",
            npc: "High School Student",
            description:
                "Spot and report 3 fake news posts on the town bulletin board.",
            reward: "Digital Defender Badge + 30 coins",
            task: "Identify and report 3 fake news posts",
            quiz: {
                question: "How can you verify if news online is fake?",
                options: [
                    "If it has many likes",
                    "If a celebrity shares it",
                    "By checking official sources or fact-checking websites",
                    "If it matches your opinion",
                ],
                correct: 2,
            },
        },
        6: {
            name: "Serbisyo Seryoso",
            npc: "Construction Foreman",
            description: "Fix potholes by choosing correct barangay services.",
            reward: "Public Service Aide Badge + 1 time-based bonus item",
            task: "Fix potholes using correct services",
            quiz: {
                question:
                    "Which barangay official is responsible for implementing local projects?",
                options: [
                    "Barangay Treasurer",
                    "Barangay Kagawad",
                    "City Mayor",
                    "Barangay Clerk",
                ],
                correct: 1,
            },
        },
        7: {
            name: "Ayusin Natin 'To!",
            npc: "Mediation Officer",
            description:
                "Mediate a conflict between two NPCs (e.g. noise complaint).",
            reward: "Peacekeeper Badge + unlock secret dialogue paths",
            task: "Mediate conflict between neighbors",
            quiz: {
                question:
                    "What is the best first step in resolving neighbor conflicts?",
                options: [
                    "Shout at them",
                    "Post on social media",
                    "Talk calmly or seek mediation",
                    "Ignore it completely",
                ],
                correct: 2,
            },
        },
        8: {
            name: "Civic Memory Hunt",
            npc: "Librarian",
            description: "Find lost historical documents in the library.",
            reward: "Historian Badge + collectible lore item",
            task: "Find historical documents in library",
            quiz: {
                question:
                    "What year was the current Philippine Constitution ratified?",
                options: ["1898", "1945", "1973", "1987"],
                correct: 3,
            },
        },
        9: {
            name: "Kabataang Kalusugan",
            npc: "Barangay Health Worker",
            description: "Distribute vitamins and create awareness posters.",
            reward: "Health Advocate Badge + bonus healing item",
            task: "Distribute vitamins and create health posters",
            quiz: {
                question:
                    "Which of the following is a common barangay health service?",
                options: [
                    "Surgery",
                    "Blood donation and immunization",
                    "Ambulance repair",
                    "Pharmacy sales",
                ],
                correct: 1,
            },
        },
        10: {
            name: "Pagpupulong ng Barangay",
            npc: "Barangay Captain",
            description: "Attend and speak in a mock barangay assembly.",
            reward: "Youth Leader Badge + unlock pathway to Municipality Map",
            task: "Attend and participate in barangay assembly",
            quiz: {
                question: "What should you do during a barangay meeting?",
                options: [
                    "Shout your opinions",
                    "Sleep silently",
                    "Listen, respect turns, and speak politely",
                    "Record secretly without consent",
                ],
                correct: 2,
            },
        },
    };

    constructor() {
        super("MissionSystem");
    }

    init(data: any) {
        this.missionData = data;
    }

    create() {
        // Pokémon-style background overlay
        this.background = this.add.rectangle(
            512,
            384,
            1024,
            768,
            0x000000,
            0.7
        );

        // Pokémon-style mission panel
        this.createPokemonMissionPanel();

        EventBus.emit("current-scene-ready", this);
    }

    createPokemonMissionPanel() {
        // Panel background with Pokémon styling
        const panel = this.add.rectangle(512, 384, 650, 550, 0x2e86ab);
        panel.setStrokeStyle(6, 0xffd700);
        panel.setDepth(100);

        // Panel shadow
        const shadow = this.add.rectangle(515, 387, 650, 550, 0x000000, 0.3);
        shadow.setDepth(99);

        // Title with Pokémon styling
        this.title = this.add
            .text(512, 200, this.missions[this.missionData.missionId].name, {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#FFD700",
                stroke: "#FFFFFF",
                strokeThickness: 5,
                align: "center",
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

        // NPC name with Pokémon styling
        this.npcName = this.add
            .text(
                512,
                250,
                `NPC: ${this.missions[this.missionData.missionId].npc}`,
                {
                    fontFamily: "Arial Black",
                    fontSize: 20,
                    color: "#4ECDC4",
                    stroke: "#000000",
                    strokeThickness: 3,
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(101);

        // Description with Pokémon styling
        this.description = this.add
            .text(
                512,
                320,
                this.missions[this.missionData.missionId].description,
                {
                    fontFamily: "Arial",
                    fontSize: 18,
                    color: "#FFFFFF",
                    stroke: "#000000",
                    strokeThickness: 2,
                    align: "center",
                    wordWrap: { width: 580 },
                }
            )
            .setOrigin(0.5)
            .setDepth(101);

        // Reward with Pokémon styling
        this.add
            .text(
                512,
                400,
                `Reward: ${this.missions[this.missionData.missionId].reward}`,
                {
                    fontFamily: "Arial Black",
                    fontSize: 18,
                    color: "#FF6B6B",
                    stroke: "#FFFFFF",
                    strokeThickness: 3,
                    align: "center",
                    shadow: {
                        offsetX: 2,
                        offsetY: 2,
                        color: "#000000",
                        blur: 4,
                        fill: true,
                    },
                }
            )
            .setOrigin(0.5)
            .setDepth(101);

        // Pokémon-style buttons
        this.createPokemonButtons();
    }

    createPokemonButtons() {
        // Start button with Pokémon styling
        const startBg = this.add.rectangle(512, 470, 200, 50, 0x26de81);
        startBg.setStrokeStyle(4, 0x2e86ab);
        startBg.setDepth(100);

        this.startButton = this.add
            .text(512, 470, "START MISSION", {
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
            .on("pointerdown", () => this.startMission())
            .on("pointerover", () => {
                this.startButton.setColor("#FFD700");
                startBg.setFillStyle(0xff6b6b);
                startBg.setStrokeStyle(4, 0xffd700);
            })
            .on("pointerout", () => {
                this.startButton.setColor("#FFFFFF");
                startBg.setFillStyle(0x26de81);
                startBg.setStrokeStyle(4, 0x2e86ab);
            });

        // Close button with Pokémon styling
        const closeBg = this.add.rectangle(512, 530, 150, 40, 0xff6b6b);
        closeBg.setStrokeStyle(3, 0x2e86ab);
        closeBg.setDepth(100);

        this.closeButton = this.add
            .text(512, 530, "CLOSE", {
                fontFamily: "Arial Black",
                fontSize: 16,
                color: "#FFFFFF",
                stroke: "#2E86AB",
                strokeThickness: 2,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(101)
            .setInteractive()
            .on("pointerdown", () => this.closeMission())
            .on("pointerover", () => {
                this.closeButton.setColor("#FFD700");
                closeBg.setFillStyle(0x4ecdc4);
                closeBg.setStrokeStyle(3, 0xffd700);
            })
            .on("pointerout", () => {
                this.closeButton.setColor("#FFFFFF");
                closeBg.setFillStyle(0xff6b6b);
                closeBg.setStrokeStyle(3, 0x2e86ab);
            });
    }

    startMission() {
        // Simulate mission completion (in a real game, this would be more complex)
        this.simulateMissionCompletion();
    }

    simulateMissionCompletion() {
        // Show mission completion message
        this.add
            .text(512, 350, "Mission Completed!", {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#00FF00",
                stroke: "#000000",
                strokeThickness: 2,
                align: "center",
            })
            .setOrigin(0.5);

        // Start quiz
        this.time.delayedCall(2000, () => {
            this.scene.launch("QuizSystem", {
                missionId: this.missionData.missionId,
                quiz: this.missions[this.missionData.missionId].quiz,
            });
        });
    }

    closeMission() {
        this.scene.stop();
    }
}
