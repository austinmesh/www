// Upcoming Discord events (written by scripts/update-discord-event.sh, soonest first) plus
// the calendar helpers shared by EventDialog.astro and the .ics endpoints in src/pages/.
import data from '../data/events.json';

export interface DiscordEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  startsAtIso: string;
  // Discord always sets an end time for in-person events, but it's optional for voice/stage
  // events. Missing → eventEnd() falls back to DEFAULT_DURATION_MS.
  endsAtIso?: string | null;
  startsAtDisplay: string;
  startsAtShort: string;
  link: string;
}

export const events: DiscordEvent[] = data.events;

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;

export function eventEnd(event: DiscordEvent): Date {
  if (event.endsAtIso) return new Date(event.endsAtIso);
  return new Date(new Date(event.startsAtIso).getTime() + DEFAULT_DURATION_MS);
}

// Body text for calendar entries: the Discord description plus the RSVP link.
function calendarDetails(event: DiscordEvent): string {
  return [event.description, `RSVP on Discord: ${event.link}`].filter(Boolean).join('\n\n');
}

// 2026-11-21T00:30:00.000Z → 20261121T003000Z (UTC "basic" format used by iCalendar and Google).
function toCalendarDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}/, '').replace(/[-:]/g, '');
}

export function eventIcsPath(event: DiscordEvent): string {
  return `/events/${event.id}.ics`;
}

export function googleCalendarUrl(event: DiscordEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${toCalendarDate(new Date(event.startsAtIso))}/${toCalendarDate(eventEnd(event))}`,
    details: calendarDetails(event),
  });
  if (event.location) params.set('location', event.location);
  return `https://calendar.google.com/calendar/render?${params}`;
}

// Subscribable feed of every upcoming event (src/pages/events.ics.ts).
export const feedUrl = new URL('/events.ics', import.meta.env.SITE).href;
export const webcalFeedUrl = feedUrl.replace(/^https?:/, 'webcal:');
export const googleSubscribeUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalFeedUrl)}`;

// --- iCalendar (RFC 5545) ---------------------------------------------------------------

// TEXT values escape backslash, semicolon, comma, and newlines.
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

// Content lines max out at 75 octets; longer ones continue on the next line after a single
// space. Count UTF-8 bytes and never split inside a multi-byte character.
const encoder = new TextEncoder();
function fold(line: string): string {
  const out: string[] = [];
  let current = '';
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) {
      out.push(current);
      current = ' ';
      bytes = 1;
    }
    current += char;
    bytes += size;
  }
  out.push(current);
  return out.join('\r\n');
}

function buildIcs(list: DiscordEvent[], { feed = false } = {}): string {
  const stamp = toCalendarDate(new Date());
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Austin Mesh//austinmesh.org//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  if (feed) {
    lines.push(
      'X-WR-CALNAME:Austin Mesh Events',
      'X-WR-CALDESC:Upcoming Austin Mesh meetups and events',
      // Hints for subscribed clients; most poll on their own schedule regardless.
      'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
      'X-PUBLISHED-TTL:PT12H',
    );
  }
  for (const event of list) {
    lines.push(
      'BEGIN:VEVENT',
      // Start time is part of the UID because a recurring Discord event keeps one id and
      // moves its start forward; without it, importing next month's .ics would overwrite
      // this month's entry instead of adding a new one.
      `UID:${event.id}-${toCalendarDate(new Date(event.startsAtIso))}@austinmesh.org`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toCalendarDate(new Date(event.startsAtIso))}`,
      `DTEND:${toCalendarDate(eventEnd(event))}`,
      `SUMMARY:${escapeText(event.name)}`,
      `DESCRIPTION:${escapeText(calendarDetails(event))}`,
    );
    if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
    lines.push(`URL:${event.link}`, 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return `${lines.map(fold).join('\r\n')}\r\n`;
}

// Response for the .ics endpoints. The Content-Type only matters for `astro dev`; in the
// static build Cloudflare derives it from the .ics extension.
export function icsResponse(list: DiscordEvent[], options?: { feed?: boolean }): Response {
  return new Response(buildIcs(list, options), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
}
