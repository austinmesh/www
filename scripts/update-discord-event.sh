#!/usr/bin/env bash
set -euo pipefail

GUILD_ID="${DISCORD_GUILD_ID:?}"
TOKEN="${DISCORD_BOT_TOKEN:?}"

# List of HTML files that contain the event dialog
HTML_FILES=(
    "index.html"
    "join/index.html"
    "join/property-owner-faq-hosting-a-node/index.html"
    "learn/index.html"
    "devices/index.html"
    "partners/index.html"
    "similar-networks/index.html"
)

# Detect OS for sed compatibility
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS - use function to avoid backup file creation
  sed_inplace() {
    sed -i '' "$@"
  }
else
  # Linux/Ubuntu
  sed_inplace() {
    sed -i "$@"
  }
fi

# Fetch events from Discord
EVENTS_JSON=$(curl -s -H "Authorization: Bot $TOKEN" "https://discord.com/api/guilds/$GUILD_ID/scheduled-events")

# Find the next upcoming event (status == 1, soonest start time)
NEXT_EVENT=$(echo "$EVENTS_JSON" | jq '[.[] | select(.status==1)] | sort_by(.scheduled_start_time) | .[0]')

if [ "$NEXT_EVENT" = "null" ] || [ -z "$NEXT_EVENT" ]; then
  echo "No upcoming event found."

  # Update header button and dialog for all HTML files
  for HTML_FILE in "${HTML_FILES[@]}"; do
    if [ -f "$HTML_FILE" ]; then
      echo "Updating $HTML_FILE - No events"
      
      # Update header button
      sed_inplace "s|<button.*class=\"default meet-button\".*>.*</button>|<button onclick=\"document.getElementById('event').showModal()\" class=\"default meet-button\">📅 No upcoming events</button>|" "$HTML_FILE"

      # Update dialog
      DIALOG_CONTENT=$(cat <<EOF
<dialog id="event">
    <header>
        <h1>No Upcoming Events</h1>
    </header>
    <p>There are currently no scheduled events. Please check back later or join our <a href=\"https://discord.gg/6a5Sv2s9bG\" target="_blank">Discord</a> for updates.</p>
    <footer>
        <form method="dialog">
            <button type="submit">Close</button>
        </form>
    </footer>
</dialog>
EOF
)
      perl -0777 -i -pe "s|<dialog id=\"event\">.*?</dialog>|$DIALOG_CONTENT|s" "$HTML_FILE"
    fi
  done

  exit 0
fi

EVENT_ID=$(echo "$NEXT_EVENT" | jq -r '.id')
EVENT_NAME=$(echo "$NEXT_EVENT" | jq -r '.name')
EVENT_DESC=$(echo "$NEXT_EVENT" | jq -r '.description // ""')
EVENT_START=$(echo "$NEXT_EVENT" | jq -r '.scheduled_start_time')
EVENT_LOC=$(echo "$NEXT_EVENT" | jq -r '.entity_metadata.location // ""')

# Format date for display (Central Time) - compatible with both GNU and BSD date
if date --version >/dev/null 2>&1; then
  # GNU date (Linux/Ubuntu)
  EVENT_DATE=$(TZ="America/Chicago" date -d "$EVENT_START" +"%A, %B %-d, %Y, %-I:%M %p %Z")
  EVENT_DATE_SHORT=$(TZ="America/Chicago" date -d "$EVENT_START" +"%-m/%-d")
else
  # BSD date (macOS)
  EVENT_DATE=$(TZ="America/Chicago" date -jf "%Y-%m-%dT%H:%M:%S+00:00" "$EVENT_START" +"%A, %B %-d, %Y, %-I:%M %p %Z")
  EVENT_DATE_SHORT=$(TZ="America/Chicago" date -jf "%Y-%m-%dT%H:%M:%S+00:00" "$EVENT_START" +"%-m/%-d")
fi

EVENT_LINK="https://discord.com/events/$GUILD_ID/$EVENT_ID"

# Update header button and dialog for all HTML files
for HTML_FILE in "${HTML_FILES[@]}"; do
  if [ -f "$HTML_FILE" ]; then
    echo "Updating $HTML_FILE - Event: $EVENT_NAME"
    
    # Update header button
    sed_inplace "s|<button.*class=\"default meet-button\".*>.*</button>|<button onclick=\"document.getElementById('event').showModal()\" class=\"default meet-button\">📅 Upcoming Meeting $EVENT_DATE_SHORT</button>|" "$HTML_FILE"

    # Update dialog (replace everything between <dialog id="event"> and </dialog>)
    DIALOG_CONTENT=$(cat <<EOF
<dialog id="event">
    <header>
        <h1>$EVENT_NAME</h1>
    </header>
    <p>$EVENT_DESC</p>
    <p><b>$EVENT_DATE</b> (<a href="$EVENT_LINK" target="_blank">Save the date</a>)</p>
    <p>$EVENT_LOC</p>
    <footer>
        <form method="dialog">
            <a class="default" href="$EVENT_LINK" type="button">Save the date</a>
            <button type="submit">Close</button>
        </form>
    </footer>
</dialog>
EOF
)

    # Use perl for multi-line replacement
    perl -0777 -i -pe "s|<dialog id=\"event\">.*?</dialog>|$DIALOG_CONTENT|s" "$HTML_FILE"
  fi
done

echo "Updated event: $EVENT_NAME"
