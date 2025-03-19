import { Label } from "@/components/ui/label";
import type { questions } from "../page";
import Latex from "react-latex-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

export default function Question({
  question,
  handleSubmit,
}: {
  question: (typeof questions)[0];
  handleSubmit: (question: number, e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const index = question.id;
  const answerSchema = z.string()
  return (
    <div className="bg-gray-900 p-4 rounded-md mb-4 transition-shadow duration-500">
      <p className="font-semibold mb-2">Question :</p>
      <p className="mb-4 prose">
        <Latex>Instructions</Latex>
      </p>
      <form onSubmit={(e) => handleSubmit(index, e)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`answer-${index}`} className="">
            Your answer:
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`answer-${index}`}
              type="text"
              placeholder={`Enter your answer in ${question.type}`}
              className="grow"
            />
            <span className="text-gray-500">
              <Latex>${question.type}$</Latex>
            </span>
          </div>
        </div>

        {/* {errors[index] && <p className="text-red-300">{errors[index]}</p>} */}

        <div className="space-x-2">
          <Button
            className="bg-slate-600 hover:bg-slate-700"
            type="submit"
          >
            Submit
          </Button>

        </div>
      </form>
    </div>
  );
}
