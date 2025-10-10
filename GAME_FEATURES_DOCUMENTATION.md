# 🎮 CIVIKA Game Features Documentation

## Table of Contents
1. [Overview](#overview)
2. [Background-Relative Positioning System](#background-relative-positioning-system)
3. [Location Display System](#location-display-system)
4. [Collectibles System](#collectibles-system)
5. [Minimap/Radar System](#minimapradar-system)
6. [Sound and Visual Effects](#sound-and-visual-effects)
7. [Achievement System](#achievement-system)
8. [Technical Implementation](#technical-implementation)

---

## Overview

CIVIKA is a civic engagement educational game featuring two main levels:
- **Level 1**: Barangay Government (10 missions, 8 collectibles)
- **Level 2**: City/Municipal Government (10 missions, 10 collectibles)

This documentation covers the core gameplay systems and features implemented to enhance player experience and ensure consistency across all devices.

---

## Background-Relative Positioning System

### Purpose
Ensures consistent positioning of players, NPCs, and collectibles across all screen sizes (desktop, tablet, mobile) by using percentage-based coordinates relative to the background image.

### How It Works

#### Coordinate System
```typescript
// Instead of absolute pixel coordinates:
x: 512, y: 384  // ❌ Different on every screen size

// We use percentage coordinates:
percentX: 50, percentY: 50  // ✅ Always center, any screen size
```

#### Conversion Formula
```typescript
percentageToWorldCoordinates(percentX: number, percentY: number) {
    const bgWidth = this.backgroundImage.displayWidth;
    const bgHeight = this.backgroundImage.displayHeight;
    const bgX = this.backgroundImage.x;
    const bgY = this.backgroundImage.y;

    // Convert percentage to world coordinates
    const worldX = bgX + (percentX - 50) * (bgWidth / 100);
    const worldY = bgY + (percentY - 50) * (bgHeight / 100);

    return { x: worldX, y: worldY };
}
```

### Benefits
- ✅ **Consistent**: Same position on desktop, tablet, mobile
- ✅ **Scalable**: Works with any background image size
- ✅ **Precise**: Exact positioning relative to background elements
- ✅ **Future-Proof**: Easy to add new entities at specific locations

### Implementation

#### Player Positioning
```typescript
// Player always spawns at background center
playerX = backgroundImage.x;  // 50%
playerY = backgroundImage.y;  // 50%
```

#### NPC Positioning
```typescript
missionLocations = [
    {
        name: "Basura Patrol",
        npc: "Barangay Tanod",
        missionId: 1,
        percentX: 87,  // 87% from left
        percentY: 52,  // 52% from top
    },
    // ... more NPCs
];
```

#### Collectible Positioning
```typescript
collectibleItemsData = [
    {
        id: "barangay-coin-1",
        type: "coin",
        percentX: 25,  // 25% from left
        percentY: 35,  // 35% from top
        // ... other properties
    },
];
```

---

## Location Display System

### Purpose
Shows the player's current position and area name above their character in real-time.

### Features
- **Real-Time Updates**: Updates every frame as player moves
- **Percentage Coordinates**: Shows position as % of background (0-100%)
- **Area Names**: Displays district/area names based on position
- **Responsive**: Adapts font size for mobile and desktop

### Display Format
```
[Area Name]
(X%, Y%)
```

Example:
```
Central District
(50%, 50%)
```

### Area Detection

#### Barangay (Level 1) Districts
| Area Name | X Range | Y Range |
|-----------|---------|---------|
| Northwest District | 0-25% | 0-25% |
| Northeast District | 75-100% | 0-25% |
| Southwest District | 0-25% | 75-100% |
| Southeast District | 75-100% | 75-100% |
| Central District | 37.5-62.5% | 37.5-62.5% |
| North District | 25-75% | 0-25% |
| South District | 25-75% | 75-100% |
| West District | 0-25% | 25-75% |
| East District | 75-100% | 25-75% |

#### City (Level 2) Districts
| Area Name | X Range | Y Range |
|-----------|---------|---------|
| Government District | 0-25% | 0-25% |
| Business District | 75-100% | 0-25% |
| Residential District | 0-25% | 75-100% |
| Industrial District | 75-100% | 75-100% |
| City Center | 37.5-62.5% | 37.5-62.5% |
| Administrative Zone | 25-75% | 0-25% |
| Service District | 25-75% | 75-100% |
| Cultural Quarter | 0-25% | 25-75% |
| Commercial Zone | 75-100% | 25-75% |

### Visual Properties
- **Font**: Arial Black
- **Size**: 10px (mobile) / 12px (desktop)
- **Color**: White text with black outline
- **Background**: Semi-transparent blue (rgba)
- **Position**: 60 pixels above player's head
- **Depth**: 500 (above player, below UI)

---

## Collectibles System

### Overview
Random collectible items scattered throughout the map that players can collect for bonus coins and points.

### Item Types

#### 1. Coins (💰)
- **Value**: 5-10 coins
- **Points**: 10-20 points
- **Rarity**: Common
- **Purpose**: Basic currency collection

#### 2. Badges (🏅)
- **Value**: 10-20 coins
- **Points**: 25-40 points
- **Rarity**: Uncommon
- **Purpose**: Mid-tier collectibles

#### 3. Powerups (⚡)
- **Value**: 15-25 coins
- **Points**: 30-50 points
- **Rarity**: Uncommon
- **Purpose**: Civic engagement boosters

#### 4. Treasures (💎 💠 🎖️)
- **Value**: 25-50 coins
- **Points**: 50-100 points
- **Rarity**: Rare
- **Purpose**: High-value hidden treasures

### Level 1: Barangay Collectibles (8 Items)

| ID | Type | Icon | Value | Points | Rarity | Position |
|----|------|------|-------|--------|--------|----------|
| barangay-coin-1 | Coin | 💰 | 5 | 10 | Common | (25%, 35%) |
| barangay-coin-2 | Coin | 💰 | 5 | 10 | Common | (75%, 65%) |
| barangay-coin-3 | Coin | 💰 | 5 | 10 | Common | (45%, 80%) |
| barangay-badge-1 | Badge | 🏅 | 10 | 25 | Uncommon | (15%, 50%) |
| barangay-badge-2 | Badge | 🏅 | 10 | 25 | Uncommon | (85%, 35%) |
| barangay-treasure-1 | Treasure | 💎 | 25 | 50 | Rare | (50%, 50%) |
| barangay-powerup-1 | Powerup | ⚡ | 15 | 30 | Uncommon | (30%, 70%) |
| barangay-powerup-2 | Powerup | ⚡ | 15 | 30 | Uncommon | (70%, 30%) |

**Total Base Rewards**: 90 coins + 190 points  
**Achievement Bonus**: +50 coins + 100 points  
**Grand Total**: **140 coins + 290 points**

### Level 2: City Collectibles (10 Items)

| ID | Type | Icon | Value | Points | Rarity | Position |
|----|------|------|-------|--------|--------|----------|
| city-coin-1 | Coin | 💰 | 10 | 20 | Common | (20%, 40%) |
| city-coin-2 | Coin | 💰 | 10 | 20 | Common | (80%, 60%) |
| city-coin-3 | Coin | 💰 | 10 | 20 | Common | (40%, 85%) |
| city-badge-1 | Badge | 🏅 | 20 | 40 | Uncommon | (10%, 55%) |
| city-badge-2 | Badge | 🏅 | 20 | 40 | Uncommon | (90%, 30%) |
| city-treasure-1 | Treasure | 💎 | 50 | 100 | Rare | (50%, 50%) |
| city-powerup-1 | Powerup | ⚡ | 25 | 50 | Uncommon | (25%, 75%) |
| city-powerup-2 | Powerup | ⚡ | 25 | 50 | Uncommon | (75%, 25%) |
| city-gem-1 | Treasure | 💠 | 40 | 80 | Rare | (60%, 20%) |
| city-gem-2 | Treasure | 🎖️ | 35 | 70 | Rare | (35%, 65%) |

**Total Base Rewards**: 245 coins + 490 points  
**Achievement Bonus**: +100 coins + 200 points  
**Grand Total**: **345 coins + 690 points**

### Collection Mechanics

#### How to Collect
1. Walk your character into a collectible item
2. Automatic collection triggers on overlap
3. Visual and audio effects play
4. Rewards are added to your total
5. Item disappears and is saved as collected

#### Persistence
- **Storage**: Items saved to `localStorage`
- **Format**: `collectedItems: ["barangay-coin-1", "city-badge-2", ...]`
- **Validation**: Checksums prevent tampering
- **One-Time**: Each item can only be collected once
- **Cross-Session**: Collected items stay collected after reload

#### Data Structure
```typescript
interface CollectibleItem {
    id: string;                    // Unique identifier
    type: "coin" | "badge" | "powerup" | "treasure";
    name: string;                  // Display name
    description: string;           // Item description
    value: number;                 // Coins awarded
    points: number;                // Score points awarded
    rarity: "common" | "uncommon" | "rare" | "legendary";
    percentX: number;              // 0-100% horizontal position
    percentY: number;              // 0-100% vertical position
    icon: string;                  // Emoji or sprite key
}
```

---

## Minimap/Radar System

### Purpose
Provides a small map in the bottom-left corner showing:
- Player position (real-time)
- NPC locations (static)
- Collectible locations (dynamic - disappear when collected)

### Visual Design

#### Layout
```
┌─────────────────┐
│      MAP        │  ← Title
├─────────────────┤
│  🔵    🟡   🔵 │  ← NPCs & Collectibles
│     🟢         │  ← Player (green dot)
│  🟡    🟣   🟡 │  ← More items
│                 │
└─────────────────┘
```

#### Size
- **Desktop**: 150x150 pixels
- **Mobile**: 100x100 pixels
- **Position**: Bottom-left corner (above joystick on mobile)

#### Colors
- **🟢 Green**: Player (real-time position)
- **🔵 Blue**: NPCs/Mission locations
- **🟡 Yellow**: Common collectibles
- **🔵 Cyan**: Uncommon collectibles
- **🟣 Purple**: Rare collectibles
- **🟡 Gold**: Legendary collectibles

#### Border
- **Barangay**: Golden border (#FFD700)
- **City**: Sky blue border (#87CEEB)

### Features
- **Real-Time Updates**: Player dot moves as you walk
- **Dynamic Collectibles**: Dots disappear when items are collected
- **Pulsing Animation**: Collectible dots pulse to attract attention
- **Fixed Position**: Doesn't scroll with camera (always visible)
- **High Depth**: z-index 1500 (always on top)

### Technical Details
```typescript
// Minimap positioning
minimapX = isMobile ? 70 : 90;
minimapY = screenHeight - (isMobile ? 120 : 170);

// Dot positioning on minimap
dotX = (itemPercentX / 100) * minimapSize;
dotY = (itemPercentY / 100) * minimapSize;
```

---

## Sound and Visual Effects

### Sound Effects

#### Collection Sounds (Web Audio API)
Musical chimes that play when collecting items, with pitch based on rarity:

| Rarity | Notes (Hz) | Description |
|--------|------------|-------------|
| Common | [330, 392, 440] | Low-pitched 3-note melody |
| Uncommon | [349, 440, 523] | Mid-pitched 3-note melody |
| Rare | [392, 494, 587] | Mid-high 3-note melody |
| Legendary | [440, 554, 659, 880] | High-pitched 4-note melody |

#### Technical Implementation
```typescript
playCollectionSound(rarity: string) {
    // Creates AudioContext
    // Generates oscillator for each note
    // Plays sequential tones with 0.1s delay
    // Volume fades out over 0.15s
    // Pure JavaScript - no external libraries
}
```

### Particle Effects

#### 1. Sparkle Burst (20 particles)
- **Pattern**: Circular explosion outward
- **Color**: Matches item rarity
- **Animation**: Flies out 30-50 pixels then fades
- **Duration**: 500-800ms random variation
- **Effect**: Creates satisfying "burst" feeling

#### 2. Star Burst (5 rotating stars)
- **Icon**: ⭐ emoji
- **Pattern**: Pentagon formation (5 points)
- **Animation**: Rotates 360° while flying outward
- **Distance**: 40 pixels from collection point
- **Duration**: 600ms

#### 3. Item Collection Animation
- **Movement**: Flies upward 80 pixels
- **Scale**: Grows from 1x to 2x
- **Alpha**: Fades from 1 to 0 (transparent)
- **Duration**: 600ms
- **Easing**: Back.easeOut (bouncy effect)

#### 4. Floating Text
- **Content**: "+X 💰 +Y ⭐" (shows exact rewards)
- **Color**: Gold (#FFD700) with black outline
- **Animation**: Rises 60 pixels and fades out
- **Duration**: 1000ms
- **Font**: Arial Black, 24px

### Idle Animations (Before Collection)

#### Floating Motion
```typescript
// Items bob up and down continuously
tweens.add({
    targets: collectible,
    y: startY - 15,  // Moves up 15 pixels
    duration: 1200,
    ease: "Sine.easeInOut",
    yoyo: true,      // Returns to start position
    repeat: -1,      // Infinite loop
});
```

#### Pulsing Glow
```typescript
// Glow circle pulses around item
tweens.add({
    targets: glow,
    alpha: { from: 0.3, to: 0.6 },
    scaleX: { from: 1, to: 1.3 },
    scaleY: { from: 1, to: 1.3 },
    duration: 1200,
    yoyo: true,
    repeat: -1,
});
```

---

## Achievement System

### Collection Achievements

#### Barangay Master Collector
- **Requirement**: Collect all 8 barangay collectibles
- **Badge**: "Treasure Hunter"
- **Reward**: 50 bonus coins + 100 bonus points
- **Notification**: Special achievement popup
- **One-Time**: Only awarded once

#### City Master Collector
- **Requirement**: Collect all 10 city collectibles
- **Badge**: "Municipal Treasure Hunter"
- **Reward**: 100 bonus coins + 200 bonus points
- **Notification**: Special achievement popup
- **One-Time**: Only awarded once

### Achievement Detection
```typescript
checkCollectionAchievement() {
    // Checks if all items in current level are collected
    const allItemsCollected = collectibleItemsData.every(item =>
        gameStateManager.isItemCollected(item.id)
    );

    if (allItemsCollected) {
        // Trigger achievement notification
        // Award bonus rewards
        // Save to persistent storage
    }
}
```

### Future Achievement Ideas
- **Speed Collector**: Collect all items within 5 minutes
- **No Map Collector**: Collect all without using minimap
- **Combo Collector**: Collect 3 items within 1 minute
- **Rarity Master**: Collect all rare items first

---

## Minimap/Radar System

### Overview
A mini-map displayed in the bottom-left corner showing:
- Player's real-time position
- All NPC/mission locations
- All collectible item locations (that haven't been collected)

### Components

#### Minimap Container
```typescript
Position: Bottom-left corner
Desktop: 90px from left, 170px from bottom
Mobile: 70px from left, 120px from bottom
Size: 150x150px (desktop) / 100x100px (mobile)
Depth: 1500 (always on top)
ScrollFactor: 0 (doesn't move with camera)
```

#### Background
```typescript
Fill: Black with 60% opacity (0x000000, 0.6)
Border: 2px solid
  - Barangay: Gold (#FFD700)
  - City: Sky Blue (#87CEEB)
Border Radius: 8px
```

#### Title Text
```typescript
Text: "MAP" (Barangay) / "CITY MAP" (City)
Font: Arial Black, 11-12px
Color: Gold (Barangay) / Sky Blue (City)
Position: Centered above minimap
```

#### Player Dot
```typescript
Size: 4px radius circle
Color: Green (0x00ff00)
Opacity: 100%
Updates: Every frame (real-time)
```

#### NPC Dots
```typescript
Size: 2px radius circles
Color: Royal Blue (0x4169e1)
Opacity: 80%
Position: Fixed based on NPC percentX/percentY
```

#### Collectible Dots
```typescript
Size: 2px radius circles
Color: Rarity-based (yellow/cyan/purple/gold)
Opacity: 50-100% (pulsing)
Animation: Pulsing scale and alpha
Visibility: Disappears when item is collected
```

### Update Logic
```typescript
updateMinimap() {
    // 1. Calculate player's percentage position
    // 2. Update player dot position on minimap
    // 3. Hide collectible dots for collected items
    // Runs every frame in update() loop
}
```

### Minimap Legend

| Symbol | Meaning | Notes |
|--------|---------|-------|
| 🟢 | You (Player) | Moves in real-time |
| 🔵 | NPCs/Missions | Static positions |
| 🟡 | Common Item | Basic collectibles |
| 🔵 | Uncommon Item | Better rewards |
| 🟣 | Rare Item | High value |
| 🟡 | Legendary Item | Extremely rare |

---

## Technical Implementation

### File Structure

```
src/
├── game/
│   └── scenes/
│       ├── BarangayMap.ts      # Level 1 implementation
│       └── CityMap.ts          # Level 2 implementation
├── utils/
│   ├── GameStateManager.ts    # Game state & collectibles tracking
│   └── GameValidation.ts      # Data structures & validation
└── App.tsx                     # React integration
```

### Key Classes and Methods

#### GameStateManager (utils/GameStateManager.ts)
```typescript
// Collectible tracking methods
collectItem(itemId, coins, points): boolean
isItemCollected(itemId): boolean
getTotalCollectedItems(): number
getCollectedItems(): string[]
```

#### GameValidation (utils/GameValidation.ts)
```typescript
// Data structures
interface GameProgress {
    collectedItems?: string[];
    totalItemsCollected?: number;
    // ... other properties
}

interface CollectibleItem {
    id: string;
    type: "coin" | "badge" | "powerup" | "treasure";
    rarity: "common" | "uncommon" | "rare" | "legendary";
    percentX: number;
    percentY: number;
    // ... other properties
}
```

#### BarangayMap / CityMap Methods
```typescript
// Core collectibles methods
createCollectibles()                    // Spawns all collectibles
collectItem(player, collectible)        // Handles collection
createCollectionParticles(x, y, rarity) // Particle effects
playCollectionSound(rarity)             // Audio feedback
showFloatingText(x, y, text)           // Floating rewards text
checkCollectionAchievement()            // Achievement detection

// Minimap methods
createMinimap()                         // Creates minimap UI
updateMinimap()                         // Updates player position

// Positioning methods
percentageToWorldCoordinates(x, y)     // Converts % to world coords
repositionPlayerRelativeToBackground() // Centers player
repositionNPCsRelativeToBackground()   // Positions NPCs
```

### Performance Optimization

#### Creation Timing
```typescript
// Background created first
createBackground()

// NPCs created after background ready
createNPCs()

// Collectibles created 300ms after background
time.delayedCall(300, () => {
    createCollectibles();
});

// Minimap created 400ms after background
time.delayedCall(400, () => {
    createMinimap();
});
```

#### Update Frequency
- **Location Display**: Every frame
- **Minimap**: Every frame
- **Collectible Animations**: Continuous tweens
- **Particle Effects**: On-demand only

### Storage Structure

#### localStorage Format
```json
{
    "civika-game-progress": {
        "playerName": "Citizen",
        "level": 1,
        "coins": 150,
        "badges": ["Eco-Kabataan", "Registered Voter"],
        "completedMissions": [1, 2],
        "totalScore": 450,
        "collectedItems": [
            "barangay-coin-1",
            "barangay-badge-1",
            "city-treasure-1"
        ],
        "totalItemsCollected": 3,
        "lastPlayedDate": "2025-10-10T12:00:00.000Z",
        "checksum": "abc123..."
    }
}
```

---

## Player Experience Flow

### Discovery
```
Player explores map
    ↓
Sees glowing item on minimap (pulsing dot)
    ↓
Walks toward location
    ↓
Finds floating emoji with glow effect
    ↓
Location display shows area coordinates
```

### Collection
```
Player walks into item
    ↓
Overlap detection triggers
    ↓
🎵 Musical chime plays
    ↓
✨ Sparkle particles burst
    ↓
⭐ Stars rotate outward
    ↓
💰 Floating text rises ("+X 💰 +Y ⭐")
    ↓
Item zooms up and fades
    ↓
🎉 Notification appears
    ↓
Coins & points added to HUD
    ↓
Minimap dot disappears
    ↓
Saved to localStorage
```

### Achievement Unlock
```
Last item collected
    ↓
Check if all items collected
    ↓
🏆 Achievement notification
    ↓
Bonus rewards awarded
    ↓
Special badge earned
    ↓
Saved to profile
```

---

## Game Balance

### Reward Distribution

#### Level 1 (Barangay)
- **Missions**: ~270 coins + ~1,650 points
- **Collectibles**: 140 coins + 290 points
- **Total**: **410 coins + 1,940 points**

#### Level 2 (City)
- **Missions**: ~580 coins + ~4,500 points
- **Collectibles**: 345 coins + 690 points
- **Total**: **925 coins + 5,190 points**

#### Both Levels Combined
- **Grand Total**: **1,335 coins + 7,130 points**

### Progression Impact
- **Collectibles = ~30% of total coins**
- **Encourages exploration** beyond just missions
- **Optional but rewarding** - not required for progression
- **Achievement hunters** get significant bonuses

---

## Code Examples

### Adding a New Collectible

```typescript
// In collectibleItemsData array:
{
    id: "unique-collectible-id",
    type: "treasure",
    name: "Ancient Artifact",
    description: "A legendary civic treasure",
    value: 100,
    points: 200,
    rarity: "legendary",
    percentX: 50,
    percentY: 50,
    icon: "👑",
}
```

### Checking Collection Status

```typescript
// In any component:
const gameStateManager = GameStateManager.getInstance();

// Check if specific item collected
if (gameStateManager.isItemCollected("barangay-coin-1")) {
    console.log("Coin 1 already collected!");
}

// Get total collected
const total = gameStateManager.getTotalCollectedItems();
console.log(`Collected ${total} items`);

// Get all collected IDs
const items = gameStateManager.getCollectedItems();
console.log("Collected:", items);
```

### Manual Collection (for testing)

```typescript
// Manually collect an item
const gameStateManager = GameStateManager.getInstance();
gameStateManager.collectItem("barangay-treasure-1", 25, 50);
```

---

## Troubleshooting

### Collectibles Not Appearing

**Check:**
1. Console for "=== CREATING COLLECTIBLE ITEMS ===" message
2. "Items created: X" should match total items
3. Background must be loaded (Background ready: true)
4. No errors in console

**Solutions:**
- Increase delay in `time.delayedCall(300, ...)` to 500
- Check if `backgroundImage` exists
- Verify `percentageToWorldCoordinates()` returns valid values
- Check depth settings (should be 150-200)

### Minimap Not Showing

**Check:**
1. Console for "minimap created" message
2. Screen size (might be off-screen on very small devices)
3. Depth setting (should be 1500)

**Solutions:**
- Adjust `minimapX` and `minimapY` positions
- Check `setScrollFactor(0)` is set
- Verify container is added to scene

### Sounds Not Playing

**Check:**
1. Browser supports Web Audio API
2. User has interacted with page (required for audio)
3. Console for audio errors

**Solutions:**
- Click anywhere on page before collecting
- Check browser audio permissions
- Use headphones/speakers to hear subtle chimes

### Items Already Collected on New Game

**Issue**: localStorage persists across sessions

**Solutions:**
```typescript
// Clear all progress (reset game)
GameStateManager.getInstance().resetProgress();

// Or clear only collectibles (in browser console)
localStorage.removeItem("civika-game-progress");
```

---

## Future Enhancement Ideas

### Gameplay
- [ ] **Daily Respawns**: Some items respawn after 24 hours
- [ ] **Random Spawns**: Items appear at random positions each session
- [ ] **Seasonal Items**: Special collectibles during holidays
- [ ] **Multipliers**: Collect 3 items quickly for bonus multiplier
- [ ] **Trading System**: Trade collectibles with NPCs

### Visual
- [ ] **Trails**: Shimmering trail leading to nearby collectibles
- [ ] **Magnets**: Powerup that attracts nearby collectibles
- [ ] **Collection Counter**: UI element showing X/Y collected
- [ ] **Rarity Indicators**: Different icon sizes by rarity
- [ ] **Collection Map**: Full-screen map showing all locations

### Audio
- [ ] **Background Music Change**: Different music when near collectibles
- [ ] **Combo Sounds**: Special sound for collecting multiple items
- [ ] **Proximity Alert**: Subtle ping when collectible is nearby
- [ ] **Achievement Fanfare**: Grand music for achievements

### Social
- [ ] **Leaderboards**: Compare collection speed with others
- [ ] **Collection Badges**: Display on player profile
- [ ] **Share System**: Share rare finds on social media
- [ ] **Collection Journal**: Log of all collected items with timestamps

---

## API Reference

### GameStateManager Collectibles API

```typescript
// Collect an item
collectItem(itemId: string, coins: number, points: number): boolean
// Returns: true if collected, false if already collected

// Check collection status
isItemCollected(itemId: string): boolean
// Returns: true if item has been collected

// Get statistics
getTotalCollectedItems(): number
// Returns: Total count of collected items

getCollectedItems(): string[]
// Returns: Array of collected item IDs
```

### Scene Methods

```typescript
// Create collectibles in scene
createCollectibles(): void
// Spawns all collectibles based on collectibleItemsData

// Handle collection
collectItem(player: any, collectible: any): void
// Called automatically on overlap

// Create visual effects
createCollectionParticles(x: number, y: number, rarity: string): void
playCollectionSound(rarity: string): void
showFloatingText(x: number, y: number, text: string): void

// Achievement check
checkCollectionAchievement(): void
// Automatically called after each collection

// Minimap management
createMinimap(): void
updateMinimap(): void
```

---

## Statistics Summary

### Total Collectibles
- **Barangay**: 8 items
- **City**: 10 items
- **Grand Total**: **18 collectibles**

### Total Rewards Available
- **Base Collectibles**: 335 coins + 680 points
- **Achievements**: 150 coins + 300 points
- **Grand Total**: **485 coins + 980 points**

### Rarity Distribution
- **Common**: 6 items (33%)
- **Uncommon**: 8 items (44%)
- **Rare**: 4 items (22%)
- **Legendary**: 0 items (0% - reserved for special events)

### Spatial Distribution
- **Corners**: 4 items (explorers rewarded)
- **Edges**: 6 items (boundary coverage)
- **Center**: 2 items (high-value treasures)
- **Mid-zones**: 6 items (balanced spread)

---

## Version History

### v1.0.0 - Initial Release
- ✅ Background-relative positioning system
- ✅ Location display above player head
- ✅ Basic collectibles (8 barangay, 10 city)
- ✅ Sound effects (Web Audio API)
- ✅ Particle effects (sparkles + stars)
- ✅ Achievement system
- ✅ Minimap with real-time updates
- ✅ Persistent storage via localStorage
- ✅ Cross-platform compatibility (desktop/mobile)

---

## Credits

**Game**: CIVIKA - Civic Engagement Educational Game  
**Features**: Collectibles System v1.0  
**Platform**: Phaser 3 + React + TypeScript  
**Storage**: localStorage with checksum validation  
**Audio**: Web Audio API (no external dependencies)  

---

## Support

For issues or questions about the collectibles system:
1. Check browser console for error messages
2. Verify localStorage is enabled
3. Test on different devices (desktop/mobile)
4. Clear cache and reload if items don't appear
5. Check this documentation for troubleshooting steps

---

**Last Updated**: October 10, 2025  
**Author**: CIVIKA Development Team  
**Version**: 1.0.0

