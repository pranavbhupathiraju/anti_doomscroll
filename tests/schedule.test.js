import test from "node:test";
import assert from "node:assert/strict";
import {
  isWithinWorkHours,
  getMatchedDistractionSite,
  computeEffectiveHostility
} from "../src/background/scheduler.js";
import { HOSTILITY_LEVELS } from "../src/common/constants.js";

test("isWithinWorkHours correctly evaluates standard work day and time", () => {
  const schedule = {
    start: "09:00",
    end: "17:00",
    days: [1, 2, 3, 4, 5] // Monday through Friday
  };

  // Monday at 11:30 AM (in work hours)
  const mondayWork = new Date("2026-09-21T11:30:00");
  assert.equal(isWithinWorkHours(schedule, mondayWork), true);

  // Monday at 08:30 AM (before work hours)
  const mondayBefore = new Date("2026-09-21T08:30:00");
  assert.equal(isWithinWorkHours(schedule, mondayBefore), false);

  // Monday at 17:30 PM (after work hours)
  const mondayAfter = new Date("2026-09-21T17:30:00");
  assert.equal(isWithinWorkHours(schedule, mondayAfter), false);

  // Sunday at 14:00 PM (weekend)
  const sunday = new Date("2026-09-20T14:00:00");
  assert.equal(isWithinWorkHours(schedule, sunday), false);
});

test("getMatchedDistractionSite detects targeted domains correctly", () => {
  const targets = { youtube: true, reddit: true, twitter: false };

  assert.equal(getMatchedDistractionSite("https://www.youtube.com/watch?v=123", targets), "youtube");
  assert.equal(getMatchedDistractionSite("https://youtu.be/123", targets), "youtube");
  assert.equal(getMatchedDistractionSite("https://www.reddit.com/r/all", targets), "reddit");
  assert.equal(getMatchedDistractionSite("https://x.com/home", targets), null); // twitter disabled
  assert.equal(getMatchedDistractionSite("https://github.com", targets), null);
});

test("computeEffectiveHostility handles auto-escalation based on dwell time", () => {
  // Monday at 10:00 AM (during work hours)
  const now = new Date("2026-09-21T10:00:00").getTime();
  
  const config = {
    enabled: true,
    autoEscalate: true,
    hostilityLevel: HOSTILITY_LEVELS.CONFUSION,
    workHours: { start: "00:00", end: "23:59", days: [0, 1, 2, 3, 4, 5, 6] },
    whitelistUntil: 0
  };

  // 0s dwell: base level (CONFUSION)
  assert.equal(computeEffectiveHostility(config, 0), HOSTILITY_LEVELS.CONFUSION);

  // 90s dwell: escalates to ELIZABETHAN
  assert.equal(computeEffectiveHostility(config, 90), HOSTILITY_LEVELS.ELIZABETHAN);

  // 200s dwell: escalates to DEGRADATION
  assert.equal(computeEffectiveHostility(config, 200), HOSTILITY_LEVELS.DEGRADATION);

  // 400s dwell: escalates to UNHINGED
  assert.equal(computeEffectiveHostility(config, 400), HOSTILITY_LEVELS.UNHINGED);

  // When disabled, returns PASSIVE
  assert.equal(computeEffectiveHostility({ ...config, enabled: false }, 400), HOSTILITY_LEVELS.PASSIVE);
});
