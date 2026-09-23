/**
 * AntiDoomscroll YouTube Adaptor
 * Deep integration with YouTube SPA DOM, Shorts feed, and comments.
 */

import { BaseAdaptor } from "./base_adaptor.js";

export class YouTubeAdaptor extends BaseAdaptor {
  constructor() {
    super("youtube");
  }

  getVideoElements() {
    const players = [];
    const mainPlayer = document.querySelector("#movie_player") || 
                       document.querySelector("ytd-watch-flexy #player-container") ||
                       document.querySelector("ytd-player");
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
    // YouTube's custom navigation finished event
    window.addEventListener("yt-navigate-finish", callback);
  }
}
