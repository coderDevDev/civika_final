import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

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
    tileSize: number = 32;
    mapWidth: number = 32; // 32 tiles wide
    mapHeight: number = 24; // 24 tiles tall
    lastDirection: string = "front"; // Track last direction for idle sprites

    // Mission locations with tile coordinates
    missionLocations = [
        {
            x: 6,
            y: 9,
            name: "Basura Patrol",
            npc: "Barangay Tanod",
            missionId: 1,
        },
        {
            x: 12,
            y: 6,
            name: "Taga Rehistro",
            npc: "COMELEC Volunteer",
            missionId: 2,
        },
        {
            x: 18,
            y: 12,
            name: "Kapitbahay Ko",
            npc: "Elderly Resident",
            missionId: 3,
        },
        {
            x: 9,
            y: 15,
            name: "Ordinansa Time",
            npc: "Barangay Secretary",
            missionId: 4,
        },
        {
            x: 21,
            y: 6,
            name: "Fake or Fact?",
            npc: "High School Student",
            missionId: 5,
        },
        {
            x: 3,
            y: 18,
            name: "Serbisyo Seryoso",
            npc: "Construction Foreman",
            missionId: 6,
        },
        {
            x: 15,
            y: 18,
            name: "Ayusin Natin 'To",
            npc: "Mediation Officer",
            missionId: 7,
        },
        {
            x: 25,
            y: 12,
            name: "Civic Memory Hunt",
            npc: "Librarian",
            missionId: 8,
        },
        {
            x: 6,
            y: 3,
            name: "Kabataang Kalusugan",
            npc: "Barangay Health Worker",
            missionId: 9,
        },
        {
            x: 12,
            y: 12,
            name: "Pagpupulong ng Barangay",
            npc: "Barangay Captain",
            missionId: 10,
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
        this.createCollisionAreas();

        // Create player with collision
        this.createPlayer();

        // Create NPCs
        this.createNPCs();

        // Create UI
        this.createUI();

        // Set up camera
        this.cameras.main.setBounds(
            0,
            0,
            this.mapWidth * this.tileSize,
            this.mapHeight * this.tileSize
        );
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // Debug camera and scene info
        console.log(
            "Camera position:",
            this.cameras.main.x,
            this.cameras.main.y
        );
        console.log("Camera bounds:", this.cameras.main.getBounds());
        console.log("Camera zoom:", this.cameras.main.zoom);
        console.log("Scene visible:", this.scene.isVisible());
        console.log("Scene active:", this.scene.isActive());

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys("W,S,A,D");

        // Set up interaction key
        this.input.keyboard.on("keydown-SPACE", () =>
            this.interactWithNearbyNPC()
        );

        EventBus.emit("current-scene-ready", this);
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
                const bgImage = this.add.image(512, 384, "barangay-bg-root");
                bgImage.setOrigin(0.5, 0.5);
                bgImage.setDepth(-2000); // Much further behind everything
                bgImage.setScale(1024 / bgImage.width, 768 / bgImage.height); // Scale to fit screen
                bgImage.setAlpha(1); // Fully visible
                bgImage.setVisible(true); // Explicitly set visible
                console.log("Root background image created successfully");
                console.log(
                    "Root background image position:",
                    bgImage.x,
                    bgImage.y
                );
                console.log(
                    "Root background image dimensions:",
                    bgImage.width,
                    bgImage.height
                );
                console.log(
                    "Root background image scale:",
                    bgImage.scaleX,
                    bgImage.scaleY
                );
                console.log("Root background image visible:", bgImage.visible);
                console.log("Root background image alpha:", bgImage.alpha);
                console.log("Root background image depth:", bgImage.depth);
            } catch (error) {
                console.error("Error creating root background image:", error);
                // Fallback to teal background if image fails
                const bg = this.add.rectangle(512, 384, 1024, 768, 0x20b2aa);
                bg.setDepth(-2000);
                console.log("Using fallback teal background");
            }
        } else {
            console.log(
                "Barangay background texture not found, using fallback"
            );
            // Create a teal background as fallback
            const bg = this.add.rectangle(512, 384, 1024, 768, 0x20b2aa);
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

        buildingCollisions.forEach((building, index) => {
            const collision = this.add.rectangle(
                building.x + building.width / 2,
                building.y + building.height / 2,
                building.width,
                building.height,
                0x000000,
                0 // Invisible
            );
            this.physics.add.existing(collision, true);
            collision.body.setSize(building.width, building.height);
            console.log(
                `Building collision ${index + 1} created at (${building.x}, ${
                    building.y
                })`
            );
        });
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
        this.createSimpleTileMap();

        // Add building labels
        this.addBuildingLabels();
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

        this.player = this.physics.add.sprite(
            16 * this.tileSize,
            12 * this.tileSize,
            playerTexture
        );
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.3); // Much smaller scale for student sprites

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

        this.missionLocations.forEach((location) => {
            const worldX = location.x * this.tileSize + this.tileSize / 2;
            const worldY = location.y * this.tileSize + this.tileSize / 2;

            const npc = this.physics.add.sprite(
                worldX,
                worldY,
                "student-front-1"
            );
            npc.setScale(0.6); // Smaller scale for NPCs
            // Temporarily disable color tinting for student sprites
            // npc.setTint(0x4169e1); // Blue tint for NPCs
            npc.setInteractive();

            // Add NPC name
            this.add
                .text(worldX, worldY - 30, location.npc, {
                    fontFamily: "Arial",
                    fontSize: 10,
                    color: "#000000",
                    align: "center",
                })
                .setOrigin(0.5);

            // Add mission indicator
            const missionIndicator = this.add
                .text(worldX + 20, worldY - 20, "!", {
                    fontFamily: "Arial Black",
                    fontSize: 16,
                    color: "#FF0000",
                    align: "center",
                })
                .setOrigin(0.5);

            // Store mission data on NPC
            npc.setData("missionData", location);

            this.npcs.add(npc);
        });
    }

    createUI() {
        // Only create the interaction prompt since other UI is handled by React
        this.interactionPrompt = this.add
            .text(512, 600, "Press SPACE to interact", {
                fontFamily: "Arial Black",
                fontSize: 16,
                color: "#FFD700",
                stroke: "#000000",
                strokeThickness: 3,
                align: "center",
                backgroundColor: "#2E86AB",
                padding: { x: 10, y: 5 },
            })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(false);
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

        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-speed);
            // Don't flip - use left sprite instead
            isMoving = true;
            currentDirection = "left";
            this.lastDirection = "left";
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(speed);
            // Don't flip - use right sprite instead
            isMoving = true;
            currentDirection = "right";
            this.lastDirection = "right";
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.setVelocityY(-speed);
            isMoving = true;
            currentDirection = "back";
            this.lastDirection = "back";
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.setVelocityY(speed);
            isMoving = true;
            currentDirection = "front";
            this.lastDirection = "front";
        } else {
            this.player.setVelocityY(0);
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
    }

    checkForNearbyNPCs() {
        let nearestNPC = null;
        let nearestDistance = 100; // Interaction range

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

        if (nearestNPC && nearestDistance < 50) {
            this.nearbyNPC = nearestNPC;
            this.interactionPrompt.setVisible(true);
        } else {
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
        // Check if mission is already completed
        const completedMissions = this.registry.get("completedMissions") || [];
        if (completedMissions.includes(location.missionId)) {
            this.showMessage(
                `${location.npc}: "Thank you for completing this mission!"`
            );
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
            missions[missionId] || {
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
