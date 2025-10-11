# 🎨 COLLISION EDITOR DOCUMENTATION

## Overview

The **Collision Editor** is a powerful visual tool for creating collision boundaries on your game maps. Draw collision boxes, polygons, and circles directly on the background image, then save them as JSON with **background-relative percentage coordinates** for perfect consistency across all screen sizes!

---

## 🎯 Key Features

### ✅ Visual Editing

-   **WYSIWYG Editor**: See exactly where collisions are
-   **Background Overlay**: Draw directly on your map image
-   **Grid System**: 10% grid for precise placement
-   **Real-Time Preview**: See shapes as you draw

### ✅ Multiple Shape Types

-   **Rectangles** (⬜): Perfect for buildings, walls
-   **Polygons** (🔷): Free-form shapes for custom areas
-   **Circles** (⭕): Great for round obstacles

### ✅ Background-Relative Coordinates

-   **Percentage-Based**: All coordinates stored as % (0-100%)
-   **Screen-Independent**: Works on ANY screen size
-   **Automatic Conversion**: Converts to world coordinates in-game

### ✅ Save System

-   **JSON Export**: Download collision data as JSON file
-   **LocalStorage**: Save to browser for testing
-   **Load from File**: Import existing collision data
-   **Version Control**: Easy to track and share

---

## 🎮 How to Use

### 1. **Open Collision Editor**

**While in-game:**

```
Press ESC → Click [🎨 Collision Editor]
```

The editor opens showing:

-   **Left Panel**: Drawing tools and shape list
-   **Center**: Canvas with background image
-   **Right Panel**: List of created shapes

### 2. **Draw Collision Shapes**

#### Draw a Rectangle (Box)

1. Click **[⬜ Draw Box]** button
2. Click **first corner** on canvas
3. Click **opposite corner** on canvas
4. Rectangle created! ✅

#### Draw a Polygon (Free-Form)

1. Click **[🔷 Draw Polygon]** button
2. Click to add **first point**
3. Click to add **second point**
4. Click to add **third point** (minimum 3 points)
5. Add more points as needed
6. Click **[✅ Finish Polygon]** button
7. Polygon created! ✅

#### Draw a Circle

1. Click **[⭕ Draw Circle]** button
2. Click **center point** on canvas
3. Click **edge point** to set radius
4. Circle created! ✅

### 3. **Edit Shapes**

#### Select a Shape

1. Click **[↖️ Select]** button
2. Click any shape on canvas
3. Shape highlights in yellow

#### Delete a Shape

1. Select the shape
2. Click **[🗑️ Delete Selected]** button
3. Confirm deletion

#### Clear All Shapes

1. Click **[⚠️ Clear All]** button
2. Confirm to delete everything

### 4. **Save Your Work**

#### Save to Browser (Quick Testing)

```
Click [💿 Save to Browser]
→ Saved to localStorage
→ Will load automatically in-game
```

#### Download as JSON (Permanent)

```
Click [💾 Download JSON]
→ Downloads: barangaymap-collisions.json
→ Place in: public/ folder or assets/
→ Load in production builds
```

#### Load Existing File

```
Click [📂 Load from File]
→ Select .json file
→ Collision shapes loaded
```

---

## 📊 Collision Data Format

### JSON Structure

```json
{
    "mapName": "BarangayMap",
    "version": "1.0.0",
    "createdAt": "2025-10-10T12:00:00.000Z",
    "updatedAt": "2025-10-10T13:30:00.000Z",
    "shapes": [
        {
            "id": "box-1728567890123",
            "type": "rectangle",
            "name": "Collision Box 1",
            "percentX": 25.5,
            "percentY": 30.2,
            "percentWidth": 15.3,
            "percentHeight": 20.1,
            "color": "#FF0000"
        },
        {
            "id": "polygon-1728567895678",
            "type": "polygon",
            "name": "Collision Polygon 2",
            "points": [
                { "percentX": 50.0, "percentY": 40.0 },
                { "percentX": 60.0, "percentY": 45.0 },
                { "percentX": 55.0, "percentY": 55.0 },
                { "percentX": 45.0, "percentY": 50.0 }
            ],
            "color": "#0000FF"
        },
        {
            "id": "circle-1728567900234",
            "type": "circle",
            "name": "Collision Circle 3",
            "percentX": 75.0,
            "percentY": 60.0,
            "percentRadius": 8.5,
            "color": "#00FF00"
        }
    ]
}
```

