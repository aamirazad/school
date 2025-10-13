"use server";

const VALID_PASSWORD = process.env.DISCORD_VALID_PASSWORD;

export async function validatePassword(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;
  const webhookId = formData.get("webhook-id") as string;
  const webhookToken = formData.get("webhook-token") as string;

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

  // Use environment variables as defaults if webhook fields are empty
  const finalWebhookId = webhookId || process.env.DISCORD_WEBHOOK_ID || "";
  const finalWebhookToken =
    webhookToken || process.env.DISCORD_WEBHOOK_TOKEN || "";

  if (!finalWebhookId || !finalWebhookToken) {
    return {
      error:
        "Webhook configuration is missing. Please provide webhook details or set environment variables.",
      success: false,
    };
  }

  // Basic validation for webhook ID (should be numeric)
  if (!/^\d+$/.test(finalWebhookId)) {
    return {
      error: "Webhook ID should be numeric",
      success: false,
    };
  }

  return {
    success: true,
    webhookConfig: {
      id: finalWebhookId,
      token: finalWebhookToken,
    },
  };
}

export async function fetchDiscordMessage(prevState: any, formData: FormData) {
  const messageId = formData.get("messageId") as string;
  const webhookId = formData.get("webhookId") as string;
  const webhookToken = formData.get("webhookToken") as string;

  if (!messageId) {
    return {
      error: "Message ID is required",
      success: false,
    };
  }

  if (!webhookId || !webhookToken) {
    return {
      error: "Webhook configuration is missing",
      success: false,
    };
  }

  try {
    const response = await fetch(
      `https://discord.com/api/webhooks/${webhookId}/${webhookToken}/messages/${messageId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          error: "Message not found. Please check the message ID.",
          success: false,
        };
      }
      return {
        error: `Failed to fetch message: ${response.status} ${response.statusText}`,
        success: false,
      };
    }

    const messageData = await response.json();

    return {
      success: true,
      messageId: messageId,
      messageData: messageData,
    };
  } catch (error) {
    console.error("Error fetching Discord message:", error);
    return {
      error: "Failed to fetch message. Please try again.",
      success: false,
    };
  }
}

export async function sendDiscordMessage(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const useJsonMode = formData.get("use-json-mode") === "true";
  const editingMessageId = formData.get("editing-message-id") as string;
  const webhookId = formData.get("webhook-id") as string;
  const webhookToken = formData.get("webhook-token") as string;

  // Validate basic inputs
  if (!username) {
    return {
      error: "Username is required",
      success: false,
    };
  }

  if (!webhookId || !webhookToken) {
    return {
      error: "Webhook configuration is missing",
      success: false,
    };
  }

  try {
    let payload: any = {
      username: username.trim(),
      avatar_url:
        "https://files.aamirazad.com/inbox/7846690e25ca5ecdb6bd3d1ca9b7c800.webp",
      allowed_mentions: {
        parse: ["users", "roles", "everyone"],
      },
    };

    if (useJsonMode) {
      // JSON Mode - parse the JSON content
      const jsonContent = formData.get("json-content") as string;

      if (!jsonContent) {
        return {
          error: "JSON content is required in JSON mode",
          success: false,
        };
      }

      try {
        const parsedJson = JSON.parse(jsonContent);

        // Merge the parsed JSON with the base payload
        // The JSON can override content, embeds, etc. but we keep username and avatar
        payload = {
          ...payload,
          ...parsedJson,
          // Preserve username and avatar from form
          username: username.trim(),
          avatar_url:
            "https://files.aamirazad.com/inbox/7846690e25ca5ecdb6bd3d1ca9b7c800.webp",
        };
      } catch (jsonError) {
        return {
          error: "Invalid JSON format. Please check your JSON syntax.",
          success: false,
        };
      }
    } else {
      // Simple Mode - just content
      const content = formData.get("content") as string;

      if (!content) {
        return {
          error: "Message content is required",
          success: false,
        };
      }

      if (content.length > 2000) {
        return {
          error: "Message content cannot exceed 2000 characters",
          success: false,
        };
      }

      payload.content = content.trim();

      // When editing in simple mode, explicitly clear embeds to remove any existing ones
      if (editingMessageId) {
        payload.embeds = [];
      }
    }

    // Determine if we're editing or creating a new message
    const isEditing = !!editingMessageId;
    const method = isEditing ? "PATCH" : "POST";
    const url = isEditing
      ? `https://discord.com/api/webhooks/${webhookId}/${webhookToken}/messages/${editingMessageId}?wait=true`
      : `https://discord.com/api/webhooks/${webhookId}/${webhookToken}?wait=true`;

    // For editing, we don't send username and avatar_url
    if (isEditing) {
      delete payload.username;
      delete payload.avatar_url;
    }

    // Send to Discord webhook
    const response = await fetch(url, {
      method: method,
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

      if (response.status === 404 && isEditing) {
        return {
          error: "Message not found. It may have been deleted.",
          success: false,
        };
      }

      if (response.status === 400) {
        return {
          error: "Invalid message format. Please check your JSON structure.",
          success: false,
        };
      }

      return {
        error: `Failed to ${isEditing ? "update" : "send"} message: ${response.status} ${response.statusText}`,
        success: false,
      };
    }

    const result = await response.json();
    console.log(
      `Message ${isEditing ? "updated" : "sent"} successfully:`,
      result.id,
    );

    return {
      success: true,
      messageId: result.id,
      isEdit: isEditing,
    };
  } catch (error) {
    console.error("Error sending Discord message:", error);
    return {
      error: `Failed to ${editingMessageId ? "update" : "send"} message. Please try again.`,
      success: false,
    };
  }
}
