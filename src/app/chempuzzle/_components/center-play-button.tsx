import { LoaderCircle, PlayCircle } from "lucide-react";

export function CenterPlayButton({
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
