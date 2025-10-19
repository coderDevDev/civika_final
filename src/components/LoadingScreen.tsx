import { useEffect, useState } from "react";

interface LoadingScreenProps {
    progress: number; // 0-100
    onComplete?: () => void;
}

const civicTips = [
    "💡 The barangay is the smallest administrative unit in the Philippines.",
    "🗳️ Voting is your right and responsibility as a Filipino citizen.",
    "🌱 Community service strengthens our society and builds character.",
    "📚 Understanding local government helps you become an active citizen.",
    "🤝 Barangay officials are elected every three years to serve the community.",
    "🏛️ Civic engagement means participating in activities that shape your community.",
    "♻️ Proper waste segregation is everyone's responsibility.",
    "👥 Community meetings are where democracy happens at the grassroots level.",
    "📖 The Philippine Constitution guarantees your rights and freedoms.",
    "🌟 Every Filipino has the power to make a difference in their community.",
];

export function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    // Rotate tips every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setCurrentTipIndex((prev) => (prev + 1) % civicTips.length);
                setFadeIn(true);
            }, 300);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Call onComplete when loading is done
    useEffect(() => {
        if (progress >= 100 && onComplete) {
            const timer = setTimeout(() => {
                onComplete();
            }, 500); // Small delay for smooth transition
            return () => clearTimeout(timer);
        }
    }, [progress, onComplete]);

    return (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-16 h-16 bg-amber-400/30 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-32 w-12 h-12 bg-orange-400/30 rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-40 right-20 w-20 h-20 bg-yellow-400/30 rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-20 left-40 w-14 h-14 bg-amber-500/30 rounded-full animate-pulse delay-500"></div>
            </div>

            {/* Main wooden frame container */}
            <div className="relative z-10 w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-4">
                <div className="wooden-frame rounded-lg p-4 sm:p-6">
                    {/* Metal corners */}
                    <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-tl-lg z-10" />
                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-tr-lg z-10" />
                    <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-bl-lg z-10" />
                    <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 metal-corner rounded-br-lg z-10" />

                    {/* Parchment content */}
                    <div className="parchment-bg rounded-md p-6 sm:p-8 md:p-10 relative">
                        {/* CIVIKA Logo with Philippine Flag Colors */}
                        <div className="mb-6 animate-pulse-slow text-center">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-2">
                                <span
                                    className="inline-block"
                                    style={{
                                        color: "#0038A8",
                                        textShadow: `
                                            -2px -2px 0px #FCD116,
                                            2px -2px 0px #FCD116,
                                            -2px 2px 0px #FCD116,
                                            2px 2px 0px #FCD116,
                                            0px 0px 15px rgba(0, 56, 168, 0.6)
                                        `,
                                        WebkitTextStroke: "2px #FCD116",
                                        filter: "drop-shadow(0 4px 8px rgba(0, 56, 168, 0.4))",
                                    }}
                                >
                                    CIV
                                </span>
                                <span
                                    className="inline-block"
                                    style={{
                                        color: "#CE1126",
                                        textShadow: `
                                            -2px -2px 0px #FCD116,
                                            2px -2px 0px #FCD116,
                                            -2px 2px 0px #FCD116,
                                            2px 2px 0px #FCD116,
                                            0px 0px 15px rgba(206, 17, 38, 0.6)
                                        `,
                                        WebkitTextStroke: "2px #FCD116",
                                        filter: "drop-shadow(0 4px 8px rgba(206, 17, 38, 0.4))",
                                    }}
                                >
                                    IKA
                                </span>
                            </h1>
                            <div className="h-1 bg-gradient-to-r from-blue-900 via-yellow-400 to-red-600 rounded-full shadow-lg mx-auto max-w-md"></div>
                        </div>

                        {/* Subtitle */}
                        <p className="text-amber-800 text-lg sm:text-xl md:text-2xl font-bold mb-8 text-center game-element-border rounded-md py-2 px-4">
                            🏛️ Learn • Engage • Lead 🏛️
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full mb-6">
                            <div className="game-element-border rounded-full h-6 overflow-hidden bg-amber-100">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                                    style={{ width: `${progress}%` }}
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                                </div>
                            </div>
                            <p className="text-amber-800 text-center mt-2 font-bold text-base sm:text-lg">
                                {progress < 100 ? `⏳ Loading... ${Math.round(progress)}%` : "✓ Ready!"}
                            </p>
                        </div>

                        {/* Civic Tips Carousel */}
                        <div
                            className={`game-element-border rounded-lg p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-yellow-50 transition-opacity duration-300 ${
                                fadeIn ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <p className="text-amber-900 text-center text-sm sm:text-base md:text-lg font-semibold leading-relaxed">
                                {civicTips[currentTipIndex]}
                            </p>
                        </div>

                        {/* Loading spinner */}
                        {progress < 100 && (
                            <div className="mt-6 flex justify-center">
                                <div className="w-8 h-8 border-4 border-amber-300 border-t-amber-700 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
