# 🎨 COLLISION EDITOR - QUICK START GUIDE

## 🚀 Get Started in 2 Minutes!

### Step 1: Open the Editor
```
1. Start your game
2. Press ESC
3. Click [🎨 Collision Editor]
```

### Step 2: Draw Your First Collision
```
1. Click [⬜ Draw Box]
2. Click on canvas (top-left corner of a building)
3. Click again (bottom-right corner)
4. ✅ Rectangle created!
```

### Step 3: Save It
```
Click [💿 Save to Browser]
→ "Collision data saved to browser storage!"
```

### Step 4: Test It
```
1. Close editor (click ✕)
2. Walk your player towards the building
3. Player stops at the collision! 🎉
```

---

## 🎯 Drawing Tools

### ⬜ Rectangle (Easiest!)
**Best for**: Buildings, walls, simple obstacles

**How to use**:
1. Click [⬜ Draw Box]
2. Click first corner
3. Click opposite corner
4. Done! ✅

**Example**: Barangay Hall, Health Center

---

### 🔷 Polygon (Advanced)
**Best for**: L-shaped buildings, custom shapes, irregular obstacles

**How to use**:
1. Click [🔷 Draw Polygon]
2. Click to add point 1
3. Click to add point 2
4. Click to add point 3 (minimum)
5. Add more points as needed
6. Click [✅ Finish Polygon]
7. Done! ✅

**Example**: L-shaped mediation kubo, park boundaries

---

### ⭕ Circle (For Round Things)
**Best for**: Trees, round gardens, circular structures

**How to use**:
1. Click [⭕ Draw Circle]
2. Click center point
3. Click edge to set radius
4. Done! ✅

**Example**: Trees, round planters

---

## 💾 Save Options

### Option 1: Save to Browser (Quick Testing)
```
[💿 Save to Browser]
→ Saves to localStorage
→ Loads automatically when you play
→ Great for development/testing
```

### Option 2: Download JSON (Production)
```
[💾 Download JSON]
→ Downloads: barangaymap-collisions.json
→ Place in your public/ folder
→ Load in production build
```

### Option 3: Load from File
```
[📂 Load from File]
→ Select your .json file
→ Shapes load into editor
→ Continue editing!
```

---

## 🎯 Quick Reference

### Editor Controls

| Button | Action |
|--------|--------|
| ↖️ Select | Click shapes to select them |
| ⬜ Draw Box | Click 2 corners to create rectangle |
| 🔷 Draw Polygon | Click points, then finish |
| ⭕ Draw Circle | Click center, then radius |
| 🗑️ Delete Selected | Remove selected shape |
| ⚠️ Clear All | Delete ALL shapes |

### View Options

| Option | Effect |
|--------|--------|
| Show Grid | Toggle 10% grid overlay |
| Show Shape List | Toggle right panel |

---

## 🏗️ Example: Create Barangay Hall Collision

**Goal**: Make Barangay Hall (center building) solid

**Steps**:
1. **Open editor**: ESC → Collision Editor
2. **Select tool**: Click [⬜ Draw Box]
3. **Find building**: Look at center of map (around 28%, 20%)
4. **Click top-left** of building sprite
5. **Click bottom-right** of building sprite
6. **Verify**: Red rectangle appears over building
7. **Check list**: "Collision Box 1" appears in right panel
8. **Save**: Click [💿 Save to Browser]
9. **Test**: Close editor, walk to building
10. **Result**: Player stops! ✅

**Time**: ~30 seconds!

---

## 🗺️ Recommended First Collisions

### For Barangay Map:

Create these in order (easiest to hardest):

1. **Barangay Hall** (Center)
   - Type: Rectangle
   - Location: ~(28%, 20%) to (32%, 24%)
   - Reason: Main building, easy rectangle

2. **Health Center** (Top area)
   - Type: Rectangle
   - Location: Find pink building on map
   - Reason: Another simple rectangle

