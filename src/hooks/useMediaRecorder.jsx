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
  const screenStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);

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

      const tracks = [...screenStream.getVideoTracks()];

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
          tracks.push(...audioStream.getAudioTracks());
        } catch (audioErr) {
          console.warn("Could not access microphone:", audioErr);
        }
      }

      // Add system audio from screen share if available
      const screenAudioTracks = screenStream.getAudioTracks();
      if (screenAudioTracks.length > 0) {
        tracks.push(...screenAudioTracks);
      }

      // Get webcam stream if enabled
      if (includeWebcam) {
        try {
          const webcamStreamData = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240, facingMode: "user" },
          });
          webcamStreamRef.current = webcamStreamData;
          setWebcamStream(webcamStreamData);
        } catch (webcamErr) {
          console.warn("Could not access webcam:", webcamErr);
        }
      }

      const combinedStream = new MediaStream(tracks);

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
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
