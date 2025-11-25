import React, { useState, useEffect } from "react";

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizSystemProps {
    question: QuizQuestion | QuizQuestion[];
    onAnswer: (isCorrect: boolean) => void;
    onClose: () => void;
    missionId?: string;
}

export const QuizSystem: React.FC<QuizSystemProps> = ({
    question,
    onAnswer,
    onClose,
    missionId,
}) => {
    // Progressive quiz support
    const [questions] = useState<QuizQuestion[]>(Array.isArray(question) ? question : [question]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const currentQuestion = questions[currentQuestionIndex];
    
    // Retry system
    const [questionRetries, setQuestionRetries] = useState<number[]>(new Array(questions.length).fill(0));
    const [totalScore, setTotalScore] = useState(0);
    const MAX_RETRIES_PER_QUESTION = 2; // Allow 2 retries per question
    
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [submissionTime, setSubmissionTime] = useState<number>(0);
    const [startTime] = useState<number>(Date.now());

    // Timer system
    const QUIZ_TIME_LIMIT = 60; // 60 seconds per quiz
    const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME_LIMIT);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [timeBonus, setTimeBonus] = useState(0);

    // Countdown timer effect
    useEffect(() => {
        if (!isTimerRunning || showResult) return;

        const timerInterval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    // Time's up! Auto-submit or fail
                    clearInterval(timerInterval);
                    setIsTimerRunning(false);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [isTimerRunning, showResult]);

    // Calculate time bonus based on remaining time
    const calculateTimeBonus = (remainingTime: number): number => {
        if (remainingTime >= 50) return 30; // Answered in 10s or less - Excellent!
        if (remainingTime >= 40) return 20; // Answered in 20s or less - Great!
        if (remainingTime >= 30) return 10; // Answered in 30s or less - Good!
        return 0; // No bonus
    };

    const handleTimeUp = () => {
        // Time ran out - auto-fail
        setIsCorrect(false);
        setSubmissionTime(QUIZ_TIME_LIMIT);
        setShowResult(true);
        setTimeBonus(0);

        console.log("Quiz time expired - auto-failed");
        onAnswer(false);
    };

    const handleOptionSelect = (index: number) => {
        if (!showResult) {
            setSelectedOption(index);
        }
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            // Stop the timer
            setIsTimerRunning(false);

            const correct = selectedOption === currentQuestion.correctAnswer;
            const timeSpent = (Date.now() - startTime) / 1000;

            // Calculate time bonus
            const bonus = correct ? calculateTimeBonus(timeRemaining) : 0;
            setTimeBonus(bonus);

            setIsCorrect(correct);
            setSubmissionTime(timeSpent);
            setShowResult(true);

            // Provide detailed feedback
            console.log("Quiz submission:", {
                missionId,
                selectedOption,
                correctAnswer: currentQuestion.correctAnswer,
                isCorrect: correct,
                timeSpent: Math.round(timeSpent),
                timeRemaining,
                timeBonus: bonus,
            });

            if (correct) {
                setCorrectAnswersCount(prev => prev + 1);
            }

            // Don't call onAnswer immediately - wait for handleNext
            // onAnswer(correct);
        }
    };

    const handleNext = () => {
        if (!isCorrect) {
            // Wrong answer - check if retries available
            const currentRetries = questionRetries[currentQuestionIndex];
            
            if (currentRetries < MAX_RETRIES_PER_QUESTION) {
                // Allow retry
                const newRetries = [...questionRetries];
                newRetries[currentQuestionIndex] = currentRetries + 1;
                setQuestionRetries(newRetries);
                
                // Reset question state for retry
                setSelectedOption(null);
                setShowResult(false);
                setTimeRemaining(QUIZ_TIME_LIMIT);
                setIsTimerRunning(true);
                return;
            } else {
                // No more retries - fail the mission
                onAnswer(false);
                onClose();
                return;
            }
        }

        // Correct answer - calculate score for this question
        const currentRetries = questionRetries[currentQuestionIndex];
        let questionScore = 100; // Base score
        
        // Apply retry penalty
        if (currentRetries === 1) questionScore = 80; // 1 retry = 80%
        else if (currentRetries === 2) questionScore = 60; // 2 retries = 60%
        
        setTotalScore(prev => prev + questionScore);
        setCorrectAnswersCount(prev => prev + 1);

        // Check if there are more questions
        if (currentQuestionIndex < questions.length - 1) {
            // Move to next question
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowResult(false);
            setTimeRemaining(QUIZ_TIME_LIMIT);
            setIsTimerRunning(true);
        } else {
            // All questions completed successfully
            const finalScore = Math.round(totalScore / questions.length);
            console.log(`Mission completed! Final score: ${finalScore}%`);
            onAnswer(true);
            onClose();
        }
    };

    // Helper function to get timer color based on time remaining
    const getTimerColor = () => {
        if (timeRemaining <= 10) return "text-red-600 animate-pulse";
        if (timeRemaining <= 20) return "text-orange-600";
        if (timeRemaining <= 30) return "text-yellow-600";
        return "text-green-600";
    };

    // Helper function to get timer background color
    const getTimerBgColor = () => {
        if (timeRemaining <= 10) return "bg-red-100 border-red-500";
        if (timeRemaining <= 20) return "bg-orange-100 border-orange-500";
        if (timeRemaining <= 30) return "bg-yellow-100 border-yellow-500";
        return "bg-green-100 border-green-500";
    };

    // Helper function to get progress bar color
    const getProgressBarColor = () => {
        if (timeRemaining <= 10) return "bg-red-600";
        if (timeRemaining <= 20) return "bg-orange-500";
        if (timeRemaining <= 30) return "bg-yellow-500";
        return "bg-green-500";
    };

    const timePercentage = (timeRemaining / QUIZ_TIME_LIMIT) * 100;

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl mx-2 sm:mx-4 max-h-[95vh] overflow-y-auto">
                {/* Quiz System Container */}
                <div className="wooden-frame rounded-lg p-3 sm:p-6">
                    {/* Metal corners */}
                    <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tl-lg z-10" />
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-tr-lg z-10" />
                    <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-bl-lg z-10" />
                    <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 metal-corner rounded-br-lg z-10" />

                    {/* Parchment content */}
                    <div className="parchment-bg rounded-md p-3 sm:p-6 relative">
                        {/* Timer Display - Prominent */}
                        {!showResult && (
                            <div
                                className={`mb-4 p-3 sm:p-4 rounded-lg border-3 game-element-border ${getTimerBgColor()} transition-all duration-300`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl sm:text-3xl">
                                            ⏱️
                                        </span>
                                        <span
                                            className={`text-xl sm:text-3xl font-bold ${getTimerColor()} transition-colors duration-300`}
                                        >
                                            {timeRemaining}s
                                        </span>
                                    </div>
                                    <div className="text-xs sm:text-sm font-semibold text-amber-800">
                                        {timeRemaining <= 10
                                            ? "⚠️ HURRY!"
                                            : timeRemaining <= 20
                                            ? "⏰ Time Running Out!"
                                            : timeRemaining <= 30
                                            ? "⏳ Keep Going!"
                                            : "💪 You Got This!"}
                                    </div>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-300 rounded-full h-2 sm:h-3 border-2 border-gray-400 overflow-hidden">
                                    <div
                                        className={`h-full ${getProgressBarColor()} transition-all duration-1000 ease-linear`}
                                        style={{ width: `${timePercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-2xl font-bold text-amber-900 game-element-border rounded-md py-1 sm:py-2 px-2 sm:px-4">
                                📝 Quiz Challenge
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110 border-2 border-red-800 text-sm sm:text-base"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Progress Indicator */}
                        <div className="text-center mb-4 space-y-2">
                            <span className="text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                            {/* Retry Indicator */}
                            {questionRetries[currentQuestionIndex] > 0 && (
                                <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full border border-orange-300">
                                    Attempt {questionRetries[currentQuestionIndex] + 1} of {MAX_RETRIES_PER_QUESTION + 1}
                                </div>
                            )}
                        </div>

                        {/* Question */}
                        <div className="mb-4 sm:mb-6">
                            <div className="game-element-border rounded-lg p-3 sm:p-4 bg-gradient-to-r from-amber-100 to-amber-200">
                                <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-2 sm:mb-3 flex items-center space-x-1 sm:space-x-2">
                                    <span>❓</span>
                                    <span>Question:</span>
                                </h3>
                                <p className="text-amber-800 leading-relaxed text-sm sm:text-base">
                                    {currentQuestion.question}
                                </p>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                            {currentQuestion.options.map((option: string, index: number) => {
                                let optionClass =
                                    "p-2 sm:p-3 rounded-lg border-2 sm:border-3 transition-all duration-200 cursor-pointer hover:scale-105 game-element-border ";

                                if (showResult) {
                                    if (index === currentQuestion.correctAnswer) {
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
                                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-2 sm:mr-3 flex items-center justify-center font-bold text-xs sm:text-sm ${
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
                                            <span className="font-medium text-sm sm:text-base">
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
                                className={`p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 game-element-border ${
                                    isCorrect
                                        ? "bg-green-100 border-green-500"
                                        : "bg-red-100 border-red-500"
                                }`}
                            >
                                <div className="flex items-center mb-2 sm:mb-3">
                                    <div
                                        className={`text-2xl sm:text-3xl mr-2 sm:mr-3 ${
                                            isCorrect
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {isCorrect ? "🎉" : "❌"}
                                    </div>
                                    <div>
                                        <h4
                                            className={`text-lg sm:text-xl font-bold ${
                                                isCorrect
                                                    ? "text-green-800"
                                                    : "text-red-800"
                                            }`}
                                        >
                                            {isCorrect
                                                ? "Correct!"
                                                : "Incorrect!"}
                                        </h4>
                                        <div className="space-y-1">
                                            <p
                                                className={`text-sm sm:text-base ${
                                                    isCorrect
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                }`}
                                            >
                                                {isCorrect
                                                    ? timeBonus > 0
                                                        ? `Excellent! You earned bonus points for quick thinking! +${timeBonus} time bonus!`
                                                        : "Great job! You earned points and coins!"
                                                    : timeRemaining === 0
                                                    ? "⏰ Time's up! The quiz failed due to timeout."
                                                    : `The correct answer was: ${
                                                          currentQuestion.options[
                                                              currentQuestion
                                                                  .correctAnswer
                                                          ]
                                                      }`}
                                            </p>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    ⏱️ Time Taken:{" "}
                                                    {Math.round(submissionTime)}
                                                    s / {QUIZ_TIME_LIMIT}s
                                                </p>
                                                {isCorrect && timeBonus > 0 && (
                                                    <p className="text-xs sm:text-sm text-green-600 font-bold flex items-center space-x-1">
                                                        <span>⚡</span>
                                                        <span>
                                                            Speed Bonus: +
                                                            {timeBonus} points!
                                                        </span>
                                                    </p>
                                                )}
                                                {isCorrect &&
                                                    timeBonus === 0 &&
                                                    timeRemaining > 0 && (
                                                        <p className="text-xs sm:text-sm text-amber-600">
                                                            💡 Tip: Answer
                                                            faster (within 30s)
                                                            for bonus points!
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-amber-50 p-2 sm:p-3 rounded-lg game-element-border">
                                    <h5 className="font-bold text-amber-800 mb-2 text-sm sm:text-base">
                                        📚 Explanation:
                                    </h5>
                                    <p className="text-amber-700 text-sm sm:text-base">
                                        {currentQuestion.explanation}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-2 sm:space-x-4">
                            {!showResult ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={selectedOption === null}
                                    className="game-button-frame px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none game-glow"
                                >
                                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                        <span>📤</span>
                                        <span>Submit Answer</span>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className={`px-4 sm:px-6 py-2 sm:py-3 text-white text-sm sm:text-base font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300 ${
                                        !isCorrect && questionRetries[currentQuestionIndex] < MAX_RETRIES_PER_QUESTION
                                            ? "bg-orange-600 hover:bg-orange-700 border-2 border-orange-800"
                                            : "game-button-frame game-glow"
                                    }`}
                                >
                                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                        {!isCorrect && questionRetries[currentQuestionIndex] < MAX_RETRIES_PER_QUESTION ? (
                                            <>
                                                <span>🔄</span>
                                                <span>Try Again ({MAX_RETRIES_PER_QUESTION - questionRetries[currentQuestionIndex]} left)</span>
                                            </>
                                        ) : !isCorrect ? (
                                            <>
                                                <span>❌</span>
                                                <span>Mission Failed</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{currentQuestionIndex < questions.length - 1 ? "➡️" : "🎉"}</span>
                                                <span>{currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Mission"}</span>
                                            </>
                                        )}
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

