"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Loader,
  LoaderCircle,
} from "lucide-react";
import Question from "./_components/question";
import { useTheme } from "next-themes";
import { questions } from "./questions";
import LoadingSpinner from "@/components/loading-spinner";

export default function ChemQuest() {
  const { setTheme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<null | number>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<
    (typeof questions)[0] | null
  >(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration) {
      setDuration(video.duration);
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedMetadata", handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space") {
          togglePlay();
        } else if (e.code === "KeyM") {
          toggleMute();
        } else if (e.code === "ArrowLeft" && videoRef.current) {
          videoRef.current.currentTime -= 5;
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  // Wrap togglePlay in useCallback to prevent it from changing on every render
  const togglePlay = useCallback(() => {
    if (!videoRef.current || activeQuestion !== null || duration === null)
      return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, activeQuestion, duration]);

  // Wrap toggleMute in useCallback to prevent it from changing on every render
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Second useEffect with togglePlay in dependencies
  useEffect(() => {
    if (questions[0].time === Math.round(currentTime)) {
      togglePlay();
      setActiveQuestion(questions[0]);
    }
  }, [currentTime, togglePlay]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const questionResult = (result: string) => {
    setActiveQuestion(null);
    if (result == "Correct") {
      togglePlay();
    }
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen text-slate-900">
      {/* Main content area */}
      <div className="flex-initial w-5/6 p-6 transition-all duration-300">
        {/* Video container */}
        <div
          className={`mx-auto transition-all duration-300 ${
            activeQuestion !== null ? "lg:w-4/5" : "w-full"
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

            {/* Video controls overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm text-white px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                {/* Play/pause button */}
                <button
                  onClick={togglePlay}
                  className={`hover:text-blue-400 transition-colors focus:outline-none ${currentTime !== 0 ? "" : "hidden"}`}
                >
                  {isPlaying ? (
                    <PauseCircle size={28} />
                  ) : (
                    <PlayCircle size={28} />
                  )}
                </button>

                {/* Time display */}
                {duration && (
                  <div className="text-sm font-medium">
                    {`${formatTime(currentTime)} / ${formatTime(duration)}`}
                  </div>
                )}

                {/* Mute button */}
                <button
                  onClick={toggleMute}
                  className="hover:text-blue-400 transition-colors focus:outline-none"
                >
                  {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
                </button>
              </div>

              {/* Progress bar */}
              {duration && (
                <div className="relative h-1.5 bg-gray-600/50 rounded-full overflow-hidden">
                  {/* Progress indicator */}
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />

                  {/* Question markers */}
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

            {/* Play overlay button (center of video) */}
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
        className={`${activeQuestion !== null ? "block w-3/4" : "hidden w-0"} md:block transition-all duration-300 ease-in-out grow `}
      >
        {activeQuestion !== null && (
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
                {/* Question badge */}
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

                {/* Question text */}
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
  if (!duration)
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

  if (currentTime === 0)
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
  return null;
}
