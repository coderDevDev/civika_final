# 📱 CIVIKA - Android APK Build Guide

Complete guide to building your CIVIKA game as an Android APK.

---

## ✅ **Prerequisites**

### **1. Install Required Software**

#### **Node.js & npm** (Already installed ✅)
```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
```

#### **Java Development Kit (JDK)** ⚠️ REQUIRED
- **Download**: [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#java17) or [OpenJDK 17](https://adoptium.net/)
- **Version Required**: JDK 17 (recommended for Capacitor 6)
- **Verify Installation**:
```bash
java -version
# Should show: java version "17.x.x"
```

#### **Android Studio** ⚠️ REQUIRED
- **Download**: [Android Studio](https://developer.android.com/studio)
- **Install with**:
  - Android SDK
  - Android SDK Platform Tools
  - Android SDK Build-Tools
  - Android Emulator (optional, for testing)

#### **Gradle** (Comes with Android Studio ✅)
- Automatically included with Android Studio
- Will be used via `gradlew` wrapper

---

## 🔧 **Environment Setup**

### **1. Set Environment Variables (Windows)**

Add these to your system environment variables:

```bash
# Java
JAVA_HOME = C:\Program Files\Java\jdk-17
PATH += %JAVA_HOME%\bin

# Android
ANDROID_HOME = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT = C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
PATH += %ANDROID_HOME%\platform-tools
PATH += %ANDROID_HOME%\tools
PATH += %ANDROID_HOME%\tools\bin
```

**To set environment variables:**
1. Press `Win + X` → System
2. Advanced system settings → Environment Variables
3. Add/Edit the variables above
4. **Restart your terminal** after setting variables

### **2. Verify Environment**

```bash
# Check Java
java -version

# Check Android SDK
adb version

# Check Gradle (after Android Studio installation)
gradle -version
```

---

## 📦 **Installation Steps**

### **Step 1: Install Dependencies**

```bash
# Navigate to your project
cd "C:\Users\ACER\Desktop\2025 Capstone Project\CIVIKA-FINAL"

# Install npm packages (including Capacitor)
npm install
```

This will install:
- `@capacitor/core` - Capacitor core functionality
- `@capacitor/cli` - Capacitor command-line tools
- `@capacitor/android` - Android platform support

### **Step 2: Initialize Capacitor (First Time Only)**

```bash
# Initialize Capacitor with your app details
npm run mobile:init

# When prompted, enter:
# App name: CIVIKA
# App ID: com.civika.game
# Web asset directory: dist
```

**OR** manually create if script doesn't work:

```bash
npx cap init CIVIKA com.civika.game --web-dir=dist
```

### **Step 3: Add Android Platform (First Time Only)**

```bash
# Add Android platform
npm run mobile:add:android

# OR manually:
npx cap add android
```

This creates an `android` folder with your Android project.

---

## 🏗️ **Building the APK**

### **Method 1: Using npm Scripts (Recommended)**

#### **Debug APK (For Testing)**

```bash
# Build everything and create debug APK
npm run mobile:build:android
```

This will:
1. Build your Next.js app (`next build`)
2. Sync files to Android project (`npx cap sync`)
3. Build Android debug APK (`gradlew assembleDebug`)

**Output Location:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### **Release APK (For Distribution)**

```bash
# Build production-ready APK
npm run mobile:build:android:release
```

**Output Location:**
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

### **Method 2: Step-by-Step Manual Build**

#### **Step 1: Build Next.js App**

```bash
npm run build
```

This creates the `dist` folder with your static website.

#### **Step 2: Sync to Capacitor**

```bash
npm run mobile:sync

# OR manually:
npx cap sync
```

This copies your `dist` folder to the Android project.

#### **Step 3: Build APK with Gradle**

```bash
# Navigate to android folder
cd android

# Build debug APK
.\gradlew assembleDebug

# OR build release APK
.\gradlew assembleRelease

# Return to project root
cd ..
```

---

### **Method 3: Using Android Studio (GUI)**

```bash
# Open Android project in Android Studio
npm run mobile:open:android

# OR manually:
npx cap open android
```

**In Android Studio:**
1. Wait for Gradle sync to complete
2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete
4. Click "locate" link in notification to find APK

---

## 📲 **Testing Your APK**

### **Option 1: Android Emulator**

1. **Open Android Studio**
2. **Device Manager** → Create Virtual Device
3. Choose a device (e.g., Pixel 5)
4. Download system image (Android 11+)
5. **Install APK**:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### **Option 2: Physical Device**

1. **Enable Developer Options** on your Android device:
   - Settings → About Phone → Tap "Build Number" 7 times
2. **Enable USB Debugging**:
   - Settings → Developer Options → USB Debugging
3. **Connect device** via USB
4. **Verify connection**:
```bash
adb devices
# Should show your device
```
5. **Install APK**:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### **Option 3: File Transfer**

1. Copy APK to your phone via USB or cloud storage
2. Open file on phone
3. Allow "Install from unknown sources" if prompted
4. Install and run

---

## 🔐 **Signing Release APK (For Google Play)**

### **Step 1: Generate Keystore**

```bash
# Navigate to android/app
cd android/app

# Generate keystore
keytool -genkey -v -keystore civika-release-key.keystore -alias civika -keyalg RSA -keysize 2048 -validity 10000

# Enter password and details when prompted
```

### **Step 2: Configure Signing**

Create `android/key.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=civika
storeFile=civika-release-key.keystore
```

### **Step 3: Update build.gradle**

Edit `android/app/build.gradle`:

```gradle
// Add before android block
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing config ...

    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### **Step 4: Build Signed APK**

```bash
npm run mobile:build:android:release
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk` (Signed)

---

## 🎨 **Customizing Your APK**

### **1. App Icon**

Replace icons in:
```
android/app/src/main/res/
  ├── mipmap-hdpi/ic_launcher.png (72x72)
  ├── mipmap-mdpi/ic_launcher.png (48x48)
  ├── mipmap-xhdpi/ic_launcher.png (96x96)
  ├── mipmap-xxhdpi/ic_launcher.png (144x144)
  └── mipmap-xxxhdpi/ic_launcher.png (192x192)
```

**Use your logo.png** to generate icons:
- Online tool: [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
- Upload your `logo.png`
- Download and replace icons

### **2. App Name**

Edit `android/app/src/main/res/values/strings.xml`:

```xml
<resources>
    <string name="app_name">CIVIKA</string>
    <string name="title_activity_main">CIVIKA</string>
    <string name="package_name">com.civika.game</string>
    <string name="custom_url_scheme">com.civika.game</string>
</resources>
```

### **3. Splash Screen**

Replace `android/app/src/main/res/drawable/splash.png` with your custom splash screen.

### **4. Version & Build Number**

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        versionCode 1          // Increment for each release
        versionName "1.0.0"    // Your version number
    }
}
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "JAVA_HOME not set"**

**Solution:**
```bash
# Set JAVA_HOME in Windows
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
# Restart terminal
```

### **Issue 2: "Android SDK not found"**

**Solution:**
```bash
# Set ANDROID_HOME
setx ANDROID_HOME "C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk"
# Restart terminal
```

### **Issue 3: "Gradle build failed"**

**Solution:**
```bash
# Clean and rebuild
cd android
.\gradlew clean
.\gradlew assembleDebug
```

### **Issue 4: "Cannot find 'dist' directory"**

**Solution:**
```bash
# Make sure to build first
npm run build
# Then sync
npm run mobile:sync
```

### **Issue 5: "Permission denied" on gradlew**

**Solution (Windows):**
```bash
# Use .\gradlew instead of ./gradlew
cd android
.\gradlew assembleDebug
```

### **Issue 6: APK won't install on device**

**Solution:**
- Enable "Install from Unknown Sources" in device settings
- Check if an older version is installed and uninstall it first
- Ensure APK is not corrupted (re-download/re-build)

---

## 📋 **Quick Reference - All Commands**

```bash
# First-time setup
npm install
npm run mobile:init
npm run mobile:add:android

# Regular build workflow
npm run mobile:build:android              # Debug APK
npm run mobile:build:android:release      # Release APK

# Manual workflow
npm run build                             # Build Next.js
npm run mobile:sync                       # Sync to Capacitor
cd android && .\gradlew assembleDebug    # Build APK

# Utilities
npm run mobile:open:android              # Open in Android Studio
adb devices                              # Check connected devices
adb install path/to/app.apk            # Install on device
```

---

## 📂 **Project Structure**

```
CIVIKA-FINAL/
├── android/                          # Android native project
│   ├── app/
│   │   └── build/outputs/apk/       # Built APKs here
│   │       ├── debug/
│   │       │   └── app-debug.apk
│   │       └── release/
│   │           └── app-release.apk
│   └── build.gradle
├── dist/                             # Next.js build output
├── src/                              # Your game source code
├── public/                           # Static assets
├── capacitor.config.json             # Capacitor config
├── next.config.mjs                   # Next.js config (export mode)
└── package.json                      # Build scripts
```

---

## 🚀 **Deployment Checklist**

Before distributing your APK:

- [ ] Build with release configuration
- [ ] Test on multiple devices
- [ ] Test landscape orientation lock
- [ ] Test PWA features (offline, etc.)
- [ ] Test all game features
- [ ] Sign APK with keystore
- [ ] Update version number
- [ ] Generate app icons (all sizes)
- [ ] Test APK installation
- [ ] Check file size (optimize if needed)

---

## 📊 **Expected Output**

**Debug APK:**
- **Location**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Size**: ~50-100 MB (depending on assets)
- **Use**: Testing only, not for distribution

**Release APK:**
- **Location**: `android/app/build/outputs/apk/release/app-release.apk`
- **Size**: ~50-100 MB (optimized)
- **Use**: Distribution, Google Play submission

---

## 🎯 **Next Steps After Building APK**

1. **Test thoroughly** on physical devices
2. **Optimize performance** if needed
3. **Prepare store assets**:
   - Screenshots (phone & tablet)
   - Feature graphic
   - App description
   - Privacy policy
4. **Submit to Google Play Store**:
   - Create developer account
   - Upload APK/AAB
   - Fill in store listing
   - Set pricing & distribution

---

## 💡 **Tips for Success**

1. ✅ **Always test debug APK** before building release
2. ✅ **Keep your keystore safe** - you can't update the app without it
3. ✅ **Backup key.properties** - store it securely
4. ✅ **Increment version code** for each release
5. ✅ **Test on low-end devices** - ensure performance
6. ✅ **Check APK size** - optimize assets if too large
7. ✅ **Use Android Studio** for debugging issues

---

## 🏆 **Success Indicators**

You've successfully built your APK when:
- ✅ Build completes without errors
- ✅ APK file exists in output folder
- ✅ APK installs on device
- ✅ App opens in landscape mode
- ✅ All game features work
- ✅ No crashes or errors

---

## 📞 **Need Help?**

- **Capacitor Docs**: https://capacitorjs.com/docs/android
- **Android Studio**: https://developer.android.com/studio/build
- **Gradle**: https://docs.gradle.org/

---

Ready to build your CIVIKA APK! 🎮📱✨

