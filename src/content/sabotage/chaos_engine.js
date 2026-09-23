/**
 * AntiDoomscroll Visual Chaos Engine
 * Applies optical tilt, thumbnail corruption, and cursor evasion tactics.
 */

class ChaosEngine {
  constructor() {
    this.tiltAngle = 0;
    this.tiltInterval = null;
    this.evaderHandler = null;
    this.active = false;
    this.evadingElements = new Set();
  }

  /**
   * Applies subtle optical tilt to the entire document body.
   */
  startOpticalTilt() {
    if (this.tiltInterval) return;

    this.tiltInterval = setInterval(() => {
      // Gradually increases tilt by 0.1 degree every 30 seconds
      if (Math.abs(this.tiltAngle) < 1.5) {
        this.tiltAngle = this.tiltAngle === 0 ? 0.3 : this.tiltAngle + 0.1;
        document.body.style.setProperty("transform", `rotate(${this.tiltAngle}deg)`, "important");
        document.body.style.setProperty("transition", "transform 3s ease", "important");
      }
    }, 30000);
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
}

export const chaosEngine = new ChaosEngine();
