"use client";

import { useState } from "react";
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
import { Loader2, Send, Lock } from "lucide-react";
import { validatePassword, sendDiscordMessage } from "./actions";
import { useActionState } from "react";

export default function DiscordWebhookForm() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordState, passwordAction, passwordPending] = useActionState(
    validatePassword,
    undefined,
  );
  const [messageState, messageAction, messagePending] = useActionState(
    sendDiscordMessage,
    undefined,
  );

  // Handle successful password validation
  if (passwordState?.success && !isAuthenticated) {
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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
    <div className="min-h-screen  p-4">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Discord Announcement Sender
            </CardTitle>
            <CardDescription>
              Send a message to Discord through the webhook
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={messageAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This will override the default webhook username
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Message Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter your message (up to 2000 characters)"
                  className="min-h-[120px]"
                  maxLength={2000}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Maximum 2000 characters
                </p>
              </div>

              {messageState?.error && (
                <Alert variant="destructive">
                  <AlertDescription>{messageState.error}</AlertDescription>
                </Alert>
              )}

              {messageState?.success && (
                <Alert>
                  <AlertDescription>
                    Message sent successfully to Discord!
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
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
