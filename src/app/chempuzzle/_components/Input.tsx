import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Latex from "react-latex-next";

export function InputQuestion({ question }: { question: string }) {
  return (
    <>
      <Label htmlFor="answer" className=" font-medium block">
        Your answer:
      </Label>
      <div className="flex items-center space-x-3">
        <Input id="answer" type="text" name="answer" className="bg-slate-300" />
        <span className="text-gray-600 bg-gray-100 px-3 py-2 rounded-md whitespace-nowrap border border-gray-200">
          <Latex>${question}$</Latex>
        </span>
      </div>
    </>
  );
}
