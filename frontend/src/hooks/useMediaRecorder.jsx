import { useState, useRef, useCallback } from "react";

export const useMediaRecorder = (options = {}) => {
  const { includeAudio = true, includeWebcam = false } = options;

  const [state, setState] = useState("idle");
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [webcamStream, setWebcamStream] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  
  // Stream refs
  const screenStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  
  // Canvas/Drawing refs
  const canvasRef = useRef(null);
  const screenVideoRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cleanupStreams = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (screenVideoRef.current) {
      screenVideoRef.current.pause();
      screenVideoRef.current.srcObject = null;
      if (screenVideoRef.current.parentNode) {
        screenVideoRef.current.parentNode.removeChild(screenVideoRef.current);
      }
      screenVideoRef.current = null;
    }
    
    if (webcamVideoRef.current) {
      webcamVideoRef.current.pause();
      webcamVideoRef.current.srcObject = null;
      if (webcamVideoRef.current.parentNode) {
        webcamVideoRef.current.parentNode.removeChild(webcamVideoRef.current);
      }
      webcamVideoRef.current = null;
    }

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
      setWebcamStream(null);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      chunksRef.current = [];

      // Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" },
        audio: true,
      });
      screenStreamRef.current = screenStream;

      const audioTracks = [];

      // Get audio stream if enabled
      if (includeAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100,
            },
          });
          audioStreamRef.current = audioStream;
          audioTracks.push(...audioStream.getAudioTracks());
        } catch (audioErr) {
          console.warn("Could not access microphone:", audioErr);
        }
      }

      // Add system audio from screen share if available
      const screenAudioTracks = screenStream.getAudioTracks();
      if (screenAudioTracks.length > 0) {
        audioTracks.push(...screenAudioTracks);
      }

      // Get webcam stream if enabled
      if (includeWebcam) {
        try {
          const webcamStreamData = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720, facingMode: "user" },
          });
          webcamStreamRef.current = webcamStreamData;
          setWebcamStream(webcamStreamData);
        } catch (webcamErr) {
          console.warn("Could not access webcam:", webcamErr);
        }
      }

      // === CANVAS MERGING LOGIC ===
      // Setup hidden video elements
      const screenVideo = document.createElement("video");
      screenVideo.srcObject = screenStream;
      screenVideo.muted = true;
      screenVideo.playsInline = true;
      screenVideo.autoplay = true;
      Object.assign(screenVideo.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '1px',
        height: '1px',
        opacity: '0',
        pointerEvents: 'none'
      });
      document.body.appendChild(screenVideo);
      screenVideo.play().catch(console.error);
      screenVideoRef.current = screenVideo;

      // Wait for screen video to have metadata to set canvas size
      await new Promise((resolve) => {
        screenVideo.onloadedmetadata = () => resolve();
      });

      const canvas = document.createElement("canvas");
      canvas.width = screenVideo.videoWidth;
      canvas.height = screenVideo.videoHeight;
      const ctx = canvas.getContext("2d");
      canvasRef.current = canvas;

      let webcamVideo = null;
      if (includeWebcam && webcamStreamRef.current) {
        webcamVideo = document.createElement("video");
        webcamVideo.srcObject = webcamStreamRef.current;
        webcamVideo.muted = true;
        webcamVideo.playsInline = true;
        webcamVideo.autoplay = true;
        Object.assign(webcamVideo.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '1px',
          height: '1px',
          opacity: '0',
          pointerEvents: 'none'
        });
        document.body.appendChild(webcamVideo);
        webcamVideo.play().catch(console.error);
        webcamVideoRef.current = webcamVideo;
        
        // Wait for webcam metadata as well to know its aspect ratio
        await new Promise((resolve) => {
          webcamVideo.onloadedmetadata = () => resolve();
        });
      }

      const drawFrame = () => {
        if (!ctx) return;
        
        // Draw screen stream
        if (screenVideo.readyState >= 2) {
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        }

        // Draw webcam stream as Picture-in-Picture in bottom right
        if (webcamVideo && webcamVideo.readyState >= 2) {
          const padding = 20;
          // Make webcam 20% of the canvas width
          const camWidth = canvas.width * 0.2;
          const camHeight = (webcamVideo.videoHeight / webcamVideo.videoWidth) * camWidth;
          
          const x = canvas.width - camWidth - padding;
          const y = canvas.height - camHeight - padding;

          // Draw a small border/shadow for webcam
          ctx.save();
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.lineWidth = 4;
          ctx.strokeStyle = "white";
          ctx.strokeRect(x, y, camWidth, camHeight);
          ctx.drawImage(webcamVideo, x, y, camWidth, camHeight);
          ctx.restore();
        }

        animationFrameRef.current = requestAnimationFrame(drawFrame);
      };

      // Start drawing loop
      drawFrame();

      // Capture stream from canvas at 30fps
      const canvasStream = canvas.captureStream(30);
      const videoTracks = canvasStream.getVideoTracks();

      // Combine video from canvas and audio tracks
      const combinedTracks = [...videoTracks, ...audioTracks];
      const combinedStream = new MediaStream(combinedTracks);

      const preferredMimeTypes = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp8",
        "video/webm",
      ];

      const selectedMimeType = preferredMimeTypes.find((mimeType) =>
        MediaRecorder.isTypeSupported(mimeType)
      );

      const mediaRecorderOptions = selectedMimeType ? { mimeType: selectedMimeType } : undefined;
      const mediaRecorder = mediaRecorderOptions
        ? new MediaRecorder(combinedStream, mediaRecorderOptions)
        : new MediaRecorder(combinedStream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const chunkType = chunksRef.current[0]?.type || selectedMimeType || "video/webm";
        const blob = new Blob(chunksRef.current, { type: chunkType });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
        cleanupStreams();
        stopTimer();
      };

      // Handle when user stops sharing screen via browser UI
      screenStream.getVideoTracks()[0].onended = () => {
        if (mediaRecorderRef.current?.state !== "inactive") {
          stopRecording();
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setState("recording");
      setDuration(0);
      startTimer();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start recording"
      );
      cleanupStreams();
      setState("idle");
    }
  }, [includeAudio, includeWebcam, cleanupStreams, startTimer, stopTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setState("paused");
      stopTimer();
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setState("recording");
      startTimer();
    }
  }, [startTimer]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setState("stopped");
    }
  }, []);

  const resetRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setDuration(0);
    setState("idle");
    setError(null);
    chunksRef.current = [];
  }, [recordedUrl]);

  return {
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
  };
};
