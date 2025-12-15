import { useState } from "react";
import Navbar from "@/components/Navbar";
import RecordingControls from "@/components/RecordingControls";
import VideoPreview from "@/components/VideoPreview";
import WebcamPreview from "@/components/WebcamPreview";
import { useMediaRecorder } from "@/hooks/useMediaRecorder";
import { AlertCircle, Monitor } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Record = () => {
  const [includeAudio, setIncludeAudio] = useState(true);
  const [includeWebcam, setIncludeWebcam] = useState(false);

  const {
    state,
    recordedBlob,
    recordedUrl,
    duration,
    webcamStream,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    error,
  } = useMediaRecorder({ includeAudio, includeWebcam });

  const handleStartRecording = async () => {
    await startRecording();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Record Your Screen
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Capture your screen, microphone, and webcam. Create professional
              recordings with just a few clicks.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-8 max-w-xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Recording Interface */}
          <div className="flex flex-col items-center gap-8">
            {/* Preview Area */}
            {state === "idle" && (
              <div className="w-full max-w-3xl aspect-video bg-muted rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-4 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Monitor className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground text-center max-w-sm">
                  Your screen recording will appear here. Click the record button
                  below to start.
                </p>
              </div>
            )}

            {/* Recording Indicator */}
            {(state === "recording" || state === "paused") && (
              <div className="w-full max-w-3xl aspect-video bg-muted/50 rounded-2xl border border-border flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className={`absolute inset-0 ${state === "recording" ? "bg-recording/5" : "bg-muted/50"} transition-colors`} />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${state === "recording" ? "bg-recording/20 glow-recording" : "bg-muted"}`}>
                    <Monitor className={`h-12 w-12 ${state === "recording" ? "text-recording" : "text-muted-foreground"}`} />
                  </div>
                  <p className="text-lg font-medium">
                    {state === "recording" ? "Recording in progress..." : "Recording paused"}
                  </p>
                </div>
              </div>
            )}

            {/* Video Preview */}
            {recordedUrl && recordedBlob && (
              <VideoPreview
                videoUrl={recordedUrl}
                videoBlob={recordedBlob}
                onDiscard={resetRecording}
              />
            )}

            {/* Controls */}
            <div className="w-full max-w-xl bg-card rounded-2xl border border-border p-8 shadow-lg">
              <RecordingControls
                state={state}
                duration={duration}
                includeAudio={includeAudio}
                includeWebcam={includeWebcam}
                onStart={handleStartRecording}
                onPause={pauseRecording}
                onResume={resumeRecording}
                onStop={stopRecording}
                onReset={resetRecording}
                onToggleAudio={() => setIncludeAudio(!includeAudio)}
                onToggleWebcam={() => setIncludeWebcam(!includeWebcam)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Webcam Preview Overlay */}
      {webcamStream && (state === "recording" || state === "paused") && (
        <WebcamPreview stream={webcamStream} />
      )}
    </div>
  );
};

export default Record;
