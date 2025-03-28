import { Label } from "@/components/ui/label";
import Latex from "react-latex-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { checkAnswer } from "./actions";
import { useActionState } from "react";
import { questions } from "../questions";
import "katex/dist/katex.min.css";

const initialState = {
  message: "",
};

export default function Question({
  question,
}: {
  question: (typeof questions)[0];
}) {
  const [state, formAction] = useActionState(checkAnswer, initialState);

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 md:ml-6 md:mr-6 md:mt-6 max-w-md transition-all duration-300 hover:shadow-2xl border border-gray-200">
      <div className="mb-6">
        <h3 className="font-semibold text-lg text-indigo-900 mb-3 flex items-center">
          <span
            className={`${
              question.type === "multiple-choice"
                ? "bg-blue-600"
                : "bg-purple-600"
            } text-white px-2.5 py-1.5 rounded-full mr-3 text-sm font-bold`}
          >
            Q{question.id}
          </span>
          {question.title}
        </h3>

        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500 prose max-w-none">
          <Latex>question</Latex>
        </div>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="answer" className=" font-medium block">
            Your answer:
          </Label>

          <div className="flex items-center space-x-3">
            <Input
              id="answer"
              type="text"
              name="answer"
              className="bg-slate-300"
            />
            <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-md whitespace-nowrap border border-gray-200">
              <Latex>${question.unit}$</Latex>
            </span>
          </div>

          {state?.message && (
            <div
              className={`mt-3 text-sm p-3 rounded-lg ${
                state.message.includes("Correct")
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {state.message}
            </div>
          )}
        </div>

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
      </form>
    </div>
  );
}
