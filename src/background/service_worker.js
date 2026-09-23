/**
 * AntiDoomscroll Background Service Worker (Manifest V3)
 * Monitors active tabs, enforces work-hour schedules, and coordinates sabotage.
 */

import {
  DEFAULT_CONFIG,
  HOSTILITY_LEVELS,
  MESSAGE_TYPES
} from "../common/constants.js";
import { storage } from "../common/storage.js";
import {
  computeEffectiveHostility,
  getMatchedDistractionSite,
  isWithinWorkHours
} from "./scheduler.js";

// Active tab tracking state
const tabDwellTracker = new Map(); // tabId -> { url, site, startTimestamp }

let creatingOffscreenPromise = null;

/**
 * Ensures the offscreen document exists for image analysis.
 */
async function setupOffscreenDocument() {
  if (await hasOffscreenDocument()) return;

  if (creatingOffscreenPromise) {
    await creatingOffscreenPromise;
  } else {
    creatingOffscreenPromise = chrome.offscreen.createDocument({
      url: "src/offscreen/offscreen.html",
      reasons: ["BLOBS", "LOCAL_STORAGE"],
      justification: "Analyze tab screenshots using local vision heuristics"
    });
    await creatingOffscreenPromise;
    creatingOffscreenPromise = null;
  }
}

async function hasOffscreenDocument() {
  const matchedClients = await clients.matchAll();
  return matchedClients.some((c) => c.url.includes("offscreen.html"));
}

/**
 * Captures the visible tab and asks the offscreen document to classify it.
 */
async function inspectTabVision(tabId, visionConfig) {
  try {
    await setupOffscreenDocument();
    const dataUri = await chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 40 });
    
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          type: MESSAGE_TYPES.ANALYZE_IMAGE,
          dataUri,
          visionConfig
        },
        (response) => {
          if (chrome.runtime.lastError || !response) {
            resolve({ isProcrastination: true });
          } else {
            resolve(response);
          }
        }
      );
    });
  } catch (err) {
    // Tab capture may fail if window minimized or permission restricted
    return { isProcrastination: true };
  }
}

/**
 * Broadcasts a message to all tabs matching target sites or a specific tab.
 */
async function sendTabMessage(tabId, message) {
  try {
    await chrome.tabs.sendMessage(tabId, message);
  } catch (err) {
    // Content script might not be injected yet or tab closed
  }
}

/**
 * Evaluates the status of a specific tab and dispatches sabotage commands if needed.
 */
async function evaluateTab(tabId, url) {
  if (!url) return;

  const config = await storage.getConfig();
  const matchedSite = getMatchedDistractionSite(url, config.targetSites);

  if (!matchedSite) {
    tabDwellTracker.delete(tabId);
    return;
  }

  // Record or update dwell time
  let tracking = tabDwellTracker.get(tabId);
  const now = Date.now();
  if (!tracking || tracking.site !== matchedSite) {
    tracking = { url, site: matchedSite, startTimestamp: now };
    tabDwellTracker.set(tabId, tracking);
  }

  const dwellSeconds = Math.floor((now - tracking.startTimestamp) / 1000);
  let effectiveHostility = computeEffectiveHostility(config, dwellSeconds);

  // If vision analysis is enabled and tab is active, analyze frame
  if (effectiveHostility > HOSTILITY_LEVELS.PASSIVE && config.vision?.enabled && dwellSeconds > 10) {
    const visionVerdict = await inspectTabVision(tabId, config.vision);
    if (!visionVerdict.isProcrastination) {
      // Vision model determined this is productive (e.g. coding tutorial or documentation)
      effectiveHostility = HOSTILITY_LEVELS.PASSIVE;
    }
  }

  if (effectiveHostility > HOSTILITY_LEVELS.PASSIVE) {
    // Send sabotage command to content script
    sendTabMessage(tabId, {
      type: MESSAGE_TYPES.TRIGGER_SABOTAGE,
      hostilityLevel: effectiveHostility,
      site: matchedSite,
      dwellSeconds,
      config
    });

    // Update extension badge to reflect hostility
    chrome.action.setBadgeText({
      tabId,
      text: `L${effectiveHostility}`
    });
    chrome.action.setBadgeBackgroundColor({
      tabId,
      color: effectiveHostility >= HOSTILITY_LEVELS.DEGRADATION ? "#ff0033" : "#ff9900"
    });
  } else {
    // In passive mode or outside work hours, restore normal DOM
    sendTabMessage(tabId, {
      type: MESSAGE_TYPES.RESTORE_DOM
    });
    chrome.action.setBadgeText({ tabId, text: "" });
  }
}

/**
 * Periodic tick alarm to re-evaluate active tabs and escalate sabotage
 */
chrome.alarms.create("anti_doomscroll_tick", { periodInMinutes: 0.1 }); // ~6 seconds

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "anti_doomscroll_tick") return;

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].id) {
      await evaluateTab(tabs[0].id, tabs[0].url);
    }
  } catch (err) {
    console.error("[AntiDoomscroll] Alarm tick error:", err);
  }
});

// Tab navigation listeners
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    evaluateTab(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url) {
      await evaluateTab(activeInfo.tabId, tab.url);
    }
  } catch (err) {
    // Tab might have closed
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  // If a user closes a tab that was being sabotaged, increment victory stats!
  if (tabDwellTracker.has(tabId)) {
    storage.incrementStat("tabsClosedInDisgust", 1);
    tabDwellTracker.delete(tabId);
  }
});

// Runtime message listener for popup & content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case MESSAGE_TYPES.CHECK_STATUS: {
        const config = await storage.getConfig();
        const stats = await storage.getStats();
        const isGrace = await storage.isGracePeriodActive();
        const inWorkHours = isWithinWorkHours(config.workHours);
        
        sendResponse({
          config,
          stats,
          isGrace,
          inWorkHours,
          activeTrackedTabs: tabDwellTracker.size
        });
        break;
      }

      case MESSAGE_TYPES.SETTINGS_CHANGED: {
        // Re-evaluate all active tabs immediately
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        for (const tab of tabs) {
          if (tab.id && tab.url) {
            await evaluateTab(tab.id, tab.url);
          }
        }
        sendResponse({ success: true });
        break;
      }

      case MESSAGE_TYPES.PING: {
        sendResponse({ pong: true });
        break;
      }

      default:
        sendResponse({ error: "Unknown message type" });
    }
  })();

  return true; // Keep message channel open for async response
});

console.log("[AntiDoomscroll] Background Service Worker successfully initialized.");
