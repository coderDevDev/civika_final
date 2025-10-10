# 🏪 CIVIKA Shop & Reward System - Quick Start

## ✅ Implementation Complete!

The complete shop and reward system has been fully implemented and integrated into CIVIKA!

---

## 🎯 What's Been Added

### 1. **Coin Shop** 🏪

-   **10 unique items** across 4 categories
-   **Buy with coins** earned from missions and collectibles
-   **Powerups, cosmetics, boosters, and special items**
-   **Level-based unlocks** (some items require Level 2)

### 2. **Daily Challenges** 📅

-   **3 challenges per day** (reset at midnight)
-   **Bonus coin rewards** for completing challenges
-   **Auto-tracking** (updates as you play)
-   **Progress bars** showing completion status

### 3. **NPC Rewards** 🎁

-   **Special gifts** from NPCs at mission milestones
-   **Bonus coins** + **free shop items**
-   **One-time rewards** for completing key missions

### 4. **Inventory System** 🎒

-   **Track purchased items**
-   **Use consumables** (powerups, boosters)
-   **Active effects** with timers
-   **Persistent storage** (localStorage)

---

## 🎮 How to Access

### In-Game HUD (Top-Right):

```
[📋 Quest] [🏪 Shop] [📅 Daily] [⏸️ Menu]
            ↑        ↑
      Click here  Click here
```

**Shop Button** (🏪): Opens the shop modal  
**Daily Button** (📅): Opens daily challenges

### What Players See:

#### Shop Modal:

-   Browse items by category
-   See your coin balance
-   Purchase items
-   View inventory

#### Daily Challenges Modal:

-   See 3 daily challenges
-   Track progress in real-time
-   Countdown timer for reset
-   Automatic reward collection

---

## 💰 Coin System

### How to Earn Coins:

| Source            | Amount       | Frequency            |
| ----------------- | ------------ | -------------------- |
| Missions (1-20)   | 15-80 coins  | 20 times total       |
| Collectible Items | 5-25 coins   | 18 items total       |
| Daily Challenges  | 50-100 coins | 3 per day            |
| NPC Rewards       | 50-200 coins | 3 special rewards    |
| Achievements      | 50 coins     | Collection milestone |

**Total Available**: ~1,575+ coins per playthrough!

### How to Spend Coins:

| Item Type | Price Range   | Purpose               |
| --------- | ------------- | --------------------- |
| Powerups  | 50-200 coins  | Temporary boosts      |
| Boosters  | 150 coins     | Performance enhancers |
| Cosmetics | 120-500 coins | Visual items          |
| Special   | 250-400 coins | Unique effects        |

---

## 🏪 Shop Items

### Available Items:

#### ⚡ Powerups:

1. **Speed Boost** (50 coins) - Move faster for 60s
2. **Coin Magnet** (100 coins) - 2x coins for 120s
3. **Hint Token** (75 coins) - Reveal wrong answer
4. **Time Freeze** (200 coins) - Pause timer for 15s

#### 📈 Boosters:

5. **Score Booster** (150 coins) - 1.5x points for 3 quizzes

#### 👑 Cosmetics:

6. **Golden Badge** (120 coins) - Shiny badge
7. **Civic Crown** (300 coins) - Leader crown (Level 2+)
8. **Trophy Display** (500 coins) - Achievement showcase (Level 2+)

#### 🎁 Special:

9. **Mystery Box** (250 coins) - Random reward
10. **Lucky Charm** (400 coins) - More collectibles (Level 2+)

---

## 📅 Daily Challenges

### Today's Challenges:

#### 1. Treasure Hunter 🎯

```
Collect 5 collectible items
Reward: 50 coins + 100 points
Resets: Midnight
```

#### 2. Speed Demon ⚡

```
Complete 3 quizzes with excellent time (≤10s)
Reward: 75 coins + 150 points
Resets: Midnight
```

#### 3. Daily Duty 📋

```
Complete 2 missions
Reward: 100 coins + 200 points
Resets: Midnight
```

**Total Daily Bonus**: 225 coins + 450 points!

---

## 🎁 NPC Special Rewards

### Milestone Gifts:

#### Barangay Captain (Mission #10)

```
Complete all 10 barangay missions
Reward:
  💰 +100 coins
  👑 Civic Crown (FREE!)
Message: "Congratulations on mastering barangay governance!"
```

#### Mayor (Mission #20)

```
Complete all 20 missions
Reward:
  💰 +200 coins
  🏆 Trophy Display (FREE!)
Message: "You've mastered civic governance!"
```

#### Health Worker (Mission #9)

```
Complete health mission
Reward:
  💰 +50 bonus coins
Message: "Thank you for promoting community health!"
```

---

## 🎮 Example Playthrough

### Early Game (Missions 1-3):

