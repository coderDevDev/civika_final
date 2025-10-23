# CIVIKA Collision System - Complete Guide

## Overview
The collision system in CIVIKA allows you to create invisible barriers that prevent the player from walking through buildings, walls, and other obstacles. It uses a visual editor to draw collision shapes and saves them as percentage-based coordinates for responsive scaling.

---

## 🎨 Collision Editor

### **What It Does**
The Collision Editor is a visual tool that lets you:
- Draw collision shapes directly on the map background
- See exactly where collisions will be placed
- Save/load collision data
- Test collisions in real-time

### **How to Access**
1. Start the game
2. Press **ESC** to open pause menu
3. Click **"🎨 Collision Editor"** button
4. Choose which map to edit (BarangayMap or CityMap)

---

## 🛠️ Drawing Collision Shapes

### **Available Shape Types**

#### **1. Rectangle (⬜ Draw Box)**
- **Best for**: Buildings, walls, rectangular obstacles
- **How to draw**:
  1. Click "⬜ Draw Box" button
  2. Click once to set first corner
  3. Click again to set opposite corner
  4. Rectangle is created automatically

#### **2. Polygon (🔷 Draw Polygon)**
- **Best for**: Irregular shapes, angled walls, complex obstacles
- **How to draw**:
  1. Click "🔷 Draw Polygon" button
  2. Click to place each point (minimum 3 points)
  3. Click "✅ Finish Polygon" when done
  4. Or click "❌ Cancel" to abort

#### **3. Circle (⭕ Draw Circle)**
- **Best for**: Round obstacles, pillars, circular areas
- **How to draw**:
  1. Click "⭕ Draw Circle" button
  2. Click once to set center
  3. Click again to set radius
  4. Circle is created automatically

---

## 📐 Coordinate System

### **Percentage-Based Coordinates**
All collision shapes use **percentage coordinates** (0-100%) instead of pixel coordinates.

**Why?**
- ✅ Works on any screen size (mobile, tablet, desktop)
- ✅ Scales automatically with background image
- ✅ Responsive to different resolutions
- ✅ No need to redraw for different devices

**Example:**
```json
{
  "percentX": 50,      // 50% from left edge
  "percentY": 30,      // 30% from top edge
  "percentWidth": 10,  // 10% of background width
  "percentHeight": 15  // 15% of background height
}
```

---

## 💾 Saving & Loading

### **Save Options**

#### **1. Download JSON (💾 Download JSON)**
- Saves collision data as a JSON file
- File name: `barangaymap-collisions.json` or `citymap-collisions.json`
- **Use for**: Permanent storage, version control, sharing with team

#### **2. Save to Browser (💿 Save to Browser)**
- Saves to browser's localStorage
- Persists between sessions
- **Use for**: Quick testing, temporary edits

#### **3. Load from File (📂 Load from File)**
- Load previously saved JSON file
- Replaces current collision data
- **Use for**: Restoring backups, importing from team

---

## 🎮 How Collisions Work in Game

### **Loading Process**

1. **Game Scene Starts** (BarangayMap or CityMap)
2. **Background Image Loads**
3. **Collision Service Loads Data**:
   - First checks **localStorage** (from editor)
   - If not found, checks **public folder** for JSON file
4. **Collision Bodies Created**:
   - Converts percentage coordinates to world coordinates
   - Creates invisible Phaser physics bodies
   - Adds to static collision group

### **Collision Detection**

```typescript
// In BarangayMap.ts / CityMap.ts
this.physics.add.collider(this.player, this.collisionBodies);
```