### Shape Types

#### Rectangle (Box)

```typescript
{
  id: string;              // Unique ID
  type: "rectangle";
  name: string;            // Display name
  percentX: number;        // Top-left X (0-100%)
  percentY: number;        // Top-left Y (0-100%)
  percentWidth: number;    // Width (0-100%)
  percentHeight: number;   // Height (0-100%)
  color?: string;          // Hex color for editor
}
```

#### Polygon (Free-Form)

```typescript
{
  id: string;
  type: "polygon";
  name: string;
  points: [                // Array of points
    { percentX: number, percentY: number },
    { percentX: number, percentY: number },
    ... // Minimum 3 points
  ];
  color?: string;
}
```

#### Circle

```typescript
{
  id: string;
  type: "circle";
  name: string;
  percentX: number;        // Center X (0-100%)
  percentY: number;        // Center Y (0-100%)
  percentRadius: number;   // Radius (0-100%)
  color?: string;
}
```

---

## 🔧 Technical Implementation

### How It Works

1. **Editor Phase** (Design Time):

    ```
    User draws shapes on canvas
           ↓
    Click positions converted to %
           ↓
    Shapes stored with % coordinates
           ↓
    Saved to JSON file
    ```

2. **Runtime Phase** (In-Game):
    ```
    Load JSON collision data
           ↓
    Get background image dimensions
           ↓
    Convert % to world coordinates
           ↓
    Create Phaser physics bodies
           ↓
    Add collision with player
    ```

### Background-Relative Conversion

```typescript
// Editor → Percentage
const percentX = (clickX / canvasWidth) * 100;
const percentY = (clickY / canvasHeight) * 100;

// Percentage → World Coordinates
const worldX = bgLeft + (percentX / 100) * bgWidth;
const worldY = bgTop + (percentY / 100) * bgHeight;
```

### Why Percentage Coordinates?

✅ **Screen Independence**: Works on mobile, tablet, desktop  
✅ **Resolution Independence**: Same on 720p, 1080p, 4K  
✅ **Aspect Ratio Friendly**: Scales with background  
✅ **Easy to Edit**: Human-readable (50% = center)  
✅ **Future-Proof**: New devices work automatically

---

## 🎯 Use Cases

### Buildings & Structures

```
Use: Rectangle (⬜)
Example: Barangay Hall, Health Center
Why: Buildings are usually rectangular
```

### Trees & Natural Obstacles

```
Use: Circle (⭕) or Polygon (🔷)
Example: Trees, rocks, gardens
Why: Natural shapes are irregular
```

### Roads & Paths (Boundaries)

```
Use: Polygon (🔷)
Example: Building entrances, barriers
Why: Can follow exact outline
```

### Complex Structures

```
Use: Multiple Rectangles or Polygon
Example: L-shaped buildings, courtyards
Why: Combine simple shapes for complex areas
```

---

## 📋 Workflow Example

### Creating Barangay Hall Collision

**Step 1**: Open editor

```
ESC → [🎨 Collision Editor]
```

**Step 2**: Select tool

```
Click [⬜ Draw Box]
```

**Step 3**: Draw collision

```
Click top-left of Barangay Hall (around 28%, 20%)
Click bottom-right (around 32%, 24%)
→ Rectangle created!
```

**Step 4**: Verify

```
Shape appears in right panel:
"Collision Box 1"
(28.0%, 20.0%)
```

**Step 5**: Save

```
Click [💿 Save to Browser]
→ Saved!
```

**Step 6**: Test

