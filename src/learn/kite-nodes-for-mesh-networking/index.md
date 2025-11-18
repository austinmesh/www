---
layout: layouts/page.html
title: Kite Nodes
description: Learn how to build and fly kite-mounted relay nodes for AustinMesh. Step-by-step guide with equipment lists, setup instructions, lessons learned, and contingency planning.
eleventyNavigation:
  key: Kite Nodes for Mesh Networking
  parent: Learn
---

# Kite Nodes

<figure>
    <img src="/assets/images/kite-nodes/kite-flying.webp" width="400" alt="A kite flying in the air" />
</figure>

Kites are a great, low cost alternative to drones. There are fewer restrictions (regulations) to consider, however there are some other challenges to keep in mind.
Considerations: Wind speed, kite type, line weight and length, node size and weight.
Pros: Cheap entry, long flight times (no batteries)
Cons: Wind (nature) dependant, possible to lose control (or wind) and suddenly crash
Kite types: Delta, Parafoil, Box

## Items/settings used (ymmv)

<ul>
    <li>Delta Kite (60in wingspan, ~$20 on Amazon)</li>
    <li>Wind up hand reel (8in w 1000 feet of line; ~15 on Amazon)<br> (Recommend larger 10in reel for comfort. 1000ft line is more than enough for this size delta kite).<br> Make sure the line comes with some sort of attachment clip that free spins. This helps the line to not twist as much.</li>
    <li>Kite Node (as relay for ground node)<br> Rak 19003<br> Client mode (can use Router or Router_Late)<br> Short Name = Kite<br> 350mAh flat LiPo battery (100mAh is probably fine)<br> Rak 12500 GPS<br> Smart position, update interval 120s, precise location<br> Antenna (up to you. Tested stock PCB, stubby, etc)</li>
    <li>Ground Node (used to send messages to mesh)<br> Rak 19003<br> Client_Mute mode<br> Long name included "via Kite"</li>
</ul>

## Kite Node

You want your kite relay node to be as light weight as possible. I wanted to know the specific altitude, so I attached a Rak 12500 GPS, but this is not required (though this came in handy later on. See Lessons Learned). I placed the node, battery, and GPS into a resealable plastic bag and taped it to the kite. The total weight of the payload was 27g.

<figure>
    <img src="/assets/images/kite-nodes/kite-node-payload.webp" width="400" alt="Payload attachment illustration from PDF page 2" />
</figure>

## Attachment to Kite

For my Delta kite, I saw two options for placement. Either on the underside (ground facing) of the kite, on the part that anchors to the line [left photo below], or the topside (sky facing), anchored to the spreader pole [right photo below]. I tried both, and found the topside to be better. Using strong tape, I adhered along the one edge of the plastic bag, then wrapped around the spreader pole of the kite, then back on to the other side of the same edge of the bag. Then I taped the opposite bag edge to the kite so it was flat against the kite.

<figure>
    <img src="/assets/images/kite-nodes/kite-line-marked.webp" width="400" alt="Showing attachment method of node to kite" />
    <img src="/assets/images/kite-nodes/kite-line-marked-alt.webp" width="400" alt="Showing attachment method of node to kite" />
</figure>

## Reel and line

I pre-marked my line at 100ft intervals so I would have a better idea of how much line I let out. (Ex: one ring mark at 100ft, two marks at 200ft, three at 300ft, etc). I also attached a short length of paracord with a d-clip to my reel. This allowed me to anchor the reel to a chair when the kite was airborne, letting me be comfortable and handsfree to message the mesh.
[In the left photo below, you can see a little black mark mid-way up the yellow line. This was 100ft.]

<figure>
    <img src="/assets/images/kite-nodes/kite-flight.webp" width="400" alt="Showing the marked line coming out from the reel" />
    <img src="/assets/images/kite-nodes/kite-flight-alt1.webp" width="400" alt="The reel attached to a chair" />
</figure>

## Flight day

