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
  return (
    <Link href={link ?? "#"} target="_blank" rel="noopener noreferrer">
      <Card className="w-full max-w-md border-card transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-md hover:shadow-foreground/20">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
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
        </CardHeader>
        {description && (
          <CardContent>
            <div>{description}</div>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}

