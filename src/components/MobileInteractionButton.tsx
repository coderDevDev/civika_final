import React from "react";

interface MobileInteractionButtonProps {
    onInteract: () => void;
    isVisible: boolean;
}

export const MobileInteractionButton: React.FC<
    MobileInteractionButtonProps
> = ({ onInteract, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
            <button
                onClick={onInteract}
                className="w-16 h-16 rounded-full bg-amber-500 bg-opacity-70 border-2 border-amber-600 shadow-lg flex items-center justify-center text-white font-bold text-sm hover:bg-opacity-80 active:scale-95 transition-all duration-200"
            >
                TAP
            </button>
        </div>
    );
};
