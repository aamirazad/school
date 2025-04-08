"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EquationBalancerProps {
  equation: string
  onSubmit: (answer: string) => void
}

export function EquationBalancer({ equation, onSubmit }: EquationBalancerProps) {
  const [balancedEquation, setBalancedEquation] = useState(equation)

  // Split the equation into reactants and products
  const [reactants, products] = equation.split("→").map((part) => part.trim())

  // Split reactants and products into individual components
  const reactantComponents = reactants.split("+").map((r) => r.trim())
  const productComponents = products.split("+").map((p) => p.trim())

  // Create state for coefficients
  const [reactantCoefficients, setReactantCoefficients] = useState<number[]>(reactantComponents.map(() => 1))
  const [productCoefficients, setProductCoefficients] = useState<number[]>(productComponents.map(() => 1))

  // Update the balanced equation when coefficients change
  const updateEquation = () => {
    const balancedReactants = reactantComponents
      .map((component, index) => {
        const coefficient = reactantCoefficients[index]
        return coefficient === 1 ? component : `${coefficient}${component}`
      })
      .join(" + ")

    const balancedProducts = productComponents
      .map((component, index) => {
        const coefficient = productCoefficients[index]
        return coefficient === 1 ? component : `${coefficient}${component}`
      })
      .join(" + ")

    return `${balancedReactants} → ${balancedProducts}`
  }

  // Handle coefficient change
  const handleCoefficientChange = (side: "reactants" | "products", index: number, value: string) => {
    const numValue = Number.parseInt(value) || 1

    if (side === "reactants") {
      const newCoefficients = [...reactantCoefficients]
      newCoefficients[index] = numValue
      setReactantCoefficients(newCoefficients)
    } else {
      const newCoefficients = [...productCoefficients]
      newCoefficients[index] = numValue
      setProductCoefficients(newCoefficients)
    }

    setBalancedEquation(updateEquation())
  }

  // Handle submission
  const handleSubmit = () => {
    onSubmit(balancedEquation)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Reactants</h4>
          {reactantComponents.map((component, index) => (
            <div key={`reactant-${index}`} className="flex items-center gap-2 mb-2">
              <Input
                type="number"
                min="1"
                max="20"
                value={reactantCoefficients[index]}
                onChange={(e) => handleCoefficientChange("reactants", index, e.target.value)}
                className="w-16"
              />
              <Label>{component}</Label>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-medium mb-2">Products</h4>
          {productComponents.map((component, index) => (
            <div key={`product-${index}`} className="flex items-center gap-2 mb-2">
              <Input
                type="number"
                min="1"
                max="20"
                value={productCoefficients[index]}
                onChange={(e) => handleCoefficientChange("products", index, e.target.value)}
                className="w-16"
              />
              <Label>{component}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded text-center text-lg font-medium">{balancedEquation}</div>

      <Button onClick={handleSubmit} className="w-full">
        Submit Answer
      </Button>
    </div>
  )
}

