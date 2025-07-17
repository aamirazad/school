"use client";

import { useState, startTransition, useRef, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, RefreshCw, CheckCircle } from "lucide-react";
import { validatePassword, refreshContent } from "./actions";
import { useActionState } from "react";

export default function RefreshHASD() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshComplete, setRefreshComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [refreshState, refreshAction, refreshPending] = useActionState(
    refreshContent,
    undefined
  );

  // Check for ongoing refresh on mount
  useEffect(() => {
    const savedStartTime = localStorage.getItem("refreshStartTime");
    const savedEndTime = localStorage.getItem("refreshEndTime");

    if (savedStartTime && savedEndTime) {
      const now = Date.now();
      const endTime = parseInt(savedEndTime);

      if (now < endTime) {
        // Refresh is still ongoing
        const totalDuration = 12000;
        const elapsed = now - parseInt(savedStartTime);
        const currentProgress = Math.min((elapsed / totalDuration) * 100, 100);

        setIsRefreshing(true);
        setProgress(currentProgress);

        // Continue the progress bar
        startProgressAnimation(totalDuration - elapsed, currentProgress);
      } else {
        // Refresh should be complete
        setRefreshComplete(true);
        setProgress(100);
        localStorage.removeItem("refreshStartTime");
        localStorage.removeItem("refreshEndTime");
      }
    }

    // Handle visibility change to update progress when tab becomes active
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedStartTime = localStorage.getItem("refreshStartTime");
        const savedEndTime = localStorage.getItem("refreshEndTime");

        if (savedStartTime && savedEndTime) {
          const now = Date.now();
          const endTime = parseInt(savedEndTime);

          if (now < endTime) {
            const totalDuration = 12000;
            const elapsed = now - parseInt(savedStartTime);
            const currentProgress = Math.min(
              (elapsed / totalDuration) * 100,
              100
            );
            setProgress(currentProgress);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const startProgressAnimation = (
    duration: number,
    startProgress: number = 0
  ) => {
    const startTime = Date.now();
    const totalDuration = duration;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(
        startProgress + (elapsed / totalDuration) * (100 - startProgress),
        100
      );

      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setIsRefreshing(false);
        setRefreshComplete(true);
        localStorage.removeItem("refreshStartTime");
        localStorage.removeItem("refreshEndTime");
      }
    };

    updateProgress(); // Initial update
    progressIntervalRef.current = setInterval(updateProgress, 100); // Update every 100ms
  };

  // Effect to handle refresh state changes
  useEffect(() => {
    if (refreshState?.success && !isRefreshing) {
      // Success: start the progress bar
      const startTime = Date.now();
      const endTime = startTime + 12000;

      localStorage.setItem("refreshStartTime", startTime.toString());
      localStorage.setItem("refreshEndTime", endTime.toString());

      setIsRefreshing(true);
      setRefreshComplete(false);
      setProgress(0);

      // Start 12-second progress animation
      startProgressAnimation(12000);
    } else if (refreshState?.error) {
      // Error: don't start progress bar, just show error
      setIsRefreshing(false);
      setProgress(0);
      setRefreshComplete(false);
    }
  }, [refreshState]);

  const handleRefresh = () => {
    // Clear any existing interval and localStorage
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    localStorage.removeItem("refreshStartTime");
    localStorage.removeItem("refreshEndTime");

    setRefreshComplete(false);
    setProgress(0);

    // Start the refresh action
    startTransition(() => {
      const formData = new FormData();
      refreshAction(formData);
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/20">
                  <RefreshCw className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    History Club Content Refresh
                  </p>
                  <p className="text-sm text-gray-400">
                    Redeploy site to update content
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Panel */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <RefreshCw className="h-5 w-5" />
              Content Refresh Panel
            </CardTitle>
            <CardDescription className="text-gray-400">
              Click the button below rebuild the site, thus refreshing the
              content on the{" "}
              <a
                className="underline"
                href="https://historyclub.aamira.me/"
                target="_blank"
              >
                History Club site.
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {refreshState?.error && (
              <Alert
                variant="destructive"
                className="bg-gray-800 border-red-700"
              >
                <AlertDescription>{refreshState.error}</AlertDescription>
              </Alert>
            )}

            {refreshComplete && (
              <Alert className="bg-green-900/20 border-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-400 flex">
                  Deployment complete! Please refresh the{" "}
                  <a
                    className="underline"
                    href="https://historyclub.aamira.me/"
                    target="_blank"
                  >
                    History Club site
                  </a>{" "}
                  to see the updated content.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing || refreshPending}
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
              >
                {refreshPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending request...
                  </>
                ) : isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Building site...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Refresh History Club Content
                  </>
                )}
              </Button>
            </div>

            {isRefreshing && (
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">
                  This process takes approximately 12 seconds...
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-75 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
