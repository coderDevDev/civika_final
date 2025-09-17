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
                    border: "border-orange-600",
                    icon: notification.icon || "⚠️",
                    titleColor: "text-orange-900",
                    messageColor: "text-orange-800",
                };
            case "info":
                return {
                    border: "border-sky-600",
                    icon: notification.icon || "ℹ️",
                    titleColor: "text-sky-900",
                    messageColor: "text-sky-800",
                };
            case "error":
                return {
                    border: "border-red-700",
                    icon: notification.icon || "❌",
                    titleColor: "text-red-900",
                    messageColor: "text-red-800",
                };
            default:
                return {
                    border: "border-stone-600",
                    icon: notification.icon || "💬",
                    titleColor: "text-stone-900",
                    messageColor: "text-stone-800",
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
            <div
                className={`wooden-frame rounded-lg p-4 max-w-md w-full mx-4 ${styles.border} border-2`}
            >
                {/* Metal corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 metal-corner rounded-tl-lg z-10" />
                <div className="absolute -top-2 -right-2 w-6 h-6 metal-corner rounded-tr-lg z-10" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 metal-corner rounded-bl-lg z-10" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 metal-corner rounded-br-lg z-10" />

                {/* Parchment content */}
                <div className="parchment-bg rounded-md p-6 relative">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 z-20 text-sm"
                    >
                        ✕
                    </button>

                    {/* Content */}
                    <div className="text-center space-y-4">
                        {/* Icon */}
                        <div className="text-4xl mb-2">{styles.icon}</div>

                        {/* Title */}
                        <h2
                            className={`text-xl font-bold ${styles.titleColor} game-element-border rounded-md py-2 px-4`}
                        >
                            {notification.title}
                        </h2>

                        {/* Message */}
                        <p
                            className={`text-base ${styles.messageColor} leading-relaxed`}
                        >
                            {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 mt-6">
                            {notification.actions &&
                            notification.actions.length > 0 ? (
                                notification.actions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={action.action}
                                        className={`w-full py-3 px-6 rounded-lg transition-all duration-200 font-bold ${getButtonStyles(
                                            action.style
                                        )}`}
                                    >
                                        <div className="text-white flex items-center justify-center space-x-2">
                                            <span>{action.label}</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="w-full game-button-frame py-3 px-6 rounded-lg transition-all duration-200 font-bold hover:scale-105 game-glow"
                                >
                                    <div className="text-white flex items-center justify-center space-x-2">
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
