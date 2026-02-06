import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar.jsx";
import RecordingControls from "@/components/RecordingControls.jsx";
import VideoPreview from "@/components/VideoPreview.jsx";
import WebcamPreview from "@/components/WebcamPreview";
import { useMediaRecorder } from "@/hooks/useMediaRecorder.jsx";
import { useToast } from "@/hooks/use-toast.jsx";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Monitor, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.jsx";
import { Button } from "@/components/ui/button.jsx";

const Record = () => {
  const [includeAudio, setIncludeAudio] = useState(true);
  const [includeWebcam, setIncludeWebcam] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  // Store recording state in localStorage for persistence across tabs
  useEffect(() => {
    if (state === "recording") {
      localStorage.setItem("isRecording", "true");
      localStorage.setItem("recordingStartTime", new Date().toISOString());
    } else if (state === "idle") {
      localStorage.removeItem("isRecording");
      localStorage.removeItem("recordingStartTime");
    }
  }, [state]);

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    toast({
      title: "Success!",
      description: "Recording uploaded to cloud successfully.",
    });
    
    // Navigate to dashboard after 2 seconds
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
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

          {/* Upload Success Alert */}
          {uploadSuccess && (
            <Alert className="mb-8 max-w-xl mx-auto border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Upload Successful!</AlertTitle>
              <AlertDescription className="text-green-800">
                Your recording has been uploaded to the cloud. Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          {/* Recording Interface */}
          <div className="flex flex-col items-center gap-8">
            {/* Preview Area */}
            {state === "idle" && !recordedUrl && (
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
                onUploadSuccess={handleUploadSuccess}
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
