---
layout: layouts/page.html
title: Join Austin Mesh
description: Learn about joining the Austin Mesh network, group, and our best practices.
eleventyNavigation:
  key: Join
  order: 3
---

<section class="social">
    <h5>Join us on</h5>
    {% include "partials/social-icons.html" %}
</section>

# How to join AustinMesh

<ul>
    <li><a href="#group">Join the group</a></li>
    <li><a href="#network">Connect to the network</a></li>
    <li><a href="#best-practices">Best practices</a></li>
</ul>

<h2 id="group">Join the group</h2>

Outside of the mesh network itself, we're most active in our public [Discord Server](https://discord.gg/6a5Sv2s9bG). You can [email us](mailto:info@austinmesh.org) to be added to our mailing list for our in-person meetings in Austin. You can also follow us on [Twitter](https://twitter.com/AustinMeshOrg),
[Instagram](https://www.instagram.com/p/Cq0jOpYLpZy/),
[TikTok](https://www.tiktok.com/@austinmesh.org),
[YouTube](https://youtube.com/channel/UCtFl5gdwv0SdrP8sHlDMKNA), or join our [Discord](https://discord.gg/6a5Sv2s9bG).

<h2 id="network">Connect to the network</h2>

<ol>
    <li>
        Get a Meshtastic Radio.
        <br> You can build one yourself for about $35. The official Meshtastic page keeps a current list of <a href="https://meshtastic.org/docs/hardware/devices/">Supported Hardware.</a> The LILYGO T-Echo is a good first meshtastic radio, as it costs around $70 and is ready to go out of the box (besides having to flash the firmware).
        <br> You can also buy a pre-built battery-powered radio for between $50-$100 on Etsy or eBay - these usually have 3D printed cases.
        <br> If you can afford it, and have a place to mount it outside, we recommend you buy a pre-built solar-powered node for between $100 and $200 on Etsy and mount it as high off the ground as you can. Alternatively you can <a href="/devices/">build your own</a>.
    </li>
    <li>Download the <a href="https://meshtastic.org/docs/software">Meshtastic App</a> on your iPhone or Android.</li>
    <li>Pair your radio to your phone with Bluetooth.</li>
    <li>Open the Meshtastic app and say hi!</li>
</ol>

<h2 id="best-practices">Best practices</h2>

### TL;DR;

<ul>
    <li><strong>Ignore MQTT</strong>: True</li>
    <li><strong>OK to MQTT</strong>: True(if you want to be on graphs.austinmesh.org)</li>
    <li><strong>Role</strong>: Client or Client Mute (<strong>NOT</strong> Router or Repeater)</li>
    <li><strong>Hop Count</strong>: 3</li>
    <li><strong>Broadcast intervals</strong>(info, position, telemetry): 6 hours</li>
</ul>

This is a community driven project, following these guidelines will ensure the best experience for everyone as we continue to grow. (credit @Nick, @AdvJosh (TEX#) - KJ5FZD, @edsai KI5OSB)

### MQTT

The vast majority of us have chosen not to use MQTT with Meshtastic in the spirit of building out a stronger RF based mesh network, instead of relying on the internet to patch coverage gaps. We also recommend setting your nodes to ignore any MQTT traffic.

If you use a busy MQTT server/topic it can quickly overwhelm your node and flood the entire network with traffic rendering local communications difficult or impossible. Additionally, using MQTT can give us a false sense of how robust our local RF network is, make it difficult to optimize, diagnose issues and plan future network expansion. Our goal is to build a robust, reliable off grid network that can be utilized by our community during internet/power outages.

### Device Role

It may be tempting to set your device to 'client/router' or one of the other infrastructure modes, however from our extensive testing we've seen the best results for the end user, and the network as a whole using the 'client' role. Meshtastic does not currently have any intelligent routing built into the firmware. Nodes are set to rebroadcast any message they receive that they have not heard rebroadcast from another node at a random time interval. The 'client/router' and other infrastructure role takes that random interval and subtracts another random interval ensuring that they rebroadcast first.

While this may sound good on paper, due to constantly changing environmental variables you may be inadvertently creating dead ends in the network, bypassing intended recipients, and closing off redundant routing paths. We highly recommend starting with a 'client' role even for well placed nodes.

For device connected nodes (the ones you're sending messages from) that are not contributing to the network we recommend a device role of 'client mute' to reduce overall network airtime. An example of this would be a device connected node in your home that goes through a relay node on your roof.

### Hop Count

We recommend starting with a hop count of 3, and always using the minimum number of hops needed to reach your destination. If you are running a device connected node in your home and a relay node that your client always goes through, a hop count of 4 is advised. If you are on the edge of the network and are not achieving results with the above, 5 hops may be useful however we recommend ensuring that you've done all you can with regard to optimizing your node hardware and placement first, if these are not taken care of additional hops will not yield greater distance and will degrade the performance of the wider network.

### Broadcast Interval (Position, Telemetry, Node Info)

In order to reduce overall channel utilization and ensure messages are delivered we recommend the following settings for everyday use unless you have a specific use case or are running a test that requires more frequent updates.

#### Device Config

Node Info Broadcast Interval: 3 Hours

#### Position

Broadcast Interval: 1 Hour, Enable Smart Position, Minimum Interval: One Minute, Minimum Distance: 100, Position Flags: Disable all flags that are not explicitly needed for your use case.

#### Telemetry (Sensors) Config

Device Metrics: 3 Hours, Sensor Metrics: 1 Hour
