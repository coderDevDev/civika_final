# Collision System Flow Diagram

## 📊 Complete Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    COLLISION EDITOR                          │
│  (CollisionEditor.tsx)                                       │
│                                                              │
│  1. Load background image                                    │
│  2. Draw collision shapes:                                   │
│     • Rectangles (⬜)                                        │
│     • Polygons (🔷)                                         │
│     • Circles (⭕)                                           │
│  3. Save as percentage coordinates                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │   SAVE OPTIONS      │
        └─────────┬───────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌──────────────────┐
│ localStorage  │   │   JSON File      │
│ (Testing)     │   │ (Production)     │
└───────┬───────┘   └────────┬─────────┘
        │                    │
        │                    │ Place in public/
        │                    │ folder
        │                    │
        └────────┬───────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              COLLISION SERVICE                               │
│  (CollisionService.ts)                                       │
│                                                              │
│  1. Load collision data:                                     │
│     • Try localStorage first                                 │
│     • Fallback to JSON file                                  │
│  2. Convert percentage → world coordinates                   │
│  3. Create Phaser physics bodies                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 GAME SCENE                                   │
│  (BarangayMap.ts / CityMap.ts)                              │
│                                                              │
│  1. Background image loads                                   │
│  2. Call loadCollisions()                                    │
│  3. CollisionService creates bodies                          │
│  4. Add collider: player ↔ collision bodies                 │
│  5. Player can't walk through obstacles! ✅                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Transformation Flow

```
EDITOR CANVAS CLICK
    ↓
Pixel Coordinates (x, y)
    ↓
Convert to Percentage
percentX = (x / canvasWidth) * 100
percentY = (y / canvasHeight) * 100
    ↓
Save to JSON
{
  "percentX": 50,
  "percentY": 30,
  "percentWidth": 10,
  "percentHeight": 15
}
    ↓
GAME LOADS DATA
    ↓
Convert back to World Coordinates
worldX = bgLeft + (percentX / 100) * bgWidth
worldY = bgTop + (percentY / 100) * bgHeight
    ↓
Create Phaser Physics Body
scene.add.rectangle(worldX, worldY, width, height)
scene.physics.add.existing(collision, true)
    ↓
Add to Collision Group
collisionGroup.add(collision)
    ↓
COLLISION ACTIVE IN GAME ✅
```

---

## 🎯 Shape Type Processing

### Rectangle
```
Editor: Click 2 points
    ↓
Calculate: width, height, topLeft
    ↓
Save: percentX, percentY, percentWidth, percentHeight
    ↓
Game: Create single rectangle physics body
    ↓
Result: Fast, simple collision
```

### Polygon
```
Editor: Click N points (N ≥ 3)
    ↓
Save: Array of percentage points
    ↓
Game: Calculate bounding box
    ↓
Create grid of 20x20 tiles
    ↓
Check each tile: Is center inside polygon?
    ↓
If YES: Create collision tile
    ↓
Result: Accurate shape-following collision
```

### Circle
```
Editor: Click center, then radius point
    ↓
Calculate: distance = radius
    ↓
Save: percentX, percentY, percentRadius
    ↓
Game: Create circle physics body
    ↓
Result: Smooth circular collision
```

---

## 🔍 Collision Detection Flow

```
PLAYER MOVES
    ↓
Phaser Physics Update
    ↓
Check: player.body overlaps collision.body?
    ↓
    ├─ YES → Block movement, push player back
    │         Player stops at collision boundary
    │
    └─ NO  → Allow movement
              Player continues walking
```

---

## 💾 Save/Load Priority

```
GAME STARTS
    ↓
CollisionService.loadCollisionData()
    ↓
    ├─ Check localStorage
    │  └─ Found? → Use it (for testing)
    │
    └─ Not found?
       └─ Check public/mapname-collisions.json
          └─ Found? → Use it (production)
          └─ Not found? → No collisions loaded
```

---

## 🎨 Debug Visualization

```
DEBUG_SHOW_COLLISIONS = true
    ↓
For each collision shape:
    ↓
    ├─ Rectangle → Draw red outline
    ├─ Polygon  → Draw blue outline
    └─ Circle   → Draw green outline
    ↓
Visible in game at depth 1000 (above everything)
    ↓
Developer can see exact collision boundaries
```

---

## 🔧 Editor Tools Flow

```
USER CLICKS TOOL BUTTON
    ↓
    ├─ Select (↖️)
    │  └─ Click shape → Select it
    │     └─ Can delete selected shape
    │
    ├─ Draw Box (⬜)
    │  └─ Click 1: Start point
    │     └─ Click 2: End point → Create box
    │
    ├─ Draw Polygon (🔷)
    │  └─ Click N times: Add points
    │     └─ Click "Finish" → Create polygon
    │
    └─ Draw Circle (⭕)
       └─ Click 1: Center
          └─ Click 2: Radius → Create circle
```

---

## 📊 Performance Optimization

```
COLLISION SHAPES
    ↓
    ├─ Rectangles (Fast ⚡)
    │  └─ Single physics body per shape
    │     └─ O(1) collision check
    │
    ├─ Circles (Fast ⚡)
    │  └─ Single physics body per shape
    │     └─ O(1) collision check
    │
    └─ Polygons (Moderate ⚡⚡)
       └─ Multiple tile bodies per shape
          └─ O(N) where N = number of tiles
          └─ But: More accurate collision!
```

---

## 🎯 Real-World Example

### Barangay Hall Building

```
1. EDITOR
   ┌─────────────────┐
   │                 │  ← Draw rectangle
   │  Barangay Hall  │     around building
   │                 │
   └─────────────────┘
   
   Saved as:
   {
     "percentX": 40,
     "percentY": 20,
     "percentWidth": 20,
     "percentHeight": 15
   }

2. GAME LOADS
   Background: 1920x1080 pixels
   
   Calculate:
   worldX = 0 + (40/100) * 1920 = 768px
   worldY = 0 + (20/100) * 1080 = 216px
   width = (20/100) * 1920 = 384px
   height = (15/100) * 1080 = 162px

3. PHYSICS BODY CREATED
   Rectangle at (768, 216) with size 384x162
   
4. PLAYER COLLISION
   Player walks toward building
   → Hits collision boundary
   → Stops moving
   → Can't enter building ✅
```

---

## 🚀 Quick Reference

| Action | Tool | Result |
|--------|------|--------|
| Draw simple obstacle | Rectangle | Fast collision |
| Draw angled wall | Polygon | Accurate collision |
| Draw round pillar | Circle | Smooth collision |
| Test changes | Save to Browser | Immediate testing |
| Deploy to production | Download JSON | Permanent storage |
| See collisions | Debug Mode ON | Visual boundaries |
| Edit existing | Select tool | Modify/delete shapes |

---

## 💡 Key Concepts

1. **Percentage Coordinates** = Responsive across all devices
2. **Static Bodies** = Collisions don't move or fall
3. **Collision Groups** = Organized physics management
4. **Tile-based Polygons** = Accurate complex shapes
5. **localStorage Priority** = Easy testing workflow
6. **JSON Production** = Reliable deployment

---

This system makes collision editing **visual**, **intuitive**, and **production-ready**! 🎮
