/**
 * AntiDoomscroll Distribution ZIP Packager
 * Packages extension files into a clean zip archive in dist/
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const zipPath = path.join(distDir, "anti_doomscroll.zip");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

// Files and directories to package
const filesToInclude = [
  "manifest.json",
  "package.json",
  "README.md",
  "LICENSE",
  "assets",
  "src"
];

console.log("[AntiDoomscroll] Packaging extension into dist/anti_doomscroll.zip...");

try {
  // Use native macOS / Linux zip command
  const includeArgs = filesToInclude.join(" ");
  execSync(`zip -r "${zipPath}" ${includeArgs} -x "*.DS_Store*"`, {
    cwd: rootDir,
    stdio: "inherit"
  });

  const stats = fs.statSync(zipPath);
  console.log(`[AntiDoomscroll] Packaging successful! Archive size: ${(stats.size / 1024).toFixed(1)} KB`);
} catch (err) {
  console.error("[AntiDoomscroll] Packaging failed:", err);
  process.exit(1);
}
