/* eslint-disable */
// look, I have spent a little time as possible on this. I want it to be just barely functional, and nothing more.

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Send,
  Lock,
  Copy,
  Edit,
  RefreshCw,
  Webhook,
  Code,
  FileText,
} from "lucide-react";
import {
  validatePassword,
  sendDiscordMessage,
  fetchDiscordMessage,
} from "./actions";
import { useActionState } from "react";

interface LastSentMessage {
  id: string;
  title?: string;
}

interface WebhookConfig {
  id: string;
  token: string;
}

export default function DiscordWebhookForm() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig | null>(
    null,
  );
  const [useJsonMode, setUseJsonMode] = useState(false);
  const [jsonContent, setJsonContent] = useState("");
  const [editingMessageId, setEditingMessageId] = useState("");
  const [lastSentMessage, setLastSentMessage] =
    useState<LastSentMessage | null>(null);
  const [fetchMessageId, setFetchMessageId] = useState("");
  const [loadedMessageJson, setLoadedMessageJson] = useState("");

  const [passwordState, passwordAction, passwordPending] = useActionState(
    validatePassword,
    undefined,
  );
  const [messageState, messageAction, messagePending] = useActionState(
    sendDiscordMessage,
    undefined,
  );
  const [fetchState, fetchAction, fetchPending] = useActionState(
    fetchDiscordMessage,
    undefined,
  );

  // Handle successful password validation
  if (
    passwordState?.success &&
    !isAuthenticated &&
    passwordState?.webhookConfig
  ) {
    setIsAuthenticated(true);
    setWebhookConfig(passwordState.webhookConfig);
  }

  // Handle successful message send
  useEffect(() => {
    if (messageState?.success && messageState?.messageId) {
      const title = useJsonMode
        ? "JSON Message"
        : (
            document.getElementById("content") as HTMLTextAreaElement
          )?.value?.substring(0, 50) || "Discord Message";

      setLastSentMessage({
        id: messageState.messageId,
        title: title,
      });
    }
  }, [messageState, useJsonMode]);

  // Handle successful message fetch
  useEffect(() => {
    if (fetchState?.success && fetchState?.messageData) {
      const data = fetchState.messageData;

      // Populate basic fields
      const usernameInput = document.getElementById(
        "username",
      ) as HTMLInputElement;
      if (usernameInput) usernameInput.value = data.author?.username || "";

      // Create JSON representation of the message content
      const messageJson: any = {};

      if (data.content) {
        messageJson.content = data.content;
      }

      if (data.embeds && data.embeds.length > 0) {
        messageJson.embeds = data.embeds;
      }

      // Set the JSON content and switch to JSON mode if there are embeds
      if (Object.keys(messageJson).length > 0) {
        setLoadedMessageJson(JSON.stringify(messageJson, null, 2));
        if (data.embeds && data.embeds.length > 0) {
          setUseJsonMode(true);
          setJsonContent(JSON.stringify(messageJson, null, 2));
        } else {
          // Simple message, populate content field
          const contentInput = document.getElementById(
            "content",
          ) as HTMLTextAreaElement;
          if (contentInput) contentInput.value = data.content || "";
        }
      }

      setEditingMessageId(fetchState.messageId);
      setFetchMessageId("");
    }
  }, [fetchState]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const copyLastMessage = async () => {
    if (lastSentMessage) {
      const textToCopy = `${lastSentMessage.title}\nMessage ID: ${lastSentMessage.id}`;
      await copyToClipboard(textToCopy);
    }
  };

  const copyMessageAsJson = async () => {
    if (loadedMessageJson) {
      await copyToClipboard(loadedMessageJson);
    }
  };

  const handleFetchMessage = () => {
    if (fetchMessageId.trim() && webhookConfig) {
      const formData = new FormData();
      formData.append("messageId", fetchMessageId.trim());
      formData.append("webhookId", webhookConfig.id);
      formData.append("webhookToken", webhookConfig.token);
      fetchAction(formData);
    }
  };

  const clearForm = () => {
    setEditingMessageId("");
    setUseJsonMode(false);
    setJsonContent("");
    setLastSentMessage(null);
    setLoadedMessageJson("");

    // Clear all form inputs except username (keep default)
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      const usernameInput = document.getElementById(
        "username",
      ) as HTMLInputElement;
      const currentUsername = usernameInput?.value;
      form.reset();
      if (usernameInput && currentUsername) {
        usernameInput.value = currentUsername;
      }
    }
  };

  const logout = () => {
    window.location.reload();
  };

  const validateJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return { valid: true, parsed };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/20">
              <Lock className="h-6 w-6 text-blue-400" />
            </div>
            <CardTitle className="text-white">Access Required</CardTitle>
            <CardDescription className="text-gray-400">
              Enter the password to access the Discord message form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={passwordAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Webhook className="h-4 w-4 text-blue-400" />
                  <Label className="text-gray-200">Webhook Configuration</Label>
                  <Badge
                    variant="secondary"
                    className="bg-gray-700 text-gray-300"
                  >
                    Optional
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-id" className="text-gray-200">
                    Webhook ID
                  </Label>
                  <Input
                    id="webhook-id"
                    name="webhook-id"
                    placeholder="Leave empty to use default"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500">
                    Optional - defaults to environment variable if empty
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-token" className="text-gray-200">
                    Webhook Token
                  </Label>
                  <Input
                    id="webhook-token"
                    name="webhook-token"
                    placeholder="Leave empty to use default"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500">
                    Optional - defaults to environment variable if empty
                  </p>
                </div>
              </div>

              {passwordState?.error && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-800"
                >
                  <AlertDescription className="text-red-400">
                    {passwordState.error}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={passwordPending}
              >
                {passwordPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Form"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Webhook Info Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/20">
                  <Webhook className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Connected to Webhook</p>
                  <p className="text-sm text-gray-400">
                    ID:{" "}
                    {webhookConfig?.id === "default"
                      ? "Default (env)"
                      : webhookConfig?.id}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Message Management Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Edit className="h-5 w-5" />
              Message Management
            </CardTitle>
            <CardDescription className="text-gray-400">
              Copy sent messages or load existing messages for editing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Last Sent Message */}
            {lastSentMessage && (
              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-800">
                <div>
                  <p className="font-medium text-green-400">
                    Message Sent Successfully!
                  </p>
                  <p className="text-sm text-green-300">
                    {lastSentMessage.title} • ID: {lastSentMessage.id}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLastMessage}
                  className="border-green-700 text-green-400 hover:bg-green-900/30"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            )}

            {/* Current Editing Status */}
            {editingMessageId && (
              <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-800">
                <div>
                  <p className="font-medium text-blue-400">Editing Mode</p>
                  <p className="text-sm text-blue-300">
                    Message ID: {editingMessageId}
                  </p>
                </div>
                <div className="flex gap-2">
                  {loadedMessageJson && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyMessageAsJson}
                      className="border-blue-700 text-blue-400 hover:bg-blue-900/30"
                    >
                      <Code className="h-4 w-4 mr-1" />
                      Copy JSON
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearForm}
                    className="border-blue-700 text-blue-400 hover:bg-blue-900/30"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    New Message
                  </Button>
                </div>
              </div>
            )}

            {/* Fetch Message */}
            <div className="space-y-2">
              <Label htmlFor="fetch-message-id" className="text-gray-200">
                Load Message for Editing
              </Label>
              <div className="flex gap-2">
                <Input
                  id="fetch-message-id"
                  value={fetchMessageId}
                  onChange={(e) => setFetchMessageId(e.target.value)}
                  placeholder="Enter message ID to edit"
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFetchMessage}
                  disabled={fetchPending || !fetchMessageId.trim()}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {fetchPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Load"
                  )}
                </Button>
              </div>
              {fetchState?.error && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-800"
                >
                  <AlertDescription className="text-red-400">
                    {fetchState.error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Send className="h-5 w-5" />
              Discord Message Sender
              {editingMessageId && (
                <Badge
                  variant="secondary"
                  className="bg-blue-900/30 text-blue-400"
                >
                  Editing
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {editingMessageId
                ? "Edit your existing Discord message"
                : "Send messages to Discord - use simple mode for basic messages or JSON mode for advanced formatting"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={messageAction} className="space-y-6">
              {/* Hidden fields */}
              {editingMessageId && (
                <input
                  type="hidden"
                  name="editing-message-id"
                  value={editingMessageId}
                />
              )}
              {webhookConfig && (
                <>
                  <input
                    type="hidden"
                    name="webhook-id"
                    value={webhookConfig.id}
                  />
                  <input
                    type="hidden"
                    name="webhook-token"
                    value={webhookConfig.token}
                  />
                </>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-200">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  defaultValue="Aamir Azad"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-json-mode"
                  checked={useJsonMode}
                  onCheckedChange={setUseJsonMode}
                />
                <Label htmlFor="use-json-mode" className="text-gray-200">
                  JSON Mode
                </Label>
                <Badge
                  variant="secondary"
                  className="bg-purple-900/30 text-purple-400"
                >
                  {useJsonMode ? (
                    <Code className="h-3 w-3 mr-1" />
                  ) : (
                    <FileText className="h-3 w-3 mr-1" />
                  )}
                  {useJsonMode ? "Advanced" : "Simple"}
                </Badge>
              </div>

              {/* Content Input */}
              {useJsonMode ? (
                <div className="space-y-2">
                  <Label htmlFor="json-content" className="text-gray-200">
                    Message JSON
                  </Label>
                  <Textarea
                    id="json-content"
                    name="json-content"
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    placeholder={`{
  "content": "Your message here",
  "embeds": [
    {
      "title": "Embed Title",
      "description": "Embed description",
      "color": 5814783,
      "author": {
        "name": "Author Name",
        "icon_url": "https://example.com/icon.png"
      }
    }
  ]
}`}
                    className="min-h-[300px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 font-mono text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Paste Discord webhook JSON format. Supports content,
                      embeds, and all Discord message features.
                    </p>
                    {jsonContent && (
                      <Badge
                        variant={
                          validateJson(jsonContent).valid
                            ? "default"
                            : "destructive"
                        }
                        className={
                          validateJson(jsonContent).valid
                            ? "bg-green-900/30 text-green-400"
                            : "bg-red-900/30 text-red-400"
                        }
                      >
                        {validateJson(jsonContent).valid
                          ? "Valid JSON"
                          : "Invalid JSON"}
                      </Badge>
                    )}
                  </div>
                  {jsonContent && !validateJson(jsonContent).valid && (
                    <Alert
                      variant="destructive"
                      className="bg-red-900/20 border-red-800"
                    >
                      <AlertDescription className="text-red-400">
                        JSON Error: {validateJson(jsonContent).error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-gray-200">
                    Message Content
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Enter your message content"
                    className="min-h-[120px] bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    maxLength={2000}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Simple text message (max 2000 characters)
                  </p>
                </div>
              )}

              {/* Hidden field to track mode */}
              <input
                type="hidden"
                name="use-json-mode"
                value={useJsonMode.toString()}
              />

              {messageState?.error && (
                <Alert
                  variant="destructive"
                  className="bg-red-900/20 border-red-800"
                >
                  <AlertDescription className="text-red-400">
                    {messageState.error}
                  </AlertDescription>
                </Alert>
              )}

              {messageState?.success && (
                <Alert className="bg-green-900/20 border-green-800">
                  <AlertDescription className="text-green-400">
                    {editingMessageId
                      ? "Message updated successfully!"
                      : "Message sent successfully to Discord!"}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={messagePending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {messagePending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingMessageId ? "Updating..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      {editingMessageId ? (
                        <Edit className="mr-2 h-4 w-4" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {editingMessageId
                        ? "Update Message"
                        : `Send ${useJsonMode ? "JSON" : "Message"}`}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
