"use server";

const WEBHOOK_URL = `https://discord.com/api/webhooks/1376669459108069397/${process.env.DISCORD_WEBHOOK_TOKEN}`;
const VALID_PASSWORD = "password";

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

export async function sendDiscordMessage(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const content = formData.get("content") as string;

  // Validate inputs
  if (!username || !content) {
    return {
      error: "Username and content are required",
      success: false,
    };
  }

  if (content.length > 2000) {
    return {
      error: "Message content cannot exceed 2000 characters",
      success: false,
    };
  }

  try {
    let avatar_url: string | null; // Declare avatar_url outside the if/else

    if (username.trim() === "Aamir Azad") {
      avatar_url =
        "https://files.aamira.me/inbox/7846690e25ca5ecdb6bd3d1ca9b7c800.webp";
    } else {
      avatar_url = null;
    }

    // Prepare the Discord webhook payload
    const payload = {
      content: content.trim(),
      username: username.trim(),
      avatar_url: avatar_url, // Now avatar_url is accessible here
      allowed_mentions: {
        parse: ["users", "roles", "everyone"],
      },
    };

    // Send to Discord webhook with wait=true for confirmation
    const response = await fetch(`${WEBHOOK_URL}?wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Discord API Error:", errorData);

      if (response.status === 429) {
        return {
          error: "Rate limited. Please wait before sending another message.",
          success: false,
        };
      }

      return {
        error: `Failed to send message: ${response.status} ${response.statusText}`,
        success: false,
      };
    }

    const result = await response.json();
    console.log("Message sent successfully:", result.id);

    return {
      success: true,
      messageId: result.id,
    };
  } catch (error) {
    console.error("Error sending Discord message:", error);
    return {
      error: "Failed to send message. Please try again.",
      success: false,
    };
  }
}
