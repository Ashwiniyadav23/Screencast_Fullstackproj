import { useState, useRef } from "react";
import { Download, Share2, Trash2, Cloud, Copy, Check, Loader2, Edit, Scissors, Palette, Volume2, VolumeX, RotateCcw, Download as DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast.jsx";
import { useAuth } from "@/hooks/useAuth.jsx";
import { recordingService } from "@/services/recordingService.jsx";

const VideoPreview = ({ videoUrl, videoBlob, onDiscard, onUploadSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState(`Recording ${new Date().toLocaleDateString()}`);
  const [recordingDescription, setRecordingDescription] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showEditTools, setShowEditTools] = useState(false);

  const handleUploadToCloud = async () => {
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please sign in to upload to cloud.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const safeTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${recordingTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${safeTimestamp}.webm`;
      
      const recording = await recordingService.uploadRecording(
        videoBlob,
        fileName,
        user.id
      );

      // Save enhanced metadata
      await recordingService.saveRecordingMetadata(user.id, {
        title: recordingTitle,
        description: recordingDescription,
        path: recording.path,
        fileSize: videoBlob.size,
        duration: Math.floor((videoRef.current?.duration || 0)),
        url: recording.url,
        tags: [], // Can be extended later
        thumbnail: null, // Can be generated later
      });

      setUploadedUrl(recording.public_url || recording.url);
      
      toast({
        title: "Upload Successful! 🎉",
        description: "Your recording has been saved to cloud.",
      });

      if (onUploadSuccess) {
        onUploadSuccess(recording);
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      let errorDescription = "Failed to upload recording to cloud.";
      
      if (error.message?.includes("Bucket not found") || error.message?.includes("recordings")) {
        errorDescription = 'File upload failed. Please:\n1. Check that the backend server is running\n2. Verify your internet connection\n3. Ensure the upload directory has write permissions\n4. Try uploading again';
      } else if (error.message?.includes("Storage bucket not configured")) {
        errorDescription = error.message;
      } else if (error.message?.includes("not authenticated")) {
        errorDescription = "You must be signed in to upload recordings.";
      }
      
      toast({
        title: "Upload Failed",
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied 📋",
        description: "Shareable link copied to clipboard.",
      });
    }
  };

  const handleShare = async () => {
    if (!uploadedUrl) {
      toast({
        title: "Upload First",
        description: "Please upload to cloud before sharing.",
        variant: "destructive",
      });
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: recordingTitle,
          text: recordingDescription || "Check out my screen recording!",
          url: uploadedUrl,
        });
        toast({
          title: "Shared Successfully 🚀",
          description: "Your recording link has been shared.",
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          toast({
            title: "Share Failed",
            description: "Unable to share the recording.",
            variant: "destructive",
          });
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Video editing functions
  const applyVideoEffects = () => {
    if (videoRef.current) {
      videoRef.current.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.muted = isMuted;
    }
  };

  const resetVideoEffects = () => {
    setBrightness(100);
    setContrast(100);
    setPlaybackSpeed(1);
    setIsMuted(false);
    if (videoRef.current) {
      videoRef.current.style.filter = "none";
      videoRef.current.playbackRate = 1;
      videoRef.current.muted = false;
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `${recordingTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Download Started 📥",
      description: "Your recording is being downloaded.",
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-scale-in">
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-2xl hover-lift">
        {/* Enhanced Video Player */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
            playsInline
            onLoadedMetadata={applyVideoEffects}
          />
          
          {/* Video Overlay Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => setShowEditTools(!showEditTools)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="p-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                      Recording Title
                    </Label>
                    <Input
                      id="title"
                      value={recordingTitle}
                      onChange={(e) => setRecordingTitle(e.target.value)}
                      placeholder="Enter recording title..."
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                      Description (Optional)
                    </Label>
                    <Input
                      id="description"
                      value={recordingDescription}
                      onChange={(e) => setRecordingDescription(e.target.value)}
                      placeholder="Add a description..."
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <h4 className="font-medium text-sm mb-3">File Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <Badge variant="outline">{(videoBlob.size / (1024 * 1024)).toFixed(2)} MB</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <Badge variant="outline">WebM</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        {uploadedUrl ? (
                          <Badge className="bg-green-100 text-green-700">
                            <Check className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Local</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Editor Tab */}
            <TabsContent value="editor" className="space-y-6 mt-6">
              <div className="bg-muted/30 rounded-2xl p-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Video Effects
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Brightness: {brightness}%
                      </Label>
                      <Slider
                        value={[brightness]}
                        onValueChange={(value) => setBrightness(value[0])}
                        min={50}
                        max={150}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Contrast: {contrast}%
                      </Label>
                      <Slider
                        value={[contrast]}
                        onValueChange={(value) => setContrast(value[0])}
                        min={50}
                        max={150}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Playback Speed: {playbackSpeed}x
                      </Label>
                      <Slider
                        value={[playbackSpeed]}
                        onValueChange={(value) => setPlaybackSpeed(value[0])}
                        min={0.25}
                        max={2}
                        step={0.25}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={applyVideoEffects}
                        className="flex-1"
                      >
                        Apply Effects
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={resetVideoEffects}
                        size="icon"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!uploadedUrl ? (
                  <div className="md:col-span-2">
                    <Button 
                      onClick={handleUploadToCloud} 
                      disabled={uploading}
                      className="w-full h-14 text-lg glow-primary"
                      size="lg"
                    >
                      <Cloud className="h-5 w-5 mr-2" />
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading to Cloud...
                        </>
                      ) : (
                        "Upload to Cloud Storage"
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      onClick={handleCopyLink}
                      variant="outline"
                      className="h-12"
                      size="lg"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copied ? "Copied!" : "Copy Share Link"}
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline"
                      className="h-12"
                      size="lg"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Recording
                    </Button>
                  </>
                )}
                
                <Button 
                  onClick={handleDownload} 
                  variant="outline"
                  className="h-12"
                  size="lg"
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download Local Copy
                </Button>
                
                <Button 
                  onClick={onDiscard} 
                  variant="ghost"
                  className="h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                  size="lg"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Discard Recording
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
