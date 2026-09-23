/**
 * AntiDoomscroll Storage Wrapper
 * Manages configuration and statistics persistence across sessions.
 */

import { DEFAULT_CONFIG, STORAGE_KEYS } from "./constants.js";

class StorageManager {
  constructor() {
    this.memoryStore = {};
  }

  get isChromeStorageAvailable() {
    return typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
  }

  async getConfig() {
    if (this.isChromeStorageAvailable) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEYS.CONFIG], (result) => {
          if (chrome.runtime.lastError || !result[STORAGE_KEYS.CONFIG]) {
            resolve({ ...DEFAULT_CONFIG });
          } else {
            resolve({ ...DEFAULT_CONFIG, ...result[STORAGE_KEYS.CONFIG] });
          }
        });
      });
    }
    return { ...DEFAULT_CONFIG, ...(this.memoryStore[STORAGE_KEYS.CONFIG] || {}) };
  }

  async saveConfig(updates) {
    const current = await this.getConfig();
    const updated = {
      ...current,
      ...updates,
      workHours: { ...current.workHours, ...(updates.workHours || {}) },
      targetSites: { ...current.targetSites, ...(updates.targetSites || {}) },
      sabotageFeatures: { ...current.sabotageFeatures, ...(updates.sabotageFeatures || {}) },
      vision: { ...current.vision, ...(updates.vision || {}) }
    };

    if (this.isChromeStorageAvailable) {
      await new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEYS.CONFIG]: updated }, resolve);
      });
    } else {
      this.memoryStore[STORAGE_KEYS.CONFIG] = updated;
    }
    return updated;
  }

  async resetConfig() {
    if (this.isChromeStorageAvailable) {
      await new Promise((resolve) => {
        chrome.storage.local.remove([STORAGE_KEYS.CONFIG], resolve);
      });
    } else {
      delete this.memoryStore[STORAGE_KEYS.CONFIG];
    }
    return { ...DEFAULT_CONFIG };
  }

  async grantGracePeriod(minutes = 15) {
    const until = Date.now() + minutes * 60 * 1000;
    return this.saveConfig({ whitelistUntil: until });
  }

  async isGracePeriodActive() {
    const config = await this.getConfig();
    return (config.whitelistUntil || 0) > Date.now();
  }

  async getStats() {
    const defaultStats = {
      commentsSabotaged: 0,
      videosShrunk: 0,
      tabsClosedInDisgust: 0,
      totalProcrastinationSeconds: 0
    };

    if (this.isChromeStorageAvailable) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEYS.SESSION_STATS], (result) => {
          resolve({ ...defaultStats, ...(result[STORAGE_KEYS.SESSION_STATS] || {}) });
        });
      });
    }
    return { ...defaultStats, ...(this.memoryStore[STORAGE_KEYS.SESSION_STATS] || {}) };
  }

  async incrementStat(key, amount = 1) {
    const stats = await this.getStats();
    stats[key] = (stats[key] || 0) + amount;

    if (this.isChromeStorageAvailable) {
      await new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEYS.SESSION_STATS]: stats }, resolve);
      });
    } else {
      this.memoryStore[STORAGE_KEYS.SESSION_STATS] = stats;
    }
    return stats;
  }
}

export const storage = new StorageManager();
