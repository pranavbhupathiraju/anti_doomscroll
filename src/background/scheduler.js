/**
 * AntiDoomscroll Scheduler & Work Hours Logic
 */

import { HOSTILITY_LEVELS } from "../common/constants.js";

/**
 * Checks if a given timestamp/date falls within the configured work hours.
 * @param {Object} workHours - { start: "09:00", end: "17:00", days: [1,2,3,4,5] }
 * @param {Date} [now=new Date()]
 * @returns {boolean}
 */
export function isWithinWorkHours(workHours, now = new Date()) {
  if (!workHours || !Array.isArray(workHours.days)) return false;

  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  if (!workHours.days.includes(currentDay)) {
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = (workHours.start || "09:00").split(":").map(Number);
  const [endHour, endMin] = (workHours.end || "17:00").split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
  // Overnight shift support (e.g. 22:00 to 06:00)
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

/**
 * Checks whether the current URL belongs to an actively monitored distraction site.
 * @param {string} url
 * @param {Object} targetSites - { youtube: boolean, reddit: boolean, twitter: boolean }
 * @returns {string|null} site key if targeted, null otherwise
 */
export function getMatchedDistractionSite(url, targetSites = {}) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (targetSites.youtube && (host.includes("youtube.com") || host.includes("youtu.be"))) {
      return "youtube";
    }
    if (targetSites.reddit && host.includes("reddit.com")) {
      return "reddit";
    }
    if (targetSites.twitter && (host.includes("twitter.com") || host.includes("x.com"))) {
      return "twitter";
    }
    if (targetSites.linkedin && host.includes("linkedin.com")) {
      return "linkedin";
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Determines current hostility level, with optional automatic escalation based on dwell time.
 * @param {Object} config
 * @param {number} dwellSeconds - number of seconds user has spent on the current tab
 * @returns {number} Level from 0 (PASSIVE) to 4 (UNHINGED)
 */
export function computeEffectiveHostility(config, dwellSeconds = 0) {
  if (!config.enabled) return HOSTILITY_LEVELS.PASSIVE;

  // Check if grace period is active
  if (config.whitelistUntil && config.whitelistUntil > Date.now()) {
    return HOSTILITY_LEVELS.PASSIVE;
  }

  // Check work hours
  if (!isWithinWorkHours(config.workHours)) {
    return HOSTILITY_LEVELS.PASSIVE;
  }

  const baseLevel = config.hostilityLevel ?? HOSTILITY_LEVELS.ELIZABETHAN;
  if (!config.autoEscalate) {
    return baseLevel;
  }

  // Auto-escalation thresholds
  if (dwellSeconds > 300) {
    return HOSTILITY_LEVELS.UNHINGED; // > 5 minutes
  } else if (dwellSeconds > 180) {
    return Math.max(baseLevel, HOSTILITY_LEVELS.DEGRADATION); // > 3 minutes
  } else if (dwellSeconds > 60) {
    return Math.max(baseLevel, HOSTILITY_LEVELS.ELIZABETHAN); // > 1 minute
  }

  return baseLevel;
}
