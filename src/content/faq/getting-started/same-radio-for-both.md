---
question: Can I use the same radio for MeshCore and Meshtastic? Can they talk to each other?
order: 70
---
Most radio hardware is supported by both. You can flash back and forth, but do a full erase each time you switch, and back up your keys first.

The two networks can't message each other, and one radio can only run one of them at a time (some custom firmwares for specific devices allow you to switch back and forth). If you want both, use two separate radios, with spacing between antennas.
