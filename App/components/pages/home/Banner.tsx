"use client";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { useState, useEffect } from "react";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { Dashboard } from "@/components/ui/Dashboard";
import Header from "@/components/ui/Header";
import ReactPixel from "react-facebook-pixel";

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

import { listEvents } from "@/lib/google";
import { google } from "googleapis";

import { jwtDecode } from "jwt-decode";
import posthog from "posthog-js";

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

  // const LoginButton = ({ onSuccess }: { onSuccess: (token: string) => void }) => {
  //   const login = useGoogleLogin({
  //     onSuccess: (tokenResponse) => {
  //       console.log(tokenResponse.access_token);
  //       onSuccess(tokenResponse.access_token);
  //     },
  //     onError: (error) => console.log(error),
  //     scope: "https://www.googleapis.com/auth/calendar", // Scope for Calendar API
  //   });

  //   return <button onClick={() => login()}>Login with Google</button>;
  // };

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
        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
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

  // interface GoogleUser {
  //   sub: string;
  //   name: string;
  //   given_name: string;
  //   family_name: string;
  //   picture: string;
  //   email: string;
  // }

  // // const fetchEvents = async (token: string) => {
  // //   try {
  // //     const fetchedEvents = await listEvents(token);
  // //     setEvents(fetchedEvents);
  // //   } catch (error) {
  // //     console.error("Error fetching events:", error);
  // //   }
  // // };

  // const testAccessToken = async (accessToken: string) => {
  //   try {
  //     const auth = new google.auth.OAuth2();
  //     auth.setCredentials({ access_token: accessToken });

  //     const calendar = google.calendar({ version: "v3", auth });
  //     const res = await calendar.events.list({
  //       calendarId: "primary",
  //       timeMin: new Date().toISOString(),
  //       maxResults: 1,
  //       singleEvents: true,
  //       orderBy: "startTime",
  //     });

  //     if (res.status === 200) {
  //       console.log("Access token is valid. Events:", res.data.items);
  //     } else {
  //       console.log("Failed to validate access token. Status:", res.status);
  //     }
  //   } catch (error) {
  //     console.error("Error validating access token:", error);
  //   }
  // };

  // const responseMessage = (token: string) => {
  //   // try {
  //   //   const decoded: GoogleUser = jwtDecode(token);
  //   //   console.log("User Information:", decoded);
  //   //   setUserProfile(decoded);
  //   // } catch (error) {
  //   //   console.error("Error decoding JWT:", error);
  //   // }

  //   setAccessToken(token);
  //   // fetchEvents(token);

  //   console.log("Access Token:", token);
  //   posthog.capture("user-clicked-signin");

  //   // Test the access token
  //   testAccessToken(token);
  // };

  // //used to debounce the response message so it isn't called too many times (picture wasn't displaying)
  // function debounce(func: Function, wait: number) {
  //   let timeout: NodeJS.Timeout;
  //   return function (this: any, ...args: any[]) {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => func.apply(this, args), wait);
  //   };
  // }

  // const debouncedResponseMessage = debounce(responseMessage, 300);

  // const errorMessage = () => {
  //   console.log("error!!!!!");
  // };

  return (
    <Dashboard>
      <Header />

      <div className="relative h-[350px] w-full  px-4 md:h-[605px] md:px-6 lg:px-8 xl:px-10 2xl:px-0">
        <div className="relative w-full px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-0 bg-red-200"></div>
        <div className="flex w-full flex-col items-center justify-center mt-20">
          {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}

          <button onClick={() => googleLogin()}>Sign in with Google 🚀 </button>

          {userProfile && (
            <div className="mt-4 p-4 border rounded shadow">
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
              <>
                <h2>Calendar Events</h2>
                <ul>
                  {events.map((event) => (
                    <li key={event.id}>
                      {event.summary} -{" "}
                      {event.start?.dateTime ||
                        event.start?.date ||
                        "No date available"}
                    </li>
                  ))}
                </ul>
              </>
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
    </Dashboard>
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