```
Close editor → Walk towards Barangay Hall
→ Player stops at collision! ✅
```

---

## 🗺️ Recommended Collision Map

### Barangay Map Collisions

```
Recommended Shapes to Create:
1. Barangay Hall (Rectangle)
2. Health Center (Rectangle)
3. School (Rectangle)
4. Library (Rectangle)
5. Market (Rectangle)
6. Trees (Circles)
7. Residential Buildings (Rectangles)
8. Covered Court (Rectangle)
9. Mediation Kubo (Polygon - L-shaped)
10. Sari-Sari Store (Rectangle)
```

### Strategic Tips:

-   **Don't over-collide**: Leave paths for player
-   **Match visual**: Collision should match building sprite
-   **Slightly smaller**: Make collision ~90% of visual size
-   **Test as you go**: Save and test frequently
-   **Group similar**: Use same size for similar buildings

---

## 💡 Pro Tips

### Design Tips

1. **Use Grid**: Enable grid for aligned shapes
2. **Consistent Sizing**: Keep similar buildings same size
3. **Leave Gaps**: Ensure player can navigate between buildings
4. **Round Numbers**: Use clean percentages (25%, 50%, 75%)
5. **Test Early**: Save and test frequently

### Performance Tips

1. **Optimize Shapes**: Use rectangles when possible (faster)
2. **Limit Polygons**: Complex polygons are slower
3. **Combine Shapes**: Merge small shapes into larger ones
4. **Test Performance**: Monitor FPS with many collisions

### Workflow Tips

1. **Save Versions**: Save multiple JSON files (v1, v2, v3)
2. **Backup**: Keep copies of working collision data
3. **Document**: Name shapes descriptively
4. **Iterate**: Start simple, add complexity gradually

---

## 🔧 Integration Guide

### For BarangayMap

**File**: `src/game/scenes/BarangayMap.ts`

Already integrated! Just:

1. Draw collisions in editor
2. Save to browser
3. Reload game
4. Collisions work automatically!

### For CityMap

Add the same integration:

```typescript
// In CityMap.ts create() method:
this.loadCollisions();

// Add loadCollisions() method:
loadCollisions() {
    const collisionService = CollisionService.getInstance();
    const collisionData = collisionService.loadCollisionData("CityMap");

    if (collisionData && this.backgroundImage) {
        this.collisionBodies = collisionService.createCollisions(
            this,
            collisionData,
            this.backgroundImage
        );

        if (this.collisionBodies && this.player) {
            this.physics.add.collider(this.player, this.collisionBodies);
        }
    }
}
```

---

## 📁 File Management

### LocalStorage Keys

```
civika-collision-BarangayMap  → Barangay collision data
civika-collision-CityMap      → City collision data
```

### JSON Files (Recommended Structure)

```
public/
├── barangay-background.png
├── barangaymap-collisions.json  ← Collision data
├── city-background.png
└── citymap-collisions.json      ← Collision data
```

### Loading in Production

Update your scenes to load from public folder:

```typescript
async loadCollisions() {
    try {
        const response = await fetch('/barangaymap-collisions.json');
        const collisionData = await response.json();

        const collisionService = CollisionService.getInstance();
        this.collisionBodies = collisionService.createCollisions(
            this,
            collisionData,
            this.backgroundImage
        );

        this.physics.add.collider(this.player, this.collisionBodies);
    } catch (error) {
        console.warn("No collision data found, skipping");
    }
}
```

---

## 🎨 Editor UI Reference

### Left Panel - Tools

```
🛠️ Tools
├─ [↖️ Select] - Select and edit shapes
├─ [⬜ Draw Box] - Draw rectangles
├─ [🔷 Draw Polygon] - Draw free-form shapes
└─ [⭕ Draw Circle] - Draw circles

Actions:
├─ [🗑️ Delete Selected] - Remove selected shape
└─ [⚠️ Clear All] - Delete all shapes

View Options:
├─ [✓] Show Grid - Toggle 10% grid
└─ [✓] Show Shape List - Toggle right panel

Save/Load:
├─ [💾 Download JSON] - Export to file
├─ [💿 Save to Browser] - Save to localStorage
└─ [📂 Load from File] - Import JSON
```

