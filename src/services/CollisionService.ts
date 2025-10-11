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
            body.setSize(worldWidth, worldHeight);
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

        // Calculate bounding box of polygon
        const minX = Math.min(...worldPoints.map((p: any) => p.x));
        const maxX = Math.max(...worldPoints.map((p: any) => p.x));
        const minY = Math.min(...worldPoints.map((p: any) => p.y));
        const maxY = Math.max(...worldPoints.map((p: any) => p.y));

        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = minX + width / 2;
        const centerY = minY + height / 2;

        // For now, create a bounding box rectangle for the polygon
        // This is simpler and more reliable than complex polygon physics
        const collision = scene.add.rectangle(
            centerX,
            centerY,
            width,
            height,
            0x000000,
            0 // Invisible
        );

        // Add physics FIRST, then add to group
        scene.physics.add.existing(collision, true);
        group.add(collision);

        if (collision.body) {
            const body = collision.body as Phaser.Physics.Arcade.StaticBody;
            body.setSize(width, height);
            body.updateFromGameObject();
        }

        console.log(
            `✅ Created polygon collision "${poly.name}" with ${poly.points.length} points (using bounding box)`
        );
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
