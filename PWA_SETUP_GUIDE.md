# 📱 CIVIKA PWA Setup Guide - Landscape Mobile Game

## ✅ **What I've Implemented**

Your CIVIKA game is now configured as a **Progressive Web App (PWA)** with **landscape orientation lock** for mobile devices!

---

## 📦 **Files Created/Updated**

### ✅ **1. PWA Manifest** (`public/manifest.json`)

-   App name: "CIVIKA - Civic Education Adventure"
-   Display mode: `standalone` (full-screen app)
-   Orientation: `landscape` (locked to landscape)
-   Theme color: Amber/Gold (#F59E0B)
-   Icons: Multiple sizes for different devices
-   Categories: Education, Games

### ✅ **2. Service Worker** (`public/sw.js`)

-   Offline capability
-   Cache-first strategy
-   Runtime caching
-   Auto-updates
-   Background sync support

### ✅ **3. Document Meta Tags** (`src/pages/_document.tsx`)

-   PWA meta tags
-   Apple Touch icons
-   Landscape orientation lock
-   Theme colors
-   Viewport settings

### ✅ **4. Service Worker Registration** (`src/pages/_app.tsx`)

-   Auto-registers service worker on load
-   Screen orientation lock to landscape
-   Handles orientation changes

### ✅ **5. Landscape CSS** (`src/index.css`)

-   Portrait mode warning message
-   Touch optimization
-   Full-screen layout
-   User-select disabled

### ✅ **6. Install Prompt Component** (`src/components/PWAInstallPrompt.tsx`)

-   Custom install button
-   Beautiful themed UI
-   Shows after 10 seconds
-   Dismissible with reminder

---

## 🎨 **PWA Icons - REQUIRED NEXT STEP**

You need to create PWA icons in the following sizes. I'll show you how:

### **Required Icon Sizes:**

```
public/pwa-icons/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

### **Easy Way to Create Icons:**

#### **Option 1: Use Online Tool (Recommended)**

1. Go to: https://www.pwabuilder.com/imageGenerator
2. Upload your logo/icon (square image, 512x512px minimum)
3. Click "Generate"
4. Download the icon package
5. Extract to `public/pwa-icons/` folder

#### **Option 2: Use Existing Logo**

You have `/public/favicon.png` - let me create a script to resize it:

**Create this file: `create-pwa-icons.js`**

```javascript
// Run: node create-pwa-icons.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = "./public/favicon.png";
const outputDir = "./public/pwa-icons";

// Create output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons
sizes.forEach(async (size) => {
    await sharp(inputFile)
        .resize(size, size, {
            fit: "contain",
            background: { r: 254, g: 243, b: 199, alpha: 1 }, // Amber background
        })
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));

    console.log(`✅ Created icon-${size}x${size}.png`);
});

console.log("🎉 All PWA icons created successfully!");
```

**Install sharp and run:**

```bash
npm install sharp
node create-pwa-icons.js
```

#### **Option 3: Manual Creation**

Use Photoshop/GIMP/Canva to resize your logo to each size:

-   72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

---

## 🎮 **Landscape Orientation Features**

### **1. Meta Tags** (in `_document.tsx`)

```html
<meta name="screen-orientation" content="landscape" />
<meta name="orientation" content="landscape" />
```

### **2. Manifest Setting** (in `manifest.json`)

```json
{
    "orientation": "landscape"
}
```

### **3. JavaScript Lock** (in `_app.tsx`)

```typescript
screen.orientation.lock("landscape");
```

### **4. Portrait Warning** (in `index.css`)

Shows a rotated message when device is in portrait mode:

```
"📱 Please rotate your device to landscape mode"
🔄 (rotation icon)
```

---

## 📱 **How to Install PWA**

### **On Android (Chrome/Edge):**

1. Open CIVIKA in Chrome/Edge browser
2. After 10 seconds, see "Install CIVIKA" prompt
3. Click "📥 Install Now"
4. App installs to home screen
5. Launch from home screen in landscape mode!

**OR**

1. Tap browser menu (⋮)
2. Select "Install app" or "Add to Home screen"
3. Follow prompts
4. Done! ✅

### **On iOS (Safari):**

1. Open CIVIKA in Safari
2. Tap Share button (📤)
3. Scroll down, tap "Add to Home Screen"
4. Edit name if desired
5. Tap "Add"
6. Launch from home screen in landscape mode!

### **On Desktop (Chrome/Edge):**

1. Open CIVIKA in browser
2. Look for install icon (➕) in address bar
3. Click "Install"
4. App opens in standalone window!

---

## 🎯 **PWA Features Included**

### ✅ **Offline Support**

-   Game works without internet after first load
-   Service worker caches critical assets
-   Background image, collision data cached
-   Progressive loading for assets

### ✅ **Landscape Lock**

-   Orientation locked to landscape on mobile
-   Warning message if device in portrait
-   Optimal gaming experience
-   Fullscreen gameplay

### ✅ **Install Prompt**

-   Custom themed install button
-   Shows after 10 seconds
-   Dismissible with 5-minute reminder
-   Beautiful wooden-frame UI

### ✅ **Standalone Mode**

-   Runs like native app
-   No browser UI
-   Fullscreen experience
-   Home screen icon

### ✅ **Fast Loading**

-   Service worker caching
-   Instant subsequent loads
-   Runtime caching
-   Optimized performance

---

## 🔧 **Configuration Files**

### **1. manifest.json** (Public folder)

```json
{
    "name": "CIVIKA - Civic Education Adventure",
    "short_name": "CIVIKA",
    "orientation": "landscape",
    "display": "standalone",
    "start_url": "/",
    "theme_color": "#F59E0B"
}
```

### **2. sw.js** (Service Worker - Public folder)

```javascript
const CACHE_NAME = "civika-v1.0.0";
// Caches: /, /index.html, /manifest.json, backgrounds, etc.
```

### **3. \_document.tsx** (Next.js - Pages folder)

```tsx
<meta name="screen-orientation" content="landscape" />
<link rel="manifest" href="/manifest.json" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

