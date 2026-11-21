import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const categories = [
  { folder: "weddings", category: "Wedding" },
  { folder: "pre-wedding", category: "Pre-Wedding" },
  { folder: "engagement", category: "Engagement" },
  { folder: "rituals", category: "Rituals" },
  { folder: "family", category: "Family" },
  { folder: "other-events", category: "Other Events" },
];
const supportedExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

async function main() {
  const items = [];

  for (const { folder, category } of categories) {
    const directory = path.join(root, "public", "gallery", folder);
    const files = await readdir(directory, { withFileTypes: true });

    for (const file of files) {
      if (!file.isFile() || !supportedExtensions.has(path.extname(file.name).toLowerCase())) {
        continue;
      }

      items.push({
        id: `local:${folder}/${file.name}`,
        category,
        imageUrl: `/gallery/${folder}/${encodeURIComponent(file.name)}`,
      });
    }
  }

  items.sort((left, right) => left.id.localeCompare(right.id));

  const output = `import type { GalleryItem } from "@/types";\n\nexport const LOCAL_GALLERY: GalleryItem[] = ${JSON.stringify(items, null, 2)};\n`;
  await writeFile(
    path.join(root, "src", "data", "gallery", "local.generated.ts"),
    output,
    "utf8",
  );
}

main().catch((error) => {
  console.error("Could not generate the local gallery index:", error);
  process.exitCode = 1;
});
