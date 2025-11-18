---
layout: layouts/page.html
title: Tuning an Airframes Filter for Meshtastic and MeshCore
description: Step by step guide to tune the Airframes cavity filter for Meshtastic or MeshCore.
eleventyNavigation:
  key: Tuning a cavity filter
  parent: Learn
---

<section aria-labelledby="cavity-filter-tuning">
    <header>
        <h1 id="cavity-filter-tuning">Tuning an Airframes Cavity Filter for Meshtastic or MeshCore</h1>
        <p>This guide shows how to identify unlabeled screws on a small cavity band-pass filter and tune it for Meshtastic bands (e.g., US915 or EU868) using a nanoVNA. It's written for the Airframes filter.</p>
        <p>An <a href="https://www.youtube.com/watch?v=W4J9gBGE-Oo" target="_blank" rel="noreferrer">overview video</a> is available on our YouTube channel.</p>
    </header>

    <h2>Tools & Materials</h2>
    <ul>
        <li>nanoVNA</li>
        <li>Two short, quality 50&nbsp;Ω coax jumpers(typically comes with a VNA)</li>
        <li>50&nbsp;Ω terminations (for calibration and optional port-match checks)</li>
        <li>Non-metallic surface to work on</li>
        <li>Tape/marker to label screws A, B, C, D</li>
        <li>Screwdriver, wrench/pliers</li>
    </ul>

    <h2>Before You Start</h2>
    <ul>
        <li>Let the VNA and filter sit a few minutes to reach room temperature.</li>
        <li>Keep cable/adapters identical during calibration and measurement.</li>
        <li>Work in tiny moves: 1/16–1/8 turn per step. Never force a hard stop.</li>
    </ul>

    <h2>Calibrate the nanoVNA</h2>
    <ol>
        <li>Choose a span that fully covers your target band:
            <ul>
                <li>Start wide at <code>50&nbsp;MHz</code>, later zoom to ~<code>8&nbsp;MHz</code> centered around your desired freq.</li>
            </ul>
        </li>
        <li>Perform a full 2-port SOLT calibration (O/S/L on both ports, then THRU).</li>
        <li>Save the calibration to a slot for reuse.</li>
    </ol>

    <h2>Recommended nanoVNA Trace Setup</h2>
    <p>Configure four traces so you rarely need to toggle views:</p>
    <ol>
        <li><strong>Trace 1</strong>: <em>S11 LOGMAG (REFL)</em> - input return loss (match quality).</li>
        <li><strong>Trace 2</strong>: <em>S21 LOGMAG (THRU)</em> - insertion loss; the "passband hill."</li>
        <li><strong>Trace 3</strong>: <em>S11 Smith</em> set to <em>R + jX</em> - shows input impedance relative to 50&nbsp;Ω.</li>
    </ol>
    <p>Place markers on your desired center frequency. e.g. 906.875 for Meshtastic LongFast or 910.525 for MeshCore</p>

    <h2>Identify the screws</h2>
    <ol>
        <li>Label the four screws <strong>A</strong>, <strong>B</strong>, <strong>C</strong>, <strong>D</strong>.</li>
        <li>For each screw:
            <ol>
                <li>Note the current traces, then rotate the screw <strong>+1/8 turn</strong>.</li>
                <li>Watch <strong>S21 LOGMAG</strong>, <strong>S11 LOGMAG</strong>, and <strong>Smith</strong>:
                    <ul>
                        <li><strong>Resonator tuning screw</strong>: the <em>S21 peak frequency slides</em> left/right; phase slope shifts.</li>
                        <li><strong>Inter-resonator coupling screw</strong>: passband <em>bandwidth/ripple changes</em> more than center frequency.</li>
                        <li><strong>Port (input/output) coupling screw</strong>: <em>S11 depth/Smith position changes</em> strongly; S21 shape changes little.</li>
                    </ul>
                </li>
                <li>Return the screw to its original position (−1/8 turn) and log what you saw.</li>
            </ol>
        </li>
        <li>After testing A–D, you should have <strong>two tuning</strong> screws and <strong>two coupling</strong> screws identified (usually one inter-resonator + one port coupling).</li>
        <img src="/assets/images/airframes-labeled.webp" width="200" />
    </ol>

    <h2>Core Tuning Procedure</h2>
    <ol>
        <li><strong>Find and zoom the passband</strong>: With <em>S21 LOGMAG</em> visible, sweep wide to locate the "hill," then narrow the span around your target (e.g., 904–914&nbsp;MHz for a 910.5&nbsp;MHz center).</li>
        <li><strong>Align the resonators to center frequency</strong>:
            <ol>
                <li>Adjust <em>Tuning Screw 1</em> with tiny turns until the S21 peak moves toward your center.</li>
                <li>Adjust <em>Tuning Screw 2</em> to "pull" the top into a single tall peak <em>centered</em> on your target.</li>
                <li>Iterate 1–2 until the <strong>highest S21 point sits at your center</strong>. A smooth, monotonic <em>S21 Phase</em> trace indicates good alignment.</li>
            </ol>
        </li>
        <li><strong>Set the bandwidth (inter-resonator coupling)</strong>:
            <ul>
                <li>Increase coupling -> <em>wider</em> passband, lower center loss, may add ripple.</li>
                <li>Decrease coupling -> <em>narrower</em> passband, steeper skirts, sometimes higher center loss.</li>
            </ul>
        </li>
        <li><strong>Optimize input match (port coupling)</strong>:
            <ol>
                <li>Watch <em>S11 LOGMAG</em> and the <em>Smith</em> point at center. Target ≤&nbsp;<strong>−15&nbsp;dB</strong> S11 with impedance near <strong>50&nbsp;Ω + j0</strong>.</li>
                <li>If Smith shows <em>capacitive</em> (−jX), back the probe/screw out slightly; if <em>inductive</em> (+jX), advance slightly. Stop when the dot sits near the Smith center and S11 dip deepens.</li>
            </ol>
        </li>
        <li><strong>Final polish</strong>:
            <ul>
                <li>Re-maximize <em>S21</em> at center with tiny alternating tweaks on both tuning screws.</li>
                <li>Confirm <strong>−3&nbsp;dB bandwidth</strong>, <strong>insertion loss</strong> at center (ideally ~1–2&nbsp;dB; some cans land ~3&nbsp;dB), and <strong>S11</strong> (≤ −10&nbsp;dB acceptable, ≤ −15&nbsp;dB preferred).</li>
            </ul>
        </li>
    </ol>
    <img src="/assets/images/airframes-tuned.webp" width="200" />

    <h2>Troubleshooting Patterns</h2>
    <ul>
        <li><strong>Two peaks / "camel back"</strong>: resonators are off-frequency or over-coupled. Re-align tuning screws and slightly reduce inter-resonator coupling.</li>
        <li><strong>Wide but lossy top</strong>: likely over-coupled. Reduce coupling, then re-center both resonators.</li>
        <li><strong>Great S11 but high loss</strong>: resonators not exactly centered; re-maximize S21 at the target frequency.</li>
        <li><strong>Asymmetric skirts</strong>: one resonator still off; balance with tiny opposing moves.</li>
    </ul>

    <h2>Targets & Reference Values</h2>
    <ul>
        <li><strong>Center frequency</strong>: your Meshtastic channel/center (e.g., 910.5&nbsp;MHz).</li>
        <li><strong>Bandwidth</strong>: 1-2&nbsp;MHz for the Airframes</li>
        <li><strong>Insertion loss (S21@center)</strong>: ≤~3&nbsp;dB is acceptable.</li>
        <li><strong>Return loss (S11/S22@center)</strong>: ≤ −10&nbsp;dB acceptable; ≤ −15&nbsp;dB preferred.</li>
    </ul>

    <h2>Save Your Results</h2>
    <ol>
        <li>Save a calibration slot and the final trace state on the nanoVNA.</li>
        <li>Tighten the nuts while maintaining screw position. Keep an eye on the VNA while you do this!</li>
    </ol>

    <footer>
        <p><em>Note:</em> Exact screw roles and rotation directions vary by manufacturer. The method above is intentionally empirical so you can deduce functions safely without a datasheet.</p>
    </footer>
</section>
