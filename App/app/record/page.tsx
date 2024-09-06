"use client";
import Header from "@/components/ui/Header";
import { useEffect, useState } from "react";
import { Mic, AlertTriangle } from "react-feather";
import { set } from "zod";
import { Button } from "@/components/shadcn/Button";

import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { extractTranscript } from "@/convex/openai/gpt";
import { processTranscript } from "@/convex/events";

export default function RecordVoicePage() {
  const [title, setTitle] = useState("Record your voice note");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<{
    name: string;
    date: string;
    time: string;
    description: string;
  } | null>(null);
  const processedTranscript = useAction(api.events.processTranscript);

  async function startRecording() {
    setIsRunning(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let audioChunks: any = [];

    recorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      setAudioBlob(audioBlob);
      // You can now use the audioBlob for transcription or other purposes
      console.log("Recording stopped, audioBlob:", audioBlob);

      const audioUrl = URL.createObjectURL(audioBlob);
      handleTranscription(audioUrl);
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
    if (title === "Record your voice note") {
      setTitle("Recording...");
      startRecording();
    } else if (title === "Recording...") {
      setTitle("Processing...");
      stopRecording();
    }
  };

  const processTranscription = async () => {
    console.log("Processing transcription...");
    try {
      await handleTranscription("https://www.meganwu.me/test.mp3");
      // https://replicate.delivery/mgxm/e5159b1b-508a-4be4-b892-e1eb47850bdc/OSR_uk_000_0050_8k.wav
    } catch (error) {
      console.error("Error during processTranscription", error);
    }
  };

  const transcribe = useAction(api.events.transcribeAudio);

  const handleTranscription = async (audioUrl: any) => {
    const transcription = await transcribe({
      fileUrl: audioUrl,
    });
    console.log("audio url", audioUrl);
    console.log("Transcription:", transcription);

    setTranscript(JSON.stringify(transcription.transcript));
  };

  const handleExtractTranscript = async () => {
    const inputTranscript =
      "I have a standup at 9am on tuesday, September 10th to sort out the week's todos and recap.";
    try {
      const result = await processedTranscript({ transcript: inputTranscript });
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
        <p className="mb-20 mt-4 text-gray-400">imagine this is today's date</p>
        <div className="relative mx-auto flex h-[316px] w-[316px] items-center justify-center">
          <div
            className={`recording-box absolute h-full w-full rounded-[50%] p-[12%] pt-[17%] ${
              title !== "Record your voice note" && title !== "Processing..."
                ? "record-animation"
                : ""
            }`}
          >
            <div
              className="h-full w-full rounded-[50%]"
              style={{ background: "linear-gradient(#E31C1CD6, #003EB6CC)" }}
            />
          </div>
          <div className="z-50 flex h-fit w-fit flex-col items-center justify-center">
            <h1 className="text-[60px] leading-[114.3%] tracking-[-1.5px] text-light">
              {formatTime(Math.floor(totalSeconds / 60))}:
              {formatTime(totalSeconds % 60)}
            </h1>
          </div>
        </div>
        <div className="mt-10 flex w-fit items-center justify-center gap-[33px] pb-7 md:gap-[77px] ">
          <button
            onClick={handleRecordClick}
            className="mt-10 h-fit w-fit rounded-[50%] border-[2px]"
            style={{ boxShadow: "0px 0px 8px 5px rgba(0,0,0,0.3)" }}
          >
            {!isRunning ? (
              <Mic
                width={148}
                height={148}
                className="h-[70px] w-[70px] md:h-[100px] md:w-[100px]"
              />
            ) : (
              <Mic
                width={148}
                height={148}
                className="h-[70px] w-[70px] animate-pulse transition md:h-[100px] md:w-[100px]"
              />
            )}
          </button>
          {/* )} */}
        </div>
        <Button onClick={handleExtractTranscript}>Extract Transcript</Button>
        <div>
          <button onClick={processTranscription}>Process Transcription</button>
          {transcript && (
            <div>
              <h2>Transcript:</h2>
              <p>{transcript}</p>
            </div>
          )}
        </div>

        {audioBlob && (
          <div className="mt-10">
            <h2 className="text-center text-xl font-medium text-dark">
              Playback
            </h2>
            <audio controls src={URL.createObjectURL(audioBlob)} />
          </div>
        )}
      </div>
    </div>
  );
}

