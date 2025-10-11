# 🎨 CIVIKA Font Usage Guide

## ✅ **Installed Fonts**

### **Montserrat** (Primary Branding Font)

-   **Weights**: 400, 500, 600, 700, 800, 900
-   **Use For**: Titles, headings, logo text, buttons
-   **Character**: Professional, modern, authoritative

### **Inter** (Body Font)

-   **Weights**: 400, 500, 600
-   **Use For**: Body text, descriptions, UI labels
-   **Character**: Clean, readable, friendly

---

## 🎯 **Tailwind Classes Available**

```tsx
// Display Text (Montserrat - for main titles/logo)
className = "font-display font-black text-4xl"; // 900 weight
className = "font-display font-extrabold text-3xl"; // 800 weight
className = "font-display font-bold text-2xl"; // 700 weight

// Heading Text (Montserrat - for section headers)
className = "font-heading font-bold text-xl"; // 700 weight
className = "font-heading font-semibold text-lg"; // 600 weight

// Body Text (Inter - for descriptions)
className = "font-body text-base"; // 400 weight
className = "font-body font-medium text-sm"; // 500 weight

// Default (Inter)
className = "text-base"; // Uses Inter by default
```

---

## 📝 **Usage Examples**

### **1. Main Logo / Game Title**

```tsx
<h1 className="font-display font-black text-5xl text-amber-900">CIVIKA</h1>
```

### **2. Subtitle**

```tsx
<p className="font-display font-semibold text-lg text-amber-700">
    Civic Engagement Educational Game
</p>
```

### **3. Section Headers**

```tsx
<h2 className="font-heading font-bold text-2xl text-amber-800">Quest Log</h2>
```

### **4. Buttons**

```tsx
<button className="font-heading font-bold text-white">Start Game</button>
```

### **5. Body Text**

```tsx
<p className="font-body text-base text-gray-700">
    Welcome to the barangay! You're about to embark on an exciting journey...
</p>
```

### **6. UI Labels**

```tsx
<span className="font-body font-medium text-sm text-amber-600">Coins: 100</span>
```

---

## 🎨 **Component-Specific Recommendations**

### **MainMenu.tsx**

```tsx
// Title
<h1 className="font-display font-black text-6xl md:text-7xl text-amber-900">
    CIVIKA
</h1>

// Subtitle
<p className="font-display font-semibold text-xl text-amber-700">
    Civic Engagement Educational Game
</p>

// Buttons
<button className="font-heading font-bold text-lg">
    Start Game
</button>
```

### **Credits.tsx**

```tsx
// Header
<h2 className="font-display font-bold text-3xl text-amber-900">
    Credits
</h2>

// Section titles
<h3 className="font-heading font-bold text-xl text-amber-800">
    Development Team
</h3>

// Descriptions
<p className="font-body text-sm text-amber-600">
    Game mechanics and educational content design
</p>
```

### **CharacterCreation.tsx**

```tsx
// Title
<h1 className="font-display font-black text-3xl text-amber-400">
    Create Your Character
</h1>

// Labels
<label className="font-body font-medium text-sm text-amber-700">
    Enter Your Name
</label>
```

### **Quest Log / Modals**

```tsx
// Modal Title
<h2 className="font-heading font-bold text-2xl text-amber-900">
    📋 Quest Log
</h2>

// Quest descriptions
<p className="font-body text-base text-amber-700">
    Complete 10 barangay missions to unlock city government...
</p>
```

---

## 🚀 **Quick Migration**

### **Replace These:**

```tsx
// ❌ OLD (Generic fonts)
className = "text-2xl font-bold";
className = "text-lg font-semibold";
className = "text-base";

// ✅ NEW (Branded fonts)
className = "font-display font-bold text-2xl"; // For titles
className = "font-heading font-semibold text-lg"; // For headers
className = "font-body text-base"; // For descriptions
```

---

## 💡 **Font Weight Guide**

### **Montserrat Weights**

-   **400 (Regular)**: Light body text, subtle elements
-   **500 (Medium)**: UI labels, secondary text
-   **600 (SemiBold)**: Subheadings, important labels
-   **700 (Bold)**: Section headers, buttons
-   **800 (ExtraBold)**: Main titles, emphasis
-   **900 (Black)**: Logo, game title, hero text

### **Inter Weights**

-   **400 (Regular)**: Body text, descriptions
-   **500 (Medium)**: Emphasized body text, UI labels
-   **600 (SemiBold)**: Important UI elements

---

## 🎨 **Typography Scale**

```tsx
// Hero / Logo
font-display font-black text-6xl md:text-7xl lg:text-8xl

// Page Title
font-display font-bold text-4xl md:text-5xl

// Section Header
font-heading font-bold text-2xl md:text-3xl

// Card Title
font-heading font-semibold text-xl

// Button Text
font-heading font-bold text-base md:text-lg

// Body Text
font-body text-base

// Small Text / Labels
font-body text-sm font-medium

// Tiny Text
font-body text-xs
```

---

## 🌟 **Best Practices**

1. ✅ **Use `font-display`** for all main titles and logo text
2. ✅ **Use `font-heading`** for section headers and buttons
3. ✅ **Use `font-body`** for descriptions and body text
4. ✅ **Combine font families** with appropriate weights
5. ✅ **Maintain consistency** across similar elements
6. ✅ **Use responsive sizing** (text-base md:text-lg lg:text-xl)

---

## 🔧 **Testing Your Fonts**

After adding Montserrat, test it works:

1. **Open your game** in the browser
2. **Inspect any title** (right-click → Inspect)
3. **Check Computed tab** - should show "Montserrat" as font-family
4. If it shows "Arial" or generic fonts, clear cache and refresh

---

## 📱 **Performance Tips**

-   ✅ **Preconnect**: Already added to `_document.tsx`
-   ✅ **Font Display Swap**: Included in Google Fonts URL
-   ✅ **Limited Weights**: Only loading what we need (400-900)
-   ✅ **Subset**: Latin characters only (default)

---

## 🎯 **Quick Start**

Update your main components:

```bash
# Update these files with new font classes:
1. src/components/MainMenu.tsx - Use font-display font-black
2. src/components/Credits.tsx - Use font-heading for headers
3. src/components/CharacterCreation.tsx - Use font-display for title
4. src/App.tsx - Use font-heading for menu items
5. Other modals - Use font-heading for titles
```

---

## 🏆 **Result**

Your CIVIKA game will have:

-   ✅ **Professional typography** matching civic/government theme
-   ✅ **Consistent branding** across all components
-   ✅ **Improved readability** with proper font hierarchy
-   ✅ **Modern appearance** with Montserrat's clean lines
-   ✅ **Fast loading** with optimized Google Fonts

Ready to use! 🎮✨
