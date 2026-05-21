// Run with: node generate-icons.js
// Generates all PWA icon sizes using pure Node.js (no canvas dependency)
// Creates SVG icons and converts to PNG via sharp if available,
// otherwise writes SVG files that browsers can use directly.

const fs   = require('fs');
const path = require('path');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const DIR   = path.join(__dirname, 'icons');

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR);

// Generate SVG icon for each size
function makeSVG(size) {
  const pad  = Math.round(size * 0.12);
  const r    = Math.round(size * 0.18);
  const cx   = size / 2;
  const cy   = size / 2;
  const fs1  = Math.round(size * 0.28);  // "MW" font size
  const fs2  = Math.round(size * 0.10);  // subtitle font size
  const y1   = Math.round(size * 0.52);
  const y2   = Math.round(size * 0.68);

  // Radar rings
  const rings = [0.22, 0.38, 0.54].map(f => {
    const rr = Math.round(size * f);
    return `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="rgba(56,189,248,0.15)" stroke-width="${Math.max(1,size*0.008)}"/>`;
  }).join('');

  // Sweep wedge
  const sweepR = size * 0.48;
  const angle  = -Math.PI / 6;
  const x1s = cx + Math.cos(0) * sweepR;
  const y1s = cy + Math.sin(0) * sweepR;
  const x2s = cx + Math.cos(angle) * sweepR;
  const y2s = cy + Math.sin(angle) * sweepR;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#0d1e3a"/>
      <stop offset="100%" stop-color="#080d18"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(56,189,248,0.2)"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>

  <!-- Glow -->
  <circle cx="${cx}" cy="${cy}" r="${size*0.45}" fill="url(#glow)"/>

  <!-- Radar rings -->
  ${rings}

  <!-- Sweep wedge -->
  <path d="M${cx},${cy} L${x1s},${y1s} A${sweepR},${sweepR} 0 0,0 ${x2s},${y2s} Z"
    fill="rgba(56,189,248,0.18)"/>

  <!-- Sweep line -->
  <line x1="${cx}" y1="${cy}" x2="${x1s}" y2="${y1s}"
    stroke="rgba(56,189,248,0.7)" stroke-width="${Math.max(1,size*0.012)}" stroke-linecap="round"/>

  <!-- Center dot -->
  <circle cx="${cx}" cy="${cy}" r="${Math.max(2,size*0.025)}" fill="#38bdf8"/>

  <!-- Text: MW -->
  <text x="${cx}" y="${y1}"
    font-family="Arial Black, sans-serif"
    font-size="${fs1}" font-weight="900"
    fill="#ffffff" text-anchor="middle"
    letter-spacing="-1">MW</text>

  <!-- Text: subtitle -->
  <text x="${cx}" y="${y2}"
    font-family="Arial, sans-serif"
    font-size="${fs2}" font-weight="400"
    fill="rgba(56,189,248,0.8)" text-anchor="middle"
    letter-spacing="2">MONSOON</text>
</svg>`;
}

// Write SVG files (usable directly in manifest if PNG not available)
SIZES.forEach(size => {
  const svg = makeSVG(size);
  fs.writeFileSync(path.join(DIR, `icon-${size}.svg`), svg);
  console.log(`✓ icon-${size}.svg`);
});

// Try to use sharp for PNG conversion
try {
  const sharp = require('sharp');
  Promise.all(SIZES.map(size => {
    const svgBuf = Buffer.from(makeSVG(size));
    return sharp(svgBuf)
      .png()
      .toFile(path.join(DIR, `icon-${size}.png`))
      .then(() => console.log(`✓ icon-${size}.png`));
  })).then(() => {
    console.log('\nAll PNG icons generated via sharp.');
    _writeScreenshotPlaceholders();
  }).catch(e => {
    console.log('sharp PNG conversion failed:', e.message);
    _fallbackManifest();
  });
} catch {
  console.log('\nsharp not installed — SVG icons written.');
  console.log('Run: npm install sharp  then  node generate-icons.js');
  console.log('Or use the SVG icons directly (update manifest.json type to image/svg+xml).\n');
  _fallbackManifest();
}

function _writeScreenshotPlaceholders() {
  // Write minimal placeholder screenshots (solid colour)
  const wide   = makeSVG(1280).replace('width="1280" height="1280"','width="1280" height="720"');
  const narrow = makeSVG(390).replace('width="390" height="390"','width="390" height="844"');
  fs.writeFileSync(path.join(DIR, 'screenshot-wide.png'),   Buffer.from(wide));
  fs.writeFileSync(path.join(DIR, 'screenshot-narrow.png'), Buffer.from(narrow));
}

function _fallbackManifest() {
  // Patch manifest.json to use SVG icons as fallback
  const mPath = path.join(__dirname, 'manifest.json');
  let m = JSON.parse(fs.readFileSync(mPath, 'utf8'));
  m.icons = m.icons.map(i => ({
    ...i,
    src: i.src.replace('.png', '.svg'),
    type: 'image/svg+xml',
  }));
  // Remove screenshots (need real PNGs)
  delete m.screenshots;
  fs.writeFileSync(mPath, JSON.stringify(m, null, 2));
  console.log('manifest.json updated to use SVG icons.');
}
