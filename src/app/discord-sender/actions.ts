"use server";

const WEBHOOK_URL = `https://discord.com/api/webhooks/1376669459108069397/${process.env.DISCORD_WEBHOOK_TOKEN}`;
const VALID_PASSWORD = process.env.DISCORD_VALID_PASSWORD;

// Extract webhook ID and token from the URL
const WEBHOOK_ID = "1376669459108069397";
const WEBHOOK_TOKEN = process.env.DISCORD_WEBHOOK_TOKEN;

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

export async function fetchDiscordMessage(prevState: any, formData: FormData) {
  const messageId = formData.get("messageId") as string;

  if (!messageId) {
    return {
      error: "Message ID is required",
      success: false,
    };
  }

  try {
    const response = await fetch(
      `https://discord.com/api/webhooks/${WEBHOOK_ID}/${WEBHOOK_TOKEN}/messages/${messageId}`,
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
  const content = formData.get("content") as string;
  const useEmbed = formData.get("use-embed") === "true";
  const editingMessageId = formData.get("editing-message-id") as string;

  // Validate basic inputs
  if (!username) {
    return {
      error: "Username is required",
      success: false,
    };
  }

  if (!content && !useEmbed) {
    return {
      error: "Either message content or embed is required",
      success: false,
    };
  }

  if (content && content.length > 2000) {
    return {
      error: "Message content cannot exceed 2000 characters",
      success: false,
    };
  }

  try {
    // Prepare the Discord webhook payload
    const payload: any = {
      username: username.trim(),
      avatar_url:
        "https://files.aamira.me/inbox/7846690e25ca5ecdb6bd3d1ca9b7c800.webp",
      allowed_mentions: {
        parse: ["users", "roles", "everyone"],
      },
    };

    // Add content if provided
    if (content) {
      payload.content = content.trim();
    }

    // Build embed if requested
    if (useEmbed) {
      const embed: any = {
        type: "rich",
      };

      // Basic embed fields
      const embedTitle = formData.get("embed-title") as string;
      const embedDescription = formData.get("embed-description") as string;
      const embedUrl = formData.get("embed-url") as string;
      const embedColor = formData.get("embed-color") as string;
      const embedTimestamp = formData.get("embed-timestamp") as string;

      if (embedTitle) {
        if (embedTitle.length > 256) {
          return {
            error: "Embed title cannot exceed 256 characters",
            success: false,
          };
        }
        embed.title = embedTitle.trim();
      }

      if (embedDescription) {
        if (embedDescription.length > 4096) {
          return {
            error: "Embed description cannot exceed 4096 characters",
            success: false,
          };
        }
        embed.description = embedDescription.trim();
      }

      if (embedUrl) {
        embed.url = embedUrl.trim();
      }

      if (embedColor) {
        // Convert hex color to integer
        const colorHex = embedColor.replace("#", "");
        if (/^[0-9A-F]{6}$/i.test(colorHex)) {
          embed.color = Number.parseInt(colorHex, 16);
        }
      }

      if (embedTimestamp) {
        embed.timestamp = new Date(embedTimestamp).toISOString();
      }

      // Author
      const authorName = formData.get("embed-author-name") as string;
      const authorUrl = formData.get("embed-author-url") as string;
      const authorIcon = formData.get("embed-author-icon") as string;

      if (authorName) {
        if (authorName.length > 256) {
          return {
            error: "Author name cannot exceed 256 characters",
            success: false,
          };
        }
        embed.author = { name: authorName.trim() };
        if (authorUrl) embed.author.url = authorUrl.trim();
        if (authorIcon) embed.author.icon_url = authorIcon.trim();
      }

      // Footer
      const footerText = formData.get("embed-footer-text") as string;
      const footerIcon = formData.get("embed-footer-icon") as string;

      if (footerText) {
        if (footerText.length > 2048) {
          return {
            error: "Footer text cannot exceed 2048 characters",
            success: false,
          };
        }
        embed.footer = { text: footerText.trim() };
        if (footerIcon) embed.footer.icon_url = footerIcon.trim();
      }

      // Media
      const imageUrl = formData.get("embed-image") as string;
      const thumbnailUrl = formData.get("embed-thumbnail") as string;

      if (imageUrl) {
        embed.image = { url: imageUrl.trim() };
      }

      if (thumbnailUrl) {
        embed.thumbnail = { url: thumbnailUrl.trim() };
      }

      // Fields
      const fieldsCount =
        Number.parseInt(formData.get("embed-fields-count") as string) || 0;
      if (fieldsCount > 0) {
        embed.fields = [];
        let totalCharacters = 0;

        for (let i = 0; i < fieldsCount; i++) {
          const fieldName = formData.get(`embed-field-name-${i}`) as string;
          const fieldValue = formData.get(`embed-field-value-${i}`) as string;
          const fieldInline =
            formData.get(`embed-field-inline-${i}`) === "true";

          if (fieldName && fieldValue) {
            if (fieldName.length > 256) {
              return {
                error: `Field ${i + 1} name cannot exceed 256 characters`,
                success: false,
              };
            }
            if (fieldValue.length > 1024) {
              return {
                error: `Field ${i + 1} value cannot exceed 1024 characters`,
                success: false,
              };
            }

            totalCharacters += fieldName.length + fieldValue.length;
            embed.fields.push({
              name: fieldName.trim(),
              value: fieldValue.trim(),
              inline: fieldInline,
            });
          }
        }

        // Check total character limit across all embed fields
        const titleChars = embed.title?.length || 0;
        const descChars = embed.description?.length || 0;
        const authorChars = embed.author?.name?.length || 0;
        const footerChars = embed.footer?.text?.length || 0;

        if (
          titleChars + descChars + authorChars + footerChars + totalCharacters >
          6000
        ) {
          return {
            error: "Total embed characters cannot exceed 6000 characters",
            success: false,
          };
        }
      }

      payload.embeds = [embed];
    }

    // Determine if we're editing or creating a new message
    const isEditing = !!editingMessageId;
    const method = isEditing ? "PATCH" : "POST";
    const url = isEditing
      ? `https://discord.com/api/webhooks/${WEBHOOK_ID}/${WEBHOOK_TOKEN}/messages/${editingMessageId}?wait=true`
      : `${WEBHOOK_URL}?wait=true`;

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
