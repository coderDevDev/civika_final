import React, { useState, useEffect } from "react";

export const LandscapePrompt: React.FC = () => {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            // Check if device is mobile/tablet
            const isMobile = window.innerWidth <= 1024;

            // Check if in portrait mode
            const isPortraitMode = window.innerHeight > window.innerWidth;

            // Show overlay only on mobile devices in portrait mode
            setIsPortrait(isMobile && isPortraitMode);

            console.log("📱 Orientation check:", {
                isMobile,
                isPortraitMode,
                width: window.innerWidth,
                height: window.innerHeight,
                showOverlay: isMobile && isPortraitMode,
            });
        };

        // Check on mount
        checkOrientation();

        // Listen for orientation changes
        window.addEventListener("resize", checkOrientation);
        window.addEventListener("orientationchange", checkOrientation);

        return () => {
            window.removeEventListener("resize", checkOrientation);
            window.removeEventListener("orientationchange", checkOrientation);
        };
    }, []);

    // Don't show overlay if in landscape mode
    if (!isPortrait) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[99999] bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-32 w-24 h-24 bg-white rounded-full animate-pulse delay-2000"></div>
                <div className="absolute bottom-40 right-10 w-14 h-14 bg-white rounded-full animate-pulse delay-500"></div>
            </div>

            {/* Main content */}
            <div className="relative text-center px-6 py-8 max-w-sm">
                {/* CIVIKA Logo */}
                <div className="mb-6">
                    <img
                        src="/logo.png"
                        alt="CIVIKA Logo"
                        className="w-20 h-20 mx-auto drop-shadow-2xl animate-pulse"
                    />
                </div>

                {/* Rotating phone icon */}
                <div className="mb-8 animate-bounce">
                    <div className="inline-block text-6xl transform rotate-90 animate-pulse">
                        📱
                    </div>
                </div>

                {/* Rotation arrows animation */}
                <div className="mb-6 flex justify-center items-center space-x-4">
                    <div className="text-6xl animate-spin-slow">🔄</div>
                </div>

                {/* Message */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border-4 border-white">
                    <h1 className="text-3xl font-black text-amber-900 mb-4 drop-shadow-lg">
                        CIVIKA
                    </h1>

                    <p className="text-xl font-bold text-amber-800 mb-3">
                        Please Rotate Your Device
                    </p>

                    <p className="text-base text-amber-700 mb-4 leading-relaxed">
                        For the best gaming experience, please rotate your phone
                        to
                        <span className="font-bold text-orange-600">
                            {" "}
                            landscape mode
                        </span>
                    </p>

                    {/* Visual rotation instruction */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="text-4xl">📱</div>
                        <div className="text-3xl animate-pulse">→</div>
                        <div className="text-4xl transform rotate-90">📱</div>
                    </div>

                    <div className="text-sm text-amber-600 font-semibold bg-amber-50 rounded-lg p-3 border-2 border-amber-200">
                        💡 Turn your device sideways to continue
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="mt-6 text-white/80 text-sm font-medium">
                    <p>Optimized for landscape gameplay</p>
                </div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                .delay-500 {
                    animation-delay: 0.5s;
                }
                .delay-1000 {
                    animation-delay: 1s;
                }
                .delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};
