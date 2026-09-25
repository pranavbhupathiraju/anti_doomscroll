(() => {
  // src/common/constants.js
  var HOSTILITY_LEVELS = {
    PASSIVE: 0,
    CONFUSION: 1,
    ELIZABETHAN: 2,
    DEGRADATION: 3,
    UNHINGED: 4
  };
  var HOSTILITY_LABELS = {
    [HOSTILITY_LEVELS.PASSIVE]: "Passive (Standby)",
    [HOSTILITY_LEVELS.CONFUSION]: "Level 1: Mild Confusion",
    [HOSTILITY_LEVELS.ELIZABETHAN]: "Level 2: The Elizabethan Curse",
    [HOSTILITY_LEVELS.DEGRADATION]: "Level 3: Physical Degradation",
    [HOSTILITY_LEVELS.UNHINGED]: "Level 4: Completely Unhinged"
  };
  var MESSAGE_TYPES = {
    CHECK_STATUS: "CHECK_STATUS",
    STATUS_UPDATE: "STATUS_UPDATE",
    TRIGGER_SABOTAGE: "TRIGGER_SABOTAGE",
    RESTORE_DOM: "RESTORE_DOM",
    CAPTURE_TAB: "CAPTURE_TAB",
    ANALYZE_IMAGE: "ANALYZE_IMAGE",
    SETTINGS_CHANGED: "SETTINGS_CHANGED",
    PING: "PING"
  };
  var DEFAULT_CONFIG = {
    enabled: true,
    forceHostile: false,
    // Bypass work-hours schedule for immediate testing
    hostilityLevel: HOSTILITY_LEVELS.ELIZABETHAN,
    autoEscalate: true,
    // escalates hostility if browsing persists
    workHours: {
      start: "09:00",
      end: "17:00",
      days: [1, 2, 3, 4, 5]
      // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
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
      mode: "hybrid",
      // "heuristic" | "webgpu" | "sidecar"
      sidecarUrl: "http://localhost:11434",
      modelName: "moondream"
    },
    whitelistUntil: 0
    // Epoch ms if temporary grace period is active
  };

  // src/common/dictionary.js
  var SLANG_TRANSLATIONS = {
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
    "downvote": "cast into outer darkness",
    // Corporate & LinkedIn Cringe Translations
    "excited to announce": "overcome with boastful vanity to proclaim",
    "thrilled to announce": "afflicted with desperate pride to declare",
    "humbled to share": "feigning modesty whilst swollen with conceit to reveal",
    "humbled and honored": "bursting with unseemly pride under false piety",
    "i am humbled": "mine ego knoweth no bounds, yet I utter",
    "reach out": "dispatch a weary runner",
    "circle back": "renew this tedious torment",
    "touch base": "whisper in pointless assembly",
    "deep dive": "plunge into murky obfuscation",
    "thought leader": "herald of empty babble",
    "thought leadership": "high-sounding declarations of the obvious",
    "new position": "new servitude under a harsher overseer",
    "new role": "fresh yoke upon my bruised neck",
    "starting a new": "embarking upon fresh drudgery as a",
    "networking": "beseeching favours among sycophants",
    "network": "cabal of flatterers",
    "connect": "pledge mutual servitude",
    "connection": "fellow toiler in the corporate galleys",
    "synergy": "unholy collusion of coin-counters",
    "bandwidth": "mortal stamina for drudgery",
    "leverage": "exploit for earthly gain",
    "actionable": "tedious to perform",
    "takeaways": "crumbs of dubious wisdom",
    "congratulations": "I offer hollow acclamations",
    "congrats": "mock homage unto thee",
    "promotion": "elevation among the chained galley-slaves",
    "resume": "scroll of embellished triumphs",
    "job": "toil for copper pennies",
    "career": "lifelong march unto the grave",
    "founder": "maker of pitch decks and zero profit",
    "co-founder": "accomplice in promissory debt",
    "ceo": "arch-overseer of the cubicle plantation",
    "recruiter": "press-gang captain scouring for flesh",
    "growth hacker": "peddler of digital trickery",
    "b2b": "merchant unto merchant",
    "saas": "tithes for ethereal vaporware"
  };
  var ARCHAIC_GRAMMAR_RULES = [
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
  var DRAMATIC_PREFIXES = [
    "Hark! ",
    "Alas! ",
    "Verily, ",
    "By heaven, ",
    "O cruel fortune! ",
    "Hearken, good sirs: ",
    "Woe betide us, for ",
    "Behold: "
  ];
  function transformToShakespeare(text) {
    if (!text || text.trim().length === 0) return text;
    let transformed = text;
    const sortedSlang = Object.keys(SLANG_TRANSLATIONS).sort((a, b) => b.length - a.length);
    for (const slang of sortedSlang) {
      const replacement = SLANG_TRANSLATIONS[slang];
      const regex = new RegExp(`\\b${slang}\\b`, "gi");
      transformed = transformed.replace(regex, replacement);
    }
    for (const { pattern, replacement } of ARCHAIC_GRAMMAR_RULES) {
      transformed = transformed.replace(pattern, replacement);
    }
    if (transformed.length > 25 && !transformed.startsWith("Hark") && !transformed.startsWith("Alas")) {
      const hash = transformed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      if (hash % 3 === 0) {
        const prefix = DRAMATIC_PREFIXES[hash % DRAMATIC_PREFIXES.length];
        transformed = prefix + transformed.charAt(0).toLowerCase() + transformed.slice(1);
      }
    }
    return transformed.charAt(0).toUpperCase() + transformed.slice(1);
  }
  function scrambleTitle(title) {
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
  function scrambleCorporateHeadline(headline) {
    if (!headline || headline.trim().length === 0) return headline;
    const mockHeadlines = [
      "Grand Vizier of Pitch Decks & Slide-Transitions",
      "Chief Purveyor of Pointless Meetings | Ex-Unemployed",
      "Professional Buzzword Conjuror | Top 1% Air-Breather",
      "Synergy Evangelist | Passionate About Coffee & Calendars",
      "Overseer of Tedious Spreadsheets | Humblebrag Artisan",
      "Keynote Speaker to Unwilling Audiences | Self-Proclaimed Visionary",
      "Disruptor of Naptime | Certified Email Forwarder"
    ];
    const hash = headline.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return mockHeadlines[hash % mockHeadlines.length];
  }

  // src/content/sabotage/shakespeare_nlp.js
  var ShakespeareRewriter = class {
    constructor() {
      this.originalTextMap = /* @__PURE__ */ new WeakMap();
      this.processedNodes = /* @__PURE__ */ new WeakSet();
      this.active = false;
      this.sabotagedCount = 0;
    }
    /**
     * Checks if an element should be ignored (e.g. scripts, inputs, our own UI).
     */
    shouldIgnoreNode(node) {
      if (!node || !node.parentElement) return true;
      const tag = node.parentElement.tagName.toLowerCase();
      if (["script", "style", "noscript", "textarea", "input", "svg", "code"].includes(tag)) {
        return true;
      }
      if (node.parentElement.isContentEditable) {
        return true;
      }
      if (node.parentElement.closest(".anti-doomscroll-ui")) {
        return true;
      }
      return false;
    }
    /**
     * Rewrites text nodes inside a target container.
     * @param {HTMLElement} root
     * @param {boolean} isTitleMode - whether to treat text as titles
     */
    rewriteContainer(root = document.body, isTitleMode = false) {
      if (!root) return;
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (this.shouldIgnoreNode(node)) return NodeFilter.FILTER_REJECT;
            const text = node.nodeValue.trim();
            if (text.length < 4 || this.processedNodes.has(node)) {
              return NodeFilter.FILTER_SKIP;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      const nodesToProcess = [];
      let currentNode = walker.nextNode();
      while (currentNode && nodesToProcess.length < 150) {
        nodesToProcess.push(currentNode);
        currentNode = walker.nextNode();
      }
      if (nodesToProcess.length === 0) return;
      for (const node of nodesToProcess) {
        this.processedNodes.add(node);
        const original = node.nodeValue;
        this.originalTextMap.set(node, original);
        const rewritten = isTitleMode ? scrambleTitle(original) : transformToShakespeare(original);
        if (rewritten !== original) {
          node.nodeValue = rewritten;
          this.sabotagedCount++;
        }
      }
    }
    /**
     * Restores all modified text nodes back to their original strings.
     * @param {HTMLElement} root
     */
    restore(root = document.body) {
      if (!root) return;
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        null
      );
      let node = walker.nextNode();
      while (node) {
        if (this.originalTextMap.has(node)) {
          node.nodeValue = this.originalTextMap.get(node);
          this.originalTextMap.delete(node);
        }
        this.processedNodes.delete(node);
        node = walker.nextNode();
      }
      this.sabotagedCount = 0;
    }
    getSabotagedCount() {
      return this.sabotagedCount;
    }
  };
  var shakespeareRewriter = new ShakespeareRewriter();

  // src/content/sabotage/video_shrinker.js
  var VideoShrinker = class {
    constructor() {
      this.intervalId = null;
      this.currentScale = 1;
      this.minScale = 0.05;
      this.shrinkStep = 0.015;
      this.targetElements = /* @__PURE__ */ new Set();
      this.isShrinking = false;
    }
    /**
     * Discovers video containers on YouTube, Reddit, or generic sites.
     */
    findVideoPlayers() {
      const candidates = [];
      const ytPlayer = document.querySelector("#movie_player") || document.querySelector("ytd-watch-flexy #player-container") || document.querySelector("ytd-player");
      if (ytPlayer) candidates.push(ytPlayer);
      const ytShorts = document.querySelector("ytd-shorts") || document.querySelector("#shorts-player");
      if (ytShorts) candidates.push(ytShorts);
      const redditPlayer = document.querySelector("shreddit-player") || document.querySelector("div[data-testid='post-container'] video");
      if (redditPlayer) candidates.push(redditPlayer);
      const genericVideos = document.querySelectorAll("video");
      genericVideos.forEach((vid) => {
        const wrapper = vid.closest(".video-player") || vid.parentElement || vid;
        candidates.push(wrapper);
      });
      return Array.from(new Set(candidates));
    }
    /**
     * Applies the scaling transformation to an element.
     */
    applyScale(el, scale) {
      if (!el) return;
      el.style.setProperty("transition", "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)", "important");
      el.style.setProperty("transform", `scale(${scale})`, "important");
      el.style.setProperty("transform-origin", "center center", "important");
    }
    /**
     * Starts the progressive shrinkage loop.
     * @param {number} intervalSeconds
     */
    start(intervalSeconds = 5) {
      if (this.isShrinking) return;
      this.isShrinking = true;
      this.intervalId = setInterval(() => {
        if (this.currentScale > this.minScale) {
          this.currentScale = Math.max(this.minScale, this.currentScale - this.shrinkStep);
          const players = this.findVideoPlayers();
          for (const player of players) {
            this.targetElements.add(player);
            this.applyScale(player, this.currentScale);
          }
          document.querySelectorAll("video").forEach((vid) => {
            if (vid.volume > 0.1) {
              try {
                vid.volume = Math.max(0.05, vid.volume - 0.02);
              } catch {
              }
            }
          });
        }
      }, intervalSeconds * 1e3);
    }
    /**
     * Restores video players to full original scale and clears interval.
     */
    restore() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.isShrinking = false;
      this.currentScale = 1;
      for (const el of this.targetElements) {
        if (el) {
          el.style.removeProperty("transform");
          el.style.removeProperty("transition");
          el.style.removeProperty("transform-origin");
        }
      }
      this.targetElements.clear();
      document.querySelectorAll("video").forEach((vid) => {
        try {
          vid.volume = 1;
        } catch {
        }
      });
    }
    getScale() {
      return this.currentScale;
    }
  };
  var videoShrinker = new VideoShrinker();

  // src/content/sabotage/chaos_engine.js
  var ChaosEngine = class {
    constructor() {
      this.tiltAngle = 0;
      this.tiltInterval = null;
      this.evaderHandler = null;
      this.active = false;
      this.evadingElements = /* @__PURE__ */ new Set();
    }
    /**
     * Applies subtle optical tilt to the entire document body.
     */
    startOpticalTilt() {
      if (this.tiltInterval) return;
      this.tiltInterval = setInterval(() => {
        if (Math.abs(this.tiltAngle) < 1.5) {
          this.tiltAngle = this.tiltAngle === 0 ? 0.3 : this.tiltAngle + 0.1;
          document.body.style.setProperty("transform", `rotate(${this.tiltAngle}deg)`, "important");
          document.body.style.setProperty("transition", "transform 3s ease", "important");
        }
      }, 3e4);
    }
    /**
     * Jumbles or corrupts media thumbnails.
     */
    corruptThumbnails() {
      const thumbnails = document.querySelectorAll(
        "ytd-thumbnail img, shreddit-post img, a[data-testid='post-title'] img"
      );
      thumbnails.forEach((img, idx) => {
        if (idx % 2 === 0) {
          img.style.setProperty("filter", "hue-rotate(180deg) contrast(1.1)", "important");
          img.style.setProperty("transition", "filter 1s ease", "important");
        }
      });
    }
    /**
     * Makes next-video or infinite-scroll action buttons physically run away from the mouse.
     */
    enableButtonEvasion() {
      if (this.evaderHandler) return;
      this.evaderHandler = (e) => {
        const candidates = document.querySelectorAll(
          ".ytp-next-button, ytd-button-renderer.ytd-shorts, button[aria-label='Next'], #load-more-btn"
        );
        candidates.forEach((btn) => {
          const rect = btn.getBoundingClientRect();
          const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
          if (dist < 45) {
            const shiftX = (Math.random() - 0.5) * 60;
            const shiftY = (Math.random() - 0.5) * 40;
            btn.style.setProperty("transform", `translate(${shiftX}px, ${shiftY}px)`, "important");
            btn.style.setProperty("transition", "transform 0.15s ease-out", "important");
            this.evadingElements.add(btn);
          }
        });
      };
      window.addEventListener("mousemove", this.evaderHandler, { passive: true });
    }
    /**
     * Restores page rotation, thumbnail styles, and removes event listeners.
     */
    restore() {
      if (this.tiltInterval) {
        clearInterval(this.tiltInterval);
        this.tiltInterval = null;
      }
      this.tiltAngle = 0;
      document.body.style.removeProperty("transform");
      document.body.style.removeProperty("transition");
      const thumbnails = document.querySelectorAll("ytd-thumbnail img, shreddit-post img");
      thumbnails.forEach((img) => {
        img.style.removeProperty("filter");
        img.style.removeProperty("transition");
      });
      if (this.evaderHandler) {
        window.removeEventListener("mousemove", this.evaderHandler);
        this.evaderHandler = null;
      }
      for (const el of this.evadingElements) {
        if (el) {
          el.style.removeProperty("transform");
          el.style.removeProperty("transition");
        }
      }
      this.evadingElements.clear();
    }
  };
  var chaosEngine = new ChaosEngine();

  // src/content/sabotage/nag_overlay.js
  var NAGGING_PROMPTS = [
    "Are you winning, son? Because your unfinished tasks are weeping.",
    "Verily, another five minutes hath vanished into the digital ether.",
    "Your future self is currently screaming into a pillow.",
    "What glorious triumph do you expect at the bottom of this infinite feed?",
    "The dopamine hits are diminishing. Return to your labours.",
    "Somewhere, an unread document longs for your gentle touch."
  ];
  var NagOverlay = class {
    constructor() {
      this.currentToast = null;
      this.timer = null;
    }
    showRandomNag() {
      if (this.currentToast) return;
      const message = NAGGING_PROMPTS[Math.floor(Math.random() * NAGGING_PROMPTS.length)];
      const toast = document.createElement("div");
      toast.className = "anti-doomscroll-ui anti-doomscroll-nag";
      toast.innerHTML = `
      <div class="nag-content">
        <span class="nag-icon">\u{1F441}\uFE0F</span>
        <div class="nag-text">
          <strong>ANTIDOOMSCROLL INTERVENTION</strong>
          <p>${message}</p>
        </div>
      </div>
      <button class="nag-close-btn" aria-label="Close">\u2715</button>
    `;
      Object.assign(toast.style, {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        maxWidth: "360px",
        backgroundColor: "#0d101d",
        color: "#f0f3fa",
        border: "1px solid rgba(255, 45, 85, 0.6)",
        borderRadius: "12px",
        padding: "14px 18px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 45, 85, 0.4)",
        zIndex: "2147483647",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "13px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "12px",
        animation: "antiDoomSlideIn 0.3s ease-out forwards",
        cursor: "default"
      });
      const styleEl = document.createElement("style");
      styleEl.className = "anti-doomscroll-ui";
      styleEl.textContent = `
      @keyframes antiDoomSlideIn {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .anti-doomscroll-nag .nag-content { display: flex; gap: 10px; }
      .anti-doomscroll-nag .nag-icon { font-size: 20px; }
      .anti-doomscroll-nag strong { display: block; font-size: 10px; color: #ff2d55; letter-spacing: 1px; margin-bottom: 2px; }
      .anti-doomscroll-nag p { margin: 0; color: #d0d7e6; line-height: 1.35; font-size: 12.5px; }
      .anti-doomscroll-nag .nag-close-btn { background: none; border: none; color: #7f8ba4; font-size: 14px; cursor: pointer; padding: 2px; }
      .anti-doomscroll-nag .nag-close-btn:hover { color: #fff; }
    `;
      document.head.appendChild(styleEl);
      document.body.appendChild(toast);
      this.currentToast = toast;
      toast.querySelector(".nag-close-btn").addEventListener("click", () => {
        this.dismiss();
      });
      this.timer = setTimeout(() => {
        this.dismiss();
      }, 1e4);
    }
    dismiss() {
      if (this.currentToast) {
        this.currentToast.remove();
        this.currentToast = null;
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
    restore() {
      this.dismiss();
      document.querySelectorAll(".anti-doomscroll-ui").forEach((el) => el.remove());
    }
  };
  var nagOverlay = new NagOverlay();

  // src/content/adaptors/base_adaptor.js
  var BaseAdaptor = class {
    constructor(siteName) {
      this.siteName = siteName;
    }
    /**
     * Returns list of video player element candidates.
     * @returns {HTMLElement[]}
     */
    getVideoElements() {
      return Array.from(document.querySelectorAll("video"));
    }
    /**
     * Returns list of text containers for comment sections.
     * @returns {HTMLElement[]}
     */
    getCommentContainers() {
      return [];
    }
    /**
     * Returns list of video/post title elements.
     * @returns {HTMLElement[]}
     */
    getTitleElements() {
      return [];
    }
    /**
     * Detects if current view is a high-addiction short-form vertical feed (e.g. YouTube Shorts).
     * @returns {boolean}
     */
    isShortFormReel() {
      return false;
    }
    /**
     * Hook for site-specific SPA page navigation events.
     * @param {Function} callback
     */
    onPageChange(callback) {
      window.addEventListener("popstate", callback);
    }
  };

  // src/content/adaptors/youtube.js
  var YouTubeAdaptor = class extends BaseAdaptor {
    constructor() {
      super("youtube");
    }
    getVideoElements() {
      const players = [];
      const mainPlayer = document.querySelector("#movie_player") || document.querySelector("ytd-watch-flexy #player-container") || document.querySelector("ytd-player");
      if (mainPlayer) players.push(mainPlayer);
      const shortsPlayer = document.querySelector("#shorts-player");
      if (shortsPlayer) players.push(shortsPlayer);
      const videos = document.querySelectorAll("video");
      videos.forEach((v) => players.push(v));
      return Array.from(new Set(players));
    }
    getCommentContainers() {
      return Array.from(document.querySelectorAll(
        "ytd-comments #content-text, ytd-comment-thread-renderer #content-text, #comment #content-text"
      ));
    }
    getTitleElements() {
      return Array.from(document.querySelectorAll(
        "#video-title, ytd-watch-metadata #title h1, h1.ytd-watch-metadata, #title.ytd-rich-grid-media"
      ));
    }
    isShortFormReel() {
      return window.location.pathname.startsWith("/shorts") || !!document.querySelector("ytd-shorts");
    }
    /**
     * Intercepts YouTube Shorts infinite scroll and locks the loop.
     */
    sabotageShortsReel() {
      if (!this.isShortFormReel()) return;
      const currentShort = document.querySelector("ytd-reel-video-renderer[is-active]");
      if (currentShort) {
        const vid = currentShort.querySelector("video");
        if (vid && !vid.paused) {
          vid.pause();
        }
      }
    }
    onPageChange(callback) {
      super.onPageChange(callback);
      window.addEventListener("yt-navigate-finish", callback);
    }
  };

  // src/content/adaptors/reddit.js
  var RedditAdaptor = class extends BaseAdaptor {
    constructor() {
      super("reddit");
      this.scrollCount = 0;
      this.tombstoneInjected = false;
    }
    getVideoElements() {
      const players = [];
      const redditPlayer = document.querySelector("shreddit-player") || document.querySelector("div[data-testid='post-container'] video");
      if (redditPlayer) players.push(redditPlayer);
      document.querySelectorAll("video").forEach((v) => players.push(v));
      return Array.from(new Set(players));
    }
    getCommentContainers() {
      return Array.from(document.querySelectorAll(
        "shreddit-comment div[slot='comment'], div[data-testid='comment'], .entry .md, p.body-paragraph"
      ));
    }
    getTitleElements() {
      return Array.from(document.querySelectorAll(
        "shreddit-post [slot='title'], a[data-testid='post-title'], p.title a, h1[slot='title']"
      ));
    }
    /**
     * Interrupts infinite scroll after persistent scrolling.
     */
    checkInfiniteScrollDoom() {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollPosition > documentHeight - 600) {
        this.scrollCount++;
        if (this.scrollCount > 3 && !this.tombstoneInjected) {
          this.injectTombstone();
        }
      }
    }
    injectTombstone() {
      this.tombstoneInjected = true;
      const tombstone = document.createElement("div");
      tombstone.className = "anti-doomscroll-ui";
      tombstone.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; margin: 40px auto; max-width: 600px; background: #0c0f1a; border: 2px dashed #ff2d55; border-radius: 16px; color: #fff;">
        <span style="font-size: 40px; display: block; margin-bottom: 12px;">\u{1FAA6}</span>
        <h2 style="font-family: monospace; color: #ff2d55; margin-bottom: 8px;">THE FEED HATH PERISHED</h2>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
          Thou hast reached the outer perimeter of human productivity.<br>
          No salvation lies further down this endless scroll. Close this tab and reclaim thy destiny.
        </p>
      </div>
    `;
      const feed = document.querySelector("shreddit-feed") || document.querySelector("main") || document.body;
      feed.appendChild(tombstone);
    }
  };

  // src/content/adaptors/linkedin.js
  var LinkedInAdaptor = class extends BaseAdaptor {
    constructor() {
      super("linkedin");
      this.scrollCount = 0;
      this.tombstoneInjected = false;
    }
    getVideoElements() {
      return Array.from(document.querySelectorAll("video, .feed-shared-linkedin-video video"));
    }
    getCommentContainers() {
      return Array.from(document.querySelectorAll(
        ".comments-comment-item__main-content, .feed-shared-main-content--comment, span.comments-comment-item__text, div.comments-comment-box"
      ));
    }
    getTitleElements() {
      return Array.from(document.querySelectorAll(
        ".feed-shared-update-v2__description, .update-components-text, div.feed-shared-inline-show-more-text"
      ));
    }
    /**
     * Scrambles pretentious corporate bios and headlines.
     */
    sabotageHeadlines() {
      const headlines = document.querySelectorAll(
        ".update-components-actor__description, .artdeco-entity-lockup__subtitle, .entity-subrow, span.feed-shared-actor__description"
      );
      headlines.forEach((el) => {
        const text = el.textContent.trim();
        if (text.length > 5 && !el.dataset.sabotaged) {
          el.dataset.sabotaged = "true";
          el.textContent = scrambleCorporateHeadline(text);
        }
      });
    }
    /**
     * Checks infinite scrolling in the LinkedIn feed and injects existential tombstone.
     */
    checkInfiniteScrollDoom() {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollPosition > documentHeight - 700) {
        this.scrollCount++;
        if (this.scrollCount > 2 && !this.tombstoneInjected) {
          this.injectTombstone();
        }
      }
    }
    injectTombstone() {
      this.tombstoneInjected = true;
      const tombstone = document.createElement("div");
      tombstone.className = "anti-doomscroll-ui";
      tombstone.innerHTML = `
      <div style="text-align: center; padding: 40px 24px; margin: 30px auto; max-width: 580px; background: #0b0f19; border: 2px dashed #0a66c2; border-radius: 16px; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <span style="font-size: 42px; display: block; margin-bottom: 12px;">\u{1F454}\u{1F480}</span>
        <h2 style="font-family: monospace; color: #00f0ff; margin-bottom: 10px; font-size: 18px; letter-spacing: 1px;">THE CORPORATE LADDER IS AN ILLUSION</h2>
        <p style="color: #94a3b8; font-size: 13.5px; line-height: 1.6;">
          Thou hast consumed countless humblebrags, synthetic congratulations, and hollow thought-leadership.<br>
          No promotion nor transcendent networking connection awaits in this void.<br>
          <strong style="color: #ff2d55;">Close this tab and deliver thy real deliverables.</strong>
        </p>
      </div>
    `;
      const feed = document.querySelector(".scaffold-finite-scroll__content") || document.querySelector("main") || document.body;
      feed.appendChild(tombstone);
    }
  };

  // src/content/index.js
  var currentAdaptor = null;
  var host = window.location.hostname;
  if (host.includes("youtube.com") || host.includes("youtu.be")) {
    currentAdaptor = new YouTubeAdaptor();
  } else if (host.includes("reddit.com")) {
    currentAdaptor = new RedditAdaptor();
  } else if (host.includes("linkedin.com")) {
    currentAdaptor = new LinkedInAdaptor();
  }
  var currentHostility = HOSTILITY_LEVELS.PASSIVE;
  var mutationObserver = null;
  var debounceTimer = null;
  function showActivationHUD(level) {
    if (document.getElementById("anti-doomscroll-hud")) return;
    const hud = document.createElement("div");
    hud.id = "anti-doomscroll-hud";
    hud.className = "anti-doomscroll-ui";
    hud.innerHTML = `\u2694\uFE0F <span style="color:#ff2d55;font-weight:bold;">ANTIDOOMSCROLL</span>: Level ${level} Active`;
    Object.assign(hud.style, {
      position: "fixed",
      top: "16px",
      right: "16px",
      zIndex: "2147483647",
      background: "#0c0f1c",
      color: "#00f0ff",
      border: "1px solid #ff2d55",
      borderRadius: "8px",
      padding: "8px 14px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', monospace",
      fontSize: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.8), 0 0 15px rgba(255, 45, 85, 0.4)",
      pointerEvents: "none",
      transition: "opacity 0.6s ease, transform 0.6s ease",
      opacity: "1",
      transform: "translateY(0)"
    });
    document.body.appendChild(hud);
    setTimeout(() => {
      hud.style.opacity = "0";
      hud.style.transform = "translateY(-15px)";
      setTimeout(() => hud.remove(), 600);
    }, 3500);
  }
  function applySabotage(hostilityLevel, config) {
    currentHostility = hostilityLevel;
    showActivationHUD(hostilityLevel);
    if (hostilityLevel >= HOSTILITY_LEVELS.CONFUSION) {
      shakespeareRewriter.rewriteContainer(document.body, false);
      if (currentAdaptor?.siteName === "linkedin") {
        currentAdaptor.sabotageHeadlines();
      }
    }
    if (hostilityLevel >= HOSTILITY_LEVELS.ELIZABETHAN) {
      shakespeareRewriter.rewriteContainer(document.body, false);
      if (currentAdaptor?.siteName === "linkedin") {
        currentAdaptor.sabotageHeadlines();
      }
      startMutationWatcher();
    }
    if (hostilityLevel >= HOSTILITY_LEVELS.DEGRADATION) {
      const intervalSecs = config?.videoShrinkIntervalSeconds || 5;
      videoShrinker.start(intervalSecs);
      chaosEngine.corruptThumbnails();
      if (currentAdaptor?.siteName === "youtube") {
        currentAdaptor.sabotageShortsReel();
      }
    }
    if (hostilityLevel >= HOSTILITY_LEVELS.UNHINGED) {
      chaosEngine.startOpticalTilt();
      chaosEngine.enableButtonEvasion();
      nagOverlay.showRandomNag();
    }
  }
  if (currentAdaptor) {
    currentAdaptor.onPageChange(() => {
      if (currentHostility >= HOSTILITY_LEVELS.CONFUSION) {
        setTimeout(() => {
          applySabotage(currentHostility, null);
        }, 500);
      }
    });
    if (currentAdaptor.siteName === "reddit" || currentAdaptor.siteName === "linkedin") {
      window.addEventListener("scroll", () => {
        if (currentHostility >= HOSTILITY_LEVELS.DEGRADATION) {
          currentAdaptor.checkInfiniteScrollDoom();
        }
      }, { passive: true });
    }
  }
  function restorePeacefulState() {
    currentHostility = HOSTILITY_LEVELS.PASSIVE;
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
    shakespeareRewriter.restore();
    videoShrinker.restore();
    chaosEngine.restore();
    nagOverlay.restore();
    console.log("[AntiDoomscroll] Restored peaceful DOM state.");
  }
  function startMutationWatcher() {
    if (mutationObserver) return;
    mutationObserver = new MutationObserver((mutations) => {
      if (currentHostility < HOSTILITY_LEVELS.ELIZABETHAN) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        for (const mutation of mutations) {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                shakespeareRewriter.rewriteContainer(node, false);
              }
            });
          }
        }
      }, 250);
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.type) {
        case MESSAGE_TYPES.TRIGGER_SABOTAGE:
          applySabotage(message.hostilityLevel, message.config);
          sendResponse({
            success: true,
            sabotagedCount: shakespeareRewriter.getSabotagedCount(),
            scale: videoShrinker.getScale()
          });
          break;
        case MESSAGE_TYPES.RESTORE_DOM:
          restorePeacefulState();
          sendResponse({ success: true });
          break;
        default:
          break;
      }
      return true;
    });
  }
  console.log("[AntiDoomscroll] Sabotage agent armed and awaiting orders.");
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
    try {
      chrome.runtime.sendMessage({
        type: "TAB_READY",
        url: window.location.href
      });
    } catch (err) {
    }
  }
})();
