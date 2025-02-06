"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useAction } from "convex/react";
import { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

import posthog from "posthog-js";

import { ExternalLink, Mic, ArrowRight, Calendar } from "react-feather";

import ErrorModal from "@/components/ui/ErrorModal";
import { Toaster } from "@/components/shadcn/toaster";
import { useToast } from "@/components/shadcn/use-toast";

import { LoadingSpinner } from "@/components/ui/loadingSpinner";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

const Banner = () => {
  const { login, logout } = useAuth();

  const [userProfile, setUserProfile] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  const [userTimezone, setUserTimezone] = useState<string | null>(null);

  const [viewModal, setViewModal] = useState(false);

  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await fetchUserInfo(tokenResponse.access_token);
        setAccessToken(tokenResponse.access_token);
        login(tokenResponse.access_token);
        // console.log(tokenResponse);
        // const timezone = await getUserTimezone(tokenResponse.access_token);
        const timezone = "America/New_York";
        setUserTimezone(timezone);
        router.push("/dashboard");
        posthog.capture("user-clicked-signin");
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    onError: (errorResponse) =>
      console.log("googlelogin onerror", errorResponse),
    scope: "https://www.googleapis.com/auth/calendar.events",
  });

  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 401) {
        console.warn("Access token expired. Redirecting to login...");
        googleLogin(); // Re-trigger login
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch user info");

      const userInfo = await response.json();
      setUserProfile(userInfo);
      console.log(userInfo);
      sessionStorage.setItem("user", JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const logOut = () => {
    googleLogout();
    logout();
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
      return data.value; // this is the user's timezone, e.g., 'America/Los_Angeles'
    } catch (error) {
      console.error("Error fetching user timezone:", error);
      throw error;
    }
  };

  // const createEvent = async () => {
  //   if (!accessToken) {
  //     console.error("Access token is missing. Please log in first.");
  //     return;
  //   }
  //   console.log(accessToken);
  //   try {
  //     const result = await handleExtractTranscript();

  //     if (result) {
  //       const { name, date, location, startTime, endTime, description } =
  //         result;

  //       const startDateTime = `${date}T${startTime}`;
  //       const endDateTime = `${date}T${endTime}`;

  //       const event = {
  //         summary: name,
  //         description: description,
  //         start: startTime
  //           ? {
  //               dateTime: startDateTime,
  //               timeZone: userTimezone,
  //             }
  //           : {
  //               date: date,
  //             },
  //         end: startTime
  //           ? {
  //               dateTime: endDateTime,
  //               timeZone: userTimezone,
  //             }
  //           : {
  //               date: date,
  //             },
  //         reminders: {
  //           useDefault: false,
  //           overrides: [
  //             { method: "email", minutes: 24 * 60 },
  //             { method: "popup", minutes: 10 },
  //           ],
  //         },
  //         ...(location && { location: location }),
  //       };

  //       // Send the request to create the event using fetch
  //       const response = await fetch(
  //         "https://www.googleapis.com/calendar/v3/calendars/primary/events",
  //         {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(event),
  //         }
  //       );

  //       if (!response.ok) {
  //         setViewModal(true);
  //         // const errorText = await response.text();
  //         // console.error(
  //         //   `Error creating event: ${response.status} ${response.statusText}`,
  //         //   errorText
  //         // );
  //         throw new Error(`Error creating event: ${response.statusText}`);
  //       }

  //       const data = await response.json();
  //       setRecentlyCreatedEvents((prevEvents) => [...prevEvents, data]);
  //       toast({
  //         title: "Event created!",
  //         description: (
  //           <span className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
  //             <a
  //               href={data.htmlLink}
  //               className="underline"
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               onClick={() => {
  //                 posthog.capture("user-clicked-viewevent", {
  //                   event_link: data.htmlLink,
  //                 });
  //               }}
  //             >
  //               Click here to view event
  //             </a>
  //             <ExternalLink className="h-3 w-3" />
  //           </span>
  //         ),
  //       });
  //     }
  //   } catch (error) {
  //     setViewModal(true);
  //     posthog.capture("user-triggered-errormodal");
  //     console.error("Error creating event(create event trycatch):", error);
  //   }
  // };

  const processedTranscript = useAction(api.events.processTranscript);

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;

  //   if (isRunning) {
  //     interval = setInterval(() => {
  //       setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
  //     }, 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [isRunning]);

  // const handleExtractTranscript = async () => {
  //   try {
  //     const result = await processedTranscript({
  //       transcript: transcript ?? "",
  //     });
  //     console.log("Processed Transcript Result:", result);
  //     return {
  //       date: result.date,
  //       location: result.location,
  //       startTime: result.startTime,
  //       endTime: result.endTime,
  //       description: result.description,
  //       name: result.name,
  //     };
  //   } catch (error) {
  //     console.error("Error processing transcript(extract transcript):", error);
  //   }
  // };

  // useEffect(() => {
  //   if (transcript) {
  //     createEvent();
  //   }
  //   if (accessToken) {
  //     setSlideIn(true);
  //   }
  // }, [transcript, accessToken]);

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
            </div>
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

