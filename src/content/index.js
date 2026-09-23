/**
 * AntiDoomscroll Content Script Entrypoint
 * Coordinates real-time DOM interception and executes progressive sabotage.
 */

import { HOSTILITY_LEVELS, MESSAGE_TYPES } from "../common/constants.js";
import { shakespeareRewriter } from "./sabotage/shakespeare_nlp.js";
import { videoShrinker } from "./sabotage/video_shrinker.js";
import { chaosEngine } from "./sabotage/chaos_engine.js";
import { nagOverlay } from "./sabotage/nag_overlay.js";

let currentHostility = HOSTILITY_LEVELS.PASSIVE;
let mutationObserver = null;
let debounceTimer = null;

/**
 * Executes DOM transformations according to the current hostility level.
 */
function applySabotage(hostilityLevel, config) {
  currentHostility = hostilityLevel;

  // Level 1: Mild Confusion (Scramble clickbait titles)
  if (hostilityLevel >= HOSTILITY_LEVELS.CONFUSION) {
    shakespeareRewriter.rewriteContainer(document.body, false);
  }

  // Level 2: The Elizabethan Curse (Rewrite comments into Shakespeare)
  if (hostilityLevel >= HOSTILITY_LEVELS.ELIZABETHAN) {
    shakespeareRewriter.rewriteContainer(document.body, false);
    startMutationWatcher();
  }

  // Level 3: Physical Degradation (Shrink video player & mute)
  if (hostilityLevel >= HOSTILITY_LEVELS.DEGRADATION) {
    const intervalSecs = config?.videoShrinkIntervalSeconds || 5;
    videoShrinker.start(intervalSecs);
    chaosEngine.corruptThumbnails();
  }

  // Level 4: Completely Unhinged (Page tilt, button evasion, nag alerts)
  if (hostilityLevel >= HOSTILITY_LEVELS.UNHINGED) {
    chaosEngine.startOpticalTilt();
    chaosEngine.enableButtonEvasion();
    nagOverlay.showRandomNag();
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
