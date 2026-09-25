/**
 * AntiDoomscroll Content Script Entrypoint
 * Coordinates real-time DOM interception and executes progressive sabotage.
 */

import { HOSTILITY_LEVELS, MESSAGE_TYPES } from "../common/constants.js";
import { shakespeareRewriter } from "./sabotage/shakespeare_nlp.js";
import { videoShrinker } from "./sabotage/video_shrinker.js";
import { chaosEngine } from "./sabotage/chaos_engine.js";
import { nagOverlay } from "./sabotage/nag_overlay.js";
import { YouTubeAdaptor } from "./adaptors/youtube.js";
import { RedditAdaptor } from "./adaptors/reddit.js";
import { LinkedInAdaptor } from "./adaptors/linkedin.js";

// Select site adaptor
let currentAdaptor = null;
const host = window.location.hostname;
if (host.includes("youtube.com") || host.includes("youtu.be")) {
  currentAdaptor = new YouTubeAdaptor();
} else if (host.includes("reddit.com")) {
  currentAdaptor = new RedditAdaptor();
} else if (host.includes("linkedin.com")) {
  currentAdaptor = new LinkedInAdaptor();
}

let currentHostility = HOSTILITY_LEVELS.PASSIVE;
let mutationObserver = null;
let debounceTimer = null;

/**
 * Displays a sleek temporary HUD indicator when sabotage activates.
 */
function showActivationHUD(level) {
  if (document.getElementById("anti-doomscroll-hud")) return;
  const hud = document.createElement("div");
  hud.id = "anti-doomscroll-hud";
  hud.className = "anti-doomscroll-ui";
  hud.innerHTML = `⚔️ <span style="color:#ff2d55;font-weight:bold;">ANTIDOOMSCROLL</span>: Level ${level} Active`;
  Object.assign(hud.style, {
    position: "fixed",
    top: "16px",
    right: "16px",
    zIndex: "2147483647",
    background: "#0c0f1c",
    color: "#00f0ff",
    border: "1px solid #ff2d55",
    borderRadius: "8px",
    padding: "8px 14px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', monospace",
    fontSize: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.8), 0 0 15px rgba(255, 45, 85, 0.4)",
    pointerEvents: "none",
    transition: "opacity 0.6s ease, transform 0.6s ease",
    opacity: "1",
    transform: "translateY(0)"
  });
  document.body.appendChild(hud);
  setTimeout(() => {
    hud.style.opacity = "0";
    hud.style.transform = "translateY(-15px)";
    setTimeout(() => hud.remove(), 600);
  }, 3500);
}

/**
 * Executes DOM transformations according to the current hostility level.
 */
function applySabotage(hostilityLevel, config) {
  currentHostility = hostilityLevel;
  showActivationHUD(hostilityLevel);

  // Level 1: Mild Confusion (Scramble clickbait titles / corporate headlines)
  if (hostilityLevel >= HOSTILITY_LEVELS.CONFUSION) {
    shakespeareRewriter.rewriteContainer(document.body, false);
    if (currentAdaptor?.siteName === "linkedin") {
      currentAdaptor.sabotageHeadlines();
    }
  }

  // Level 2: The Elizabethan Curse (Rewrite comments into Shakespeare)
  if (hostilityLevel >= HOSTILITY_LEVELS.ELIZABETHAN) {
    shakespeareRewriter.rewriteContainer(document.body, false);
    if (currentAdaptor?.siteName === "linkedin") {
      currentAdaptor.sabotageHeadlines();
    }
    startMutationWatcher();
  }

  // Level 3: Physical Degradation (Shrink video player & mute)
  if (hostilityLevel >= HOSTILITY_LEVELS.DEGRADATION) {
    const intervalSecs = config?.videoShrinkIntervalSeconds || 5;
    videoShrinker.start(intervalSecs);
    chaosEngine.corruptThumbnails();

    // Check specific adaptors
    if (currentAdaptor?.siteName === "youtube") {
      currentAdaptor.sabotageShortsReel();
    }
  }

  // Level 4: Completely Unhinged (Page tilt, button evasion, nag alerts)
  if (hostilityLevel >= HOSTILITY_LEVELS.UNHINGED) {
    chaosEngine.startOpticalTilt();
    chaosEngine.enableButtonEvasion();
    nagOverlay.showRandomNag();
  }
}

// Hook SPA navigation
if (currentAdaptor) {
  currentAdaptor.onPageChange(() => {
    if (currentHostility >= HOSTILITY_LEVELS.CONFUSION) {
      setTimeout(() => {
        applySabotage(currentHostility, null);
      }, 500);
    }
  });

  if (currentAdaptor.siteName === "reddit" || currentAdaptor.siteName === "linkedin") {
    window.addEventListener("scroll", () => {
      if (currentHostility >= HOSTILITY_LEVELS.DEGRADATION) {
        currentAdaptor.checkInfiniteScrollDoom();
      }
    }, { passive: true });
  }
}

/**
 * Restores the webpage to its peaceful, original DOM state.
 */
function restorePeacefulState() {
  currentHostility = HOSTILITY_LEVELS.PASSIVE;

  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }

  shakespeareRewriter.restore();
  videoShrinker.restore();
  chaosEngine.restore();
  nagOverlay.restore();

  console.log("[AntiDoomscroll] Restored peaceful DOM state.");
}

/**
 * Watches for dynamically loaded feed items and comments (infinite scroll).
 */
function startMutationWatcher() {
  if (mutationObserver) return;

  mutationObserver = new MutationObserver((mutations) => {
    if (currentHostility < HOSTILITY_LEVELS.ELIZABETHAN) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              shakespeareRewriter.rewriteContainer(node, false);
            }
          });
        }
      }
    }, 250);
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Background command listener
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case MESSAGE_TYPES.TRIGGER_SABOTAGE:
        applySabotage(message.hostilityLevel, message.config);
        sendResponse({
          success: true,
          sabotagedCount: shakespeareRewriter.getSabotagedCount(),
          scale: videoShrinker.getScale()
        });
        break;

      case MESSAGE_TYPES.RESTORE_DOM:
        restorePeacefulState();
        sendResponse({ success: true });
        break;

      default:
        break;
    }
    return true;
  });
}

console.log("[AntiDoomscroll] Sabotage agent armed and awaiting orders.");

// Request immediate check from background worker on load
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
  try {
    chrome.runtime.sendMessage({
      type: "TAB_READY",
      url: window.location.href
    });
  } catch (err) {
    // Context may be invalidated if extension reloaded
  }
}
