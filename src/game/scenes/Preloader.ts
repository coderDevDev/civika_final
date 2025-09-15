import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");

        this.load.image("logo", "logo.png");
        this.load.image("star", "star.png");

        // CIVIKA game assets
        this.load.image("background", "bg.png");

        // Load student sprite assets
        this.loadStudentSprites();
    }

    loadStudentSprites() {
        // Load student sprites for different directions
        this.load.setPath("assets/student-sprites");
        console.log("Loading student sprites from: assets/student-sprites");

        // Front sprites
        this.load.image(
            "student-front-1",
            "front/front-1-removebg-preview.png"
        );
        this.load.image(
            "student-front-2",
            "front/front-2-removebg-preview.png"
        );
        this.load.image(
            "student-front-3",
            "front/front-3-removebg-preview.png"
        );
        this.load.image(
            "student-front-4",
            "front/front-4-removebg-preview.png"
        );

        // Back sprites
        this.load.image("student-back-1", "back/back1-removebg-preview.png");
        this.load.image("student-back-2", "back/back2-removebg-preview.png");
        this.load.image("student-back-3", "back/back3-removebg-preview.png");
        this.load.image("student-back-4", "back/back4-removebg-preview.png");

        // Left sprites
        this.load.image("student-left-1", "left/left1-removebg-preview.png");
        this.load.image("student-left-2", "left/left2-removebg-preview.png");
        this.load.image("student-left-3", "left/left3-removebg-preview.png");
        this.load.image("student-left-4", "left/left4-removebg-preview.png");

        // Right sprites
        this.load.image("student-right-1", "right/1.png");
        this.load.image("student-right-2", "right/2.png");
        this.load.image("student-right-3", "right/3.png");
        this.load.image("student-right-4", "right/4.png");

        // Create placeholder sprites for NPCs (keep simple for now)
        this.createPlaceholderSprites();
    }

    createPlaceholderSprites() {
        // Create a simple colored rectangle for NPC sprite
        const npcGraphics = this.add.graphics();
        npcGraphics.fillStyle(0x4169e1);
        npcGraphics.fillRect(0, 0, 24, 24);
        npcGraphics.generateTexture("npc", 24, 24);
        npcGraphics.destroy();

        // Create a simple colored rectangle for player sprite fallback
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x00ff00); // Green color
        playerGraphics.fillRect(0, 0, 32, 32);
        playerGraphics.generateTexture("player", 32, 32);
        playerGraphics.destroy();
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        console.log("Preloader create() called - all assets should be loaded");
        console.log(
            "Student front-1 texture exists:",
            this.textures.exists("student-front-1")
        );
        console.log(
            "Player fallback texture exists:",
            this.textures.exists("player")
        );

        //  Don't start MainMenu automatically - React will handle the UI
        //  Just emit ready event so React knows assets are loaded
        this.events.emit("preloader-complete");
    }
}