### **4. \_app.tsx** (Next.js - Pages folder)

```tsx
// Service worker registration
navigator.serviceWorker.register("/sw.js");

// Orientation lock
screen.orientation.lock("landscape");
```

---

## 🎨 **Visual Experience**

### **Portrait Mode (Warning Shown):**

```
┌─────────────┐
│             │
│   Device    │
│   Rotated   │
│   Portrait  │
│             │
│    📱       │
│  "Please    │  ← Rotated text
│   rotate    │     visible
│   device"   │
│    🔄       │  ← Rotation icon
│             │
└─────────────┘
```

### **Landscape Mode (Optimal):**

```
┌────────────────────────────────┐
│                                │
│   🏛️ CIVIKA Game Running      │
│   Full Landscape Experience    │
│                                │
└────────────────────────────────┘
```

---

## 🚀 **Deployment Checklist**

### **Before Deploying:**

1. ✅ Create PWA icons (see above)
2. ✅ Test manifest.json (open in browser)
3. ✅ Test service worker registration
4. ✅ Test offline mode
5. ✅ Test landscape orientation
6. ✅ Test install prompt
7. ✅ Test on real mobile device

### **Testing PWA:**

#### **1. Test Service Worker**

```
1. Open game in browser
2. Press F12 → Console
3. Look for: "✅ Service Worker registered successfully"
4. Go to Application tab → Service Workers
5. Verify service worker is active
```

#### **2. Test Offline Mode**

```
1. Open game (loads all assets)
2. Open DevTools → Network tab
3. Select "Offline"
4. Reload page
5. Game should still work! ✅
```

#### **3. Test Landscape Lock**

```
1. Open on mobile device
2. Rotate to portrait
3. See warning message ✅
4. Rotate to landscape
5. Warning disappears, game plays ✅
```

#### **4. Test Installation**

```
1. Open in Chrome/Edge on mobile
2. Wait 10 seconds
3. See "Install CIVIKA" prompt ✅
4. Click "Install Now"
5. App installs to home screen ✅
6. Launch app → Runs in landscape ✅
```

---

## 📊 **PWA Audit**

### **Check PWA Quality:**

1. Open game in Chrome
2. Press F12 → Lighthouse tab
3. Select "Progressive Web App"
4. Click "Generate report"
5. Look for green checkmarks!

**Expected Scores:**

-   ✅ Installable
-   ✅ PWA Optimized
-   ✅ Works Offline
-   ✅ Configured for landscape
-   ✅ Has icons

---

## 🎯 **What Users Will Experience**

### **First Visit (Browser):**

1. User opens CIVIKA URL
2. Game loads normally
3. After 10 seconds → Install prompt appears
4. User can install or dismiss

### **Installed PWA:**

1. User taps CIVIKA icon on home screen
2. App launches in fullscreen (no browser UI)
3. Orientation locked to landscape
4. Offline gameplay available
5. Fast loading (cached assets)

### **Portrait Mode:**

1. User rotates device to portrait
2. Warning message appears (rotated)
3. Game still playable but message shows
4. Encourages landscape mode

---

## 🔄 **Updating Your PWA**

When you make changes:

### **Update Version Number:**

```javascript
// In public/sw.js
const CACHE_NAME = "civika-v1.0.1"; // ← Increment version
```

### **Users Get Update:**

1. Service worker detects new version
2. Downloads updated files
3. Next time user opens app → Updated! ✅
4. Automatic seamless updates

---

## 📝 **Next Steps**

### **1. Create PWA Icons** (REQUIRED)

