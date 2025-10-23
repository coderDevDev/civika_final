/**
 * Collision Service for CIVIKA
 * Loads collision data and creates Phaser physics bodies
 */

import {
    CollisionData,
    CollisionShape,
    CollisionShapeType,
} from "../types/collision";
import { Scene } from "phaser";

export class CollisionService {
    private static instance: CollisionService;

    private constructor() {}

    public static getInstance(): CollisionService {
        if (!CollisionService.instance) {
            CollisionService.instance = new CollisionService();
        }
        return CollisionService.instance;
    }

    /**
     * Load collision data from localStorage or file
     */
    public loadCollisionData(mapName: string): CollisionData | null {
        try {
            // First try localStorage (for editor testing)
            const saved = localStorage.getItem(`civika-collision-${mapName}`);
            if (saved) {
                console.log(
                    `Loaded collision data from localStorage for ${mapName}`
                );
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error(
                "Failed to load collision data from localStorage:",
                error
            );
        }
        return null;
    }

    /**
     * Load collision data from JSON file (async)
     */
    public async loadCollisionDataFromFile(
        mapName: string
    ): Promise<CollisionData | null> {
        try {
            const filename = `${mapName.toLowerCase()}-collisions.json`;
            const response = await fetch(`/${filename}`);
            if (response.ok) {
                const data = await response.json();
                console.log(`Loaded collision data from file: ${filename}`);
                return data;
            }
        } catch (error) {
            console.warn(`No collision file found for ${mapName}:`, error);
        }
        return null;
    }

    /**
     * Create Phaser collision bodies from collision data
     */
    public createCollisions(
        scene: Scene,
        collisionData: CollisionData,
        backgroundImage: any
    ): Phaser.Physics.Arcade.StaticGroup {
        const collisionGroup = scene.physics.add.staticGroup();

        if (!backgroundImage) {
            console.warn(
                "Background image not available for collision creation"
            );
            return collisionGroup;
        }

        const bgWidth = backgroundImage.displayWidth;
        const bgHeight = backgroundImage.displayHeight;
        const bgX = backgroundImage.x;
        const bgY = backgroundImage.y;
        const bgLeft = bgX - bgWidth / 2;
        const bgTop = bgY - bgHeight / 2;

        collisionData.shapes.forEach((shape) => {
            if (shape.type === CollisionShapeType.RECTANGLE) {
                this.createRectangleCollision(
                    scene,
                    collisionGroup,
                    shape,
                    bgWidth,
                    bgHeight,
                    bgLeft,
                    bgTop
                );
            } else if (shape.type === CollisionShapeType.POLYGON) {
                this.createPolygonCollision(
                    scene,
                    collisionGroup,
                    shape,
                    bgWidth,
                    bgHeight,
                    bgLeft,
                    bgTop
                );
            } else if (shape.type === CollisionShapeType.CIRCLE) {
                this.createCircleCollision(
                    scene,
                    collisionGroup,
                    shape,
                    bgWidth,
                    bgHeight,
                    bgLeft,
                    bgTop
                );
            }
        });

        console.log(
            `Created ${collisionData.shapes.length} collision shapes for ${collisionData.mapName}`
        );

        return collisionGroup;
    }

    private createRectangleCollision(
        scene: Scene,
        group: Phaser.Physics.Arcade.StaticGroup,
        shape: CollisionShape,
        bgWidth: number,
        bgHeight: number,
        bgLeft: number,
        bgTop: number
    ) {
        const box = shape as any;
        const worldX = bgLeft + (box.percentX / 100) * bgWidth;
        const worldY = bgTop + (box.percentY / 100) * bgHeight;
        const worldWidth = (box.percentWidth / 100) * bgWidth;
        const worldHeight = (box.percentHeight / 100) * bgHeight;
        
        // 🎯 OPTIMIZE: Add padding to make collision less sensitive
        // Reduce collision body by 20% on each side (40% total reduction)
        const COLLISION_PADDING = 0.2; // 20% padding for more walkable space
        const paddedWidth = worldWidth * (1 - COLLISION_PADDING * 2);
        const paddedHeight = worldHeight * (1 - COLLISION_PADDING * 2);
        const paddingX = worldWidth * COLLISION_PADDING;
        const paddingY = worldHeight * COLLISION_PADDING;

        // Create invisible rectangle
        const collision = scene.add.rectangle(
            worldX + worldWidth / 2,
            worldY + worldHeight / 2,
            worldWidth,
            worldHeight,
            0x000000,
            0 // Invisible
        );

        // Add physics FIRST, then add to group
        scene.physics.add.existing(collision, true);
        group.add(collision);

        if (collision.body) {
            const body = collision.body as Phaser.Physics.Arcade.StaticBody;
            // Apply padded size for more realistic collision
            body.setSize(paddedWidth, paddedHeight);
            body.setOffset(paddingX, paddingY);
            body.updateFromGameObject();
        }

        console.log(
            `✅ Created rectangle collision "${box.name}" at (${box.percentX}%, ${box.percentY}%)`
        );
    }

    private createPolygonCollision(
        scene: Scene,
        group: Phaser.Physics.Arcade.StaticGroup,
        shape: CollisionShape,
        bgWidth: number,
        bgHeight: number,
        bgLeft: number,
        bgTop: number
    ) {
        const poly = shape as any;

        // Convert percentage points to world coordinates
        const worldPoints = poly.points.map((p: any) => {
            return {
                x: bgLeft + (p.percentX / 100) * bgWidth,
                y: bgTop + (p.percentY / 100) * bgHeight,
            };
        });

        // Calculate bounding box
        const minX = Math.min(...worldPoints.map((p: any) => p.x));
        const maxX = Math.max(...worldPoints.map((p: any) => p.x));
        const minY = Math.min(...worldPoints.map((p: any) => p.y));
        const maxY = Math.max(...worldPoints.map((p: any) => p.y));

        const width = maxX - minX;
        const height = maxY - minY;

        // 🎯 ENHANCED: Create multiple small rectangles to follow polygon shape more accurately
        // This gives much better collision detection than a single bounding box

        const tileSize = 20; // Size of each collision tile
        const tilesCreated: number[] = [];
        
        // 🎯 OPTIMIZE: Add padding to polygon tiles for less sensitive collision
        const TILE_PADDING = 0.35; // 35% padding on each tile for maximum walkable space
        const paddedTileSize = tileSize * (1 - TILE_PADDING * 2);

        // Create a grid of small tiles that cover only the polygon area
        for (let y = minY; y < maxY; y += tileSize) {
            for (let x = minX; x < maxX; x += tileSize) {
                const testX = x + tileSize / 2;
                const testY = y + tileSize / 2;

                // Check if this tile center is inside the polygon
                if (this.isPointInPolygon(testX, testY, worldPoints)) {
                    // Create a small collision rectangle for this tile
                    const tile = scene.add.rectangle(
                        testX,
                        testY,
                        tileSize,
                        tileSize,
                        0x000000,
                        0 // Invisible
                    );

                    scene.physics.add.existing(tile, true);
                    group.add(tile);

                    if (tile.body) {
                        const body =
                            tile.body as Phaser.Physics.Arcade.StaticBody;
                        // Apply padded size for more realistic collision
                        body.setSize(paddedTileSize, paddedTileSize);
                        body.setOffset(tileSize * TILE_PADDING, tileSize * TILE_PADDING);
                        body.updateFromGameObject();
                    }

                    tilesCreated.push(1);
                }
            }
        }

        console.log(
            `✅ Created polygon collision "${poly.name}" with ${tilesCreated.length} tiles covering ${poly.points.length} points`
        );
    }

    // Helper: Check if a point is inside a polygon using ray casting algorithm
    private isPointInPolygon(
        x: number,
        y: number,
        points: Array<{ x: number; y: number }>
    ): boolean {
        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i].x;
            const yi = points[i].y;
            const xj = points[j].x;
            const yj = points[j].y;

            const intersect =
                yi > y !== yj > y &&
                x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }
        return inside;
    }

    private createCircleCollision(
        scene: Scene,
        group: Phaser.Physics.Arcade.StaticGroup,
        shape: CollisionShape,
        bgWidth: number,
        bgHeight: number,
        bgLeft: number,
        bgTop: number
    ) {
        const circle = shape as any;
        const worldX = bgLeft + (circle.percentX / 100) * bgWidth;
        const worldY = bgTop + (circle.percentY / 100) * bgHeight;
        const worldRadius =
            (circle.percentRadius / 100) * Math.min(bgWidth, bgHeight);

        // Create invisible circle
        const collision = scene.add.circle(
            worldX,
            worldY,
            worldRadius,
            0x000000,
            0 // Invisible
        );

        scene.physics.add.existing(collision, true);
        group.add(collision);

        if (collision.body) {
            const body = collision.body as Phaser.Physics.Arcade.StaticBody;
            body.setCircle(worldRadius);
            body.updateFromGameObject();
        }

        console.log(
            `✅ Created circle collision "${circle.name}" at (${circle.percentX}%, ${circle.percentY}%)`
        );
    }

    /**
     * Save collision data
     */
    public saveCollisionData(data: CollisionData): void {
        try {
            localStorage.setItem(
                `civika-collision-${data.mapName}`,
                JSON.stringify(data)
            );
            console.log(`Collision data saved for ${data.mapName}`);
        } catch (error) {
            console.error("Failed to save collision data:", error);
        }
    }
}

export default CollisionService;
