import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
const failures = [];
async function scan(dir = ".") {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (
      [".git", ".next", "out", "node_modules", "next-env.d.ts"].includes(
        entry.name,
      )
    )
      continue;
    const f = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scan(f);
      continue;
    }
    if (entry.name.startsWith(".env")) failures.push(`${f}: environment file`);
    if (f.endsWith("check-source.mjs")) continue;
    const text = await readFile(f, "utf8");
    if (
      /mongodb(?:\+srv)?:|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{20,}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(
        text,
      )
    )
      failures.push(`${f}: potential private data`);
    if (
      /\.(tsx?|css)$/.test(f) &&
      /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|https?:\/\/|next\/font\/google/.test(
        text,
      )
    )
      failures.push(`${f}: runtime network reference`);
  }
}
await scan();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else console.log("Source guard passed.");
