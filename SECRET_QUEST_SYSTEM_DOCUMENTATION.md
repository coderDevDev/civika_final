# 🔐 SECRET QUEST SYSTEM DOCUMENTATION

## Overview

The Secret Quest System adds a layer of mystery, exploration, and achievement to CIVIKA by providing hidden quests that award unique **player titles**. These quests encourage players to explore every corner of the game world, experiment with different strategies, and discover hidden content.

---

## 🎯 Core Features

### 1. **Secret Quests**
- Hidden quests that players discover through gameplay
- Not visible in the quest log until discovered
- Award unique titles upon completion
- Provide cryptic hints to guide players

### 2. **Player Titles**
- Unique titles that reflect player achievements
- Display above player's name in HUD
- Can be changed anytime from unlocked titles
- Categorized by rarity: Common, Uncommon, Rare, Legendary

### 3. **Secret Locations**
- Hidden spots on the map that trigger discoveries
- Percentage-based positioning for consistency
- Reveal secret quests when found
- Award bonus coins and points

### 4. **Hidden NPCs**
- Special NPCs that appear only under certain conditions
- Provide wisdom and lore
- Contribute to secret quest completion
- Appear after meeting requirements

---

## 📋 Secret Quest Types

### 🗺️ Exploration Quests
**Purpose**: Encourage thorough map exploration

| Quest | Title | Requirement | Reward |
|-------|-------|-------------|--------|
| The Four Corners | **Explorer** | Visit all 4 map corners | 100 coins + 200 points |
| Hidden Paths | **Pathfinder** | Discover 5 hidden locations | 200 coins + 400 points + Compass |
| (Future) | **Wanderer** | Walk 10,000 steps | TBD |

### 💎 Collection Quests
**Purpose**: Reward completionists

| Quest | Title | Requirement | Reward |
|-------|-------|-------------|--------|
| Master Collector | **Treasure Hunter** | Collect all 18 items (both maps) | 300 coins + 500 points |
| Golden Hoarder | **Coin Collector** | Earn 1,000 total coins | 250 coins + 300 points |
| (Future) | **Badge Master** | Earn all 20 badges | TBD |

### ⚡ Speed Quests
**Purpose**: Reward skilled, fast players

| Quest | Title | Requirement | Reward |
|-------|-------|-------------|--------|
| Lightning Campaign | **Speedrunner** | Complete all missions in <2 hours | 500 coins + 1000 points |
| Thunder Mind | **Lightning Mind** | 10 quizzes in <5 seconds each | 400 coins + 800 points |
| (Future) | **Time Keeper** | Never fail a timed quiz | TBD |

### 💬 Interaction Quests
**Purpose**: Reward thorough social engagement

| Quest | Title | Requirement | Reward |
|-------|-------|-------------|--------|
| Community Connector | **Social Butterfly** | Talk to every NPC 3+ times | 150 coins + 250 points |
| The Wise One | **Civic Sage** | Find & talk to 3 hidden wise NPCs | 350 coins + 600 points + Scroll |

### 🏆 Achievement Quests
**Purpose**: Reward mastery and dedication

| Quest | Title | Requirement | Reward |
|-------|-------|-------------|--------|
| Perfect Civic Leader | **Perfect Citizen** | 100% completion + accuracy | 1000 coins + 2000 points |
| The Legend | **Legend** | Complete ALL secret quests | 2000 coins + 5000 points |

### 🎮 Easter Egg Quests
**Purpose**: Reward curious, creative players

| Quest | Title | Requirement | Reward |
|-------|-------|-------------|--------|
| The Hidden Message | **Secret Keeper** | Find secret message in Barangay Hall | 100 coins + 150 points |
| The Konami Code | **Hidden Hero** | Visit NPCs in secret sequence | 500 coins + 1000 points |

---

## 👑 Player Title System

### Title Rarities

#### 🤍 Common Titles
- **Citizen** (Default starting title)
- Basic titles for everyday achievements

#### 💙 Uncommon Titles
- **Explorer**: Visit all map corners
- **Coin Collector**: Earn 1,000 coins
- **Lightning Mind**: Fast quiz completion
- **Social Butterfly**: Talk to all NPCs
- **Secret Keeper**: Find easter eggs

