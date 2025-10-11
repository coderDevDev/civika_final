# 🗺️ Multi-Map Collision System

## ✅ YES! The collision system works for BOTH maps!

The collision system is **designed from the ground up** to support multiple maps. Each map has its own collision file and the system automatically knows which one to load.

---

## 📁 File Structure

```
public/
├── barangaymap-collisions.json    ← Collision data for BarangayMap
└── citymap-collisions.json        ← Collision data for CityMap
```

**File naming pattern**: `{mapname}-collisions.json` (all lowercase)

---

## 🔧 How It Works

### 1. **Map Name Detection** 🎯

Each scene has a unique name that the collision system uses:

-   `BarangayMap` scene → loads `barangaymap-collisions.json`
-   `CityMap` scene → loads `citymap-collisions.json`

### 2. **Automatic File Loading** 📥

```typescript
// In BarangayMap.ts
async loadCollisions() {
    const collisionService = CollisionService.getInstance();
    let collisionData = collisionService.loadCollisionData("BarangayMap"); // localStorage

    if (!collisionData) {
        collisionData = await collisionService.loadCollisionDataFromFile("BarangayMap");
        // Loads: /barangaymap-collisions.json
    }
    // ... create collisions
}

// In CityMap.ts
async loadCollisions() {
    const collisionService = CollisionService.getInstance();
    let collisionData = collisionService.loadCollisionData("CityMap"); // localStorage

    if (!collisionData) {
        collisionData = await collisionService.loadCollisionDataFromFile("CityMap");
        // Loads: /citymap-collisions.json
    }
    // ... create collisions
}
```

### 3. **Collision Editor** 🎨

When you open the Collision Editor:

-   Select map: **BarangayMap** or **CityMap**
-   Draw collision shapes
-   Click "Save to File" → Creates the correct JSON file in public folder

---

## 🎮 Usage Guide

### For BarangayMap (Level 1)

1. **Open Collision Editor**

    - In game menu → Click "Collision Editor"
    - Map dropdown → Select **"BarangayMap"**

2. **Draw Collisions**

    - Click "Rectangle" / "Polygon" / "Circle"
    - Draw on the background image
    - Name your collision shape

3. **Save**

    - Click "Save to File"
    - Browser downloads: `barangaymap-collisions.json`
    - Place in: `public/barangaymap-collisions.json`

4. **Test**
    - Reload game
    - Enter BarangayMap
    - Console shows: `✅ Loading collision data for BarangayMap...`
    - See BLUE/RED/GREEN outlines
    - Player CANNOT pass through! ✅

---

### For CityMap (Level 2)

1. **Open Collision Editor**

    - In game menu → Click "Collision Editor"
    - Map dropdown → Select **"CityMap"**

2. **Draw Collisions**

    - Click "Rectangle" / "Polygon" / "Circle"
    - Draw on the city background image
    - Name your collision shape

3. **Save**

    - Click "Save to File"
    - Browser downloads: `citymap-collisions.json`
    - Place in: `public/citymap-collisions.json`

4. **Test**
    - Reload game
    - Enter CityMap
    - Console shows: `✅ Loading collision data for CityMap...`
    - See BLUE/RED/GREEN outlines
    - Player CANNOT pass through! ✅

---

## 🎨 Visual Debug Colors

Each collision type has a unique color for easy identification:

-   🔴 **RED** = Rectangle collision
-   🔵 **BLUE** = Polygon collision
-   🟢 **GREEN** = Circle collision

---

## 📝 JSON File Format

Each map's collision file looks like this:

```json
{
  "mapName": "BarangayMap",  ← Map identifier
  "version": "1.0.0",
  "createdAt": "2025-10-11T02:58:35.657Z",
  "updatedAt": "2025-10-11T09:59:28.507Z",
  "shapes": [
    {
      "id": "polygon-1760151573485",
      "type": "polygon",
      "name": "Building 1",
      "points": [
        { "percentX": 42.5, "percentY": 9.0 },
        { "percentX": 42.2, "percentY": 21.5 },
        ...
      ],
      "color": "#0000FF"
    }
  ]
}
```

