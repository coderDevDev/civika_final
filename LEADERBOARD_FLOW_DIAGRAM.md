# 🔄 CIVIKA Leaderboard - Score Submission Flow

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     PLAYER STARTS GAME                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              Character Creation (Enter Name)                    │
│              ────────────────────────────                       │
│              Player Name: "Alex"                                │
│              GameStateManager.initializeGame("Alex")            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PLAYER PLAYS GAME                             │
│              - Explores BarangayMap/CityMap                     │
│              - Collects items (+coins, +points)                 │
│              - Interacts with NPCs                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              PLAYER APPROACHES NPC (Mission #1)                 │
│              - Distance < 80 pixels                             │
│              - Interaction prompt appears: "Press SPACE"        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              PLAYER PRESSES SPACE/TAP                           │
│              ────────────────────────                           │
│              EventBus.emit("show-mission", missionData)         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              MISSION SYSTEM MODAL OPENS                         │
│              ─────────────────────────                          │
│              - Shows mission description                        │
│              - Shows tasks                                      │
│              - Shows rewards                                    │
│              - "Start Quiz" button                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              PLAYER CLICKS "START QUIZ"                         │
│              ─────────────────────────                          │
│              handleMissionStart() in App.tsx                    │
│              gameStateManager.startQuiz(missionId)              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              QUIZ SYSTEM OPENS                                  │
│              ─────────────────                                  │
│              - Timer starts: 60 seconds countdown               │
│              - Question displayed                               │
│              - 4 answer options shown                           │
│              - Player reads and selects answer                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              PLAYER SELECTS ANSWER & CLICKS SUBMIT              │
│              ─────────────────────────────────────              │
│              handleSubmit() in QuizSystem.tsx                   │
│              - Timer stops                                      │
│              - Time spent calculated: 8 seconds                 │
│              - Time bonus calculated: +30 points (excellent!)   │
│              - Calls onAnswer(isCorrect = true)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              handleQuizAnswer(isCorrect = true)                 │
│              ──────────────────────────────────                 │
│              📍 Location: App.tsx (Line 273-451)                │
│              ─────────────────────────────────────              │
│              Step 1: Submit answer through GameStateManager     │
│              ────────────────────────────────────────────       │
│              const { result, updated } =                        │
│                gameStateManager.submitQuizAnswer(               │
│                  missionId: 1,                                  │
│                  selectedAnswer: 1,                             │
│                  correctAnswer: 1                               │
│                )                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              GameStateManager.submitQuizAnswer()                │
│              ───────────────────────────────────                │
│              📍 Location: GameStateManager.ts (Line 160-220)    │
│              ─────────────────────────────────────              │
│              Step 2: Validate answer                            │
│              ────────────────────────                           │
│              const result = GameValidation.validateQuizAnswer(  │
│                missionId: 1,                                    │
│                selectedAnswer: 1,                               │
│                correctAnswer: 1,                                │
│                timeSpent: 8                                     │
│              )                                                  │
│              // Returns: { isCorrect: true, points: 80 }        │
│                                                                 │
│              Step 3: Complete mission                           │
│              ────────────────────                               │
│              const updatedProgress =                            │
│                GameValidation.completeMission(                  │
│                  missionId: 1,                                  │
│                  quizResult: result,                            │
│                  currentProgress: this.gameProgress             │
│                )                                                │
│              // Updates: coins, badges, score, missions         │
│                                                                 │
│              Step 4: Save to localStorage                       │
│              ──────────────────────────                         │
│              this.saveProgress()                                │
│              // Saves entire game state locally                 │
│                                                                 │
│              Returns: { result, updated: true }                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACK TO handleQuizAnswer() in App.tsx              │
│              ─────────────────────────────────────              │
│              Step 5: Record speed challenge                     │
│              ───────────────────────────                        │
│              if (isCorrect && result.timeSpent) {               │
│                gameStateManager.recordSpeedChallenge(8)         │
│                // Updates: speedChallenges.excellentAnswers++  │
│                // Updates: fastestQuizTime = 8s                │
│              }                                                  │
│                                                                 │
│              Step 6: Update UI                                  │
│              ──────────────                                     │
│              updateGameInfoFromProgress(progress)               │
│              syncGameStateWithPhaser(progress)                  │
│              scene.updateNPCIndicators()                        │
│              // UI shows new coins, badges, score               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              ✅ MISSION COMPLETED - SCORE SUBMISSION!           │
│              ─────────────────────────────────────              │
│              📍 Location: App.tsx (Line 395-418)                │
│              ─────────────────────────────────────              │
│              if (updated) {  // Mission successfully completed  │
│                                                                 │
│                // Get latest progress                           │
│                const progress =                                 │
│                  gameStateManager.getProgress()                 │
│                                                                 │
│                // 🔥 SUBMIT TO LEADERBOARD!                     │
│                leaderboardService.current.submitScore(progress) │
│                                                                 │
│                // Play sounds                                   │
│                audioManager.playEffect("mission-complete")      │
│                audioManager.playEffect("badge-earned")          │
│                audioManager.playEffect("coin-collect")          │
│                                                                 │
│                // Show notification                             │
│                showGameNotification({                           │
│                  title: "Mission Completed! 🎉",                │
│                  message: "You earned ... badge!"               │
│                })                                               │
│              }                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              LeaderboardService.submitScore(progress)           │
│              ────────────────────────────────────               │
│              📍 Location: LeaderboardService.ts (Line 47-113)   │
│              ─────────────────────────────────────              │
│              Step 1: Check if Supabase is configured            │
│              ─────────────────────────────────                  │
│              if (!this.enabled) {                               │
│                console.log("Leaderboard disabled - skipping")   │
│                return false                                     │
│              }                                                  │
│              // If .env.local missing, gracefully skip          │
│                                                                 │
│              Step 2: Prepare leaderboard entry                  │
│              ───────────────────────────────                    │
│              const entry = {                                    │
│                player_name: "Alex",                             │
│                level: 1,                                        │
│                total_score: 180,  // 100 mission + 80 quiz     │
│                badges: 1,                                       │
│                coins: 20,                                       │
│                completed_missions: 1,                           │
│                accuracy: 100.0,                                 │
│                playtime: 5,  // minutes                         │
│                fastest_quiz_time: 8.0,                          │
│                excellent_answers: 1,                            │
│                total_collectibles: 0                            │
│              }                                                  │
│                                                                 │
│              Step 3: Check if player exists in database         │
│              ────────────────────────────────────               │
│              const { data: existing } = await supabase          │
│                .from('leaderboard')                             │
│                .select('id, total_score')                       │
│                .eq('player_name', 'Alex')                       │
│                .maybeSingle()                                   │
│                                                                 │
│              IF PLAYER EXISTS:                                  │
│              ──────────────                                     │
│              if (entry.total_score > existing.total_score) {   │
│                // UPDATE existing record                        │
│                await supabase.from('leaderboard')               │
│                  .update({ ...entry, updated_at: NOW() })      │
│                  .eq('id', existing.id)                         │
│                console.log('✅ Leaderboard updated')            │
│              }                                                  │
│                                                                 │
│              IF PLAYER IS NEW:                                  │
│              ────────────────                                   │
│              // INSERT new record                               │
│              await supabase.from('leaderboard')                 │
│                .insert([entry])                                 │
│              console.log('✅ New leaderboard entry created')    │
│                                                                 │
│              Returns: true (success)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              🗄️ SUPABASE DATABASE UPDATED!                     │
│              ──────────────────────────────                     │
│              Table: leaderboard                                 │
│              Record:                                            │
│              {                                                  │
│                id: "uuid-1234-5678-...",                        │
│                player_name: "Alex",                             │
│                level: 1,                                        │
│                total_score: 180,                                │
│                badges: 1,                                       │
│                coins: 20,                                       │
│                completed_missions: 1,                           │
│                accuracy: 100.00,                                │
│                fastest_quiz_time: 8.0,                          │
│                excellent_answers: 1,                            │
│                total_collectibles: 0,                           │
│                created_at: "2025-10-10T12:00:00Z",              │
│                updated_at: "2025-10-10T12:00:00Z"               │
│              }                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              🔄 REAL-TIME UPDATE BROADCAST                      │
│              ──────────────────────────                         │
│              Supabase sends WebSocket notification:             │
│              "leaderboard table was updated"                    │
│                                                                 │
│              All connected clients receive update:              │
│              ────────────────────────────────────               │
│              - Other players viewing leaderboard                │
│              - Subscribed listeners get notified                │
│              - Leaderboard auto-refreshes                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              PLAYER SEES NOTIFICATION                           │
│              ─────────────────────────                          │
│              "Mission Completed! 🎉"                            │
│              "You earned 20 coins and 180 points!"              │
│              "Your score has been submitted to leaderboard!"    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Exact Trigger Point

### When Score is Submitted to Database:

**📍 File**: `src/App.tsx`  
**📍 Function**: `handleQuizAnswer()`  
**📍 Lines**: 409-410

```typescript
// This code runs IMMEDIATELY after mission completion
if (updated) {
    // Mission successfully completed
    const progress = gameStateManager.current.getProgress();

    // 🔥 THIS IS WHERE SCORE GETS SUBMITTED TO DATABASE!
    leaderboardService.current.submitScore(progress);

    // Then show notifications, play sounds, etc.
}
```

---

## ⏱️ Timeline Breakdown

### From Quiz Start to Database Update:

```
T = 0s:   Player presses SPACE on NPC
          └─> Mission modal opens

T = 2s:   Player clicks "Start Quiz"
          └─> Quiz modal opens
          └─> Timer starts (60 seconds)

T = 10s:  Player selects answer and clicks "Submit"
          └─> Timer stops (8 seconds spent)

T = 10.1s: handleSubmit() in QuizSystem.tsx
          └─> Calculates time bonus (+30 pts)
          └─> Calls onAnswer(true)

T = 10.2s: handleQuizAnswer() in App.tsx
          └─> gameStateManager.submitQuizAnswer()
          └─> GameValidation.validateQuizAnswer()
          └─> GameValidation.completeMission()
          └─> Updates: coins, badges, score, missions
          └─> Saves to localStorage

T = 10.3s: 🔥 LEADERBOARD SUBMISSION!
          └─> leaderboardService.submitScore(progress)
          └─> Prepares entry data
          └─> Sends to Supabase via REST API

T = 10.5s: Supabase receives request
          └─> Validates against RLS policies
          └─> Checks if player exists
          └─> UPDATES or INSERTS record
          └─> Returns success response

T = 10.6s: Database updated ✅
          └─> Record saved in leaderboard table
          └─> Triggers PostgreSQL change event

T = 10.7s: Real-time broadcast
          └─> Supabase sends WebSocket notification
          └─> All subscribed clients notified
          └─> Leaderboards auto-refresh

T = 11s:  Player sees "Mission Completed!" notification
          └─> Score is already in database!
```

**Total Time**: ~0.5 seconds from quiz submit to database!

---

## 🔍 Detailed Code Flow

### 1️⃣ Quiz Submission (QuizSystem.tsx)

```typescript
// Player clicks Submit button
const handleSubmit = () => {
    // Stop timer
    setIsTimerRunning(false);

    // Calculate time spent
    const timeSpent = QUIZ_TIME_LIMIT - timeRemaining; // e.g., 60 - 52 = 8s

    // Calculate bonus
    const bonus = calculateTimeBonus(timeRemaining); // +30 for 8s

    // Call parent handler
    onAnswer(isCorrect); // Triggers handleQuizAnswer in App.tsx
};
```

### 2️⃣ Answer Processing (App.tsx)

```typescript
const handleQuizAnswer = (isCorrect: boolean) => {
    // LINE 277-288: Submit to GameStateManager
    const { result, updated } = gameStateManager.current.submitQuizAnswer(
        missionId,
        selectedAnswer,
        currentQuiz.correctAnswer
    );

    // result = { isCorrect: true, points: 80, timeSpent: 8 }
    // updated = true (mission completed)

    // LINE 315-329: Record speed challenge
    if (isCorrect && result.timeSpent) {
        gameStateManager.current.recordSpeedChallenge(result.timeSpent);
        // Updates speedChallenges stats in local storage
    }

    // LINE 332-418: Handle mission completion
    if (updated) {
        const progress = gameStateManager.current.getProgress();

        // 🔥 LINE 410: SUBMIT TO LEADERBOARD!
        leaderboardService.current.submitScore(progress);

        // The rest: sounds, notifications, etc.
    }
};
```

### 3️⃣ Leaderboard Submission (LeaderboardService.ts)

```typescript
async submitScore(progress: GameProgress): Promise<boolean> {
    // LINE 50: Check if enabled
    if (!this.enabled) {
        console.log("Leaderboard disabled - skipping");
        return false;
    }

    // LINE 57-76: Prepare entry data
    const entry = {
        player_name: progress.playerName,
        level: progress.level,
        total_score: progress.totalScore,
        badges: progress.badges.length,
        coins: progress.coins,
        completed_missions: progress.completedMissions.length,
        accuracy: (progress.correctAnswers / progress.totalQuestions) * 100,
        playtime: progress.playtime,
        fastest_quiz_time: progress.fastestQuizTime,
        excellent_answers: progress.speedChallenges?.excellentAnswers || 0,
        great_answers: progress.speedChallenges?.greatAnswers || 0,
        good_answers: progress.speedChallenges?.goodAnswers || 0,
        total_collectibles: progress.totalItemsCollected || 0,
    };

    // LINE 79-85: Check if player already exists
    const { data: existing } = await supabase
        .from('leaderboard')
        .select('id, total_score')
        .eq('player_name', progress.playerName)
        .maybeSingle();

    // LINE 90-103: Update or Insert
    if (existing) {
        // Player exists - update if score is higher
        if (entry.total_score > existing.total_score) {
            await supabase
                .from('leaderboard')
                .update({ ...entry, updated_at: NOW() })
                .eq('id', existing.id);

            console.log('✅ Leaderboard updated');
        }
    } else {
        // New player - insert record
        await supabase
            .from('leaderboard')
            .insert([entry]);

        console.log('✅ New leaderboard entry created');
    }

    return true;
}
```

---

## 📊 Data Flow Diagram

```
┌──────────────────┐
│   QuizSystem     │
│   (React UI)     │
└────────┬─────────┘
         │ onAnswer(isCorrect)
         ▼
┌──────────────────┐
│   App.tsx        │
│   handleQuizAnswer│
└────────┬─────────┘
         │ submitQuizAnswer()
         ▼
┌──────────────────┐
│ GameStateManager │
│ (Local Storage)  │
└────────┬─────────┘
         │ progress updated
         ▼
┌──────────────────┐
│      App.tsx     │
│  if (updated)    │
└────────┬─────────┘
         │ submitScore(progress)
         ▼
┌──────────────────┐
│LeaderboardService│
│  (API calls)     │
└────────┬─────────┘
         │ HTTP POST/PUT
         ▼
┌──────────────────┐
│    Supabase      │
│   PostgreSQL     │
│    Database      │
└────────┬─────────┘
         │ WebSocket notification
         ▼
┌──────────────────┐
│  All Connected   │
│     Clients      │
│  (Real-time UI)  │
└──────────────────┘
```

---

## 🎮 Example Scenario

### Player "Alex" Completes Mission #1

**Initial State:**

```typescript
localStorage: {
    playerName: "Alex",
    coins: 0,
    badges: [],
    totalScore: 0
}

Database: No record for "Alex"
```

**After Quiz (8 seconds):**

```typescript
localStorage: {
    playerName: "Alex",
    coins: 20,          // +20 from mission reward
    badges: ["Eco-Kabataan"],  // +1 badge
    totalScore: 180,    // 100 mission + 50 quiz + 30 time bonus
    completedMissions: [1],
    speedChallenges: { excellentAnswers: 1 },
    fastestQuizTime: 8.0
}
```

**🔥 Immediate Database Submission:**

```sql
-- Supabase executes this INSERT
INSERT INTO leaderboard (
    player_name, level, total_score, badges, coins,
    completed_missions, accuracy, fastest_quiz_time,
    excellent_answers
) VALUES (
    'Alex', 1, 180, 1, 20,
    1, 100.00, 8.0,
    1
);

-- Result: New record created
-- Alex appears on global leaderboard!
```

---

## 🔄 Subsequent Mission Completions

### Mission #2 Completed (15 seconds)

**Current Database:**

```sql
Alex: total_score = 180
```

**After Mission #2:**

```typescript
localStorage: {
    totalScore: 350,  // 180 + 100 mission + 50 quiz + 20 great bonus
    badges: 2,
    coins: 35,
    completedMissions: [1, 2],
    fastestQuizTime: 8.0,  // Still 8s (not beaten)
    speedChallenges: {
        excellentAnswers: 1,
        greatAnswers: 1  // +1 for 15s answer
    }
}
```

**🔥 Database Update:**

```sql
-- Supabase executes this UPDATE
UPDATE leaderboard
SET
    total_score = 350,          -- Updated!
    badges = 2,                 -- Updated!
    coins = 35,                 -- Updated!
    completed_missions = 2,     -- Updated!
    great_answers = 1,          -- Updated!
    updated_at = NOW()          -- Updated!
WHERE player_name = 'Alex';

-- Result: Alex's rank may change (moved up or down)
```

---

## 🏆 Leaderboard Ranking Logic

### How Rankings Are Calculated

**Query for Overall Leaderboard:**

```sql
SELECT * FROM leaderboard
ORDER BY total_score DESC
LIMIT 100;

-- Results:
-- 1. Maria  (5420 pts) 🥇
-- 2. Juan   (5180 pts) 🥈
-- 3. Sofia  (4950 pts) 🥉
-- 4. Carlos (4600 pts)
-- ...
-- 42. Alex  (350 pts)   ← You
```

**Player's Rank:**

```typescript
// Get all players ordered by score
const allPlayers = await supabase
    .from("leaderboard")
    .select("player_name, total_score")
    .order("total_score", { ascending: false });

// Find Alex's position
const rank = allPlayers.findIndex((p) => p.player_name === "Alex");
// rank = 41 (0-indexed) → Display as #42
```

---

## 🎯 Key Points

### When Score is Submitted:

✅ **IMMEDIATELY** after mission completion  
✅ **AUTOMATICALLY** (no manual action needed)  
✅ **EVERY TIME** a mission is completed  
✅ **ONLY IF** mission completion is successful (quiz passed)

### What Triggers Submission:

1. ✅ Quiz answer is CORRECT
2. ✅ Mission is COMPLETED (not already done)
3. ✅ GameStateManager updates progress
4. ✅ `updated = true` in `submitQuizAnswer()`
5. ✅ `if (updated)` block executes in App.tsx
6. ✅ `submitScore()` is called

### What Gets Updated:

**On EVERY mission completion:**

-   Total score (increases)
-   Badges count (increases)
-   Coins (increases)
-   Completed missions (increases)
-   Accuracy (recalculated)
-   Playtime (increases)
-   Speed stats (if applicable)
-   Collectibles count (if collected)

---

## 📈 Score Update Frequency

### How Often is Database Updated?

**Per Player:**

-   **Mission Completion**: Database updated (10-20 times per playthrough)
-   **Collectible Found**: NOT submitted (only on mission complete)
-   **Level Up**: NOT submitted separately (included in mission complete)

**Example Playthrough:**

```
Mission 1 complete → Database update #1 (score: 180)
Mission 2 complete → Database update #2 (score: 350)
Mission 3 complete → Database update #3 (score: 550)
...
Mission 10 complete → Database update #10 (score: ~2000)
[Level Up to 2]
Mission 11 complete → Database update #11 (score: ~2350)
...
Mission 20 complete → Database update #20 (score: ~4500)
```

**Total Database Updates**: ~20 times per full playthrough

---

## 🔄 Real-Time Update Flow

### When Other Players See Your Score:

```
Alex completes Mission #1
         │
         ▼
Database updated (total_score = 180)
         │
         ▼
Supabase broadcasts: "leaderboard changed!"
         │
         ▼
Maria's browser receives notification
         │
         ▼
Leaderboard.tsx subscribeToLeaderboard() callback fires
         │
         ▼
loadLeaderboard() is called
         │
         ▼
Fresh data fetched from database
         │
         ▼
Maria sees Alex appear on leaderboard!
```

**Time**: < 1 second from Alex's completion to Maria seeing it!

---

## 💡 Important Notes

### Score Submission Rules:

1. **Only Updates if Higher**

    ```typescript
    if (entry.total_score > existing.total_score) {
        // Update database
    }
    ```

    - Prevents score from going down
    - Protects against accidental overwrites

2. **Graceful Fallback**

    ```typescript
    if (!this.enabled) {
        console.log("Leaderboard disabled - skipping");
        return false;
    }
    ```

    - If Supabase not configured, game still works
    - Just skips leaderboard submission
    - No errors or crashes

3. **Async Operation**
    ```typescript
    // Submission doesn't block UI
    leaderboardService.current.submitScore(progress);
    // Game continues immediately
    // Notification shows right away
    ```
    - Non-blocking (doesn't freeze game)
    - Happens in background
    - Player doesn't notice delay

---

## 🧪 Testing the Flow

### How to Verify Score Submission:

1. **Open Browser Console** (F12)
2. **Start a new game** with character name "TestPlayer"
3. **Complete Mission #1** (answer quiz correctly)
4. **Watch console logs:**

```
✅ Expected Console Output:
─────────────────────────────
Quiz submission result: { result: {...}, updated: true }
Recording speed challenge: 8 seconds
✅ Speed challenge recorded
✅ Leaderboard updated for TestPlayer  ← THIS CONFIRMS DB UPDATE!
Mission 1 completed successfully!
```

5. **Check Supabase Dashboard:**

    - Go to **Table Editor** → `leaderboard`
    - Find row where `player_name = 'TestPlayer'`
    - Verify `total_score = 180` (or similar)

6. **Open Leaderboard in Game:**
    - Click "🏆 Leaderboard" in main menu
    - See "TestPlayer" in the list
    - Your rank should be highlighted

---

## 🎮 Player Perspective

### What Player Sees:

```
1. Player talks to NPC
2. Reads mission description
3. Clicks "Start Quiz"
4. Answers question in 8 seconds
5. Clicks "Submit"
6. ⚡ Sees "Excellent! +30 time bonus!"
7. 🎉 Sees "Mission Completed!" notification
8. 💾 Score automatically saved (invisible to player)
9. 🏆 Can open leaderboard to see their rank
10. 🌍 Other players see their score within 1 second
```

**Player doesn't need to do anything!** Score submission is 100% automatic.

---

## 🔧 Developer Perspective

### Where to Monitor:

**Browser Console:**

```
✅ Leaderboard updated for Alex
✅ Speed challenge recorded for Alex
Leaderboard updated, refreshing...
```

**Supabase Dashboard:**

-   **Table Editor** → View records
-   **Logs** → See all queries
-   **API** → Monitor requests
-   **Database** → Performance stats

**Network Tab:**

```
POST https://xxxxx.supabase.co/rest/v1/leaderboard
Status: 201 Created
Response: { id: "...", player_name: "Alex", ... }
```

---

## 📊 Data Persistence

### Where is Data Stored?

**1. Local Storage (Immediate)**

```
localStorage.getItem("civika-game-progress")
└─> Saved after every mission/action
└─> Available offline
└─> Only on this device
```

**2. Supabase Database (After Mission Complete)**

```
Supabase PostgreSQL
└─> Saved after mission completion
└─> Available globally
└─> Accessible from any device
```

### Synchronization:

```
Player Device                  Supabase Cloud
─────────────                  ──────────────
[localStorage]  ──(on mission)──> [PostgreSQL]
     ↓                               ↓
   Always                      Only on mission
   updated                     completion
```

---

## 🚀 Optimization

### Why Submit After Mission (Not Real-Time)?

**Advantages:**

-   ✅ **Reduces API calls** (20 calls vs 1000+)
-   ✅ **Saves bandwidth** (less data transfer)
-   ✅ **Prevents spam** (can't flood database)
-   ✅ **More meaningful** (only milestones matter)
-   ✅ **Better UX** (no lag during gameplay)

**Alternative (Real-Time - NOT IMPLEMENTED):**

-   ❌ Submit on every coin collected
-   ❌ Submit on every movement
-   ❌ Submit every second
-   ❌ Would hit rate limits quickly!

---

## 🎯 Summary

### The Complete Flow:

```
1. Player completes quiz ✅
   └─> handleQuizAnswer() triggered

2. GameStateManager validates ✅
   └─> Updates local progress

3. Mission completion confirmed ✅
   └─> updated = true

4. Leaderboard submission ✅
   └─> leaderboardService.submitScore()

5. Supabase database updated ✅
   └─> Record inserted or updated

6. Real-time broadcast ✅
   └─> Other players notified

7. Leaderboards refresh ✅
   └─> New rankings visible globally
```

**Trigger Point**: Mission completion (quiz passed)  
**Submission Time**: ~0.5 seconds  
**Frequency**: Once per mission (20 times max per playthrough)  
**Automatic**: Yes, no manual action needed  
**Real-Time**: Yes, updates visible within 1 second

---

## 🎉 Visual Flow

```
PLAYER → QUIZ → SUBMIT → VALIDATE → COMPLETE → 🔥 DATABASE!
  ↑                                              ↓
  └──────────── LEADERBOARD UPDATES ─────────────┘
                 (Real-time broadcast)
```

---

**Last Updated**: October 10, 2025  
**Version**: 1.0.0  
**Flow Type**: Automatic on Mission Completion

---

**🏆 Your score is submitted the moment you complete a mission! ⚡**
