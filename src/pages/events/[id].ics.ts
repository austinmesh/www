// One-off "add to calendar" file per event: /events/<discord-event-id>.ics.
import type { APIRoute } from 'astro';
import { type DiscordEvent, events, icsResponse } from '../../lib/events';

export function getStaticPaths() {
  return events.map((event) => ({ params: { id: event.id }, props: { event } }));
}

export const GET: APIRoute<{ event: DiscordEvent }> = ({ props }) => icsResponse([props.event]);
