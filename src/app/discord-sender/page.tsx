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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Send,
  Lock,
  Plus,
  Trash2,
  Palette,
  Copy,
  Edit,
  RefreshCw,
} from "lucide-react";
import {
  validatePassword,
  sendDiscordMessage,
  fetchDiscordMessage,
} from "./actions";
import { useActionState } from "react";

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface LastSentMessage {
  id: string;
  title?: string;
}

export default function DiscordWebhookForm() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [useEmbed, setUseEmbed] = useState(false);
  const [embedFields, setEmbedFields] = useState<EmbedField[]>([]);
  const [editingMessageId, setEditingMessageId] = useState("");
  const [lastSentMessage, setLastSentMessage] =
    useState<LastSentMessage | null>(null);
  const [fetchMessageId, setFetchMessageId] = useState("");

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
  if (passwordState?.success && !isAuthenticated) {
    setIsAuthenticated(true);
  }

  // Handle successful message send
  useEffect(() => {
    if (messageState?.success && messageState?.messageId) {
      const title =
        (document.getElementById("embed-title") as HTMLInputElement)?.value ||
        (
          document.getElementById("content") as HTMLTextAreaElement
        )?.value?.substring(0, 50) ||
        "Discord Message";

      setLastSentMessage({
        id: messageState.messageId,
        title: title,
      });
    }
  }, [messageState]);

  // Handle successful message fetch
  useEffect(() => {
    if (fetchState?.success && fetchState?.messageData) {
      const data = fetchState.messageData;

      // Populate basic fields
      const usernameInput = document.getElementById(
        "username",
      ) as HTMLInputElement;
      const contentInput = document.getElementById(
        "content",
      ) as HTMLTextAreaElement;

      if (usernameInput) usernameInput.value = data.author?.username || "";
      if (contentInput) contentInput.value = data.content || "";

      // Check if message has embeds
      if (data.embeds && data.embeds.length > 0) {
        setUseEmbed(true);
        const embed = data.embeds[0];

        // Populate embed fields
        setTimeout(() => {
          const titleInput = document.getElementById(
            "embed-title",
          ) as HTMLInputElement;
          const descInput = document.getElementById(
            "embed-description",
          ) as HTMLTextAreaElement;
          const urlInput = document.getElementById(
            "embed-url",
          ) as HTMLInputElement;
          const colorInput = document.getElementById(
            "embed-color",
          ) as HTMLInputElement;
          const timestampInput = document.getElementById(
            "embed-timestamp",
          ) as HTMLInputElement;

          if (titleInput && embed.title) titleInput.value = embed.title;
          if (descInput && embed.description)
            descInput.value = embed.description;
          if (urlInput && embed.url) urlInput.value = embed.url;
          if (colorInput && embed.color) {
            colorInput.value = `#${embed.color.toString(16).padStart(6, "0")}`;
          }
          if (timestampInput && embed.timestamp) {
            const date = new Date(embed.timestamp);
            timestampInput.value = date.toISOString().slice(0, 16);
          }

          // Author fields
          const authorNameInput = document.getElementById(
            "embed-author-name",
          ) as HTMLInputElement;
          const authorUrlInput = document.getElementById(
            "embed-author-url",
          ) as HTMLInputElement;
          const authorIconInput = document.getElementById(
            "embed-author-icon",
          ) as HTMLInputElement;

          if (authorNameInput && embed.author?.name)
            authorNameInput.value = embed.author.name;
          if (authorUrlInput && embed.author?.url)
            authorUrlInput.value = embed.author.url;
          if (authorIconInput && embed.author?.icon_url)
            authorIconInput.value = embed.author.icon_url;

          // Footer fields
          const footerTextInput = document.getElementById(
            "embed-footer-text",
          ) as HTMLInputElement;
          const footerIconInput = document.getElementById(
            "embed-footer-icon",
          ) as HTMLInputElement;

          if (footerTextInput && embed.footer?.text)
            footerTextInput.value = embed.footer.text;
          if (footerIconInput && embed.footer?.icon_url)
            footerIconInput.value = embed.footer.icon_url;

          // Media fields
          const imageInput = document.getElementById(
            "embed-image",
          ) as HTMLInputElement;
          const thumbnailInput = document.getElementById(
            "embed-thumbnail",
          ) as HTMLInputElement;

          if (imageInput && embed.image?.url)
            imageInput.value = embed.image.url;
          if (thumbnailInput && embed.thumbnail?.url)
            thumbnailInput.value = embed.thumbnail.url;

          // Fields
          if (embed.fields && embed.fields.length > 0) {
            setEmbedFields(
              embed.fields.map((field) => ({
                name: field.name,
                value: field.value,
                inline: field.inline || false,
              })),
            );
          }
        }, 100);
      }

      setEditingMessageId(fetchState.messageId);
      setFetchMessageId("");
    }
  }, [fetchState]);

  const addEmbedField = () => {
    if (embedFields.length < 25) {
      setEmbedFields([...embedFields, { name: "", value: "", inline: false }]);
    }
  };

  const removeEmbedField = (index: number) => {
    setEmbedFields(embedFields.filter((_, i) => i !== index));
  };

  const updateEmbedField = (index: number, field: Partial<EmbedField>) => {
    const updated = embedFields.map((f, i) =>
      i === index ? { ...f, ...field } : f,
    );
    setEmbedFields(updated);
  };

  const copyToClipboard = async () => {
    if (lastSentMessage) {
      const textToCopy = `${lastSentMessage.title}\nMessage ID: ${lastSentMessage.id}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        // Could add a toast notification here
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    }
  };

  const handleFetchMessage = () => {
    if (fetchMessageId.trim()) {
      const formData = new FormData();
      formData.append("messageId", fetchMessageId.trim());
      fetchAction(formData);
    }
  };

  const clearForm = () => {
    setEditingMessageId("");
    setUseEmbed(false);
    setEmbedFields([]);
    setLastSentMessage(null);

    // Clear all form inputs
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.reset();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center  p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Access Required</CardTitle>
            <CardDescription>
              Enter the password to access the Discord message form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={passwordAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </div>
              {passwordState?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordState.error}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full"
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
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Message Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Message Management
            </CardTitle>
            <CardDescription>
              Copy sent messages or load existing messages for editing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Last Sent Message */}
            {lastSentMessage && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-green-800">
                    Message Sent Successfully!
                  </p>
                  <p className="text-sm text-green-600">
                    {lastSentMessage.title} • ID: {lastSentMessage.id}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            )}

            {/* Current Editing Status */}
            {editingMessageId && (
              <div className="flex items-center justify-between p-3  rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium text-blue-800">Editing Mode</p>
                  <p className="text-sm text-blue-600">
                    Message ID: {editingMessageId}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={clearForm}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  New Message
                </Button>
              </div>
            )}

            {/* Fetch Message */}
            <div className="space-y-2">
              <Label htmlFor="fetch-message-id">Load Message for Editing</Label>
              <div className="flex gap-2">
                <Input
                  id="fetch-message-id"
                  value={fetchMessageId}
                  onChange={(e) => setFetchMessageId(e.target.value)}
                  placeholder="Enter message ID to edit"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFetchMessage}
                  disabled={fetchPending || !fetchMessageId.trim()}
                >
                  {fetchPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Load"
                  )}
                </Button>
              </div>
              {fetchState?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{fetchState.error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Discord Message Sender
              {editingMessageId && <Badge variant="secondary">Editing</Badge>}
            </CardTitle>
            <CardDescription>
              {editingMessageId
                ? "Edit your existing Discord message"
                : "Send messages and rich embeds to Discord through the webhook"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={messageAction} className="space-y-6">
              {/* Hidden field for editing */}
              {editingMessageId && (
                <input
                  type="hidden"
                  name="editing-message-id"
                  value={editingMessageId}
                />
              )}

              {/* Basic Message Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Enter your message (optional if using embed)"
                    className="min-h-[80px]"
                    maxLength={2000}
                  />
                </div>
              </div>

              {/* Embed Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-embed"
                  checked={useEmbed}
                  onCheckedChange={setUseEmbed}
                />
                <Label htmlFor="use-embed">Use Rich Embed</Label>
                <Badge variant="secondary">Enhanced formatting</Badge>
              </div>

              {/* Embed Configuration */}
              {useEmbed && (
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Embed Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="author">Author</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="fields">Fields</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="embed-title">Title</Label>
                            <Input
                              id="embed-title"
                              name="embed-title"
                              placeholder="Embed title"
                              maxLength={256}
                            />
                            <p className="text-xs text-muted-foreground">
                              Max 256 characters
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="embed-url">URL</Label>
                            <Input
                              id="embed-url"
                              name="embed-url"
                              placeholder="https://example.com"
                              type="url"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="embed-description">Description</Label>
                          <Textarea
                            id="embed-description"
                            name="embed-description"
                            placeholder="Embed description"
                            className="min-h-[100px]"
                            maxLength={4096}
                          />
                          <p className="text-xs text-muted-foreground">
                            Max 4096 characters
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="embed-color">Color (Hex)</Label>
                            <Input
                              id="embed-color"
                              name="embed-color"
                              placeholder="#5865F2"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="embed-timestamp">Timestamp</Label>
                            <Input
                              id="embed-timestamp"
                              name="embed-timestamp"
                              type="datetime-local"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="author" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="embed-author-name">
                              Author Name
                            </Label>
                            <Input
                              id="embed-author-name"
                              name="embed-author-name"
                              placeholder="Author name"
                              maxLength={256}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="embed-author-url">Author URL</Label>
                            <Input
                              id="embed-author-url"
                              name="embed-author-url"
                              placeholder="https://example.com"
                              type="url"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="embed-author-icon">
                            Author Icon URL
                          </Label>
                          <Input
                            id="embed-author-icon"
                            name="embed-author-icon"
                            placeholder="https://example.com/icon.png"
                            type="url"
                          />
                        </div>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="embed-footer-text">
                              Footer Text
                            </Label>
                            <Input
                              id="embed-footer-text"
                              name="embed-footer-text"
                              placeholder="Footer text"
                              maxLength={2048}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="embed-footer-icon">
                              Footer Icon URL
                            </Label>
                            <Input
                              id="embed-footer-icon"
                              name="embed-footer-icon"
                              placeholder="https://example.com/icon.png"
                              type="url"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="media" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="embed-image">Image URL</Label>
                          <Input
                            id="embed-image"
                            name="embed-image"
                            placeholder="https://example.com/image.png"
                            type="url"
                          />
                          <p className="text-xs text-muted-foreground">
                            Large image displayed in embed
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="embed-thumbnail">Thumbnail URL</Label>
                          <Input
                            id="embed-thumbnail"
                            name="embed-thumbnail"
                            placeholder="https://example.com/thumb.png"
                            type="url"
                          />
                          <p className="text-xs text-muted-foreground">
                            Small image displayed on the right side
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="fields" className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Embed Fields</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addEmbedField}
                            disabled={embedFields.length >= 25}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Field ({embedFields.length}/25)
                          </Button>
                        </div>
                        {embedFields.map((field, index) => (
                          <Card key={index} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Field {index + 1}</Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEmbedField(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label>Name</Label>
                                  <Input
                                    value={field.name}
                                    onChange={(e) =>
                                      updateEmbedField(index, {
                                        name: e.target.value,
                                      })
                                    }
                                    placeholder="Field name"
                                    maxLength={256}
                                    name={`embed-field-name-${index}`}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label>Value</Label>
                                  <Textarea
                                    value={field.value}
                                    onChange={(e) =>
                                      updateEmbedField(index, {
                                        value: e.target.value,
                                      })
                                    }
                                    placeholder="Field value"
                                    maxLength={1024}
                                    className="min-h-[60px]"
                                    name={`embed-field-value-${index}`}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={field.inline}
                                  onCheckedChange={(checked) =>
                                    updateEmbedField(index, { inline: checked })
                                  }
                                  id={`inline-${index}`}
                                />
                                <Label htmlFor={`inline-${index}`}>
                                  Display inline
                                </Label>
                                <input
                                  type="hidden"
                                  name={`embed-field-inline-${index}`}
                                  value={field.inline.toString()}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* Hidden field to track embed usage */}
              <input
                type="hidden"
                name="use-embed"
                value={useEmbed.toString()}
              />
              <input
                type="hidden"
                name="embed-fields-count"
                value={embedFields.length.toString()}
              />

              {messageState?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{messageState.error}</AlertDescription>
                </Alert>
              )}

              {messageState?.success && (
                <Alert>
                  <AlertDescription>
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
                  className="flex-1"
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
                        : `Send ${useEmbed ? "Embed" : "Message"}`}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAuthenticated(false)}
                >
                  Logout
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
