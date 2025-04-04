"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface LewisDotProps {
  onSubmit: (answer: string) => void;
  review?: boolean;
  structure?: string;
}

export function LewisDot({
  onSubmit,
  review = false,
  structure,
}: LewisDotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initialStructure = {
    atoms: [
      { id: "O", x: 150, y: 100, element: "O" },
      { id: "H1", x: 70, y: 100, element: "H" },
      { id: "H2", x: 230, y: 100, element: "H" },
    ],
    electrons: [] as { x: number; y: number }[],
    bonds: [] as { from: string; to: string }[],
  };

  const [currentStructure, setCurrentStructure] = useState(initialStructure);
  const [tool, setTool] = useState<"bond" | "electron">("bond");
  const [selectedAtom, setSelectedAtom] = useState<string | null>(null);

  useEffect(() => {
    if (review && structure) {
      setCurrentStructure(JSON.parse(structure));
    }
  }, [review, structure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw atoms
    currentStructure.atoms.forEach((atom) => {
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(atom.element, atom.x, atom.y);
    });

    // Draw bonds
    currentStructure.bonds.forEach((bond) => {
      const fromAtom = currentStructure.atoms.find((a) => a.id === bond.from);
      const toAtom = currentStructure.atoms.find((a) => a.id === bond.to);
      if (fromAtom && toAtom) {
        ctx.beginPath();
        ctx.moveTo(fromAtom.x + 10, fromAtom.y);
        ctx.lineTo(toAtom.x - 10, toAtom.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw electrons
    currentStructure.electrons.forEach((electron) => {
      ctx.beginPath();
      ctx.arc(electron.x, electron.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
    });

    // Highlight selected atom if any
    if (selectedAtom) {
      const atom = currentStructure.atoms.find((a) => a.id === selectedAtom);
      if (atom) {
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, 25, 0, Math.PI * 2);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [currentStructure, selectedAtom]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (review) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked near an atom
    const clickedAtom = currentStructure.atoms.find(
      (atom) => Math.hypot(atom.x - x, atom.y - y) < 20
    );

    if (tool === "bond") {
      if (clickedAtom) {
        if (selectedAtom === null) {
          setSelectedAtom(clickedAtom.id);
        } else if (selectedAtom !== clickedAtom.id) {
          setCurrentStructure((prev) => ({
            ...prev,
            bonds: [...prev.bonds, { from: selectedAtom, to: clickedAtom.id }],
          }));
          setSelectedAtom(null);
        }
      }
    } else if (tool === "electron") {
      setCurrentStructure((prev) => ({
        ...prev,
        electrons: [...prev.electrons, { x, y }],
      }));
    }
  };

  const clear = () => {
    setCurrentStructure(initialStructure);
  };

  if (review) {
    return (
      <canvas
        ref={canvasRef}
        width={300}
        height={200}
        className="border bg-white"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Button
          onClick={() => setTool("bond")}
          variant={tool === "bond" ? "default" : "outline"}
        >
          Draw Bond
        </Button>
        <Button
          onClick={() => setTool("electron")}
          variant={tool === "electron" ? "default" : "outline"}
        >
          Add Electron
        </Button>
        <Button variant={"secondary"} onClick={clear}>
          Clear
        </Button>
      </div>

      <div className="border rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          onClick={handleCanvasClick}
          className="border bg-white"
        />
      </div>

      <Button
        onClick={() => onSubmit(JSON.stringify(currentStructure))}
        className="w-full"
      >
        Submit Structure
      </Button>
    </div>
  );
}
