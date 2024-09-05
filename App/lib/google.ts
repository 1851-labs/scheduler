// lib/google.ts
import { google } from "googleapis";

export const getGoogleCalendarClient = (accessToken: string) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  return google.calendar({ version: "v3", auth: oauth2Client });
};

export const listEvents = async (accessToken: string) => {
  const calendar = getGoogleCalendarClient(accessToken);
  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 5,
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.data.items || [];
};

