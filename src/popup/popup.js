/**
 * AntiDoomscroll Popup Controller
 * Manages UI interactions, setting persistence, and live telemetry.
 */

import {
  HOSTILITY_LABELS,
  HOSTILITY_LEVELS,
  MESSAGE_TYPES
} from "../common/constants.js";
import { storage } from "../common/storage.js";
import { isWithinWorkHours } from "../background/scheduler.js";

const DESCRIPTIONS = {
  [HOSTILITY_LEVELS.PASSIVE]: "Standby mode. No interference with browsing. Enjoy your temporary peace.",
  [HOSTILITY_LEVELS.CONFUSION]: "Clickbait titles are subtly scrambled, and dramatic videos are replaced with anti-climactic summaries.",
  [HOSTILITY_LEVELS.ELIZABETHAN]: "Comments and discussions are rewritten in real-time into 16th-century Shakespearean laments and mock despair.",
  [HOSTILITY_LEVELS.DEGRADATION]: "Video player shrinks by 1% every 5 seconds until it becomes a 10px dot. Audio fades imperceptibly.",
  [HOSTILITY_LEVELS.UNHINGED]: "Total sabotage. Page tilts by 0.5 degrees, buttons run away from cursor, and passive-aggressive nag screens interrupt scrolling."
};

// DOM Elements
const masterToggle = document.getElementById("masterToggle");
const statusBadge = document.getElementById("statusBadge");
const statusText = document.getElementById("statusText");
const hostilitySlider = document.getElementById("hostilitySlider");
const hostilityLabel = document.getElementById("hostilityLabel");
const hostilityDescription = document.getElementById("hostilityDescription");
const autoEscalateToggle = document.getElementById("autoEscalateToggle");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const daysContainer = document.getElementById("daysSelector");
const workHourStatus = document.getElementById("workHourStatus");
const targetYouTube = document.getElementById("targetYouTube");
const targetReddit = document.getElementById("targetReddit");
const targetTwitter = document.getElementById("targetTwitter");
const statComments = document.getElementById("statComments");
const statVideos = document.getElementById("statVideos");
const statTabsClosed = document.getElementById("statTabsClosed");
const graceBtn = document.getElementById("graceBtn");
const graceNotice = document.getElementById("graceNotice");
const graceCountdown = document.getElementById("graceCountdown");

let currentConfig = null;
let graceTimerInterval = null;

/**
 * Updates UI to reflect current hostility level.
 */
function updateHostilityDisplay(level) {
  hostilityLabel.textContent = HOSTILITY_LABELS[level] || `Level ${level}`;
  hostilityDescription.textContent = DESCRIPTIONS[level] || "";
}

/**
 * Checks schedule and sets the "ON DUTY" / "OFF DUTY" pill.
 */
function updateScheduleBadge(workHours) {
  const isWorking = isWithinWorkHours(workHours);
  if (isWorking) {
    workHourStatus.textContent = "ON DUTY";
    workHourStatus.style.color = "var(--cyan)";
  } else {
    workHourStatus.textContent = "OFF DUTY";
    workHourStatus.style.color = "var(--text-dim)";
  }
}

/**
 * Updates active status badge in header.
 */
function updateHeaderBadge(enabled, isGrace) {
  if (!enabled) {
    statusBadge.className = "status-badge passive";
    statusText.textContent = "DISABLED";
  } else if (isGrace) {
    statusBadge.className = "status-badge passive";
    statusText.textContent = "MERCY ACTIVE";
  } else {
    statusBadge.className = "status-badge active";
    statusText.textContent = "ACTIVE";
  }
}

/**
 * Starts or updates grace period countdown timer.
 */
