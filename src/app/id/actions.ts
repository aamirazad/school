"use server";

// Turnstile verification function
async function verifyTurnstile(token: string): Promise<boolean> {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.error("TURNSTILE_SECRET_KEY not found");
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

export async function createAccount(name: string, email: string) {
  if (!isValidEmail(email)) {
    return { error: "Invalid Email" };
  }

  if (!process.env.POCKET_ID_API_KEY) {
    return { error: "Server error" };
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
      requestOptions
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response);
      return { error: `API Error: ${response.status} ${response.statusText}` };
    }
    return { success: "Account created" };
  } catch (error) {
    console.error("Network Error:", error);
    return { error: `Network Error: ${error}` };
  }
}

export async function sendEmailCode(email: string) {
  if (!isValidEmail(email)) {
    return { error: "Invalid Email" };
  }
  if (!process.env.POCKET_ID_API_KEY) {
    return { error: "Server error" };
  }
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "*/*");
  myHeaders.append("X-API-KEY", process.env.POCKET_ID_API_KEY);

  const raw = JSON.stringify({
    email: email,
    redirectPath: "/aamir-zulip-redirect",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(
      "https://id.aamira.me/api/one-time-access-email",
      requestOptions
    );

    if (!response.ok) {
      console.error("API Error:", response.status, response);
      return { error: `API Error: ${response.status} ${response.statusText}` };
    }
    return { success: "Email sent" };
  } catch (error) {
    console.error("Network Error:", error);
    return { error: `Network Error: ${error}` };
  }
}

// New combined server action that handles both account creation and email sending with Turnstile verification
export async function createAccountWithTurnstile(
  prevState: any,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const turnstileToken = formData.get("turnstileToken") as string;

  // Validate inputs
  if (!name?.trim()) {
    return { error: "Name is required", success: false };
  }

  if (!email?.trim()) {
    return { error: "Email is required", success: false };
  }

  if (!isValidEmail(email)) {
    return { error: "Invalid Email", success: false };
  }

  if (!turnstileToken) {
    return {
      error: "Please complete the security verification",
      success: false,
    };
  }

  // Verify Turnstile token
  const isTurnstileValid = await verifyTurnstile(turnstileToken);
  if (!isTurnstileValid) {
    return {
      error: "Security verification failed. Please try again.",
      success: false,
    };
  }

  // Create account
  const accountResult = await createAccount(name, email);
  if (accountResult.error) {
    return { error: accountResult.error, success: false };
  }

  // Send email code
  const emailResult = await sendEmailCode(email);
  if (emailResult.error) {
    return { error: emailResult.error, success: false };
  }

  return { success: true, error: "" };
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
