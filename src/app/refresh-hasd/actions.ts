"use server";

const VALID_PASSWORD = process.env.REFRESH_PASSWORD;
const DEPLOY_HOOK = process.env.REFRESH_DEPLOY_HOOK;

export async function validatePassword(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;

  if (!password) {
    return {
      error: "Password is required",
      success: false,
    };
  }

  if (password !== VALID_PASSWORD) {
    return {
      error: "Invalid password",
      success: false,
    };
  }

  return {
    success: true,
  };
}

export async function refreshContent(prevState: any, formData: FormData) {
  if (!DEPLOY_HOOK) {
    return {
      error: "Deployment URL not configured",
      success: false,
    };
  }

  try {
    const response = await fetch("https://db.aamirazad.com/");

    if (response.status !== 404) {
      return {
        error: "Aamir's database is offline, refreshing is currently disabled",
        success: false,
      };
    }
  } catch {
    return {
      error: "Aamir's database is offline, refreshing is currently disabled",
      success: false,
    };
  }

  try {
    const response = await fetch(DEPLOY_HOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        error: `Failed to trigger deployment: ${response.status} ${response.statusText}`,
        success: false,
      };
    }

    return {
      success: true,
      message:
        "Deployment triggered successfully. The site will be refreshed in approximately 12 seconds.",
    };
  } catch (error) {
    console.error("Error triggering deployment:", error);
    return {
      error: "Failed to trigger deployment. Please try again.",
      success: false,
    };
  }
}
