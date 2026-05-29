import { rmSync } from "node:fs";
import { resolve } from "node:path";

const nextDir = resolve(process.cwd(), ".next");
try {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next cache");
} catch (err) {
  console.warn("Could not remove .next:", err.message);
}
