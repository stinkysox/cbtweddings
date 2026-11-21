import { execFileSync, spawn } from "node:child_process";
import { watch } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generator = path.join(root, "scripts", "generate-gallery.mjs");
const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");
const folders = [
  "weddings",
  "pre-wedding",
  "engagement",
  "rituals",
  "family",
  "other-events",
];

execFileSync(process.execPath, [generator], { cwd: root, stdio: "inherit" });

let regenerateTimer;
let regenerating = false;
let rerunAfterGeneration = false;

async function regenerate() {
  if (regenerating) {
    rerunAfterGeneration = true;
    return;
  }

  regenerating = true;
  try {
    do {
      rerunAfterGeneration = false;
      await delay(350);
      execFileSync(process.execPath, [generator], {
        cwd: root,
        stdio: "inherit",
      });
    } while (rerunAfterGeneration);
  } catch (error) {
    console.error("Could not refresh the local gallery index:", error);
  } finally {
    regenerating = false;
  }
}

const watchers = folders.map((folder) =>
  watch(path.join(root, "public", "gallery", folder), () => {
    clearTimeout(regenerateTimer);
    regenerateTimer = setTimeout(regenerate, 350);
  }),
);

const next = spawn(
  process.execPath,
  [nextCli, "dev", ...process.argv.slice(2)],
  { cwd: root, stdio: "inherit" },
);

function closeWatchers() {
  clearTimeout(regenerateTimer);
  for (const watcher of watchers) watcher.close();
}

next.on("error", (error) => {
  closeWatchers();
  console.error("Could not start the Next.js development server:", error);
  process.exitCode = 1;
});

next.on("exit", (code, signal) => {
  closeWatchers();
  if (signal) {
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    closeWatchers();
    if (!next.killed) next.kill(signal);
  });
}
