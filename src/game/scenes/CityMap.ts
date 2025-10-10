import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { GameStateManager } from "../../utils/GameStateManager";

export class CityMap extends Scene {
    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: any;
    npcs: Phaser.Physics.Arcade.Group;
    ui: GameObjects.Container;
    interactionPrompt: GameObjects.Text;
    nearbyNPC: any = null;

    // Scene management
    tileSize: number = 32;
    mapWidth: number = 1000;
    mapHeight: number = 1000;
    lastDirection: string = "front";

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
    collectibleItems: Map<string, any> = new Map();

    // Minimap/Radar system
    minimap: GameObjects.Container | null = null;
    minimapBackground: GameObjects.Graphics | null = null;
    minimapPlayerDot: GameObjects.Circle | null = null;
    minimapNPCDots: GameObjects.Circle[] = [];
    minimapCollectibleDots: GameObjects.Circle[] = [];

    // Level 2 City Mission locations
    missionLocations = [
        {
            x: 8,
            y: 6,
            name: "City Ordinances 101",
            npc: "City Councilor",
            missionId: 11,
            percentX: 50, // Background-relative percentage X
            percentY: 50, // Background-relative percentage Y
        },
        {
            x: 15,
            y: 8,
            name: "Municipal Budget",
            npc: "City Treasurer",
            missionId: 12,
        },
        {
            x: 22,
            y: 10,
            name: "Public Works Planning",
            npc: "City Engineer",
            missionId: 13,
        },
        {
            x: 10,
            y: 16,
            name: "Business Permits & Licensing",
            npc: "Business Permit Officer",
            missionId: 14,
        },
        {
            x: 18,
            y: 14,
            name: "Urban Planning",
            npc: "City Planner",
            missionId: 15,
        },
        {
            x: 5,
            y: 20,
            name: "Environmental Management",
            npc: "Environmental Officer",
            missionId: 16,
        },
        {
            x: 20,
            y: 18,
            name: "Public Safety Coordination",
            npc: "Public Safety Officer",
            missionId: 17,
        },
        {
            x: 12,
            y: 22,
            name: "Cultural Heritage",
            npc: "Tourism Officer",
            missionId: 18,
        },
        {
            x: 25,
            y: 15,
            name: "Healthcare Systems",
            npc: "Health Officer",
            missionId: 19,
        },
        {
            x: 16,
            y: 12,
            name: "City Leadership Summit",
            npc: "City Mayor",
            missionId: 20,
            percentX: 60, // Background-relative percentage X
            percentY: 45, // Background-relative percentage Y
        },
    ];

    // Collectible items for City (Level 2) - Higher value items
    collectibleItemsData = [
        {
            id: "city-coin-1",
            type: "coin",
            name: "Municipal Coin",
            description: "A valuable city coin",
            value: 10,
            points: 20,
            rarity: "common",
            percentX: 20,
            percentY: 40,
            icon: "💰",
        },
        {
            id: "city-coin-2",
            type: "coin",
            name: "Municipal Coin",
            description: "A valuable city coin",
            value: 10,
            points: 20,
            rarity: "common",
            percentX: 80,
            percentY: 60,
            icon: "💰",
        },
        {
            id: "city-coin-3",
            type: "coin",
            name: "Municipal Coin",
            description: "A valuable city coin",
            value: 10,
            points: 20,
            rarity: "common",
            percentX: 40,
            percentY: 85,
            icon: "💰",
        },
        {
            id: "city-badge-1",
            type: "badge",
            name: "Excellence Badge",
            description: "A badge of municipal excellence",
            value: 20,
            points: 40,
            rarity: "uncommon",
            percentX: 10,
            percentY: 55,
            icon: "🏅",
        },
        {
            id: "city-badge-2",
            type: "badge",
            name: "Excellence Badge",
            description: "A badge of municipal excellence",
            value: 20,
            points: 40,
            rarity: "uncommon",
            percentX: 90,
            percentY: 30,
            icon: "🏅",
        },
        {
            id: "city-treasure-1",
            type: "treasure",
            name: "City Treasury",
            description: "The legendary city treasury",
            value: 50,
            points: 100,
            rarity: "rare",
            percentX: 50,
            percentY: 50,
            icon: "💎",
        },
        {
            id: "city-powerup-1",
            type: "powerup",
            name: "Leadership Power",
            description: "Enhances your leadership abilities",
            value: 25,
            points: 50,
            rarity: "uncommon",
            percentX: 25,
            percentY: 75,
            icon: "⚡",
        },
        {
            id: "city-powerup-2",
            type: "powerup",
            name: "Leadership Power",
            description: "Enhances your leadership abilities",
            value: 25,
            points: 50,
            rarity: "uncommon",
            percentX: 75,
            percentY: 25,
            icon: "⚡",
        },
        {
            id: "city-gem-1",
            type: "treasure",
            name: "Government Seal",
            description: "Rare government seal artifact",
            value: 40,
            points: 80,
            rarity: "rare",
            percentX: 60,
            percentY: 20,
            icon: "💠",
        },
        {
            id: "city-gem-2",
            type: "treasure",
            name: "Civic Medal",
            description: "Prestigious civic medal",
            value: 35,
            points: 70,
            rarity: "rare",
            percentX: 35,
            percentY: 65,
            icon: "🎖️",
        },
    ];

