"use client";

import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { UserNav } from "./UserNav";
import { useConvexAuth } from "convex/react";

const Header = () => {
  const { isLoading } = useConvexAuth();
  const { user } = useUser();

  const handleRefresh = (e: any) => {
    e.preventDefault();
    window.location.href = "/";
  };
  return (
    <div className="z-10 container relative m-0 mx-auto py-10 md:px-10">
      <div className="flex items-left ml-2 justify-between">
        <Link className="flex w-fit items-center gap-[2px]" href="/">
          <h1 className="text-xl font-medium text-[#25292F] md:text-3xl  text-foreground/90 hover:text-foreground">
            VoCal
          </h1>
        </Link>
        {/* <Link
          href="/"
          onClick={handleRefresh}
          className="hover:text-foreground/60"
        >
          Home
        </Link> */}
        <Link
          href="/sign-in"
          className=" text-foreground/50 hover:text-foreground/80"
        >
          Sign up
        </Link>
        {/* <Link href="/component-library">View UI Examples</Link> */}
        {/* buttons */}
        {/* login / user menu */}
        {/*
        <div className="flex w-fit items-center gap-[22px]">
          {isLoading ? (
            <></>
          ) : user ? (
            <>
              <Link
                href={'/dashboard'}
                className="hidden cursor-pointer text-lg text-dark md:inline-block lg:text-xl"
              >
                Your Stories
              </Link>
              <UserNav
                image={user?.imageUrl}
                name={user?.fullName!}
                email={user?.primaryEmailAddress?.emailAddress!}
              />
            </>
          ) : (
            <Link href="/dashboard">
              <button className="text-md primary-gradient primary-shadow rounded-lg px-5 py-1 text-center text-light md:px-10 md:py-2 md:text-xl">
                Sign in
              </button>
            </Link>
          )}
        </div>
        */}
      </div>
    </div>
  );
};

export default Header;