function checkGracePeriod(whitelistUntil) {
  clearInterval(graceTimerInterval);

  const now = Date.now();
  if (whitelistUntil && whitelistUntil > now) {
    graceNotice.classList.remove("hidden");
    graceBtn.disabled = true;
    graceBtn.textContent = "🏳️ Mercy Granted";

    const updateTimer = () => {
      const remainingMs = whitelistUntil - Date.now();
      if (remainingMs <= 0) {
        clearInterval(graceTimerInterval);
        graceNotice.classList.add("hidden");
        graceBtn.disabled = false;
        graceBtn.textContent = "🏳️ Beg For Mercy (15m Grace Period)";
        updateHeaderBadge(currentConfig.enabled, false);
        return;
      }
      const totalSecs = Math.floor(remainingMs / 1000);
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      graceCountdown.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    updateTimer();
    graceTimerInterval = setInterval(updateTimer, 1000);
  } else {
    graceNotice.classList.add("hidden");
    graceBtn.disabled = false;
    graceBtn.textContent = "🏳️ Beg For Mercy (15m Grace Period)";
  }
}

/**
 * Loads current settings and stats from storage.
 */
async function loadState() {
  currentConfig = await storage.getConfig();
  const stats = await storage.getStats();
  const isGrace = (currentConfig.whitelistUntil || 0) > Date.now();

  // Populate UI
  masterToggle.checked = currentConfig.enabled;
  hostilitySlider.value = currentConfig.hostilityLevel;
  autoEscalateToggle.checked = currentConfig.autoEscalate;
  startTimeInput.value = currentConfig.workHours.start;
  endTimeInput.value = currentConfig.workHours.end;

  targetYouTube.checked = !!currentConfig.targetSites.youtube;
  targetReddit.checked = !!currentConfig.targetSites.reddit;
  targetTwitter.checked = !!currentConfig.targetSites.twitter;

  // Day buttons
  const activeDays = currentConfig.workHours.days || [];
  daysContainer.querySelectorAll(".day-btn").forEach((btn) => {
    const day = parseInt(btn.dataset.day, 10);
    btn.classList.toggle("active", activeDays.includes(day));
  });

  // Display stats
  statComments.textContent = stats.commentsSabotaged || 0;
  statVideos.textContent = stats.videosShrunk || 0;
  statTabsClosed.textContent = stats.tabsClosedInDisgust || 0;

  updateHostilityDisplay(currentConfig.hostilityLevel);
  updateScheduleBadge(currentConfig.workHours);
  updateHeaderBadge(currentConfig.enabled, isGrace);
  checkGracePeriod(currentConfig.whitelistUntil);
}

/**
 * Saves modified settings and notifies background worker.
 */
async function saveChanges() {
  const activeDays = [];
  daysContainer.querySelectorAll(".day-btn.active").forEach((btn) => {
    activeDays.push(parseInt(btn.dataset.day, 10));
  });

  const updates = {
    enabled: masterToggle.checked,
    hostilityLevel: parseInt(hostilitySlider.value, 10),
    autoEscalate: autoEscalateToggle.checked,
    workHours: {
      start: startTimeInput.value,
      end: endTimeInput.value,
      days: activeDays
    },
    targetSites: {
      youtube: targetYouTube.checked,
      reddit: targetReddit.checked,
      twitter: targetTwitter.checked
    }
  };

  currentConfig = await storage.saveConfig(updates);
  const isGrace = (currentConfig.whitelistUntil || 0) > Date.now();

  updateScheduleBadge(currentConfig.workHours);
  updateHeaderBadge(currentConfig.enabled, isGrace);

  // Notify background service worker
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SETTINGS_CHANGED });
  }
}

// Event Listeners
masterToggle.addEventListener("change", saveChanges);

hostilitySlider.addEventListener("input", (e) => {
  const val = parseInt(e.target.value, 10);
  updateHostilityDisplay(val);
});
hostilitySlider.addEventListener("change", saveChanges);

autoEscalateToggle.addEventListener("change", saveChanges);
startTimeInput.addEventListener("change", saveChanges);
endTimeInput.addEventListener("change", saveChanges);

targetYouTube.addEventListener("change", saveChanges);
targetReddit.addEventListener("change", saveChanges);
targetTwitter.addEventListener("change", saveChanges);

daysContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".day-btn");
  if (!btn) return;
  btn.classList.toggle("active");
  saveChanges();
});

graceBtn.addEventListener("click", async () => {
  await storage.grantGracePeriod(15);
  await loadState();
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SETTINGS_CHANGED });
  }
});

// Initialize on open
document.addEventListener("DOMContentLoaded", loadState);
