/**
 * Renders the resume.
 *
 *   node scripts/build-resume.mjs            -> public/resume.pdf   (published)
 *   node scripts/build-resume.mjs --full     -> ~/assets-archive/   (with email)
 *
 * The published copy is the default because the address must never end up in
 * public/. resume.html carries no contact email at all — the full build splices
 * it in from resume/private.json, which is gitignored, so the repo has nothing
 * to leak even in history.
 */
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const full = process.argv.includes("--full");
const srcPath = join(root, "resume/resume.html");
const marker = "<!-- CONTACT_EMAIL";

if (!full) {
  execFileSync("weasyprint", ["-s", join(root, "resume/public.css"), srcPath,
    join(root, "public/resume.pdf")], { stdio: "inherit" });
  console.log("public/resume.pdf  (no contact email)");
} else {
  const privPath = join(root, "resume/private.json");
  if (!existsSync(privPath)) {
    console.error("resume/private.json missing — cannot build the full copy.");
    process.exit(1);
  }
  const { email } = JSON.parse(readFileSync(privPath, "utf8"));
  const html = readFileSync(srcPath, "utf8");
  const line = `        <li><a href="mailto:${email}">${email}</a></li>`;
  const idx = html.indexOf(marker);
  const end = html.indexOf("-->", idx) + 3;
  const tmp = join(root, "resume/.full.html");
  writeFileSync(tmp, html.slice(0, idx) + line + html.slice(end));
  const out = join(homedir(), "assets-archive/Colton_Spahmer_Resume.pdf");
  try {
    execFileSync("weasyprint", [tmp, out], { stdio: "inherit" });
    console.log(out + "  (with contact email)");
  } finally {
    rmSync(tmp, { force: true });
  }
}
