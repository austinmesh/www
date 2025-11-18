---
layout: layouts/page.html
title: Learn about Meshtastic and Austin Mesh
description: Learn all about Meshtastic, Austin Mesh, why we exist, and similar technologies.
eleventyNavigation:
  key: Learn
  order: 2
---

<hgroup>
    <h1>Learn about Austin Mesh and Meshtastic</h1>
    <p>Austin Mesh is a community group working to build a mesh network of solar-powered <a href="https://meshtastic.org/">meshtastic</a> radios in Austin. This network acts like a city-wide text messaging system, allowing people to communicate publicly or privately with anyone on the network. All of this happens without any external infrastructure - no power, no cell phone towers, no internet.</p>
</hgroup>

<ul>
    <li><a href="#about">About Austin Mesh and Meshtastic</a>
        <ul>
            <li>Why build a mesh in the first place?</li>
            <li>How does it work?</li>
            <li><a href="#eli5">Explain it like I'm 5</a></li>
            <li>What can it do?</li>
            <li>Why build this network?</li>
        </ul>
    </li>
    <li><a href="#coverage">Network coverage in Austin</a></li>
    <li><a href="#comparisons">Comparisons to similar technology</a></li>
</ul>

## Why build a mesh in the first place?

<blockquote cite="https://www.zeroretries.org/p/zero-retries-0170?open=false#%C2%A7a-few-good-comments-on-fcc-docket">First responders have access to FirstNet, a hardened, prioritized cellular service operated by AT&T. Ordinary citizens have no equivalent "network of last resort"… or at least they didn't until Meshtastic was developed. Meshtastic is being used in (preparation for) emergency scenarios by ordinary citizens because it is inexpensive to buy individual nodes and doesn't depend on infrastructure. Meshtastic's relay (mesh) functionality is automatic, and it can easily be deployed by individuals or in groups such as a neighborhood.</blockquote>

<cite>Steve Stroh N8GNJ, <a href="https://www.zeroretries.org/p/zero-retries-0170?open=false#%C2%A7a-few-good-comments-on-fcc-docket">Zero Retries 0170</a></cite>

<h2 id="about">All about Austin Mesh and Meshtastic</h2>

### How does it work?

We have set up a number of solar-powered radio repeaters in Austin. These radios communicate on the [906.875 MHZ](https://en.wikipedia.org/wiki/33-centimeter_band) frequency using the [LoRa protocol](https://en.wikipedia.org/wiki/LoRa). The radios mesh using the open-source [Meshtastic](https://meshtastic.org/) software. Users can connect to these repeaters by Bluetooth if they're close enough or they can use their own handheld nodes which will also act as repeaters. The messages hop from node to node, extending the reach of the network and ensuring everyone receives every message.

<h3 id="eli5">Can you explain it like I'm 5?</h3>

Pretend you're sitting in class and want to send a note to everyone in the class. You write your note on a piece of paper and copy it three times. The message can be up to 228 characters - about as long as this paragraph so far. You hand those three pieces of paper to the three people around you. Then those three people re-write the message three times and hand it to the three people around them and so on. Now imagine a big gust of wind comes and blows away some of the messages. If even just a few people saw the note and keep copying and re-sending it, eventually everyone will get a copy of the note. This is like sending an unencrypted message to everyone on the network.

Now imagine you want to send a message to a single person or a select group of people but you don't want other people who see the note to be able to read it. You could write the note using a secret language. You could then hand a decoder key to your friend or to a group of friends and they could decode the message. The message still gets passed the same way - with every single person writing the message a few times and handing it to everyone - but only those people with the decoder key will be able to understand the message. This is like sending an encrypted direct message or encrypted group message.

Austin Mesh works the same way as this paper example, but instead of sending paper notes we're using digital text messages and sending it with radio waves. Our radios are solar powered and they don't need any internet or cell phone coverage. This means they will work even if the power is out.

### What can it do?

Meshtastic is a bit like a decentralized social media platform or SMS text messaging. It has a number of different features which will be familiar to anyone who has sent a text message or posted on social media.

<dl>
    <dt>1) Primary Channel:</dt>
    <dd>You can broadcast an unencrypted message to the Primary Channel and everyone on your mesh will see it. This is a bit like "posting" publicly on a social media platform.</dd>
    <dt>2) Group Channels:</dt>
    <dd>You can send an encrypted message to a select group of people on a Secondary Channel and everyone who is subscribed to that channel will get it. People can join the channel if you provide them with an encryption key which you can send to them via Direct Message or which they can scan from a QR code in person. This is a bit like a private group on social media, or a group text message chain on SMS.</dd>
    <dt>3) Direct Messages:</dt>
    <dd>You can send encrypted direct messages to people on the mesh. This is like a private text message or a DM on social medial.</dd>
    <dt>4) Location:</dt>
    <dd>If you choose to enable it you can send your location to the mesh and it will show up on everyone's map in the app.</dd>
    <dt>5) Connect Worldwide:</dt>
    <dd>If anyone on your local mesh is running an MQTT gateway your local mesh will connect to the other meshes around the world. This can allow you to broadcast messages to everyone globally or send encrypted messages to groups or individuals worldwide.</dd>
    <dt>6) Telemetry Data:</dt>
    <dd>Nodes can be set up to send telemetry data like the battery status or signal strength, which is helpful for monitoring remote solar-powered nodes. Nodes can also have sensors connected to them which allow them to send data on temperature, humidity, or air pressure which allow them to act like weather stations.</dd>
