/**
 * Collision System Type Definitions for CIVIKA
 * Background-relative collision shapes
 */

export enum CollisionShapeType {
    RECTANGLE = "rectangle",
    POLYGON = "polygon",
    CIRCLE = "circle",
}

export interface CollisionBox {
    id: string;
    type: CollisionShapeType.RECTANGLE;
    name: string;
    percentX: number; // Top-left X (background-relative %)
    percentY: number; // Top-left Y (background-relative %)
    percentWidth: number; // Width (background-relative %)
    percentHeight: number; // Height (background-relative %)
    color?: string; // For visualization in editor
}

export interface CollisionPolygon {
    id: string;
    type: CollisionShapeType.POLYGON;
    name: string;
    points: Array<{ percentX: number; percentY: number }>; // Array of points (background-relative %)
    color?: string; // For visualization in editor
}

export interface CollisionCircle {
    id: string;
    type: CollisionShapeType.CIRCLE;
    name: string;
    percentX: number; // Center X (background-relative %)
    percentY: number; // Center Y (background-relative %)
    percentRadius: number; // Radius (background-relative %)
    color?: string; // For visualization in editor
}

export type CollisionShape = CollisionBox | CollisionPolygon | CollisionCircle;

export interface CollisionData {
    mapName: string; // "BarangayMap" or "CityMap"
    version: string;
    createdAt: string;
    updatedAt: string;
    shapes: CollisionShape[];
}

export interface CollisionEditorState {
    mode: "select" | "draw-box" | "draw-polygon" | "draw-circle";
    selectedShapeId: string | null;
    drawingPoints: Array<{ percentX: number; percentY: number }>;
    isDrawing: boolean;
}
