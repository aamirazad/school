"use server";

export async function checkAnswer(prevState: any, formData: FormData) {
  console.log(formData.get("answer"));
  return { message: "Correct!" };
}
