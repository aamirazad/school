"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Latex from "react-latex-next";

interface KaExpressionProps {
  onSubmit: (answer: string) => void;
}

export function KaExpression({ onSubmit }: KaExpressionProps) {
  // Extract the conjugate base from the acid formula (e.g., "HA" -> "A-")

  // State for each concentration value
  const [hPlus, setHPlus] = useState("");
  const [conjugateBase, setConjugateBase] = useState("");
  const [acidConc, setAcidConc] = useState("");

  // Calculate the Ka value when all inputs are filled
  const calculateKa = (): number | null => {
    if (!hPlus || !conjugateBase || !acidConc) return null;

    const hPlusVal = parseFloat(hPlus);
    const baseVal = parseFloat(conjugateBase);
    const acidVal = parseFloat(acidConc);

    if (isNaN(hPlusVal) || isNaN(baseVal) || isNaN(acidVal) || acidVal === 0)
      return null;

    return (hPlusVal * baseVal) / acidVal;
  };

  // Format the Ka expression as a string
  const formatKaExpression = (): string => {
    const ka = calculateKa();
    if (ka === null) return "";

    // Format to scientific notation if very small
    return ka < 0.001 ? ka.toExponential(4) : ka.toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kaValue = formatKaExpression();
    if (kaValue) {
      onSubmit(kaValue);
    }
  };

  const equation = `$\\text{HCOOH}_{(aq)} + \\text{H}_2O_{(l)} \\rightleftharpoons \\text{H}_3O^+_{(aq)} + \\text{HCOO}^-_{(aq)}$`;
  const acid = `$\\text{HCOOH}_{(aq)}$`;
  const base = `$\\text{H}_2\\text{O}_{(l)}$`;
  const conjAcid = `$\\text{H}_3\\text{O}^+_{(aq)}$`;
  const conjBase = `$\\text{HCOO}^-_{(aq)}$`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-lg font-medium mb-2">
          <Latex>{equation}</Latex>
        </p>
        <div className="flex items-center justify-center">
          <div className="text-2xl">
            <Latex>{`$K_a = \\frac{[\\text{H}_3\\text{O}^+] [\\text{HCOO}^-]}{[\\text{HCOOH}]}$`}</Latex>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="h-plus">
            Concentration of <Latex>{conjAcid}</Latex> (mol/L)
          </Label>
          <Input
            id="h-plus"
            type="number"
            step="0.0001"
            min="0"
            value={hPlus}
            onChange={(e) => setHPlus(e.target.value)}
            placeholder={`Enter value`}
            className="w-full mt-1"
          />
        </div>

        <div>
          <Label htmlFor="conjugate-base">
            Concentration of <Latex>{conjBase}</Latex> (mol/L)
          </Label>
          <Input
            id="conjugate-base"
            type="number"
            step="0.0001"
            min="0"
            value={conjugateBase}
            onChange={(e) => setConjugateBase(e.target.value)}
            placeholder={`Enter value`}
            className="w-full mt-1"
          />
        </div>

        <div>
          <Label htmlFor="acid">
            Concentration of <Latex>{acid}</Latex> (mol/L)
          </Label>
          <Input
            id="acid"
            type="number"
            step="0.0001"
            min="0.0001"
            value={acidConc}
            onChange={(e) => setAcidConc(e.target.value)}
            placeholder={`Enter value`}
            className="w-full mt-1"
          />
        </div>
      </div>

      {calculateKa() !== null && (
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="font-medium">
            K<sub>a</sub> = {formatKaExpression()}
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={calculateKa() === null}
      >
        Submit Answer
      </Button>
    </form>
  );
}
