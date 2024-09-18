"use client";
import Header from "@/components/ui/Header";
import { useUser } from "@clerk/clerk-react";
import { SignUpButton } from "@clerk/clerk-react";
import { Calendar, Mic, ArrowRight } from "react-feather";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import posthog from "posthog-js";
import { BsGoogle, BsCalendar2Date, BsCloud, BsRobot } from "react-icons/bs";
const features = [
  {
    name: "Integrate with Google.",
    description:
      "Easily sync with your Google Calendar to stay on top of your schedule.",
    icon: BsGoogle,
  },
  {
    name: "Smart schedule with AI.",
    description:
      "Use AI to automatically fill in information and provide suggestions.",
    icon: BsRobot,
  },
  {
    name: "Always be in the know.",
    description: "Keep track of all your upcoming events in one simple view.",
    icon: BsCalendar2Date,
  },
];

const Waitlist = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) {
    return null;
  }
  return (
    <div className="bg-white">
      <Header />
      {isSignedIn ? (
        <div className="relative isolate px-6 py-24 md:py-56 lg:px-8">
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
                Thank you for signing up! We'll keep you updated with insider
                previews, progress updates, and an invitation to try out VoCal
                as soon as it's ready for you. Keep an eye on your inbox — you
                won’t want to miss it!
              </p>
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
          <div className="mx-auto max-w-2xl py-28 sm:py-36 lg:py-48">
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
                <SignUpButton mode="modal">
                  <button
                    className="rounded-md bg-indigo-600 px-5 py-2.5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {
                      posthog.capture("sign_up_click", {
                        button_text: "Sign up",
                      });
                    }}
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-50 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="-z-50 relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#63b3ed] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>

          <div className="overflow-hidden py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                <div className="lg:pr-8 lg:pt-4">
                  <div className="lg:max-w-lg">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">
                      Never miss a moment
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      Stay effortlessly organized
                    </p>
                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                      {features.map((feature) => (
                        <div key={feature.name} className="relative pl-9">
                          <dt className="inline font-semibold text-gray-900">
                            <feature.icon
                              aria-hidden="true"
                              className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                            />
                            {feature.name}
                          </dt>{" "}
                          <dd className="inline">{feature.description}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
                <img
                  alt="Product screenshot"
                  src="/images/vocaldash.jpg"
                  width={2032}
                  height={1042}
                  className="hidden md:block w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[40rem] md:-ml-4 lg:-ml-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Waitlist;

