---
layout: layouts/page.html
title: Getting Started with MeshCore
description: A simple guide for those already familiar with Mesh networks to get started with MeshCore.
eleventyNavigation:
  key: Getting started with MeshCore
  parent: Join
---

<hgroup>
    <h1>Getting Started with MeshCore</h1>
    <p>This page will serve well as a <b>starting point</b> for users who are familiar with Mesh networking, specifically Meshtastic, and are either looking to try, or fully switch to MeshCore. For those seeking more detail, check out a <a href="/learn/meshcore-vs-meshtastic/">full comparison between MeshCore and Meshtastic</a>.</p>
</hgroup>

<h2 id="tldr">TL;DR</h2>

<ul>
    <li>Works on (almost) all the same hardware as Meshtastic.</li>
    <li>Flash devices in-browser: <a href="https://flasher.meshcore.co.uk/" rel="noopener">https://flasher.meshcore.co.uk/</a></li>
    <li>Pick a role:
        <ul>
            <li><strong>Companion</strong>: Bluetooth; pairs with your phone.</li>
            <li><strong>Repeater</strong>: No Bluetooth; repeats only. Configure before deployment (use <em>Repeater Setup</em> in the flasher after flashing).</li>
        </ul>
    </li>
    <li>Use the <strong>US Recommended</strong> preset. <i>NOT</i> Alternate.</li>
    <li>MeshCore <b>firmware</b> is free/open source. The phone app is not. It offers an optional upgrade for faster remote management(10s wait timer otherwise). The PWA bypasses this if desired.</li>
    <li>You can switch back and forth between MeshCore and Meshtastic to your heart's content.</li>
    <li>Full comparison: <a href="https://www.austinmesh.org/learn/meshcore-vs-meshtastic/" rel="noopener">MeshCore vs Meshtastic</a></li>
</ul>

<h2 id="roles">Choose a Role: Companion vs Repeater</h2>

**Companion** is your phone-connected node. **Repeater** is a headless coverage extender that must be configured before mounting.

<h2 id="flash">Flash the Firmware</h2>

<ol>
    <li>Open <a href="https://flasher.meshcore.co.uk/" rel="noopener">flasher.meshcore.co.uk</a>.</li>
    <li>Connect your device via USB and select the correct port/board.</li>
    <li>Select the role</li>
    <li>Enter DFU</li>
    <li>Erase the device</li>
    <li><strong>Flash</strong> the role firmware.</li>
    <li>For repeaters, click "Repeater Setup" (see below).</li>
</ol>

<h2 id="configure">Configure</h2>

### Companion

<ol>
    <li>Pair with the phone app over Bluetooth.</li>
    <li>Set <strong>Region/Preset = US Recommended</strong>.</li>
    <li>Set position if desired.</li>
    <li>Send a <b>Flood Routed Advert</b> (signal/wave icon at top of app).</li>
    <li>Remember, you may not see other contacts. Unlike Meshtastic, MeshCore only discovers other nodes when they send an advert. Patience is key!</li>
    <li>Send a test message. If you see "Heard {num} repeats" then you are being heard. If you only see "Sent", the message was sent but no <b>repeaters</b> heard the message. A companion may have.</li>
</ol>

### Repeater

<ol>
    <li>After flashing, in the flasher click <strong>Repeater Setup</strong>.</li>
    <li>Set <strong>US Recommended</strong>.</li>
    <li>Set the name and position as desired. Positions are exact.</li>
    <li>Set the guest password and admin password.</li>
    <li>Reboot</li>
    <li>Send advert, make sure it shows up to your companion node</li>
    <li>From your companion node
        <ol>
            <li>Log in (tap on the contact)</li>
            <li>Go to Settings > Sync Clock</li>
            <li>Reboot</li>
        </ol>
        <li>Deploy/mount the repeater.</li>
    </ol>
</ol>

<h2 id="resources">Resources</h2>

<ul>
    <li>MeshCore FAQ/Wiki: <a href="https://github.com/meshcore-dev/MeshCore/blob/main/docs/faq.md" rel="noopener">Wiki</a></li>
    <li>Online flasher: <a href="https://flasher.meshcore.co.uk/" rel="noopener">flasher.meshcore.co.uk</a></li>
    <li>MeshCore vs Meshtastic: <a href="https://www.austinmesh.org/learn/meshcore-vs-meshtastic/" rel="noopener">austinmesh.org/learn/meshcore-vs-meshtastic/</a></li>
</ul>
