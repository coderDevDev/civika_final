/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: "dist",

    // Ignore TypeScript and ESLint errors during build
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Exclude game-modal-ui folder from build (it's a separate demo project)
    webpack: (config) => {
        config.watchOptions = {
            ...config.watchOptions,
            ignored: ["**/src/game-modal-ui/**"],
        };
        return config;
    },
};

export default nextConfig;

