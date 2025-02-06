"use client";

import { useToast } from "@/components/shadcn/use-toast";
import { Toaster } from "@/components/shadcn/toaster";

import CalendarCard from "@/components/ui/CalendarCard";
import Header from "@/components/ui/Header";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/authContext";
import { useAction, useMutation } from "convex/react";
import { parseISO, format, parse } from "date-fns";
import { Calendar, ExternalLink, Mic, Search } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

export default function Dashb() {
  const posthog = usePostHog();
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [events, setEvents] = useState<any[]>([]);
  const [recentlyCreatedEvents, setRecentlyCreatedEvents] = useState<any[]>([]);

  const [userTimezone, setUserTimezone] = useState<string | null>(null);
  const timezone = "America/New_York";

  const [title, setTitle] = useState("Press to Record");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const [transcript, setTranscript] = useState<string | null>(null);

  const [viewModal, setViewModal] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  const { toast } = useToast();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const formatDate = (dateTime: string) => {
    const date = parseISO(dateTime);
    return format(date, "dd MMM yyyy");
  };

  const parseDate = (date?: string) => {
    if (!date) {
      return;
    }
    const parsedDate = parse(date, "yyyy-MM-dd", new Date());
    return format(parsedDate, "dd MMM yyyy");
  };

  const formatTime = (dateTime: string) => {
    const date = parseISO(dateTime);
    return format(date, "hh:mm a");
  };

  useEffect(() => {
    setUserTimezone(timezone);
    const fetchEvents = async () => {
      try {
        const now = new Date();
        const today = now.toISOString();

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${today}&orderBy=startTime&singleEvents=true`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events !response.ok");
        }
        const data = await response.json();
        setEvents(data.items || []);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };

    if (accessToken) {
      fetchEvents();
    }
  }, [accessToken]);

  const filteredEvents = events.filter((event) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const eventDate = event.start?.dateTime
      ? format(parseISO(event.start.dateTime), "yyyy-MM-dd") // Format as "2025-02-07"
      : "";

    return (
      event.summary?.toLowerCase().includes(lowerCaseSearchTerm) ||
      eventDate.includes(lowerCaseSearchTerm) ||
      event.location?.toLowerCase().includes(lowerCaseSearchTerm) ||
      event.description?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const upcomingEvents = filteredEvents.slice(0, 4);

  const createEvent = async () => {
    if (!accessToken) {
      console.error("Access token is missing. Please log in first.");
      return;
    }
    console.log(accessToken);
    try {
      const result = await handleExtractTranscript();

      if (result) {
        const { name, date, location, startTime, endTime, description } =
          result;

        const startDateTime = `${date}T${startTime}`;
        const endDateTime = `${date}T${endTime}`;

        const event = {
          summary: name,
          description: description,
          start: startTime
            ? {
                dateTime: startDateTime,
                timeZone: userTimezone,
              }
            : {
                date: date,
              },
          end: startTime
            ? {
                dateTime: endDateTime,
                timeZone: userTimezone,
              }
            : {
                date: date,
              },
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 },
              { method: "popup", minutes: 10 },
            ],
          },
          ...(location && { location: location }),
        };

        // Send the request to create the event using fetch
        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setRecentlyCreatedEvents((prevEvents) => [...prevEvents, data]);

          console.log("Event created:", data);
          toast({
            title: "Event created!",
            description: (
              <span className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
                <a
                  href={data.htmlLink}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    posthog.capture("user-clicked-viewevent", {
                      event_link: data.htmlLink,
                    });
                  }}
                >
                  Click here to view event
                </a>
                <ExternalLink className="h-3 w-3" />
              </span>
            ),
          });
        }
        if (!response.ok) {
          setViewModal(true);
          // const errorText = await response.text();
          // console.error(
          //   `Error creating event: ${response.status} ${response.statusText}`,
          //   errorText
          // );
          throw new Error(`Error creating event: ${response.statusText}`);
        }
      }
    } catch (error) {
      setViewModal(true);
      posthog.capture("user-triggered-errormodal");
      console.error("Error creating event(create event trycatch):", error);
    }
  };

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
      // console.log(transcription.transcript);
      setTranscript(transcription.transcript);
      setTitle("Press to Record");
      setIsLoading(false);
      setTotalSeconds(0);
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

  function formatRecordingTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  const handleRecordClick = async () => {
    if (title === "Press to Record") {
      setTitle("Recording...");
      setTranscript(null);
      startRecording();
      posthog.capture("user-clicked-record");
    } else if (title === "Recording...") {
      setTitle("Processing...");
      setIsLoading(true);
      stopRecording();
      posthog.capture("user-stopped-recording");
    }
  };

  const handleExtractTranscript = async () => {
    try {
      const result = await processedTranscript({
        transcript: transcript ?? "",
      });
      console.log("Processed Transcript Result:", result);
      return {
        date: result.date,
        location: result.location,
        startTime: result.startTime,
        endTime: result.endTime,
        description: result.description,
        name: result.name,
      };
    } catch (error) {
      console.error("Error processing transcript(extract transcript):", error);
    }
  };

  useEffect(() => {
    if (transcript) {
      createEvent();
    }
    if (accessToken) {
      setSlideIn(true);
    }
  }, [transcript, accessToken]);

  const getFormattedDate = () => {
    const date = new Date();
    const dayOfWeek = date.toLocaleString("default", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });

    return { dayOfWeek, day, month };
  };
  const { dayOfWeek, day, month } = getFormattedDate();

  return (
    <>
      <Header />
      <Toaster />
      <div className="relative min-h-[350px] md:min-h-[605px] w-full px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-0">
        <div className="md:w-full flex-col md:flex items-center justify-center">
          <div className="md:flex items-center md:items-start gap-4">
            <div className="w-full md:w-[270px]">
              <div className="bg-card/50 rounded-md mx-4 md:mx-0 md:px-6 pb-2 pt-6">
                <div className="flex flex-col items-center justify-between mt-0">
                  <div className="flex items-center justify-center mb-2">
                    <p className="text-2xl font-semibold text-foreground/80">
                      {title}
                    </p>
                  </div>

                  <div className="relative mx-auto items-center justify-center">
                    <div className="flex items-center justify-center">
                      <div className="flex-col items-center justify-center">
                        <h2 className="text-2xl text-foreground/50">
                          {formatRecordingTime(Math.floor(totalSeconds / 60))}:
                          {formatRecordingTime(totalSeconds % 60)}
                        </h2>
                      </div>
                    </div>
                    <div className="mt-2 flex w-fit items-center justify-center gap-[33px] pb-2 md:gap-[77px] ">
                      <button
                        onClick={handleRecordClick}
                        className={`relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-radial from-white to-secondary shadow-xl transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
                        disabled={isLoading}
                      >
                        <div className="absolute h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
                          {!isRunning ? (
                            !isLoading ? (
                              <Mic className="h-12 w-12 text-white" />
                            ) : (
                              <LoadingSpinner className="h-12 w-12 text-white" />
                            )
                          ) : (
                            <Mic className="h-12 w-12 text-white animate-pulse transition" />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="my-4 text-foreground/50">
                    {transcript && (
                      <div className="max-w-[300px]">
                        <h2>Transcript:</h2>
                        <p>{transcript}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!isMobile && (
                <div className="bg-card/50 rounded-md mx-4 md:mx-0 md:px-6 p-6 mt-4">
                  <div className="flex items-center justify-center space-x-4">
                    <a
                      href={`https://calendar.google.com/calendar/u/0/r`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <Calendar className="h-8 w-8 text-foreground/50" />
                    </a>

                    <div className="flex flex-col items-start justify-between">
                      <div className="text-2xl text-foreground/50">
                        {dayOfWeek},
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="text-2xl font-semibold text-foreground/80">
                          {month} {day}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* <div className="m-4 max-w-[350px] md:w-[450px]"> */}
            <div className="m-4 min-w-[350px] md:min-w-[650px] md:max-w-[650px] lg:max-w-[800px]">
              {upcomingEvents && <h2 className="pb-4">Upcoming Events</h2>}
              <div className="relative mb-4 ">
                <input
                  type="text"
                  placeholder="Search events by title, date ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <Search className="text-gray-300 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>

              <ul className="flex-col space-y-5">
                {upcomingEvents.map((event) => {
                  // console.log(event);
                  if (!event.summary) {
                    return null; // Skip rendering this event
                  }

                  const time = event.start?.dateTime
                    ? formatTime(event.start.dateTime)
                    : "All Day Event";

                  const eventLink = event.htmlLink;
                  const eventLocation = event?.location
                    ?.split(",")
                    .slice(0, 2)
                    .join(",");

                  return (
                    <li key={event.id}>
                      <CalendarCard
                        title={event.summary}
                        link={eventLink}
                        date={
                          parseDate(event.start?.date) ||
                          formatDate(event.start?.dateTime) ||
                          "No date available"
                        }
                        time={time}
                        location={eventLocation}
                        description={event.description}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

