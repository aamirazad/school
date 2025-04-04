"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface DipoleArrowsProps {
  onSubmit: (answer: string) => void
}

export function DipoleArrows({ onSubmit }: DipoleArrowsProps) {
  const [arrowDirection, setArrowDirection] = useState<"left" | "right" | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw the H-Cl bond and arrow
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up dimensions
    const centerY = canvas.height / 2
    const leftX = canvas.width * 0.3
    const rightX = canvas.width * 0.7

    // Draw H and Cl atoms
    ctx.font = "24px Arial"
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText("H", leftX, centerY)
    ctx.fillText("Cl", rightX, centerY)

    // Draw bond line
    ctx.beginPath()
    ctx.moveTo(leftX + 15, centerY)
    ctx.lineTo(rightX - 15, centerY)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw arrow if direction is selected
    if (arrowDirection) {
      ctx.beginPath()

      if (arrowDirection === "right") {
        // Arrow from H to Cl
        const arrowStartX = leftX + 25
        const arrowEndX = rightX - 25

        // Arrow line
        ctx.moveTo(arrowStartX, centerY - 15)
        ctx.lineTo(arrowEndX, centerY - 15)

        // Arrow head
        ctx.lineTo(arrowEndX - 10, centerY - 20)
        ctx.moveTo(arrowEndX, centerY - 15)
        ctx.lineTo(arrowEndX - 10, centerY - 10)
      } else {
        // Arrow from Cl to H
        const arrowStartX = rightX - 25
        const arrowEndX = leftX + 25

        // Arrow line
        ctx.moveTo(arrowStartX, centerY - 15)
        ctx.lineTo(arrowEndX, centerY - 15)

        // Arrow head
        ctx.lineTo(arrowEndX + 10, centerY - 20)
        ctx.moveTo(arrowEndX, centerY - 15)
        ctx.lineTo(arrowEndX + 10, centerY - 10)
      }

      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [arrowDirection])

  const handleSubmit = () => {
    if (!arrowDirection) return

    const answer = arrowDirection === "right" ? "H→Cl" : "Cl→H"
    onSubmit(answer)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border">
        <canvas ref={canvasRef} width={400} height={150} className="w-full" />
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant={arrowDirection === "left" ? "default" : "outline"}
          onClick={() => setArrowDirection("left")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Cl to H
        </Button>

        <Button
          variant={arrowDirection === "right" ? "default" : "outline"}
          onClick={() => setArrowDirection("right")}
          className="flex items-center gap-2"
        >
          H to Cl
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={handleSubmit} className="w-full" disabled={!arrowDirection}>
        Submit Answer
      </Button>
    </div>
  )
}

