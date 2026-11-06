// The four house crests, our own drawing in code: gold scrollwork, a crown, a bevelled shield and an engraved animal. Not the official crests.
const Crests = (() => {
'use strict';
const METAL = {
  gold: ['#7a5216', '#f9e7a8', '#c4923a', '#fff4cc', '#8a5f1e'],
  silver: ['#5d666b', '#f4f7f6', '#a7b1b5', '#ffffff', '#6d767a'],
  bronze: ['#5a3a18', '#f0cf9a', '#a97a3f', '#f8e0b8', '#6a4720'],
  ink: ['#000000', '#3b3226', '#14100a', '#4a3f2e', '#000000'],
};
const LION = {
  shape: 'M71 72C82 74 88 65 85 53 83 44 86 34 90 27 86 23 92 15 96 20 101 19 101 29 95 31 91 37 90 45 92 54 95 70 83 81 69 78ZM44 36C53 32 61 39 63 49 67 57 72 63 72 72 72 78 69 83 73 88L80 92C82 95 80 97 76 97H62C60 91 58 85 53 80 51 86 47 90 44 92L49 96C50 98 48 98 46 98H33C31 93 33 88 37 84 42 78 42 72 40 66 34 62 31 54 33 45ZM41 41C33 40 26 37 20 31L13 29C9 29 9 33 12 35L10 39C14 42 19 40 23 42 29 46 35 50 42 50ZM38 54C32 54 26 52 20 49L13 50C9 52 11 56 15 56L14 60C20 61 28 61 38 63Z',
  mane: 'M39 6C48 3 57 8 61 16L68 13 65 22 74 23 67 30 74 36 66 39 70 47 61 45 60 54 53 49 47 56 42 49 34 51 35 43 28 41C27 28 29 12 39 6Z',
  face: 'M31 17C25 18 20 23 18 28L12 30 12 34 16 37 21 37 23 41 29 42C35 41 41 36 43 29 44 22 38 16 31 17Z',
  marks: 'M26 25q4-3 8 0q-4 2-8 0ZM13 31l4 1M16 36q5 1 9-2M22 41l4-5',
  lines: 'M42 11q6 7 5 16M50 12q5 7 4 16M58 19q-1 7-4 13M64 28q-5 3-8 8M62 40q-5-1-9 1M56 48q-1-5-4-8M47 50q0-5 2-9M38 46q2-4 5-7M36 22q2 5 1 10M46 57q7-2 13 2M43 68q8-3 16 1M52 77q6-3 12-1M64 66q3 6 2 12M60 88q2 3 2 8M41 88q0 4-2 8M18 33l2 3M14 53l3 3M30 44q5 3 10 3M28 55q5 1 9 2',
  shade: 'M60 50C65 58 70 64 70 72 70 78 67 83 71 88 65 86 60 78 58 70 56 62 56 54 60 50Z',
};
const SNAKE = {
  shape: 'M68 8C81 5 91 14 89 24 87 32 80 35 73 34 60 31 42 30 37 38 32 47 49 50 60 54 77 60 88 72 77 84 66 96 36 96 19 86L14 76C28 84 54 88 64 79 70 73 58 67 46 63 28 57 15 48 22 32 29 16 53 12 68 8Z',
  marks: 'M76 13a3 3 0 1 0 .1 0Z',
  tongue: 'M88 22 100 17 95 23 101 29 88 27Z',
  lines: 'M57 16l3 6M46 19l3 6M36 25l5 4M28 33l6 2M26 43l6-1M31 53l5-3M41 58l3-4M52 62l2-5M63 66l2-5M74 73l-3-4M71 83l-3-5M58 89l-2-5M45 90l0-5M32 87l1-5',
};
const RAVEN = {
  shape: 'M6 78 29 60C33 45 47 35 62 35L66 28C72 21 81 23 85 28L100 36 84 40C83 49 75 61 63 67L67 80 76 85H62L55 69 47 71 51 82 59 87H45L38 71 6 84Z',
  wing: 'M32 56C42 45 55 41 67 46 62 57 49 62 30 63Z',
  marks: 'M75 25a2.8 2.8 0 1 0 .1 0Z',
  lines: 'M38 56q12-8 24-8M36 60q12-3 24-8M45 40q6-3 12-3M70 37l12 1M10 78l19-10M14 80l18-8M64 41q2 10-4 18',
};
const BADGER = {
  shape: 'M5 72C3 60 11 47 27 42 41 37 55 37 66 41 72 36 81 36 88 43L99 57C100 61 96 64 92 62 88 65 81 65 77 63 75 67 73 69 71 71L73 83 78 87C79 89 77 90 75 90H64L60 74C52 76 44 76 38 76L36 85 41 89C42 91 40 91 38 91H27L24 74C20 74 16 76 12 78 8 80 5 77 5 72Z',
  head: 'M67 42C72 37 81 37 88 44L99 57C100 61 96 64 92 62 88 65 81 65 77 63 72 58 68 50 67 42Z',
  ear: 'M69 40C68 34 74 32 77 36 77 39 73 42 69 40Z',
  stripe: 'M71 41 76 39 96 56 92 59ZM84 41 88 44 99 57 96 57Z',
  marks: 'M80 50.5a2 2 0 1 0 .1 0ZM96 59a2 2 0 1 0 .1 0Z',
  lines: 'M12 60l5-6M18 66l5-7M26 52l4-6M30 62l4-7M38 48l3-6M40 60l3-6M50 44l2-6M50 56l3-6M60 44l1-6M60 56l3-6M16 74l-3 4M26 70l-2 5M36 72l-1 4M48 72l-1 4M58 70l0 4M67 62l3 5M62 74l2 8M27 76l1 8',
};
const HOUSES = {
  G: { field: ['#c02a2c', '#6b0d12', '#2e0408'], metal: 'gold', animal: LION },
  S: { field: ['#1f7a48', '#0d4227', '#04180e'], metal: 'silver', animal: SNAKE },
  R: { field: ['#2c54ad', '#14296a', '#060e2c'], metal: 'bronze', animal: RAVEN },
  H: { field: ['#f6cf56', '#d79f1f', '#8c6410'], metal: 'ink', animal: BADGER },
};
let uid = 0;
const grad = (id, c) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${c.map((s, i) => `<stop offset="${i / (c.length - 1)}" stop-color="${s}"/>`).join('')}</linearGradient>`;
// A scroll drawn three times: a dark edge, the metal, a thin highlight.
const scroll = (d, g, w = 5) => `<path d="${d}" fill="none" stroke="#2a1806" stroke-width="${w + 2.4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="url(#${g})" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff8dc" stroke-width="${w * .22}" stroke-linecap="round" opacity=".7"/>`;
const MANTLE = ['M58 74C34 58 12 70 16 92 19 108 42 108 42 92 42 84 32 82 30 89', 'M56 112C32 100 8 116 15 138 20 153 44 150 42 134 41 126 31 126 30 133', 'M62 160C42 152 20 170 30 192 37 205 58 198 54 182 52 175 43 176 43 183', 'M60 62C50 40 62 26 76 30 86 33 84 48 74 46', 'M84 228C72 232 54 226 50 212'];
const mirror = d => `<g transform="translate(240 0) scale(-1 1)">${d}</g>`;
const SHIELD = 'M60 58Q90 72 120 58 150 72 180 58 188 86 180 112V150C180 196 146 226 120 242 94 226 60 196 60 150V112C52 86 60 58 60 58Z';
const SHIELD_IN = 'M68 68Q94 79 120 68 146 79 172 68 178 88 172 112V150C172 190 142 217 120 232 98 217 68 190 68 150V112C62 88 68 68 68 68Z';
const CROWN = 'M84 44 76 14 94 28 106 8 120 26 134 8 146 28 164 14 156 44Q120 56 84 44Z';
// A crest as SVG. `name` adds a ribbon with the house name, for the bigger sizes; `shine` adds a gold glint that a page can sweep across it.
function svg(h, name, shine) {
  const o = HOUSES[h], a = o.animal, n = ++uid, gold = `cG${n}`, mt = `cM${n}`, fld = `cF${n}`, pat = `cP${n}`, rib = `cR${n}`, line = o.metal === 'ink' ? '#a89f8a' : '#1a0d03', ink = o.metal === 'ink';
  const mantle = MANTLE.map(d => scroll(d, gold)).join('');
  const leaves = [[20, 92], [18, 138], [32, 188]].map(([x, y]) => `<path d="M${x} ${y}c-10-6-14-16-10-26 8 4 14 14 10 26z" fill="url(#${gold})" stroke="#2a1806" stroke-width="1"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 ${name ? 300 : 262}" aria-hidden="true"><defs>${grad(gold, METAL.gold)}${grad(mt, METAL[o.metal])}
    <radialGradient id="${fld}" cx=".42" cy=".3" r=".85"><stop offset="0" stop-color="${o.field[0]}"/><stop offset=".6" stop-color="${o.field[1]}"/><stop offset="1" stop-color="${o.field[2]}"/></radialGradient>
    <pattern id="${pat}" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M8 1 11 8 8 15 5 8Z" fill="${h === 'H' ? '#000' : '#fff'}" opacity=".07"/><circle cx="0" cy="0" r="1.1" fill="${h === 'H' ? '#000' : '#fff'}" opacity=".08"/><circle cx="16" cy="16" r="1.1" fill="${h === 'H' ? '#000' : '#fff'}" opacity=".08"/></pattern>
    ${grad(rib, ['#a9823f', '#fbf0ce', '#d9bd7c', '#fff8e0', '#a0783a'])}</defs>
    ${mantle}${leaves}${mirror(mantle + leaves)}
    <path d="${CROWN}" fill="url(#${gold})" stroke="#2a1806" stroke-width="1.6"/><circle cx="76" cy="12" r="4" fill="url(#${gold})" stroke="#2a1806"/><circle cx="106" cy="6" r="4" fill="url(#${gold})" stroke="#2a1806"/><circle cx="134" cy="6" r="4" fill="url(#${gold})" stroke="#2a1806"/><circle cx="164" cy="12" r="4" fill="url(#${gold})" stroke="#2a1806"/><path d="M88 42Q120 52 152 42" fill="none" stroke="#2a1806" stroke-width="1.4"/><circle cx="120" cy="38" r="5" fill="${o.field[0]}" stroke="#2a1806"/><circle cx="118.6" cy="36.6" r="1.4" fill="#fff" opacity=".8"/><circle cx="100" cy="36" r="3" fill="${o.field[0]}" stroke="#2a1806"/><circle cx="140" cy="36" r="3" fill="${o.field[0]}" stroke="#2a1806"/>
    <path d="${SHIELD}" fill="url(#${gold})" stroke="#2a1806" stroke-width="2"/><path d="${SHIELD_IN}" fill="url(#${fld})" stroke="#2a1806" stroke-width="1.6"/><path d="${SHIELD_IN}" fill="url(#${pat})"/>
    ${h === 'H' ? `<clipPath id="cC${n}"><path d="${SHIELD_IN}"/></clipPath><g clip-path="url(#cC${n})" opacity=".14" fill="#000"><rect x="84" y="60" width="14" height="180"/><rect x="113" y="60" width="14" height="180"/><rect x="142" y="60" width="14" height="180"/></g>` : ''}
    <path d="M74 74Q96 84 120 74" fill="none" stroke="#fff" stroke-width="1.2" opacity=".28"/>
    ${shine ? `<clipPath id="cS${n}"><path d="${SHIELD}"/><path d="${CROWN}"/></clipPath><linearGradient id="cL${n}" x1="0" x2="1"><stop offset="0" stop-color="#fff6d8" stop-opacity="0"/><stop offset=".5" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></linearGradient>` : ''}
    <g fill="url(#${gold})" stroke="#2a1806" stroke-width=".8"><circle cx="64" cy="66" r="2.6"/><circle cx="176" cy="66" r="2.6"/><circle cx="120" cy="238" r="2.6"/><circle cx="64" cy="116" r="2.2"/><circle cx="176" cy="116" r="2.2"/></g>
    <g transform="translate(66 88) scale(1.08)" stroke-linejoin="round">
      ${a.tongue ? `<path d="${a.tongue}" fill="#d43c3c"/>` : ''}
      <path d="${a.shape}" fill="url(#${mt})" stroke="${ink ? '#000' : '#1a0d03'}" stroke-width="1.4"/>
      ${a.mane ? `<path d="${a.mane}" fill="url(#${mt})" stroke="#1a0d03" stroke-width="1.4"/><path d="${a.face}" fill="url(#${mt})" stroke="#1a0d03" stroke-width="1.2"/>` : ''}
      ${a.wing ? `<path d="${a.wing}" fill="#2a1a08" opacity=".5"/>` : ''}
      ${a.shade ? `<path d="${a.shade}" fill="#2a1806" opacity=".22"/>` : ''}
      ${a.head ? `<path d="${a.head}" fill="#f1ead8" stroke="#000" stroke-width="1"/><path d="${a.ear}" fill="#14100a" stroke="#f1ead8" stroke-width=".8"/>` : ''}
      ${a.stripe ? `<path d="${a.stripe}" fill="#14100a"/>` : ''}
      <path d="${a.lines}" fill="none" stroke="${line}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>
      <path d="${a.marks}" fill="${ink ? '#f1ead8' : '#1a0d03'}" stroke="${ink ? '#000' : '#1a0d03'}" stroke-width=".9" stroke-linecap="round"/>
    </g>
    ${shine ? `<g clip-path="url(#cS${n})"><rect class="shine" x="-150" y="0" width="70" height="260" fill="url(#cL${n})"/></g>` : ''}
    ${name ? `<path d="M14 262 40 250 40 284 26 276 14 284Z" fill="#8f6a30" stroke="#2a1806"/><path d="M226 262 200 250 200 284 214 276 226 284Z" fill="#8f6a30" stroke="#2a1806"/><path d="M32 246Q120 266 208 246V278Q120 298 32 278Z" fill="url(#${rib})" stroke="#2a1806" stroke-width="1.6"/><path id="cT${n}" d="M38 270Q120 288 202 270" fill="none"/><text font-family="'Cormorant Garamond',Georgia,serif" font-size="19" font-weight="700" letter-spacing="1.5" fill="#2a1806" text-anchor="middle"><textPath href="#cT${n}" startOffset="50%">${name}</textPath></text>` : ''}
  </svg>`;
}
return { svg, HOUSES };
})();
if (typeof module !== 'undefined') module.exports = Crests;
