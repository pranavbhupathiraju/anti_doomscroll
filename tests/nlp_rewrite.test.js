import test from "node:test";
import assert from "node:assert/strict";
import {
  transformToShakespeare,
  scrambleTitle,
  scrambleCorporateHeadline,
  SLANG_TRANSLATIONS
} from "../src/common/dictionary.js";

test("transformToShakespeare converts modern slang into Elizabethan equivalents", () => {
  const input = "bro this video is mid no cap";
  const output = transformToShakespeare(input);

  assert.match(output, /gentle sir/i);
  assert.match(output, /woefully pedestrian/i);
  assert.match(output, /upon my sacred honour/i);
});

test("transformToShakespeare converts corporate LinkedIn jargon into archaic vanity laments", () => {
  const input = "I am excited to announce my new position! Truly humbled and honored to leverage our synergy.";
  const output = transformToShakespeare(input);

  assert.match(output, /overcome with boastful vanity/i);
  assert.match(output, /servitude under a harsher overseer/i);
  assert.match(output, /unholy collusion of coin-counters/i);
});

test("transformToShakespeare correctly handles archaic pronouns and verbs", () => {
  const input = "you are wasting your time because you have no discipline";
  const output = transformToShakespeare(input);

  assert.match(output, /thou art/i);
  assert.match(output, /thy time/i);
  assert.match(output, /thou hast/i);
});

test("scrambleTitle produces anti-climactic replacements", () => {
  const title = "I Spent $1,000,000 On A Secret Mystery Box!";
  const scrambled = scrambleTitle(title);

  assert.ok(scrambled.length > 0);
  assert.notEqual(scrambled, title);
});

test("scrambleCorporateHeadline transforms pretentious corporate titles into medieval satire", () => {
  const headline = "Founder & CEO | 10x Growth Hacker | Ex-Meta";
  const scrambled = scrambleCorporateHeadline(headline);

  assert.ok(scrambled.length > 0);
  assert.notEqual(scrambled, headline);
});

test("all dictionary slang mappings have non-empty replacements", () => {
  for (const [slang, replacement] of Object.entries(SLANG_TRANSLATIONS)) {
    assert.ok(slang.length > 0);
    assert.ok(replacement.length > 0);
  }
});