- Player sprite has physics body
- Collision bodies are static (don't move)
- Phaser's Arcade Physics handles collision detection
- Player **cannot pass through** collision bodies

---

## 🔧 Technical Details

### **File Structure**

```
src/
├── components/
│   └── CollisionEditor.tsx       # Visual editor UI
├── services/
│   └── CollisionService.ts       # Collision loading & creation
├── types/
│   └── collision.ts              # TypeScript types
└── game/scenes/
    ├── BarangayMap.ts            # Loads collisions for Level 1
    └── CityMap.ts                # Loads collisions for Level 2
```

### **Data Format**

```json
{
  "mapName": "BarangayMap",
  "version": "1.0.0",
  "createdAt": "2025-10-23T12:00:00.000Z",
  "updatedAt": "2025-10-23T12:30:00.000Z",
  "shapes": [
    {
      "id": "box-1729680000000",
      "type": "rectangle",
      "name": "Collision Box 1",
      "percentX": 20,
      "percentY": 30,
      "percentWidth": 15,
      "percentHeight": 10,
      "color": "#FF0000"
    },
    {
      "id": "polygon-1729680100000",
      "type": "polygon",
      "name": "Collision Polygon 1",
      "points": [
        { "percentX": 50, "percentY": 20 },
        { "percentX": 60, "percentY": 30 },
        { "percentX": 55, "percentY": 40 }
      ],
      "color": "#0000FF"
    }
  ]
}
```

---

## 🎯 Polygon Collision Enhancement

### **Smart Tile-Based System**

Polygons are converted into **multiple small collision tiles** (20x20 pixels) for accurate collision detection:

```typescript
// CollisionService.ts - createPolygonCollision()
const tileSize = 20;

// Create grid of tiles that cover only the polygon area
for (let y = minY; y < maxY; y += tileSize) {
    for (let x = minX; x < maxX; x += tileSize) {
        // Check if tile center is inside polygon
        if (this.isPointInPolygon(testX, testY, worldPoints)) {
            // Create collision tile
            const tile = scene.add.rectangle(testX, testY, tileSize, tileSize);
            scene.physics.add.existing(tile, true);
            group.add(tile);
        }
    }
}
```

**Benefits:**
- ✅ Accurate collision for complex shapes
- ✅ Better than single bounding box
- ✅ Follows polygon contours closely
- ✅ Efficient performance

---

## 🐛 Debug Mode

### **Visual Collision Boundaries**

Set `DEBUG_SHOW_COLLISIONS = true` in scene files to see collision shapes:

```typescript
// In BarangayMap.ts or CityMap.ts
private readonly DEBUG_SHOW_COLLISIONS: boolean = true;
```

**What you'll see:**
- 🔴 **Red outlines** for rectangles
- 🔵 **Blue outlines** for polygons
- 🟢 **Green outlines** for circles

**Production:**
```typescript
private readonly DEBUG_SHOW_COLLISIONS: boolean = false;
```

---

## 📝 Workflow Example

### **Adding Collisions to a Building**

1. **Open Collision Editor**
   - Press ESC → Click "Collision Editor"
   - Select "BarangayMap"

2. **Draw Building Outline**
   - Click "⬜ Draw Box"
   - Click top-left corner of building
   - Click bottom-right corner
   - Box appears with semi-transparent red fill

3. **Add Complex Shapes**
   - For angled walls: Use "🔷 Draw Polygon"
   - Click each corner point
   - Click "Finish Polygon"

4. **Test & Adjust**
   - Click "↖️ Select" mode
   - Click shapes to select them
   - Click "🗑️ Delete Selected" to remove
   - Redraw if needed

5. **Save Your Work**
   - Click "💿 Save to Browser" (for testing)
   - Click "💾 Download JSON" (for permanent save)

6. **Test in Game**
   - Close editor
   - Walk around with player
   - Player should collide with your shapes

7. **Deploy to Production**
   - Place JSON file in `public/` folder
   - Name it `barangaymap-collisions.json`
   - Game will load it automatically

---

## 🔄 How Editing Affects the Game

### **Immediate Effects (During Editing)**
- ✅ Shapes drawn in editor are saved to localStorage
- ✅ Changes are visible immediately in editor canvas
- ✅ Grid helps align shapes precisely

### **After Saving to Browser**
- ✅ Collisions persist in localStorage
- ✅ Game loads from localStorage on next play
- ✅ Can test without restarting game

### **After Downloading JSON**
- ✅ JSON file contains all collision data
- ✅ Can be version controlled (Git)
- ✅ Can be shared with team members
- ✅ Place in `public/` folder for production

### **In Production**
```typescript
// Loading priority in CollisionService.ts
1. Try localStorage (editor testing)
2. Try JSON file from public/ folder (production)
3. If neither found, no collisions loaded
```

---

## ⚠️ Common Issues & Solutions

### **Issue: Collisions not working**
**Solution:**
1. Check if `DEBUG_SHOW_COLLISIONS = true` to see collision shapes
2. Verify collision data is saved (check localStorage or JSON file)
3. Ensure `loadCollisions()` is called in scene
4. Check console for collision loading messages

### **Issue: Player walks through some collisions**
**Solution:**
1. Collision shape might be too small
2. Redraw with larger area
3. For polygons, ensure enough points for accuracy

### **Issue: Collisions in wrong position**
**Solution:**
1. Background image might have changed size
2. Percentage coordinates are relative to background
3. Redraw collisions if background changed

### **Issue: Can't see collision shapes in editor**
**Solution:**
1. Ensure background image is loaded
2. Check browser console for errors
3. Try toggling "Show Grid" option

---

## 🎓 Best Practices

### **1. Use Appropriate Shapes**
- Simple buildings → Rectangles
- Complex structures → Polygons
- Round objects → Circles

### **2. Name Your Shapes**
- Use descriptive names: "Barangay Hall", "Market Wall"
- Makes debugging easier
- Helps team understand collision layout

### **3. Test Thoroughly**
- Walk around entire map
- Test all edges and corners
- Ensure no gaps where player can escape

### **4. Save Frequently**
- Save to browser while working
- Download JSON when done
- Keep backups of JSON files

### **5. Optimize Performance**
- Don't create too many small shapes
- Combine adjacent rectangles when possible
- Use polygons for complex shapes instead of many rectangles

---

## 📊 Performance Impact

### **Collision Detection Cost**
- **Rectangles**: Very fast ⚡
- **Circles**: Fast ⚡
- **Polygons**: Moderate (uses tile system) ⚡⚡

### **Recommended Limits**
- **Rectangles**: Up to 100 per map
- **Polygons**: Up to 20 per map (each becomes multiple tiles)
- **Circles**: Up to 50 per map

### **Current Usage**
- Check shape count in editor: "📋 Shapes (X)"
- Console shows: "Created X collision shapes"

---

## 🚀 Advanced Features

### **Grid System**
- 10% grid lines for precise alignment
- Toggle with "Show Grid" checkbox
- Helps align shapes to background features

### **Shape Selection**
- Click shapes in editor to select
- Selected shapes highlighted in yellow
- Can delete selected shapes

### **Shape List Panel**
- Shows all collision shapes
- Click to select shape
- Displays shape type and coordinates

---

## 📦 Integration with Game

### **Player Collision Setup**
```typescript
// In BarangayMap.ts create() method
this.loadCollisions();  // Load collision data

// Add collision between player and collision bodies
this.physics.add.collider(this.player, this.collisionBodies);
```

### **Collision Bodies**
- Stored in `this.collisionBodies` (StaticGroup)
- Static = don't move, don't have gravity
- Invisible in production (visible in debug mode)

---

## 🎯 Summary

**Collision Editor** → Draw shapes on background
**CollisionService** → Converts shapes to Phaser physics bodies  
**Game Scenes** → Load and apply collisions to player  
**Result** → Player can't walk through obstacles!

The system is **responsive**, **visual**, and **easy to use** - making it simple to create accurate collision boundaries for your game maps! 🎮
