"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const steps = [
  {
    instruction: "Calculate the number of moles (n) given 5.0 grams of H2 gas.",
    solution: 2.5,
    unit: "mol",
    hint: "Use the molar mass of H2 (2 g/mol)",
  },
  {
    instruction:
      "Calculate the volume (V) of the gas at STP (Standard Temperature and Pressure).",
    solution: 56,
    unit: "L",
    hint: "Use the molar volume at STP (22.4 L/mol)",
  },
  {
    instruction:
      "Calculate the pressure (P) if the volume is increased to 112 L at constant temperature.",
    solution: 0.5,
    unit: "atm",
    hint: "Use Boyle's Law: P1V1 = P2V2",
  },
];

export default function Component() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    Array(steps.length).fill(null)
  );
  const [errors, setErrors] = useState<string[]>(Array(steps.length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [showHint, setShowHint] = useState<boolean[]>(
    Array(steps.length).fill(false)
  );

  useEffect(() => {
    if (inputRefs.current[currentStep]) {
      inputRefs.current[currentStep]?.focus();
    }
  }, [currentStep]);

  const handleSubmit = (e: React.FormEvent, index: number) => {
    e.preventDefault();
    const numericAnswer = parseFloat(inputRefs.current[index]?.value || "");

    if (isNaN(numericAnswer)) {
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = "Please enter a valid number";
        return newErrors;
      });
      return;
    }

    if (Math.abs(numericAnswer - steps[index].solution) < 0.1) {
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
      if (index === currentStep && currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = "That's not quite right. Try again!";
        return newErrors;
      });
    }
  };

  const toggleHint = (index: number) => {
    setShowHint((prev) => {
      const newShowHint = [...prev];
      newShowHint[index] = !newShowHint[index];
      return newShowHint;
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Δ Chem</h1>

      {steps.map((step, index) => (
        <div
          key={index}
          className={`mb-6 ${index > currentStep ? "opacity-50" : ""}`}
        >
          <div className="bg-gray-900 p-4 rounded-md mb-4">
            <p className="font-semibold mb-2">Step {index + 1}:</p>
            <p>{step.instruction}</p>
          </div>

          <form onSubmit={(e) => handleSubmit(e, index)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`answer-${index}`} className="">Your answer:</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id={`answer-${index}`}
                  type="text"
                  ref={(el) => (inputRefs.current[index] = el)}
                  defaultValue={userAnswers[index]?.toString() || ""}
                  placeholder={`Enter your answer in ${step.unit}`}
                  className="flex-grow bg-black"
                  disabled={index > currentStep}
                />
                <span className="text-gray-500">{step.unit}</span>
              </div>
            </div>

            {errors[index] && <p className="text-red-300">{errors[index]}</p>}

            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => toggleHint(index)}
                disabled={index > currentStep}
              >
                {showHint[index] ? "Hide Hint" : "Need a hint?"}
              </Button>

              {showHint[index] && (
                <p className="mt-4 text-sm text-gray-300 bg-gray-900 p-2 rounded">
                  Hint: {step.hint}
                </p>
              )}
            </div>
          </form>
        </div>
      ))}

      {currentStep === steps.length && (
        <div className="text-center mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Congratulations! You&apos;ve solved the problem.
          </h2>
          <p className="mb-4">Here are your answers:</p>
          <ul className="list-disc list-inside">
            {steps.map((step, index) => (
              <li key={index}>
                Step {index + 1}: {userAnswers[index]?.toFixed(2)} {step.unit}
              </li>
            ))}
          </ul>
          <Button
            onClick={() => {
              setCurrentStep(0);
              setUserAnswers(Array(steps.length).fill(null));
              setErrors(Array(steps.length).fill(""));
            }}
            className="mt-4"
          >
            Start Over
          </Button>
        </div>
      )}
    </div>
  );
}
