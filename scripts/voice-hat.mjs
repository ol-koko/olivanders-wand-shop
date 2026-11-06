// Records the Sorting Hat's English lines with ElevenLabs. Local only: it never ships with the site.
//   node scripts/voice-hat.mjs            asks before spending any characters
//   node scripts/voice-hat.mjs --dry      only counts, no API calls
// Reads the script from scripts/hat-lines-short.md (or a path given as the first argument), the key from .env.
// Saves audio/hat/<id>.mp3, and <id>-1/2/3.mp3 for the verdicts and the build-up lines. Existing files are skipped.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), DRY = args.includes('--dry');
const SCRIPT = path.resolve(args.find(a => !a.startsWith('--')) || path.join(ROOT, 'scripts', 'hat-lines-short.md'));
const OUT = path.join(ROOT, 'audio', 'hat');
const VOICE_NAME = 'Daniel – The Gruff Old British Wizard';
const MODEL = 'eleven_multilingual_v2', FORMAT = 'mp3_44100_64', TAKES = 3;
const API = 'https://api.elevenlabs.io/v1';

// Every table row whose first cell is an id. The English column is the one before the last (Ukrainian) column.
function readLines(file) {
  const out = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length < 3 || cells[0] === 'id' || /^-+$/.test(cells[0]) || !/^[a-zA-Z]\w*$/.test(cells[0])) continue;
    out.push({ id: cells[0], text: cells[cells.length - 2] });
  }
  return out;
}
const takesFor = id => /^house[GSRH]$|^build\d+$/.test(id) ? TAKES : 1;
const fileNames = ({ id }) => takesFor(id) === 1 ? [`${id}.mp3`] : Array.from({ length: TAKES }, (_, i) => `${id}-${i + 1}.mp3`);

function readKey() {
  const env = path.join(ROOT, '.env');
  if (!fs.existsSync(env)) return '';
  const m = /^ELEVENLABS_API_KEY=(.*)$/m.exec(fs.readFileSync(env, 'utf8'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}

async function api(key, url, opts = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(API + url, { ...opts, headers: { 'xi-api-key': key, ...(opts.headers || {}) } });
    if (res.ok) return res;
    if ((res.status === 429 || res.status >= 500) && attempt < 4) { await new Promise(r => setTimeout(r, 4000 * attempt)); continue; }
    throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
  }
}
// The voice has to be in the account's own voices to be used. The library one is only reported, never added from here.
async function findVoice(key) {
  const mine = await (await api(key, '/voices')).json();
  const hit = mine.voices.find(v => v.name.trim().toLowerCase() === VOICE_NAME.toLowerCase()) || mine.voices.find(v => v.name.toLowerCase().startsWith('daniel') && /wizard/i.test(v.name));
  if (hit) return hit.voice_id;
  const lib = await (await api(key, `/shared-voices?page_size=10&search=${encodeURIComponent('Gruff Old British Wizard')}`)).json();
  const names = (lib.voices || []).map(v => `  ${v.name} (${v.voice_id})`).join('\n');
  throw new Error(`"${VOICE_NAME}" is not in your voices yet. Add it in ElevenLabs (Voice Library, "Add to My Voices"), then run this again.${names ? '\nFound in the library:\n' + names : ''}`);
}

const lines = readLines(SCRIPT);
if (!lines.length) { console.error('No lines found in ' + SCRIPT); process.exit(1); }
const ids = new Set(); for (const l of lines) { if (ids.has(l.id)) { console.error('Duplicate id: ' + l.id); process.exit(1); } ids.add(l.id); }
const jobs = lines.flatMap(l => fileNames(l).map(f => ({ ...l, file: f })));
const todo = jobs.filter(j => !fs.existsSync(path.join(OUT, j.file)));
const chars = a => a.reduce((n, j) => n + j.text.length, 0);
console.log(`Script: ${path.relative(ROOT, SCRIPT)}, ${lines.length} lines, ${jobs.length} files with takes.`);
console.log(`Total characters: ${chars(jobs)}. Still to record: ${todo.length} files, ${chars(todo)} characters (${jobs.length - todo.length} files already exist and are skipped).`);
if (DRY || !todo.length) process.exit(0);

const key = readKey();
if (!key) { console.error('ELEVENLABS_API_KEY is empty in .env. Add your key there and run again.'); process.exit(1); }
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const yes = /^y(es)?$/i.test((await rl.question(`Spend ${chars(todo)} characters with "${VOICE_NAME}"? Type y to continue: `)).trim());
rl.close();
if (!yes) { console.log('Nothing recorded.'); process.exit(0); }

try {
  const voice = await findVoice(key);
  fs.mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (const j of todo) {
    const res = await api(key, `/text-to-speech/${voice}?output_format=${FORMAT}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: j.text, model_id: MODEL }) });
    fs.writeFileSync(path.join(OUT, j.file), Buffer.from(await res.arrayBuffer()));
    console.log(`${++n}/${todo.length}  ${j.file}  ${j.text}`);
  }
  console.log(`Done: ${n} files in ${path.relative(ROOT, OUT)}.`);
} catch (e) {
  console.error('Stopped: ' + e.message); // files saved so far stay, and a rerun skips them
  process.exit(1);
}