### Center Panel - Canvas

```
┌──────────────────────────────────┐
│ Mode: draw-box                   │
│ Drawing... (2 points)            │
├──────────────────────────────────┤
│                                  │
│    [Background Image]            │
│    [Grid Lines]                  │
│    [Collision Shapes]            │
│    [Current Drawing]             │
│                                  │
└──────────────────────────────────┘
```

### Right Panel - Shape List

```
📋 Shapes (5)
┌────────────────────┐
│ ⬜ Collision Box 1 │
│ (28.0%, 20.0%)     │
├────────────────────┤
│ 🔷 Custom Polygon  │
│ 4 points           │
├────────────────────┤
│ ⭕ Tree Obstacle   │
│ r=5.0%             │
└────────────────────┘
```

---

## 🧪 Testing Workflow

### Create → Test → Refine Loop

1. **Open Editor**

    ```
    ESC → Collision Editor
    ```

2. **Draw Building Collision**

    ```
    Draw Box → Click corners → Shape created
    ```

3. **Save to Browser**

    ```
    💿 Save to Browser → Saved!
    ```

4. **Close & Test**

    ```
    Close editor → Walk towards building
    ```

5. **Verify Collision**

    ```
    Player stops at boundary? → ✅ Success!
    Player passes through? → ❌ Adjust collision
    ```

6. **Refine if Needed**

    ```
    ESC → Collision Editor again
    Select shape → Delete
    Draw new shape → Save → Test
    ```

7. **Final Export**
    ```
    💾 Download JSON
    → Place in public/ folder
    → Ship with game!
    ```

---

## 📐 Best Practices

### Shape Placement

#### Buildings (Use Rectangles)

```
✅ DO:
- Match building sprite boundaries
- Leave small gap (1-2% margin)
- Align to grid when possible

❌ DON'T:
- Make collision bigger than sprite
- Overlap with walkable paths
- Create overly complex shapes for simple buildings
```

#### Natural Obstacles (Use Circles/Polygons)

```
✅ DO:
- Use circles for trees (faster)
- Use polygons for irregular shapes
- Group multiple small obstacles

❌ DON'T:
- Create tiny individual collisions
- Over-detail natural shapes
- Forget to test walkability
```

#### Pathways (Negative Space)

```
✅ DO:
- Leave clear paths between buildings
- Ensure minimum 5% width for paths
- Test player can reach all NPCs

❌ DON'T:
- Block essential paths
- Trap player in corners
- Make navigation frustrating
```

---

## 🎯 Example Collision Layouts

### Barangay Hall (Simple Rectangle)

```
Coordinates:
- Top-Left: (28%, 20%)
- Bottom-Right: (32%, 24%)
- Size: 4% × 4%

JSON:
{
  "type": "rectangle",
  "percentX": 28,
  "percentY": 20,
  "percentWidth": 4,
  "percentHeight": 4
}
```

### L-Shaped Building (Polygon)

```
Points (clockwise):
1. (40%, 30%)  ← Top-left
2. (50%, 30%)  ← Top-right
3. (50%, 40%)  ← Inner corner
4. (45%, 40%)  ← Inner corner
5. (45%, 45%)  ← Bottom-right
6. (40%, 45%)  ← Bottom-left

JSON:
{
  "type": "polygon",
  "points": [
    {"percentX": 40, "percentY": 30},
    {"percentX": 50, "percentY": 30},
    {"percentX": 50, "percentY": 40},
    {"percentX": 45, "percentY": 40},
    {"percentX": 45, "percentY": 45},
    {"percentX": 40, "percentY": 45}
  ]
}
```

### Tree (Circle)

```
Coordinates:
- Center: (65%, 55%)
- Radius: 3%

JSON:
{
  "type": "circle",
  "percentX": 65,
  "percentY": 55,
  "percentRadius": 3
}
```