3. **School** (Right side)
   - Type: Rectangle
   - Location: Find school building
   - Reason: Practice placement

4. **Trees** (Scattered)
   - Type: Circle
   - Location: Wherever you see trees
   - Reason: Learn circle tool

5. **Market** (Complex shape)
   - Type: Polygon
   - Location: Market area
   - Reason: Practice advanced tool

---

## ⚡ Pro Tips

### Drawing Tips
1. **Zoom In**: Use browser zoom (Ctrl+Scroll) for precision
2. **Use Grid**: Enable grid for aligned shapes
3. **Start Simple**: Begin with rectangles
4. **Name Shapes**: Click shape in list to select, then rename (future feature)

### Testing Tips
1. **Save Often**: Browser storage is instant
2. **Test Immediately**: Close editor after each shape
3. **Walk Around**: Test from all angles
4. **Refine**: Delete and redraw if needed

### Performance Tips
1. **Prefer Rectangles**: Fastest collision detection
2. **Limit Polygons**: <10 complex shapes per map
3. **Combine**: One large shape > many small shapes
4. **Test FPS**: Check performance on mobile

---

## 🎮 Common Scenarios

### Scenario 1: "I want buildings to be solid"
```
Solution:
1. Draw rectangle for each building
2. Make collision 90-95% of building size
3. Leave small margin for visual clarity
```

### Scenario 2: "I want trees to be obstacles"
```
Solution:
1. Use circles for trees (faster)
2. Set radius to ~3-5%
3. Place at tree sprite positions
```

### Scenario 3: "I have an L-shaped building"
```
Solution:
Option A: Draw 2 rectangles (easier)
Option B: Draw 1 polygon with 6 points (precise)
```

### Scenario 4: "Player should stay on paths"
```
Solution:
1. Draw collision boxes for grass/non-path areas
2. OR draw polygon boundaries around entire walkable area
3. Test thoroughly!
```

---

## 📋 Checklist

### First Time Setup:
- [ ] Open Collision Editor (ESC → Collision Editor)
- [ ] Familiarize with interface
- [ ] Draw a test rectangle
- [ ] Save to browser
- [ ] Close and test
- [ ] Verify collision works

### Creating Barangay Map Collisions:
- [ ] Barangay Hall (center building)
- [ ] Health Center
- [ ] School
- [ ] Library
- [ ] Market
- [ ] Mediation Kubo
- [ ] Residential buildings
- [ ] Trees (if desired)
- [ ] Save to browser
- [ ] Test walkability
- [ ] Export JSON

### Final Steps:
- [ ] Download JSON file
- [ ] Name file: `barangaymap-collisions.json`
- [ ] Place in public/ folder (for production)
- [ ] Test on different screen sizes
- [ ] Test on mobile
- [ ] Backup JSON file

---

## ❓ FAQ

**Q: Do I need to create collisions?**
A: Optional! Your game works without them, but collisions make it more realistic.

**Q: Can I edit collisions later?**
A: Yes! Load from file or browser storage, edit, and save again.

**Q: What if I make a mistake?**
A: Select the shape and click [🗑️ Delete Selected], or [⚠️ Clear All] to start over.

**Q: How many collisions should I create?**
A: Start with 5-10 main buildings, then add more as needed.

**Q: Will this slow down my game?**
A: No! Rectangles are very fast. Keep complex polygons under 10 per map.

**Q: Can I see collisions in-game?**
A: Not by default, but you could add a debug mode to visualize them.

---

## 🎉 You're Ready!

**In just 2 minutes, you can:**
1. Open the Collision Editor
2. Draw collision boxes on your map
3. Save to browser
4. Test in-game
5. Have working, screen-independent collisions!

**No coding required!** 🎨  
**Visual and intuitive!** 👀  
**Production-ready!** ✅

---

**Need more help?** Check: `COLLISION_EDITOR_DOCUMENTATION.md`

**Last Updated**: October 10, 2025  
**Version**: 1.0.0

**🎨 Happy Editing! 🎮**


