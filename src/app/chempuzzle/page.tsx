"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  LoaderCircle,
} from "lucide-react";
import Question from "./_components/question";
import { useTheme } from "next-themes";
import { questions } from "./questions";

export default function ChemQuest() {
  const { setTheme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<
    (typeof questions)[0] | null
  >(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Set theme to light mode on mount
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current || activeQuestion !== null) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying, activeQuestion]);

  // Toggle mute/unmute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted((prev) => !prev);
  }, [isMuted]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.code) {
        case "Space":
          togglePlay();
          break;
        case "KeyM":
          toggleMute();
          break;
        case "ArrowLeft":
          videoRef.current.currentTime = Math.max(
            videoRef.current.currentTime - 5,
            0
          );
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, toggleMute]);

  // Pause video and show question when time matches
  useEffect(() => {
    const question = questions.find((q) => q.time === Math.round(currentTime));
    if (question) {
      setActiveQuestion(question);
      togglePlay(); // Pause video
    }
  }, [currentTime, togglePlay]);

  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle question result
  const questionResult = (result: string) => {
    setActiveQuestion(null);
    if (result === "Correct") {
      togglePlay(); // Resume video
    }
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 10,
        0
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen text-slate-900">
      {/* Main content area */}
      <div className="flex-initial w-5/6 p-6 transition-all duration-300">
        <div
          className={`mx-auto transition-all duration-300 ${
            activeQuestion ? "lg:w-4/5" : "w-full"
          }`}
        >
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_5mb.mp4"
              onContextMenu={(e) => e.preventDefault()}
              disablePictureInPicture
              onClick={togglePlay}
            />

            {/* Video controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm text-white px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={togglePlay}
                  className={`hover:text-blue-400 transition-colors focus:outline-none ${
                    currentTime !== 0 ? "" : "hidden"
                  }`}
                >
                  {isPlaying ? (
                    <PauseCircle size={28} />
                  ) : (
                    <PlayCircle size={28} />
                  )}
                </button>

                {duration && (
                  <div className="text-sm font-medium">
                    {`${formatTime(currentTime)} / ${formatTime(duration)}`}
                  </div>
                )}

                <button
                  onClick={toggleMute}
                  className="hover:text-blue-400 transition-colors focus:outline-none"
                >
                  {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                </button>
              </div>

              {duration && (
                <div className="relative h-1.5 bg-gray-600/50 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="absolute top-0 w-2.5 h-2.5 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/4 shadow-sm ring-1 ring-white/30"
                      style={{
                        left: `${(question.time / duration) * 100}%`,
                      }}
                      title={`Question ${question.id}: ${question.title}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <CenterPlayButton
              togglePlay={togglePlay}
              currentTime={currentTime}
              duration={duration}
            />
          </div>
        </div>
      </div>

      {/* Active question display */}
      <div
        className={`${
          activeQuestion ? "block w-3/4" : "hidden w-0"
        } md:block transition-all duration-300 ease-in-out grow`}
      >
        {activeQuestion && (
          <Question question={activeQuestion} questionResult={questionResult} />
        )}
      </div>

      {/* Questions sidebar */}
      <div className="md:w-80 bg-white shadow-xl border-l border-gray-200 flex-none">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-indigo-900 border-b border-gray-200 pb-2">
            Questions
          </h2>
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-xs font-medium py-1 px-2 rounded-full ${
                      question.type === "multiple-choice"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {question.type === "multiple-choice"
                      ? "Multiple Choice"
                      : "Short Answer"}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatTime(question.time)}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {question.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CenterPlayButton({
  togglePlay,
  currentTime,
  duration,
}: {
  togglePlay: () => void;
  currentTime: number;
  duration: number | null;
}) {
  if (duration === null) {
    // Show loading spinner only if duration is null
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <button
          onClick={togglePlay}
          className="bg-white/20 backdrop-blur-sm text-white rounded-full p-4 hover:bg-white/30 transition-all duration-200 transform hover:scale-110"
        >
          <div className="animate-spin">
            <LoaderCircle size={48} />
          </div>
        </button>
      </div>
    );
  }

  if (currentTime === 0) {
    // Show play button if video is at the beginning
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <button
          onClick={togglePlay}
          className="bg-white/20 backdrop-blur-sm text-white rounded-full p-4 hover:bg-white/30 transition-all duration-200 transform hover:scale-110"
        >
          <PlayCircle size={48} />
        </button>
      </div>
    );
  }

  return null; // No button if video is playing or paused mid-way
}
