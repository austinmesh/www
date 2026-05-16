#!/usr/bin/env bash
# Fetch the next upcoming Discord guild event and write it to src/data/event.json.
# The EventDialog component in src/components/EventDialog.astro reads that JSON at build time.
set -euo pipefail

GUILD_ID="${DISCORD_GUILD_ID:?}"
TOKEN="${DISCORD_BOT_TOKEN:?}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$REPO_ROOT/src/data/event.json"

EVENTS_JSON=$(curl -sS -H "Authorization: Bot $TOKEN" \
    "https://discord.com/api/guilds/$GUILD_ID/scheduled-events")
NEXT_EVENT=$(echo "$EVENTS_JSON" | jq '[.[] | select(.status==1)] | sort_by(.scheduled_start_time) | .[0]')

if [ "$NEXT_EVENT" = "null" ] || [ -z "$NEXT_EVENT" ]; then
    echo "No upcoming event found."
    printf '{\n  "hasEvent": false\n}\n' > "$OUT"
    exit 0
fi

node - "$NEXT_EVENT" "$GUILD_ID" <<'NODE' > "$OUT"
const event = JSON.parse(process.argv[2]);
const guildId = process.argv[3];
const date = new Date(event.scheduled_start_time);
const tz = 'America/Chicago';
const display = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short', timeZone: tz,
}).format(date);
const short = new Intl.DateTimeFormat('en-US', {
    month: 'numeric', day: 'numeric', timeZone: tz,
}).format(date);
const output = {
    hasEvent: true,
    id: event.id,
    guildId,
    name: event.name,
    description: event.description || '',
    location: event.entity_metadata?.location || '',
    startsAtIso: event.scheduled_start_time,
    startsAtDisplay: display,
    startsAtShort: short,
    link: `https://discord.com/events/${guildId}/${event.id}`,
};
process.stdout.write(JSON.stringify(output, null, 2) + '\n');
NODE

echo "Updated event JSON: $OUT"
