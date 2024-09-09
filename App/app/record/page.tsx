"use client";
import Header from "@/components/ui/Header";
import { useEffect, useState } from "react";
import { Mic } from "react-feather";
import { Button } from "@/components/shadcn/Button";

import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function RecordVoicePage() {
  const [title, setTitle] = useState("Record!");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const [transcript, setTranscript] = useState<string | null>(null);

  const processedTranscript = useAction(api.events.processTranscript);
  const generatedUploadUrl = useMutation(api.events.generateUploadUrl);
  const transcribe = useAction(api.events.transcribeAudio);

  async function startRecording() {
    setIsRunning(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let audioChunks: any = [];

    recorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });

      const postUrl = await generatedUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "audio/mp3" },
        body: audioBlob,
      });

      const { storageId } = await result.json();

      const transcription = await transcribe({ storageId });
      console.log(transcription.transcript);
      setTranscript(transcription.transcript);
    };
    setMediaRecorder(recorder as any);
    recorder.start();
  }

  function stopRecording() {
    // @ts-ignore
    mediaRecorder.stop();
    setIsRunning(false);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  function formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  const handleRecordClick = async () => {
    if (title === "Record!") {
      setTitle("Recording...");
      startRecording();
    } else if (title === "Recording...") {
      setTitle("Processing...");
      stopRecording();
    }
  };

  const handleExtractTranscript = async () => {
    try {
      const result = await processedTranscript({
        transcript: transcript ?? "",
      });
      console.log("Processed Transcript Result:", result);
    } catch (error) {
      console.error("Error processing transcript:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className=" flex flex-col items-center justify-between">
        <h1 className="pt-[25px] text-center text-xl font-medium text-dark md:pt-[47px] md:text-4xl">
          {title}
        </h1>
        <div className="relative mx-auto my-16 items-center justify-center">
          <div className="z-50 flex h-fit w-fit flex-col items-center justify-center">
            <h2 className="text-[30px] tracking-[-1.0px]">
              {formatTime(Math.floor(totalSeconds / 60))}:
              {formatTime(totalSeconds % 60)}
            </h2>
          </div>
          <div className="mt-2 flex w-fit items-center justify-center gap-[33px] pb-7 md:gap-[77px] ">
            <button
              onClick={handleRecordClick}
              className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-radial from-white to-secondary shadow-xl transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="absolute h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                {!isRunning ? (
                  <Mic className="h-8 w-8 text-white" />
                ) : (
                  <Mic className="h-8 w-8 text-white animate-pulse transition" />
                )}
              </div>
            </button>
          </div>
        </div>

        <div>
          {transcript && (
            <div>
              <h2>Transcript:</h2>
              <p>{transcript}</p>
            </div>
          )}
        </div>

        <Button onClick={handleExtractTranscript}>Looks good!</Button>

        {/* {audioBlob && (
          <div className="mt-10">
            <h2 className="text-center text-xl font-medium text-dark">
              Playback
            </h2>
            <audio controls src={URL.createObjectURL(audioBlob)} />
          </div>
        )} */}
      </div>
    </div>
  );
}

