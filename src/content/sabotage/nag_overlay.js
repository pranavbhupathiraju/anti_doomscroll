/**
 * AntiDoomscroll Passive-Aggressive Nag Overlays
 * Injects sarcastic existential alerts to nudge users out of doomscroll loops.
 */

const NAGGING_PROMPTS = [
  "Are you winning, son? Because your unfinished tasks are weeping.",
  "Verily, another five minutes hath vanished into the digital ether.",
  "Your future self is currently screaming into a pillow.",
  "What glorious triumph do you expect at the bottom of this infinite feed?",
  "The dopamine hits are diminishing. Return to your labours.",
  "Somewhere, an unread document longs for your gentle touch."
];

class NagOverlay {
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
        <span class="nag-icon">👁️</span>
        <div class="nag-text">
          <strong>ANTIDOOMSCROLL INTERVENTION</strong>
          <p>${message}</p>
        </div>
      </div>
      <button class="nag-close-btn" aria-label="Close">✕</button>
    `;

    // Inline styling to avoid external CSS injection dependencies
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

    // Style the inner elements
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

    // Auto dismiss after 10 seconds
    this.timer = setTimeout(() => {
      this.dismiss();
    }, 10000);
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
}

export const nagOverlay = new NagOverlay();
