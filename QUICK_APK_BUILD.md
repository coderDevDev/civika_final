# 🚀 Quick APK Build - CIVIKA

**TL;DR** - Build your Android APK in 5 steps!

---

## ⚡ **Prerequisites** (Install Once)

1. **Java JDK 17**: [Download](https://adoptium.net/)
2. **Android Studio**: [Download](https://developer.android.com/studio)
3. **Environment Variables** (Windows):
    ```
    JAVA_HOME = C:\Program Files\Java\jdk-17
    ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
    ```
    _(Restart terminal after setting)_

---

## 🏗️ **Build Steps**

### **First Time Setup** (Run Once)

```bash
# 1. Install dependencies
npm install

# 2. Initialize Capacitor
npx cap init CIVIKA com.civika.game --web-dir=dist

# 3. Add Android platform
npx cap add android
```

---

### **Build Debug APK** (Every Time)

```bash
# One command to build everything!
npm run mobile:build:android
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

---

### **Build Release APK** (For Distribution)

```bash
# Build production APK
npm run mobile:build:android:release
```

**Output:** `android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 📱 **Install on Device**

### **Method 1: USB**

```bash
# Connect phone via USB
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### **Method 2: File Transfer**

1. Copy `app-debug.apk` to phone
2. Open file and install
3. Allow "Unknown Sources" if prompted

---

## 🐛 **Troubleshooting**

| Problem                 | Solution                                   |
| ----------------------- | ------------------------------------------ |
| `JAVA_HOME not set`     | Set environment variable, restart terminal |
| `Android SDK not found` | Set `ANDROID_HOME`, restart terminal       |
| `gradlew not found`     | Run from project root, use `.\gradlew`     |
| `dist folder missing`   | Run `npm run build` first                  |
| Build fails             | Try `cd android && .\gradlew clean`        |

---

## 📋 **All Available Commands**

```bash
# Build commands
npm run mobile:build:android          # Debug APK
npm run mobile:build:android:release  # Release APK

# Utility commands
npm run build                         # Build Next.js only
npm run mobile:sync                   # Sync to Capacitor
npm run mobile:open:android          # Open Android Studio

# Manual build
cd android
.\gradlew assembleDebug              # Debug
.\gradlew assembleRelease            # Release
cd ..
```

---

## ✅ **Success Checklist**

-   [ ] Java JDK 17 installed
-   [ ] Android Studio installed
-   [ ] Environment variables set
-   [ ] Terminal restarted
-   [ ] `npm install` completed
-   [ ] Capacitor initialized
-   [ ] Android platform added
-   [ ] APK built successfully
-   [ ] APK installs on device
-   [ ] Game runs correctly

---

## 🎯 **Expected Result**

**Build Time**: ~5-10 minutes (first build)
**APK Size**: ~50-100 MB
**Location**: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📖 **Need More Details?**

See **`APK_BUILD_GUIDE.md`** for comprehensive instructions, signing, and Google Play submission.

---

**Ready to build!** 🎮📱✨
