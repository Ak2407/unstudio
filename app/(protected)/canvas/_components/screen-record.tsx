"use client";

import { Button } from "@/components/ui/button";
import { OctagonPause, Play, UploadIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ScreenRecord = () => {
  const [status, setStatus] = useState<
    "idle" | "recording" | "stopping" | "stopped" | "paused"
  >("idle");
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | undefined>(
    undefined
  );
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null); // Store the actual Blob
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaChunks = useRef<Blob[]>([]);
  const mediaStream = useRef<MediaStream | null>(null);

  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      // Cleanup media stream when component unmounts
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!mediaBlob) return; // Use the Blob object

    setUploading(true);
    const formData = new FormData();
    formData.append("file", mediaBlob); // Append the Blob object

    try {
      const response = await fetch("/api/s3-upload-blob", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.status);
      setUploading(false);
      location.reload();
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const startRecording = async () => {
    setStatus("idle");
    try {
      mediaStream.current = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      mediaRecorder.current = new MediaRecorder(mediaStream.current);

      mediaRecorder.current.ondataavailable = (event) => {
        mediaChunks.current.push(event.data);
      };

      mediaRecorder.current.onstart = () => {
        setStatus("recording");
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(mediaChunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setMediaBlob(blob); // Set the Blob object
        setMediaBlobUrl(url); // Set the URL for viewing
        setStatus("stopped");
        mediaChunks.current = [];
      };

      mediaRecorder.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setStatus("idle");
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accessing media devices.", error);
      setStatus("idle");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      setStatus("stopping");
      mediaRecorder.current.stop();
      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.pause();
      setStatus("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "paused") {
      mediaRecorder.current.resume();
      setStatus("recording");
    }
  };

  const viewRecording = () => {
    if (mediaBlobUrl) {
      window.open(mediaBlobUrl, "_blank")?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-row">
      {status !== "recording" && (
        <Button
          variant="ghost"
          className="flex items-center flex-row justify-center gap-2"
          onClick={startRecording}
        >
          {mediaBlobUrl ? (
            <>
              <h1>Record again</h1>
              <Play className="h-4 w-4 text-green-600" />
            </>
          ) : (
            <>
              <h1>Start Recording</h1>
              <Play className="h-4 w-4 text-green-600" />
            </>
          )}
        </Button>
      )}
      {status === "recording" && (
        <Button
          variant="ghost"
          className="flex items-center flex-row justify-center gap-2"
          onClick={stopRecording}
        >
          <h1>Stop</h1>
          <OctagonPause className="h-4 w-4 text-red-600" />
        </Button>
      )}
      {status === "paused" && (
        <Button
          variant="ghost"
          className="flex items-center flex-row justify-center gap-2"
          onClick={resumeRecording}
        >
          <h1>Resume</h1>
          <Play className="h-4 w-4 text-green-600" />
        </Button>
      )}
      {mediaBlobUrl && status === "stopped" && (
        <Button
          onClick={viewRecording}
          className="flex items-center flex-row justify-center gap-2"
          variant="ghost"
        >
          View
        </Button>
      )}
      {mediaBlobUrl && status === "stopped" && (
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={uploading}
          variant="outline"
          size="sm"
        >
          {uploading ? (
            "Uploading..."
          ) : (
            <div className="flex items-center justify-center gap-4">
              <h1>Upload</h1>
              <UploadIcon className="h-4 w-4" />
            </div>
          )}
        </Button>
      )}
    </div>
  );
};

export default ScreenRecord;
