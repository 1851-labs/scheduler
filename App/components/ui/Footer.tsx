"use client";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import posthog from "posthog-js";

export default function Footer() {
  return (
    <footer className="z-50 container mx-auto my-5 flex h-16 flex-col items-center justify-end space-y-3 border-t px-24 pt-4 text-center sm:h-20 sm:flex-row sm:pt-2 md:text-lg">
      {/* <div className="flex items-center space-x-6">
        <div className="flex flex-row space-x-3 pt-2 pb-8 sm:pb-4 md:pt-0 md:pb-0">
          <SocialIcon
            onClick={() => {
              posthog.capture("clicked-social", { platform: "facebook" });
            }}
            style={{ height: 30, width: 30 }}
            url="https://www.facebook.com/profile.php?id=61562199479506"
            target="_blank"
          />
          <SocialIcon
            onClick={() => {
              posthog.capture("clicked-social", { platform: "twitter" });
            }}
            style={{ height: 30, width: 30 }}
            url="https://x.com/ComicSpinApp"
            target="_blank"
          />
          <SocialIcon
            onClick={() => {
              posthog.capture("clicked-social", { platform: "reddit" });
            }}
            style={{ height: 30, width: 30 }}
            url="https://www.reddit.com/r/ComicSpin/"
            target="_blank"
          />
          <SocialIcon
            onClick={() => {
              posthog.capture("clicked-social", { platform: "discord" });
            }}
            style={{ height: 30, width: 30 }}
            url="https://discord.com/invite/CkT3R7d8G7"
            target="_blank"
          />
        </div>
      </div> */}
      <div className="z-50">
        <Link
          className="text-sm text-foreground/50 hover:text-foreground/80 z-50"
          href="/privacy-policy"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}

