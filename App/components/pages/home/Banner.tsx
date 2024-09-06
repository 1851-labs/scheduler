"use client";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { useState, useEffect } from "react";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { Dashboard } from "@/components/ui/Dashboard";
import Header from "@/components/ui/Header";
import ReactPixel from "react-facebook-pixel";

import { useGoogleLogin } from "@react-oauth/google";

import posthog from "posthog-js";
import CalendarCard from "@/components/ui/CalendarCard";
import { Button } from "@/components/shadcn/Button";

import Link from "next/link";

const Banner = () => {
  const numIdeas = useQuery(api.ideas.getAppIdeas);
  const makeIdea = useAction(api.ideas.makeAppIdea);
  const [isLoading, setIsLoading] = useState(false);
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [results, setResults]: any[] = useState([]);
  const [promptCount, setPromptCount] = useState(0);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  const handleMakeIdea = async () => {
    if (!isLoading) {
      setIsLoading(true);
      ReactPixel.trackCustom("user-generate-app-idea");
      const callBackend = async () => {
        try {
          const result: any = await makeIdea();
          setResults([...results, result]);
          setIsLoading(false);
          setAppName(result.name);
          setAppDescription(result.description);
          setPromptCount((prevCount) => prevCount + 1);
        } catch (error) {
          console.error(error);
        }
      };
      void callBackend();
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);

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
        console.log(userInfo);

        setUserProfile(userInfo);
        setAccessToken(tokenResponse.access_token);
        posthog.capture("user-clicked-signin");
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
    scope: "https://www.googleapis.com/auth/calendar", // Scope for Calendar API
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const now = new Date();
        const today = now.toISOString();
        console.log(now, "  ", today);

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
          throw new Error("Failed to fetch events");
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

  const upcomingEvents = events.slice(0, 5);

  //TODO: format to using words to represent date - can reference notesgpt and put in utils
  const formatDate = (dateTime: string) => {
    const dateObj = new Date(dateTime);
    return dateObj.toLocaleDateString(); // Format date
  };

  const formatTime = (dateTime: string) => {
    const dateObj = new Date(dateTime);
    return dateObj.toLocaleTimeString(); // Format time
  };

  const createEvent = async () => {
    if (!accessToken) {
      console.error("Access token is missing. Please log in first.");
      return;
    }

    // Define the event details
    const event = {
      summary: "Sample Event 2",
      location: "221B Baker Street, London, UK",
      description: "This is an event created via Google Calendar API.",
      start: {
        dateTime: "2024-09-08T09:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: "2024-09-08T10:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      attendees: [
        { email: "attendee1@example.com" },
        { email: "attendee2@example.com" },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    try {
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
        const errorText = await response.text();
        console.error(
          `Error creating event: ${response.status} ${response.statusText}`,
          errorText
        );
        throw new Error(`Error creating event: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Event created:", data.htmlLink);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    // <Dashboard>
    <>
      <Header />
      {/* take these out for now: h-[350px]  md:h-[605px]*/}
      <div className="relative min-h-[350px] md:min-h-[605px] w-full px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-0">
        <div className="relative w-full px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-0 bg-red-200"></div>
        <div className="flex w-full flex-col items-center justify-center mt-20">
          <button
            className="bg-white text-black rounded-lg px-4 py-2 shadow-md hover:bg-gray-100 transition duration-300"
            onClick={() => googleLogin()}
          >
            Sign in with Google 🚀{" "}
          </button>
          <div className="mt-4">
            <Button onClick={createEvent} disabled={!accessToken}>
              Create Event
            </Button>
          </div>
          <div className="mt-4">
            <Link href="/record">
              <Button size="sm" variant="secondary">
                Record
              </Button>
            </Link>
          </div>
          {userProfile && (
            <div className="mt-4 p-4 border border-card rounded shadow">
              <h2 className="text-2xl font-bold">User Profile</h2>
              <p>
                <strong>ID:</strong> {userProfile.sub}
              </p>
              <p>
                <strong>Name:</strong> {userProfile.name}
              </p>
              <p>
                <strong>Email:</strong> {userProfile.email}
              </p>
              <img
                src={userProfile.picture}
                alt="Profile Image"
                className="rounded-full h-6 w-6"
              />
            </div>
          )}
          <div>
            {accessToken && (
              <div className="m-4">
                <h2 className="pb-4">Upcoming Events</h2>
                <ul className="flex-col space-y-4">
                  {upcomingEvents.map((event) => {
                    // Log  details of each event - temporary for debugging
                    // console.log("Event Details:", {
                    //   event,
                    // });
                    if (!event.summary) {
                      return null; // Skip rendering this event
                    }

                    return (
                      <li key={event.id}>
                        <CalendarCard
                          title={event.summary}
                          date={
                            event.start?.date ||
                            formatDate(event.start?.dateTime) ||
                            "No date available"
                          }
                          time={
                            formatTime(event.start?.dateTime) ||
                            "No time available"
                          }
                          location={event.location}
                          description={event.description}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* background gradient */}
        {/* <div className="absolute bottom-0 left-0 right-0 top-0 z-[-1] hidden h-full w-full grid-cols-3 md:grid">
          <BackgroundGradient />
          <BackgroundGradient />
          <BackgroundGradient />
        </div> */}
      </div>
    </>
    // </Dashboard>
  );
};

function BackgroundGradient() {
  return (
    <div
      className="h-full w-full rounded-full"
      style={{
        opacity: "0.9",
        background:
          "radial-gradient(54.14% 54.14% at 50% 50%, #D9D7F1 35%, rgba(517, 415, 241, 0.86) 100%)",
        filter: "blur(150px)",
      }}
    />
  );
}

export default Banner;

