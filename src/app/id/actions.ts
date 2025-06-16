"use server";

import { redirect } from "next/navigation";

export async function createAccount(name: string, email: string) {
  if (!isValidEmail(email)) {
    return "Invalid Email";
  }

  if (!process.env.POCKET_ID_API_KEY) {
    return "Server error";
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "*/*");
  myHeaders.append("X-API-KEY", process.env.POCKET_ID_API_KEY);

  const raw = JSON.stringify({
    disabled: true,
    email: email,
    firstName: name.split(" ")[0],
    isAdmin: false,
    username: name.replaceAll(" ", "").toLowerCase(),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(
      "https://id.aamira.me/api/users",
      requestOptions,
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response);
      return `API Error: ${response.status} ${response.statusText}`;
    }

    // Only redirect if the response was OK (i.e., no API errors)
    redirect("https://hasd.zulipchat.com/register/");
  } catch (error) {
    console.error("Network Error:", error);
    return "Network error occurred";
  }
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
