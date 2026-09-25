/**
 * AntiDoomscroll Constants & Configuration Schema
 */

export const HOSTILITY_LEVELS = {
  PASSIVE: 0,
  CONFUSION: 1,
  ELIZABETHAN: 2,
  DEGRADATION: 3,
  UNHINGED: 4
};

export const HOSTILITY_LABELS = {
  [HOSTILITY_LEVELS.PASSIVE]: "Passive (Standby)",
  [HOSTILITY_LEVELS.CONFUSION]: "Level 1: Mild Confusion",
  [HOSTILITY_LEVELS.ELIZABETHAN]: "Level 2: The Elizabethan Curse",
  [HOSTILITY_LEVELS.DEGRADATION]: "Level 3: Physical Degradation",
  [HOSTILITY_LEVELS.UNHINGED]: "Level 4: Completely Unhinged"
};

export const MESSAGE_TYPES = {
  CHECK_STATUS: "CHECK_STATUS",
  STATUS_UPDATE: "STATUS_UPDATE",
  TRIGGER_SABOTAGE: "TRIGGER_SABOTAGE",
  RESTORE_DOM: "RESTORE_DOM",
  CAPTURE_TAB: "CAPTURE_TAB",
  ANALYZE_IMAGE: "ANALYZE_IMAGE",
  SETTINGS_CHANGED: "SETTINGS_CHANGED",
  PING: "PING"
};

export const STORAGE_KEYS = {
  CONFIG: "anti_doomscroll_config",
  SESSION_STATS: "anti_doomscroll_stats"
};

export const DEFAULT_CONFIG = {
  enabled: true,
  forceHostile: false, // Bypass work-hours schedule for immediate testing
  hostilityLevel: HOSTILITY_LEVELS.ELIZABETHAN,
  autoEscalate: true, // escalates hostility if browsing persists
  workHours: {
    start: "09:00",
    end: "17:00",
    days: [1, 2, 3, 4, 5] // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
  },
  targetSites: {
    youtube: true,
    reddit: true,
    twitter: false,
    linkedin: true
  },
  sabotageFeatures: {
    videoShrink: true,
    shakespeareRewrite: true,
    titleScramble: true,
    opticalTilt: true,
    buttonEvade: true,
    nagOverlays: true
  },
  videoShrinkIntervalSeconds: 5,
  vision: {
    enabled: true,
    mode: "hybrid", // "heuristic" | "webgpu" | "sidecar"
    sidecarUrl: "http://localhost:11434",
    modelName: "moondream"
  },
  whitelistUntil: 0 // Epoch ms if temporary grace period is active
};
