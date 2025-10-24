import React from "react";

export interface NotificationData {
    type: "success" | "warning" | "info" | "error";
    title: string;
    message: string;
    icon?: string;
    actions?: Array<{
        label: string;
        action: () => void;
        style?: "primary" | "secondary" | "danger";
    }>;
}

interface GameNotificationProps {
    notification: NotificationData | null;
    onClose: () => void;
    isVisible: boolean;
}

export const GameNotification: React.FC<GameNotificationProps> = ({
    notification,
    onClose,
    isVisible,
}) => {
    if (!notification || !isVisible) {
        return null;
    }

    const getTypeStyles = () => {
        switch (notification.type) {
            case "success":
                return {
                    border: "border-amber-600",
                    icon: notification.icon || "🎉",
                    titleColor: "text-amber-900",
                    messageColor: "text-amber-200",
                };
            case "warning":
                return {
                    border: "border-amber-600",
                    icon: notification.icon || "⚠️",
                    titleColor: "text-orange-900",
                    messageColor: "text-amber-200",
                };
            case "info":
                return {
                    border: "border-amber-600",
                    icon: notification.icon || "ℹ️",
                    titleColor: "text-amber-900",
                    messageColor: "text-amber-200",
                };
            case "error":
                return {
                    border: "border-amber-700",
                    icon: notification.icon || "❌",
                    titleColor: "text-amber-900",
                    messageColor: "text-amber-200",
                };
            default:
                return {
                    border: "border-amber-600",
                    icon: notification.icon || "💬",
                    titleColor: "text-amber-900",
                    messageColor: "text-amber-200",
                };
        }
    };

    const getButtonStyles = (style?: string) => {
        switch (style) {
            case "primary":
                return "game-button-frame text-white hover:scale-105 game-glow";
            case "danger":
                return "bg-red-700 hover:bg-red-800 text-white border-2 border-red-900";
            case "secondary":
            default:
                return "bg-stone-600 hover:bg-stone-700 text-white border-2 border-stone-800";
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-2 sm:p-4">
            <div
                className={`wooden-frame rounded-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto medieval-scrollbar ${styles.border} border-2`}
            >
                {/* Metal corners - responsive sizing */}
                <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tl-lg z-10" />
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tr-lg z-10" />
                <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-bl-lg z-10" />
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-br-lg z-10" />

                {/* Parchment content - responsive padding */}
                <div className="parchment-bg rounded-md p-4 sm:p-6 relative">
                    {/* Close button - responsive */}
                    <button
                        onClick={onClose}
                        className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20 text-xs sm:text-sm"
                    >
                        ✕
                    </button>

                    {/* Content - responsive spacing */}
                    <div className="text-center space-y-3 sm:space-y-4">
                        {/* Icon - responsive sizing */}
                        <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">
                            {styles.icon}
                        </div>

                        {/* Title - responsive sizing */}
                        <h2
                            className={`text-lg sm:text-xl md:text-2xl font-bold ${styles.titleColor} game-element-border rounded-md py-1 sm:py-2 px-3 sm:px-4`}
                        >
                            {notification.title}
                        </h2>

                        {/* Message - responsive text */}
                        <p
                            className={`text-sm sm:text-base ${styles.messageColor} leading-relaxed`}
                        >
                            {notification.message}
                        </p>

                        {/* Actions - responsive spacing */}
                        <div className="flex flex-col space-y-2 mt-4 sm:mt-6">
                            {notification.actions &&
                            notification.actions.length > 0 ? (
                                notification.actions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            // Execute the action (which should handle closing if needed)
                                            action.action();
                                        }}
                                        className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 font-bold text-sm sm:text-base ${getButtonStyles(
                                            action.style
                                        )}`}
                                    >
                                        <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2">
                                            <span>{action.label}</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="w-full game-button-frame py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow text-sm sm:text-base"
                                >
                                    <div className="text-white flex items-center justify-center space-x-1 sm:space-x-2">
                                        <span>👍</span>
                                        <span>OK</span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
