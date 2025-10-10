import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { GameStateManager } from "../../utils/GameStateManager";

export class BarangayMap extends Scene {
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: any;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    groundLayer: Phaser.Tilemaps.TilemapLayer;
    buildingsLayer: Phaser.Tilemaps.TilemapLayer;
    collisionLayer: Phaser.Tilemaps.TilemapLayer;
    npcs: Phaser.Physics.Arcade.Group;
    ui: GameObjects.Container;
    questLog: GameObjects.Text;
    coinsText: GameObjects.Text;
    badgesText: GameObjects.Text;
    mapButton: GameObjects.Text;
    isUIVisible: boolean = false;
    interactionPrompt: GameObjects.Text;
    nearbyNPC: any = null;
    // Unlimited open world - no tile restrictions
    tileSize: number = 32; // Keep for reference but not used for boundaries
    mapWidth: number = 1000; // Large world width (unlimited)
    mapHeight: number = 1000; // Large world height (unlimited)
    lastDirection: string = "front"; // Track last direction for idle sprites

    // Mobile controls
    virtualJoystick: any = null;
    isMobile: boolean = false;
    touchControls: any = null;

    // Background image reference
    backgroundImage: any = null;

    // Mission indicators for real-time updates
    missionIndicators: Map<number, any> = new Map();

    // NPC glow effects for interaction feedback
    npcGlowEffects: Map<number, any> = new Map();

    // Location display above player head
    locationDisplay: GameObjects.Text | null = null;

    // Collectible items system
    collectibles: Phaser.Physics.Arcade.Group | null = null;
    collectibleItems: Map<string, any> = new Map(); // Store collectible sprites by ID

    // Minimap/Radar system
    minimap: GameObjects.Container | null = null;
    minimapBackground: GameObjects.Graphics | null = null;
    minimapPlayerDot: GameObjects.Circle | null = null;
    minimapNPCDots: GameObjects.Circle[] = [];
    minimapCollectibleDots: GameObjects.Circle[] = [];

    // Mission locations with tile coordinates
    missionLocations = [
        {
            x: 6,
            y: 9,
            name: "Basura Patrol",
            npc: "Barangay Tanod",
            missionId: 1,
            percentX: 87, // Background-relative percentage X
            percentY: 52, // Background-relative percentage
        },
        {
            x: 12,
            y: 6,
            name: "Taga Rehistro",
            npc: "COMELEC Volunteer",
            missionId: 2,
            percentX: 50, // Background-relative percentage X
            percentY: 22, // Background-relative percentag
        },
        {
            x: 18,
            y: 12,
            name: "Kapitbahay Ko",
            npc: "Elderly Resident",
            missionId: 3,
            percentX: 8, // Background-relative percentage X
            percentY: 27, // Background-relative percentag
        },
        {
            x: 9,
            y: 15,
            name: "Ordinansa Time",
            npc: "Barangay Secretary",
            missionId: 4,
            percentX: 40, // Background-relative percentage X
            percentY: 22, // Background-relative percentag
        },
        {
            x: 21,
            y: 6,
            name: "Fake or Fact?",
            npc: "High School Student",
            missionId: 5,
            percentX: 11, // Background-relative percentage X
            percentY: 13, // Background-relative percentag
        },
        {
            x: 3,
            y: 18,
            name: "Serbisyo Seryoso",
            npc: "Construction Foreman",
            missionId: 6,
            percentX: 10, // Background-relative percentage X
            percentY: 67, // Background-relative percentag
        },
        {
            x: 15,
            y: 18,
            name: "Ayusin Natin 'To",
            npc: "Mediation Officer",
            missionId: 7,
            percentX: 89, // Background-relative percentage X
            percentY: 13, // Background-relative percentag
        },
        {
            x: 25,
            y: 12,
            name: "Civic Memory Hunt",
            npc: "Librarian",
            missionId: 8,
            percentX: 72, // Background-relative percentage X
            percentY: 22, // Background-relative percentage
        },
        {
            x: 6,
            y: 3,
            name: "Kabataang Kalusugan",
            npc: "Barangay Health Worker",
            missionId: 9,
            percentX: 59, // Background-relative percentage X
            percentY: 54, // Background-relative percentage Y
        },
        {
            x: 12,
            y: 12,
            name: "Pagpupulong ng Barangay",
            npc: "Barangay Captain",
            missionId: 10,
            percentX: 29, // Background-relative percentage X
            percentY: 21, // Background-relative percentage
        },
    ];

    // Collectible items for Barangay (Level 1)
    collectibleItemsData = [
        {
            id: "barangay-coin-1",
            type: "coin",
            name: "Civic Coin",
            description: "A shiny coin representing civic pride",
            value: 5,
            points: 10,
            rarity: "common",
            percentX: 25,
            percentY: 35,
            icon: "💰",
        },
        {
            id: "barangay-coin-2",
            type: "coin",
            name: "Civic Coin",
            description: "A shiny coin representing civic pride",
            value: 5,
            points: 10,
            rarity: "common",
            percentX: 75,
            percentY: 65,
            icon: "💰",
        },
        {
            id: "barangay-coin-3",
            type: "coin",
            name: "Civic Coin",
            description: "A shiny coin representing civic pride",
            value: 5,
            points: 10,
            rarity: "common",
            percentX: 45,
            percentY: 80,
            icon: "💰",
        },
        {
            id: "barangay-badge-1",
            type: "badge",
            name: "Community Badge",
            description: "A special badge for active citizens",
            value: 10,
            points: 25,
            rarity: "uncommon",
            percentX: 15,
            percentY: 50,
            icon: "🏅",
        },
        {
            id: "barangay-badge-2",
            type: "badge",
            name: "Community Badge",
            description: "A special badge for active citizens",
            value: 10,
            points: 25,
            rarity: "uncommon",
            percentX: 85,
            percentY: 35,
            icon: "🏅",
        },
        {
            id: "barangay-treasure-1",
            type: "treasure",
            name: "Barangay Treasure",
            description: "A rare treasure hidden in the barangay",
            value: 25,
            points: 50,
            rarity: "rare",
            percentX: 50,
            percentY: 50,
            icon: "💎",
        },
        {
            id: "barangay-powerup-1",
            type: "powerup",
            name: "Civic Power",
            description: "Boosts your civic engagement",
            value: 15,
            points: 30,
            rarity: "uncommon",
            percentX: 30,
            percentY: 70,
            icon: "⚡",
        },
        {
            id: "barangay-powerup-2",
            type: "powerup",
            name: "Civic Power",
            description: "Boosts your civic engagement",
            value: 15,
            points: 30,
            rarity: "uncommon",
            percentX: 70,
            percentY: 30,
            icon: "⚡",
        },
    ];

    constructor() {
        super("BarangayMap");
    }

    create() {
        // Create background image
        this.createBackground();

        // Note: Tile textures and tile map are disabled since we're using background image

        // Create collision areas for buildings (since we're not using tiles)
        // this.createCollisionAreas();

        // Create player with collision (will be positioned relative to background)
        this.createPlayer();

        // Create NPCs
        this.createNPCs();

        // Create UI
        this.createUI();

        // Create location display above player head
        this.createLocationDisplay();

        // Remove ALL camera bounds for truly unlimited movement
        // Player can move infinitely in all directions
        this.cameras.main.setBounds(
            -Infinity, // Unlimited movement to the left
            -Infinity, // Unlimited movement up
            Infinity, // Unlimited movement to the right
            Infinity // Unlimited movement down
        );

        // Ensure camera follows player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // Force camera to center on player initially
        this.cameras.main.centerOn(this.player.x, this.player.y);

        // Ensure camera follows after a short delay
        this.time.delayedCall(100, () => {
            this.cameras.main.startFollow(this.player);
            this.optimizeCameraForOpenWorld(); // Optimize for open world style
            console.log("Camera follow restarted after delay");
            console.log("=== OPEN WORLD CAMERA SETUP ===");
            console.log("Player position:", this.player.x, this.player.y);
            console.log(
                "Camera position:",
                this.cameras.main.x,
                this.cameras.main.y
            );
            console.log("Camera following:", this.cameras.main.follow);
            console.log("Map bounds:", this.cameras.main.getBounds());
            console.log("===============================");
        });

        // Mobile-specific camera settings for open world style
        if (this.isMobile) {
            // Open world camera settings - smooth following with small deadzone
            this.cameras.main.setLerp(0.08, 0.08); // Smooth camera scrolling
            this.cameras.main.setDeadzone(20, 20); // Small deadzone for responsive scrolling
            console.log("Open world camera settings applied for mobile");
        } else {
            // Desktop open world camera settings
            this.cameras.main.setLerp(0.1, 0.1); // Smooth camera scrolling
            this.cameras.main.setDeadzone(40, 40); // Medium deadzone for desktop
            console.log("Open world camera settings applied for desktop");
        }

        console.log("Camera setup complete with INFINITE unlimited bounds:");
        console.log("- Bounds:", this.cameras.main.getBounds());
        console.log("- Following player:", this.cameras.main.follow);
        console.log("- Player position:", this.player.x, this.player.y);
        console.log(
            "- Camera position:",
            this.cameras.main.x,
            this.cameras.main.y
        );
        console.log(
            "- INFINITE OPEN WORLD - player can move infinitely in ALL directions!"
        );

        // Debug camera and scene info
        console.log("=== CAMERA DEBUG INFO ===");
        console.log(
            "Camera position:",
            this.cameras.main.x,
            this.cameras.main.y
        );
        console.log("Camera bounds:", this.cameras.main.getBounds());
        console.log("Camera zoom:", this.cameras.main.zoom);
        console.log("Player position:", this.player.x, this.player.y);
        console.log(
            "Map size:",
            this.mapWidth * this.tileSize,
            "x",
            this.mapHeight * this.tileSize
        );
        console.log("Scene visible:", this.scene.isVisible());
        console.log("Scene active:", this.scene.isActive());
        console.log("=========================");

        // Detect mobile device - use multiple methods for better detection
        this.isMobile =
            this.sys.game.device.input.touch ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) ||
            window.innerWidth <= 768;
        console.log("Mobile device detected:", this.isMobile);
        console.log("Touch support:", this.sys.game.device.input.touch);
        console.log("User agent:", navigator.userAgent);
        console.log("Window width:", window.innerWidth);
        console.log(
            "Screen dimensions:",
            this.cameras.main.width,
            "x",
            this.cameras.main.height
        );

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys("W,S,A,D");

        // Set up interaction key
        this.input.keyboard.on("keydown-SPACE", () =>
            this.interactWithNearbyNPC()
        );

        // Create location display after player is created (with delay to ensure player exists)
        this.time.delayedCall(200, () => {
            if (this.player && !this.locationDisplay) {
                this.createLocationDisplay();
            }
        });

        // Create minimap after everything is loaded
        this.time.delayedCall(400, () => {
            this.createMinimap();
        });

        // Listen for mobile interaction events from React
        this.game.events.on("mobile-interact", () => {
            this.interactWithNearbyNPC();
        });

        // Mobile controls are now handled by React overlay
        console.log("Mobile device detected:", this.isMobile);
        console.log("Mobile controls handled by React overlay");

        // Add resize handler for screen size and orientation changes
        this.scale.on("resize", this.handleResize, this);
        this.scale.on("orientationchange", this.handleResize, this);

