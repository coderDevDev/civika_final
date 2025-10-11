/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                "civika-green": "#2c5530",
                "civika-gold": "#FFD700",
                "civika-brown": "#8B4513",
            },
            fontFamily: {
                display: ["Montserrat", "sans-serif"], // For titles and logos
                heading: ["Montserrat", "sans-serif"], // For headings
                body: ["Inter", "sans-serif"], // For body text
                sans: ["Inter", "sans-serif"], // Default sans-serif
            },
        },
    },
    plugins: [],
};
