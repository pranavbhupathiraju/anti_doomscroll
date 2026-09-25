/**
 * AntiDoomscroll LinkedIn Adaptor
 * Deep sabotage against corporate cringe, hustle culture humblebrags, and networking feeds.
 */

import { BaseAdaptor } from "./base_adaptor.js";
import { scrambleCorporateHeadline } from "../../common/dictionary.js";

export class LinkedInAdaptor extends BaseAdaptor {
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
        <span style="font-size: 42px; display: block; margin-bottom: 12px;">👔💀</span>
        <h2 style="font-family: monospace; color: #00f0ff; margin-bottom: 10px; font-size: 18px; letter-spacing: 1px;">THE CORPORATE LADDER IS AN ILLUSION</h2>
        <p style="color: #94a3b8; font-size: 13.5px; line-height: 1.6;">
          Thou hast consumed countless humblebrags, synthetic congratulations, and hollow thought-leadership.<br>
          No promotion nor transcendent networking connection awaits in this void.<br>
          <strong style="color: #ff2d55;">Close this tab and deliver thy real deliverables.</strong>
        </p>
      </div>
    `;

    const feed = document.querySelector(".scaffold-finite-scroll__content") || 
                 document.querySelector("main") || 
                 document.body;
    feed.appendChild(tombstone);
  }
}