```bash
# Create this directory
mkdir public/pwa-icons

# Use one of the methods above to create icons
# Place all 8 icon sizes in public/pwa-icons/
```

### **2. Test on Real Device**

```
1. Deploy to Vercel/Netlify/hosting
2. Open on real mobile device
3. Test installation
4. Test landscape lock
5. Test offline mode
```

### **3. Optional: Add Screenshots**

```
Create screenshots for app stores:
- Wide: 1280x720px (landscape)
- Narrow: 720x1280px (portrait)

Place in: public/screenshots/
```

### **4. Deploy**

```bash
# Build for production
npm run build

# Deploy to Vercel (recommended for Next.js)
vercel --prod

# Or deploy to Netlify, Firebase, etc.
```

---

## 🎨 **Icon Generation Instructions**

### **Quick Method (Using Favicon):**

Create `create-pwa-icons.js`:

```javascript
const fs = require("fs");
const sharp = require("sharp");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const input = "./public/favicon.png";
const outputDir = "./public/pwa-icons";

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
    for (const size of sizes) {
        await sharp(input)
            .resize(size, size, {
                fit: "contain",
                background: { r: 254, g: 243, b: 199, alpha: 1 },
            })
            .png()
            .toFile(`${outputDir}/icon-${size}x${size}.png`);

        console.log(`✅ Created icon-${size}x${size}.png`);
    }
    console.log("🎉 All PWA icons created!");
}

generateIcons();
```

**Run:**

```bash
npm install sharp
node create-pwa-icons.js
```

---

## 🎮 **Features Summary**

| Feature             | Status      | Implementation         |
| ------------------- | ----------- | ---------------------- |
| **PWA Manifest**    | ✅ Done     | `/manifest.json`       |
| **Service Worker**  | ✅ Done     | `/sw.js`               |
| **Offline Support** | ✅ Done     | Service worker caching |
| **Landscape Lock**  | ✅ Done     | Meta tags + JS + CSS   |
| **Install Prompt**  | ✅ Done     | Custom React component |
| **Meta Tags**       | ✅ Done     | `_document.tsx`        |
| **PWA Icons**       | ⚠️ **TODO** | Need to generate icons |
| **Theme Colors**    | ✅ Done     | Amber/Gold theme       |
| **Standalone Mode** | ✅ Done     | Runs like native app   |

---

## 📱 **Expected User Experience**

### **Mobile (Android)**

1. User opens game in Chrome
2. Plays for 10 seconds
3. Sees "Install CIVIKA" prompt (bottom-right)
4. Clicks "Install Now"
5. CIVIKA icon appears on home screen
6. Launches app → **Landscape fullscreen** ✅
7. No browser UI, feels like native app!
8. Works offline after first load!

### **Mobile (iOS)**

1. User opens game in Safari
2. Taps Share → "Add to Home Screen"
3. CIVIKA icon on home screen
4. Launches app → **Landscape mode** ✅
5. Fullscreen web app experience
6. Cached for fast loading!

### **Desktop**

1. User opens game in Chrome/Edge
2. Sees install icon in address bar
3. Clicks install
4. App opens in standalone window
5. No browser chrome, dedicated window!

---

## 🔍 **Testing Your PWA**

### **1. Local Testing**

```bash
# Start dev server
npm run dev

# Open in browser
http://localhost:3000

# Check console for:
✅ Service Worker registered successfully
🔒 Screen orientation locked to landscape
```

### **2. PWA Audit**

```
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"
5. Look for green checkmarks!
```

### **3. Manifest Validator**

```
1. Open: https://manifest-validator.appspot.com/
2. Enter your deployed URL
3. Validate manifest.json
4. Fix any issues
```

### **4. Mobile Device Testing**

```
1. Deploy to Vercel/Netlify
2. Open on real mobile device
3. Test install process
4. Test landscape orientation
5. Test offline mode
6. Test fullscreen experience
```

---

## 🎨 **Customization Options**

### **Change Orientation Lock:**

```typescript
// In _app.tsx - line 24
screen.orientation.lock("landscape"); // Current
screen.orientation.lock("portrait"); // Portrait mode
screen.orientation.lock("any"); // Allow both
```

### **Change Install Prompt Timing:**

```typescript
// In PWAInstallPrompt.tsx - line 34
setTimeout(() => {
    setShowInstallPrompt(true);
}, 10000); // Change to desired milliseconds
```

### **Disable Portrait Warning:**

```css
/* In index.css - Remove lines 33-63 */
@media (orientation: portrait) and (max-width: 768px) {
    /* Remove this entire block */
}
```

---

## 📊 **Browser Support**

