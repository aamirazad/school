"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface KaExpressionProps {
  onSubmit: (answer: string) => void;
}

export function KaExpression({ onSubmit }: KaExpressionProps) {
  const [numerator1, setNumerator1] = useState("");
  const [numerator2, setNumerator2] = useState("");
  const [denominator1, setDenominator1] = useState("");
  const [denominator2, setDenominator2] = useState("");

  const handleSubmit = () => {
    const expression = `K_a = \\frac{[${numerator1}][${numerator2}]}{[${denominator1}][${denominator2}]}`;
    onSubmit(expression);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Ka Expression Preview */}
          <div className="text-2xl flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <div className="border border-gray-300 rounded px-2 py-1 min-w-[100px] text-center">
                {numerator1 ? `[${numerator1}]` : "[ ]"}
              </div>
              <div className="border border-gray-300 rounded px-2 py-1 min-w-[100px] text-center">
                {numerator2 ? `[${numerator2}]` : "[ ]"}
              </div>
            </div>
            <div className="w-full border-t border-gray-300 my-2"></div>
            <div className="flex items-center space-x-2">
              <div className="border border-gray-300 rounded px-2 py-1 min-w-[100px] text-center">
                {denominator1 ? `[${denominator1}]` : "[ ]"}
              </div>
              <div className="border border-gray-300 rounded px-2 py-1 min-w-[100px] text-center">
                {denominator2 ? `[${denominator2}]` : "[ ]"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid gap-4">
        <div>
          <Label htmlFor="numerator1">First Numerator Molecule</Label>
          <Input
            id="numerator1"
            value={numerator1}
            onChange={(e) => setNumerator1(e.target.value)}
            placeholder="Enter molecule"
            className="w-full mt-1"
          />
        </div>

        <div>
          <Label htmlFor="numerator2">Second Numerator Molecule</Label>
          <Input
            id="numerator2"
            value={numerator2}
            onChange={(e) => setNumerator2(e.target.value)}
            placeholder="Enter molecule"
            className="w-full mt-1"
          />
        </div>

        <div>
          <Label htmlFor="denominator1">First Denominator Molecule</Label>
          <Input
            id="denominator1"
            value={denominator1}
            onChange={(e) => setDenominator1(e.target.value)}
            placeholder="Enter molecule"
            className="w-full mt-1"
          />
        </div>

        <div>
          <Label htmlFor="denominator2">Second Denominator Molecule</Label>
          <Input
            id="denominator2"
            value={denominator2}
            onChange={(e) => setDenominator2(e.target.value)}
            placeholder="Enter molecule"
            className="w-full mt-1"
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!numerator1 || !numerator2 || !denominator1 || !denominator2}
      >
        Submit Answer
      </Button>
    </div>
  );
}
