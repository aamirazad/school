type QuestionType = "short answer" | "drawing" | "table" | "dragdrop";

interface Question {
  id: number;
  time: number;
  prompt: string;
  type: QuestionType;
  answer: string;
  unit: string;
}

export const questions: Question[] = [
  {
    id: 1,
    time: 3,
    prompt: "What is the capital of France?",
    type: "short answer",
    answer: "Paris",
    unit: "cm^{3}",
  },
];
