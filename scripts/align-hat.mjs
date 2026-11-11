// Times the Sorting Hat's mouth to its recorded lines with ElevenLabs Forced Alignment. Local only: it never ships with the site.
//   node scripts/align-hat.mjs             English: audio/hat/<id>.mp3 with the English column of the script
//   node scripts/align-hat.mjs --lang ua   Ukrainian: audio/hat/ua/<id>.mp3 with the Ukrainian column
//   add --dry to only list what would be sent, with no API calls
//   add --rebuild to remake every .lips.json from the saved alignments, with no API calls (after changing the mouth shapes below)
// Reads the script from scripts/hat-lines-short.md, the key from .env (never printed).
// Saves audio/hat/<id>.lips.json next to each mp3. Files that already have one are skipped.
// The raw answers are kept in scripts/.align-cache/ (not committed), so the shapes can be retuned without spending anything.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), DRY = args.includes('--dry'), REBUILD = args.includes('--rebuild');
const LANG = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : 'en';
if (!['en', 'ua'].includes(LANG)) { console.error('--lang must be en or ua'); process.exit(1); }
const SCRIPT = path.join(ROOT, 'scripts', 'hat-lines-short.md');
const DIR = path.join(ROOT, 'audio', 'hat', ...(LANG === 'ua' ? ['ua'] : []));
const CACHE = path.join(ROOT, 'scripts', '.align-cache', LANG);
const API = 'https://api.elevenlabs.io/v1/forced-alignment';

// Same table reading as voice-hat.mjs: English is the column before the last, Ukrainian the last.
function readLines(file) {
  const out = new Map();
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length < 3 || cells[0] === 'id' || /^-+$/.test(cells[0]) || !/^[a-zA-Z]\w*$/.test(cells[0])) continue;
    out.set(cells[0], cells[cells.length - (LANG === 'ua' ? 1 : 2)]);
  }
  return out;
}