```
Start: 0 coins

Complete Mission #1
  └─> +20 coins (Total: 20)
  └─> Complete daily challenge (2 missions)
  └─> +100 bonus coins (Total: 120)

Collect 3 items
  └─> +15 coins (Total: 135)

Buy Golden Badge (120 coins)
  └─> Coins left: 15

Complete Mission #2
  └─> +15 coins (Total: 30)
```

### Mid Game (Missions 4-10):

```
Collect all barangay items (8 total)
  └─> +80 coins
  └─> Complete "Treasure Hunter" challenge
  └─> +50 bonus coins
  └─> Total: 160 coins

Complete Mission #10
  └─> +50 coins (Total: 210)
  └─> Barangay Captain reward: +100 coins
  └─> FREE Civic Crown!
  └─> Total: 310 coins

Can now afford:
  - Civic Crown (already have - free!)
  - Mystery Box (250 coins)
  - Multiple powerups
```

---

## 🔄 How It Works (Technical)

### Shop Purchase:

```
Player clicks "Buy"
       ↓
ShopService.purchaseItem()
       ↓
Validates: coins, level, limit
       ↓
GameStateManager.spendCoins()
       ↓
Add to inventory
       ↓
Activate effect (if applicable)
       ↓
Save to localStorage
       ↓
Show success message ✅
```

### Daily Challenge Tracking:

```
Player collects item
       ↓
EventBus.emit("update-daily-challenge")
       ↓
App.tsx receives event
       ↓
ShopService.updateChallengeProgress()
       ↓
Check if requirement met (5/5)
       ↓
If complete:
  ├─> Award coins (GameStateManager)
  ├─> Award points (GameProgress)
  ├─> Mark as completed
  └─> Save to localStorage
```

---

## 📁 Files Created

### Core Files:

-   `src/types/shop.ts` - TypeScript interfaces
-   `src/services/ShopService.ts` - Shop logic (400+ lines)
-   `src/components/Shop.tsx` - Shop UI component
-   `src/components/DailyChallenges.tsx` - Challenges UI

### Updated Files:

-   `src/App.tsx` - Integrated shop and challenges
-   `src/utils/GameValidation.ts` - Added purchasedItems tracking
-   `src/game/scenes/BarangayMap.ts` - Challenge update events

### Documentation:

-   `SHOP_REWARD_SYSTEM_DOCUMENTATION.md` - Complete guide
-   `SHOP_SYSTEM_QUICKSTART.md` - This file!

---

## 🎯 Key Features

### Shop:

✅ 4 categories with unique items  
✅ Rarity system (Common → Legendary)  
✅ Level requirements (some items locked until Level 2)  
✅ Purchase limits (e.g., max 10 hint tokens)  
✅ Inventory management  
✅ Active effect tracking

### Daily Challenges:

✅ 3 challenges per day  
✅ Auto-tracking (no manual input)  
✅ Bonus rewards (225 coins/day)  
✅ 24-hour timer  
✅ Progress bars  
✅ Completion notifications

### Rewards:

✅ Mission coin rewards (20-80 coins)  
✅ Collectible rewards (5-25 coins)  
✅ NPC special bonuses (50-200 coins)  
✅ Achievement rewards (50+ coins)  
✅ Daily challenge bonuses (50-100 coins)

---

## 🧪 Quick Test

1. **Start game** and complete Mission #1
2. **Check coins**: Should have 20+ coins
3. **Click 🏪 in HUD**: Shop opens
4. **Browse items**: See powerups, cosmetics, etc.
5. **Try to buy** something expensive: "No Coins" message
6. **Complete more missions**: Earn more coins
7. **Purchase item**: Success! Check inventory
8. **Click 📅 in HUD**: See daily challenges
9. **Progress tracked**: Challenges update as you play!

---

## 💡 Tips

### For Players:

-   Save coins for expensive items (Crown, Trophy)
-   Use powerups strategically (before hard quizzes)
-   Complete daily challenges for bonus coins
-   Talk to NPCs after milestones for rewards

### For Developers:

-   Customize items in `ShopService.ts` → `SHOP_CATALOG`
-   Add new challenges in `generateDailyChallenges()`
-   Modify prices to balance economy
-   Add new item categories easily

---

## 🎉 Status

**✅ FULLY IMPLEMENTED AND READY TO USE!**

**Features Added**:

-   Complete shop system with 10 items
-   Daily challenges (3 per day)
-   NPC reward system
-   Inventory management
-   Powerup/effect system
-   Coin economy
-   Beautiful UI
-   Mobile optimized

**Integration**:

-   ✅ Works with existing coin system
-   ✅ Integrates with missions and collectibles
-   ✅ Auto-tracks daily challenges
-   ✅ Persists to localStorage
-   ✅ No conflicts with other systems

---

**🏪 The shop is open for business! Start earning and spending those coins! 💰**

---

**Created**: October 10, 2025  
**Time to Implement**: Complete!  
**Status**: Production Ready 🚀
