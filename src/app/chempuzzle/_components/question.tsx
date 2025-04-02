import { Label } from "@/components/ui/label";
import Latex from "react-latex-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { checkAnswer } from "./actions";
import { useActionState } from "react";
import { questions } from "../questions";
import "katex/dist/katex.min.css";
import { InputQuestion } from "./Input";

interface QuestionProps {
  question: (typeof questions)[0];
  response: (formData: FormData) => void;
}

const initialState = {
  message: "",
};

export default function Question({ question, response }: QuestionProps) {
  const renderQuestionContent = () => {
    switch (question.type) {
      case "short answer":
        return <InputQuestion question={question.prompt} />;
      case "drawing":
        return <Canvas />; // Pass relevant props to Canvas
      case "table":
        return <InteractiveTable />; // Pass relevant props to InteractiveTable
      case "dragdrop":
        return <DragDrop />; // Pass relevant props to DragDrop
      case "multiple-choice":
        return <MultipleChoice />;
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 md:ml-6 md:mr-6 md:mt-6 max-w-md transition-all duration-300 hover:shadow-2xl border border-gray-200">
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-indigo-900 mb-3 flex items-center">
          <span
            className={`bg-blue-600 text-white px-2.5 py-1.5 rounded-full mr-3 text-sm font-bold`}
          >
            Q{question.id}
          </span>
          <Latex>{question.prompt}</Latex>
        </h3>
      </div>

      <form action={response} className="space-y-5">
        <div className="space-y-3">
          {renderQuestionContent()}

          <div className="flex items-center justify-between pt-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              type="submit"
            >
              Submit Answer
            </Button>

            <div className="text-xs text-gray-500">
              Question {question.id} of 4
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
