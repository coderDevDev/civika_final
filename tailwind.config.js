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
        },
    },
    plugins: [],
};