I went to a local park. I was out there for a few hours so I recommend bringing a chair, and snacks too.
If you don't know how to get a kite airborne,YouTube is your friend (also, trial and error). I can say the Delta style kite is rather low effort to get started and to stay in the air.

<figure>
    <img src="/assets/images/kite-nodes/kite-flight-alt2.webp" width="400" alt="Alternate flight image from PDF page 4" />
</figure>

## Mesh results

The kite node is several hundred feet above you (well out of Bluetooth range), so a ground node is a must. While connected to my ground node (as Client_Mute), I messaged the Default mesh channel. This was carried to my 0 hop kite node (as Client or Router or Router_Late) and then relayed to the broader area mesh. I saw replies from nodes in the next town over on either side of me (Leander to Round Rock and Jonestown). My ground node's long name included "via Kite", so recipients who saw my messages knew there was a kite airborne. (This was before Router_Late and Unmonitored were a thing, so I'd probably use those today).
If you can pre-plan a flight day and coordinate other kites or drones, you can really begin to test the capabilities of your local mesh coverage area. In my small town of Leander, just north of Austin, I'm in somewhat of a bowl, with elevated hills surrounding me. This kite experiment really helped me to see that a good, well placed and elevated node could indeed connect me to the broader AustinMesh network. Height really is might.

## Lessons Learned

Wind can be a drag. Size of your kite, length and weight of your line, and wind speed all play a factor. My 5ft Delta kite and ~600ft line were right for my conditions. A larger (or different style) kite might get better lift, making 800-1000ft of line more optimal.
Keep in mind that 1000ft line out, doesn't mean 1000ft above ground level (agl). As I let line out, and kept track of the line markers, I quickly discovered I hadn't considered anything about wind drag coefficiencies. I could visibly see at 1000ft of line, there was a significant wind drag curve keeping the kite from reaching its highest potential, literally. (Veritasium made a great video demonstrating drag). After playing with various line lengths, I found a sweet spot around 600ft of line out, which visibly looked to have a lower drag curve in the line, allowing the kite to fly higher (and confirmed with the GPS of the kite node).
Reel size really matters. The line lets itself out easily as the wind pulls the kite into the sky. It's the reeling it back in that takes time and effort. I consider my hands to be average male size, and the 8in reel was just too small to be comfortable when reeling in. I'd suggest the 10in version, or a higher quality reel. I've also seen rigs that use a power drill to wind it up! It took me ~20mins to reel in 600ft of line. I took rests, because you can't really do that in one continuous go, so if you're in a time crunch, be sure to allow for the time it takes to bring the kite back down to earth.
Attachment styles. In some of my early test flights I just had a 3d printed enclosure attached with a string to the kite line anchor point. This was problematic for a few reasons. The node weighed more ~60g, it wasn't water tight, not aerodynamic, loose, etc. I found it flopped around a lot, and spun itself around the kite line to the point that it caused the kite to eventually death spiral. Did it work, could I send messages out? Sure, but it wasn't great.

I moved the node to a plastic bag, which reduced weight (27g). In its new slim form factor, I taped it to the part of the kite that attaches to the line. Taping all sides of the plastic to the kite, streamlined it for wind, but it was only a matter of time before the violent vibrations of the kite made the tape loose adhesion. I think I got about 1.5hrs before the tape ripped off, and the node plunged to the ground. I later tried taping to the spreader pole on the topside of the kite, and that has worked much better for me ever since.

## Contingency

As I mentioned, my relay node eventually came off my kite and it was some time before I noticed. Thankfully, I had the GPS unit on it, and my location settings were precise. I was able to find it after it fell from my kite. Turns out, it landed in a detention pond, then floated to the shoreline. So, a few things I learned here: make sure whatever it's in is water tight (no holes in the plastic bag), secure it to the kite well and consider a backup tether like string, consider an onboard GPS and set precision location settings.

<figure>
    <img src="/assets/images/kite-nodes/kite-node-recovery.webp" width="400" alt="Recovery image from PDF page 6" />
</figure>
