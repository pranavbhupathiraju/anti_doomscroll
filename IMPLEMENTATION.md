# 🛠️ AntiDoomscroll: Technical Implementation Specification

This document defines the architectural blueprint, data contracts, sabotage algorithms, and machine learning pipelines for the **AntiDoomscroll** ("Hostile Productivity") Chrome Extension.

---

## 1. System Architecture Overview

AntiDoomscroll is built strictly adhering to Chrome Extension **Manifest V3 (MV3)** specifications.

```
                      ┌────────────────────────────────────────┐
                      │              CHROME BROWSER            │
                      └───────────────────┬────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                     ┌───────────────────────────┐
     │ Content Script Sandbox │                     │ Background Service Worker │
     │  (Injected into Page)  │                     │   (Lifecycle & Routing)   │
     │ ────────────────────── │                     │ ───────────────────────── │
     │ • Platform Adaptor     │◄─── Sabotage ───────┤ • Alarm Scheduler         │
     │ • MutationObserver     │     Commands        │ • Work-Hours Gatekeeper   │
     │ • Video Shrinker       │                     │ • Tab Capture Trigger     │
     │ • Shakespeare NLP Engine│                    │ • Config & Storage State  │
     │ • Visual Chaos Engine  │                     └─────────────┬─────────────┘
     └────────────────────────┘                                   │
                                                        Capture   │ Offscreen Msg
                                                         Frame    │
                                                                  ▼
                                                    ┌───────────────────────────┐
                                                    │    Offscreen Document     │
                                                    │ ───────────────────────── │
                                                    │ • WebGPU Execution        │
                                                    │ • Transformers.js Vision  │
                                                    │ • Canvas Slicer (224x224) │
                                                    │ • Local Sidecar Bridge    │
                                                    └─────────────┬─────────────┘
                                                                  │ Optional HTTP
                                                                  ▼
                                                    ┌───────────────────────────┐
                                                    │ Local Sidecar (Ollama)    │
                                                    │ SmolVLM / Moondream / LLaVA│
                                                    └───────────────────────────┘
```

---

## 2. Directory Structure

```
anti_doomscroll/
├── README.md
├── IMPLEMENTATION.md
├── LICENSE
├── package.json
├── manifest.json
├── assets/
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── sounds/
│       └── subtle_sigh.mp3
├── src/
│   ├── background/
│   │   ├── service_worker.js       # Core lifecycle, alarms, schedule checks
│   │   └── scheduler.js            # Work hours & day-of-week evaluator
│   ├── common/
│   │   ├── constants.js            # Message types, storage keys, site targets
│   │   ├── storage.js              # Typed wrapper for chrome.storage.sync/local
│   │   └── dictionary.js           # Elizabethan / Shakespearean corpus & rules
│   ├── content/
│   │   ├── index.js                # Content script entrypoint & message router
│   │   ├── adaptors/
│   │   │   ├── base_adaptor.js     # Abstract interface for site scrapers
│   │   │   ├── youtube.js          # Player, shorts, recommendation selectors
│   │   │   └── reddit.js           # Infinite scroll, comment selectors
│   │   └── sabotage/
│   │       ├── video_shrinker.js   # Progressive element scaling engine
│   │       ├── shakespeare_nlp.js  # Real-time DOM text node rewriter
│   │       ├── chaos_engine.js     # Rotation, optical drift, blur, jitter
│   │       └── nag_overlay.js      # Passive-aggressive modals and countdowns
│   ├── offscreen/
│   │   ├── offscreen.html          # MV3 Offscreen container
│   │   ├── offscreen.js            # WebGPU model runner & frame preprocessor
│   │   └── vision_classifier.js    # Transformers.js / WebGPU classification
│   └── popup/
│       ├── popup.html              # Modern, antagonistic dark-mode control center
│       ├── popup.css               # Cyberpunk / retro-glitch styles
│       └── popup.js                # Settings controller & live hostility preview
└── tests/
    ├── nlp_rewrite.test.js         # Shakespearean text transformer tests
    ├── schedule.test.js            # Work hour evaluator tests
    └── storage.test.js             # Settings persistence tests
```

---

## 3. Extension Manifest V3 Specifications

