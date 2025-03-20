"use server";

import { revalidatePath } from "next/cache";

export async function checkAnswer(formData: FormData) {
  try {
    const answer = formData.get("answer") as string; // Get the answer from the form

    // Replace this with your actual answer checking logic
    // This is a simplified example
    const isCorrect = answer === "correct"; //Example validation
    if (isCorrect) {
      return { isCorrect: true, message: "Correct!" };
    } else {
      return { isCorrect: false, message: "Incorrect. Try again." };
    }
  } catch (error) {
    console.error("Error checking answer:", error);
    return { isCorrect: false, message: "An error occurred." };
  } finally {
    revalidatePath("/"); // Revalidate the route after the action
  }
}
