import { useState } from "react";
import { Download, Share2, Trash2, Cloud, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { useToast } from "@/hooks/use-toast.jsx";
import { useAuth } from "@/hooks/useAuth.jsx";
import { recordingService } from "@/services/recordingService.jsx";

const VideoPreview = ({ videoUrl, videoBlob, onDiscard, onUploadSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `screencast-${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Download Started",
      description: "Your recording is being downloaded.",
    });
  };

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
      const fileName = `recording-${new Date().toISOString()}.webm`;
      
      const recording = await recordingService.uploadRecording(
        videoBlob,
        fileName,
        user.id
      );

      // Save metadata
      await recordingService.saveRecordingMetadata(user.id, {
        title: `Recording ${new Date().toLocaleDateString()}`,
        path: recording.path,
        fileSize: videoBlob.size,
        duration: Math.floor((new Date() - new Date()) / 1000), // Could be calculated from video
        url: recording.url,
      });

      setUploadedUrl(recording.url);
      
      toast({
        title: "Upload Successful",
        description: "Your recording has been saved to cloud.",
      });

      if (onUploadSuccess) {
        onUploadSuccess(recording);
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      let errorDescription = "Failed to upload recording to cloud.";
      
      if (error.message?.includes("Bucket not found") || error.message?.includes("recordings")) {
        errorDescription = 'Storage bucket "recordings" not configured. Please:\n1. Go to Supabase Dashboard → Storage\n2. Create a new bucket named "recordings"\n3. Uncheck "Private bucket" to make it PUBLIC\n4. Try uploading again';
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
        title: "Link Copied",
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
          title: "My Screen Recording",
          text: "Check out my screen recording!",
          url: uploadedUrl,
        });
        toast({
          title: "Shared Successfully",
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

  return (
    <div className="w-full max-w-4xl mx-auto animate-scale-in">
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
        {/* Video Player */}
        <div className="relative aspect-video bg-muted">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
            playsInline
          />
        </div>

        {/* Action Bar */}
        <div className="p-4 flex flex-col gap-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Size: {(videoBlob.size / (1024 * 1024)).toFixed(2)} MB
            </div>
            {uploadedUrl && (
              <div className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Uploaded to cloud
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!uploadedUrl ? (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleUploadToCloud} 
                disabled={uploading}
                className="gap-2"
              >
                <Cloud className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload to Cloud"}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyLink}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload} 
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDiscard} 
              className="gap-2 text-destructive hover:text-destructive ml-auto"
            >
              <Trash2 className="h-4 w-4" />
              Discard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
