/**
 * AntiDoomscroll Shakespearean DOM Rewriter
 * Scans page text nodes and rewrites modern comments into Elizabethan prose.
 */

import { transformToShakespeare, scrambleTitle } from "../../common/dictionary.js";

class ShakespeareRewriter {
  constructor() {
    this.originalTextMap = new WeakMap();
    this.processedNodes = new WeakSet();
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

    // Process nodes efficiently
    for (const node of nodesToProcess) {
      this.processedNodes.add(node);
      const original = node.nodeValue;
      this.originalTextMap.set(node, original);

      const rewritten = isTitleMode
        ? scrambleTitle(original)
        : transformToShakespeare(original);

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
}

export const shakespeareRewriter = new ShakespeareRewriter();
