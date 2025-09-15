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
        // Create tile-based map
        this.createTileMap();

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

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys("W,S,A,D");

        // Set up interaction key
        this.input.keyboard.on("keydown-SPACE", () =>
            this.interactWithNearbyNPC()
        );

        EventBus.emit("current-scene-ready", this);
    }

    createTileMap() {
        // Create tilemap data
        const mapData = this.generateMapData();

        // Create the tilemap
        this.map = this.make.tilemap({
            data: mapData,
            tileWidth: this.tileSize,
            tileHeight: this.tileSize,
        });

        // Add tileset
        this.tileset = this.map.addTilesetImage("tileset", "grass");

        // Create layers
        this.groundLayer = this.map.createLayer(0, this.tileset, 0, 0);
        this.buildingsLayer = this.map.createLayer(1, this.tileset, 0, 0);
        this.collisionLayer = this.map.createLayer(2, this.tileset, 0, 0);

        // Set collision for buildings and obstacles
        this.collisionLayer.setCollisionByProperty({ collides: true });

        // Add building labels
        this.addBuildingLabels();
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

                // Buildings layer (0 = empty, 1 = building, 2 = tree)
                let buildingTile = 0;

                // Collision layer (0 = walkable, 1 = blocked)
                let collisionTile = 0;

                // Place buildings based on mission locations
                if (this.isBuildingLocation(x, y)) {
                    buildingTile = 1;
                    collisionTile = 1;
                }

                // Add some trees for decoration
                if (
                    Math.random() < 0.05 &&
                    groundTile === 0 &&
                    buildingTile === 0
                ) {
                    buildingTile = 2;
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
            { x: 6, y: 9, width: 3, height: 2, name: "Basura Zone" },
            { x: 12, y: 6, width: 3, height: 2, name: "Sari-Sari Store" },
            { x: 18, y: 12, width: 3, height: 2, name: "Residential Area" },
            { x: 9, y: 15, width: 3, height: 2, name: "Public Market" },
            { x: 21, y: 6, width: 3, height: 2, name: "Park" },
            { x: 3, y: 18, width: 3, height: 2, name: "Covered Court" },
            { x: 15, y: 18, width: 3, height: 2, name: "Mediation Kubo" },
            { x: 25, y: 12, width: 3, height: 2, name: "Community Library" },
            { x: 6, y: 3, width: 3, height: 2, name: "Health Centerxed" },
            { x: 12, y: 12, width: 4, height: 3, name: "Barangay Hall" },
        ];

        for (const building of buildingLocations) {
            if (
                x >= building.x &&
                x < building.x + building.width &&
                y >= building.y &&
                y < building.y + building.height
            ) {
                return true;
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
            { x: 6, y: 3, name: "Health Centerss" },
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
        this.player = this.physics.add.sprite(
            16 * this.tileSize,
            12 * this.tileSize,
            "player"
        );
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1.5);

        // Set player color from character creation
        const playerColor = this.registry.get("playerColor") || 0x00ff00;
        this.player.setTint(playerColor);

        // Add collision with buildings
        this.physics.add.collider(this.player, this.collisionLayer);
    }

    createNPCs() {
        this.npcs = this.physics.add.group();

        this.missionLocations.forEach((location) => {
            const worldX = location.x * this.tileSize + this.tileSize / 2;
            const worldY = location.y * this.tileSize + this.tileSize / 2;

            const npc = this.physics.add.sprite(worldX, worldY, "npc");
            npc.setScale(1.2);
            npc.setTint(0x4169e1);
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
        this.ui = this.add.container(0, 0);

        // Pokémon-style quest log panel
        this.createPokemonQuestLog();

        // Pokémon-style stats display
        this.createPokemonStatsDisplay();

        // Pokémon-style map button
        this.createPokemonMapButton();

        // Interaction prompt
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

        this.ui.add([
            this.questLog,
            this.coinsText,
            this.badgesText,
            this.mapButton,
            this.interactionPrompt,
        ]);
    }

    createPokemonQuestLog() {
        // Quest log background with Pokémon styling
        const questBg = this.add.rectangle(150, 80, 280, 120, 0x2e86ab);
        questBg.setStrokeStyle(4, 0xffd700);
        questBg.setDepth(999);

        this.questLog = this.add
            .text(
                150,
                80,
                "Quest Log:\n- Complete 10 missions\n- Collect 8+ badges",
                {
                    fontFamily: "Arial Black",
                    fontSize: 16,
                    color: "#FFFFFF",
                    stroke: "#000000",
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
            .setDepth(1000);
    }

    createPokemonStatsDisplay() {
        // Coins display with Pokémon styling
        const coinsBg = this.add.rectangle(100, 220, 200, 40, 0xffd700);
        coinsBg.setStrokeStyle(3, 0x2e86ab);
        coinsBg.setDepth(999);

        this.coinsText = this.add
            .text(100, 220, "Coins: 0", {
                fontFamily: "Arial Black",
                fontSize: 18,
                color: "#2E86AB",
                stroke: "#FFFFFF",
                strokeThickness: 2,
            })
            .setOrigin(0.5)
            .setDepth(1000);

        // Badges display with Pokémon styling
        const badgesBg = this.add.rectangle(100, 270, 200, 40, 0xff6b6b);
        badgesBg.setStrokeStyle(3, 0x2e86ab);
        badgesBg.setDepth(999);

        this.badgesText = this.add
            .text(100, 270, "Badges: 0/10", {
                fontFamily: "Arial Black",
                fontSize: 18,
                color: "#FFFFFF",
                stroke: "#000000",
                strokeThickness: 2,
            })
            .setOrigin(0.5)
            .setDepth(1000);
    }

    createPokemonMapButton() {
        // Map button background with Pokémon styling
        const mapBg = this.add.rectangle(900, 40, 120, 50, 0x4ecdc4);
        mapBg.setStrokeStyle(4, 0x2e86ab);
        mapBg.setDepth(999);

        this.mapButton = this.add
            .text(900, 40, "MAP", {
                fontFamily: "Arial Black",
                fontSize: 20,
                color: "#FFFFFF",
                stroke: "#2E86AB",
                strokeThickness: 3,
                align: "center",
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: "#000000",
                    blur: 4,
                    fill: true,
                },
            })
            .setOrigin(0.5)
            .setDepth(1000)
            .setInteractive()
            .on("pointerdown", () => this.toggleMap())
            .on("pointerover", () => {
                this.mapButton.setColor("#FFD700");
                mapBg.setFillStyle(0xff6b6b);
                mapBg.setStrokeStyle(4, 0xffd700);
            })
            .on("pointerout", () => {
                this.mapButton.setColor("#FFFFFF");
                mapBg.setFillStyle(0x4ecdc4);
                mapBg.setStrokeStyle(4, 0x2e86ab);
            });
    }

    update() {
        // Player movement
        const speed = 200;

        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.setVelocityY(speed);
        } else {
            this.player.setVelocityY(0);
        }

        // Check for nearby NPCs
        this.checkForNearbyNPCs();

        // Update UI
        this.updateUI();
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

    updateUI() {
        const coins = this.registry.get("coins") || 0;
        const badges = this.registry.get("badges") || [];

        this.coinsText.setText(`Coins: ${coins}`);
        this.badgesText.setText(`Badges: ${badges.length}/10`);
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

        // Start mission
        this.scene.launch("MissionSystem", {
            missionId: location.missionId,
            npcName: location.npc,
            missionName: location.name,
        });
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
