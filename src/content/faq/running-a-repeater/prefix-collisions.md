---
question: What's a prefix collision/conflict? Should I change my repeater's key?
order: 30
---
The word collision implies failure. That is not the case here.

The path a message takes is recorded by the first 1-3 bytes of each repeater's key in the chain. If two repeaters share a prefix, it is considered a collision. Observers reading the path can't tell them apart, making analysis more challenging. Routing still works even with conflicts as both repeaters will pass the message along.

For more reading on path length settings, see [MeshCore 2-byte vs 1-byte paths](/join/meshcore-setup/#meshcore-2-byte-vs-1-byte-paths).
