import { useEffect, useRef } from "react";
import { Maximize2 } from "lucide-react";

const WebcamPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // Tab became hidden (user switched tabs)
        try {
          if (document.pictureInPictureEnabled && videoRef.current && !document.pictureInPictureElement) {
            await videoRef.current.requestPictureInPicture();
          }
        } catch (error) {
          console.error("Auto Picture-in-Picture failed:", error);
        }
      } else {
        // Tab became visible again
        try {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          }
        } catch (error) {
          console.error("Exit Picture-in-Picture failed:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled && videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("Picture-in-Picture failed:", error);
    }
  };

  if (!stream) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white shadow-2xl animate-fade-in group">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        Live
      </div>
      <button 
        onClick={togglePiP} 
        className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded opacity-100 transition-opacity"
        title="Pop-out camera (Picture-in-Picture)"
      >
        <Maximize2 size={14} />
      </button>
    </div>
  );
};

export default WebcamPreview;