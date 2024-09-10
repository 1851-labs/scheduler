"use client";
import Header from "@/components/ui/Header";
import { useUser } from "@clerk/clerk-react";
import { SignUpButton } from "@clerk/clerk-react";
import { Calendar, Mic, ArrowRight } from "react-feather";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Waitlist = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) {
    return null;
  }
  return (
    <div className="bg-white">
      <Header />
      {isSignedIn ? (
        <div className="relative isolate px-6 py-64 lg:px-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <div className="flex gap-2 items-center mb-3">
                <div className="flex">
                  <Avatar>
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>
                      {user.firstName ? user.firstName[0] : "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex">
                  <h1 className="text-3xl">{user.firstName},</h1>
                </div>
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
                We're working on onboarding you
              </h2>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                Thank you for signing up!
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-2xl lg:mx-0 lg:max-w-none">
              <a
                href="mailto:support@1851labs.com"
                className="text-lg text-indigo-600 font-semibold"
              >
                Contact Us <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
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
                Create Google Calendar events with your voice using AI.
                Schedule, set reminders, and stay updated effortlessly.
              </p>
              <p className="mt-1 text-xs text-foreground/30">
                *only supporting Google Calendar right now
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <SignUpButton mode="modal">
                  <button className="rounded-md bg-indigo-600 px-4 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Sign up
                  </button>
                </SignUpButton>
                <a
                  href="mailto:support@1851labs.com"
                  className="text-md font-semibold leading-6 text-gray-900"
                >
                  Contact Us <span aria-hidden="true">&rarr;</span>
                </a>
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
  );
};

export default Waitlist;

