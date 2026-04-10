"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { questions as originalQuestions } from "./questions";
import { Clock } from "lucide-react";

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

export default function MedIoTGamePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState(originalQuestions);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setShuffledQuestions(shuffleArray(originalQuestions));
  }, []);

  useEffect(() => {
    if (!gameStarted || finished || selected) return;

    if (timeLeft === 0) {
      setFeedback("wrong");
      setSelected("Timeout");
      setTimeout(nextQuestion, 1200);
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, selected, finished, gameStarted]);

  const nextQuestion = () => {
    setSelected(null);
    setFeedback(null);
    setTimeLeft(10);
    if (current + 1 < shuffledQuestions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === shuffledQuestions[current].correctAnswer;
    setSelected(answer);
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    setTimeout(nextQuestion, 1200);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-100 to-blue-200">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full space-y-6">
          <h1 className="text-3xl font-bold text-blue-700">Welcome to MedIoT Game</h1>
          <p className="text-gray-600">Test your decision-making in real-life health scenarios.</p>
          <Button size="lg" onClick={() => setGameStarted(true)}>
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-4">
          <h2 className="text-2xl font-bold text-green-700">🎉 Game Over!</h2>
          <p className="text-lg text-gray-700">
            Your score: <span className="font-bold">{score}</span> / {shuffledQuestions.length}
          </p>
          <Button onClick={() => window.location.reload()}>Play Again</Button>
        </div>
      </div>
    );
  }

  const question = shuffledQuestions[current];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-200 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full space-y-6">

        
        {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="text-sm font-semibold text-gray-700">
            Question {current + 1} of {shuffledQuestions.length}
          </div>
          <div className="flex items-center text-red-600 font-bold text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}s
          </div>
        </div>

        {/* Question */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">{question.prompt}</h2>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option) => {
            let variant: "default" | "destructive" | "outline" = "outline";
            if (selected === option) {
              variant = feedback === "correct" && option === question.correctAnswer ? "default" : "destructive";
            }
            return (
              <Button
                key={option}
                variant={variant}
                onClick={() => handleAnswer(option)}
                disabled={!!selected}
                className={`text-md py-4 transition-all duration-300 ${
                  selected === option ? "scale-95" : "hover:scale-105"
                }`}
              >
                {option}
              </Button>
            );
          })}
        </div>

        {/* Score */}
        <div className="text-center mt-4 text-sm text-gray-700">
          Score: <span className="text-green-700 font-semibold">{score}</span>
        </div>
      </div>
    </div>
  );
}
