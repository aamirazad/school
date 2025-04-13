"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

interface TextInputProps {
  onSubmit: (answer: string) => void;
}

export function TextInput({ onSubmit }: TextInputProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(`\\text{${answer}}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full"
      />

      <Button type="submit" className="w-full" disabled={!answer.trim()}>
        Submit Answer
      </Button>
    </form>
  );
}