#### 💜 Rare Titles
- **Pathfinder**: Discover all hidden locations
- **Treasure Hunter**: Collect all items
- **Speedrunner**: Complete game in <2 hours
- **Civic Sage**: Find all hidden NPCs
- **Hidden Hero**: Complete secret sequence

#### 🟡 Legendary Titles
- **Legend**: Complete all secret quests
- **Perfect Citizen**: 100% game completion
- **Master of Civics**: Max score + all achievements
- **Mysterious One**: Discover secret ending

### Title Benefits
- **Visual Flair**: Displayed prominently in HUD
- **Bragging Rights**: Show off to other players
- **Sense of Achievement**: Tangible reward for dedication
- **Collection Goal**: Gotta catch 'em all!

---

## 🗺️ Secret Locations

### Barangay Map (Level 1)

| Location | Position | Hint | Associated Quest |
|----------|----------|------|------------------|
| Northwest Sanctuary | (5%, 5%) | "A peaceful corner away from the bustle" | The Four Corners |
| Northeast Overlook | (95%, 5%) | "Where the sun rises over the community" | The Four Corners |
| Southwest Grove | (5%, 95%) | "Trees whisper secrets in the wind" | The Four Corners |
| Southeast Garden | (95%, 95%) | "Where flowers bloom in solitude" | The Four Corners |
| Old Civic Shrine | (50%, 85%) | "An ancient monument to civic duty" | Hidden Paths |

### Discovery Mechanic
- **Proximity Detection**: 5% radius around location
- **Auto-Discovery**: Triggers when player enters area
- **Notification**: Shows location name and hint
- **Progress Tracking**: Saves discovered locations

---

## 👥 Hidden NPCs

### Appearance Conditions

| NPC | Location | Appears When | Quest |
|-----|----------|--------------|-------|
| The Wise Elder | (12%, 88%) | Complete 5 missions | The Wise One |
| The Mysterious Scholar | (88%, 12%) | Collect 10 items | The Wise One |
| The Ancient Guardian | (50%, 50%) | Reach Level 2 | The Wise One |

### Dialogue System
- Each NPC has multiple dialogue lines
- Wisdom and lore about civic responsibility
- Advances secret quest progress
- Provides cryptic hints for other secrets

---

## 🎯 Implementation Details

### Technical Architecture

```
Secret Quest Flow:
1. Player explores/completes action
2. SecretQuestService checks conditions
3. Quest discovered (if hidden)
4. Progress updated
5. Quest completed when requirements met
6. Title unlocked and awarded
7. Notification shown to player
```

### Key Files

- **`src/types/secretQuest.ts`**: Type definitions
- **`src/services/SecretQuestService.ts`**: Core logic
- **`src/components/SecretQuests.tsx`**: UI component
- **`src/game/scenes/BarangayMap.ts`**: Location checking
- **`src/utils/GameValidation.ts`**: Progress tracking

### Data Storage
- **localStorage**: `civika-secret-quests` (quest progress)
- **localStorage**: `civika-player-titles` (unlocked titles)
- **Persistent**: Survives page refresh
- **Validated**: Checksummed with game progress

---

## 🎮 Player Experience

### Discovery Flow

1. **Exploration**
   - Player walks to map corner (e.g., 5%, 5%)
   - "🗺️ Secret Location Discovered!" notification appears
   - Quest "The Four Corners" is revealed in Secret Quests menu

2. **Progress**
   - Player visits remaining corners
   - Progress bar updates: 1/4 → 2/4 → 3/4 → 4/4
   - Each discovery shows cryptic hint

3. **Completion**
   - Upon visiting 4th corner:
     - "🏆 Secret Quest Completed!" notification
     - Title "Explorer" unlocked
     - 100 coins + 200 points awarded
     - Title automatically equipped

4. **Continuing**
   - Player can change titles anytime
   - New secret quests become available
   - Hidden NPCs appear based on progress

### UI Access

**HUD Button** (Top-Right):
```
[🔐 Secrets]
```

**Pause Menu**:
```
⏸️ Game Menu
├─ 📋 Quest Log
├─ 🎒 Inventory
├─ 🏪 Shop
├─ 📅 Daily Challenges
├─ 🔐 Secret Quests  ← NEW!
└─ 🏆 Leaderboard
```

---

## 📊 Secret Quest Menu

### Tabs

1. **🎯 Secret Quests**
   - List of discovered quests
   - Progress bars for multi-step quests
   - Cryptic hints for incomplete quests
   - Rewards display

