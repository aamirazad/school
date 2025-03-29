type QuestionFormat = "text" | "drawing" | "table" | "dragdrop";

interface Question {
  id: number;
  time: number;
  prompt: string;
  format: QuestionFormat;
  answer: string;
  unit: string;
}

export const questions: Question[] = [
  {
    id: 1,
    time: 2,
    prompt: "What is the capital of France?",
    format: "text",
    answer: "Paris",
    unit: "cm^{3}",
  },
];
