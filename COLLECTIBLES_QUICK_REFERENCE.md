# 🎯 Collectibles System - Quick Reference Guide

## 🚀 Quick Start

### Adding a New Collectible (3 Steps)

**Step 1**: Add to `collectibleItemsData` array

```typescript
// In BarangayMap.ts or CityMap.ts
{
    id: "unique-id-here",        // Must be unique!
    type: "coin",                // coin | badge | powerup | treasure
    name: "Display Name",
    description: "Item description",
    value: 10,                   // Coins awarded
    points: 20,                  // Score points
    rarity: "uncommon",          // common | uncommon | rare | legendary
    percentX: 50,                // 0-100% horizontal
    percentY: 50,                // 0-100% vertical
    icon: "💰",                  // Any emoji
}
```

**Step 2**: Save the file - that's it! 🎉

**Step 3**: Test by walking to the position

---

## 📍 Position Reference

### Percentage Grid

```
     0%        25%       50%       75%       100%
  0% ┌─────────┬─────────┬─────────┬─────────┐
     │    NW   │  North  │         │   NE    │
 25% ├─────────┼─────────┼─────────┼─────────┤
     │  West   │         │ CENTER  │  East   │
 50% │         │         │  50,50  │         │
     ├─────────┼─────────┼─────────┼─────────┤
 75% │    SW   │  South  │         │   SE    │
100% └─────────┴─────────┴─────────┴─────────┘
```

### Example Positions

-   **Center**: (50%, 50%)
-   **Top-Left**: (10%, 10%)
-   **Top-Right**: (90%, 10%)
-   **Bottom-Left**: (10%, 90%)
-   **Bottom-Right**: (90%, 90%)

---

## 🎨 Icon Reference

### Available Emojis

```typescript
// Currency
💰 - Coin
💵 - Money
💎 - Diamond/Gem
💠 - Gem Stone
🪙 - Gold Coin

// Medals & Badges
🏅 - Medal
🎖️ - Military Medal
🏆 - Trophy
👑 - Crown
⭐ - Star

// Powerups
⚡ - Lightning
🔥 - Fire
✨ - Sparkles
💫 - Dizzy
🌟 - Glowing Star

// Special
🎁 - Gift
📦 - Package
🗝️ - Key
🧭 - Compass
```

---

## 🎯 Rarity Guidelines

| Rarity    | Use For        | Value Range | Points Range |
| --------- | -------------- | ----------- | ------------ |
| Common    | Basic rewards  | 5-10        | 10-20        |
| Uncommon  | Good finds     | 10-25       | 25-50        |
| Rare      | Special items  | 25-50       | 50-100       |
| Legendary | Epic treasures | 50+         | 100+         |

---

## 🔊 Sound Reference

### Musical Notes (Hz)

```typescript
Common: [330, 392, 440]; // F, G, A
Uncommon: [349, 440, 523]; // F#, A, C
Rare: [392, 494, 587]; // G, B, D
Legendary: [440, 554, 659, 880]; // A, C#, E, A (octave)
```

---

## 🗺️ Current Collectibles Map

### Barangay (Level 1)

```
💰(25,35)              💰(45,80)         🏅(85,35)
                                         ⚡(70,30)

🏅(15,50)              💎(50,50)         💰(75,65)

⚡(30,70)
```

### City (Level 2)

```
💰(20,40)              💠(60,20)         🏅(90,30)
                                         ⚡(75,25)

🏅(10,55)              💎(50,50)         💰(80,60)

⚡(25,75)  🎖️(35,65)  💰(40,85)
```

---

## 🔧 Common Tasks

### Check Collection Status

```typescript
const gsm = GameStateManager.getInstance();
console.log("Total collected:", gsm.getTotalCollectedItems());
console.log("Items:", gsm.getCollectedItems());
```

### Reset Collections (Testing)

```typescript
// Clear all game progress
GameStateManager.getInstance().resetProgress();

// Or in browser console:
localStorage.removeItem("civika-game-progress");
location.reload();
```

### Test Specific Item

```typescript
// Manually collect (for testing)
GameStateManager.getInstance().collectItem("barangay-coin-1", 5, 10);
```

### Add Bonus Item

```typescript
// Create special event item
{
    id: "special-event-2025",
    type: "treasure",
    name: "Anniversary Gift",
    value: 100,
    points: 200,
    rarity: "legendary",
    percentX: 50,
    percentY: 50,
    icon: "🎁",
}
```

---

## ⚡ Performance Tips

### Optimization

```typescript
// Good: Create collectibles after background loads
time.delayedCall(300, () => createCollectibles());

// Bad: Create immediately in create()
createCollectibles(); // Background might not be ready
```

### Memory Management

```typescript
// Particles auto-destroy after animation
onComplete: () => particle.destroy();

// Remove collected items from memory
collectibleItems.delete(itemId);
```

---

## 🐛 Debugging

### Console Commands

