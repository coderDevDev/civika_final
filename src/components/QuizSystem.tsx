import React, { useState } from "react";

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizSystemProps {
    question: QuizQuestion;
    onAnswer: (isCorrect: boolean) => void;
    onClose: () => void;
}

export const QuizSystem: React.FC<QuizSystemProps> = ({
    question,
    onAnswer,
    onClose,
}) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (!showResult) {
            setSelectedOption(index);
        }
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            const correct = selectedOption === question.correctAnswer;
            setIsCorrect(correct);
            setShowResult(true);
            onAnswer(correct);
        }
    };

    const handleNext = () => {
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="max-w-2xl w-full mx-4">
                {/* Quiz System Container */}
                <div className="wooden-frame rounded-lg p-6">
                    {/* Metal corners */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 metal-corner rounded-tl-lg z-10" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 metal-corner rounded-tr-lg z-10" />
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 metal-corner rounded-bl-lg z-10" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 metal-corner rounded-br-lg z-10" />

                    {/* Parchment content */}
                    <div className="parchment-bg rounded-md p-6 relative">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-amber-900 game-element-border rounded-md py-2 px-4">
                                📝 Quiz Challenge
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Question */}
                        <div className="mb-6">
                            <div className="game-element-border rounded-lg p-4 bg-gradient-to-r from-amber-100 to-amber-200">
                                <h3 className="text-lg font-bold text-amber-900 mb-3 flex items-center space-x-2">
                                    <span>❓</span>
                                    <span>Question:</span>
                                </h3>
                                <p className="text-amber-800 leading-relaxed">
                                    {question.question}
                                </p>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-6">
                            {question.options.map((option, index) => {
                                let optionClass =
                                    "p-3 rounded-lg border-3 transition-all duration-200 cursor-pointer hover:scale-105 game-element-border ";

                                if (showResult) {
                                    if (index === question.correctAnswer) {
                                        optionClass +=
                                            "bg-green-100 border-green-500 text-green-800";
                                    } else if (
                                        index === selectedOption &&
                                        !isCorrect
                                    ) {
                                        optionClass +=
                                            "bg-red-100 border-red-500 text-red-800";
                                    } else {
                                        optionClass +=
                                            "bg-amber-50 border-amber-300 text-amber-600";
                                    }
                                } else {
                                    optionClass +=
                                        selectedOption === index
                                            ? "bg-amber-100 border-amber-500 text-amber-800"
                                            : "bg-amber-50 border-amber-300 text-amber-700 hover:border-amber-400";
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleOptionSelect(index)
                                        }
                                        disabled={showResult}
                                        className={`w-full text-left ${optionClass}`}
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center font-bold text-sm ${
                                                    showResult
                                                        ? index ===
                                                          question.correctAnswer
                                                            ? "bg-green-500 border-green-600 text-white"
                                                            : index ===
                                                                  selectedOption &&
                                                              !isCorrect
                                                            ? "bg-red-500 border-red-600 text-white"
                                                            : "bg-amber-300 border-amber-400 text-amber-600"
                                                        : selectedOption ===
                                                          index
                                                        ? "bg-amber-500 border-amber-600 text-white"
                                                        : "bg-amber-200 border-amber-400 text-amber-600"
                                                }`}
                                            >
                                                {String.fromCharCode(
                                                    65 + index
                                                )}
                                            </div>
                                            <span className="font-medium">
                                                {option}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Result */}
                        {showResult && (
                            <div
                                className={`p-4 rounded-lg mb-4 game-element-border ${
                                    isCorrect
                                        ? "bg-green-100 border-green-500"
                                        : "bg-red-100 border-red-500"
                                }`}
                            >
                                <div className="flex items-center mb-3">
                                    <div
                                        className={`text-3xl mr-3 ${
                                            isCorrect
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {isCorrect ? "🎉" : "❌"}
                                    </div>
                                    <div>
                                        <h4
                                            className={`text-xl font-bold ${
                                                isCorrect
                                                    ? "text-green-800"
                                                    : "text-red-800"
                                            }`}
                                        >
                                            {isCorrect
                                                ? "Correct!"
                                                : "Incorrect!"}
                                        </h4>
                                        <p
                                            className={`${
                                                isCorrect
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                                            {isCorrect
                                                ? "Great job!"
                                                : `The correct answer was: ${
                                                      question.options[
                                                          question.correctAnswer
                                                      ]
                                                  }`}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-lg game-element-border">
                                    <h5 className="font-bold text-amber-800 mb-2">
                                        📚 Explanation:
                                    </h5>
                                    <p className="text-amber-700">
                                        {question.explanation}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4">
                            {!showResult ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={selectedOption === null}
                                    className="game-button-frame px-6 py-3 text-white text-base font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none game-glow"
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>📤</span>
                                        <span>Submit Answer</span>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="game-button-frame px-6 py-3 text-white text-base font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300 game-glow"
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>➡️</span>
                                        <span>Continue</span>
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
