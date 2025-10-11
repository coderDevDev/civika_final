// PWA Icon Generator for CIVIKA
// Run: node create-pwa-icons.js

const fs = require("fs");
const path = require("path");

console.log("🎨 CIVIKA PWA Icon Generator");
console.log("================================\n");

// Check if sharp is installed
let sharp;
try {
    sharp = require("sharp");
    console.log("✅ Sharp library found");
} catch (error) {
    console.error("❌ Sharp library not found!");
    console.log("\n📦 Please install sharp first:");
    console.log("   npm install sharp\n");
    console.log("Then run this script again:");
    console.log("   node create-pwa-icons.js\n");
    process.exit(1);
}

// Configuration
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = "./public/favicon.png";
const outputDir = "./public/pwa-icons";

// Check if input file exists
if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    console.log("\n💡 Please ensure favicon.png exists in the public folder\n");
    process.exit(1);
}

console.log(`📁 Input file: ${inputFile}`);
console.log(`📁 Output directory: ${outputDir}\n`);

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Created directory: ${outputDir}\n`);
} else {
    console.log(`✅ Output directory exists\n`);
}

// Generate icons
console.log("🎨 Generating PWA icons...\n");

async function generateIcons() {
    let successCount = 0;
    let errorCount = 0;

    for (const size of sizes) {
        try {
            const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

            await sharp(inputFile)
                .resize(size, size, {
                    fit: "contain",
                    background: { r: 254, g: 243, b: 199, alpha: 1 }, // Amber background
                })
                .png()
                .toFile(outputPath);

            console.log(`✅ Created: icon-${size}x${size}.png`);
            successCount++;
        } catch (error) {
            console.error(
                `❌ Failed to create icon-${size}x${size}.png:`,
                error.message
            );
            errorCount++;
        }
    }

    console.log("\n================================");
    console.log("🎉 Icon generation complete!");
    console.log(`✅ Success: ${successCount}/${sizes.length} icons`);
    if (errorCount > 0) {
        console.log(`❌ Errors: ${errorCount}/${sizes.length} icons`);
    }
    console.log("================================\n");

    if (successCount === sizes.length) {
        console.log("🎯 Next steps:");
        console.log("1. Verify icons in public/pwa-icons/ folder");
        console.log("2. Test your PWA manifest");
        console.log("3. Deploy your app");
        console.log("4. Test installation on mobile device\n");
    } else {
        console.log(
            "⚠️ Some icons failed to generate. Please check the errors above.\n"
        );
    }
}

generateIcons().catch((error) => {
    console.error("❌ Icon generation failed:", error);
    process.exit(1);
});
