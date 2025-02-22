"use client";

import { useState, useRef, useEffect } from "react";
import { PlayCircle, PauseCircle, Volume2, VolumeX } from "lucide-react";
import { PageWrapper } from "@/components/page-wrapper";

const questions = [
  {
    id: 1,
    time: 5,
    type: "multiple-choice",
    text: "What is the capital of France?",
  },
  { id: 2, time: 30, type: "short-answer", text: "Explain the water cycle." },
  {
    id: 3,
    time: 45,
    type: "multiple-choice",
    text: "Who wrote 'Romeo and Juliet'?",
  },
  { id: 4, time: 60, type: "short-answer", text: "What is photosynthesis?" },
];

export default function EdpuzzleClone() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(170);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [nextQuestion, setNextQuestion] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }
    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  useEffect(() => {
    console.log(questions[nextQuestion].time, currentTime);
    if (questions[nextQuestion].time === Math.round(currentTime)) {
      console.log("Next question");
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
      setNextQuestion(nextQuestion + 1);
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col md:flex-row  bg-gray-100 w-full h-fit text-slate-900">
      <div className="flex-grow p-4 transition-all duration-300">
        <div className="xl:w-11/12">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              className="w-full h-full"
              src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_30mb.mp4"
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 text-white p-2">
              <div className="flex items-center justify-between mb-2">
                <button onClick={togglePlay} className={"focus:outline-none"}>
                  {isPlaying ? (
                    <PauseCircle size={24} />
                  ) : (
                    <PlayCircle size={24} />
                  )}
                </button>
                <div className="text-sm">{`${formatTime(currentTime)} / ${formatTime(duration)}`}</div>
                <button onClick={toggleMute} className="focus:outline-none">
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
              </div>
              {duration !== 0 && (
                <div className="relative h-1 bg-gray-600 rounded">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="absolute top-0 w-2 h-2 bg-red-500 rounded-full transform -translate-y-1/2"
                      style={{ left: `${(question.time / duration) * 100}%` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="md:w-64 bg-white p-4 overflow-y-auto shadow-md">
        <h2 className="text-lg font-semibold mb-4">Upcoming Questions</h2>
        {questions.map((question) => (
          <div key={question.id} className="mb-4 p-3 bg-gray-100 rounded-lg">
            <div className="text-sm font-medium text-gray-600 mb-1">
              {question.type === "multiple-choice"
                ? "Multiple Choice"
                : "Short Answer"}
            </div>
            <div className="text-sm">{question.text}</div>
            <div className="text-xs text-gray-500 mt-1">
              Appears at {formatTime(question.time)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
