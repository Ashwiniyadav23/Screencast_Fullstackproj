import { useEffect, useRef } from "react";

const WebcamPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="fixed bottom-24 right-6 z-40 animate-scale-in">
      <div className="relative">
        <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-lg" />
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="relative w-40 h-30 md:w-48 md:h-36 rounded-xl border-2 border-primary/50 shadow-2xl object-cover"
        />
      </div>
    </div>
  );
};

export default WebcamPreview;
