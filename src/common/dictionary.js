/**
 * AntiDoomscroll Elizabethan / Shakespearean Dictionary & Linguistic Rules
 * Transforms modern internet discourse and comments into dramatic 16th-century prose.
 */

export const SLANG_TRANSLATIONS = {
  "bro": "gentle sir",
  "bruh": "alas, poor knave",
  "dude": "fellow traveller",
  "guy": "peasant",
  "guys": "countrymen",
  "man": "mortal soul",
  "omg": "by the heavens above",
  "god": "the Almighty",
  "lol": "[chortles in bitter despair]",
  "lmao": "[cackles in theatrical anguish]",
  "lmfao": "[collapses upon the floor weeping with mirth]",
  "rofl": "[writheth upon the earth in madness]",
  "cringe": "grievous folly",
  "cap": "brazen falsehood",
  "no cap": "upon my sacred honour",
  "fr": "in solemn verity",
  "fr fr": "by my father's grave, 'tis true",
  "fake": "counterfeit guise",
  "real": "unblemished truth",
  "fire": "a blaze of heavenly wonder",
  "lit": "radiant as the morning sun",
  "mid": "woefully pedestrian",
  "trash": "vile offal",
  "based": "noble and steadfast",
  "sus": "of treacherous intent",
  "ratio": "the assembly condemneth thee",
  "rizz": "witchery of courtly seduction",
  "simp": "besotted serf",
  "gigachad": "titan of unmatched valor",
  "sigma": "stoic hermit of the shadows",
  "npc": "hollow automaton devoid of mind",
  "vibe": "spiritual aura",
  "vibes": "celestial harmony",
  "insane": "afflicted with frantic distemper",
  "crazy": "touched by bedlam",
  "wtf": "what witchcraft is this",
  "idk": "the gods have concealed it from me",
  "imo": "in mine humble reckoning",
  "imho": "by mine unworthy judgement",
  "tbh": "to speak with naked candour",
  "pls": "I beseech thee",
  "please": "I implore thy grace",
  "thanks": "thou hast mine unending gratitude",
  "thank you": "a thousand benedictions upon thee",
  "bye": "fare thee well unto eternity",
  "hate": "abhor with venomous wrath",
  "love": "cherish with ardent zeal",
  "bad": "ill-favoured",
  "good": "exceeding fair",
  "great": "matchless in splendour",
  "best": "peerless among mortals",
  "worst": "foulest under the firmament",
  "stop": "desist, foul tormentor",
  "why": "wherefore dost thou",
  "video": "moving tapestry",
  "channel": "theatrical guild",
  "subscribe": "pledge fealty",
  "like": "bestow thy noble favor",
  "comment": "inscribe thy parchment",
  "views": "gazing multitudes",
  "post": "affixed broadside",
  "upvote": "raise thy standard",
  "downvote": "cast into outer darkness"
};

