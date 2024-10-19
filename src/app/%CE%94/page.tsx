"use client";

import { useState } from "react";
import { gas } from "./questions/gas";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  answer: z.number(),
});

export default function DeltaChem() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState<boolean[]>(
    Array(gas.length).fill(false)
  );

  const toggleHint = (index: number) => {
    setShowHint((prev) => {
      const newShowHint = [...prev];
      newShowHint[index] = !newShowHint[index];
      return newShowHint;
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("✅" + values);
  }

  return (
    <main className="max-w-2xl mx-auto p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Δ Chem</h1>
      {gas[currentQuestion].map((step, index) => (
        <div
          key={index}
          className={`mb-6 ${index > currentStep ? "opacity-50" : ""}`}
        >
          <div className="bg-gray-900 p-4 rounded-md mb-4">
            <p className="font-semibold mb-2">Step {index + 1}:</p>
            <p className="mb-4">{step.instruction}</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your answer:</FormLabel>
                      <FormControl className="flex-grow bg-slate-800 border-none">
                        <Input
                          placeholder={`Enter your answer in ${step.unit}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-x-2">
                  <Button
                    className="bg-slate-600 hover:bg-slate-700 mt-4"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toggleHint(index)}
                    disabled={index > currentStep}
                  >
                    {showHint[index] ? "Hide Hint" : "Need a hint?"}
                  </Button>

                  {showHint[index] && (
                    <p className="mt-4 text-sm text-gray-300 bg-gray-900 p-2 rounded">
                      Hint: {step.hint}
                    </p>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>
      ))}
    </main>
  );
}
