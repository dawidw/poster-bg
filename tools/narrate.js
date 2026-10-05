#!/usr/bin/env node
// Narration for the Inspirations section: one MP3 per block, voiced with ElevenLabs.
//   node tools/narrate.js --dry            list blocks, characters and estimated cost
//   node tools/narrate.js --export         write the text of every block to narration/<id>.txt
//                                          (existing files are kept, so hand edits stick; add --force to overwrite)
// The MP3 step voices narration/<id>.txt when it exists, otherwise the text from index.html.
//   ELEVENLABS_API_KEY=... node tools/narrate.js [--only id,id] [--force]
// Optional: ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL (default eleven_multilingual_v2).
// Blocks whose text has not changed since the last run are skipped (see audio/manifest.json).
// Optional local settings: a .env file in the repo root (git-ignored) with ELEVENLABS_API_KEY=..., ELEVENLABS_VOICE_ID=...
try { for (const line of require("fs").readFileSync(require("path").join(__dirname, "..", ".env"), "utf8").split("\n")) { const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ""); } } catch (e) {}
const fs = require("fs"), path = require("path"), vm = require("vm"), crypto = require("crypto");
const root = path.join(__dirname, ".."), outDir = path.join(root, "audio");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const args = process.argv.slice(2), has = f => args.includes(f);
const only = (args[args.indexOf("--only") + 1] || "").split(",").filter(Boolean);

const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const plain = s => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

const blocks = [];
const intro = html.match(/<h2 class="pull[^"]*">([\s\S]*?)<\/h2>\s*<div class="reveal">([\s\S]*?)<\/div>\s*<\/div>/);
blocks.push({ id: "intro", text: [plain(intro[1]), ...[...intro[2].matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m => plain(m[1]))] });
const theory = html.match(/<div class="theory">([\s\S]*?)\n      <\/div>/)[1];
for (const m of theory.matchAll(/<h3>([\s\S]*?)<\/h3>([\s\S]*?)<\/div>/g))
  blocks.push({ id: slug(plain(m[1])), text: [plain(m[1]), ...[...m[2].matchAll(/<p>([\s\S]*?)<\/p>/g)].map(p => plain(p[1]))] });
const src = html.match(/const PEOPLE = (\[[\s\S]*?\n    \]);/)[1];
for (const p of vm.runInNewContext(src)) blocks.push({ id: slug(p.name), text: [p.name, p.role, ...[].concat(p.text).map(plain)] });

const textDir = path.join(root, "narration");
if (has("--export")) {
  fs.mkdirSync(textDir, { recursive: true });
  for (const b of blocks) {
    const f = path.join(textDir, b.id + ".txt");
    if (has("--force") || !fs.existsSync(f)) { fs.writeFileSync(f, b.text.join("\n\n") + "\n"); console.log("wrote", path.relative(root, f)); }
  }
  process.exit(0);
}
for (const b of blocks) {
  const f = path.join(textDir, b.id + ".txt");
  if (fs.existsSync(f)) b.text = [fs.readFileSync(f, "utf8").trim()];
}
let pron = {};
try { pron = JSON.parse(fs.readFileSync(path.join(textDir, "pronunciations.json"), "utf8")); delete pron._note; } catch (e) {}
const respell = t => Object.keys(pron).sort((a, b) => b.length - a.length).reduce((r, k) => r.replace(new RegExp("(?<![\\p{L}])" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?![\\p{L}])", "gu"), pron[k]), t);
if (has("--show")) { const b = blocks.find(b => b.id === args[args.indexOf("--show") + 1]); console.log(b ? respell(b.text.join("\n")) : "unknown block id"); process.exit(0); }
const manifestFile = path.join(outDir, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
const chars = blocks.reduce((n, b) => n + b.text.join("\n").length, 0);
for (const b of blocks) console.log(`${b.id.padEnd(28)} ${String(b.text.join("\n").length).padStart(5)} chars`);
console.log(`total ${chars} chars = ${chars} credits (multilingual v2/v3), about $${(chars * 0.0003).toFixed(2)} at API rates`);
if (has("--dry")) process.exit(0);

const key = process.env.ELEVENLABS_API_KEY;
if (!key) { console.error("Set ELEVENLABS_API_KEY (or use --dry)."); process.exit(1); }
const voice = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM", model = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";

(async () => {
  for (const b of blocks) {
    if (only.length && !only.includes(b.id)) continue;
    const text = respell(b.text.join("\n")), hash = crypto.createHash("sha1").update(text + voice + model).digest("hex").slice(0, 10);
    if (!has("--force") && manifest[b.id] && manifest[b.id].hash === hash) { console.log("skip", b.id); continue; }
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
      method: "POST", headers: { "xi-api-key": key, "content-type": "application/json" }, body: JSON.stringify({ text, model_id: model }),
    });
    if (!res.ok) { console.error(b.id, res.status, await res.text()); process.exit(1); }
    const file = `${b.id}.${hash}.mp3`;
    fs.writeFileSync(path.join(outDir, file), Buffer.from(await res.arrayBuffer()));
    if (manifest[b.id] && manifest[b.id].file !== file) fs.rmSync(path.join(outDir, manifest[b.id].file), { force: true });
    manifest[b.id] = { file, hash };
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
    console.log("wrote", file);
  }
})();
