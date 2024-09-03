'use client';
import { SignUp } from "@clerk/clerk-react";
import Header from "@/components/ui/Header";

export default function TodayClient() {
    return (
        <div className="flex flex-col items-center">
            <Header />
            <SignUp />
        </div>
    );
};

