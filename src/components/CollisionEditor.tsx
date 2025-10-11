/**
 * Collision Editor Component for CIVIKA
 * Draw collision boxes and polygons on the background image
 * Saves to JSON with background-relative percentage coordinates
 */

import React, { useState, useRef, useEffect } from "react";
import {
    CollisionShape,
    CollisionBox,
    CollisionPolygon,
    CollisionCircle,
    CollisionData,
    CollisionShapeType,
    CollisionEditorState,
} from "../types/collision";

interface CollisionEditorProps {
    onClose: () => void;
    isVisible: boolean;
    mapName: "BarangayMap" | "CityMap";
    backgroundImage: string; // Path to background image
}

export const CollisionEditor: React.FC<CollisionEditorProps> = ({
    onClose,
    isVisible,
    mapName,
    backgroundImage,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [collisionData, setCollisionData] = useState<CollisionData>({
        mapName,
        version: "1.0.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shapes: [],
    });
    const [editorState, setEditorState] = useState<CollisionEditorState>({
        mode: "select",
        selectedShapeId: null,
        drawingPoints: [],
        isDrawing: false,
    });
    const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [showGrid, setShowGrid] = useState(true);
    const [showShapeList, setShowShapeList] = useState(true);

    // Load background image
    useEffect(() => {
        if (isVisible && backgroundImage) {
            const img = new Image();
            img.src = backgroundImage;
            img.onload = () => {
                setBgImage(img);
                // Adjust canvas to fit background while maintaining aspect ratio
                const maxWidth = window.innerWidth * 0.7;
                const maxHeight = window.innerHeight * 0.7;
                const scale = Math.min(
                    maxWidth / img.width,
                    maxHeight / img.height,
                    1
                );
                setCanvasSize({
                    width: img.width * scale,
                    height: img.height * scale,
                });
            };
        }
    }, [isVisible, backgroundImage]);

    // Load existing collision data
    useEffect(() => {
        if (isVisible) {
            loadCollisionData();
        }
    }, [isVisible, mapName]);

    // Draw canvas
    useEffect(() => {
        if (!canvasRef.current || !bgImage) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background image
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // Draw grid if enabled
        if (showGrid) {
            drawGrid(ctx, canvas.width, canvas.height);
        }

        // Draw all collision shapes
        collisionData.shapes.forEach((shape) => {
            drawShape(ctx, shape, canvas.width, canvas.height);
        });

        // Draw current drawing
        if (editorState.isDrawing && editorState.drawingPoints.length > 0) {
            drawCurrentDrawing(ctx, canvas.width, canvas.height);
        }
    }, [bgImage, collisionData, editorState, showGrid, canvasSize]);

    const drawGrid = (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;

        // Draw vertical lines every 10%
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Draw horizontal lines every 10%
        for (let i = 0; i <= 10; i++) {
            const y = (i / 10) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    };

    const drawShape = (
        ctx: CanvasRenderingContext2D,
        shape: CollisionShape,
        canvasWidth: number,
        canvasHeight: number
    ) => {
        const isSelected = shape.id === editorState.selectedShapeId;
        const color = shape.color || "#FF0000";
        ctx.fillStyle = isSelected
            ? "rgba(255, 255, 0, 0.3)"
            : `${color}33`; // 33 = 20% opacity
        ctx.strokeStyle = isSelected ? "#FFFF00" : color;
        ctx.lineWidth = isSelected ? 3 : 2;

        if (shape.type === CollisionShapeType.RECTANGLE) {
            const box = shape as CollisionBox;
            const x = (box.percentX / 100) * canvasWidth;
            const y = (box.percentY / 100) * canvasHeight;
            const w = (box.percentWidth / 100) * canvasWidth;
            const h = (box.percentHeight / 100) * canvasHeight;

            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);

            // Draw label
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "12px Arial";
            ctx.fillText(box.name, x + 5, y + 15);
        } else if (shape.type === CollisionShapeType.POLYGON) {
            const poly = shape as CollisionPolygon;
            if (poly.points.length < 2) return;

            ctx.beginPath();
            const firstPoint = poly.points[0];
            ctx.moveTo(
                (firstPoint.percentX / 100) * canvasWidth,
                (firstPoint.percentY / 100) * canvasHeight
            );

            for (let i = 1; i < poly.points.length; i++) {
                const point = poly.points[i];
                ctx.lineTo(
                    (point.percentX / 100) * canvasWidth,
                    (point.percentY / 100) * canvasHeight
                );
            }

            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw label
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "12px Arial";
            ctx.fillText(poly.name, (firstPoint.percentX / 100) * canvasWidth + 5, (firstPoint.percentY / 100) * canvasHeight + 15);
        } else if (shape.type === CollisionShapeType.CIRCLE) {
            const circle = shape as CollisionCircle;
            const x = (circle.percentX / 100) * canvasWidth;
            const y = (circle.percentY / 100) * canvasHeight;
            const r = (circle.percentRadius / 100) * Math.min(canvasWidth, canvasHeight);

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Draw label
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "12px Arial";
            ctx.fillText(circle.name, x + 5, y + 5);
        }
    };

    const drawCurrentDrawing = (
        ctx: CanvasRenderingContext2D,
        canvasWidth: number,
        canvasHeight: number
    ) => {
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        if (editorState.mode === "draw-polygon") {
            if (editorState.drawingPoints.length >= 2) {
                ctx.beginPath();
                const firstPoint = editorState.drawingPoints[0];
                ctx.moveTo(
                    (firstPoint.percentX / 100) * canvasWidth,
                    (firstPoint.percentY / 100) * canvasHeight
                );

                for (let i = 1; i < editorState.drawingPoints.length; i++) {
                    const point = editorState.drawingPoints[i];
                    ctx.lineTo(
                        (point.percentX / 100) * canvasWidth,
                        (point.percentY / 100) * canvasHeight
                    );
                }

                ctx.stroke();

                // Draw points
                editorState.drawingPoints.forEach((point) => {
                    ctx.fillStyle = "#00FF00";
                    ctx.beginPath();
                    ctx.arc(
                        (point.percentX / 100) * canvasWidth,
                        (point.percentY / 100) * canvasHeight,
                        5,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                });
            }
        }

        ctx.setLineDash([]);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const percentX = (x / canvasSize.width) * 100;
        const percentY = (y / canvasSize.height) * 100;

        if (editorState.mode === "draw-box") {
            startDrawingBox(percentX, percentY);
        } else if (editorState.mode === "draw-polygon") {
            addPolygonPoint(percentX, percentY);
        } else if (editorState.mode === "draw-circle") {
            startDrawingCircle(percentX, percentY);
        } else if (editorState.mode === "select") {
            selectShapeAtPoint(percentX, percentY);
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || !editorState.isDrawing) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const percentX = (x / canvasSize.width) * 100;
        const percentY = (y / canvasSize.height) * 100;

        if (editorState.mode === "draw-box" && editorState.drawingPoints.length === 1) {
            // Update preview
            // This would show a preview rectangle while dragging
        }
    };

    const startDrawingBox = (percentX: number, percentY: number) => {
        if (!editorState.isDrawing) {
            // First click - start drawing
            setEditorState({
                ...editorState,
                isDrawing: true,
                drawingPoints: [{ percentX, percentY }],
            });
        } else {
            // Second click - finish drawing
            const startPoint = editorState.drawingPoints[0];
            const width = Math.abs(percentX - startPoint.percentX);
            const height = Math.abs(percentY - startPoint.percentY);
            const topLeftX = Math.min(startPoint.percentX, percentX);
            const topLeftY = Math.min(startPoint.percentY, percentY);

            const newBox: CollisionBox = {
                id: `box-${Date.now()}`,
                type: CollisionShapeType.RECTANGLE,
                name: `Collision Box ${collisionData.shapes.length + 1}`,
                percentX: topLeftX,
                percentY: topLeftY,
                percentWidth: width,
                percentHeight: height,
                color: "#FF0000",
            };

            setCollisionData({
                ...collisionData,
                shapes: [...collisionData.shapes, newBox],
                updatedAt: new Date().toISOString(),
            });

            setEditorState({
                ...editorState,
                isDrawing: false,
                drawingPoints: [],
                mode: "select",
            });
        }
    };

    const addPolygonPoint = (percentX: number, percentY: number) => {
        setEditorState({
            ...editorState,
            isDrawing: true,
            drawingPoints: [
                ...editorState.drawingPoints,
                { percentX, percentY },
            ],
        });
    };

    const finishPolygon = () => {
        if (editorState.drawingPoints.length < 3) {
            alert("A polygon needs at least 3 points!");
            return;
        }

        const newPolygon: CollisionPolygon = {
            id: `polygon-${Date.now()}`,
            type: CollisionShapeType.POLYGON,
            name: `Collision Polygon ${collisionData.shapes.length + 1}`,
            points: editorState.drawingPoints,
            color: "#0000FF",
        };

        setCollisionData({
            ...collisionData,
            shapes: [...collisionData.shapes, newPolygon],
            updatedAt: new Date().toISOString(),
        });

        setEditorState({
            ...editorState,
            isDrawing: false,
            drawingPoints: [],
            mode: "select",
        });
    };

    const startDrawingCircle = (percentX: number, percentY: number) => {
        if (!editorState.isDrawing) {
            // First click - set center
            setEditorState({
                ...editorState,
                isDrawing: true,
                drawingPoints: [{ percentX, percentY }],
            });
        } else {
            // Second click - set radius
            const center = editorState.drawingPoints[0];
            const dx = percentX - center.percentX;
            const dy = percentY - center.percentY;
            const radius = Math.sqrt(dx * dx + dy * dy);

            const newCircle: CollisionCircle = {
                id: `circle-${Date.now()}`,
                type: CollisionShapeType.CIRCLE,
                name: `Collision Circle ${collisionData.shapes.length + 1}`,
                percentX: center.percentX,
                percentY: center.percentY,
                percentRadius: radius,
                color: "#00FF00",
            };

            setCollisionData({
                ...collisionData,
                shapes: [...collisionData.shapes, newCircle],
                updatedAt: new Date().toISOString(),
            });

            setEditorState({
                ...editorState,
                isDrawing: false,
                drawingPoints: [],
                mode: "select",
            });
        }
    };

    const selectShapeAtPoint = (percentX: number, percentY: number) => {
        // Find shape at clicked point
        for (const shape of collisionData.shapes) {
            if (shape.type === CollisionShapeType.RECTANGLE) {
                const box = shape as CollisionBox;
                if (
                    percentX >= box.percentX &&
                    percentX <= box.percentX + box.percentWidth &&
                    percentY >= box.percentY &&
                    percentY <= box.percentY + box.percentHeight
                ) {
                    setEditorState({ ...editorState, selectedShapeId: shape.id });
                    return;
                }
            }
            // TODO: Add polygon and circle hit detection
        }

        // No shape found
        setEditorState({ ...editorState, selectedShapeId: null });
    };

    const deleteSelectedShape = () => {
        if (!editorState.selectedShapeId) return;

        setCollisionData({
            ...collisionData,
            shapes: collisionData.shapes.filter(
                (s) => s.id !== editorState.selectedShapeId
            ),
            updatedAt: new Date().toISOString(),
        });

        setEditorState({ ...editorState, selectedShapeId: null });
    };

    const saveCollisionData = () => {
        const filename = `${mapName.toLowerCase()}-collisions.json`;
        const json = JSON.stringify(collisionData, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        alert(`Collision data saved to ${filename}!`);
    };

    const loadCollisionData = () => {
        try {
            const saved = localStorage.getItem(`civika-collision-${mapName}`);
            if (saved) {
                const data = JSON.parse(saved);
                setCollisionData(data);
            }
        } catch (error) {
            console.error("Failed to load collision data:", error);
        }
    };

    const saveToLocalStorage = () => {
        try {
            localStorage.setItem(
                `civika-collision-${mapName}`,
                JSON.stringify(collisionData)
            );
            alert("Collision data saved to browser storage!");
        } catch (error) {
            console.error("Failed to save collision data:", error);
            alert("Failed to save collision data!");
        }
    };

    const loadFromFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target?.result as string);
                    setCollisionData(data);
                    alert("Collision data loaded successfully!");
                } catch (error) {
                    console.error("Failed to load collision data:", error);
                    alert("Failed to load collision data!");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const clearAll = () => {
        if (
            confirm(
                "Are you sure you want to delete all collision shapes? This cannot be undone!"
            )
        ) {
            setCollisionData({
                ...collisionData,
                shapes: [],
                updatedAt: new Date().toISOString(),
            });
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden border-4 border-amber-600">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-700 to-orange-700 p-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                        <span>🎨</span>
                        <span>Collision Editor - {mapName}</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-200 hover:scale-110"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel - Tools */}
                    <div className="w-64 bg-gray-800 p-4 overflow-y-auto border-r-2 border-amber-600">
                        <h3 className="text-lg font-bold text-amber-400 mb-4">
                            🛠️ Tools
                        </h3>

                        {/* Drawing Modes */}
                        <div className="space-y-2 mb-6">
                            <button
                                onClick={() =>
                                    setEditorState({
                                        ...editorState,
                                        mode: "select",
                                        isDrawing: false,
                                        drawingPoints: [],
                                    })
                                }
                                className={`w-full px-4 py-2 rounded font-bold transition-all ${
                                    editorState.mode === "select"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                                ↖️ Select
                            </button>
                            <button
                                onClick={() =>
                                    setEditorState({
                                        ...editorState,
                                        mode: "draw-box",
                                        isDrawing: false,
                                        drawingPoints: [],
                                    })
                                }
                                className={`w-full px-4 py-2 rounded font-bold transition-all ${
                                    editorState.mode === "draw-box"
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                                ⬜ Draw Box
                            </button>
                            <button
                                onClick={() =>
                                    setEditorState({
                                        ...editorState,
                                        mode: "draw-polygon",
                                        isDrawing: false,
                                        drawingPoints: [],
                                    })
                                }
                                className={`w-full px-4 py-2 rounded font-bold transition-all ${
                                    editorState.mode === "draw-polygon"
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                                🔷 Draw Polygon
                            </button>
                            <button
                                onClick={() =>
                                    setEditorState({
                                        ...editorState,
                                        mode: "draw-circle",
                                        isDrawing: false,
                                        drawingPoints: [],
                                    })
                                }
                                className={`w-full px-4 py-2 rounded font-bold transition-all ${
                                    editorState.mode === "draw-circle"
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                                ⭕ Draw Circle
                            </button>
                        </div>

                        {/* Polygon Controls */}
                        {editorState.mode === "draw-polygon" &&
                            editorState.isDrawing && (
                                <div className="mb-6 p-3 bg-purple-900 rounded">
                                    <p className="text-white text-sm mb-2">
                                        Points: {editorState.drawingPoints.length}
                                    </p>
                                    <button
                                        onClick={finishPolygon}
                                        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
                                    >
                                        ✅ Finish Polygon
                                    </button>
                                    <button
                                        onClick={() =>
                                            setEditorState({
                                                ...editorState,
                                                isDrawing: false,
                                                drawingPoints: [],
                                            })
                                        }
                                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded mt-2"
                                    >
                                        ❌ Cancel
                                    </button>
                                </div>
                            )}

                        {/* Actions */}
                        <div className="space-y-2 mb-6">
                            <button
                                onClick={deleteSelectedShape}
                                disabled={!editorState.selectedShapeId}
                                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-all"
                            >
                                🗑️ Delete Selected
                            </button>
                            <button
                                onClick={clearAll}
                                className="w-full px-4 py-2 bg-red-800 hover:bg-red-900 text-white font-bold rounded transition-all"
                            >
                                ⚠️ Clear All
                            </button>
                        </div>

                        {/* View Options */}
                        <div className="space-y-2 mb-6">
                            <label className="flex items-center space-x-2 text-white">
                                <input
                                    type="checkbox"
                                    checked={showGrid}
                                    onChange={(e) => setShowGrid(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>Show Grid</span>
                            </label>
                            <label className="flex items-center space-x-2 text-white">
                                <input
                                    type="checkbox"
                                    checked={showShapeList}
                                    onChange={(e) =>
                                        setShowShapeList(e.target.checked)
                                    }
                                    className="w-4 h-4"
                                />
                                <span>Show Shape List</span>
                            </label>
                        </div>

                        {/* Save/Load */}
                        <div className="space-y-2">
                            <button
                                onClick={saveCollisionData}
                                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-all"
                            >
                                💾 Download JSON
                            </button>
                            <button
                                onClick={saveToLocalStorage}
                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all"
                            >
                                💿 Save to Browser
                            </button>
                            <button
                                onClick={loadFromFile}
                                className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded transition-all"
                            >
                                📂 Load from File
                            </button>
                        </div>
                    </div>

                    {/* Center Panel - Canvas */}
                    <div className="flex-1 bg-gray-900 p-4 flex items-center justify-center overflow-auto">
                        <div className="relative">
                            <canvas
                                ref={canvasRef}
                                width={canvasSize.width}
                                height={canvasSize.height}
                                onClick={handleCanvasClick}
                                onMouseMove={handleCanvasMouseMove}
                                className="border-2 border-amber-600 cursor-crosshair"
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                            />
                            <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-2 rounded text-sm">
                                <p>
                                    Mode:{" "}
                                    <span className="font-bold text-yellow-400">
                                        {editorState.mode}
                                    </span>
                                </p>
                                {editorState.isDrawing && (
                                    <p className="text-green-400">
                                        Drawing... (
                                        {editorState.drawingPoints.length} points)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Shape List */}
                    {showShapeList && (
                        <div className="w-64 bg-gray-800 p-4 overflow-y-auto border-l-2 border-amber-600">
                            <h3 className="text-lg font-bold text-amber-400 mb-4">
                                📋 Shapes ({collisionData.shapes.length})
                            </h3>

                            {collisionData.shapes.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-8">
                                    No collision shapes yet. Start drawing!
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {collisionData.shapes.map((shape) => (
                                        <div
                                            key={shape.id}
                                            onClick={() =>
                                                setEditorState({
                                                    ...editorState,
                                                    selectedShapeId: shape.id,
                                                    mode: "select",
                                                })
                                            }
                                            className={`p-3 rounded cursor-pointer transition-all ${
                                                shape.id ===
                                                editorState.selectedShapeId
                                                    ? "bg-yellow-600 text-white"
                                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                            }`}
                                        >
                                            <p className="font-bold text-sm">
                                                {shape.type === "rectangle" && "⬜"}
                                                {shape.type === "polygon" && "🔷"}
                                                {shape.type === "circle" && "⭕"}{" "}
                                                {shape.name}
                                            </p>
                                            <p className="text-xs opacity-75 mt-1">
                                                {shape.type === "rectangle" &&
                                                    `(${(shape as CollisionBox).percentX.toFixed(
                                                        1
                                                    )}%, ${(shape as CollisionBox).percentY.toFixed(
                                                        1
                                                    )}%)`}
                                                {shape.type === "polygon" &&
                                                    `${(shape as CollisionPolygon).points.length} points`}
                                                {shape.type === "circle" &&
                                                    `r=${(shape as CollisionCircle).percentRadius.toFixed(
                                                        1
                                                    )}%`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer - Instructions */}
                <div className="bg-gray-800 p-3 border-t-2 border-amber-600">
                    <div className="text-sm text-white flex items-center justify-between">
                        <div>
                            <p>
                                📖{" "}
                                <span className="font-bold">
                                    {editorState.mode === "select" &&
                                        "Click shapes to select"}
                                    {editorState.mode === "draw-box" &&
                                        "Click two corners to draw a box"}
                                    {editorState.mode === "draw-polygon" &&
                                        "Click to add points, then finish"}
                                    {editorState.mode === "draw-circle" &&
                                        "Click center, then click to set radius"}
                                </span>
                            </p>
                        </div>
                        <div className="text-amber-400">
                            Total: {collisionData.shapes.length} shapes
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


