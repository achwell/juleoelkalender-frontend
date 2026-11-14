import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

export async function generateServiceWorker(directory: string) {
  directory = resolve(directory);
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name).slice(directory.length + 1))
    .filter(
      (name) => !name.endsWith(".map") && name !== "sw.js" && name !== "registerSW.js" && !name.startsWith("workbox-"),
    )
    .toSorted();
  if (!files.includes("index.html")) throw new Error("Missing app shell: index.html");
  const template = await readFile(new URL("./service-worker.js", import.meta.url), "utf8");
  const hash = createHash("sha256").update(template);
  for (const file of files) {
    hash.update(file).update(await readFile(join(directory, file)));
  }
  const source = template
    .replace("__VERSION__", hash.digest("hex").slice(0, 20))
    .replace("__PRECACHE__", JSON.stringify(files.map((file) => `/${file}`)));
  await writeFile(join(directory, "sw.js"), source);
}
