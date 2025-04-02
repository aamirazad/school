import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InputQuestion({ question }: { question: string }) {
  return (
    <>
      <Label htmlFor="answer" className=" font-medium block">
        Your answer:
      </Label>
      <div className="flex items-center space-x-3">
        <Input id="answer" type="text" name="answer" className="bg-slate-300" />
      </div>
    </>
  );
}
