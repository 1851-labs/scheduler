import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shadcn/Card";
import { Calendar, Clock, MapPin, ExternalLink } from "react-feather";
import Link from "next/link";
import posthog from "posthog-js";
interface CalendarCardProps {
  title: string;
  link: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
}

export default function CalendarCard({
  title,
  link,
  date,
  time,
  location,
  description,
}: CalendarCardProps) {
  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };
  const truncatedDescription = truncateDescription(description ?? "", 200);

  return (
    <Link
      href={link ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        posthog.capture("user-clicked-eventcard");
      }}
    >
      <Card className="w-full border-card transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-md hover:shadow-foreground/20">
        <CardHeader>
          <CardTitle className="mr-2">{title}</CardTitle>
          <CardDescription>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{date}</span>
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{time}</span>
            </span>
            {location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{location}</span>
              </span>
            )}
          </CardDescription>
          <div className="absolute top-4 right-4">
            <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </div>
        </CardHeader>
        {description && (
          <CardContent>
            <div className="flex break-words whitespace-normal overflow-hidden md:max-w-[600px]">
              {truncatedDescription}
            </div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}

