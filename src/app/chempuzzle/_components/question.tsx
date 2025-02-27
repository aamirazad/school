import { Label } from "@/components/ui/label";
import type { questions } from "../page";
import Latex from "react-latex-next";
import { Input } from "@/components/ui/input";

export default function Question({
  question,
  handleSubmit,
}: {
  question: (typeof questions)[0];
  handleSubmit: (e: any, index: number) => null;
}) {
  const index = question.id;
  return (
    <div className="bg-gray-900 p-4 rounded-md mb-4 transition-shadow duration-500">
      <p className="font-semibold mb-2">Step :</p>
      <p className="mb-4 prose">
        <Latex>Instruactions</Latex>
      </p>
      <form onSubmit={(e) => handleSubmit(e, index)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`answer-${index}`} className="">
            Your answer:
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`answer-${index}`}
              type="text"
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              defaultValue={userAnswers[index]?.toString() || ""}
              placeholder={`Enter your answer in ${step.unit}`}
              className="flex-grow"
              disabled={index != currentStep || shadowColor == "green"}
            />
            <span className="text-gray-500">
              <Latex>${step.unit}$</Latex>
            </span>
          </div>
        </div>

        {errors[index] && <p className="text-red-300">{errors[index]}</p>}

        <div className="space-x-2">
          <Button
            className="bg-slate-600 hover:bg-slate-700"
            type="submit"
            disabled={index > currentStep}
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleHint(index)}
            disabled={index != currentStep}
          >
            {showHint[index] ? "Hide Hint" : "Need a hint?"}
          </Button>

          {showHint[index] && (
            <p className="mt-4 text-sm text-gray-300 bg-gray-900 p-2 rounded">
              <Latex>Hint: {step.hint}</Latex>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
