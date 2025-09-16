import React, { useState, useRef, useEffect } from "react";

interface VirtualJoystickProps {
    onMove: (direction: { x: number; y: number }) => void;
    onStop: () => void;
    isVisible: boolean;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({
    onMove,
    onStop,
    isVisible,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
    const joystickRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);
    const startPosition = useRef({ x: 0, y: 0 });
    const maxDistance = 40; // Maximum distance the knob can move from center

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = joystickRef.current?.getBoundingClientRect();
        if (rect) {
            startPosition.current = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
            setIsDragging(true);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !joystickRef.current) return;
        e.preventDefault();

        const touch = e.touches[0];
        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = touch.clientX - rect.left - centerX;
        const deltaY = touch.clientY - rect.top - centerY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const clampedDistance = Math.min(distance, maxDistance);

        const angle = Math.atan2(deltaY, deltaX);
        const newX = Math.cos(angle) * clampedDistance;
        const newY = Math.sin(angle) * clampedDistance;

        setJoystickPosition({ x: newX, y: newY });

        // Normalize values between -1 and 1
        const normalizedX = newX / maxDistance;
        const normalizedY = newY / maxDistance;

        onMove({ x: normalizedX, y: normalizedY });
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setJoystickPosition({ x: 0, y: 0 });
        onStop();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const rect = joystickRef.current?.getBoundingClientRect();
        if (rect) {
            startPosition.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            setIsDragging(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !joystickRef.current) return;
        e.preventDefault();

        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = e.clientX - rect.left - centerX;
        const deltaY = e.clientY - rect.top - centerY;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const clampedDistance = Math.min(distance, maxDistance);

        const angle = Math.atan2(deltaY, deltaX);
        const newX = Math.cos(angle) * clampedDistance;
        const newY = Math.sin(angle) * clampedDistance;

        setJoystickPosition({ x: newX, y: newY });

        // Normalize values between -1 and 1
        const normalizedX = newX / maxDistance;
        const normalizedY = newY / maxDistance;

        onMove({ x: normalizedX, y: normalizedY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setJoystickPosition({ x: 0, y: 0 });
        onStop();
    };

    // Add global mouse events for better dragging
    useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseMove = (e: MouseEvent) => {
                if (!joystickRef.current) return;
                e.preventDefault();

                const rect = joystickRef.current.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const deltaX = e.clientX - rect.left - centerX;
                const deltaY = e.clientY - rect.top - centerY;

                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const clampedDistance = Math.min(distance, maxDistance);

                const angle = Math.atan2(deltaY, deltaX);
                const newX = Math.cos(angle) * clampedDistance;
                const newY = Math.sin(angle) * clampedDistance;

                setJoystickPosition({ x: newX, y: newY });

                // Normalize values between -1 and 1
                const normalizedX = newX / maxDistance;
                const normalizedY = newY / maxDistance;

                onMove({ x: normalizedX, y: normalizedY });
            };

            const handleGlobalMouseUp = () => {
                setIsDragging(false);
                setJoystickPosition({ x: 0, y: 0 });
                onStop();
            };

            document.addEventListener("mousemove", handleGlobalMouseMove);
            document.addEventListener("mouseup", handleGlobalMouseUp);

            return () => {
                document.removeEventListener(
                    "mousemove",
                    handleGlobalMouseMove
                );
                document.removeEventListener("mouseup", handleGlobalMouseUp);
            };
        }
    }, [isDragging, onMove, onStop]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 z-50 pointer-events-auto">
            {/* Joystick Base */}
            <div
                ref={joystickRef}
                className="relative w-20 h-20 rounded-full bg-black bg-opacity-30 border-2 border-gray-600 shadow-lg"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {/* Joystick Knob */}
                <div
                    ref={knobRef}
                    className="absolute w-10 h-10 rounded-full bg-white bg-opacity-80 border-2 border-gray-400 shadow-md transition-transform duration-100"
                    style={{
                        left: "50%",
                        top: "50%",
                        transform: `translate(calc(-50% + ${joystickPosition.x}px), calc(-50% + ${joystickPosition.y}px))`,
                    }}
                />
            </div>
        </div>
    );
};
