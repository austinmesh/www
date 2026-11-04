---
question: How do I update the firmware on a repeater that's hard to reach?
order: 10
---
You can't flash firmware over LoRa (okay technically you can, but come chat about it in the Discord if you think you're ready for that rabbit hole). You have to be nearby:

- **nRF52 repeaters** (RAK, T114): log in from your companion over LoRa, run `start ota` to turn on Bluetooth for a short time, then flash with the nRF DFU app.
- **ESP32 repeaters:** these can update over a temporary WiFi access point.

**IMPORTANT** Flash the [OTAFIX bootloader](https://github.com/oltaco/Adafruit_nRF52_Bootloader_OTAFIX/releases) before you mount the repeater. With it, a failed update falls back to update mode instead of needing a ladder. Updating every 3–6 months is plenty.
