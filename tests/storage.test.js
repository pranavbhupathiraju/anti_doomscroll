import test from "node:test";
import assert from "node:assert/strict";
import { storage } from "../src/common/storage.js";
import { HOSTILITY_LEVELS } from "../src/common/constants.js";

test("storage manager loads default config and merges partial updates", async () => {
  const config = await storage.getConfig();
  assert.equal(config.enabled, true);
  assert.equal(typeof config.workHours.start, "string");

  // Save update
  const updated = await storage.saveConfig({
    hostilityLevel: HOSTILITY_LEVELS.UNHINGED,
    workHours: { start: "08:00" }
  });

  assert.equal(updated.hostilityLevel, HOSTILITY_LEVELS.UNHINGED);
  assert.equal(updated.workHours.start, "08:00");
  assert.equal(updated.workHours.end, "17:00"); // preserved
});

test("grantGracePeriod correctly activates and expires grace window", async () => {
  await storage.grantGracePeriod(10); // 10 minutes
  const active = await storage.isGracePeriodActive();
  assert.equal(active, true);

  // Set past expiration
  await storage.saveConfig({ whitelistUntil: Date.now() - 5000 });
  const expired = await storage.isGracePeriodActive();
  assert.equal(expired, false);
});

test("stats increments work properly", async () => {
  const stats = await storage.incrementStat("videosShrunk", 2);
  assert.ok(stats.videosShrunk >= 2);
});
