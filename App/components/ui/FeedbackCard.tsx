'use client'
import Link from "next/link"
import React from "react"
import { Button } from "@/components/shadcn/Button"
import { BsDiscord } from "react-icons/bs"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/shadcn/TextArea"
import posthog from "posthog-js"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api";

export function FeedbackCard() {
    const [feedback, setFeedback] = React.useState("");
    const [feedbackSubmitted, setFeedbackSubmitted] = React.useState(false);
    const submitFeedback = useMutation(api.feedback.submitFeedback);

    async function handleSubmitFeedback() {
        posthog.capture("submit-feedback", { message: feedback, userId: posthog.get_distinct_id() })
        if (feedback.length > 0) {
            setFeedbackSubmitted(true);
            await submitFeedback({ message: feedback, userId: posthog.get_distinct_id() })
        }
    }

    useEffect(() => {
        // Blur any focused element when the component mounts
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, []);
    return (
        <div>
            <div className="w-[300px] rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-400 shadow-lg shadow-indigo-400 p-5">
                {feedbackSubmitted ? (
                    <div>
                        <h2 className="text-white font-bold text-lg/6 leading-tight lg:text-lg/6">Thank you for your feedback!</h2>
                        <h4 className="text-indigo-100 text-sm mt-3">Feel free to share more of your thoughts in our discord.</h4>
                        <Button size="sm" className="mt-3 w-full bg-white text-indigo-700 hover:bg-indigo-100">
                            <Link href="https://discord.gg/CkT3R7d8G7" className="flex space-x-2" target="_blank" rel="noreferrer">
                                <BsDiscord className="h-5 w-5" />
                                <p>Join our Discord</p>
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <>
                            <h2 className="text-white font-bold text-lg/6 leading-tight lg:text-lg/6">We're on a mission to build the best storytelling app!</h2>
                            <h4 className="text-indigo-100 text-sm mt-3">Your feedback will help shape the future of this app.</h4>
                            <Textarea
                                className="mt-4 bg-transparent text-white placeholder:text-indigo-100"
                                placeholder="Enter any feedback here..."
                                onChange={(e: any) => {
                                    setFeedback(e.target.value);
                                }}
                            />
                            <Button size="sm" className="mt-3 w-full bg-white text-indigo-700 hover:bg-indigo-100" onClick={handleSubmitFeedback}>
                                Submit
                            </Button>
                        </>
                    </>
                )}
            </div>
        </div>
    )
}