export const ARCHAIC_GRAMMAR_RULES = [
  // Pronouns & Verb Agreements
  { pattern: /\byou are\b/gi, replacement: "thou art" },
  { pattern: /\byou're\b/gi, replacement: "thou art" },
  { pattern: /\byou were\b/gi, replacement: "thou wert" },
  { pattern: /\byou will\b/gi, replacement: "thou shalt" },
  { pattern: /\byou have\b/gi, replacement: "thou hast" },
  { pattern: /\byou do\b/gi, replacement: "thou dost" },
  { pattern: /\byou can\b/gi, replacement: "thou canst" },
  { pattern: /\byour\b/gi, replacement: "thy" },
  { pattern: /\byours\b/gi, replacement: "thine" },
  { pattern: /\byourself\b/gi, replacement: "thyself" },
  { pattern: /\byou\b/gi, replacement: "thee" },

  // Auxiliary Verbs
  { pattern: /\bdoes\b/gi, replacement: "doth" },
  { pattern: /\bhas\b/gi, replacement: "hath" },
  { pattern: /\bis\b/gi, replacement: "is, in sooth," },
  { pattern: /\bwas\b/gi, replacement: "was, as fate decreed," },
  { pattern: /\bbefore\b/gi, replacement: "ere" },
  { pattern: /\boften\b/gi, replacement: "oft" },
  { pattern: /\bperhaps\b/gi, replacement: "perchance" },
  { pattern: /\bmaybe\b/gi, replacement: "haply" },
  { pattern: /\balways\b/gi, replacement: "evermore" },
  { pattern: /\bnever\b/gi, replacement: "ne'er" },
  { pattern: /\bhere\b/gi, replacement: "hither" },
  { pattern: /\bthere\b/gi, replacement: "thither" },
  { pattern: /\bwhere\b/gi, replacement: "whither" },
  { pattern: /\bwhy\b/gi, replacement: "wherefore" }
];

export const DRAMATIC_PREFIXES = [
  "Hark! ",
  "Alas! ",
  "Verily, ",
  "By heaven, ",
  "O cruel fortune! ",
  "Hearken, good sirs: ",
  "Woe betide us, for ",
  "Behold: "
];

export const DRAMATIC_SOLILOQUIES = [
  "To scroll, or not to scroll: that is the question: Whether 'tis nobler in the mind to finish one's labours, or to plunge into this sea of trivialities...",
  "Life's but a walking shadow, a poor player that struts and frets his hour upon this feed, and then is heard no more.",
  "What a piece of work is man! How noble in reason, how infinite in faculty... and yet here he sits, squandering daylight upon meaningless moving pictures.",
  "Tomorrow, and tomorrow, and tomorrow, creeps in this petty pace from clip to clip, to the last syllable of recorded time.",
  "All the world's a stage, and all the men and women merely lurkers; they have their exits and their entrances, and one man in his time closes many tabs."
];

/**
 * Transforms standard text into a 16th-century Shakespearean variant.
 * @param {string} text
 * @returns {string}
 */
export function transformToShakespeare(text) {
  if (!text || text.trim().length === 0) return text;

  let transformed = text;

  // 1. Replace multi-word internet idioms first, then single words
  const sortedSlang = Object.keys(SLANG_TRANSLATIONS).sort((a, b) => b.length - a.length);
  for (const slang of sortedSlang) {
    const replacement = SLANG_TRANSLATIONS[slang];
    const regex = new RegExp(`\\b${slang}\\b`, "gi");
    transformed = transformed.replace(regex, replacement);
  }

  // 2. Apply archaic grammar rules
  for (const { pattern, replacement } of ARCHAIC_GRAMMAR_RULES) {
    transformed = transformed.replace(pattern, replacement);
  }

  // 3. Occasionally prepend a dramatic Elizabethan prefix if long enough
  if (transformed.length > 25 && !transformed.startsWith("Hark") && !transformed.startsWith("Alas")) {
    const hash = transformed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    if (hash % 3 === 0) {
      const prefix = DRAMATIC_PREFIXES[hash % DRAMATIC_PREFIXES.length];
      transformed = prefix + transformed.charAt(0).toLowerCase() + transformed.slice(1);
    }
  }

  // Capitalize first letter
  return transformed.charAt(0).toUpperCase() + transformed.slice(1);
}

/**
 * Converts sensational clickbait titles into anti-climactic truths.
 * @param {string} title
 * @returns {string}
 */
export function scrambleTitle(title) {
  if (!title || title.trim().length === 0) return title;

  const antiClimaxes = [
    "Nothing Actually Happened In This Video",
    "A Rather Mundane Occurrence Involving Minor Inconvenience",
    "Someone Paid Money For A Thing They Will Regret",
    "An Hour of Someone Yelling at Pixels",
    "Thou Art Wasting Precious Daylight Upon This Folly",
    "A Person Talks At Length About Things They Do Not Understand",
    "The Outcome Was Entirely Predictable and Mildly Tedious"
  ];

  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return antiClimaxes[hash % antiClimaxes.length];
}