2. **👑 Titles**
   - All unlocked titles
   - Click to equip
   - Rarity-based colors
   - Description of how earned

### Visual Design
- Medieval parchment theme
- Gradient colors by rarity
- Progress bars with animations
- Interactive title selection

---

## 🚀 Future Expansions

### Potential New Quests

1. **Master Negotiator** (Interaction)
   - Complete all missions without hints
   - Title: "Wise Citizen"

2. **Hidden Treasure Maps** (Collection)
   - Find 5 treasure map pieces
   - Unlock special treasure hunt
   - Title: "Treasure Map Master"

3. **Speed Demon Challenges** (Speed)
   - Complete specific actions in record time
   - Multiple tiers (Bronze, Silver, Gold)
   - Title: "Time Lord"

4. **Community Builder** (Achievement)
   - Max reputation with all NPCs
   - Help every citizen
   - Title: "Community Champion"

### Secret Endings
- Multiple endings based on choices
- Secret "true" ending for completing all
- Title: "Mysterious One"

---

## 💡 Design Philosophy

### Why Secret Quests?

1. **Replayability**: Gives completionists goals beyond main missions
2. **Exploration**: Rewards thorough map exploration
3. **Mystery**: Adds intrigue and discovery
4. **Achievement**: Provides tangible rewards (titles)
5. **Community**: Creates shared secrets players can discuss
6. **Skill Expression**: Rewards different playstyles (speed, collection, social)

### Balance Considerations

- **Not Required**: Secret quests are optional
- **Hints Provided**: Cryptic but fair hints
- **Progressive Disclosure**: Unlocks gradually
- **Varied Difficulty**: Something for everyone
- **No FOMO**: Can always come back later

---

## 🎯 Usage Examples

### For Players

**Discover a Secret Location:**
1. Walk to map corner (e.g., Northwest)
2. See notification: "🗺️ Secret Location Discovered!"
3. Open Secret Quests menu (🔐 button)
4. See "The Four Corners" quest revealed
5. Check hint: "🗺️ The edges of the map hold secrets..."
6. Visit remaining corners to complete

**Equip a Title:**
1. Complete a secret quest
2. Receive title (e.g., "Explorer")
3. Open Secret Quests → Titles tab
4. See "Explorer" in list with purple gradient
5. Click to equip
6. Title now shows in HUD: "👑 Explorer"

### For Developers

**Add New Secret Quest:**
```typescript
{
    id: "secret-new-1",
    name: "Quest Name",
    description: "Quest description",
    type: SecretQuestType.EXPLORATION,
    reward: {
        title: PlayerTitle.NEW_TITLE,
        coins: 100,
        points: 200,
    },
    condition: {
        type: "visit_location",
        count: 3,
    },
    hint: "🗺️ Cryptic hint here...",
    hidden: true,
    discovered: false,
    completed: false,
    progress: 0,
}
```

---

## 📝 Change Log

### Version 1.0.0 (October 10, 2025)
- ✅ Initial secret quest system implementation
- ✅ 12 secret quests across 6 categories
- ✅ 19 unique player titles
- ✅ 5 secret locations (Barangay)
- ✅ 3 hidden NPCs
- ✅ Full UI integration
- ✅ Title display in HUD
- ✅ LocalStorage persistence

---

## 🔧 Technical Notes

### Performance
- **Lightweight**: Minimal performance impact
- **Lazy Loading**: Only checks when needed
- **Cached**: Frequently accessed data cached

### Compatibility
- **Cross-Platform**: Works on mobile and desktop
- **Responsive**: UI adapts to screen size
- **Persistent**: Progress saved locally

### Security
- **Client-Side**: No server verification (currently)
- **Checksum**: Basic tampering protection
- **Future**: Could integrate with Supabase leaderboard

---

## 🎉 Conclusion

The Secret Quest System adds depth, mystery, and replayability to CIVIKA. By rewarding exploration, skill, and dedication with unique titles, players have meaningful goals beyond the main story. The system is designed to be discoverable yet challenging, providing a sense of accomplishment for those who seek out all its secrets.

**"Not all treasures are marked on the map. Some require a keen eye, a curious mind, and a spirit of adventure." - The Ancient Guardian** 🗺️✨

---

**Last Updated**: October 10, 2025  
**Version**: 1.0.0  
**Status**: ✅ Complete and Integrated

