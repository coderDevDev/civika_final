import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    startButton: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor() {
        super("MainMenu");
    }

    create() {
        // This scene is now handled by React components
        // Clear the scene to prevent any Phaser UI from showing
        this.scene.stop();
        EventBus.emit("current-scene-ready", this);
    }

    createPokemonBackground() {
        // Create gradient background effect
        const graphics = this.add.graphics();

        // Sky gradient
        graphics.fillGradientStyle(0x87ceeb, 0x87ceeb, 0x98d8e8, 0x98d8e8, 1);
        graphics.fillRect(0, 0, 1024, 400);

        // Ground gradient
        graphics.fillGradientStyle(0x90ee90, 0x90ee90, 0x7cfc00, 0x7cfc00, 1);
        graphics.fillRect(0, 400, 1024, 368);

        // Add some decorative elements
        this.add.rectangle(100, 100, 60, 60, 0xffd700, 0.3).setDepth(1);
        this.add.rectangle(900, 150, 40, 40, 0xff6b6b, 0.3).setDepth(1);
        this.add.rectangle(800, 300, 50, 50, 0x4ecdc4, 0.3).setDepth(1);
        this.add.rectangle(200, 600, 70, 70, 0xff9f43, 0.3).setDepth(1);
    }

    createPokemonButton() {
        // Button background with Pokémon-style border
        const buttonBg = this.add.rectangle(512, 500, 200, 60, 0x4ecdc4);
        buttonBg.setStrokeStyle(4, 0x2e86ab);
        buttonBg.setDepth(99);

        // Button text
        this.startButton = this.add
            .text(512, 500, "START GAME", {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#FFFFFF",
                stroke: "#2E86AB",
                strokeThickness: 3,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive()
            .on("pointerdown", () => this.startGame())
            .on("pointerover", () => {
                this.startButton.setColor("#FFD700");
                buttonBg.setFillStyle(0xff6b6b);
                buttonBg.setStrokeStyle(4, 0xffd700);
            })
            .on("pointerout", () => {
                this.startButton.setColor("#FFFFFF");
                buttonBg.setFillStyle(0x4ecdc4);
                buttonBg.setStrokeStyle(4, 0x2e86ab);
            });
    }

    startGame() {
        this.scene.start("CharacterCreation");
    }

    changeScene() {
        this.startGame();
    }

    moveLogo(reactCallback: ({ x, y }: { x: number; y: number }) => void) {
        // Keep this for compatibility but it's not used in CIVIKA
        if (reactCallback) {
            reactCallback({
                x: Math.floor(this.logo.x),
                y: Math.floor(this.logo.y),
            });
        }
    }
}