---

## 🚀 Advanced Features

### Keyboard Shortcuts (Future)

-   `Ctrl+Z`: Undo last shape
-   `Delete`: Delete selected shape
-   `Ctrl+S`: Quick save
-   `G`: Toggle grid
-   `Esc`: Cancel drawing

### Shape Properties (Future)

-   **Name Editing**: Rename shapes
-   **Color Picker**: Choose visualization color
-   **Transparency**: Adjust preview opacity
-   **Grouping**: Group related shapes

### Smart Tools (Future)

-   **Snap to Grid**: Auto-align to 5% or 10% grid
-   **Duplicate**: Copy existing shapes
-   **Mirror**: Flip shapes horizontally/vertically
-   **Templates**: Pre-made building shapes

---

## 📊 Performance Considerations

### Shape Limits

| Shape Type         | Recommended Max | Performance Impact |
| ------------------ | --------------- | ------------------ |
| Rectangles         | 50+             | ⭐ Low             |
| Circles            | 30+             | ⭐⭐ Medium        |
| Polygons (simple)  | 20+             | ⭐⭐ Medium        |
| Polygons (complex) | 10              | ⭐⭐⭐ High        |

### Optimization Tips

1. **Prefer Rectangles**: Fastest collision detection
2. **Simplify Polygons**: Fewer points = better performance
3. **Combine Shapes**: One large shape vs many small
4. **Test on Mobile**: Check FPS on target devices

---

## 🐛 Troubleshooting

### "Collision not working in-game"

**Problem**: Drew collision but player passes through  
**Solution**:

1. Check if collision saved: `localStorage` or JSON file
2. Verify `loadCollisions()` is called in scene's `create()`
3. Check collision is added AFTER player created
4. Confirm `this.physics.add.collider(player, collisions)` exists

### "Shapes don't appear in editor"

**Problem**: Canvas is blank  
**Solution**:

1. Check background image path is correct
2. Wait for image to load
3. Verify canvas size is set
4. Check browser console for errors

### "Downloaded JSON won't load"

**Problem**: Load from file doesn't work  
**Solution**:

1. Verify JSON format is valid
2. Check `mapName` matches ("BarangayMap" or "CityMap")
3. Ensure file is valid JSON (use JSONLint)

### "Player gets stuck"

**Problem**: Collision too aggressive  
**Solution**:

1. Make collisions slightly smaller than sprites
2. Add 1-2% margin around obstacles
3. Ensure paths are wide enough (5%+ minimum)
4. Test all map corners for escapes

---

## 📝 Checklist

### Before Saving:

-   [ ] All important buildings have collisions
-   [ ] NPCs are reachable
-   [ ] Paths are clear (5%+ width)
-   [ ] No player traps or dead ends
-   [ ] Tested all corners of map
-   [ ] Shapes named descriptively
-   [ ] Grid aligned when possible

### Before Publishing:

-   [ ] Exported JSON file
-   [ ] Placed in public/ or assets/
-   [ ] Tested on multiple screen sizes
-   [ ] Tested on mobile device
-   [ ] Verified performance (60 FPS)
-   [ ] Documented special collision areas
-   [ ] Backed up working version

---

## 🎉 Summary

The Collision Editor provides a **visual, intuitive way** to create collision boundaries for your maps:

✅ **Visual Drawing**: See exactly what you're creating  
✅ **Background-Relative**: Works on all screen sizes  
✅ **Multiple Shape Types**: Rectangles, polygons, circles  
✅ **Save/Load System**: Export JSON or save to browser  
✅ **Real-Time Testing**: Draw → Save → Test → Refine  
✅ **Professional Tool**: Game development quality

**No more guessing coordinates!** 🎯  
**No more hard-coded positions!** 🚫  
**Just draw and play!** 🎨✨

---

**Last Updated**: October 10, 2025  
**Version**: 1.0.0  
**Status**: ✅ Complete and Ready to Use

**🎨 Happy Collision Editing! 🎮**
