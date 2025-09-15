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

        // CIVIKA game assets (using colored rectangles as placeholders)
        this.load.image("background", "bg.png");

        // Create placeholder sprites for the game
        this.createPlaceholderSprites();
    }

    createPlaceholderSprites() {
        // Create a simple colored rectangle for player sprite
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x00ff00);
        playerGraphics.fillRect(0, 0, 32, 32);
        playerGraphics.generateTexture("player", 32, 32);
        playerGraphics.destroy();

        // Create a simple colored rectangle for NPC sprite
        const npcGraphics = this.add.graphics();
        npcGraphics.fillStyle(0x4169e1);
        npcGraphics.fillRect(0, 0, 24, 24);
        npcGraphics.generateTexture("npc", 24, 24);
        npcGraphics.destroy();
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Don't start MainMenu automatically - React will handle the UI
        //  Just emit ready event so React knows assets are loaded
        this.events.emit("preloader-complete");
    }
}

