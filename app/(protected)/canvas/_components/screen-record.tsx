"use client";

import { Button } from "@/components/ui/button";
import { OctagonPause, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder-2";

const ScreenRecord = () => {
  const [recordingNumber, setRecordingNumber] = useState(0);

  const {
    status,
    startRecording: startRecord,
    stopRecording: stopRecord,
    mediaBlobUrl,
  } = useReactMediaRecorder({ screen: true });

  // Effect to handle cleanup
  useEffect(() => {
    return () => {
      if (status === "recording") {
        stopRecord(); // Ensure recording is stopped
      }
    };
  }, [status, stopRecord]);

  const startRecording = () => {
    return startRecord();
  };

  const stopRecording = () => {
    const currentTimeStamp = new Date().getTime();
    setRecordingNumber(currentTimeStamp);
    return stopRecord();
  };

  const viewRecording = () => {
    if (mediaBlobUrl) {
      window.open(mediaBlobUrl, "_blank")?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-row">
      <h1>Status: {status}</h1>
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
      {mediaBlobUrl && status === "stopped" && (
        <Button
          onClick={viewRecording}
          className="flex items-center flex-row justify-center gap-2"
          variant="ghost"
        >
          View
        </Button>
      )}
    </div>
  );
};

export default ScreenRecord;