---

## 🔄 Loading Priority

The system tries to load collision data in this order:

1. **localStorage** (for editor testing)
    - Key: `civika-collision-BarangayMap` or `civika-collision-CityMap`
2. **JSON file** (for production)
    - Path: `/barangaymap-collisions.json` or `/citymap-collisions.json`

This allows you to:

-   ✅ Test collision in editor without saving file
-   ✅ Save file for production use
-   ✅ Override production collision with localStorage for testing

---

## 🚀 Adding More Maps

To add collision support to a new map:

### 1. Import CollisionService

```typescript
import CollisionService from "../../services/CollisionService";
```

### 2. Add Property

```typescript
export class YourNewMap extends Scene {
    collisionBodies: Phaser.Physics.Arcade.StaticGroup | null = null;
    backgroundImage: any = null;
}
```

### 3. Add loadCollisions Method

```typescript
async loadCollisions() {
    const collisionService = CollisionService.getInstance();
    let collisionData = collisionService.loadCollisionData("YourNewMap");

    if (!collisionData) {
        collisionData = await collisionService.loadCollisionDataFromFile("YourNewMap");
    }

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

### 4. Call After Background Ready

```typescript
createBackgroundImage() {
    // ... create background
    this.backgroundImage = bgImage;

    // Load collisions after background is ready
    this.time.delayedCall(200, () => {
        this.loadCollisions();
    });
}
```

### 5. Create Collision File

-   Use Collision Editor with map name "YourNewMap"
-   Save as `yournewmap-collisions.json` (lowercase!)
-   Place in `public/` folder

Done! ✅

---

## 🎯 Key Features

✅ **Multiple Maps** - Each map has its own collision file  
✅ **Auto Loading** - System knows which file to load based on map name  
✅ **Visual Debug** - See collision boundaries in colored outlines  
✅ **Editor Support** - Draw collisions visually per map  
✅ **Percentage Coordinates** - Collisions scale with background image  
✅ **Physics Collision** - Player physically blocked from passing through  
✅ **LocalStorage Testing** - Test without saving files  
✅ **Production Ready** - JSON files loaded from public folder

---

## 🐛 Troubleshooting

### Player Can Pass Through Collision?

1. Check console for: `✅ Player collision enabled with X collision shapes`
2. Verify file exists: `public/barangaymap-collisions.json`
3. Check file name is **lowercase**
4. Verify player and collisionBodies both exist
5. Look for colored outlines in game (visual debug)

### Can't See Collision Outlines?

1. Check console for: `🎨 Visualized collision...`
2. Collision depth is 1000 (should be above background)
3. Verify shapes array is not empty in JSON

### Wrong Map Loading?

1. Verify map name matches scene name exactly
2. Check `mapName` field in JSON file
3. Console shows which map is being loaded

---

## 📊 Current Status

### ✅ Implemented

-   [x] BarangayMap collision support
-   [x] CityMap collision support
-   [x] CollisionService with multi-map support
-   [x] Visual debug (colored outlines)
-   [x] Collision Editor with map selection
-   [x] JSON save/load per map
-   [x] Physics collision (player blocked)
-   [x] localStorage testing mode

### 🎯 Ready to Use

Both maps are **fully functional** with collision support!

---

## 💡 Tips

1. **Name Your Collisions** - Give each collision a descriptive name like "Building 1", "Tree 2"
2. **Use Right Tool** - Rectangles for buildings, polygons for irregular shapes, circles for trees
3. **Test Immediately** - Use localStorage to test before saving JSON
4. **Visual Feedback** - Colored outlines help you see exactly where collisions are
5. **Console Logs** - Check console for detailed loading information

---

**The system is ready! You can now create collision boundaries for both BarangayMap and CityMap!** 🎉

