# 🤺 AntiDoomscroll: The "Hostile Productivity" Browser Extension

> *"Traditional site blockers ask you politely. AntiDoomscroll makes the distraction so deeply bizarre, confusing, and unrewarding that you close the tab out of sheer exasperation."*

[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blueviolet?style=for-the-badge&logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Local ML](https://img.shields.io/badge/Local%20ML-WebGPU%20%2B%20Transformers.js-orange?style=for-the-badge&logo=huggingface)](https://huggingface.co/docs/transformers.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

---

## ⚡ The Premise

Traditional website blockers fail because they rely on binary locks. When a dopamine-craving brain encounters a block screen, it simply enters the password, disables the extension in `chrome://extensions`, or bypasses the blocker in an incognito window.

**AntiDoomscroll** takes an adversarial psychological approach:
Instead of blocking YouTube, Reddit, Twitter, or TikTok during your scheduled work hours, **it lets you stay on the page—but aggressively ruins the experience from the inside out**.

Powered by a lightweight, low-latency local vision & text model (running entirely on-device via WebGPU and optional local LLM sidecars), AntiDoomscroll watches your scrolling patterns and activates progressive DOM sabotage:

```
[Visit YouTube during work hours]
          │
          ▼
   Stage 1: Subtle Confusion ──► Titles scrambled, clickbait converted to dad jokes
          │
          ▼
   Stage 2: The Elizabethan Shift ──► Comments rewritten into Shakespearean laments
          │
          ▼
   Stage 3: Physical Degradation ──► Video shrinks 1% every 5s until it's a 10px dot
          │
          ▼
   Stage 4: Complete Collapse ──► Page tilts 5 degrees, thumbnails swap, audio ghosting
          │
          ▼
   [User sighs and closes the tab to get back to work]
```

---

## 🎯 Core Features & Sabotage Weapons

### 1. 🔻 The Incredible Shrinking Player
When video consumption is detected during focus hours, the video player element smoothly scales down by **1% every 5 seconds**. Within three minutes, you are squinting at a thumbnail-sized video player floating in an abyss of whitespace.

### 2. 🎭 The Shakespearean Comment Inverter
Uses in-browser text transposition and local NLP to replace Reddit and YouTube comment sections in real-time with **16th-century Elizabethan prose, tragic soliloquies, and mock-philosophical despair**:
- *Before:* "Bro really thought he could get away with that 💀💀💀"
- *After:* "Alas, doth this misguided knave truly fancy fortune shall shield his vanity from reckoning? Verily, 'tis tragic folly."

### 3. 🌀 The DOM Scrambler & Optical Drift
- **Title Rot**: Clickbait titles are rewritten into anti-climactic truths or meaningless anagrams.
- **Thumbnail Roulette**: Feed thumbnails are swapped with adjacent videos or inverted in hue.
- **Subtle Page Tilt**: Injects a CSS transform that tilts the entire page by `0.3°` every 30 seconds. Imperceptible at first, but drives your subconscious mind crazy.

### 4. 👁️ Local Vision & Activity Classifier
- Zero cloud tracking, 100% privacy-preserving.
- Runs an in-browser vision model via **WebGPU / Transformers.js** in an Offscreen Document, with zero server requirements.
- Optionally connects to a local sidecar (Ollama / SmolVLM / Moondream) to evaluate whether a video or article is work-related (e.g., coding tutorial vs. 4-hour gaming retrospective).

### 5. 🎚️ Hostility Escalation Matrix
Configure your punishment curve:
- **Passive Aggressive**: Subtle text tweaks, slow audio fade, sarcastic tooltips.
- **Malicious Compliance**: Everything works, but elements move 10 pixels away whenever your cursor approaches them.
- **Unhinged**: Full video shrinking, total Elizabethan comment overhaul, and continuous DOM mutations.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CHROME BROWSER                        │
├────────────────────────┬────────────────────────────────────┤
│   Target Tab (Web)     │       Extension Background         │
│                        │                                    │
│  ┌──────────────────┐  │  ┌──────────────────────────────┐  │
│  │  Content Script  │  │  │  Background Service Worker   │  │
│  │ ──────────────── │  │  │ ───────────────────────────  │  │
│  │ • DOM Observers  │◄─┼──┤ • Work Schedule Alarm        │  │
│  │ • Sabotage Engine│  │  │ • Hostility State Machine    │  │
│  │ • Text Rewriter  │  │  │ • Tab Watcher                │  │
│  └────────┬─────────┘  │  └──────────────┬───────────────┘  │
│           │            │                 │                  │
│           │            │                 ▼                  │
│           │            │  ┌──────────────────────────────┐  │
│           │            │  │      Offscreen Document      │  │
│           │            │  │ ───────────────────────────  │  │
│           │            │  │ • WebGPU / Transformers.js   │  │
│           │            │  │ • Low-latency Vision ML      │  │
│           │            │  │ • Offscreen Canvas Analysis  │  │
│           │            │  └──────────────┬───────────────┘  │
└───────────┼────────────┴─────────────────┼──────────────────┘
            │                              │ (Optional)
            │                              ▼
            │               ┌──────────────────────────────┐
            │               │  Local ML Sidecar (Ollama)   │
            │               │  Moondream / SmolVLM / Mini  │
            └───────────────┤  POST http://localhost:11434 │
                            └──────────────────────────────┘
```

---

## 🛠️ Project Roadmap & Subcomponents

1. **Sprint 1: Specifications & Documentation** (Current)
   - Manifest V3 architecture design
   - Project specifications in `IMPLEMENTATION.md`
   - Initial repository setup and GitHub sync

2. **Sprint 2: Extension Core Skeleton**
   - Manifest V3 declarations & permissions
   - Cyberpunk Antagonistic Popup UI with work schedule controls
   - Background service worker & alarm scheduler

3. **Sprint 3: The Sabotage Engine**
   - Video Shrinker module with smooth cubic-bezier transitions
   - Real-time DOM text node walker & Shakespearean lexicon engine
   - Thumbnail chaos swapper & optical drift CSS modules

4. **Sprint 4: Vision & Activity Detection Pipeline**
   - Offscreen Document setup for sandboxed WebGPU execution
   - Transformers.js vision inference (MobileNet / CLIP / Florence-2)
   - Screen capture bridge (`chrome.tabs.captureVisibleTab`)
   - Local Ollama / SmolVLM sidecar fallback API

5. **Sprint 5: Site Adaptors**
   - Deep YouTube adaptor (Shorts blocker, feed scrambler, watch player shrinker)
   - Deep Reddit adaptor (Infinite scroll disruptor, comment transformer)

6. **Sprint 6: Polish, Options & Release**
   - Hostility slider presets ("Gentle Nudge" to "Unhinged")
   - Sound synthesis (subtle yawning & yawn frequencies)
   - Build automation, package scripts, and test suite

---

## 🚀 Quickstart & Installation (Developer Mode)

### Prerequisites
- Google Chrome or any Chromium-based browser (v116+ recommended for WebGPU & Offscreen Document support).
- Node.js 18+ (for building and testing).

### Local Setup
```bash
# Clone the repository
git clone https://github.com/pranavbhupathiraju/anti_doomscroll.git
cd anti_doomscroll

# Install dependencies
npm install

# Build extension artifacts
npm run build
```

### Loading into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** via the toggle switch in the top right.
3. Click **Load unpacked**.
4. Select the `anti_doomscroll` project directory (or `dist/` once built).
5. Open YouTube or Reddit during active work hours and watch the chaos unfold!

---

## ⚖️ License & Ethics

Released under the [MIT License](LICENSE).
Built purely for personal productivity, laugh-out-loud entertainment, and exploring local in-browser machine learning and Chrome Manifest V3 APIs.
