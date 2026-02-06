import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { useToast } from "@/hooks/use-toast.jsx";
import { useAuth } from "@/hooks/useAuth.jsx";
import { recordingService } from "@/services/api.js";
import {
  Cloud,
  Copy,
  Check,
  Loader2,
  Share2,
} from "lucide-react";

const VideoPreview = ({ videoUrl, videoBlob, onDiscard, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleUploadToCloud = async () => {
    if (!user) {
      toast({
        title: "Not Signed In",
        description: "Please sign in to upload recordings.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileName = `recording-${Date.now()}.webm`;
      const title = `Recording ${new Date().toLocaleDateString()}`;

      const recording = await recordingService.uploadRecording(
        videoBlob,
        fileName,
        title
      );

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
      
      const errorMsg = error?.error || error?.message || "Failed to upload recording.";
      
      toast({
        title: "Upload Failed",
        description: errorMsg,
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out my screen recording!",
          text: "I recorded this with ScreenCast Pro",
          url: uploadedUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6 animate-fade-in">
      {/* Video Player */}
      <div className="relative group bg-black rounded-2xl border border-border overflow-hidden shadow-2xl aspect-video">
        <video
          src={videoUrl}
          controls
          className="w-full h-full"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* File Info */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">File Size</p>
            <p className="text-lg font-semibold">
              {(videoBlob.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="text-lg font-semibold">WebM Video</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-col sm:flex-row">
        {!uploadedUrl ? (
          <>
            <Button
              onClick={handleUploadToCloud}
              disabled={uploading}
              className="flex-1"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Cloud className="mr-2 h-4 w-4" />
                  Upload to Cloud
                </>
              )}
            </Button>
            <Button
              onClick={onDiscard}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Discard
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1"
              size="lg"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Uploaded to cloud
              </span>
            </div>
          </>
        )}
      </div>

      {uploadedUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 break-all">
            <strong>Share URL:</strong> {uploadedUrl}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