function readKey() {
  const env = path.join(ROOT, '.env');
  if (!fs.existsSync(env)) return '';
  const m = /^ELEVENLABS_API_KEY=(.*)$/m.exec(fs.readFileSync(env, 'utf8'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}

// Mouth shapes, one letter each in the output:
//   M closed (m b p), A wide (a e i y), O round (o u w q), F teeth (f v), S small (other consonants), X rest (silence between words)
const SHAPE = {};
for (const [s, chars] of Object.entries({
  M: 'mbpмбп', A: 'aeiyаеєиіїяэ', O: 'ouwqоуюв', F: 'fvф',
})) for (const c of chars) SHAPE[c] = s;
const shapeOf = ch => { const c = ch.toLowerCase(); return SHAPE[c] || (/\p{L}/u.test(c) ? 'S' : null); };
const GAP = 0.08;   // a pause between words longer than this closes the mouth to rest
const MIN = 0.035;  // shorter segments merge into the one before, so the mouth doesn't flicker
const r2 = x => Math.round(x * 100) / 100;

// The alignment's characters → [[time, shape], ...]: each key holds until the next one; the last is always X.
function toKeys(al) {
  const seg = [];
  const push = (t0, t1, s) => {
    const last = seg[seg.length - 1];
    if (last && last.s === s) { last.t1 = Math.max(last.t1, t1); return; }
    if (last && t0 - last.t1 > GAP && s !== 'X' && last.s !== 'X') seg.push({ t0: last.t1, t1: t0, s: 'X' });
    seg.push({ t0, t1, s });
  };
  for (const c of al.characters || []) {
    if (!(c.end > c.start)) continue;
    const s = shapeOf(c.text);
    if (s) push(c.start, c.end, s);
    else if (/\s/.test(c.text) && c.end - c.start > GAP) push(c.start, c.end, 'X');
  }
  const merged = [];
  for (const g of seg) {
    const last = merged[merged.length - 1];
    if (last && (g.t1 - g.t0 < MIN || last.s === g.s)) { last.t1 = g.t1; continue; }
    merged.push({ ...g });
  }
  const keys = [];
  if (merged.length && merged[0].t0 > 0.02) keys.push([0, 'X']);
  for (const g of merged) keys.push([r2(g.t0), g.s]);
  const end = merged.length ? merged[merged.length - 1].t1 : 0;
  keys.push([r2(end), 'X']);
  return { v: 1, d: r2(end), k: keys.filter((k, i) => i === 0 || k[1] !== keys[i - 1][1]) };
}

const lines = readLines(SCRIPT);
const mp3s = fs.readdirSync(DIR).filter(f => f.endsWith('.mp3')).sort();
const jobs = [], noLine = [];
for (const f of mp3s) {
  const name = f.slice(0, -4), id = name.replace(/-\d+$/, ''); // takes like houseG-2 share their id's line
  const text = lines.get(name) ?? lines.get(id);
  if (!text) { noLine.push(f); continue; }
  jobs.push({ file: f, name, text, out: path.join(DIR, name + '.lips.json'), cache: path.join(CACHE, name + '.json') });
}
const rel = p => path.relative(ROOT, p);
const write = (j, al) => fs.writeFileSync(j.out, JSON.stringify(toKeys(al)) + '\n');

console.log(`${LANG === 'ua' ? 'Ukrainian' : 'English'}: ${mp3s.length} mp3 files in ${rel(DIR)}, ${jobs.length} with a line in the script.`);
if (noLine.length) console.log(`No line in the script, skipped: ${noLine.join(', ')}`);

if (REBUILD) {
  let n = 0;
  for (const j of jobs) if (fs.existsSync(j.cache)) { write(j, JSON.parse(fs.readFileSync(j.cache, 'utf8'))); n++; }
  console.log(`Rebuilt ${n} .lips.json files from ${rel(CACHE)}, no API calls.`);
  process.exit(0);
}

const todo = jobs.filter(j => !fs.existsSync(j.out));
const secs = todo.reduce((n, j) => n + fs.statSync(path.join(DIR, j.file)).size, 0) / 8000; // mp3_44100_64 is 8000 bytes a second
console.log(`To align: ${todo.length} files, about ${Math.round(secs)} s of audio (${jobs.length - todo.length} already have .lips.json and are skipped).`);
if (DRY || !todo.length) process.exit(0);

const key = readKey();
if (!key) { console.error('ELEVENLABS_API_KEY is empty in .env. Add your key there and run again.'); process.exit(1); }

async function align(j) {
  const audio = fs.readFileSync(path.join(DIR, j.file));
  for (let attempt = 1; ; attempt++) {
    const form = new FormData();
    form.append('file', new Blob([audio], { type: 'audio/mpeg' }), j.file);
    form.append('text', j.text);
    const res = await fetch(API, { method: 'POST', headers: { 'xi-api-key': key }, body: form });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < 4) { await new Promise(r => setTimeout(r, 4000 * attempt)); continue; }
    const body = (await res.text()).slice(0, 300).replaceAll(key, '***');
    throw Object.assign(new Error(`${res.status} ${body}`), { status: res.status });
  }
}

fs.mkdirSync(CACHE, { recursive: true });
let done = 0, failed = [], keys = 0, worst = null;
for (const j of todo) {
  try {
    const al = fs.existsSync(j.cache) ? JSON.parse(fs.readFileSync(j.cache, 'utf8')) : await align(j);
    fs.writeFileSync(j.cache, JSON.stringify(al));
    write(j, al);
    const lips = JSON.parse(fs.readFileSync(j.out, 'utf8'));
    done++; keys += lips.k.length;
    if (typeof al.loss === 'number' && (!worst || al.loss > worst.loss)) worst = { name: j.name, loss: al.loss };
    console.log(`${done + failed.length}/${todo.length}  ${j.name}  ${lips.d}s  ${lips.k.length} keys  loss ${al.loss?.toFixed?.(3) ?? '?'}  ${j.text}`);
  } catch (e) {
    failed.push(j.name);
    console.error(`${done + failed.length}/${todo.length}  ${j.name}  failed: ${e.message}`);
    if (e.status === 401 || e.status === 403) {
      console.error('The key was refused. Give it the Forced Alignment permission in ElevenLabs (Developers → API keys) and run again; finished files are kept.');
      break;
    }
  }
}
console.log(`\nDone: ${done} aligned, ${failed.length} failed${failed.length ? ' (' + failed.join(', ') + ')' : ''}, ${todo.length - done - failed.length} not tried.`);
if (done) console.log(`${keys} mouth keys in all, about ${Math.round(keys / done)} a line.${worst ? ` Least sure match: ${worst.name} (loss ${worst.loss.toFixed(3)}).` : ''}`);
if (failed.length) process.exit(1);
