import React from "react";

interface CreditsProps {
    onClose: () => void;
    isVisible: boolean;
}

export const Credits: React.FC<CreditsProps> = ({ onClose, isVisible }) => {
    const developmentTeam = [
        {
            role: "Project Lead",
            name: "Your University Team",
            description: "Overall project direction and coordination",
            icon: "👨‍💼",
        },
        {
            role: "Game Designer",
            name: "CIVIKA Development Team",
            description: "Game mechanics and educational content design",
            icon: "🎮",
        },
        {
            role: "Frontend Developer",
            name: "React & TypeScript Team",
            description: "User interface and game logic implementation",
            icon: "💻",
        },
        {
            role: "Educational Consultant",
            name: "Civic Education Specialists",
            description: "Philippine civic education content and validation",
            icon: "📚",
        },
        {
            role: "Art & Design",
            name: "Visual Design Team",
            description: "Medieval UI theme and visual assets",
            icon: "🎨",
        },
        {
            role: "Audio Engineer",
            name: "Sound Design Team",
            description: "Background music and sound effects",
            icon: "🎵",
        },
    ];

    const technologies = [
        {
            name: "React 18",
            description: "User interface framework",
            icon: "⚛️",
        },
        { name: "TypeScript", description: "Type-safe JavaScript", icon: "📘" },
        {
            name: "Phaser 3",
            description: "2D game development framework",
            icon: "🎮",
        },
        {
            name: "Tailwind CSS",
            description: "Utility-first CSS framework",
            icon: "🎨",
        },
        {
            name: "Vite",
            description: "Fast build tool and dev server",
            icon: "⚡",
        },
        {
            name: "LocalStorage API",
            description: "Game progress persistence",
            icon: "💾",
        },
    ];

    const specialThanks = [
        {
            name: "Philippine Government",
            description: "Civic education curriculum and standards",
            icon: "🏛️",
        },
        {
            name: "Educational Institutions",
            description: "Research and educational methodology support",
            icon: "🏫",
        },
        {
            name: "Community Leaders",
            description: "Real-world civic governance insights",
            icon: "👥",
        },
        {
            name: "Student Testers",
            description: "Gameplay feedback and educational validation",
            icon: "🎓",
        },
        {
            name: "Open Source Community",
            description: "Tools, libraries, and frameworks",
            icon: "💖",
        },
    ];

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
            <div className="wooden-frame rounded-lg p-4 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto medieval-scrollbar">
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

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-amber-900 game-element-border rounded-md py-3 px-6 mb-4">
                            👥 Credits
                        </h2>
                        <div className="text-amber-700 text-lg font-semibold">
                            🏛️ CIVIKA - A Civic Education Adventure 🏛️
                        </div>
                        <div className="text-amber-600 text-sm mt-2">
                            Version 1.0.0 • 2025 Capstone Project
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Development Team */}
                        <section>
                            <h3 className="text-xl font-bold text-amber-800 border-b-2 border-amber-300 pb-2 mb-4 flex items-center">
                                <span className="mr-2">👨‍💻</span>
                                Development Team
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {developmentTeam.map((member, index) => (
                                    <div
                                        key={index}
                                        className="game-element-border rounded-lg p-4 bg-amber-50"
                                    >
                                        <div className="flex items-start space-x-3">
                                            <span className="text-2xl">
                                                {member.icon}
                                            </span>
                                            <div>
                                                <h4 className="font-bold text-amber-800">
                                                    {member.role}
                                                </h4>
                                                <p className="font-semibold text-amber-700 text-sm">
                                                    {member.name}
                                                </p>
                                                <p className="text-amber-600 text-xs mt-1">
                                                    {member.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Technologies Used */}
                        <section>
                            <h3 className="text-xl font-bold text-amber-800 border-b-2 border-amber-300 pb-2 mb-4 flex items-center">
                                <span className="mr-2">⚙️</span>
                                Technologies Used
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {technologies.map((tech, index) => (
                                    <div
                                        key={index}
                                        className="game-element-border rounded-lg p-3 bg-blue-50 border-blue-300"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xl">
                                                {tech.icon}
                                            </span>
                                            <div>
                                                <h4 className="font-bold text-blue-800 text-sm">
                                                    {tech.name}
                                                </h4>
                                                <p className="text-blue-600 text-xs">
                                                    {tech.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Special Thanks */}
                        <section>
                            <h3 className="text-xl font-bold text-amber-800 border-b-2 border-amber-300 pb-2 mb-4 flex items-center">
                                <span className="mr-2">🙏</span>
                                Special Thanks
                            </h3>
                            <div className="space-y-3">
                                {specialThanks.map((thanks, index) => (
                                    <div
                                        key={index}
                                        className="game-element-border rounded-lg p-4 bg-green-50 border-green-300 flex items-center space-x-3"
                                    >
                                        <span className="text-2xl">
                                            {thanks.icon}
                                        </span>
                                        <div>
                                            <h4 className="font-bold text-green-800">
                                                {thanks.name}
                                            </h4>
                                            <p className="text-green-600 text-sm">
                                                {thanks.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Educational Mission */}
                        <section>
                            <h3 className="text-xl font-bold text-amber-800 border-b-2 border-amber-300 pb-2 mb-4 flex items-center">
                                <span className="mr-2">🎓</span>
                                Educational Mission
                            </h3>
                            <div className="game-element-border rounded-lg p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-400">
                                <p className="text-amber-700 text-center leading-relaxed">
                                    <strong>CIVIKA</strong> was created as a
                                    capstone project to promote civic education
                                    and democratic participation among Filipino
                                    students. Through interactive gameplay and
                                    engaging missions, players learn about
                                    barangay and municipal governance, civic
                                    responsibilities, and the importance of
                                    community involvement.
                                </p>
                                <div className="mt-4 flex justify-center space-x-6 text-sm text-amber-600">
                                    <div className="text-center">
                                        <div className="text-lg">🏛️</div>
                                        <div>Civic Education</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg">🎮</div>
                                        <div>Interactive Learning</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg">🇵🇭</div>
                                        <div>Philippine Context</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg">👥</div>
                                        <div>Community Focus</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Copyright */}
                        <section>
                            <div className="text-center p-4 border-t-2 border-amber-300">
                                <div className="text-amber-700 text-sm mb-2">
                                    © 2025 CIVIKA Development Team. Created for
                                    educational purposes.
                                </div>
                                <div className="text-amber-600 text-xs">
                                    This game is part of a university capstone
                                    project and is designed to promote civic
                                    education and democratic values in the
                                    Philippines.
                                </div>
                                <div className="mt-3 flex justify-center space-x-4 text-xs text-amber-600">
                                    <span>🎓 Academic Project</span>
                                    <span>•</span>
                                    <span>🇵🇭 Made in Philippines</span>
                                    <span>•</span>
                                    <span>💖 Open Source</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={onClose}
                            className="game-button-frame px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                        >
                            <span className="text-white">👍 Close Credits</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
