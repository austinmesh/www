// Subscribable calendar feed of every upcoming event: /events.ics (webcal://…/events.ics).
// Only as fresh as the last deploy after the Discord workflow updates src/data/events.json.
import type { APIRoute } from 'astro';
import { events, icsResponse } from '../lib/events';

export const GET: APIRoute = () => icsResponse(events, { feed: true });
