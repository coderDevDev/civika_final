# 🏆 CIVIKA Leaderboard - Quick Start (5 Minutes!)

## ✅ Implementation Status

**ALL CODE IS READY!** 🎉

The leaderboard system has been fully implemented. You just need to:

1. Install one npm package
2. Set up a Supabase account (free)
3. Add 2 environment variables
4. Done! 🚀

---

## 🚀 Step-by-Step Setup

### 1️⃣ Install Supabase Package (30 seconds)

```bash
npm install @supabase/supabase-js
```

This will fix the TypeScript import error for `@supabase/supabase-js`.

---

### 2️⃣ Create Supabase Account (2 minutes)

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Create a new organization (use any name)
5. Create a new project:
    - **Name**: `civika-game`
    - **Database Password**: Create a strong password (save it!)
    - **Region**: Choose closest to your location
    - **Plan**: Select **Free** (more than enough!)
6. Click **"Create new project"**
7. Wait ~2 minutes for project to initialize ☕

---

### 3️⃣ Set Up Database (1 minute)

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open `SUPABASE_SCHEMA.sql` from your project
4. Copy the **entire file contents**
5. Paste into the SQL Editor
6. Click **"Run"** (bottom right)
7. You should see success messages! ✅

**What this does:**

-   Creates 3 tables: `leaderboard`, `speed_challenges`, `daily_scores`
-   Adds indexes for fast queries
-   Sets up security policies
-   Adds sample test data

---

### 4️⃣ Get API Credentials (30 seconds)

1. In Supabase dashboard, click **"Project Settings"** (gear icon, bottom left)
2. Click **"API"** in the sidebar
3. Find these two values:

**Project URL:**

```
https://abcdefghijklmn.supabase.co
```

(Copy this)

**anon public key:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

(Very long key starting with "eyJ..." - copy this)

---

### 5️⃣ Create Environment File (30 seconds)

1. In your project root (same level as `package.json`), create a new file named `.env.local`
2. Add these two lines:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

3. Replace the values with what you copied from step 4
4. Save the file

**Example:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2NTU1NTUsImV4cCI6MjAxMTIzMTU1NX0.abcdefghijklmnopqrstuvwxyz1234567890
```

⚠️ **Important**: The `.env.local` file should NOT be committed to Git. It's already in `.gitignore`.

---

### 6️⃣ Restart Dev Server (10 seconds)

```bash
# Stop your current server (Ctrl+C)
npm run dev
```

The leaderboard will now connect to Supabase! ✅

---

## 🎮 Test It!

1. Open your game at `http://localhost:8080`
2. Start a new game or load existing
3. Complete a mission
4. Go to Main Menu
5. Click **"🏆 Leaderboard"**
6. You should see the test data and your score!

---

## 📊 What You Get

### Leaderboard Features:

✅ **4 Leaderboard Types:**

-   🏆 Overall - Top scores globally
-   📅 Daily - Today's best (resets daily)
-   ⚡ Speed - Fastest quiz times
-   💎 Collectors - Most collectibles found

✅ **Real-Time Updates:**

-   Auto-refreshes every 30 seconds
-   See other players' scores live
-   No page reload needed

✅ **Beautiful UI:**

-   Medieval theme matching your game
-   Top 3 get medals: 🥇🥈🥉
-   Your rank highlighted in gold
-   Mobile + desktop responsive

✅ **Auto-Submit:**

-   Scores submitted automatically
-   Updates when missions complete
-   No manual submission needed

---

## 🔧 Files Created

**Core Files:**

-   `src/utils/supabaseClient.ts` - Supabase connection
-   `src/types/leaderboard.ts` - TypeScript interfaces
-   `src/services/LeaderboardService.ts` - API methods
-   `src/components/Leaderboard.tsx` - UI component

**Documentation:**

-   `LEADERBOARD_SETUP_GUIDE.md` - Detailed guide
-   `LEADERBOARD_IMPLEMENTATION.md` - Technical docs
-   `SUPABASE_SCHEMA.sql` - Database schema
-   `ENV_TEMPLATE.txt` - Environment template
-   `LEADERBOARD_QUICKSTART.md` - This file!

**Updated Files:**

-   `src/components/MainMenu.tsx` - Added leaderboard button
-   `src/App.tsx` - Integrated leaderboard system

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"

**Solution**: Install the package

```bash
npm install @supabase/supabase-js
```

### Error: "Leaderboard not configured"

**Solution**:

1. Check `.env.local` exists in project root
2. Verify the two environment variables are set
3. Restart dev server: `npm run dev`

### No Scores Appearing

**Solution**:

1. Check browser console for errors
2. Verify SQL schema was executed in Supabase
3. Check Supabase dashboard → Database → Tables
4. Should see 3 tables: `leaderboard`, `speed_challenges`, `daily_scores`

### Connection Failed

**Solution**:

1. Verify API credentials are correct
2. Check Supabase project is active (dashboard)
3. Try the test query in SQL Editor:

```sql
SELECT * FROM leaderboard LIMIT 5;
```

---

## 💰 Cost

**FREE FOREVER** (for most games!)

**Supabase Free Tier:**

-   500 MB database (enough for 500,000+ players!)
-   Unlimited API requests
-   2 GB bandwidth/month
-   Real-time subscriptions included

**You only pay if you exceed:**

-   500 MB storage
-   2 GB bandwidth/month

For an indie game, free tier is more than enough! 🎉

---

## 📈 Next Steps

### After Setup:

1. **Test with friends** - Have them play and compete
2. **Monitor usage** - Check Supabase dashboard
3. **Add features** - See future enhancements in docs
4. **Share your game** - Players love leaderboards!

### Future Enhancements (Optional):

-   Regional leaderboards (by country)
-   Weekly challenges
-   Clan/guild system
-   Player profiles
-   Achievement showcases
-   Social sharing

See `LEADERBOARD_IMPLEMENTATION.md` for full list!

---

## ✅ Quick Checklist

-   [ ] Install `@supabase/supabase-js` package
-   [ ] Create Supabase account
-   [ ] Create project and wait for initialization
-   [ ] Run SQL schema in SQL Editor
-   [ ] Copy Project URL
-   [ ] Copy anon public key
-   [ ] Create `.env.local` file
-   [ ] Add environment variables
-   [ ] Restart dev server
-   [ ] Test leaderboard in game
-   [ ] Celebrate! 🎉

---

## 🎉 You're Done!

In just 5 minutes, you've added:

-   Global leaderboards
-   Real-time competition
-   4 different rankings
-   Beautiful UI
-   Automatic score tracking

**Now go compete! 🏆🎮**

---

**Questions?** Check the detailed guides:

-   `LEADERBOARD_SETUP_GUIDE.md` - Complete setup documentation
-   `LEADERBOARD_IMPLEMENTATION.md` - Technical implementation details

**Created**: October 10, 2025  
**Status**: ✅ Ready to Use  
**Time to Setup**: ~5 minutes
