import { Play, Pause, Square, RotateCcw, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const RecordingControls = ({
  state,
  duration,
  includeAudio,
  includeWebcam,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onToggleAudio,
  onToggleWebcam,
}) => {
  const isRecording = state === "recording";
  const isPaused = state === "paused";
  const isStopped = state === "stopped";
  const isIdle = state === "idle";

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Timer Display */}
      <div
        className={cn(
          "text-5xl md:text-6xl font-mono font-bold tabular-nums tracking-wider transition-colors",
          isRecording && "text-recording",
          isPaused && "text-muted-foreground",
          (isIdle || isStopped) && "text-foreground"
        )}
      >
        {formatDuration(duration)}
      </div>

      {/* Recording Status */}
      <div className="flex items-center gap-2 text-sm font-medium">
        {isRecording && (
          <>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-recording opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-recording"></span>
            </span>
            <span className="text-recording">Recording</span>
          </>
        )}
        {isPaused && (
          <>
            <span className="h-3 w-3 rounded-full bg-muted-foreground"></span>
            <span className="text-muted-foreground">Paused</span>
          </>
        )}
        {isStopped && (
          <>
            <span className="h-3 w-3 rounded-full bg-success"></span>
            <span className="text-success">Recording Complete</span>
          </>
        )}
        {isIdle && (
          <span className="text-muted-foreground">Ready to record</span>
        )}
      </div>

      {/* Toggle Options - Only show when idle */}
      {isIdle && (
        <div className="flex items-center gap-4">
          <Button
            variant={includeAudio ? "default" : "outline"}
            size="sm"
            onClick={onToggleAudio}
            className="gap-2"
          >
            {includeAudio ? (
              <Mic className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
            Microphone
          </Button>
          <Button
            variant={includeWebcam ? "default" : "outline"}
            size="sm"
            onClick={onToggleWebcam}
            className="gap-2"
          >
            {includeWebcam ? (
              <Video className="h-4 w-4" />
            ) : (
              <VideoOff className="h-4 w-4" />
            )}
            Webcam
          </Button>
        </div>
      )}

      {/* Main Controls */}
      <div className="flex items-center gap-4">
        {isIdle && (
          <Button
            variant="recording"
            size="icon-lg"
            onClick={onStart}
            className="rounded-full"
          >
            <Play className="h-6 w-6 ml-0.5" />
          </Button>
        )}

        {isRecording && (
          <>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={onPause}
              className="rounded-full"
            >
              <Pause className="h-6 w-6" />
            </Button>
            <Button
              variant="destructive"
              size="icon-lg"
              onClick={onStop}
              className="rounded-full"
            >
              <Square className="h-6 w-6" />
            </Button>
          </>
        )}

        {isPaused && (
          <>
            <Button
              variant="recording"
              size="icon-lg"
              onClick={onResume}
              className="rounded-full"
            >
              <Play className="h-6 w-6 ml-0.5" />
            </Button>
            <Button
              variant="destructive"
              size="icon-lg"
              onClick={onStop}
              className="rounded-full"
            >
              <Square className="h-6 w-6" />
            </Button>
          </>
        )}

        {isStopped && (
          <Button
            variant="outline"
            size="icon-lg"
            onClick={onReset}
            className="rounded-full"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Hints */}
      <p className="text-xs text-muted-foreground text-center max-w-sm">
        {isIdle &&
          "Click the record button to select your screen and start recording"}
        {isRecording && "Recording in progress. Click pause or stop when done."}
        {isPaused && "Recording paused. Click play to resume or stop to finish."}
        {isStopped && "Preview your recording below. Click reset to start over."}
      </p>
    </div>
  );
};

export default RecordingControls;
