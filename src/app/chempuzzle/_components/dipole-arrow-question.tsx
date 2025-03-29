"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DipoleArrowQuestionProps {
  id: string;
  question: string;
  moleculeImageUrl: string;
  correctAngle: number; // Angle in degrees where the arrow should point
  tolerance: number; // Tolerance in degrees
  onAnswer: (isCorrect: boolean) => void;
}

export default function DipoleArrowQuestion({
  id,
  question,
  moleculeImageUrl,
  correctAngle,
  tolerance = 15,
  onAnswer,
}: DipoleArrowQuestionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Center of the container
  const [angle, setAngle] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse/touch events for dragging
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenterX = containerRect.width / 2;
    const containerCenterY = containerRect.height / 2;

    // Get mouse/touch position
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate position relative to container
    const x = clientX - containerRect.left;
    const y = clientY - containerRect.top;

    // Calculate angle from center to mouse position
    const deltaX = x - containerCenterX;
    const deltaY = y - containerCenterY;
    const angleRad = Math.atan2(deltaY, deltaX);
    const angleDeg = (angleRad * 180) / Math.PI;

    // Update angle and position
    setAngle(angleDeg);

    // Calculate position for the arrow (constrained to a circle)
    const distance = Math.min(
      Math.sqrt(deltaX * deltaX + deltaY * deltaY),
      Math.min(containerRect.width, containerRect.height) / 2.5
    );
    const newX =
      50 + (Math.cos(angleRad) * distance * 100) / containerRect.width;
    const newY =
      50 + (Math.sin(angleRad) * distance * 100) / containerRect.height;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  // Check if the answer is correct
  const checkAnswer = () => {
    // Normalize angles to 0-360 range
    const normalizedCorrectAngle = ((correctAngle % 360) + 360) % 360;
    const normalizedUserAngle = ((angle % 360) + 360) % 360;

    // Calculate the smallest difference between angles
    let angleDiff = Math.abs(normalizedUserAngle - normalizedCorrectAngle);
    if (angleDiff > 180) {
      angleDiff = 360 - angleDiff;
    }

    const result = angleDiff <= tolerance;
    setIsCorrect(result);
    setSubmitted(true);
    onAnswer(result);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden select-none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
        >
          {/* Molecule image */}
          <img
            src={moleculeImageUrl || "/placeholder.svg"}
            alt="Molecule"
            className="absolute inset-0 w-full h-full object-contain p-4"
          />

          {/* Draggable arrow */}
          <div
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
          >
            <ArrowUp
              className={`w-12 h-12 ${
                submitted
                  ? isCorrect
                    ? "text-green-500"
                    : "text-red-500"
                  : "text-blue-500"
              }`}
            />
          </div>

          {/* Feedback text */}
          {submitted && (
            <div
              className={`absolute bottom-2 left-2 right-2 p-2 rounded text-white text-center ${
                isCorrect ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {isCorrect ? "Correct!" : "Try again!"}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={checkAnswer} disabled={submitted}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