```json
{
  "manifest_version": 3,
  "name": "AntiDoomscroll: Hostile Productivity",
  "version": "1.0.0",
  "description": "Adversarially destroys your procrastination on YouTube and Reddit with local vision ML and aggressive DOM sabotage.",
  "permissions": [
    "storage",
    "alarms",
    "offscreen",
    "activeTab",
    "tabs"
  ],
  "host_permissions": [
    "*://*.youtube.com/*",
    "*://*.reddit.com/*",
    "*://*.twitter.com/*",
    "*://*.x.com/*"
  ],
  "action": {
    "default_popup": "src/popup/popup.html",
    "default_title": "AntiDoomscroll Controls"
  },
  "background": {
    "service_worker": "src/background/service_worker.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": [
        "*://*.youtube.com/*",
        "*://*.reddit.com/*"
      ],
      "js": ["src/content/index.js"],
      "run_at": "document_idle"
    }
  ]
}
```

---

## 4. Subsystem Breakdown

### 4.1. Work Hours & Hostility State Machine
The extension operates under a multi-stage hostility curve based on time spent on blacklisted sites during active hours.

| Stage | Name | Threshold | Actions Activated |
|---|---|---|---|
| **0** | `PASSIVE` | Outside work hours or whitelisted | Normal browsing, 0% interference. |
| **1** | `CONFUSION` | 0 – 60 seconds on site | Clickbait titles scrambled; dad jokes / philosophical summaries injected. |
| **2** | `ELIZABETHAN` | 1 – 3 minutes | Real-time comment rewrite to Shakespearean laments via `shakespeare_nlp.js`. |
| **3** | `DEGRADATION` | 3 – 5 minutes | Video player shrinks 1% every 5s; audio drops 2% every 10s. |
| **4** | `UNHINGED` | > 5 minutes | Entire page tilts 0.2° per minute; cursor hover avoidance; nag overlays. |

### 4.2. The Sabotage Engine (DOM Manipulation)

#### A. The Incredible Shrinking Player (`video_shrinker.js`)
- Identifies main player containers (`ytd-watch-flexy #player-container`, `video` elements, Reddit video players).
- Injects a dedicated CSS transition property: `transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);`.
- Maintains a persistent `scaleFactor` (starting at `1.0`, decreasing by `0.01` every 5 seconds down to `0.05`).
- Shrinks the visual frame while leaving surrounding layout dimensions intact to prevent jarring page reflows.

#### B. Shakespearean & Archaic Text Transposer (`shakespeare_nlp.js`)
- Recursively traverses text nodes within comments, feed items, and post titles using `document.createTreeWalker(root, NodeFilter.SHOW_TEXT)`.
- Applies a multi-pass substitution and grammatic transposition dictionary:
  - Pronoun / Archaic grammar swap: `you -> thou/thee`, `your -> thy`, `are -> art`, `does -> doth`, `before -> ere`.
  - Modern slang conversion:
    - `"bro / dude"` -> `"gentle sir / base cur"`
    - `"cringe / cap"` -> `"grievous falsehood / brazen tomfoolery"`
    - `"literally / actually"` -> `"verily / by my troth"`
    - `"lol / lmao / 💀"` -> `"[chortles in bitter despair]"`
  - High-tier Soliloquy Infusion: Injects mock-dramatic quotes into top-voted comments ("*To scroll, or not to scroll: that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of unread emails...*").
- Uses `requestIdleCallback` batches of 50 nodes to guarantee 60fps rendering without freezing browser tabs.

#### C. The Chaos & Optical Drift Engine (`chaos_engine.js`)
- **Optical Tilt**: Subtle `transform: rotate(0.4deg)` applied to `body`.
- **Thumbnail Inversion**: Applies `filter: hue-rotate(180deg) contrast(1.1);` to video thumbnails.
- **Button Evader**: Injects subtle mousemove listener on primary action buttons (e.g. "Next Video" or "Load More Comments") that shifts the element `translate(12px, -8px)` when cursor enters 20px radius.

---

## 5. Vision & Machine Learning Pipeline

### 5.1. Execution Model (Offscreen Document)
Chrome MV3 service workers do not support WebGPU or DOM canvas elements directly. We route all visual and heavy ML tasks to an **Offscreen Document** (`src/offscreen/offscreen.html`).

