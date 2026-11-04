#!/usr/bin/env bash
# Fetch all upcoming Discord guild events and write them to src/data/events.json.
# The EventDialog component in src/components/EventDialog.astro reads that JSON at build time.
set -euo pipefail

GUILD_ID="${DISCORD_GUILD_ID:?}"
TOKEN="${DISCORD_BOT_TOKEN:?}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$REPO_ROOT/src/data/events.json"

EVENTS_JSON=$(curl -sS -H "Authorization: Bot $TOKEN" \
    "https://discord.com/api/guilds/$GUILD_ID/scheduled-events")

# Discord returns an object (e.g. {"message": "401: Unauthorized", "code": 0}) on errors.
# Bail out instead of overwriting events.json with an empty list.
if ! echo "$EVENTS_JSON" | jq -e 'type == "array"' > /dev/null; then
    echo "Unexpected response from Discord: $EVENTS_JSON" >&2
    exit 1
fi

# Status 1 = SCHEDULED (not yet started). Soonest first.
UPCOMING=$(mktemp)
NEW_OUT=$(mktemp)
trap 'rm -f "$UPCOMING" "$NEW_OUT"' EXIT
echo "$EVENTS_JSON" | jq '[.[] | select(.status==1)] | sort_by(.scheduled_start_time)' > "$UPCOMING"

# Render into a temp file so a Node failure (e.g. an unparseable date) leaves events.json as-is
# instead of truncated.
node - "$UPCOMING" "$GUILD_ID" <<'NODE' > "$NEW_OUT"
const fs = require('fs');
const events = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const guildId = process.argv[3];
const tz = 'America/Chicago';
const displayFmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short', timeZone: tz,
});
const shortFmt = new Intl.DateTimeFormat('en-US', {
    month: 'numeric', day: 'numeric', timeZone: tz,
});
// Drop events that have already ended even if Discord still reports them as SCHEDULED
// (e.g. nobody clicked Start). Same 2-hour fallback as eventEnd() in src/lib/events.ts.
const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000;
const now = Date.now();
const notEnded = events.filter((event) => {
    const end = event.scheduled_end_time
        ? Date.parse(event.scheduled_end_time)
        : Date.parse(event.scheduled_start_time) + DEFAULT_DURATION_MS;
    return end > now;
});
const output = {
    events: notEnded.map((event) => {
        const date = new Date(event.scheduled_start_time);
        return {
            id: event.id,
            name: event.name,
            description: event.description || '',
            location: event.entity_metadata?.location || '',
            startsAtIso: event.scheduled_start_time,
            // Required by Discord for in-person events, optional for voice/stage. The site
            // falls back to a 2-hour duration when it's null (see src/lib/events.ts).
            endsAtIso: event.scheduled_end_time || null,
            startsAtDisplay: displayFmt.format(date),
            startsAtShort: shortFmt.format(date),
            link: `https://discord.com/events/${guildId}/${event.id}`,
        };
    }),
};
process.stdout.write(JSON.stringify(output, null, 2) + '\n');
NODE
# cat, not mv: keeps events.json's existing permissions (mktemp files are 0600).
cat "$NEW_OUT" > "$OUT"

COUNT=$(jq '.events | length' "$OUT")
echo "Wrote $COUNT upcoming event(s) to $OUT"
