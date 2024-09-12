"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useAction } from "convex/react";
import { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import { parseISO, parse, format } from "date-fns";

import { useGoogleLogin, googleLogout } from "@react-oauth/google";

import posthog from "posthog-js";

import { ExternalLink, Mic, ArrowRight, Calendar } from "react-feather";

import CalendarCard from "@/components/ui/CalendarCard";
import ErrorModal from "@/components/ui/ErrorModal";
import { Toaster } from "@/components/shadcn/toaster";
import { useToast } from "@/components/shadcn/use-toast";

import { LoadingSpinner } from "@/components/ui/loadingSpinner";

const Banner = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  const [title, setTitle] = useState("Press to Record");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const [transcript, setTranscript] = useState<string | null>(null);

  const [viewModal, setViewModal] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  const { toast } = useToast();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // console.log(tokenResponse);

      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const userInfo = await response.json();
        // console.log(userInfo);

        setUserProfile(userInfo);
        setAccessToken(tokenResponse.access_token);
        posthog.capture("user-clicked-signin");
      } catch (error) {
        console.error("Error fetching user info (googleLogin):", error);
      }
    },
    onError: (errorResponse) =>
      console.log("googlelogin onerror", errorResponse),
    scope: "https://www.googleapis.com/auth/calendar", // Scope for Calendar API
  });

  const logOut = () => {
    googleLogout();
    window.location.reload();
    setUserProfile(null);
    posthog.capture("user-clicked-logout");
  };

  useEffect(() => {
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

  const upcomingEvents = events.slice(0, 4);

  const getUserTimezone = async (accessToken: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/settings/timezone",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch timezone: ${response.statusText}`);
      }

      const data = await response.json();
      return data.value; // This is the user's timezone, e.g., 'America/Los_Angeles'
    } catch (error) {
      console.error("Error fetching user timezone:", error);
      throw error;
    }
  };

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

  const createEvent = async () => {
    if (!accessToken) {
      console.error("Access token is missing. Please log in first.");
      return;
    }

    try {
      const result = await handleExtractTranscript();
      const userTimezone = await getUserTimezone(accessToken);

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

        if (!response.ok) {
          setViewModal(true);
          // const errorText = await response.text();
          // console.error(
          //   `Error creating event: ${response.status} ${response.statusText}`,
          //   errorText
          // );
          throw new Error(`Error creating event: ${response.statusText}`);
        }

        const data = await response.json();
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

  return (
    <>
      {viewModal && (
        <ErrorModal isOpen={viewModal} setViewModal={setViewModal} />
      )}
      <Header />
      <Toaster />
      <div className="relative min-h-[350px] md:min-h-[605px] w-full px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-0">
        <div className="md:w-full flex-col md:flex items-center justify-center">
          <div className="md:flex items-center md:items-start gap-4">
            <div className="flex w-full flex-col items-center justify-center mt-4">
              {userProfile ? (
                <></>
              ) : (
                // <div className="mt-4 p-4 border border-card rounded shadow">
                //   <div className="flex gap-3">
                //     <div className="flex items-center justify-center">
                //       <img
                //         src={userProfile.picture}
                //         alt="Profile Image"
                //         className="rounded-full h-8 w-8"
                //       />
                //     </div>
                //     <h2 className="inline-block text-2xl font-bold max-w-[200px] break-words whitespace-normal">
                //       {userProfile.name}
                //     </h2>
                //   </div>
                // </div>
                <div className="relative isolate px-6 pt-8 lg:px-8">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                  >
                    <div
                      style={{
                        clipPath:
                          "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                      }}
                      className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#63b3ed] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                  </div>
                  <div className="mx-auto max-w-2xl py-32 sm:py-36 lg:py-48">
                    <div className="flex items-center justify-center mb-8">
                      <Mic className="text-foreground/50" />
                      <ArrowRight className="text-foreground/50" />
                      <Calendar className="text-foreground/50" />
                    </div>
                    <div className="text-center">
                      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Speak. Schedule. Simplify.
                      </h1>
                      <p className="mt-6 text-lg leading-8 text-foreground/70">
                        Create Google Calendar events with your voice. Schedule
                        meetings, set reminders, and stay updated effortlessly.
                      </p>
                      <p className="mt-1 text-xs text-foreground/30">
                        *only supporting Google Calendar right now
                      </p>
                      <div className="mt-8 flex items-center justify-center ">
                        <button
                          className="bg-secondary text-white rounded-lg px-4 py-2 shadow-md hover:bg-secondary/70 transition duration-300"
                          onClick={() => googleLogin()}
                        >
                          Connect your Calendar 🚀{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                  >
                    <div
                      style={{
                        clipPath:
                          "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                      }}
                      className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#63b3ed] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    />
                  </div>
                </div>
              )}
              {userProfile && (
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
                              {formatRecordingTime(
                                Math.floor(totalSeconds / 60)
                              )}
                              :{formatRecordingTime(totalSeconds % 60)}
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
                </div>
              )}
            </div>

            {accessToken && (
              <div
                className={`flex w-full justify-center transform transition-transform duration-1000 ${
                  slideIn ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="m-4 w-[450px]">
                  {upcomingEvents && <h2 className="pb-4">Upcoming Events</h2>}

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
                        //TODO: link each card to its calendar event
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
            )}
          </div>
        </div>
        <div className="flex justify-center mt-4 md:mb-8">
          {userProfile && (
            <button
              className="bg-white text-black rounded-lg px-4 py-2 shadow-md hover:bg-gray-100 transition duration-300"
              onClick={() => logOut()}
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Banner;

