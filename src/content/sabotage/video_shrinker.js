/**
 * AntiDoomscroll Video Shrinker Engine
 * Slowly shrinks video players until they become tiny unwatchable dots.
 */

class VideoShrinker {
  constructor() {
    this.intervalId = null;
    this.currentScale = 1.0;
    this.minScale = 0.05; // 5% original size
    this.shrinkStep = 0.015; // 1.5% decrease per tick
    this.targetElements = new Set();
    this.isShrinking = false;
  }

  /**
   * Discovers video containers on YouTube, Reddit, or generic sites.
   */
  findVideoPlayers() {
    const candidates = [];

    // YouTube specific selectors
    const ytPlayer = document.querySelector("#movie_player") || 
                     document.querySelector("ytd-watch-flexy #player-container") ||
                     document.querySelector("ytd-player");
    if (ytPlayer) candidates.push(ytPlayer);

    // YouTube Shorts container
    const ytShorts = document.querySelector("ytd-shorts") || 
                     document.querySelector("#shorts-player");
    if (ytShorts) candidates.push(ytShorts);

    // Reddit video players
    const redditPlayer = document.querySelector("shreddit-player") ||
                         document.querySelector("div[data-testid='post-container'] video");
    if (redditPlayer) candidates.push(redditPlayer);

    // Generic HTML5 video elements
    const genericVideos = document.querySelectorAll("video");
    genericVideos.forEach((vid) => {
      // Find suitable container or video itself
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

        // Subtly attenuate video audio
        document.querySelectorAll("video").forEach((vid) => {
          if (vid.volume > 0.1) {
            try {
              vid.volume = Math.max(0.05, vid.volume - 0.02);
            } catch {
              // Ignore cross-origin media restrictions
            }
          }
        });
      }
    }, intervalSeconds * 1000);
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
    this.currentScale = 1.0;

    for (const el of this.targetElements) {
      if (el) {
        el.style.removeProperty("transform");
        el.style.removeProperty("transition");
        el.style.removeProperty("transform-origin");
      }
    }
    this.targetElements.clear();

    // Restore volume
    document.querySelectorAll("video").forEach((vid) => {
      try {
        vid.volume = 1.0;
      } catch {}
    });
  }

  getScale() {
    return this.currentScale;
  }
}

export const videoShrinker = new VideoShrinker();
