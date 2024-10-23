"use client";

import { useEffect, useRef, useState } from "react";
import { questions } from "./questions/gas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import LoadingSpinner from "@/components/loading-spinner";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface QuestionProps {
  steps: (typeof questions)[0]["steps"];
  nextQuestion: () => void;
}

function Steps({ steps, nextQuestion }: QuestionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    Array(steps.length).fill(null)
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showHint, setShowHint] = useState<boolean[]>(
    Array(steps.length).fill(false)
  );
  const [errors, setErrors] = useState<string[]>(Array(steps.length).fill(""));
  const [shadowColor, setShadowColor] = useState<string>("");

  useEffect(() => {
    if (inputRefs.current[currentStep]) {
      inputRefs.current[currentStep]?.focus();
    }
  }, [currentStep]);

  const toggleHint = (index: number) => {
    setShowHint((prev) => {
      const newShowHint = [...prev];
      newShowHint[index] = !newShowHint[index];
      return newShowHint;
    });
  };

  const handleSubmit = (e: React.FormEvent, index: number) => {
    e.preventDefault();
    const numericAnswer = parseFloat(inputRefs.current[index]?.value || "");

    if (isNaN(numericAnswer)) {
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = "Please enter a valid number";
        return newErrors;
      });
      setShadowColor("red");
      setTimeout(() => setShadowColor(""), 2000);
      return;
    }

    if (Math.abs(numericAnswer - steps[index].solution) < 0.5) {
      setUserAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[index] = numericAnswer;
        return newAnswers;
      });
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = "";
        return newErrors;
      });
      setShadowColor("green");
      setTimeout(() => {
        setShadowColor("");
        if (index === currentStep) {
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            nextQuestion();
          }
        }
      }, 1200);
    } else {
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = "That's not quite right. Try again!";
        return newErrors;
      });
      setShadowColor("red");
      setTimeout(() => setShadowColor(""), 2000);
    }
  };

  return (
    <div>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`mb-6 ${index != currentStep ? "opacity-50" : ""}`}
        >
          <div
            className={`bg-gray-900 p-4 rounded-md mb-4 transition-shadow duration-500 ${
              shadowColor === "green" && index === currentStep
                ? "shadow-[0_0px_60px_-5px_rgba(104,211,145,0.6)]"
                : shadowColor === "red" && index === currentStep
                ? "shadow-[0_0px_60px_-5px_rgba(252,129,129,0.6)]"
                : ""
            }`}
          >
            <p className="font-semibold mb-2">Step {index + 1}:</p>
            <p className="mb-4 prose">
              <Latex>{step.instruction}</Latex>
            </p>
            <form
              onSubmit={(e) => handleSubmit(e, index)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor={`answer-${index}`} className="">
                  Your answer:
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={`answer-${index}`}
                    type="text"
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    defaultValue={userAnswers[index]?.toString() || ""}
                    placeholder={`Enter your answer in ${step.unit}`}
                    className="flex-grow"
                    disabled={index != currentStep || shadowColor == "green"}
                  />
                  <span className="text-gray-500">
                    <Latex>${step.unit}$</Latex>
                  </span>
                </div>
              </div>

              {errors[index] && <p className="text-red-300">{errors[index]}</p>}

              <div className="space-x-2">
                <Button
                  className="bg-slate-600 hover:bg-slate-700"
                  type="submit"
                  disabled={index > currentStep}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toggleHint(index)}
                  disabled={index != currentStep}
                >
                  {showHint[index] ? "Hide Hint" : "Need a hint?"}
                </Button>

                {showHint[index] && (
                  <p className="mt-4 text-sm text-gray-300 bg-gray-900 p-2 rounded">
                    <Latex>Hint: {step.hint}</Latex>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DeltaChem() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQuestion = localStorage.getItem("currentQuestion");
      if (savedQuestion) {
        setCurrentQuestion(parseInt(savedQuestion, 10));
      }
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("currentQuestion", currentQuestion.toString());
    }
  }, [currentQuestion, isMounted]);

  const nextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  if (!isMounted) {
    return <LoadingSpinner />; // or a loading spinner
  }

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-lg ease-in duration-300">
      <h1 className="text-3xl font-bold mb-4">Δ Chem</h1>
      {currentQuestion >= questions.length ? (
        <div className="flex items-center justify-center">
          <div className="inline-block text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 w-96 my-8 text-center">
            Done!
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-6">
            Question {currentQuestion + 1}
          </h1>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white">
              <Latex>{questions[currentQuestion]["question"]}</Latex>
            </h2>
          </div>
          <Steps
            steps={questions[currentQuestion]["steps"]}
            nextQuestion={nextQuestion}
            key={currentQuestion}
          />
        </>
      )}
      <div className="flex justify-center my-4">
        <div className="w-2/3">
          <Progress value={(currentQuestion / questions.length) * 100} />
        </div>
      </div>
      <Suspense>
        <Buttons />
      </Suspense>
    </div>
  );
}

function Buttons() {
  const teacher = searchParams.get("teacher");
  const searchParams = useSearchParams();

  return (
    <div className="flex justify-center gap-4">
      {currentQuestion > 0 ? (
        <Button
          onClick={() => {
            setCurrentQuestion(currentQuestion - 1);
          }}
          variant={"destructive"}
        >
          Back
        </Button>
      ) : null}
      {teacher && currentQuestion < questions.length ? (
        <Button
          onClick={() => {
            setCurrentQuestion((prev) => prev + 1);
          }}
        >
          Forward
        </Button>
      ) : null}
    </div>
  );
}