        EventBus.emit("current-scene-ready", this);
    }

    // Method to update NPC indicators in real-time
    updateNPCIndicators() {
        const gameStateManager = GameStateManager.getInstance();

        this.missionLocations.forEach((location) => {
            const indicator = this.missionIndicators.get(location.missionId);

            if (indicator) {
                let indicatorText = `Mission #${location.missionId}`;
                let indicatorColor = "#FFD700"; // Gold for available

                if (gameStateManager.isMissionCompleted(location.missionId)) {
                    indicatorText = "✓";
                    indicatorColor = "#32CD32"; // Lime green for completed
                } else if (
                    !gameStateManager.canAccessMission(location.missionId)
                ) {
                    indicatorText = "🔒";
                    indicatorColor = "#DC143C"; // Crimson red for locked
                }

                indicator.setText(indicatorText);
                indicator.setColor(indicatorColor);
            }
        });

        console.log("NPC indicators updated in real-time");
    }

    // Method to activate/deactivate NPC glow effect
    activateNPCGlow(missionId: number, activate: boolean) {
        const glowData = this.npcGlowEffects.get(missionId);
        if (!glowData) return;

        const { interactiveGlow, npc } = glowData;

        if (activate && !glowData.isAnimating) {
            // Start glowing animation
            interactiveGlow.setVisible(true);
            glowData.isAnimating = true;

            // Create pulsing glow animation
            glowData.animationTween = this.tweens.add({
                targets: interactiveGlow,
                alpha: { from: 0.3, to: 0.8 },
                scaleX: { from: 1, to: 1.2 },
                scaleY: { from: 1, to: 1.2 },
                duration: 800,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
                onStart: () => {
                    console.log(`Activated glow for NPC Mission #${missionId}`);
                },
            });

            // Add slight NPC highlight effect
            this.tweens.add({
                targets: npc,
                alpha: { from: 1, to: 0.9 },
                duration: 400,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });
        } else if (!activate && glowData.isAnimating) {
            // Stop glowing animation
            interactiveGlow.setVisible(false);
            glowData.isAnimating = false;

            // Stop and cleanup animations
            if (glowData.animationTween) {
                glowData.animationTween.destroy();
                glowData.animationTween = null;
            }

            // Stop NPC highlight effect
            this.tweens.killTweensOf(npc);
            npc.setAlpha(1); // Reset NPC alpha

            console.log(`Deactivated glow for NPC Mission #${missionId}`);
        }
    }

    // Method to ensure camera follows player
    ensureCameraFollowing() {
        if (this.player && this.cameras.main.follow !== this.player) {
            console.log("Restarting camera follow...");
            this.cameras.main.startFollow(this.player);
        }
    }

    // Open world camera scrolling optimization
    optimizeCameraForOpenWorld() {
        if (this.player) {
            // Remove ALL camera bounds for truly unlimited movement
            // Player can move infinitely in all directions
            this.cameras.main.setBounds(
                -Infinity, // Unlimited movement to the left
                -Infinity, // Unlimited movement up
                Infinity, // Unlimited movement to the right
                Infinity // Unlimited movement down
            );

            // Smooth camera following for open world exploration
            this.cameras.main.setLerp(0.08, 0.08);
            this.cameras.main.setDeadzone(25, 25);

            console.log("Open world camera optimized with INFINITE bounds");
            console.log("Player position:", this.player.x, this.player.y);
            console.log("Camera bounds:", this.cameras.main.getBounds());
        }
    }

    // Handle background scaling for orientation changes
    updateBackgroundForOrientation() {
        // Find the background image and update its scale
        const children = this.children.list;
        for (let child of children) {
            if (child.texture && child.texture.key === "barangay-bg-root") {
                const gameWidth = this.scale.width;
                const gameHeight = this.scale.height;

                // Scale background to cover the entire Phaser game canvas
                const scaleToCoverWidth = gameWidth / child.width;
                const scaleToCoverHeight = gameHeight / child.height;

                // Use the larger scale to ensure the image covers the entire game canvas
                const scaleX = Math.max(scaleToCoverWidth, scaleToCoverHeight);
                const scaleY = scaleX; // Keep aspect ratio

                child.setScale(scaleX, scaleY);
                child.setPosition(gameWidth / 2, gameHeight / 2);

                console.log(
                    "Background rescaled to cover entire Phaser game canvas:"
                );
                console.log(
                    "Game canvas dimensions:",
                    gameWidth,
                    "x",
                    gameHeight
                );
                console.log(
                    "Image dimensions:",
                    child.width,
                    "x",
                    child.height
                );
                console.log(
                    "Scale factors:",
                    scaleToCoverWidth,
                    scaleToCoverHeight
                );
                console.log("Final scale:", scaleX, scaleY);
                break;
            }
        }
    }

    createBackground() {
        console.log("Creating background...");
        console.log(
            "Barangay background texture exists:",
            this.textures.exists("barangay-bg")
        );
        console.log(
            "Barangay background root texture exists:",
            this.textures.exists("barangay-bg-root")
        );

        // If textures don't exist, load them directly
        if (!this.textures.exists("barangay-bg-root")) {
            console.log("Textures not loaded, loading them now...");
            this.load.image("barangay-bg-root", "barangay-background.png");
            this.load.start();

            this.load.once("complete", () => {
                console.log("Textures loaded, creating background...");
                this.createBackgroundImage();
            });
        } else {
            // Wait a bit for textures to be fully loaded
            this.time.delayedCall(100, () => {
                this.createBackgroundImage();
            });
        }
    }

    createBackgroundImage() {
        console.log("Creating background image after delay...");
        console.log(
            "Barangay background root texture exists now:",
            this.textures.exists("barangay-bg-root")
        );

        // Create background image as the main visual element
        if (this.textures.exists("barangay-bg-root")) {
            console.log("Using root barangay background image...");
            console.log(
                "Texture details:",
                this.textures.get("barangay-bg-root")
            );
            console.log(
                "barangay-bg-root texture source:",
                this.textures.get("barangay-bg-root").source
            );
            console.log(
                "barangay-bg-root texture width/height:",
                this.textures.get("barangay-bg-root").source.width,
                this.textures.get("barangay-bg-root").source.height
            );

            try {
                // Get Phaser game canvas dimensions for perfect coverage
                const gameWidth = this.scale.width;
                const gameHeight = this.scale.height;
                const gameCenterX = gameWidth / 2;
                const gameCenterY = gameHeight / 2;
                const isLandscape = gameWidth > gameHeight;

                const bgImage = this.add.image(
                    gameCenterX,
                    gameCenterY,
                    "barangay-bg-root"
                );
                bgImage.setOrigin(0.5, 0.5);
                bgImage.setDepth(-2000); // Much further behind everything

                // Scale background to cover the entire Phaser game canvas
                // This ensures the image fills the game canvas completely
                const scaleToCoverWidth = gameWidth / bgImage.width;
                const scaleToCoverHeight = gameHeight / bgImage.height;

                // Use the larger scale to ensure the image covers the entire game canvas
                const scaleX = Math.max(scaleToCoverWidth, scaleToCoverHeight);
                const scaleY = scaleX; // Keep aspect ratio

                // Ensure minimum scale for very small screens
                const minScale = 0.1;
                const finalScaleX = Math.max(scaleX, minScale);
                const finalScaleY = Math.max(scaleY, minScale);

                console.log(
                    "Background scaling to cover entire Phaser game canvas:"
                );
                console.log(
                    "Game canvas dimensions:",
                    gameWidth,
                    "x",
                    gameHeight
                );
                // console.log(
                //     "Massive world dimensions:",
                //     worldWidth,
                //     "x",
                //     worldHeight
                // );
                console.log(
                    "Image dimensions:",
                    bgImage.width,
                    "x",
                    bgImage.height
                );
                console.log(
                    "Scale factors:",
                    scaleToCoverWidth,
                    scaleToCoverHeight
                );
                console.log("Calculated scale:", scaleX, scaleY);
                console.log("Final scale:", finalScaleX, finalScaleY);

                bgImage.setScale(finalScaleX, finalScaleY);

                // Position background to cover the entire Phaser game canvas
                bgImage.setPosition(gameWidth / 2, gameHeight / 2);

                // Store the background reference for future updates
                this.backgroundImage = bgImage;

                bgImage.setAlpha(1); // Fully visible
                bgImage.setVisible(true); // Explicitly set visible
                console.log("Root background image created successfully");

                // Reposition player relative to background if player already exists
                if (this.player) {
                    this.repositionPlayerRelativeToBackground();
                }

                // Reposition NPCs relative to background if they already exist
                this.repositionNPCsRelativeToBackground();

                // Create collectibles after background is ready
                this.time.delayedCall(300, () => {
                    this.createCollectibles();
                });
                console.log(
                    "Game canvas dimensions:",
                    gameWidth,
                    "x",
                    gameHeight
                );
                console.log(
                    "Orientation:",
                    isLandscape ? "Landscape" : "Portrait"
                );
                console.log(
                    "Game canvas dimensions:",
                    gameWidth,
                    "x",
                    gameHeight
                );
                console.log("Game canvas center:", gameCenterX, gameCenterY);
                console.log("Background position:", bgImage.x, bgImage.y);
                console.log("Background scale:", scaleX, scaleY);
                console.log("Background visible:", bgImage.visible);
            } catch (error) {
                console.error("Error creating root background image:", error);
                // Fallback to teal background if image fails
                const mapWidth = this.mapWidth * this.tileSize;
                const mapHeight = this.mapHeight * this.tileSize;
                const mapCenterX = mapWidth / 2;
                const mapCenterY = mapHeight / 2;

                const bg = this.add.rectangle(
                    mapCenterX,
                    mapCenterY,
                    mapWidth,
                    mapHeight,
                    0x20b2aa
                );
                bg.setDepth(-2000);
                console.log("Using fallback teal background for entire map");
            }
        } else {
            console.log(
                "Barangay background texture not found, using fallback"
            );
            // Create a teal background as fallback for entire map
            const mapWidth = this.mapWidth * this.tileSize;
            const mapHeight = this.mapHeight * this.tileSize;
            const mapCenterX = mapWidth / 2;
            const mapCenterY = mapHeight / 2;

            const bg = this.add.rectangle(
                mapCenterX,
                mapCenterY,
                mapWidth,
                mapHeight,
                0x20b2aa
            );
            bg.setDepth(-2000);
        }
    }

    createCollisionAreas() {
        console.log("Creating collision areas for buildings...");

        // Create invisible collision rectangles for buildings
        // These should match the building positions in your background image
        const buildingCollisions = [
            // Barangay Hall (center)
            {
                x: 16 * this.tileSize,
                y: 8 * this.tileSize,
                width: 4 * this.tileSize,
                height: 3 * this.tileSize,
            },
            // Health Center (top-left)
            {
                x: 4 * this.tileSize,
                y: 4 * this.tileSize,
                width: 3 * this.tileSize,
                height: 2 * this.tileSize,
            },
            // School (top-right)
            {
                x: 24 * this.tileSize,
                y: 4 * this.tileSize,
                width: 4 * this.tileSize,
                height: 3 * this.tileSize,
            },
            // Market (bottom-left)
            {
                x: 4 * this.tileSize,
                y: 16 * this.tileSize,
                width: 3 * this.tileSize,
                height: 2 * this.tileSize,
            },
            // Library (bottom-right)
            {
                x: 24 * this.tileSize,
                y: 16 * this.tileSize,
                width: 3 * this.tileSize,
                height: 2 * this.tileSize,
            },
            // Residential areas
            {
                x: 8 * this.tileSize,
                y: 12 * this.tileSize,
                width: 2 * this.tileSize,
                height: 2 * this.tileSize,
            },
            {
                x: 20 * this.tileSize,
                y: 12 * this.tileSize,
                width: 2 * this.tileSize,
                height: 2 * this.tileSize,
            },
        ];

        // buildingCollisions.forEach((building, index) => {
        //     const collision = this.add.rectangle(
        //         building.x + building.width / 2,
        //         building.y + building.height / 2,
        //         building.width,
        //         building.height,
        //         0x000000,
        //         0 // Invisible
        //     );
        //     this.physics.add.existing(collision, true);
        //     collision.body.setSize(building.width, building.height);
        //     console.log(
        //         `Building collision ${index + 1} created at (${building.x}, ${
        //             building.y
        //         })`
        //     );
        // });
    }

    createTileTextures() {
        // Create individual tile textures

        // Grass tile
        const grassGraphics = this.add.graphics();
        grassGraphics.fillStyle(0x90ee90);
        grassGraphics.fillRect(0, 0, 32, 32);
        grassGraphics.strokeRect(0, 0, 32, 32, 0x7cfc00, 1);
        grassGraphics.generateTexture("grass", 32, 32);
        grassGraphics.destroy();

        // Path tile
        const pathGraphics = this.add.graphics();
        pathGraphics.fillStyle(0xd2b48c);
        pathGraphics.fillRect(0, 0, 32, 32);
        pathGraphics.strokeRect(0, 0, 32, 32, 0x8b4513, 1);
        pathGraphics.generateTexture("path", 32, 32);
        pathGraphics.destroy();

        // Water tile
        const waterGraphics = this.add.graphics();
        waterGraphics.fillStyle(0x87ceeb);
        waterGraphics.fillRect(0, 0, 32, 32);
        waterGraphics.strokeRect(0, 0, 32, 32, 0x4682b4, 1);
        waterGraphics.generateTexture("water", 32, 32);
        waterGraphics.destroy();

        // Tree tile
        const treeGraphics = this.add.graphics();
        treeGraphics.fillStyle(0x228b22);
        treeGraphics.fillRect(0, 0, 32, 32);
        treeGraphics.strokeRect(0, 0, 32, 32, 0x006400, 2);
        treeGraphics.generateTexture("tree", 32, 32);
        treeGraphics.destroy();

        // Create building icons
        this.createBuildingIcons();
    }

    createBuildingIcons() {
        // Barangay Hall (🏛️)
        const barangayHallGraphics = this.add.graphics();
        barangayHallGraphics.fillStyle(0x4169e1);
        barangayHallGraphics.fillRect(0, 0, 32, 32);
        barangayHallGraphics.strokeRect(0, 0, 32, 32, 0x1e3a8a, 2);
        // Add building details
        barangayHallGraphics.fillStyle(0xffffff);
        barangayHallGraphics.fillRect(4, 8, 24, 16);
        barangayHallGraphics.fillStyle(0x4169e1);
        barangayHallGraphics.fillRect(6, 10, 20, 12);
        barangayHallGraphics.generateTexture("barangay_hall", 32, 32);
        barangayHallGraphics.destroy();

        // Health Center (🏥)
        const healthCenterGraphics = this.add.graphics();
        healthCenterGraphics.fillStyle(0xff6b6b);
        healthCenterGraphics.fillRect(0, 0, 32, 32);
        healthCenterGraphics.strokeRect(0, 0, 32, 32, 0xdc2626, 2);
        // Add cross symbol
        healthCenterGraphics.fillStyle(0xffffff);
        healthCenterGraphics.fillRect(14, 8, 4, 16);
        healthCenterGraphics.fillRect(8, 14, 16, 4);
        healthCenterGraphics.generateTexture("health_center", 32, 32);
        healthCenterGraphics.destroy();

        // Library (📚)
        const libraryGraphics = this.add.graphics();
        libraryGraphics.fillStyle(0x8b4513);
        libraryGraphics.fillRect(0, 0, 32, 32);
        libraryGraphics.strokeRect(0, 0, 32, 32, 0x654321, 2);
        // Add book details
        libraryGraphics.fillStyle(0xffd700);
        libraryGraphics.fillRect(6, 8, 4, 16);
        libraryGraphics.fillRect(12, 8, 4, 16);
        libraryGraphics.fillRect(18, 8, 4, 16);
        libraryGraphics.fillRect(24, 8, 4, 16);
        libraryGraphics.generateTexture("library", 32, 32);
        libraryGraphics.destroy();

        // Market (🏪)
        const marketGraphics = this.add.graphics();
        marketGraphics.fillStyle(0xffa500);
        marketGraphics.fillRect(0, 0, 32, 32);
        marketGraphics.strokeRect(0, 0, 32, 32, 0xff8c00, 2);
        // Add market details
        marketGraphics.fillStyle(0xffffff);
        marketGraphics.fillRect(4, 12, 24, 8);
        marketGraphics.fillStyle(0xffa500);
        marketGraphics.fillRect(6, 14, 4, 4);
        marketGraphics.fillRect(12, 14, 4, 4);
        marketGraphics.fillRect(18, 14, 4, 4);
        marketGraphics.fillRect(24, 14, 4, 4);
        marketGraphics.generateTexture("market", 32, 32);
        marketGraphics.destroy();

        // Park (🌳)
        const parkGraphics = this.add.graphics();
        parkGraphics.fillStyle(0x228b22);
        parkGraphics.fillRect(0, 0, 32, 32);
        parkGraphics.strokeRect(0, 0, 32, 32, 0x006400, 2);
        // Add tree details
        parkGraphics.fillStyle(0x8b4513);
        parkGraphics.fillRect(14, 16, 4, 12);
        parkGraphics.fillStyle(0x32cd32);
        parkGraphics.fillCircle(16, 12, 8);
        parkGraphics.generateTexture("park", 32, 32);
        parkGraphics.destroy();

        // Covered Court (🏟️)
        const courtGraphics = this.add.graphics();
        courtGraphics.fillStyle(0x708090);
        courtGraphics.fillRect(0, 0, 32, 32);
        courtGraphics.strokeRect(0, 0, 32, 32, 0x2f4f4f, 2);
        // Add court lines
        courtGraphics.fillStyle(0xffffff);
        courtGraphics.fillRect(2, 2, 28, 2);
        courtGraphics.fillRect(2, 28, 28, 2);
        courtGraphics.fillRect(2, 2, 2, 28);
        courtGraphics.fillRect(28, 2, 2, 28);
        courtGraphics.fillRect(14, 2, 2, 28);
        courtGraphics.generateTexture("covered_court", 32, 32);
        courtGraphics.destroy();

        // Mediation Kubo (🏠)
        const kuboGraphics = this.add.graphics();
        kuboGraphics.fillStyle(0x8b4513);
        kuboGraphics.fillRect(0, 0, 32, 32);
        kuboGraphics.strokeRect(0, 0, 32, 32, 0x654321, 2);
        // Add roof
        kuboGraphics.fillStyle(0xdc143c);
        kuboGraphics.fillTriangle(16, 4, 4, 16, 28, 16);
        kuboGraphics.fillStyle(0x8b4513);
        kuboGraphics.fillRect(6, 16, 20, 12);
        kuboGraphics.generateTexture("mediation_kubo", 32, 32);
        kuboGraphics.destroy();

        // Sari-Sari Store (🏪)
        const storeGraphics = this.add.graphics();
        storeGraphics.fillStyle(0xffd700);
        storeGraphics.fillRect(0, 0, 32, 32);
        storeGraphics.strokeRect(0, 0, 32, 32, 0xff8c00, 2);
        // Add store details
        storeGraphics.fillStyle(0xffffff);
        storeGraphics.fillRect(4, 8, 24, 16);
        storeGraphics.fillStyle(0xffd700);
        storeGraphics.fillRect(6, 10, 4, 4);
        storeGraphics.fillRect(12, 10, 4, 4);
        storeGraphics.fillRect(18, 10, 4, 4);
        storeGraphics.fillRect(24, 10, 4, 4);
        storeGraphics.generateTexture("sari_sari_store", 32, 32);
        storeGraphics.destroy();

        // Residential Area (🏘️)
        const residentialGraphics = this.add.graphics();
        residentialGraphics.fillStyle(0x87ceeb);
        residentialGraphics.fillRect(0, 0, 32, 32);
        residentialGraphics.strokeRect(0, 0, 32, 32, 0x4682b4, 2);
        // Add house details
        residentialGraphics.fillStyle(0xffffff);
        residentialGraphics.fillRect(6, 12, 8, 12);
        residentialGraphics.fillRect(18, 12, 8, 12);
        residentialGraphics.fillStyle(0xdc143c);
        residentialGraphics.fillTriangle(10, 8, 6, 12, 14, 12);
        residentialGraphics.fillTriangle(22, 8, 18, 12, 26, 12);
        residentialGraphics.generateTexture("residential", 32, 32);
        residentialGraphics.destroy();

        // Basura Zone (🗑️)
        const basuraGraphics = this.add.graphics();
        basuraGraphics.fillStyle(0x696969);
        basuraGraphics.fillRect(0, 0, 32, 32);
        basuraGraphics.strokeRect(0, 0, 32, 32, 0x2f4f4f, 2);
        // Add trash can details
        basuraGraphics.fillStyle(0xffffff);
        basuraGraphics.fillRect(12, 8, 8, 16);
        basuraGraphics.fillStyle(0x696969);
        basuraGraphics.fillRect(13, 9, 6, 14);
        basuraGraphics.fillStyle(0xff0000);
        basuraGraphics.fillRect(14, 10, 4, 2);
        basuraGraphics.generateTexture("basura_zone", 32, 32);
        basuraGraphics.destroy();
    }

    createTileMap() {
        // Create a simple tilemap using individual tile sprites
        // this.createSimpleTileMap();
        // // Add building labels
        // this.addBuildingLabels();
    }

    createSimpleTileMap() {
        // Create ground tiles
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const worldX = x * this.tileSize;
                const worldY = y * this.tileSize;

                // Determine tile type
                let tileType = "grass";
                let isCollision = false;

                // Create paths
                if (
                    x === 0 ||
                    x === this.mapWidth - 1 ||
                    y === 0 ||
                    y === this.mapHeight - 1
                ) {
                    tileType = "path";
                } else if (x % 4 === 0 || y % 4 === 0) {
                    tileType = "path";
                }

                // Place buildings
                const buildingType = this.isBuildingLocation(x, y);
                if (buildingType) {
                    tileType = buildingType;
                    isCollision = true;
                }

                // Add some trees
                if (
                    Math.random() < 0.05 &&
                    tileType === "grass" &&
                    !isCollision
                ) {
                    tileType = "tree";
                    isCollision = true;
                }

                // Create tile sprite
                const tile = this.add.sprite(
                    worldX + this.tileSize / 2,
                    worldY + this.tileSize / 2,
                    tileType
                );
                tile.setOrigin(0.5);

                // Add collision for buildings and trees
                if (isCollision) {
                    this.physics.add.existing(tile, true);
                    tile.body.setSize(this.tileSize, this.tileSize);
                }
            }
        }
    }

    generateMapData() {
        // Create a 32x24 tile map
        const mapData = [];

        for (let y = 0; y < this.mapHeight; y++) {
            const row = [];
            for (let x = 0; x < this.mapWidth; x++) {
                // Ground layer (0 = grass, 1 = path, 2 = water)
                let groundTile = 0; // Default to grass

                // Create paths
                if (
                    x === 0 ||
                    x === this.mapWidth - 1 ||
                    y === 0 ||
                    y === this.mapHeight - 1
                ) {
                    groundTile = 1; // Path around edges
                } else if (x % 4 === 0 || y % 4 === 0) {
                    groundTile = 1; // Path grid
                }

                // Buildings layer (0 = empty, 3 = building, 4 = tree)
                let buildingTile = 0;

                // Collision layer (0 = walkable, 1 = blocked)
                let collisionTile = 0;

                // Place buildings based on mission locations
                if (this.isBuildingLocation(x, y)) {
                    buildingTile = 3; // Building tile
                    collisionTile = 1;
                }

                // Add some trees for decoration
                if (
                    Math.random() < 0.05 &&
                    groundTile === 0 &&
                    buildingTile === 0
                ) {
                    buildingTile = 4; // Tree tile
                    collisionTile = 1;
                }

                row.push([groundTile, buildingTile, collisionTile]);
            }
            mapData.push(row);
        }

        return mapData;
    }

    isBuildingLocation(x: number, y: number) {
        // Define building locations based on mission locations
        const buildingLocations = [
            {
                x: 6,
                y: 9,
                width: 3,
                height: 2,
                name: "Basura Zone",
                type: "basura_zone",
            },
            {
                x: 12,
                y: 6,
                width: 3,
                height: 2,
                name: "Sari-Sari Store",
                type: "sari_sari_store",
            },
            {
                x: 18,
                y: 12,
                width: 3,
                height: 2,
                name: "Residential Area",
                type: "residential",
            },
            {
                x: 9,
                y: 15,
                width: 3,
                height: 2,
                name: "Public Market",
                type: "market",
            },
            { x: 21, y: 6, width: 3, height: 2, name: "Park", type: "park" },
            {
                x: 3,
                y: 18,
                width: 3,
                height: 2,
                name: "Covered Court",
                type: "covered_court",
            },
            {
                x: 15,
                y: 18,
                width: 3,
                height: 2,
                name: "Mediation Kubo",
                type: "mediation_kubo",
            },
            {
                x: 25,
                y: 12,
                width: 3,
                height: 2,
                name: "Community Library",
                type: "library",
            },
            {
                x: 20,
                y: 3,
                width: 3,
                height: 2,
                name: "Health Center",
                type: "health_center",
            },
            {
                x: 12,
                y: 12,
                width: 4,
                height: 3,
                name: "Barangay Hall",
                type: "barangay_hall",
            },
        ];

        for (const building of buildingLocations) {
            if (
                x >= building.x &&
                x < building.x + building.width &&
                y >= building.y &&
                y < building.y + building.height
            ) {
                return building.type;
            }
        }
        return false;
    }

    addBuildingLabels() {
        const buildingLocations = [
            { x: 6, y: 9, name: "Basura Zone" },
            { x: 12, y: 6, name: "Sari-Sari Store" },
            { x: 18, y: 12, name: "Residential Area" },
            { x: 9, y: 15, name: "Public Market" },
            { x: 21, y: 6, name: "Park" },
            { x: 3, y: 18, name: "Covered Court" },
            { x: 15, y: 18, name: "Mediation Kubo" },
            { x: 25, y: 12, name: "Community Library" },
            { x: 20, y: 3, name: "Health Centerdexmiranda" },
            { x: 12, y: 12, name: "Barangay Hall" },
        ];

        buildingLocations.forEach((building) => {
            const worldX = building.x * this.tileSize + this.tileSize / 2;
            const worldY = building.y * this.tileSize - 10;

            this.add
                .text(worldX, worldY, building.name, {
                    fontFamily: "Arial Black",
                    fontSize: 12,
                    color: "#FFFFFF",
                    stroke: "#000000",
                    strokeThickness: 2,
                    align: "center",
                    shadow: {
                        offsetX: 1,
                        offsetY: 1,
                        color: "#000000",
                        blur: 2,
                        fill: true,
                    },
                })
                .setOrigin(0.5)
                .setDepth(100);
        });
    }

    createPlayer() {
        // Check if student sprite texture exists, otherwise use a fallback
        const playerTexture = this.textures.exists("student-front-1")
            ? "student-front-1"
            : "player";

        console.log("Creating player with texture:", playerTexture);
        console.log(
            "Student texture exists:",
            this.textures.exists("student-front-1")
        );

        // Calculate player position relative to background image
        let playerX, playerY;

        if (this.backgroundImage) {
            // Position relative to background image center
            // Use percentage-based positioning (e.g., 50% of background width/height)
            const bgWidth = this.backgroundImage.displayWidth;
            const bgHeight = this.backgroundImage.displayHeight;
            const bgX = this.backgroundImage.x;
            const bgY = this.backgroundImage.y;

            // Spawn player at center of background image
            playerX = bgX;
            playerY = bgY;

            console.log(
                "Player spawning at background center:",
                playerX,
                playerY
            );
            console.log("Background dimensions:", bgWidth, bgHeight);
            console.log("Background position:", bgX, bgY);
        } else {
            // Fallback to original position if background not ready
            playerX = 16 * this.tileSize;
            playerY = 12 * this.tileSize;
            console.log("Using fallback player position:", playerX, playerY);
        }

        this.player = this.physics.add.sprite(playerX, playerY, playerTexture);
        // Remove world bounds collision for unlimited movement
        this.player.setCollideWorldBounds(false);
        this.player.setScale(0.2); // Much smaller scale for student sprites

        console.log(
            "Player created with UNLIMITED movement - no world bounds collision"
        );

        // Temporarily disable color tinting for student sprites
        // const playerColor = this.registry.get("playerColor") || 0x00ff00;
        // this.player.setTint(playerColor);

        // Add collision with buildings and trees
        this.physics.add.collider(this.player, this.physics.world.staticBodies);

        // Check if student sprite textures are loaded before creating animations
        if (this.textures.exists("student-front-1")) {
            console.log("Student sprites loaded, creating animations...");
            this.createPlayerAnimations();

            // Set initial idle animation after a short delay to ensure animations are ready
            this.time.delayedCall(100, () => {
                console.log("Attempting to set initial idle animation...");
                console.log(
                    "Animation exists:",
                    this.anims.exists("student-front-idle")
                );
                if (this.anims.exists("student-front-idle")) {
                    this.player.play("student-front-idle", true);
                    console.log("Initial idle animation set successfully!");
                } else {
                    console.log(
                        "Animation not found, skipping initial animation"
                    );
                }
            });
        } else {
            console.log(
                "Student sprites not loaded yet, skipping animation creation"
            );
            // Retry after a short delay
            this.time.delayedCall(500, () => {
                if (this.textures.exists("student-front-1")) {
                    console.log(
                        "Student sprites now loaded, creating animations..."
                    );
                    this.createPlayerAnimations();
                }
            });
        }
    }

    createPlayerAnimations() {
        console.log("Creating player animations...");

        // Check if all required textures exist
        const requiredTextures = [
            "student-front-1",
            "student-front-2",
            "student-front-3",
            "student-front-4",
            "student-back-1",
            "student-back-2",
            "student-back-3",
            "student-back-4",
            "student-left-1",
            "student-left-2",
            "student-left-3",
            "student-left-4",
            "student-right-1",
            "student-right-2",
            "student-right-3",
            "student-right-4",
        ];

        for (const texture of requiredTextures) {
            if (!this.textures.exists(texture)) {
                console.error(`Required texture ${texture} not found!`);
                return;
            }
        }

        console.log("All required textures found, creating animations...");

        // Front animations
        this.anims.create({
            key: "student-front-walk",
            frames: [
                { key: "student-front-1" },
                { key: "student-front-2" },
                { key: "student-front-3" },
                { key: "student-front-4" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        // Back animations
        this.anims.create({
            key: "student-back-walk",
            frames: [
                { key: "student-back-1" },
                { key: "student-back-2" },
                { key: "student-back-3" },
                { key: "student-back-4" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        // Left animations
        this.anims.create({
            key: "student-left-walk",
            frames: [
                { key: "student-left-1" },
                { key: "student-left-2" },
                { key: "student-left-3" },
                { key: "student-left-4" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        // Right animations
        this.anims.create({
            key: "student-right-walk",
            frames: [
                { key: "student-right-1" },
                { key: "student-right-2" },
                { key: "student-right-3" },
                { key: "student-right-4" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        // Idle animations (single frame)
        this.anims.create({
            key: "student-front-idle",
            frames: [{ key: "student-front-1" }],
            frameRate: 1,
        });

        this.anims.create({
            key: "student-back-idle",
            frames: [{ key: "student-back-1" }],
            frameRate: 1,
        });

        this.anims.create({
            key: "student-left-idle",
            frames: [{ key: "student-left-1" }],
            frameRate: 1,
        });

        this.anims.create({
            key: "student-right-idle",
            frames: [{ key: "student-right-1" }],
            frameRate: 1,
        });

        console.log("Player animations created successfully!");
    }

    createNPCs() {
        this.npcs = this.physics.add.group();

        // Debug: List all available textures
        console.log(
            "Available textures in BarangayMap:",
            Object.keys(this.textures.list)
        );

        // Map NPC names to their corresponding image keys
        const npcImageMap = {
            "Barangay Captain": "barangay-captain",
            "Barangay Health Worker": "barangay-health-worker",
            "Barangay Secretary": "barangay-secretary",
            "Barangay Tanod": "barangay-tanod",
            "COMELEC Volunteer": "comelec-volunteer",
            "Construction Foreman": "construction-foreman",
            "Elderly Resident": "elderly-resident",
            "High School Student": "high-school-student",
            Librarian: "librarian",
            "Mediation Officer": "mediation-officer",
        };

        // Check if NPC images are loaded, if not load them directly
        const npcImages = Object.values(npcImageMap);
        const missingImages = npcImages.filter(
            (img) => !this.textures.exists(img)
        );

        if (missingImages.length > 0) {
            console.log(
                "Missing NPC images, loading them directly:",
                missingImages
            );
            missingImages.forEach((img) => {
                this.load.image(img, `assets/LEVEL1/${img}.png`);
            });
            this.load.start();

            this.load.once("complete", () => {
                console.log("NPC images loaded, creating NPCs...");
                this.createNPCsAfterLoad(npcImageMap);
            });
            return;
        }

        this.createNPCsAfterLoad(npcImageMap);
    }

    createNPCsAfterLoad(npcImageMap: any) {
        this.missionLocations.forEach((location, index) => {
            // Use percentage coordinates if available, otherwise fallback to tile coordinates
            let worldX, worldY;

            if (
                location.percentX !== undefined &&
                location.percentY !== undefined
            ) {
                // Use background-relative percentage coordinates
                const coords = this.percentageToWorldCoordinates(
                    location.percentX,
                    location.percentY
                );
                worldX = coords.x;
                worldY = coords.y;
                console.log(
                    `NPC ${location.npc} positioned at (${location.percentX}%, ${location.percentY}%) = (${worldX}, ${worldY})`
                );
            } else {
                // Fallback to tile-based coordinates
                worldX = location.x * this.tileSize + this.tileSize / 2;
                worldY = location.y * this.tileSize + this.tileSize / 2;
                console.log(
                    `NPC ${location.npc} positioned at tile (${location.x}, ${location.y}) = (${worldX}, ${worldY})`
                );
            }

            // Get the specific NPC image for this character
            const npcImageKey = npcImageMap[location.npc] || "student-front-1";

            console.log(
                `Creating NPC: ${location.npc} with image: ${npcImageKey}`
            );
            console.log(
                `Texture exists for ${npcImageKey}:`,
                this.textures.exists(npcImageKey)
            );

            // Use fallback if texture doesn't exist
            const finalImageKey = this.textures.exists(npcImageKey)
                ? npcImageKey
                : "student-front-1";

            console.log(`Using image: ${finalImageKey} for ${location.npc}`);

            const npc = this.physics.add.sprite(worldX, worldY, finalImageKey);
            npc.setScale(0.2); // Same scale as player for consistent sizing
            npc.setInteractive();

            // Set up collision body for NPC - make it static from the start
            npc.body.setSize(npc.width * 0.8, npc.height * 0.8); // Slightly smaller collision box
            npc.body.setOffset(npc.width * 0.1, npc.height * 0.1); // Center the collision box
            npc.body.setImmovable(true); // Make NPCs static so they don't move when player collides
            npc.body.setGravity(0, 0); // Remove gravity
            npc.body.setVelocity(0, 0); // Stop any movement
            npc.body.setAngularVelocity(0); // Stop any rotation

            console.log(`NPC ${location.npc} collision body set up:`, {
                width: npc.body.width,
                height: npc.body.height,
                offsetX: npc.body.offset.x,
                offsetY: npc.body.offset.y,
                immovable: npc.body.immovable,
            });

            // Add NPC name with better styling
            const npcName = this.add
                .text(worldX, worldY - 35, location.npc, {
                    fontFamily: "Arial Black",
                    fontSize: 11,
                    color: "#FFFFFF",
                    stroke: "#000000",
                    strokeThickness: 2,
                    align: "center",
                    shadow: {
                        offsetX: 1,
                        offsetY: 1,
                        color: "#000000",
                        blur: 2,
                        fill: true,
                    },
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Add mission indicator with validation-based styling
            const gameStateManager = GameStateManager.getInstance();
            let indicatorText = "!";
            let indicatorColor = "#FFD700"; // Gold for available

            if (gameStateManager.isMissionCompleted(location.missionId)) {
                indicatorText = "✓";
                indicatorColor = "#32CD32"; // Lime green for completed
            } else if (!gameStateManager.canAccessMission(location.missionId)) {
                indicatorText = "🔒";
                indicatorColor = "#DC143C"; // Crimson red for locked
            }

            // Store reference to indicator for real-time updates
            const indicatorKey = `mission-indicator-${location.missionId}`;

            const missionIndicator = this.add
                .text(worldX + 25, worldY - 25, indicatorText, {
                    fontFamily: "Arial Black",
                    fontSize: 18,
                    color: indicatorColor,
                    stroke: "#000000",
                    strokeThickness: 3,
                    align: "center",
                    shadow: {
                        offsetX: 1,
                        offsetY: 1,
                        color: "#000000",
                        blur: 2,
                        fill: true,
                    },
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Store reference for real-time updates
            this.missionIndicators.set(location.missionId, missionIndicator);

            // Add mission number beside NPC name
            // const missionNumber = this.add
            //     .text(worldX - 35, worldY - 35, `#${location.missionId}`, {
            //         fontFamily: "Arial Black",
            //         fontSize: 12,
            //         color: "#FFD700",
            //         stroke: "#000000",
            //         strokeThickness: 2,
            //         align: "center",
            //         backgroundColor: "#8B4513",
            //         padding: { x: 4, y: 2 },
            //     })
            //     .setOrigin(0.5)
            //     .setDepth(100);

            // Add a subtle base glow effect around NPCs
            const baseGlow = this.add.circle(worldX, worldY, 25, 0x4169e1, 0.1);
            baseGlow.setDepth(-1);

            // Create interactive glow effect (initially invisible)
            const interactiveGlow = this.add.circle(
                worldX,
                worldY,
                35,
                0xffd700,
                0
            );
            interactiveGlow.setDepth(-1);
            interactiveGlow.setVisible(false);

            // Store reference for real-time interaction feedback
            this.npcGlowEffects.set(location.missionId, {
                baseGlow,
                interactiveGlow,
                npc,
                isAnimating: false,
                animationTween: null,
            });

            // Store mission data and original position on NPC
            npc.setData("missionData", location);
            npc.setData("originalPosition", { x: worldX, y: worldY });

            this.npcs.add(npc);
        });

        console.log(
            `Created ${this.missionLocations.length} NPCs with specific LEVEL1 images`
        );

        // Update indicators after all NPCs are created
        this.updateNPCIndicators();

        // Add collision between player and NPCs with custom callback to prevent movement
        this.physics.add.collider(this.player, this.npcs, (player, npc) => {
            // Ensure NPC doesn't move when collided
            npc.body.setVelocity(0, 0);
            npc.body.setAngularVelocity(0);
            npc.body.setImmovable(true); // Force immovable again

            // Also stop the player's movement when colliding with NPC
            player.body.setVelocity(0, 0);
            player.body.setAngularVelocity(0);

            console.log(
                `Collision detected with ${
                    npc.getData("missionData")?.npc || "NPC"
                }, both player and NPC stopped`
            );
        });
        console.log(
            "Player-NPC collision detection enabled with movement prevention"
        );
    }

    createCollectibles() {
        console.log("=== CREATING COLLECTIBLE ITEMS ===");
        console.log(`Background ready: ${!!this.backgroundImage}`);
        console.log(`Player exists: ${!!this.player}`);
        console.log(
            `Total items to create: ${this.collectibleItemsData.length}`
        );

        // Create physics group for collectibles
        this.collectibles = this.physics.add.group();

        const gameStateManager = GameStateManager.getInstance();

        this.collectibleItemsData.forEach((item) => {
            // Check if item has already been collected
            if (gameStateManager.isItemCollected(item.id)) {
                console.log(`Item ${item.id} already collected, skipping`);
                return;
            }

            // Calculate world position from percentage
            const coords = this.percentageToWorldCoordinates(
                item.percentX,
                item.percentY
            );

            // Create collectible sprite using emoji/icon
            const collectible = this.add
                .text(coords.x, coords.y, item.icon, {
                    fontSize: "48px", // Larger size for better visibility
                    fontFamily: "Arial",
                })
                .setOrigin(0.5)
                .setScrollFactor(1); // Follow camera

            // Add physics body
            this.physics.add.existing(collectible);
            (collectible.body as Phaser.Physics.Arcade.Body).setSize(48, 48);
            (collectible.body as Phaser.Physics.Arcade.Body).setAllowGravity(
                false
            );

            // Set depth - above NPCs and below UI
            collectible.setDepth(200);
            collectible.setVisible(true);

            // Store item data on sprite
            collectible.setData("itemData", item);

            // Add to collectibles group
            this.collectibles.add(collectible);

            // Store reference
            this.collectibleItems.set(item.id, collectible);

            // Add floating animation
            this.tweens.add({
                targets: collectible,
                y: coords.y - 10,
                duration: 1000,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });

            // Add glow effect based on rarity
            const glowColor =
                item.rarity === "legendary"
                    ? 0xffd700 // Gold
                    : item.rarity === "rare"
                    ? 0xff00ff // Purple
                    : item.rarity === "uncommon"
                    ? 0x00ffff // Cyan
                    : 0xffffff; // White

            const glow = this.add.circle(
                coords.x,
                coords.y,
                30,
                glowColor,
                0.4
            );
            glow.setDepth(199); // Just below collectible
            glow.setScrollFactor(1); // Follow camera

            // Pulsing glow animation
            this.tweens.add({
                targets: glow,
                alpha: { from: 0.3, to: 0.6 },
                scaleX: { from: 1, to: 1.3 },
                scaleY: { from: 1, to: 1.3 },
                duration: 1200,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });

            console.log(
                `✓ Created collectible ${item.id} (${item.type}) at (${
                    item.percentX
                }%, ${item.percentY}%) = world(${coords.x.toFixed(
                    1
                )}, ${coords.y.toFixed(1)})`
            );
        });

        // Add overlap detection between player and collectibles
        if (this.collectibles && this.player) {
            this.physics.add.overlap(
                this.player,
                this.collectibles,
                this.collectItem,
                undefined,
                this
            );
            console.log("✓ Collision detection enabled");
        }

        console.log("=== COLLECTIBLES CREATION COMPLETE ===");
        console.log(`Items created: ${this.collectibleItems.size}`);
        console.log(
            `Collectibles group size: ${this.collectibles?.children?.size || 0}`
        );
        console.log("=====================================");
    }

    collectItem(player: any, collectible: any) {
        const itemData = collectible.getData("itemData");
        if (!itemData) return;

        const gameStateManager = GameStateManager.getInstance();

        // Attempt to collect the item
        const collected = gameStateManager.collectItem(
            itemData.id,
            itemData.value,
            itemData.points
        );

        if (collected) {
            // Create particle effect (sparkles) at collection point
            this.createCollectionParticles(
                collectible.x,
                collectible.y,
                itemData.rarity
            );

            // Play collection sound based on item rarity
            this.playCollectionSound(itemData.rarity);

            // Play collection animation
            this.tweens.add({
                targets: collectible,
                y: collectible.y - 80,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 600,
                ease: "Back.easeOut",
                onComplete: () => {
                    collectible.destroy();
                    this.collectibleItems.delete(itemData.id);
                },
            });

            // Show floating text animation
            this.showFloatingText(
                collectible.x,
                collectible.y,
                `+${itemData.value} 💰 +${itemData.points} ⭐`
            );

            // Check if all items collected for achievement
            this.checkCollectionAchievement();

            // Update daily challenge progress for collectibles
            EventBus.emit("update-daily-challenge", {
                type: "collect",
                amount: 1,
            });

            // Show notification
            EventBus.emit("show-notification", {
                type: "success",
                title: `${itemData.name} Collected! ✨`,
                message: `You found a ${itemData.name}! +${itemData.value} coins, +${itemData.points} points`,
                icon: itemData.icon,
                actions: [
                    {
                        label: "Continue Exploring",
                        action: () => {},
                        style: "primary",
                    },
                ],
            });

            console.log(
                `Collected item ${itemData.id}: +${itemData.value} coins, +${itemData.points} points`
            );
        }
    }

    createCollectionParticles(x: number, y: number, rarity: string) {
        // Particle color based on rarity
        const particleColor =
            rarity === "legendary"
                ? 0xffd700 // Gold
                : rarity === "rare"
                ? 0xff00ff // Purple
                : rarity === "uncommon"
                ? 0x00ffff // Cyan
                : 0xffff00; // Yellow

        // Create multiple sparkle particles
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 30 + Math.random() * 20;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;

            const particle = this.add.circle(x, y, 3, particleColor, 1);
            particle.setDepth(300);

            this.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                duration: 500 + Math.random() * 300,
                ease: "Power2",
                onComplete: () => {
                    particle.destroy();
                },
            });
        }

        // Create star burst effect
        for (let i = 0; i < 5; i++) {
            const star = this.add.text(x, y, "⭐", {
                fontSize: "24px",
            });
            star.setOrigin(0.5);
            star.setDepth(300);

            const angle = (Math.PI * 2 * i) / 5;
            const distance = 40;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;

            this.tweens.add({
                targets: star,
                x: targetX,
                y: targetY,
                alpha: 0,
                rotation: Math.PI * 2,
                scale: { from: 1, to: 0.5 },
                duration: 600,
                ease: "Power2",
                onComplete: () => {
                    star.destroy();
                },
            });
        }
    }

    playCollectionSound(rarity: string) {
        // Play sound based on rarity - using HTML5 Audio API
        const soundFrequency =
            rarity === "legendary"
                ? [440, 554, 659, 880] // High pitched for legendary
                : rarity === "rare"
                ? [392, 494, 587] // Mid-high for rare
                : rarity === "uncommon"
                ? [349, 440, 523] // Mid for uncommon
                : [330, 392, 440]; // Lower for common

        // Create AudioContext for sound generation
        if (
            typeof AudioContext !== "undefined" ||
            typeof (window as any).webkitAudioContext !== "undefined"
        ) {
            try {
                const AudioContextClass =
                    AudioContext || (window as any).webkitAudioContext;
                const audioContext = new AudioContextClass();

                soundFrequency.forEach((freq, index) => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = freq;
                    oscillator.type = "sine";

                    const startTime = audioContext.currentTime + index * 0.1;
                    const duration = 0.15;

                    gainNode.gain.setValueAtTime(0.3, startTime);
                    gainNode.gain.exponentialRampToValueAtTime(
                        0.01,
                        startTime + duration
                    );

                    oscillator.start(startTime);
                    oscillator.stop(startTime + duration);
                });
            } catch (error) {
                console.log("Audio playback not available:", error);
            }
        }
    }

    showFloatingText(x: number, y: number, text: string) {
        const floatingText = this.add.text(x, y, text, {
            fontFamily: "Arial Black",
            fontSize: "24px",
            color: "#FFD700",
            stroke: "#000000",
            strokeThickness: 4,
        });
        floatingText.setOrigin(0.5);
        floatingText.setDepth(300);

        this.tweens.add({
            targets: floatingText,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            ease: "Power2",
            onComplete: () => {
                floatingText.destroy();
            },
        });
    }

    checkCollectionAchievement() {
        const gameStateManager = GameStateManager.getInstance();
        const totalItems = this.collectibleItemsData.length;
        const collectedCount = gameStateManager.getTotalCollectedItems();

        // Check if all barangay items collected
        const allBarangayItemsCollected = this.collectibleItemsData.every(
            (item) => gameStateManager.isItemCollected(item.id)
        );

        if (allBarangayItemsCollected && collectedCount > 0) {
            // Award special achievement badge
            EventBus.emit("show-notification", {
                type: "success",
                title: "🏆 Master Collector Achievement! 🏆",
                message: `Congratulations! You've collected all ${totalItems} items in the Barangay! You've earned the "Treasure Hunter" badge and a bonus of 50 coins + 100 points!`,
                icon: "🎖️",
                actions: [
                    {
                        label: "Awesome!",
                        action: () => {},
                        style: "primary",
                    },
                ],
            });

            // Award bonus coins and points for completing collection
            gameStateManager.addCoins(50, "Master Collector Achievement");
            const progress = gameStateManager.getProgress();
            if (progress) {
                progress.totalScore += 100;
                gameStateManager.updatePlaytime(0); // Trigger save
            }

            console.log("🏆 Master Collector Achievement unlocked!");
        }
    }

    createMobileControls() {
        console.log("Creating mobile controls...");
        console.log(
            "Screen size for controls:",
            this.cameras.main.width,
            "x",
            this.cameras.main.height
        );

        // Create virtual joystick
        this.createVirtualJoystick();

        // Create interaction button
        this.createInteractionButton();

        // Update interaction prompt for mobile
        this.interactionPrompt.setText("Tap to interact");

        console.log("Mobile controls created successfully");
    }

    createVirtualJoystick() {
        // Get screen dimensions for responsive positioning
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Position joystick in bottom-left corner with proper margins
        // Use percentage-based positioning for better responsiveness
        const joystickX = Math.max(60, screenWidth * 0.08); // 8% from left edge, minimum 60px
        const joystickY = Math.min(screenHeight - 60, screenHeight * 0.9); // 90% from top, maximum 60px from bottom

        console.log("Creating joystick at position:", joystickX, joystickY);
        console.log("Screen dimensions:", screenWidth, "x", screenHeight);
        console.log("Landscape mode:", screenWidth > screenHeight);

        // Create joystick base (outer circle) - use camera-relative positioning
        const joystickBase = this.add.circle(
            joystickX,
            joystickY,
            50,
            0x000000,
            0.3
        );
        joystickBase.setDepth(2000);
        joystickBase.setScrollFactor(0); // Don't scroll with camera

        // Create joystick knob (inner circle) - use camera-relative positioning
        const joystickKnob = this.add.circle(
            joystickX,
            joystickY,
            25,
            0xffffff,
            0.8
        );
        joystickKnob.setDepth(2001);
        joystickKnob.setScrollFactor(0); // Don't scroll with camera

        // Store joystick components
        this.virtualJoystick = {
            base: joystickBase,
            knob: joystickKnob,
            baseX: joystickX,
            baseY: joystickY,
            knobX: joystickX,
            knobY: joystickY,
            isActive: false,
            maxDistance: 40,
        };

        // Make joystick interactive
        joystickBase.setInteractive();
        joystickKnob.setInteractive();

        // Touch events for joystick
        joystickBase.on("pointerdown", (pointer: any) => {
            this.virtualJoystick.isActive = true;
            this.updateJoystickPosition(pointer.x, pointer.y);
        });

        this.input.on("pointermove", (pointer: any) => {
            if (this.virtualJoystick.isActive) {
                this.updateJoystickPosition(pointer.x, pointer.y);
            }
        });

        this.input.on("pointerup", () => {
            this.virtualJoystick.isActive = false;
            this.resetJoystick();
        });
    }

    updateJoystickPosition(x: number, y: number) {
        const dx = x - this.virtualJoystick.baseX;
        const dy = y - this.virtualJoystick.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= this.virtualJoystick.maxDistance) {
            this.virtualJoystick.knobX = x;
            this.virtualJoystick.knobY = y;
        } else {
            const angle = Math.atan2(dy, dx);
            this.virtualJoystick.knobX =
                this.virtualJoystick.baseX +
                Math.cos(angle) * this.virtualJoystick.maxDistance;
            this.virtualJoystick.knobY =
                this.virtualJoystick.baseY +
                Math.sin(angle) * this.virtualJoystick.maxDistance;
        }

        this.virtualJoystick.knob.setPosition(
            this.virtualJoystick.knobX,
            this.virtualJoystick.knobY
        );
    }

    resetJoystick() {
        this.virtualJoystick.knobX = this.virtualJoystick.baseX;
        this.virtualJoystick.knobY = this.virtualJoystick.baseY;
        this.virtualJoystick.knob.setPosition(
            this.virtualJoystick.knobX,
            this.virtualJoystick.knobY
        );
    }

    createInteractionButton() {
        // Get screen dimensions for responsive positioning
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Position interaction button in bottom-right corner
        // Use percentage-based positioning for better responsiveness
        const buttonX = Math.min(screenWidth - 60, screenWidth * 0.92); // 92% from left edge, maximum 60px from right
        const buttonY = Math.min(screenHeight - 60, screenHeight * 0.9); // 90% from top, maximum 60px from bottom

        console.log(
            "Creating interaction button at position:",
            buttonX,
            buttonY
        );
        console.log("Landscape mode:", screenWidth > screenHeight);

        // Create interaction button for mobile
        const interactionButton = this.add.circle(
            buttonX,
            buttonY,
            40,
            0x00ff00,
            0.7
        );
        interactionButton.setDepth(2000);
        interactionButton.setScrollFactor(0); // Don't scroll with camera
        interactionButton.setInteractive();

        const buttonText = this.add
            .text(buttonX, buttonY, "TAP", {
                fontFamily: "Arial Black",
                fontSize: 12,
                color: "#000000",
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(2001)
            .setScrollFactor(0); // Don't scroll with camera

        interactionButton.on("pointerdown", () => {
            this.interactWithNearbyNPC();
        });

        // Store button reference
        this.touchControls = {
            interactionButton: interactionButton,
            buttonText: buttonText,
        };
    }

    handleResize() {
        console.log("Screen resized, updating camera and background...");
        console.log(
            "New screen dimensions:",
            this.cameras.main.width,
            "x",
            this.cameras.main.height
        );

        // Update camera settings for new screen size
        this.optimizeCameraForOpenWorld();

        // Update background scaling for new screen size
        this.updateBackgroundForOrientation();

        // Re-detect mobile device for new screen size
        this.isMobile =
            this.sys.game.device.input.touch ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) ||
            window.innerWidth <= 768;

        console.log("Mobile device detected after resize:", this.isMobile);
        console.log("Camera and background updated for new screen size");
    }

    createUI() {
        // Only create the interaction prompt since other UI is handled by React
        this.interactionPrompt = this.add
            .text(
                512,
                600,
                this.isMobile ? "Tap to interact" : "Press SPACE to interact",
                {
                    fontFamily: "Arial Black",
                    fontSize: 16,
                    color: "#FFD700",
                    stroke: "#000000",
                    strokeThickness: 3,
                    align: "center",
                    backgroundColor: "#2E86AB",
                    padding: { x: 10, y: 5 },
                }
            )
            .setOrigin(0.5)
            .setDepth(1000)
            .setScrollFactor(0) // Don't scroll with camera
            .setVisible(false);
    }

    createLocationDisplay() {
        // Create location display above player head
        this.locationDisplay = this.add
            .text(
                this.player.x,
                this.player.y - 60, // Position above player head
                "Location: (0, 0)",
                {
                    fontFamily: "Arial Black",
                    fontSize: this.isMobile ? 12 : 14,
                    color: "#FFFFFF",
                    stroke: "#000000",
                    strokeThickness: 2,
                    align: "center",
                    backgroundColor: "rgba(46, 134, 171, 0.8)",
                    padding: { x: 8, y: 4 },
                    shadow: {
                        offsetX: 1,
                        offsetY: 1,
                        color: "#000000",
                        blur: 2,
                        fill: true,
                    },
                }
            )
            .setOrigin(0.5)
            .setDepth(500) // Above player but below UI elements
            .setScrollFactor(1) // Follow camera (moves with world)
            .setVisible(true);

        console.log("Location display created above player head");
    }

    createMinimap() {
        // Create minimap in bottom-left corner
        const minimapSize = this.isMobile ? 100 : 150;
        const minimapX = this.isMobile ? 70 : 90;
        const minimapY = this.cameras.main.height - (this.isMobile ? 120 : 170);

        // Create minimap container
        this.minimap = this.add.container(minimapX, minimapY);
        this.minimap.setScrollFactor(0); // Fixed on screen
        this.minimap.setDepth(1500);

        // Create minimap background
        const minimapBg = this.add.graphics();
        minimapBg.fillStyle(0x000000, 0.6);
        minimapBg.fillRoundedRect(0, 0, minimapSize, minimapSize, 8);
        minimapBg.lineStyle(2, 0xffd700, 1);
        minimapBg.strokeRoundedRect(0, 0, minimapSize, minimapSize, 8);
        this.minimap.add(minimapBg);

        // Add minimap title
        const minimapTitle = this.add.text(minimapSize / 2, -15, "MAP", {
            fontFamily: "Arial Black",
            fontSize: "12px",
            color: "#FFD700",
            stroke: "#000000",
            strokeThickness: 2,
        });
        minimapTitle.setOrigin(0.5);
        this.minimap.add(minimapTitle);

        // Create player dot (green)
        this.minimapPlayerDot = this.add.circle(
            minimapSize / 2,
            minimapSize / 2,
            4,
            0x00ff00,
            1
        );
        this.minimap.add(this.minimapPlayerDot);

        // Add NPC dots (blue)
        this.missionLocations.forEach((location) => {
            const npcX = (location.percentX / 100) * minimapSize;
            const npcY = (location.percentY / 100) * minimapSize;

            const npcDot = this.add.circle(npcX, npcY, 2, 0x4169e1, 0.8);
            this.minimap.add(npcDot);
            this.minimapNPCDots.push(npcDot);
        });

        // Add collectible dots (yellow/gold based on rarity)
        this.collectibleItemsData.forEach((item) => {
            const itemX = (item.percentX / 100) * minimapSize;
            const itemY = (item.percentY / 100) * minimapSize;

            const dotColor =
                item.rarity === "legendary"
                    ? 0xffd700 // Gold
                    : item.rarity === "rare"
                    ? 0xff00ff // Purple
                    : item.rarity === "uncommon"
                    ? 0x00ffff // Cyan
                    : 0xffff00; // Yellow

            const collectibleDot = this.add.circle(
                itemX,
                itemY,
                2,
                dotColor,
                1
            );
            collectibleDot.setData("itemId", item.id);
            this.minimap.add(collectibleDot);
            this.minimapCollectibleDots.push(collectibleDot);

            // Add pulsing animation to collectible dots
            this.tweens.add({
                targets: collectibleDot,
                alpha: { from: 0.5, to: 1 },
                scale: { from: 0.8, to: 1.2 },
                duration: 800,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });
        });

        console.log("Minimap created with collectible locations");
    }

    updateMinimap() {
        if (
            !this.minimap ||
            !this.minimapPlayerDot ||
            !this.player ||
            !this.backgroundImage
        )
            return;

        const minimapSize = this.isMobile ? 100 : 150;

        // Calculate player position as percentage
        const bgWidth = this.backgroundImage.displayWidth;
        const bgHeight = this.backgroundImage.displayHeight;
        const bgX = this.backgroundImage.x;
        const bgY = this.backgroundImage.y;

        const playerRelativeX = this.player.x - (bgX - bgWidth / 2);
        const playerRelativeY = this.player.y - (bgY - bgHeight / 2);

        const percentX = Math.max(
            0,
            Math.min(100, (playerRelativeX / bgWidth) * 100)
        );
        const percentY = Math.max(
            0,
            Math.min(100, (playerRelativeY / bgHeight) * 100)
        );

        // Update player dot position on minimap
        this.minimapPlayerDot.setPosition(
            (percentX / 100) * minimapSize,
            (percentY / 100) * minimapSize
        );

        // Update collectible dots - hide if collected
        const gameStateManager = GameStateManager.getInstance();
        this.minimapCollectibleDots.forEach((dot) => {
            const itemId = dot.getData("itemId");
            if (itemId && gameStateManager.isItemCollected(itemId)) {
                dot.setVisible(false);
            }
        });
    }

    repositionPlayerRelativeToBackground() {
        if (this.player && this.backgroundImage) {
            // Position player at center of background image
            const bgX = this.backgroundImage.x;
            const bgY = this.backgroundImage.y;

            this.player.setPosition(bgX, bgY);

            console.log("Player repositioned to background center:", bgX, bgY);
            console.log(
                "Background dimensions:",
                this.backgroundImage.displayWidth,
                this.backgroundImage.displayHeight
            );
        }
    }

    // Convert percentage coordinates to world coordinates relative to background image
    percentageToWorldCoordinates(percentX: number, percentY: number) {
        if (!this.backgroundImage) {
            // Fallback to tile-based coordinates
            return {
                x: (percentX / 100) * (this.mapWidth * this.tileSize),
                y: (percentY / 100) * (this.mapHeight * this.tileSize),
            };
        }

        const bgWidth = this.backgroundImage.displayWidth;
        const bgHeight = this.backgroundImage.displayHeight;
        const bgX = this.backgroundImage.x;
        const bgY = this.backgroundImage.y;

        // Calculate world coordinates from percentage
        const worldX = bgX + (percentX - 50) * (bgWidth / 100);
        const worldY = bgY + (percentY - 50) * (bgHeight / 100);

        return { x: worldX, y: worldY };
    }

    repositionNPCsRelativeToBackground() {
        if (!this.npcs || !this.backgroundImage) return;

        this.npcs.children.entries.forEach((npc: any, index: number) => {
            const missionData = npc.getData("missionData");
            if (
                missionData &&
                missionData.percentX !== undefined &&
                missionData.percentY !== undefined
            ) {
                // Reposition NPC using percentage coordinates
                const coords = this.percentageToWorldCoordinates(
                    missionData.percentX,
                    missionData.percentY
                );
                npc.setPosition(coords.x, coords.y);

                // Update original position data
                npc.setData("originalPosition", { x: coords.x, y: coords.y });

                console.log(
                    `Repositioned NPC ${missionData.npc} to (${missionData.percentX}%, ${missionData.percentY}%) = (${coords.x}, ${coords.y})`
                );
            }
        });
    }

    updateLocationDisplay() {
        if (this.locationDisplay && this.player) {
            // Calculate position relative to background image
            let relativeX = 0,
                relativeY = 0;
            let areaName = "Barangay";

            if (this.backgroundImage) {
                // Calculate percentage position relative to background image
                const bgWidth = this.backgroundImage.displayWidth;
                const bgHeight = this.backgroundImage.displayHeight;
                const bgX = this.backgroundImage.x;
                const bgY = this.backgroundImage.y;

                // Calculate relative position within background image
                const playerRelativeX = this.player.x - (bgX - bgWidth / 2);
                const playerRelativeY = this.player.y - (bgY - bgHeight / 2);

                // Convert to percentage (0-100%)
                relativeX = Math.round((playerRelativeX / bgWidth) * 100);
                relativeY = Math.round((playerRelativeY / bgHeight) * 100);

                // Clamp values to 0-100%
                relativeX = Math.max(0, Math.min(100, relativeX));
                relativeY = Math.max(0, Math.min(100, relativeY));

                // Determine area based on percentage position
                if (relativeX < 25 && relativeY < 25) {
                    areaName = "Northwest District";
                } else if (relativeX >= 75 && relativeY < 25) {
                    areaName = "Northeast District";
                } else if (relativeX < 25 && relativeY >= 75) {
                    areaName = "Southwest District";
                } else if (relativeX >= 75 && relativeY >= 75) {
                    areaName = "Southeast District";
                } else if (
                    relativeX >= 37.5 &&
                    relativeX < 62.5 &&
                    relativeY >= 37.5 &&
                    relativeY < 62.5
                ) {
                    areaName = "Central District";
                } else if (
                    relativeX >= 25 &&
                    relativeX < 75 &&
                    relativeY < 25
                ) {
                    areaName = "North District";
                } else if (
                    relativeX >= 25 &&
                    relativeX < 75 &&
                    relativeY >= 75
                ) {
                    areaName = "South District";
                } else if (
                    relativeX < 25 &&
                    relativeY >= 25 &&
                    relativeY < 75
                ) {
                    areaName = "West District";
                } else if (
                    relativeX >= 75 &&
                    relativeY >= 25 &&
                    relativeY < 75
                ) {
                    areaName = "East District";
                } else {
                    areaName = "Barangay";
                }

                console.log(
                    `Player position: ${relativeX}%, ${relativeY}% - Area: ${areaName}`
                );
            } else {
                // Fallback to tile-based coordinates if background not available
                const mapX = Math.round(this.player.x / this.tileSize);
                const mapY = Math.round(this.player.y / this.tileSize);
                relativeX = mapX;
                relativeY = mapY;
            }

            // Update display text with percentage coordinates and area name
            const displayText = `${areaName}\n(${relativeX}%, ${relativeY}%)`;
            this.locationDisplay.setText(displayText);

            // Position above player head
            this.locationDisplay.setPosition(this.player.x, this.player.y - 60);

            // Update font size based on screen size
            const fontSize = this.isMobile ? 10 : 12;
            this.locationDisplay.setStyle({ fontSize });
        }
    }

    update() {
        // Check if player exists before proceeding
        if (!this.player) {
            return;
        }

        // Player movement
        const speed = 200;
        let isMoving = false;
        let currentDirection = "";
        let velocityX = 0;
        let velocityY = 0;

        // Handle keyboard input (desktop)
        if (!this.isMobile) {
            if (this.cursors.left.isDown || this.wasd.A.isDown) {
                velocityX = -speed;
                isMoving = true;
                currentDirection = "left";
                this.lastDirection = "left";
            } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
                velocityX = speed;
                isMoving = true;
                currentDirection = "right";
                this.lastDirection = "right";
            }

            if (this.cursors.up.isDown || this.wasd.W.isDown) {
                velocityY = -speed;
                isMoving = true;
                currentDirection = "back";
                this.lastDirection = "back";
            } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
                velocityY = speed;
                isMoving = true;
                currentDirection = "front";
                this.lastDirection = "front";
            }
        } else {
            // Handle React joystick input
            const joystickDirection = this.registry.get(
                "joystickDirection"
            ) || { x: 0, y: 0 };

            if (joystickDirection.x !== 0 || joystickDirection.y !== 0) {
                velocityX = joystickDirection.x * speed;
                velocityY = joystickDirection.y * speed;

                isMoving = true;

                // Determine direction based on movement
                if (Math.abs(velocityX) > Math.abs(velocityY)) {
                    currentDirection = velocityX > 0 ? "right" : "left";
                } else {
                    currentDirection = velocityY > 0 ? "front" : "back";
                }

                this.lastDirection = currentDirection;
            }
        }

        // Apply velocity with improved collision detection
        if (isMoving) {
            const newX = this.player.x + velocityX * 0.016; // Approximate new position (60fps)
            const newY = this.player.y + velocityY * 0.016;

            // Check if moving away from NPCs or towards them
            const isMovingAway = this.isPlayerMovingAwayFromNPCs(newX, newY);

            if (isMovingAway || this.canPlayerMoveTo(newX, newY)) {
                this.player.setVelocity(velocityX, velocityY);
            } else {
                // Stop player if they would hit an NPC
                this.player.setVelocity(0, 0);
                console.log("Player movement blocked by NPC collision");
            }
        } else {
            this.player.setVelocity(0, 0);
        }

        // Ensure camera is following player (debug occasionally)
        if (Math.random() < 0.01) {
            // Occasional debug
            const playerScreenX = this.cameras.main.getWorldPoint(
                this.player.x,
                this.player.y
            ).x;
            const playerScreenY = this.cameras.main.getWorldPoint(
                this.player.x,
                this.player.y
            ).y;
            const screenCenterX = this.cameras.main.width / 2;
            const screenCenterY = this.cameras.main.height / 2;

            console.log("=== OPEN WORLD CAMERA SCROLLING ===");
            console.log("Player world position:", this.player.x, this.player.y);
            console.log(
                "Player screen position:",
                playerScreenX,
                playerScreenY
            );
            console.log("Screen center:", screenCenterX, screenCenterY);
            console.log(
                "Camera offset from center:",
                Math.abs(playerScreenX - screenCenterX),
                Math.abs(playerScreenY - screenCenterY)
            );
            console.log("Camera following:", this.cameras.main.follow);
            console.log("Map bounds:", this.cameras.main.getBounds());
            console.log("Camera lerp:", this.cameras.main.lerp);
            console.log("Camera deadzone:", this.cameras.main.deadzone);
            console.log("===================================");
        }

        // Handle sprite direction and animations
        if (isMoving) {
            // Set the correct sprite texture for the direction
            const spriteKey = `student-${currentDirection}-1`;
            if (this.textures.exists(spriteKey)) {
                this.player.setTexture(spriteKey);
            }

            // Play walk animation if it exists
            if (this.anims && this.anims.exists) {
                const walkAnimKey = `student-${currentDirection}-walk`;
                if (this.anims.exists(walkAnimKey)) {
                    this.player.play(walkAnimKey, true);
                }
            }
        } else {
            // Stop movement and set idle sprite
            this.player.setVelocity(0, 0);

            // Set idle sprite for last direction
            const idleSpriteKey = `student-${this.lastDirection}-1`;
            if (this.textures.exists(idleSpriteKey)) {
                this.player.setTexture(idleSpriteKey);
            }

            // Play idle animation if it exists
            if (this.anims && this.anims.exists) {
                const idleAnimKey = `student-${this.lastDirection}-idle`;
                if (this.anims.exists(idleAnimKey)) {
                    this.player.play(idleAnimKey, true);
                }
            }
        }

        // Check for nearby NPCs
        this.checkForNearbyNPCs();

        // Update location display above player head
        this.updateLocationDisplay();

        // Update minimap
        this.updateMinimap();

        // Debug: Show interaction prompt status occasionally
        if (Math.random() < 0.02) {
            // 2% chance every frame
            console.log("=== INTERACTION DEBUG ===");
            console.log(
                "Player position:",
                this.player.x.toFixed(1),
                this.player.y.toFixed(1)
            );
            console.log(
                "Nearby NPC:",
                this.nearbyNPC
                    ? this.nearbyNPC.getData("missionData")?.npc
                    : "None"
            );
            console.log(
                "Interaction prompt visible:",
                this.interactionPrompt.visible
            );
            console.log("=========================");
        }

        // Ensure NPCs stay in their original positions (prevent movement)
        this.enforceNPCPositions();

        // Ensure camera is following player (fallback)
        this.ensureCameraFollowing();
    }

    enforceNPCPositions() {
        // Ensure all NPCs stay in their original positions
        this.npcs.children.entries.forEach((npc: any) => {
            // Stop any movement
            npc.body.setVelocity(0, 0);
            npc.body.setAngularVelocity(0);
            npc.body.setImmovable(true);

            // Reset to original position if they've moved
            const originalPosition = npc.getData("originalPosition");
            const missionData = npc.getData("missionData");

            if (originalPosition) {
                // Only reset position if they've moved significantly
                const distance = Phaser.Math.Distance.Between(
                    npc.x,
                    npc.y,
                    originalPosition.x,
                    originalPosition.y
                );
                if (distance > 5) {
                    npc.setPosition(originalPosition.x, originalPosition.y);
                    console.log(
                        `Reset NPC ${
                            missionData?.npc || "Unknown"
                        } to original position`
                    );
                }
            }
        });
    }

    isPlayerMovingAwayFromNPCs(newX: number, newY: number) {
        // Check if player is moving away from any nearby NPCs
        const currentDistance = this.getDistanceToNearestNPC();
        const newDistance = this.getDistanceToNearestNPC(newX, newY);

        // If moving away (increasing distance), allow movement
        return newDistance > currentDistance;
    }

    getDistanceToNearestNPC(x?: number, y?: number) {
        const playerX = x !== undefined ? x : this.player.x;
        const playerY = y !== undefined ? y : this.player.y;

        let nearestDistance = Infinity;

        for (let npc of this.npcs.children.entries) {
            const distance = Phaser.Math.Distance.Between(
                playerX,
                playerY,
                npc.x,
                npc.y
            );
            if (distance < nearestDistance) {
                nearestDistance = distance;
            }
        }

        return nearestDistance;
    }

    canPlayerMoveTo(x: number, y: number) {
        // Check if player can move to the given position without hitting an NPC
        const playerWidth = this.player.width * this.player.scaleX;
        const playerHeight = this.player.height * this.player.scaleY;

        for (let npc of this.npcs.children.entries) {
            const npcWidth = npc.width * npc.scaleX;
            const npcHeight = npc.height * npc.scaleY;

            // Check if player's bounding box would overlap with NPC's bounding box
            const playerLeft = x - playerWidth / 2;
            const playerRight = x + playerWidth / 2;
            const playerTop = y - playerHeight / 2;
            const playerBottom = y + playerHeight / 2;

            const npcLeft = npc.x - npcWidth / 2;
            const npcRight = npc.x + npcWidth / 2;
            const npcTop = npc.y - npcHeight / 2;
            const npcBottom = npc.y + npcHeight / 2;

            // Check for overlap with minimal padding to allow interaction
            const padding = 0.5; // Minimal padding to allow getting very close for interaction
            if (
                playerLeft < npcRight + padding &&
                playerRight > npcLeft - padding &&
                playerTop < npcBottom + padding &&
                playerBottom > npcTop - padding
            ) {
                return false;
            }
        }

        return true;
    }

    checkForNearbyNPCs() {
        let nearestNPC = null;
        let nearestDistance = 100; // Interaction range
        let nearestMissionId = null;

        this.npcs.children.entries.forEach((npc: any) => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                npc.x,
                npc.y
            );

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestNPC = npc;
                nearestMissionId = npc.getData("missionData")?.missionId;
            }
        });

        // Check if we have a new nearby NPC
        const currentNearbyMissionId =
            this.nearbyNPC?.getData("missionData")?.missionId;

        // Increased interaction range to make it easier to trigger
        if (nearestNPC && nearestDistance < 80) {
            // New NPC detected - activate glow
            if (currentNearbyMissionId !== nearestMissionId) {
                // Deactivate previous NPC glow if exists
                if (currentNearbyMissionId) {
                    this.activateNPCGlow(currentNearbyMissionId, false);
                }

                // Activate new NPC glow
                if (nearestMissionId) {
                    this.activateNPCGlow(nearestMissionId, true);
                }
            }

            this.nearbyNPC = nearestNPC;
            this.interactionPrompt.setVisible(true);
            console.log(
                `Interaction prompt shown for ${
                    nearestNPC.getData("missionData")?.npc || "NPC"
                } at distance ${nearestDistance.toFixed(1)} - Glow activated`
            );
        } else {
            // No nearby NPC - deactivate glow and hide prompt
            if (currentNearbyMissionId) {
                this.activateNPCGlow(currentNearbyMissionId, false);
            }

            this.nearbyNPC = null;
            this.interactionPrompt.setVisible(false);
        }
    }

    interactWithNearbyNPC() {
        if (this.nearbyNPC) {
            const missionData = this.nearbyNPC.getData("missionData");
            this.interactWithNPC(missionData);
        }
    }

    interactWithNPC(location: any) {
        const gameStateManager = GameStateManager.getInstance();

        // Check if mission is already completed
        if (gameStateManager.isMissionCompleted(location.missionId)) {
            EventBus.emit("show-notification", {
                type: "success",
                title: "Mission Already Completed! ✅",
                message: `${location.npc}: "Thank you for completing this mission! You've earned your badge and helped our community. Keep up the great work, citizen!"`,
                icon: "🎖️",
                actions: [
                    {
                        label: "Continue Exploring",
                        action: () => {}, // Will be handled by the notification component
                        style: "primary",
                    },
                ],
            });
            return;
        }

        // Check if mission is accessible
        if (!gameStateManager.canAccessMission(location.missionId)) {
            const availableMissions = gameStateManager.getAvailableMissions();
            const availableList =
                availableMissions.length > 0
                    ? availableMissions.join(", ")
                    : "Complete Mission 1 first";

            EventBus.emit("show-notification", {
                type: "info",
                title: "Mission Prerequisites Required 🔒",
                message: `${location.npc}: "Hello there! I'd love to give you this mission, but you need to complete some other tasks first. Available missions: ${availableList}. Come back after you've gained more experience!"`,
                icon: "📋",
                actions: [
                    {
                        label: "Check Available Missions",
                        action: () => {
                            // Emit event to open Quest Log
                            EventBus.emit("open-quest-log");
                        },
                        style: "secondary",
                    },
                ],
            });
            return;
        }

        // Emit event to React to show MissionSystem
        EventBus.emit("show-mission", {
            missionId: location.missionId,
            npcName: location.npc,
            missionName: location.name,
            // Add mission data based on missionId
            mission: this.getMissionData(location.missionId),
        });
    }

    getMissionData(missionId: number) {
        // Return mission data based on missionId
        // This should match the data structure expected by the React MissionSystem component
        const missions = {
            1: {
                id: "1",
                title: "Basura Patrol",
                description:
                    "Help clean up the barangay by collecting trash and organizing community areas.",
                tasks: [
                    "Collect 10 pieces of trash",
                    "Organize the community center",
                    "Plant 3 trees in the park",
                ],
                npc: "Barangay Tanod",
                location: "Barangay Hall",
                reward: "10 coins + Community Badge",
            },
            2: {
                id: "2",
                title: "Taga Rehistro",
                description:
                    "Learn about voter registration and help with community records.",
                tasks: [
                    "Study voter registration process",
                    "Help organize community records",
                    "Assist with voter education",
                ],
                npc: "COMELEC Volunteer",
                location: "Community Center",
                reward: "15 coins + Civic Badge",
            },
            3: {
                id: "3",
                title: "Kapitbahay Ko",
                description:
                    "Help elderly residents and strengthen community bonds.",
                tasks: [
                    "Visit elderly neighbors",
                    "Help with household chores",
                    "Organize community activities",
                ],
                npc: "Elderly Resident",
                location: "Residential Area",
                reward: "12 coins + Community Badge",
            },
            4: {
                id: "4",
                title: "Ordinansa Time",
                description: "Learn about barangay ordinances and local laws.",
                tasks: [
                    "Study barangay ordinances",
                    "Help with law enforcement",
                    "Educate community about rules",
                ],
                npc: "Barangay Secretary",
                location: "Barangay Hall",
                reward: "18 coins + Law Badge",
            },
            5: {
                id: "5",
                title: "Fake or Fact?",
                description:
                    "Learn to identify fake news and promote media literacy.",
                tasks: [
                    "Study media literacy",
                    "Fact-check information",
                    "Educate others about fake news",
                ],
                npc: "High School Student",
                location: "School Area",
                reward: "20 coins + Media Badge",
            },
            6: {
                id: "6",
                title: "Serbisyo Seryoso",
                description:
                    "Help with community infrastructure and public works.",
                tasks: [
                    "Assist with road repairs",
                    "Help with building maintenance",
                    "Organize community projects",
                ],
                npc: "Construction Foreman",
                location: "Construction Site",
                reward: "25 coins + Service Badge",
            },
            7: {
                id: "7",
                title: "Ayusin Natin 'To",
                description:
                    "Learn about conflict resolution and community mediation.",
                tasks: [
                    "Study mediation techniques",
                    "Help resolve community disputes",
                    "Promote peace and harmony",
                ],
                npc: "Mediation Officer",
                location: "Community Center",
                reward: "22 coins + Peace Badge",
            },
            8: {
                id: "8",
                title: "Civic Memory Hunt",
                description:
                    "Learn about Philippine history and civic responsibilities.",
                tasks: [
                    "Study Philippine history",
                    "Visit historical sites",
                    "Share knowledge with others",
                ],
                npc: "Librarian",
                location: "Library",
                reward: "30 coins + History Badge",
            },
            9: {
                id: "9",
                title: "Kabataang Kalusugan",
                description: "Promote health and wellness in the community.",
                tasks: [
                    "Organize health campaigns",
                    "Help with health checkups",
                    "Promote healthy lifestyle",
                ],
                npc: "Barangay Health Worker",
                location: "Health Centersss",
                reward: "28 coins + Health Badge",
            },
            10: {
                id: "10",
                title: "Pagpupulong ng Barangay",
                description:
                    "Participate in barangay meetings and community governance.",
                tasks: [
                    "Attend barangay meetings",
                    "Participate in discussions",
                    "Help with community decisions",
                ],
                npc: "Barangay Captain",
                location: "Barangay Hall",
                reward: "35 coins + Leadership Badge",
            },
        };

        return (
            missions[missionId as keyof typeof missions] || {
                id: missionId.toString(),
                title: "Unknown Mission",
                description: "A mission to help the community.",
                tasks: ["Complete the task"],
                npc: "Community Member",
                location: "Barangay",
                reward: "5 coins",
            }
        );
    }

    showMessage(text: string) {
        const messageBox = this.add.rectangle(
            512,
            600,
            800,
            100,
            0x000000,
            0.8
        );
        const messageText = this.add
            .text(512, 600, text, {
                fontFamily: "Arial",
                fontSize: 16,
                color: "#FFFFFF",
                align: "center",
                wordWrap: { width: 750 },
            })
            .setOrigin(0.5);

        // Auto-remove after 3 seconds
        this.time.delayedCall(3000, () => {
            messageBox.destroy();
            messageText.destroy();
        });
    }

    toggleMap() {
        this.isUIVisible = !this.isUIVisible;
        this.ui.setVisible(this.isUIVisible);
    }
}
