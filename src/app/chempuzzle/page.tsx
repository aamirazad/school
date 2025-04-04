"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { PlayCircle, PauseCircle, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import { separateName } from "@/lib/utils";
import { CenterPlayButton } from "./_components/center-play-button";
import { TextInput } from "@/components/text-input";
import { MultipleChoice } from "@/components/multiple-choice";
import { EquationBalancer } from "@/components/equation-balancer";
import { DipoleArrows } from "@/components/dipole-arrows";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import { KaExpression } from "@/components/ka-expression";
import { LewisDot } from "@/components/lewis-dot";

// Add CSS for animations
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`;

// Define the question types and structure
type QuestionType =
  | "text"
  | "multiple-choice"
  | "equation-balance"
  | "dipole-arrow"
  | "ka-expression"
  | "lewis-dot";

interface Question {
  id: number;
  type: QuestionType;
  time: number; // in seconds
  reviewTime: number; // in seconds
  prompt: string;
  options?: string[];
}

// Sample questions
const questions: Question[] = [
  {
    id: 1,
    type: "text",
    time: 10,
    reviewTime: 11,
    prompt: "What is the chemical formula for water?",
  },
  {
    id: 2,
    type: "multiple-choice",
    time: 3,
    reviewTime: 4,
    prompt: "Which of the following is a noble gas?",
    options: ["Oxygen", "Nitrogen", "Helium", "Chlorine"],
  },
  {
    id: 3,
    type: "equation-balance",
    time: 5,
    reviewTime: 6,
    prompt: "Balance the following chemical equation: H₂ + O₂ → H₂O",
  },
  {
    id: 4,
    type: "dipole-arrow",
    time: 6,
    reviewTime: 7,
    prompt: "Draw the dipole arrow for the H-Cl bond.",
  },
  {
    id: 5,
    type: "ka-expression",
    time: 8,
    reviewTime: 9,
    prompt:
      "Find the acid dissociation constant ($K_a$) for the following reaction:",
  },
  {
    id: 6,
    type: "lewis-dot",
    time: 1,
    reviewTime: 2,
    prompt: "Draw the Lewis dot structure for water (H2O)",
  },
];

export default function ChemQuest() {
  const { setTheme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [showingReview, setShowingReview] = useState(false);
  const [reviewQuestion, setReviewQuestion] = useState<Question | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [reviewStartTime, setReviewStartTime] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Set theme to light mode on mount
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);

    // Check if duration is already available
    if (video.duration) {
      setDuration(video.duration);
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(
    (param?: boolean | { force?: boolean }) => {
      // Extract force value, handling both call styles
      let force: boolean | undefined;

      if (typeof param === "boolean") {
        force = param;
      } else if (
        param &&
        typeof param === "object" &&
        !("nativeEvent" in param)
      ) {
        force = param.force;
      }

      if (!videoRef.current) return;

      if (activeQuestion !== null && force !== true) {
        return;
      }

      const shouldPlay = force !== undefined ? force : !isPlaying;

      if (shouldPlay) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    },
    [isPlaying, activeQuestion]
  );

  // Toggle mute/unmute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted((prev) => !prev);
  }, [isMuted]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current || activeQuestion) return;

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
    const question = questions.find((q) => q.time === Math.ceil(currentTime));
    if (
      question &&
      !answeredQuestions.includes(question.id) &&
      !activeQuestion
    ) {
      setActiveQuestion(question);
      togglePlay(false); // Pause video
    }
  }, [currentTime, togglePlay, answeredQuestions]);

  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle answer submission
  const handleAnswerSubmit = (answer: string) => {
    if (activeQuestion) {
      // Save the answer
      setUserAnswers((prev) => ({
        ...prev,
        [activeQuestion.id]: answer,
      }));

      // Mark question as answered
      setAnsweredQuestions((prev) => [...prev, activeQuestion.id]);

      // Close the question and resume
      setActiveQuestion(null);
      togglePlay(true);
    }
  };

  // Add effect to show answer review
  useEffect(() => {
    if (!duration) return;

    const reviewToShow = questions.find(
      (q) => q.reviewTime === Math.ceil(currentTime)
    );

    if (
      reviewToShow &&
      !activeQuestion &&
      answeredQuestions.includes(reviewToShow.id)
    ) {
      setReviewQuestion(reviewToShow);
      setShowingReview(true);
      setReviewStartTime(currentTime);
    }
  }, [currentTime, duration, answeredQuestions, activeQuestion]);

  // Add effect to hide review after 10 seconds of playback
  useEffect(() => {
    if (!showingReview || !reviewStartTime) return;

    // Calculate how much video time has passed since review started
    const elapsedVideoTime = currentTime - reviewStartTime;

    // Check if 10 seconds of video playback have passed
    if (elapsedVideoTime >= 10) {
      // Find the next review time
      const nextReviewTime = questions
        .filter((q) => q.reviewTime > currentTime)
        .sort((a, b) => a.reviewTime - b.reviewTime)[0]?.reviewTime;

      // If there's no next review within the next 10 seconds, hide the review
      if (!nextReviewTime || nextReviewTime - currentTime > 10) {
        setShowingReview(false);
        setReviewQuestion(null);
        setReviewStartTime(null);
      }
    }
  }, [currentTime, showingReview, reviewStartTime]);

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen text-slate-900">
      {/* Add style tag for animations */}
      <style jsx global>
        {fadeInAnimation}
      </style>

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
              src="https://files.aamira.me/projects/Folding@home%20stats%20website%20-%20My%20CS50%20Final%20project.mp4"
              onContextMenu={(e) => e.preventDefault()}
              disablePictureInPicture
              onClick={() => togglePlay()}
            />
            {/* Video controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm text-white px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => togglePlay()}
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
                      className={`absolute top-0 w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/4 shadow-sm ring-1 ring-white/30 ${
                        answeredQuestions.includes(question.id)
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        left: `${(question.time / duration) * 100}%`,
                      }}
                      title={`Question ${question.id}: ${question.prompt}`}
                    />
                  ))}
                  {questions.map((question) => (
                    <div
                      key={`review-${question.id}`}
                      className="absolute top-0 w-2.5 h-2.5 bg-yellow-500 rounded-full transform -translate-x-1/2 translate-y-1/4 shadow-sm ring-1 ring-white/30"
                      style={{
                        left: `${(question.reviewTime / duration) * 100}%`,
                      }}
                      title={`Review Question ${question.id} at ${formatTime(
                        question.reviewTime
                      )}`}
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
            {/* Answer review floating box */}
            {showingReview && reviewQuestion && (
              <div className="absolute bottom-20 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-xs border border-gray-200 animate-fade-in">
                <h4 className="font-medium text-sm mb-2">
                  {reviewQuestion.prompt}
                </h4>
                {reviewQuestion.type === "lewis-dot" ? (
                  <LewisDot
                    review={true}
                    structure={userAnswers[reviewQuestion.id]}
                    onSubmit={() => {}}
                  />
                ) : (
                  <div className="text-blue-700 font-medium">
                    Your answer:{" "}
                    {userAnswers[reviewQuestion.id] || "Not answered"}
                  </div>
                )}
              </div>
            )}
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
          <div className="p-6 bg-white rounded-lg shadow-xl m-4">
            <h3 className="text-xl font-semibold mb-4">
              <Latex>{activeQuestion.prompt}</Latex>
            </h3>

            {activeQuestion.type === "text" && (
              <TextInput onSubmit={handleAnswerSubmit} />
            )}

            {activeQuestion.type === "multiple-choice" &&
              activeQuestion.options && (
                <MultipleChoice
                  options={activeQuestion.options}
                  onSelect={handleAnswerSubmit}
                />
              )}

            {activeQuestion.type === "equation-balance" && (
              <EquationBalancer
                equation={activeQuestion.prompt.replace(
                  "Balance the following chemical equation: ",
                  ""
                )}
                onSubmit={handleAnswerSubmit}
              />
            )}

            {activeQuestion.type === "dipole-arrow" && (
              <DipoleArrows onSubmit={handleAnswerSubmit} />
            )}

            {activeQuestion.type === "ka-expression" && (
              <KaExpression onSubmit={handleAnswerSubmit} />
            )}

            {activeQuestion.type === "lewis-dot" && (
              <LewisDot onSubmit={handleAnswerSubmit} />
            )}
          </div>
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
                className={`p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
                  answeredQuestions.includes(question.id)
                    ? "border-green-300"
                    : ""
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium py-1 px-2 rounded-full bg-blue-100 text-blue-800">
                    {separateName(question.type)}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatTime(question.time)}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-800 truncate">
                  {question.prompt}
                </div>
                {answeredQuestions.includes(question.id) && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    ✓ Answered
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
