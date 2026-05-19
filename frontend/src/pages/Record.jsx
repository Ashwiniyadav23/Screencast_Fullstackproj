import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import RecordingControls from "@/components/RecordingControls";
import VideoPreview from "@/components/VideoPreview";
import WebcamPreview from "@/components/WebcamPreview";
import { useMediaRecorder } from "@/hooks/useMediaRecorder.jsx";
import { useToast } from "@/hooks/use-toast.jsx";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Monitor, CheckCircle, Settings, Sparkles, Zap, Clock, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const Record = () => {
  const [includeAudio, setIncludeAudio] = useState(true);
  const [includeWebcam, setIncludeWebcam] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [recordingQuality, setRecordingQuality] = useState("high");
  const [showTips, setShowTips] = useState(true);
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
    setShowTips(false);
  };

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
    toast({
      title: "Success! 🎉",
      description: "Recording uploaded to cloud successfully.",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <SEO
        title="Record Screen"
        description="Start recording your screen, audio, and webcam. Create tutorials, demos, and presentations in minutes."
        path="/record"
        noindex
      />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Enhanced Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Record & Share Instantly
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Record Your Screen
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Capture your screen, microphone, and webcam. Create professional
              recordings with advanced editing tools and instant cloud sharing.
            </p>
            
            {/* Recording Status Badge */}
            {state !== "idle" && (
              <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full glass-strong">
                <div className={`w-3 h-3 rounded-full ${
                  state === "recording" ? "bg-red-500 animate-pulse" : "bg-yellow-500"
                }`} />
                <span className="font-medium">
                  {state === "recording" ? "Recording" : "Paused"} • {formatDuration(duration)}
                </span>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          {showTips && state === "idle" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
              <Card className="hover-lift border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Recording</h3>
                  <p className="text-sm text-muted-foreground">
                    Start recording immediately with one click. No setup required.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift border-accent/20 hover:border-accent/40 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Advanced Editing</h3>
                  <p className="text-sm text-muted-foreground">
                    Trim, enhance, and customize your recordings with built-in tools.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-lift border-green-200 hover:border-green-400 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    Share instantly with cloud storage and direct links.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-8 max-w-xl mx-auto animate-bounce-in">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Recording Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Upload Success Alert */}
          {uploadSuccess && (
            <Alert className="mb-8 max-w-xl mx-auto border-green-200 bg-green-50 animate-bounce-in">
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
              <div className="w-full max-w-4xl aspect-video rounded-3xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-6 animate-fade-in relative overflow-hidden glass-strong">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center glow-primary">
                    <Monitor className="h-12 w-12 text-primary animate-float" />
                  </div>
                  <div className="text-center max-w-md">
                    <h3 className="text-xl font-semibold mb-2">Ready to Record</h3>
                    <p className="text-muted-foreground">
                      Your screen recording will appear here. Configure your settings below and click record to start.
                    </p>
                  </div>
                  
                  {/* Quality Badge */}
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {recordingQuality === "high" ? "HD Quality" : "Standard Quality"} Recording
                  </Badge>
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {(state === "recording" || state === "paused") && (
              <div className="w-full max-w-4xl aspect-video rounded-3xl border border-border flex flex-col items-center justify-center gap-6 relative overflow-hidden glass-strong animate-scale-in">
                <div className={`absolute inset-0 transition-all duration-1000 ${
                  state === "recording" 
                    ? "bg-gradient-to-br from-red-500/10 to-orange-500/10" 
                    : "bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
                }`} />
                
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                    state === "recording" 
                      ? "bg-red-500/20 glow-recording" 
                      : "bg-yellow-500/20"
                  }`}>
                    <Monitor className={`h-16 w-16 ${
                      state === "recording" ? "text-red-500" : "text-yellow-500"
                    }`} />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      {state === "recording" ? "Recording in Progress" : "Recording Paused"}
                    </h3>
                    <div className="flex items-center gap-2 justify-center">
                      <Clock className="h-4 w-4" />
                      <span className="text-lg font-mono">{formatDuration(duration)}</span>
                    </div>
                  </div>

                  {/* Recording Features Indicator */}
                  <div className="flex items-center gap-4">
                    {includeAudio && (
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                        🎤 Audio
                      </Badge>
                    )}
                    {includeWebcam && (
                      <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">
                        📹 Webcam
                      </Badge>
                    )}
                    <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/30">
                      🖥️ Screen
                    </Badge>
                  </div>
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

            {/* Enhanced Controls */}
            <div className="w-full max-w-2xl bg-card rounded-3xl border border-border p-8 shadow-2xl glass-strong animate-slide-up">
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
