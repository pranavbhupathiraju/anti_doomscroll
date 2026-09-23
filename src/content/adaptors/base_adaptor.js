/**
 * AntiDoomscroll Base Platform Adaptor Interface
 */

export class BaseAdaptor {
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
}
