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
  shape: 'M47 69C31 73 18 64 21 45 22 39 29 38 31 44 29 54 35 60 49 58ZM53 46C45 52 40 60 42 70L33 92 31 96H46L52 80 60 79 63 96H78L72 70C72 62 70 54 66 48ZM63 50 83 33C87 28 95 32 92 39L72 60ZM61 62 82 55C88 53 92 60 86 64L66 74Z',
  mane: 'M60 6 66 13 74 8 76 17 85 17 82 25 90 30 82 35 85 43 76 43 74 51 66 47 60 54 54 47 46 51 44 43 35 43 38 35 30 30 38 25 35 17 44 17 46 8 54 13Z',
  face: 'M60 19C69 19 74 25 74 32 74 40 67 44 60 44 53 44 46 40 46 32 46 25 51 19 60 19Z',
  marks: 'M51 27q4-3 7 0M62 27q4-3 7 0M60 31v5M55 39q5 3 10 0M60 36l-3-1M60 36l3-1',
  lines: 'M60 11v6M49 14l3 6M71 14l-3 6M40 25l6 3M80 25l-6 3M41 38l6-2M79 38l-6-2M50 47l3-5M70 47l-3-5M46 66q8-6 16-5M47 74q8-3 15-1M28 44q-2 10 4 15M73 56q4-3 8-7M70 67q5-2 10-3',
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
  shape: 'M4 66C8 46 28 36 50 38 60 27 78 25 88 36L99 51C97 58 90 60 84 60L78 62 81 84H69L65 68 41 70 44 86H32L25 68C15 72 2 75 4 66Z',
  stripe: 'M70 31 92 48 86 52 64 35ZM56 40 76 56 70 58 50 43Z',
  marks: 'M77 43a2.2 2.2 0 1 0 .1 0Z',
  lines: 'M14 58q8-10 20-12M18 64q10-8 22-9M34 52q10-4 18-2',
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
// A crest as SVG. `name` adds a ribbon with the house name, for the bigger sizes.
function svg(h, name) {
  const o = HOUSES[h], a = o.animal, n = ++uid, gold = `cG${n}`, mt = `cM${n}`, fld = `cF${n}`, pat = `cP${n}`, rib = `cR${n}`, line = o.metal === 'ink' ? '#f8d76a' : '#1a0d03', ink = o.metal === 'ink';
  const mantle = MANTLE.map(d => scroll(d, gold)).join('');
  const leaves = [[20, 92], [18, 138], [32, 188]].map(([x, y]) => `<path d="M${x} ${y}c-10-6-14-16-10-26 8 4 14 14 10 26z" fill="url(#${gold})" stroke="#2a1806" stroke-width="1"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 ${name ? 300 : 262}" aria-hidden="true"><defs>${grad(gold, METAL.gold)}${grad(mt, METAL[o.metal])}
    <radialGradient id="${fld}" cx=".42" cy=".3" r=".85"><stop offset="0" stop-color="${o.field[0]}"/><stop offset=".6" stop-color="${o.field[1]}"/><stop offset="1" stop-color="${o.field[2]}"/></radialGradient>
    <pattern id="${pat}" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M8 1 11 8 8 15 5 8Z" fill="${h === 'H' ? '#000' : '#fff'}" opacity=".07"/><circle cx="0" cy="0" r="1.1" fill="${h === 'H' ? '#000' : '#fff'}" opacity=".08"/><circle cx="16" cy="16" r="1.1" fill="${h === 'H' ? '#000' : '#fff'}" opacity=".08"/></pattern>
    ${grad(rib, ['#a9823f', '#fbf0ce', '#d9bd7c', '#fff8e0', '#a0783a'])}</defs>
    ${mantle}${leaves}${mirror(mantle + leaves)}
    <path d="${CROWN}" fill="url(#${gold})" stroke="#2a1806" stroke-width="1.6"/><circle cx="76" cy="12" r="4" fill="url(#${gold})" stroke="#2a1806"/><circle cx="106" cy="6" r="4" fill="url(#${gold})" stroke="#2a1806"/><circle cx="134" cy="6" r="4" fill="url(#${gold})" stroke="#2a1806"/><circle cx="164" cy="12" r="4" fill="url(#${gold})" stroke="#2a1806"/><path d="M88 42Q120 52 152 42" fill="none" stroke="#2a1806" stroke-width="1.4"/><circle cx="120" cy="38" r="5" fill="${o.field[0]}" stroke="#2a1806"/><circle cx="118.6" cy="36.6" r="1.4" fill="#fff" opacity=".8"/><circle cx="100" cy="36" r="3" fill="${o.field[0]}" stroke="#2a1806"/><circle cx="140" cy="36" r="3" fill="${o.field[0]}" stroke="#2a1806"/>
    <path d="${SHIELD}" fill="url(#${gold})" stroke="#2a1806" stroke-width="2"/><path d="${SHIELD_IN}" fill="url(#${fld})" stroke="#2a1806" stroke-width="1.6"/><path d="${SHIELD_IN}" fill="url(#${pat})"/>
    ${h === 'H' ? '<g opacity=".14" fill="#000"><rect x="84" y="70" width="14" height="150"/><rect x="113" y="70" width="14" height="165"/><rect x="142" y="70" width="14" height="150"/></g>' : ''}
    <path d="M74 74Q96 84 120 74" fill="none" stroke="#fff" stroke-width="1.2" opacity=".28"/>
    <g fill="url(#${gold})" stroke="#2a1806" stroke-width=".8"><circle cx="64" cy="66" r="2.6"/><circle cx="176" cy="66" r="2.6"/><circle cx="120" cy="238" r="2.6"/><circle cx="64" cy="116" r="2.2"/><circle cx="176" cy="116" r="2.2"/></g>
    <g transform="translate(66 88) scale(1.08)" stroke-linejoin="round">
      ${a.tongue ? `<path d="${a.tongue}" fill="#d43c3c"/>` : ''}
      <path d="${a.shape}" fill="url(#${mt})" stroke="${ink ? '#000' : '#1a0d03'}" stroke-width="1.4"/>
      ${a.mane ? `<path d="${a.mane}" fill="url(#${mt})" stroke="#1a0d03" stroke-width="1.4"/><path d="${a.face}" fill="url(#${mt})" stroke="#1a0d03" stroke-width="1.2"/>` : ''}
      ${a.wing ? `<path d="${a.wing}" fill="#2a1a08" opacity=".5"/>` : ''}
      ${a.stripe ? `<path d="${a.stripe}" fill="#f6e3a4"/>` : ''}
      <path d="${a.lines}" fill="none" stroke="${line}" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>
      <path d="${a.marks}" fill="${ink ? '#f6e3a4' : '#1a0d03'}" stroke="${ink ? '#f6e3a4' : '#1a0d03'}" stroke-width=".9" stroke-linecap="round"/>
    </g>
    ${name ? `<path d="M14 262 40 250 40 284 26 276 14 284Z" fill="#8f6a30" stroke="#2a1806"/><path d="M226 262 200 250 200 284 214 276 226 284Z" fill="#8f6a30" stroke="#2a1806"/><path d="M32 246Q120 266 208 246V278Q120 298 32 278Z" fill="url(#${rib})" stroke="#2a1806" stroke-width="1.6"/><path id="cT${n}" d="M38 270Q120 288 202 270" fill="none"/><text font-family="'Cormorant Garamond',Georgia,serif" font-size="19" font-weight="700" letter-spacing="1.5" fill="#2a1806" text-anchor="middle"><textPath href="#cT${n}" startOffset="50%">${name}</textPath></text>` : ''}
  </svg>`;
}
return { svg, HOUSES };
})();
if (typeof module !== 'undefined') module.exports = Crests;
