import { Download, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VideoPreviewProps {
  videoUrl: string;
  videoBlob: Blob;
  onDiscard: () => void;
}

const VideoPreview = ({ videoUrl, videoBlob, onDiscard }: VideoPreviewProps) => {
  const { toast } = useToast();

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

  const handleShare = async () => {
    if (navigator.share && navigator.canShare) {
      const file = new File([videoBlob], "screencast.webm", {
        type: "video/webm",
      });

      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "My Screen Recording",
            text: "Check out my screen recording!",
          });
          toast({
            title: "Shared Successfully",
            description: "Your recording has been shared.",
          });
        } catch (err) {
          if ((err as Error).name !== "AbortError") {
            toast({
              title: "Share Failed",
              description: "Unable to share the recording.",
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: "Sharing Not Supported",
          description: "Your device doesn't support file sharing.",
          variant: "destructive",
        });
      }
    } else {
      // Fallback: copy link or show message
      toast({
        title: "Sharing Not Supported",
        description: "Download the video to share it manually.",
        variant: "destructive",
      });
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
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Size: {(videoBlob.size / (1024 * 1024)).toFixed(2)} MB
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="default" size="sm" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="ghost" size="sm" onClick={onDiscard} className="gap-2 text-destructive hover:text-destructive">
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