```
[Background Service Worker]
       │
       │ 1. chrome.tabs.captureVisibleTab(activeTabId, { format: 'jpeg', quality: 50 })
       ▼
   Data URI (Base64 JPEG)
       │
       │ 2. chrome.runtime.sendMessage({ action: 'ANALYZE_FRAME', image: dataUri })
       ▼
[Offscreen Document]
       │
       ├─► Draws to 224x224 <canvas>
       ├─► Feeds image into Transformers.js MobileNet / CLIP model running on WebGPU
       │   OR dispatches to local Ollama (SmolVLM / Moondream2)
       │
       ▼
   Classification Result: { isProcrastination: true, confidence: 0.94, category: "gaming_stream" }
       │
       │ 3. Reply to Service Worker
       ▼
[Service Worker triggers Hostility Escalation]
```

### 5.2. Zero-Config Local Heuristic Mode
If WebGPU is unavailable or the user is on battery-saver mode, AntiDoomscroll falls back to **Heuristic Site Classification** (analyzing DOM metadata, URL paths like `/shorts`, channel names, and user interaction patterns) with zero latency and 0% CPU footprint.

---

## 6. Phased Implementation Roadmap

### Sprint 1: Project Scaffolding & Specifications (Status: Completed)
- [x] Initialized Git repository on branch `main`.
- [x] Configured remote `origin` -> `https://github.com/pranavbhupathiraju/anti_doomscroll.git`.
- [x] Author comprehensive `README.md` and `IMPLEMENTATION.md`.
- [x] Push initial specifications to GitHub.

### Sprint 2: Core Manifest V3 Skeleton & Storage Architecture
- [ ] Implement `manifest.json` with permissions (`storage`, `alarms`, `offscreen`, `activeTab`, `tabs`).
- [ ] Create `src/background/service_worker.js` with work schedule alarms.
- [ ] Build the Antagonistic Popup UI (`popup.html`, `popup.css`, `popup.js`) with hostility level controls and work-hours configuration.
- [ ] Implement `src/common/storage.js` with default settings and synchronization.

### Sprint 3: The Sabotage Engine (DOM Manipulation Modules)
- [ ] Build `src/content/sabotage/video_shrinker.js` (smooth quadratic scaling).
- [ ] Build `src/content/sabotage/shakespeare_nlp.js` (TreeWalker text transposition).
- [ ] Build `src/content/sabotage/chaos_engine.js` (tilt, thumbnail scramble, button evasion).
- [ ] Build `src/content/sabotage/nag_overlay.js` (condescending productivity alerts).

### Sprint 4: Vision & Local ML Pipeline
- [ ] Set up MV3 Offscreen Document (`src/offscreen/offscreen.html` & `offscreen.js`).
- [ ] Implement screenshot capture via `chrome.tabs.captureVisibleTab`.
- [ ] Implement in-browser WebGPU / Transformers.js image classifier.
- [ ] Implement local sidecar bridge (`POST http://localhost:11434/api/generate` for Ollama / SmolVLM).

### Sprint 5: Deep Site Adaptors (YouTube & Reddit)
- [ ] YouTube Adaptor: Intercepts Shorts, recommended videos sidebar, comments, and theater mode.
- [ ] Reddit Adaptor: Intercepts infinite scroll feed, comment threads, and media previews.
- [ ] Dynamic SPA navigation handling (History API & YouTube `yt-navigate-finish` events).

### Sprint 6: End-to-End Testing, Packaging & Release
- [ ] Automated unit tests for text transposition and schedule checker.
- [ ] End-to-end testing in Chromium.
- [ ] Extension build script (`npm run build` / ZIP packaging).
- [ ] Walkthrough documentation with GIFs and screenshots.

---

## 7. Verification & Safety Guarantees

1. **Non-Destructive Sabotage**: All DOM manipulations are strictly client-side presentation transforms. No server requests, comments, or account actions are submitted on behalf of the user.
2. **Whitelist Safeguard**: Educational / work domains or user-specified URLs can be whitelisted instantly via the popup toggle.
3. **Emergency Disarm**: Toggling the extension off in the popup immediately restores all DOM elements, removes CSS transforms, and reloads modified text nodes.
