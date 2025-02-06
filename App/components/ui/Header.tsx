"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { googleLogout } from "@react-oauth/google";
import { usePostHog } from "posthog-js/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "date-fns";

interface User {
  name: string;
  email: string;
  picture: string;
  given_name: string;
}

const Header = () => {
  const { accessToken } = useAuth();
  const { logout } = useAuth();
  const posthog = usePostHog();
  const router = useRouter();

  const handleRefresh = (e: any) => {
    e.preventDefault();
    window.location.href = "/";
  };

  const handleLogout = (e: any) => {
    googleLogout();
    logout();
    router.push("/");
    posthog.capture("user-clicked-logout");
  };

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
    }
  }, []);

  return (
    <header className="flex justify-between items-center bg-background p-6 md:px-10">
      <h1 className="text-2xl font-bold">VoCal</h1>
      {accessToken && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user?.picture} alt={user?.name} />
                {/* <AvatarFallback>{user?.name}</AvatarFallback> */}
              </Avatar>
              <span>{user?.name}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
    // <div className="z-10 container relative m-0 mx-auto py-10 md:px-10">
    //   <div className="flex items-left ml-2 justify-between">
    //     <Link className="flex w-fit items-center gap-[2px]" href="/">
    //       <h1 className="text-xl font-medium text-[#25292F] md:text-3xl  text-foreground/90 hover:text-foreground">
    //         VoCal
    //       </h1>
    //     </Link>

    //   </div>
    // </div>
  );
};

export default Header;