```javascript
// Check collectibles status
const scene = game.scene.getScene("BarangayMap");
console.log("Collectibles:", scene.collectibleItems.size);
console.log("Group:", scene.collectibles?.children?.size);

// List all items
scene.collectibleItemsData.forEach((item) => {
    console.log(item.id, item.percentX, item.percentY);
});
```

### Common Issues

| Issue              | Cause                     | Solution         |
| ------------------ | ------------------------- | ---------------- |
| Items not visible  | Created before background | Add delay        |
| Wrong position     | Background not ready      | Check logs       |
| No sound           | No user interaction       | Click page first |
| Minimap off-screen | Screen too small          | Adjust position  |

---

## 📊 Analytics Tracking

### Collectible Events to Track

```typescript
// Item collected
EventBus.emit("collectible-collected", {
    itemId: string,
    type: string,
    rarity: string,
    value: number,
    points: number,
    playerLevel: number,
    timestamp: Date,
});

// Achievement unlocked
EventBus.emit("achievement-unlocked", {
    achievement: "Master Collector",
    level: number,
    timestamp: Date,
});
```

---

## 🎮 Player Tips (For Game Guide)

### How to Collect Items

1. **Look for glowing items** with floating emojis
2. **Check minimap** for yellow/colored dots
3. **Walk into items** to collect automatically
4. **Watch for effects** - sparkles mean success!
5. **Check notifications** for rewards

### Maximizing Rewards

-   **Explore thoroughly** - items are hidden everywhere
-   **Use minimap** to track uncollected items
-   **Collect all items** for achievement bonus
-   **Check corners** - rare items often hidden there
-   **Visit center** - treasure always at (50%, 50%)

### Achievement Strategy

-   **Level 1**: Collect all 8 items = +50 coins, +100 pts
-   **Level 2**: Collect all 10 items = +100 coins, +200 pts
-   **Both Levels**: 485 total coins + 980 points available!

---

## 🔢 Quick Stats

| Metric            | Barangay    | City        | Total       |
| ----------------- | ----------- | ----------- | ----------- |
| Total Items       | 8           | 10          | 18          |
| Common            | 3           | 3           | 6           |
| Uncommon          | 4           | 4           | 8           |
| Rare              | 1           | 3           | 4           |
| Base Coins        | 90          | 245         | 335         |
| Base Points       | 190         | 490         | 680         |
| Achievement Bonus | +50         | +100        | +150        |
| **Total Rewards** | **140+290** | **345+690** | **485+980** |

---

## 🎨 Customization Guide

### Change Glow Colors

```typescript
// In createCollectibles()
const glowColor = 0xff0000; // Red
const glowColor = 0x00ff00; // Green
const glowColor = 0x0000ff; // Blue
const glowColor = 0xffd700; // Gold
```

### Adjust Animation Speed

```typescript
// Floating motion
duration: 1200,  // 1.2 seconds (slower)
duration: 600,   // 0.6 seconds (faster)

// Collection animation
duration: 600,   // Default
duration: 300,   // Quick collect
duration: 1000,  // Dramatic collect
```

### Change Item Size

```typescript
fontSize: "48px",  // Current (visible)
fontSize: "64px",  // Larger
fontSize: "32px",  // Smaller
```

### Modify Rewards

```typescript
// Double all rewards
value: item.value * 2,
points: item.points * 2,

// Weekend bonus
value: isWeekend ? item.value * 1.5 : item.value,
```

---

## 📝 Checklist for New Level

When adding a new level (Level 3, etc.):

-   [ ] Create `collectibleItemsData` array (10+ items)
-   [ ] Add `collectibles` and `collectibleItems` properties
-   [ ] Add `minimap` properties (container, dots, etc.)
-   [ ] Implement `createCollectibles()` method
-   [ ] Implement `collectItem()` method
-   [ ] Implement `createCollectionParticles()` method
-   [ ] Implement `playCollectionSound()` method
-   [ ] Implement `showFloatingText()` method
-   [ ] Implement `checkCollectionAchievement()` method
-   [ ] Implement `createMinimap()` method
-   [ ] Implement `updateMinimap()` method
-   [ ] Call `createCollectibles()` after background loads
-   [ ] Call `createMinimap()` in create method
-   [ ] Call `updateMinimap()` in update method
-   [ ] Test on desktop and mobile
-   [ ] Update this documentation!

---

## 🎓 Learning Resources

### Phaser 3 APIs Used

-   `this.add.text()` - Text game objects
-   `this.add.circle()` - Circle shapes
-   `this.add.graphics()` - Drawing shapes
-   `this.add.container()` - Grouping elements
-   `this.physics.add.overlap()` - Collision detection
-   `this.tweens.add()` - Animations
-   `this.time.delayedCall()` - Delayed execution

### External APIs Used

-   **Web Audio API**: Sound generation
-   **localStorage API**: Persistent storage
-   **EventBus**: React-Phaser communication

---

**Happy Collecting! 🎉**
