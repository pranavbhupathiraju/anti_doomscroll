/**
 * AntiDoomscroll Offscreen Vision & ML Worker
 * Handles low-latency image analysis and local vision model inference.
 */

import { MESSAGE_TYPES } from "../common/constants.js";

const canvas = document.getElementById("analysisCanvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

/**
 * Analyzes image pixel saturation and color variance to detect entertainment video layouts.
 * Entertainment & gaming videos typically exhibit high color entropy and high saturation in the center 60% of the viewport.
 */
function analyzeVisualEntropy(imageData) {
  const data = imageData.data;
  let totalSaturation = 0;
  let sampleCount = 0;

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const saturation = max === 0 ? 0 : delta / max;

    totalSaturation += saturation;
    sampleCount++;
  }

  const avgSaturation = totalSaturation / (sampleCount || 1);
  return {
    avgSaturation,
    isLikelyVideo: avgSaturation > 0.22
  };
}

/**
 * Queries a local Ollama vision model (e.g. moondream or smolvlm) if available.
 */
async function queryLocalVisionSidecar(base64Image, sidecarUrl = "http://localhost:11434", model = "moondream") {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const response = await fetch(`${sidecarUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model,
        prompt: "Is this image showing productive work (like code, research, document) or entertainment/video procrastination? Respond strictly with either WORK or PROCRASTINATION.",
        images: [cleanBase64],
        stream: false
      }),
      signal: AbortSignal.timeout(4000)
    });

    if (response.ok) {
      const data = await response.json();
      const answer = (data.response || "").toUpperCase();
      return {
        success: true,
        isProcrastination: answer.includes("PROCRASTINATION"),
        raw: data.response
      };
    }
  } catch (err) {
    // Sidecar offline or timed out; fall back to fast heuristic
  }
  return { success: false };
}

/**
 * Loads image from data URI onto 224x224 canvas and runs classification.
 */
async function processFrame(dataUri, visionConfig) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      ctx.clearRect(0, 0, 224, 224);
      ctx.drawImage(img, 0, 0, 224, 224);
      const imgData = ctx.getImageData(0, 0, 224, 224);

      // Fast in-browser heuristic
      const entropy = analyzeVisualEntropy(imgData);

      // Try local sidecar if configured
      if (visionConfig?.mode === "sidecar" || visionConfig?.mode === "hybrid") {
        const sidecarResult = await queryLocalVisionSidecar(
          dataUri,
          visionConfig.sidecarUrl,
          visionConfig.modelName
        );

        if (sidecarResult.success) {
          return resolve({
            isProcrastination: sidecarResult.isProcrastination,
            confidence: 0.95,
            source: "local_sidecar"
          });
        }
      }

      resolve({
        isProcrastination: entropy.isLikelyVideo,
        confidence: entropy.avgSaturation > 0.3 ? 0.85 : 0.65,
        source: "visual_heuristic"
      });
    };

    img.onerror = () => {
      resolve({ isProcrastination: true, confidence: 0.5, source: "fallback" });
    };

    img.src = dataUri;
  });
}

// Runtime message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === MESSAGE_TYPES.ANALYZE_IMAGE) {
    processFrame(message.dataUri, message.visionConfig).then((result) => {
      sendResponse(result);
    });
    return true;
  }
});

console.log("[AntiDoomscroll] Offscreen vision processor active.");