    constructor() {
        super("CityMap");
    }

    create() {
        console.log("=== CREATING CITY MAP (LEVEL 2) ===");

        // Create city background
        this.createCityBackground();

        // Create player with collision
        this.createPlayer();

        // Create City NPCs
        this.createCityNPCs();

        // Create UI
        this.createUI();

        // Create location display above player head
        this.createLocationDisplay();

        // Set unlimited camera bounds for open world
        this.cameras.main.setBounds(-Infinity, -Infinity, Infinity, Infinity);

        // Ensure camera follows player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // Force camera to center on player initially
        this.cameras.main.centerOn(this.player.x, this.player.y);

        // Optimize for open world camera
        this.time.delayedCall(100, () => {
            this.cameras.main.startFollow(this.player);
            this.optimizeCameraForOpenWorld();
            console.log("City Map camera setup complete");
        });

        // Mobile device detection
        this.isMobile =
            this.sys.game.device.input.touch ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) ||
            window.innerWidth <= 768;
        console.log("Mobile device detected in City:", this.isMobile);

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

        // Add resize handler
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
                let indicatorText = "!";
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

        console.log("City NPC indicators updated in real-time");
    }

    optimizeCameraForOpenWorld() {
        if (this.player) {
            this.cameras.main.setBounds(
                -Infinity,
                -Infinity,
                Infinity,
                Infinity
            );
            this.cameras.main.setLerp(0.08, 0.08);
            this.cameras.main.setDeadzone(25, 25);
            console.log("City camera optimized for open world");
        }
    }

    createCityBackground() {
        console.log("Creating city background...");
        console.log(
            "City background texture exists:",
            this.textures.exists("city-bg-root")
        );

        // If textures don't exist, load them directly
        if (!this.textures.exists("city-bg-root")) {
            console.log("City textures not loaded, loading them now...");
            this.load.image("city-bg-root", "city-background.png");
            this.load.start();

            this.load.once("complete", () => {
                console.log("City textures loaded, creating background...");
                this.createCityBackgroundImage();
            });
        } else {
            // Wait a bit for textures to be fully loaded
            this.time.delayedCall(100, () => {
                this.createCityBackgroundImage();
            });
        }
    }

    createCityBackgroundImage() {
        console.log("Creating city background image after delay...");
        console.log(
            "City background root texture exists now:",
            this.textures.exists("city-bg-root")
        );

        // Create city background image as the main visual element
        if (this.textures.exists("city-bg-root")) {
            console.log("Using city background image...");
            console.log("Texture details:", this.textures.get("city-bg-root"));

            try {
                // Get Phaser game canvas dimensions for perfect coverage
                const gameWidth = this.scale.width;
                const gameHeight = this.scale.height;
                const gameCenterX = gameWidth / 2;
                const gameCenterY = gameHeight / 2;

                const bgImage = this.add.image(
                    gameCenterX,
                    gameCenterY,
                    "city-bg-root"
                );
                bgImage.setOrigin(0.5, 0.5);
                bgImage.setDepth(-2000); // Much further behind everything

                // Scale background to cover the entire Phaser game canvas
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
                    "City background scaling to cover entire Phaser game canvas:"
                );
                console.log(
                    "Game canvas dimensions:",
                    gameWidth,
                    "x",
                    gameHeight
                );
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
                console.log("Final scale:", finalScaleX, finalScaleY);

                bgImage.setScale(finalScaleX, finalScaleY);

                // Position background to cover the entire Phaser game canvas
                bgImage.setPosition(gameWidth / 2, gameHeight / 2);

                // Store the background reference for future updates
                this.backgroundImage = bgImage;

                bgImage.setAlpha(1); // Fully visible
                bgImage.setVisible(true); // Explicitly set visible
                console.log("City background image created successfully");

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
            } catch (error) {
                console.error("Error creating city background image:", error);
                // Fallback to steel blue background if image fails
                this.createFallbackCityBackground();
            }
        } else {
            console.log("City background texture not found, using fallback");
            this.createFallbackCityBackground();
        }
    }

    createFallbackCityBackground() {
        // Create fallback city background with steel blue theme
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        const bg = this.add.rectangle(
            gameWidth / 2,
            gameHeight / 2,
            gameWidth * 2,
            gameHeight * 2,
            0x4682b4, // Steel blue for city theme
            1
        );
        bg.setDepth(-2000);

        // Add some city-like patterns
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x708090, 0.3);

        // Draw a grid pattern to simulate city blocks
        for (let x = 0; x < gameWidth * 2; x += 80) {
            grid.lineBetween(x, 0, x, gameHeight * 2);
        }
        for (let y = 0; y < gameHeight * 2; y += 80) {
            grid.lineBetween(0, y, gameWidth * 2, y);
        }
        grid.setDepth(-1000);

        console.log("Fallback city background created successfully");
    }

    createPlayer() {
        // Use the same player sprite as Level 1
        const playerTexture = this.textures.exists("student-front-1")
            ? "student-front-1"
            : "player";

        console.log("Creating player in City Map with texture:", playerTexture);

        // Calculate player position relative to background image
        let playerX, playerY;

        if (this.backgroundImage) {
            // Position relative to background image center
            const bgX = this.backgroundImage.x;
            const bgY = this.backgroundImage.y;

            playerX = bgX;
            playerY = bgY;

            console.log(
                "City player spawning at background center:",
                playerX,
                playerY
            );
        } else {
            // Fallback to original position if background not ready
            playerX = 16 * this.tileSize;
            playerY = 12 * this.tileSize;
            console.log(
                "Using fallback city player position:",
                playerX,
                playerY
            );
        }

        this.player = this.physics.add.sprite(playerX, playerY, playerTexture);

        // Remove world bounds collision for unlimited movement
        this.player.setCollideWorldBounds(false);
        this.player.setScale(0.2);

        console.log("City player created with unlimited movement");

        // Create player animations if not already created
        this.createPlayerAnimations();
    }

    createPlayerAnimations() {
        // Check if animations already exist (from Level 1)
        if (this.anims.exists("student-front-walk")) {
            console.log("Player animations already exist, skipping creation");
            return;
        }

        console.log("Creating player animations for City Map...");

        // Create the same animations as Level 1
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
                console.error(
                    `Required texture ${texture} not found in City Map!`
                );
                return;
            }
        }

        // Create walking animations
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

        // Create idle animations
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

        console.log("City player animations created successfully!");
    }

    createCityNPCs() {
        this.npcs = this.physics.add.group();

        console.log("Creating City NPCs for Level 2...");

        // Debug: List all available textures
        console.log(
            "Available textures in CityMap:",
            Object.keys(this.textures.list)
        );

        // Map city official NPC names to their dedicated Level 2 image keys
        const cityNPCImageMap = {
            "City Councilor": "city-councilor",
            "City Treasurer": "city-treasurer",
            "City Engineer": "city-engineer",
            "Business Permit Officer": "business-permit-officer",
            "City Planner": "city-planner",
            "Environmental Officer": "environmental-officer",
            "Public Safety Officer": "public-safety-officer",
            "Tourism Officer": "tourism-officer",
            "Health Officer": "health-officer",
            "City Mayor": "city-mayor",
        };

        // Check if Level 2 NPC images are loaded, if not load them directly
        const level2Images = Object.values(cityNPCImageMap);
        const missingImages = level2Images.filter(
            (img) => !this.textures.exists(img)
        );

        if (missingImages.length > 0) {
            console.log(
                "Missing Level 2 city official images, loading them directly:",
                missingImages
            );
            missingImages.forEach((img) => {
                // Map the image key back to the file name
                const imageFileMap = {
                    "city-councilor": "City_Councilor.png",
                    "city-treasurer": "City_Treasurer.png",
                    "city-engineer": "City_Engineer.png",
                    "business-permit-officer": "Business_Permit_Officer.png",
                    "city-planner": "City_Planner.png",
                    "environmental-officer": "Environmental_Officer.png",
                    "public-safety-officer": "Public_Safety_Officer.png",
                    "tourism-officer": "Tourism_Officer.png",
                    "health-officer": "Health_Officer.png",
                    "city-mayor": "City_Mayor.png",
                };
                this.load.image(img, `assets/LEVEL2/${imageFileMap[img]}`);
            });
            this.load.start();

            this.load.once("complete", () => {
                console.log(
                    "Level 2 city official images loaded, creating NPCs..."
                );
                this.createCityNPCsAfterLoad(cityNPCImageMap);
            });
            return;
        }

        this.createCityNPCsAfterLoad(cityNPCImageMap);
    }

    createCityNPCsAfterLoad(npcImageMap: any) {
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
                    `City NPC ${location.npc} positioned at (${location.percentX}%, ${location.percentY}%) = (${worldX}, ${worldY})`
                );
            } else {
                // Fallback to tile-based coordinates
                worldX = location.x * this.tileSize + this.tileSize / 2;
                worldY = location.y * this.tileSize + this.tileSize / 2;
                console.log(
                    `City NPC ${location.npc} positioned at tile (${location.x}, ${location.y}) = (${worldX}, ${worldY})`
                );
            }

            // Get the specific NPC image for this city official
            const npcImageKey = npcImageMap[location.npc] || "student-front-1";

            console.log(
                `Creating City NPC: ${location.npc} with image: ${npcImageKey}`
            );
            console.log(
                `Level 2 texture exists for ${npcImageKey}:`,
                this.textures.exists(npcImageKey)
            );

            // Use fallback if texture doesn't exist
            const finalImageKey = this.textures.exists(npcImageKey)
                ? npcImageKey
                : "student-front-1";

            const npc = this.physics.add.sprite(worldX, worldY, finalImageKey);
            npc.setScale(0.18); // Same scale as player for consistent sizing
            npc.setInteractive();

            // Set up collision body for NPC
            npc.body.setSize(npc.width * 0.8, npc.height * 0.8);
            npc.body.setOffset(npc.width * 0.1, npc.height * 0.1);
            npc.body.setImmovable(true);
            npc.body.setGravity(0, 0);
            npc.body.setVelocity(0, 0);
            npc.body.setAngularVelocity(0);

            // Add NPC name with city styling
            const npcName = this.add
                .text(worldX, worldY - 35, location.npc, {
                    fontFamily: "Arial Black",
                    fontSize: 11,
                    color: "#F0F8FF", // Alice blue for city theme
                    stroke: "#000080", // Navy blue stroke
                    strokeThickness: 2,
                    align: "center",
                    shadow: {
                        offsetX: 1,
                        offsetY: 1,
                        color: "#000080",
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
            const missionNumber = this.add
                .text(worldX - 35, worldY - 35, `#${location.missionId}`, {
                    fontFamily: "Arial Black",
                    fontSize: 12,
                    color: "#87CEEB", // Sky blue for city theme
                    stroke: "#000080", // Navy blue stroke
                    strokeThickness: 2,
                    align: "center",
                    backgroundColor: "#2F4F4F", // Dark slate gray
                    padding: { x: 4, y: 2 },
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Add a city-themed glow effect around NPCs
            const glow = this.add.circle(worldX, worldY, 25, 0x4169e1, 0.15); // Royal blue glow
            glow.setDepth(-1);

            // Store mission data and original position on NPC
            npc.setData("missionData", location);
            npc.setData("originalPosition", { x: worldX, y: worldY });

            this.npcs.add(npc);
        });

        console.log(
            `Created ${this.missionLocations.length} City NPCs for Level 2 with dedicated city official sprites from LEVEL2 folder`
        );

        // Update indicators after all NPCs are created
        this.updateNPCIndicators();

        // Add collision between player and NPCs
        this.physics.add.collider(this.player, this.npcs, (player, npc) => {
            npc.body.setVelocity(0, 0);
            npc.body.setAngularVelocity(0);
            npc.body.setImmovable(true);
            player.body.setVelocity(0, 0);
            player.body.setAngularVelocity(0);
        });

        console.log("City NPC collision detection enabled");
    }

    createUI() {
        // Create interaction prompt
        this.interactionPrompt = this.add
            .text(
                512,
                600,
                this.isMobile ? "Tap to interact" : "Press SPACE to interact",
                {
                    fontFamily: "Arial Black",
                    fontSize: 16,
                    color: "#87CEEB", // Sky blue for city theme
                    stroke: "#000080", // Navy blue stroke
                    strokeThickness: 3,
                    align: "center",
                    backgroundColor: "#2F4F4F", // Dark slate gray
                    padding: { x: 10, y: 5 },
                }
            )
            .setOrigin(0.5)
            .setDepth(1000)
            .setScrollFactor(0)
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
                    backgroundColor: "rgba(70, 130, 180, 0.8)", // Steel blue for city theme
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

        console.log("City location display created above player head");
    }

    repositionPlayerRelativeToBackground() {
        if (this.player && this.backgroundImage) {
            // Position player at center of background image
            const bgX = this.backgroundImage.x;
            const bgY = this.backgroundImage.y;

            this.player.setPosition(bgX, bgY);

            console.log(
                "City player repositioned to background center:",
                bgX,
                bgY
            );
            console.log(
                "City background dimensions:",
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
                    `Repositioned City NPC ${missionData.npc} to (${missionData.percentX}%, ${missionData.percentY}%) = (${coords.x}, ${coords.y})`
                );
            }
        });
    }

    updateLocationDisplay() {
        if (this.locationDisplay && this.player) {
            // Calculate position relative to background image
            let relativeX = 0,
                relativeY = 0;
            let areaName = "City";

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

                // Determine area based on percentage position (city districts)
                if (relativeX < 25 && relativeY < 25) {
                    areaName = "Government District";
                } else if (relativeX >= 75 && relativeY < 25) {
                    areaName = "Business District";
                } else if (relativeX < 25 && relativeY >= 75) {
                    areaName = "Residential District";
                } else if (relativeX >= 75 && relativeY >= 75) {
                    areaName = "Industrial District";
                } else if (
                    relativeX >= 37.5 &&
                    relativeX < 62.5 &&
                    relativeY >= 37.5 &&
                    relativeY < 62.5
                ) {
                    areaName = "City Center";
                } else if (
                    relativeX >= 25 &&
                    relativeX < 75 &&
                    relativeY < 25
                ) {
                    areaName = "Administrative Zone";
                } else if (
                    relativeX >= 25 &&
                    relativeX < 75 &&
                    relativeY >= 75
                ) {
                    areaName = "Service District";
                } else if (
                    relativeX < 25 &&
                    relativeY >= 25 &&
                    relativeY < 75
                ) {
                    areaName = "Cultural Quarter";
                } else if (
                    relativeX >= 75 &&
                    relativeY >= 25 &&
                    relativeY < 75
                ) {
                    areaName = "Commercial Zone";
                } else {
                    areaName = "Municipal Area";
                }

                console.log(
                    `City player position: ${relativeX}%, ${relativeY}% - Area: ${areaName}`
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

    handleResize() {
        console.log("City screen resized, updating camera and background...");
        this.optimizeCameraForOpenWorld();

        // Update background scaling for new screen size
        this.updateCityBackgroundForOrientation();

        // Re-detect mobile device for new screen size
        this.isMobile =
            this.sys.game.device.input.touch ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) ||
            window.innerWidth <= 768;

        console.log("City mobile device detected after resize:", this.isMobile);
    }

    // Handle city background scaling for orientation changes
    updateCityBackgroundForOrientation() {
        // Find the city background image and update its scale
        const children = this.children.list;
        for (let child of children) {
            if (child.texture && child.texture.key === "city-bg-root") {
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
                    "City background rescaled to cover entire Phaser game canvas:"
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

    update() {
        if (!this.player) return;

        // Player movement (same logic as Level 1)
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

                if (Math.abs(velocityX) > Math.abs(velocityY)) {
                    currentDirection = velocityX > 0 ? "right" : "left";
                } else {
                    currentDirection = velocityY > 0 ? "front" : "back";
                }
                this.lastDirection = currentDirection;
            }
        }

        // Apply velocity with collision detection
        if (isMoving) {
            const newX = this.player.x + velocityX * 0.016;
            const newY = this.player.y + velocityY * 0.016;

            const isMovingAway = this.isPlayerMovingAwayFromNPCs(newX, newY);

            if (isMovingAway || this.canPlayerMoveTo(newX, newY)) {
                this.player.setVelocity(velocityX, velocityY);
            } else {
                this.player.setVelocity(0, 0);
            }
        } else {
            this.player.setVelocity(0, 0);
        }

        // Handle sprite direction and animations
        if (isMoving) {
            const spriteKey = `student-${currentDirection}-1`;
            if (this.textures.exists(spriteKey)) {
                this.player.setTexture(spriteKey);
            }

            if (this.anims && this.anims.exists) {
                const walkAnimKey = `student-${currentDirection}-walk`;
                if (this.anims.exists(walkAnimKey)) {
                    this.player.play(walkAnimKey, true);
                }
            }
        } else {
            this.player.setVelocity(0, 0);
            const idleSpriteKey = `student-${this.lastDirection}-1`;
            if (this.textures.exists(idleSpriteKey)) {
                this.player.setTexture(idleSpriteKey);
            }

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

        // Ensure NPCs stay in their original positions
        this.enforceNPCPositions();
    }

    // Helper methods (same as Level 1 with minor adjustments)
    isPlayerMovingAwayFromNPCs(newX: number, newY: number) {
        const currentDistance = this.getDistanceToNearestNPC();
        const newDistance = this.getDistanceToNearestNPC(newX, newY);
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
        const playerWidth = this.player.width * this.player.scaleX;
        const playerHeight = this.player.height * this.player.scaleY;

        for (let npc of this.npcs.children.entries) {
            const npcWidth = npc.width * npc.scaleX;
            const npcHeight = npc.height * npc.scaleY;

            const playerLeft = x - playerWidth / 2;
            const playerRight = x + playerWidth / 2;
            const playerTop = y - playerHeight / 2;
            const playerBottom = y + playerHeight / 2;

            const npcLeft = npc.x - npcWidth / 2;
            const npcRight = npc.x + npcWidth / 2;
            const npcTop = npc.y - npcHeight / 2;
            const npcBottom = npc.y + npcHeight / 2;

            const padding = 0.5;
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
        let nearestDistance = 100;

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
            }
        });

        if (nearestNPC && nearestDistance < 80) {
            this.nearbyNPC = nearestNPC;
            this.interactionPrompt.setVisible(true);
        } else {
            this.nearbyNPC = null;
            this.interactionPrompt.setVisible(false);
        }
    }

    enforceNPCPositions() {
        this.npcs.children.entries.forEach((npc: any) => {
            npc.body.setVelocity(0, 0);
            npc.body.setAngularVelocity(0);
            npc.body.setImmovable(true);

            const originalPosition = npc.getData("originalPosition");
            if (originalPosition) {
                const distance = Phaser.Math.Distance.Between(
                    npc.x,
                    npc.y,
                    originalPosition.x,
                    originalPosition.y
                );
                if (distance > 5) {
                    npc.setPosition(originalPosition.x, originalPosition.y);
                }
            }
        });
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
                message: `${location.npc}: "Excellent work on this mission! You've earned your city governance badge and contributed to municipal development. Keep up the outstanding leadership!"`,
                icon: "🏆",
                actions: [
                    {
                        label: "Continue City Service",
                        action: () => {},
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
                    : "Complete all Level 1 missions first";

            EventBus.emit("show-notification", {
                type: "info",
                title: "City Mission Prerequisites Required 🏛️",
                message: `${location.npc}: "Welcome to city government! This advanced mission requires more experience. Available missions: ${availableList}. Master the basics first, then return for municipal leadership challenges!"`,
                icon: "🏛️",
                actions: [
                    {
                        label: "Check Prerequisites",
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
            mission: this.getCityMissionData(location.missionId),
        });
    }

    getCityMissionData(missionId: number) {
        const cityMissions = {
            11: {
                id: "11",
                title: "City Ordinances 101",
                description:
                    "Learn about municipal ordinances and their role in city governance.",
                tasks: [
                    "Study city ordinance creation process",
                    "Review traffic and business regulations",
                    "Understand enforcement mechanisms",
                ],
                npc: "City Councilor",
                location: "City Hall",
                reward: "40 coins + Municipal Badge",
            },
            12: {
                id: "12",
                title: "Municipal Budget",
                description:
                    "Understand how city budgets are created and managed.",
                tasks: [
                    "Learn budget allocation principles",
                    "Study revenue sources and expenditures",
                    "Review fiscal responsibility practices",
                ],
                npc: "City Treasurer",
                location: "Treasury Office",
                reward: "45 coins + Financial Badge",
            },
            13: {
                id: "13",
                title: "Public Works Planning",
                description:
                    "Master the principles of urban infrastructure development.",
                tasks: [
                    "Plan road and bridge maintenance",
                    "Design public facility improvements",
                    "Coordinate infrastructure projects",
                ],
                npc: "City Engineer",
                location: "Engineering Department",
                reward: "50 coins + Infrastructure Badge",
            },
            14: {
                id: "14",
                title: "Business Permits & Licensing",
                description:
                    "Learn the business registration and permit system.",
                tasks: [
                    "Process business permit applications",
                    "Understand regulatory compliance",
                    "Support economic development",
                ],
                npc: "Business Permit Officer",
                location: "Business Licensing Office",
                reward: "55 coins + Commerce Badge",
            },
            15: {
                id: "15",
                title: "Urban Planning",
                description: "Master city planning and zoning principles.",
                tasks: [
                    "Develop land use plans",
                    "Understand zoning regulations",
                    "Plan sustainable city growth",
                ],
                npc: "City Planner",
                location: "Planning Department",
                reward: "60 coins + Development Badge",
            },
            16: {
                id: "16",
                title: "Environmental Management",
                description:
                    "Lead environmental protection and sustainability initiatives.",
                tasks: [
                    "Implement waste management programs",
                    "Monitor air and water quality",
                    "Promote green city initiatives",
                ],
                npc: "Environmental Officer",
                location: "Environmental Office",
                reward: "50 coins + Green Badge",
            },
            17: {
                id: "17",
                title: "Public Safety Coordination",
                description:
                    "Coordinate city-wide public safety and emergency response.",
                tasks: [
                    "Manage emergency response systems",
                    "Coordinate with police and fire departments",
                    "Develop safety protocols",
                ],
                npc: "Public Safety Officer",
                location: "Emergency Operations Center",
                reward: "65 coins + Safety Badge",
            },
            18: {
                id: "18",
                title: "Cultural Heritage",
                description:
                    "Promote and preserve the city's cultural identity and tourism.",
                tasks: [
                    "Develop cultural programs",
                    "Preserve historical sites",
                    "Promote tourism initiatives",
                ],
                npc: "Tourism Officer",
                location: "Cultural Affairs Office",
                reward: "70 coins + Heritage Badge",
            },
            19: {
                id: "19",
                title: "Healthcare Systems",
                description:
                    "Manage city-wide healthcare services and public health programs.",
                tasks: [
                    "Coordinate public health programs",
                    "Manage city hospitals and clinics",
                    "Implement health awareness campaigns",
                ],
                npc: "Health Officer",
                location: "City Health Department",
                reward: "60 coins + Health Badge",
            },
            20: {
                id: "20",
                title: "City Leadership Summit",
                description:
                    "Demonstrate mastery of municipal governance and leadership.",
                tasks: [
                    "Present comprehensive city development plan",
                    "Lead inter-departmental coordination",
                    "Address citizen concerns and feedback",
                ],
                npc: "City Mayor",
                location: "Mayor's Office",
                reward: "80 coins + Leadership Badge",
            },
        };

        return (
            cityMissions[missionId as keyof typeof cityMissions] || {
                id: missionId.toString(),
                title: "City Mission",
                description: "A mission to serve the city government.",
                tasks: ["Complete the city task"],
                npc: "City Official",
                location: "City Hall",
                reward: "40 coins",
            }
        );
    }

    createCollectibles() {
        console.log("=== CREATING CITY COLLECTIBLE ITEMS ===");
        console.log(`Background ready: ${!!this.backgroundImage}`);
        console.log(`Player exists: ${!!this.player}`);
        console.log(
            `Total items to create: ${this.collectibleItemsData.length}`
        );

        this.collectibles = this.physics.add.group();
        const gameStateManager = GameStateManager.getInstance();

        this.collectibleItemsData.forEach((item) => {
            if (gameStateManager.isItemCollected(item.id)) {
                console.log(`Item ${item.id} already collected, skipping`);
                return;
            }

            const coords = this.percentageToWorldCoordinates(
                item.percentX,
                item.percentY
            );

            const collectible = this.add
                .text(coords.x, coords.y, item.icon, {
                    fontSize: "48px",
                    fontFamily: "Arial",
                })
                .setOrigin(0.5)
                .setScrollFactor(1);

            this.physics.add.existing(collectible);
            (collectible.body as Phaser.Physics.Arcade.Body).setSize(48, 48);
            (collectible.body as Phaser.Physics.Arcade.Body).setAllowGravity(
                false
            );

            collectible.setDepth(200);
            collectible.setVisible(true);
            collectible.setData("itemData", item);

            this.collectibles.add(collectible);
            this.collectibleItems.set(item.id, collectible);

            this.tweens.add({
                targets: collectible,
                y: coords.y - 15,
                duration: 1200,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });

            const glowColor =
                item.rarity === "legendary"
                    ? 0xffd700
                    : item.rarity === "rare"
                    ? 0xff00ff
                    : item.rarity === "uncommon"
                    ? 0x00ffff
                    : 0xffffff;

            const glow = this.add.circle(
                coords.x,
                coords.y,
                30,
                glowColor,
                0.4
            );
            glow.setDepth(199);
            glow.setScrollFactor(1);

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
                `✓ Created city collectible ${item.id} at (${item.percentX}%, ${item.percentY}%)`
            );
        });

        if (this.collectibles && this.player) {
            this.physics.add.overlap(
                this.player,
                this.collectibles,
                this.collectItem,
                undefined,
                this
            );
        }

        console.log(`=== CITY COLLECTIBLES CREATION COMPLETE ===`);
        console.log(`Items created: ${this.collectibleItems.size}`);
    }

    collectItem(player: any, collectible: any) {
        const itemData = collectible.getData("itemData");
        if (!itemData) return;

        const gameStateManager = GameStateManager.getInstance();
        const collected = gameStateManager.collectItem(
            itemData.id,
            itemData.value,
            itemData.points
        );

        if (collected) {
            this.createCollectionParticles(
                collectible.x,
                collectible.y,
                itemData.rarity
            );
            this.playCollectionSound(itemData.rarity);

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

            this.showFloatingText(
                collectible.x,
                collectible.y,
                `+${itemData.value} 💰 +${itemData.points} ⭐`
            );

            this.checkCollectionAchievement();

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
        }
    }

    createCollectionParticles(x: number, y: number, rarity: string) {
        const particleColor =
            rarity === "legendary"
                ? 0xffd700
                : rarity === "rare"
                ? 0xff00ff
                : rarity === "uncommon"
                ? 0x00ffff
                : 0xffff00;

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
                onComplete: () => particle.destroy(),
            });
        }

        for (let i = 0; i < 5; i++) {
            const star = this.add.text(x, y, "⭐", { fontSize: "24px" });
            star.setOrigin(0.5);
            star.setDepth(300);

            const angle = (Math.PI * 2 * i) / 5;
            const targetX = x + Math.cos(angle) * 40;
            const targetY = y + Math.sin(angle) * 40;

            this.tweens.add({
                targets: star,
                x: targetX,
                y: targetY,
                alpha: 0,
                rotation: Math.PI * 2,
                scale: { from: 1, to: 0.5 },
                duration: 600,
                ease: "Power2",
                onComplete: () => star.destroy(),
            });
        }
    }

    playCollectionSound(rarity: string) {
        const soundFrequency =
            rarity === "legendary"
                ? [440, 554, 659, 880]
                : rarity === "rare"
                ? [392, 494, 587]
                : rarity === "uncommon"
                ? [349, 440, 523]
                : [330, 392, 440];

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
            onComplete: () => floatingText.destroy(),
        });
    }

    checkCollectionAchievement() {
        const gameStateManager = GameStateManager.getInstance();
        const totalItems = this.collectibleItemsData.length;

        const allCityItemsCollected = this.collectibleItemsData.every((item) =>
            gameStateManager.isItemCollected(item.id)
        );

        if (allCityItemsCollected) {
            EventBus.emit("show-notification", {
                type: "success",
                title: "🏆 City Master Collector! 🏆",
                message: `Incredible! You've collected all ${totalItems} items in the City! You've earned the "Municipal Treasure Hunter" badge and a bonus of 100 coins + 200 points!`,
                icon: "🎖️",
                actions: [
                    {
                        label: "Amazing!",
                        action: () => {},
                        style: "primary",
                    },
                ],
            });

            gameStateManager.addCoins(100, "City Master Collector Achievement");
            const progress = gameStateManager.getProgress();
            if (progress) {
                progress.totalScore += 200;
                gameStateManager.updatePlaytime(0);
            }

            console.log("🏆 City Master Collector Achievement unlocked!");
        }
    }

    createMinimap() {
        const minimapSize = this.isMobile ? 100 : 150;
        const minimapX = this.isMobile ? 70 : 90;
        const minimapY = this.cameras.main.height - (this.isMobile ? 120 : 170);

        this.minimap = this.add.container(minimapX, minimapY);
        this.minimap.setScrollFactor(0);
        this.minimap.setDepth(1500);

        const minimapBg = this.add.graphics();
        minimapBg.fillStyle(0x000000, 0.6);
        minimapBg.fillRoundedRect(0, 0, minimapSize, minimapSize, 8);
        minimapBg.lineStyle(2, 0x87ceeb, 1); // City blue border
        minimapBg.strokeRoundedRect(0, 0, minimapSize, minimapSize, 8);
        this.minimap.add(minimapBg);

        const minimapTitle = this.add.text(minimapSize / 2, -15, "CITY MAP", {
            fontFamily: "Arial Black",
            fontSize: "11px",
            color: "#87CEEB",
            stroke: "#000000",
            strokeThickness: 2,
        });
        minimapTitle.setOrigin(0.5);
        this.minimap.add(minimapTitle);

        this.minimapPlayerDot = this.add.circle(
            minimapSize / 2,
            minimapSize / 2,
            4,
            0x00ff00,
            1
        );
        this.minimap.add(this.minimapPlayerDot);

        this.missionLocations.forEach((location) => {
            const npcX = (location.percentX / 100) * minimapSize;
            const npcY = (location.percentY / 100) * minimapSize;

            const npcDot = this.add.circle(npcX, npcY, 2, 0x4169e1, 0.8);
            this.minimap.add(npcDot);
            this.minimapNPCDots.push(npcDot);
        });

        this.collectibleItemsData.forEach((item) => {
            const itemX = (item.percentX / 100) * minimapSize;
            const itemY = (item.percentY / 100) * minimapSize;

            const dotColor =
                item.rarity === "legendary"
                    ? 0xffd700
                    : item.rarity === "rare"
                    ? 0xff00ff
                    : item.rarity === "uncommon"
                    ? 0x00ffff
                    : 0xffff00;

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

        console.log("City minimap created with collectible locations");
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

        this.minimapPlayerDot.setPosition(
            (percentX / 100) * minimapSize,
            (percentY / 100) * minimapSize
        );

        const gameStateManager = GameStateManager.getInstance();
        this.minimapCollectibleDots.forEach((dot) => {
            const itemId = dot.getData("itemId");
            if (itemId && gameStateManager.isItemCollected(itemId)) {
                dot.setVisible(false);
            }
        });
    }
}
