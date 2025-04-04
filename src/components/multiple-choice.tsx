"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChemJax } from "./latex-wrapper";

interface MultipleChoiceProps {
  options: string[];
  onSelect: (answer: string) => void;
}

export function MultipleChoice({ options, onSelect }: MultipleChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedOption) {
      onSelect(selectedOption);
    }
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedOption || ""}
        onValueChange={setSelectedOption}
      >
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
          >
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label
              htmlFor={`option-${index}`}
              className="cursor-pointer flex-grow"
            >
              <ChemJax>{option}</ChemJax>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!selectedOption}
      >
        Submit Answer
      </Button>
    </div>
  );
}
