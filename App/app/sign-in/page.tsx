'use client';
import { SignIn } from "@clerk/clerk-react";
import Header from "@/components/ui/Header";
export default function TodayClient() {
    return (
        <div className="flex flex-col items-center">
            <Header />
            <SignIn />
        </div>
    );
};

