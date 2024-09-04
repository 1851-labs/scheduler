"use client";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { useState } from "react";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { Dashboard } from "@/components/ui/Dashboard";
import Header from "@/components/ui/Header";
import ReactPixel from "react-facebook-pixel";
import { GoogleLogin } from "@react-oauth/google";

const Banner = () => {
  const numIdeas = useQuery(api.ideas.getAppIdeas);
  const makeIdea = useAction(api.ideas.makeAppIdea);
  const [isLoading, setIsLoading] = useState(false);
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [results, setResults]: any[] = useState([]);
  const [promptCount, setPromptCount] = useState(0);

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

  const responseMessage = (response: any) => {
    console.log(response);
  };
  const errorMessage = () => {
    console.log("error");
  };

  return (
    <Dashboard>
      <Header />

      <div className="relative h-[350px] w-full  px-4 md:h-[605px] md:px-6 lg:px-8 xl:px-10 2xl:px-0">
        <div className="relative w-full px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-0 bg-red-200"></div>
        <div className="flex w-full flex-col items-center justify-center mt-20">
          <button>sign in</button>
          {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
          <h1 className=" text-center text-4xl font-medium tracking-tighter text-dark lg:text-6xl">
            At 1851 Labs, we've come up with {numIdeas} app ideas... Hooray!
          </h1>
          <button
            onClick={() => handleMakeIdea()}
            className="mt-8 primary-gradient primary-shadow mx-auto flex max-w-xl items-center justify-center gap-3 rounded-full px-4 py-2 text-center text-sm md:px-12 md:py-4 md:text-2xl"
          >
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <>
                <img
                  src="/logo.svg"
                  width="50"
                  height="50"
                  alt="logo"
                  className="h-5 w-5 md:h-8 md:w-8"
                />
                <span>Generate app idea</span>
              </>
            )}
          </button>
          {appName !== "" ? (
            <div className="m-8 p-8 primary-gradient primary-shadow">
              <p className="text-xl font-bold">{appName}</p>
              <p>{appDescription}</p>
            </div>
          ) : (
            <></>
          )}
          <label style={{ display: "flex", alignItems: "center" }}>
            Pick your favourite idea:
            <select style={{ marginLeft: "10px", background: "transparent" }}>
              {[...Array(promptCount)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
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

