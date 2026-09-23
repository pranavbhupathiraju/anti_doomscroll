/**
 * AntiDoomscroll Content Script Entrypoint
 * Listens for background sabotage commands and coordinates page-level disruptions.
 */

console.log("[AntiDoomscroll] Hostile agent injected into page.");

// Bridge listener for background worker commands
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case "TRIGGER_SABOTAGE":
        console.log(`[AntiDoomscroll] Sabotage active at level ${message.hostilityLevel} on ${message.site}`);
        sendResponse({ received: true });
        break;

      case "RESTORE_DOM":
        console.log("[AntiDoomscroll] Restoring peaceful DOM state.");
        sendResponse({ restored: true });
        break;

      default:
        break;
    }
    return true;
  });
}
