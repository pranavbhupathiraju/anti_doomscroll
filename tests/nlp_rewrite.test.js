import test from "node:test";
import assert from "node:assert/strict";
import {
  transformToShakespeare,
  scrambleTitle,
  SLANG_TRANSLATIONS
} from "../src/common/dictionary.js";

test("transformToShakespeare converts modern slang into Elizabethan equivalents", () => {
  const input = "bro this video is mid no cap";
  const output = transformToShakespeare(input);

  assert.match(output, /gentle sir/i);
  assert.match(output, /woefully pedestrian/i);
  assert.match(output, /upon my sacred honour/i);
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

test("all dictionary slang mappings have non-empty replacements", () => {
  for (const [slang, replacement] of Object.entries(SLANG_TRANSLATIONS)) {
    assert.ok(slang.length > 0);
    assert.ok(replacement.length > 0);
  }
});
