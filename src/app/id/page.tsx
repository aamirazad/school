"use client";

import LoadingSpinner from "@/components/loading-spinner";
import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { createAccountWithTurnstile } from "./actions";
import Script from "next/script";
import { useState, useEffect } from "react";

// Global callback function for Turnstile
declare global {
  interface Window {
    turnstile: any;
    onTurnstileSuccess: (token: string) => void;
    onTurnstileError: () => void;
  }
}

export default function IdPage() {
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [emailSent, setEmailSent] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createAccountWithTurnstile(prevState, formData);
      if (result?.success) {
        setEmailSent(true);
      }
      return result;
    },
    { error: "", success: false },
  );

  // Set up global Turnstile callbacks
  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token);
    };

    window.onTurnstileError = () => {
      setTurnstileToken("");
      console.error("Turnstile verification failed");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            {emailSent ? (
              <>
                <div className="px-6 border-slate-200 dark:border-slate-700 text-xl">
                  Please click the link we sent to your email to finish
                  registration.
                </div>
                <div className="px-6 pt-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                  It may take a few minutes for the email to send and also check
                  your spam folder.
                </div>
              </>
            ) : (
              <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Your Name
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Green"
                      className="pl-10 h-12 text-base border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={isPending}
                      required
                    />
                  </div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-12 text-base border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={isPending}
                      required
                    />
                  </div>
                </div>

                <div
                  className="cf-turnstile"
                  data-sitekey={
                    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
                    "1x00000000000000000000AA"
                  }
                  data-callback="onTurnstileSuccess"
                  data-error-callback="onTurnstileError"
                ></div>

                {/* Hidden input to pass the Turnstile token */}
                <input
                  type="hidden"
                  name="turnstileToken"
                  value={turnstileToken}
                />

                {state?.error && (
                  <Alert variant="destructive">
                    <AlertTitle>{state.error}</AlertTitle>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isPending || !turnstileToken}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner className="w-5 h-5" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <span>Create Account</span>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Loading overlay */}
        {isPending && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="p-8 bg-white dark:bg-slate-900 shadow-2xl">
              <div className="flex flex-col items-center gap-4">
                <LoadingSpinner className="w-8 h-8" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Creating Your Account
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Please wait while we set everything up...
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
