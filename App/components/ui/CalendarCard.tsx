import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shadcn/Card";
import { Calendar, Clock, MapPin } from "react-feather";

interface CalendarCardProps {
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
}

export default function CalendarCard({
  title,
  date,
  time,
  location,
  description,
}: CalendarCardProps) {
  return (
    <Card className="w-full max-w-md border-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{time}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{location}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      {description && (
        <CardContent>
          <div>{description}</div>
        </CardContent>
      )}
    </Card>
  );
}

