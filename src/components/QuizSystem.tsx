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
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl border-4 border-yellow-400">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-black text-blue-600">
                        Quiz Challenge
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Question:</h3>
                        <p className="text-lg leading-relaxed">
                            {question.question}
                        </p>
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-4 mb-8">
                    {question.options.map((option, index) => {
                        let optionClass =
                            "p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ";

                        if (showResult) {
                            if (index === question.correctAnswer) {
                                optionClass +=
                                    "bg-green-100 border-green-500 text-green-800";
                            } else if (index === selectedOption && !isCorrect) {
                                optionClass +=
                                    "bg-red-100 border-red-500 text-red-800";
                            } else {
                                optionClass +=
                                    "bg-gray-100 border-gray-300 text-gray-600";
                            }
                        } else {
                            optionClass +=
                                selectedOption === index
                                    ? "bg-blue-100 border-blue-500 text-blue-800"
                                    : "bg-white border-gray-300 text-gray-700 hover:border-blue-400";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(index)}
                                disabled={showResult}
                                className={`w-full text-left ${optionClass}`}
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center font-bold ${
                                            showResult
                                                ? index ===
                                                  question.correctAnswer
                                                    ? "bg-green-500 border-green-600 text-white"
                                                    : index ===
                                                          selectedOption &&
                                                      !isCorrect
                                                    ? "bg-red-500 border-red-600 text-white"
                                                    : "bg-gray-300 border-gray-400 text-gray-600"
                                                : selectedOption === index
                                                ? "bg-blue-500 border-blue-600 text-white"
                                                : "bg-gray-200 border-gray-400 text-gray-600"
                                        }`}
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <span className="text-lg font-medium">
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
                        className={`p-6 rounded-2xl mb-6 ${
                            isCorrect
                                ? "bg-green-100 border-2 border-green-500"
                                : "bg-red-100 border-2 border-red-500"
                        }`}
                    >
                        <div className="flex items-center mb-4">
                            <div
                                className={`text-4xl mr-4 ${
                                    isCorrect
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {isCorrect ? "🎉" : "❌"}
                            </div>
                            <div>
                                <h4
                                    className={`text-2xl font-bold ${
                                        isCorrect
                                            ? "text-green-800"
                                            : "text-red-800"
                                    }`}
                                >
                                    {isCorrect ? "Correct!" : "Incorrect!"}
                                </h4>
                                <p
                                    className={`text-lg ${
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
                        <div className="bg-white/50 p-4 rounded-xl">
                            <h5 className="font-bold text-gray-800 mb-2">
                                Explanation:
                            </h5>
                            <p className="text-gray-700">
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
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
