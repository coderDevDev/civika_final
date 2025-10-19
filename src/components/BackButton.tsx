import { useState } from "react";

interface BackButtonProps {
    onBack: () => void;
    label?: string;
    position?: "top-left" | "top-right" | "bottom-left";
    variant?: "primary" | "secondary" | "minimal";
    confirmMessage?: string; // If provided, shows confirmation dialog
    className?: string;
}

export function BackButton({
    onBack,
    label = "Back",
    position = "top-left",
    variant = "primary",
    confirmMessage,
    className = "",
}: BackButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleClick = () => {
        if (confirmMessage) {
            setShowConfirm(true);
        } else {
            onBack();
        }
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        onBack();
    };

    const handleCancel = () => {
        setShowConfirm(false);
    };

    const positionClasses = {
        "top-left": "top-4 left-4",
        "top-right": "top-4 right-4",
        "bottom-left": "bottom-4 left-4",
    };

    const variantClasses = {
        primary:
            "bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md game-button-frame",
        secondary:
            "bg-stone-500 hover:bg-stone-600 text-white font-bold rounded-lg shadow-md game-button-frame",
        minimal:
            "bg-white/90 hover:bg-white text-gray-800 border-2 border-gray-300 font-bold rounded-lg shadow-md game-button-frame",
    };

    return (
        <>
            <button
                onClick={handleClick}
                className={`
                    fixed ${positionClasses[position]} z-50
                    ${variantClasses[variant]}
                    px-4 py-2 rounded-lg font-bold
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                    flex items-center gap-2
                    ${className}
                `}
                aria-label={label}
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                <span className="hidden sm:inline">{label}</span>
            </button>

            {/* Confirmation Dialog */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
                    <div className="wooden-frame rounded-lg p-3 sm:p-4 max-w-md mx-2 animate-scaleIn">
                        {/* Metal corners */}
                        <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tl-lg z-10" />
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tr-lg z-10" />
                        <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-bl-lg z-10" />
                        <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-br-lg z-10" />

                        {/* Parchment content */}
                        <div className="parchment-bg rounded-md p-4 sm:p-6 relative">
                            <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-4 game-element-border rounded-md py-2 px-3 text-center">
                                ⚠️ Confirm Action
                            </h3>
                            <p className="text-amber-800 mb-6 text-sm sm:text-base text-center">{confirmMessage}</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 sm:px-6 sm:py-3 bg-stone-600 hover:bg-stone-700 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 border-2 border-stone-800 text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="px-4 py-2 sm:px-6 sm:py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg transition-all duration-200 hover:scale-105 border-2 border-red-900 text-sm sm:text-base"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