</dl>

### Why build this network?

#### 1) Community

Because this is essentially a city-wide group text message chain we are hoping people use the network to build community. Tell the group where your band is playing tonight, chat about local politics, ask for a good cheese dip recipe, etc.

#### 2) Disasters

If the power goes out, like during the 2021 Winter Storm Uri, this network should allow people to continue to communicate with each other without electricity, cell phone coverage, or internet. This big city-wide group text chain could allow people to ask for help or offer assistance. People could get information about where warming centers are open or ask who in their neighborhood still has power. People could also send encrypted direct messages to check in on friends and family or they could send encrypted group messages to coordinate privately in a group.

#### 3) Decentralized, Open, and Resilient

Austin Mesh is decentralized - there is no central server or corporation - all the communication bounces through the entire mesh. Austin Mesh is open to everyone - you don't have to ask permission to join and all of the software is open-source. Austin Mesh is resilient - our solar-powered radios don't need cell phone towers, internet access, or electricity. We hope this project will inspire others to build things that are decentralized, open, and resilient.

<h2 id="coverage">What kind of coverage does the Austin Mesh network have?</h2>

As of fall 2025 we have coverage throughout most of greater Austin, including pockets of Dripping Springs, Cedar Park, Leander, Bastrop, and San Marcos which is approximately 2600 square miles. We're actively working to expand this coverage.

We now have a coverage map showing nodes seen over the last 15 days:

<iframe src="https://graphs.austinmesh.org/d-solo/ddpwwgtdxf2m8f/austin-mesh?orgId=1&from=now-15d&to=now&panelId=10" height="400" frameborder="0"></iframe>

[The MQTT map at meshmap.net](https://meshmap.net/) is **not** representative of the coverage as we [do not recommend using MQTT](/join/#best-practices) however it may still be useful for you to see what is in your area. Another [map of **self reported** nodes](https://canvis.app/meshtastic-map) is also available, but more likely to be out-of-date.

<h2 id="comparisons">Comparing it to APRS on Ham Radio</h2>

For people who are familiar with using the [Automatic Packet Reporting System (APRS)](https://en.wikipedia.org/wiki/Automatic_Packet_Reporting_System) on ham radio, Meshtastic is **similar** in a few ways:

### Similarities

<dl>
    <dt>Digipeaters</dt>
    <dd>APRS radios can be set up as clients, which receive all messages and only transmit the users messages, or APRS radios can be set up as digipeaters, which repeat all the messages they hear. Meshtastic radios by default all act as repeaters – just like APRS digipeaters.</dd>
    <dt>iGates</dt>
    <dd>MQTT Gateways are like APRS iGates – they repeat all local traffic over the internet to other MQTT Gateways around the world.</dd>
    <dt>ANSRVR</dt>
    <dd>APRS users can subscribe to groups using the ANSRVR service. This allows for group chats like the popular #APRSThursday net. Meshtastic has "Secondary Channels" that can be subscribe to, allowing users to send messages to everyone on the channel.</dd>
    <dt>Burst</dt>
    <dd>APRS uses the AX.25 protocol which sends messages using data bursts between 0.3 and 0.5 seconds long. Meshtastic uses the LoRa protocol which sends messages in data bursts between 0.5 and 10 seconds long.</dd>
</dl>

### Differences

But Meshtastic is also **different** than APRS in a few ways:

<dl>
    <dt>Primary</dt>
    <dd>APRS doesn't have a way to broadcast a message to everyone on the network. Messages sent to Meshtastic's Primary Channel go to everyone.</dd>
    <dt>Encryption</dt>
    <dd>APRS is unencrypted because it is illegal to use encryption over ham radio. Meshtastic is encrypted for communications on private group channels and for direct messages between users, because it runs on the 900 MHz ISM band, which does not have restrictions on encryption.</dd>
    <dt>License</dt>
    <dd>APRS requires the user to have a ham radio license. Meshtastic does not require any license and is open for anyone to use.</dd>
    <dt>Equipment Cost</dt>
    <dd>APRS capable handheld ham radios cost upwards of $400. Meshtastic radios cost less than $100.</dd>
    <dt>Email</dt>
    <dd>APRS has services which allow users to send emails and SMS text messages to people who aren't ham radio users. Meshtastic does not have this feature but it could be added in the future.</dd>
    <dt>Simplicity</dt>
    <dd>APRS is quite a bit more difficult to use than Meshtastic. APRS does not have any standardized user interface – there are dozens of software packages available. Meshtastic has a standardized iPhone and Android app which is easy to understand for new users.</dd>
</dl>
