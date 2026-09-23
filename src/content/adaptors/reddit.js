/**
 * AntiDoomscroll Reddit Adaptor
 * Deep integration with Reddit feeds, modern Web Components, and infinite scroll.
 */

import { BaseAdaptor } from "./base_adaptor.js";

export class RedditAdaptor extends BaseAdaptor {
  constructor() {
    super("reddit");
    this.scrollCount = 0;
    this.tombstoneInjected = false;
  }

  getVideoElements() {
    const players = [];
    const redditPlayer = document.querySelector("shreddit-player") ||
                         document.querySelector("div[data-testid='post-container'] video");
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
        <span style="font-size: 40px; display: block; margin-bottom: 12px;">🪦</span>
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
}