| Feature              | Chrome | Edge | Safari     | Firefox |
| -------------------- | ------ | ---- | ---------- | ------- |
| **Service Worker**   | ✅     | ✅   | ✅         | ✅      |
| **Manifest**         | ✅     | ✅   | ⚠️ Partial | ✅      |
| **Install Prompt**   | ✅     | ✅   | ❌         | ❌      |
| **Orientation Lock** | ✅     | ✅   | ⚠️ Partial | ✅      |
| **Offline Mode**     | ✅     | ✅   | ✅         | ✅      |
| **Standalone Mode**  | ✅     | ✅   | ✅         | ❌      |

**Best Experience:** Chrome/Edge on Android, Safari on iOS

---

## 🚀 **Quick Start (For Users)**

### **Android Instructions:**

```
1. Open CIVIKA in Chrome
2. Tap "Install" when prompted
   OR
   Tap menu (⋮) → "Install app"
3. Tap home screen icon
4. Play in landscape! 🎮
```

### **iOS Instructions:**

```
1. Open CIVIKA in Safari
2. Tap Share button (📤)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. Launch from home screen 🎮
```

---

## 💡 **Pro Tips**

1. **Deploy First**: PWA features work best on deployed URLs (HTTPS required)
2. **Test Offline**: Clear cache, go offline, reload → Should still work
3. **Update Cache**: Increment version in `sw.js` when you update
4. **Icons Matter**: Good icons = professional PWA appearance
5. **Landscape Warning**: Helps users rotate their device
6. **Service Worker**: May take 1-2 loads to fully activate

---

## 🐛 **Troubleshooting**

### **Service Worker Not Registering?**

-   Check: Service worker file at `/public/sw.js`
-   Check: HTTPS (required for PWA, except localhost)
-   Check: Console for errors
-   Clear cache and reload

### **Install Prompt Not Showing?**

-   Chrome/Edge only (not Safari)
-   Requires HTTPS (deployed site)
-   Manifest must be valid
-   All icons must exist
-   May not show if already installed

### **Landscape Lock Not Working?**

-   iOS Safari: No JS lock (use meta tags only)
-   Some browsers don't support `screen.orientation.lock`
-   Portrait warning should still show
-   Manifest orientation helps

### **Offline Mode Not Working?**

-   Visit site once to cache assets
-   Check service worker is active
-   Check Network tab → Service worker
-   Clear cache and try again

---

## ✅ **Current Status**

| Component            | Status         | Action Needed      |
| -------------------- | -------------- | ------------------ |
| **Manifest**         | ✅ Complete    | None               |
| **Service Worker**   | ✅ Complete    | None               |
| **Meta Tags**        | ✅ Complete    | None               |
| **Orientation Lock** | ✅ Complete    | None               |
| **Install Prompt**   | ✅ Complete    | None               |
| **Landscape CSS**    | ✅ Complete    | None               |
| **PWA Icons**        | ⚠️ **PENDING** | **Generate icons** |

---

## 📋 **Final Checklist**

-   [x] manifest.json created with landscape orientation
-   [x] Service worker created for offline support
-   [x] Meta tags added for PWA and landscape
-   [x] Service worker registration in \_app.tsx
-   [x] Landscape orientation lock (JS + Meta + CSS)
-   [x] Portrait mode warning CSS
-   [x] PWA install prompt component
-   [ ] **Generate PWA icons (8 sizes)** ← **DO THIS NEXT**
-   [ ] Deploy to production (Vercel/Netlify)
-   [ ] Test on real mobile device
-   [ ] Test installation process
-   [ ] Test offline functionality

---

## 🎯 **Next Steps**

### **Immediate (Required):**

1. **Generate PWA icons** using one of the methods above
2. Place icons in `public/pwa-icons/` folder
3. Verify all 8 sizes exist

### **Testing (Recommended):**

1. Run `npm run build` to test production build
2. Deploy to Vercel: `vercel --prod`
3. Test on real mobile device
4. Verify landscape lock works
5. Test install process

### **Optional Enhancements:**

1. Add splash screens for iOS
2. Add more cache strategies
3. Add update notification
4. Add app shortcuts in manifest
5. Add share target for social features

---

## 🎉 **Congratulations!**

Your CIVIKA game is now a **fully-functional PWA** with:

-   ✅ Installable on mobile devices
-   ✅ Landscape orientation lock
-   ✅ Offline gameplay support
-   ✅ Fast loading with caching
-   ✅ Native app-like experience

**Just generate the icons and you're ready to deploy!** 🚀

---

## 📚 **Additional Resources**

-   [PWA Builder](https://www.pwabuilder.com/) - Generate missing PWA assets
-   [Lighthouse PWA](https://developer.chrome.com/docs/lighthouse/pwa/) - Test PWA quality
-   [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) - Comprehensive docs
-   [Web.dev PWA](https://web.dev/progressive-web-apps/) - Best practices

---

**Your CIVIKA game is now PWA-ready for landscape mobile gaming!** 📱🎮✨
