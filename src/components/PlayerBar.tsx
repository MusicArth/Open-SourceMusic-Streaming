import { useRef, useCallback } from "react";
import ReactPlayerImport from "react-player/youtube";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Repeat1, Heart
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { Slider } from "@/components/ui/slider";

const ReactPlayer = (ReactPlayerImport as any).default ?? ReactPlayerImport;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const playerRef = useRef<any>(null);
  const {
    currentTrack, isPlaying, volume, progress, duration,
    shuffle, repeat, library,
    togglePlay, setProgress, setDuration, setVolume,
    nextTrack, prevTrack, toggleShuffle, toggleRepeat,
    addToLibrary, removeFromLibrary,
  } = usePlayerStore();

  const isInLibrary = currentTrack ? library.some(t => t.id === currentTrack.id) : false;

  const handleProgress = useCallback((state: { playedSeconds: number }) => {
    setProgress(state.playedSeconds);
  }, [setProgress]);

  const handleDuration = useCallback((d: number) => {
    setDuration(d);
  }, [setDuration]);

  const handleSeek = useCallback((value: number[]) => {
    const time = value[0];
    setProgress(time);
    playerRef.current?.seekTo(time, "seconds");
  }, [setProgress]);

  const handleEnded = useCallback(() => {
    nextTrack();
  }, [nextTrack]);

  return (
    <footer className="bg-surface/95 backdrop-blur-md border-t border-border">
      {/* Hidden Player */}
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url={currentTrack?.youtubeUrl}
          playing={isPlaying}
          volume={volume}
          onProgress={handleProgress as any}
          onDuration={handleDuration as any}
          onEnded={handleEnded}
          width={0}
          height={0}
          config={{
            youtube: {
              disablekb: 1,
            },
          } as any}
        />
      </div>

      {/* Mobile progress bar (thin bar at top of player) */}
      <div className="md:hidden h-1 w-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex items-center gap-3 px-3 py-2">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className="h-10 w-10 rounded object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate text-foreground">{currentTrack.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <button
              onClick={() =>
                isInLibrary ? removeFromLibrary(currentTrack.id) : addToLibrary(currentTrack)
              }
              className="shrink-0 p-1.5"
            >
              <Heart
                className={`h-4 w-4 ${
                  isInLibrary ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
            </button>
            <button
              onClick={togglePlay}
              className="shrink-0 h-8 w-8 rounded-full bg-foreground flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-background" />
              ) : (
                <Play className="h-4 w-4 text-background ml-0.5" />
              )}
            </button>
          </>
        ) : (
          <p className="text-xs text-muted-foreground py-1">No track selected</p>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center h-24 px-4 gap-4">
        {/* Track Info */}
        <div className="w-[280px] flex items-center gap-3 min-w-0">
          {currentTrack ? (
            <>
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="h-14 w-14 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate text-foreground">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
              <button
                onClick={() =>
                  isInLibrary ? removeFromLibrary(currentTrack.id) : addToLibrary(currentTrack)
                }
                className="shrink-0 p-1 transition-colors duration-150"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isInLibrary
                      ? "fill-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                />
              </button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No track selected</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1 max-w-[600px]">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              className={`p-1 transition-colors duration-150 ${
                shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              onClick={prevTrack}
              className="text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              className="h-9 w-9 rounded-full bg-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-background" />
              ) : (
                <Play className="h-4 w-4 text-background ml-0.5" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`p-1 transition-colors duration-150 ${
                repeat !== "off" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {repeat === "one" ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-muted-foreground text-tabular w-10 text-right">
              {formatTime(progress)}
            </span>
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-foreground [&_[role=slider]]:opacity-0 [&:hover_[role=slider]]:opacity-100"
            />
            <span className="text-xs text-muted-foreground text-tabular w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-[180px] flex items-center gap-2 justify-end">
          <button
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(v) => setVolume(v[0] / 100)}
            className="w-24 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-foreground"
          />
        </div>
      </div>
    </footer>
  );
}
