// ═══════════════════════════════════════════════════════
// MONSOON WATCH — Satellite Map Renderer
// Composites real NASA MODIS imagery with procedural
// cloud/rain overlays for each scenario + band.
// ═══════════════════════════════════════════════════════
import { fetchSatImage } from './imagery.js';

// Track the current image load so we can cancel stale requests
let _currentKey = null;

/**
 * Draw the map for a scenario + band.
 * Loads real NASA imagery in the background, then composites
 * the procedural overlay on top.
 */
export function drawMap(canvas, scenario, band) {
  if (!canvas || !scenario) return;

  const key = `${scenario.id}:${band}`;
  _currentKey = key;

  const W = canvas.width  = canvas.clientWidth  || 600;
  const H = canvas.height = canvas.clientHeight || 400;

  // Draw procedural layer immediately (no wait)
  _drawProcedural(canvas, scenario, band, W, H);

  // Then fetch real image and composite it underneath
  fetchSatImage(scenario, band)
    .then(img => {
      // Only apply if this is still the current scenario
      if (_currentKey !== key) return;
      _compositeReal(canvas, img, scenario, band);
    })
    .catch(() => {
      // Real image failed — procedural-only is fine, already drawn
    });
}

// ── Composite real image under procedural overlay ──────
function _compositeReal(canvas, img, scenario, band) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Save the procedural overlay pixels
  const overlay = ctx.getImageData(0, 0, W, H);

  // Draw real image as base
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);

  // Apply a dark tint to make it feel like a satellite display
  ctx.fillStyle = 'rgba(4,9,15,0.45)';
  ctx.fillRect(0, 0, W, H);

  // Blend procedural overlay on top with 'screen' blending
  // We do this manually: for each pixel, screen blend
  const base = ctx.getImageData(0, 0, W, H);
  const bd = base.data;
  const od = overlay.data;

  for (let i = 0; i < bd.length; i += 4) {
    // Screen blend: 1 - (1-a)(1-b)
    const or_ = od[i]   / 255;
    const og  = od[i+1] / 255;
    const ob  = od[i+2] / 255;
    const br  = bd[i]   / 255;
    const bg  = bd[i+1] / 255;
    const bb  = bd[i+2] / 255;

    // Only blend where procedural has significant signal (cloud pixels)
    const signal = (or_ + og + ob) / 3;
    if (signal > 0.08) {
      bd[i]   = Math.round((1 - (1 - or_) * (1 - br)) * 255);
      bd[i+1] = Math.round((1 - (1 - og)  * (1 - bg)) * 255);
      bd[i+2] = Math.round((1 - (1 - ob)  * (1 - bb)) * 255);
    }
    bd[i+3] = 255;
  }

  ctx.putImageData(base, 0, 0);

  // Re-draw UI elements on top
  _drawGrid(ctx, W, H);
  _drawColorbar(ctx, W, H, band);
  if (['convective_burst','btd_challenge','coast_storm'].includes(scenario.mapType)) {
    const seed = [...(scenario.id || 'x')].reduce((a, c) => a + c.charCodeAt(0) * 31, 0);
    _drawConvectiveMarkers(ctx, W, H, mulberry32(seed), scenario);
  }

  // Attribution
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '8px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('NASA MODIS / GIBS', 6, H - 6);
}

// ── Procedural layer (drawn immediately) ──────────────
function _drawProcedural(canvas, scenario, band, W, H) {
  try {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#04090f';
    ctx.fillRect(0, 0, W, H);

    _drawLand(ctx, W, H);

    const seed = [...(scenario.id || 'x')].reduce((a, c) => a + c.charCodeAt(0) * 31, 0)
               + (band.charCodeAt(0) * 7);
    const rng = mulberry32(seed);

    const COV = {
      convective_burst:.82, active_monsoon:.86, stratiform:.79,
      shallow_warm:.50,     orographic:.80,     fy4a:.84,
      btd_challenge:.80,    gpm_radar:.74,      kalpana:.72,
      coast_storm:.78,      conv_vs_strat:.78,  geo_diag:.74,
      ne_monsoon:.80,
    };
    const cov = COV[scenario.mapType] ?? .75;
    const threshold = 1 - cov;

    const n1 = makeNoiseGrid( 6,  5, W, H, rng);
    const n2 = makeNoiseGrid(12, 10, W, H, rng);
    const n3 = makeNoiseGrid(24, 20, W, H, rng);
    const env = makeEnvelope(scenario.mapType, W, H, rng);

    const img = ctx.createImageData(W, H);
    const d = img.data;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = bilerp(n1, x, y, W, H) * .50
                + bilerp(n2, x, y, W, H) * .35
                + bilerp(n3, x, y, W, H) * .15;
        const ev = v * env(x, y);
        const i = (y * W + x) * 4;

        if (ev < threshold) {
          d[i] = 8; d[i+1] = 18; d[i+2] = 36; d[i+3] = 255;
          continue;
        }
        const t = Math.min((ev - threshold) / (1 - threshold), 1);
        const [r, g, b] = toRGB(t, band);
        d[i] = r; d[i+1] = g; d[i+2] = b; d[i+3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);

    _drawGrid(ctx, W, H);
    _drawColorbar(ctx, W, H, band);

    if (['convective_burst','btd_challenge','coast_storm'].includes(scenario.mapType)) {
      _drawConvectiveMarkers(ctx, W, H, rng, scenario);
    }
  } catch (e) {
    console.error('drawMap error:', e);
    _fallback(canvas);
  }
}

// ── Land silhouette ────────────────────────────────────
function _drawLand(ctx, W, H) {
  const pts = [
    [.28,.02],[.72,.02],[.76,.12],[.80,.28],[.78,.48],
    [.72,.62],[.68,.75],[.60,.88],[.50,.98],[.44,.88],
    [.38,.75],[.30,.60],[.24,.45],[.22,.28],[.26,.12]
  ];
  ctx.fillStyle = 'rgba(18,52,18,.4)';
  ctx.strokeStyle = 'rgba(56,189,248,.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  pts.forEach(([x, y], i) =>
    i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56,189,248,.08)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  pts.forEach(([x, y], i) =>
    i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H));
  ctx.closePath();
  ctx.stroke();
}

// ── Grid lines ─────────────────────────────────────────
function _drawGrid(ctx, W, H) {
  ctx.strokeStyle = 'rgba(56,189,248,.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += W / 7) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += H / 5) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

// ── Colorbar ───────────────────────────────────────────
function _drawColorbar(ctx, W, H, band) {
  const bw = 10, bh = 80, bx = W - 32, by = H - 100;
  const gr = ctx.createLinearGradient(0, by, 0, by + bh);

  if (band === 'IR') {
    gr.addColorStop(0,   '#ffffff');
    gr.addColorStop(.35, '#b4dcff');
    gr.addColorStop(.65, '#50c8b4');
    gr.addColorStop(1,   '#dcb43c');
  } else if (band === 'WV') {
    gr.addColorStop(0,   '#f5f5ff');
    gr.addColorStop(.5,  '#a078ff');
    gr.addColorStop(1,   '#322882');
  } else {
    gr.addColorStop(0,   '#f05050');
    gr.addColorStop(.45, '#fada50');
    gr.addColorStop(1,   '#3cb4dc');
  }

  ctx.fillStyle = gr;
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = 'rgba(255,255,255,.2)';
  ctx.lineWidth = .5;
  ctx.strokeRect(bx, by, bw, bh);

  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.font = '7px monospace';
  const tl = band === 'IR' ? '200K' : band === 'WV' ? 'DRY' : '+';
  const bl = band === 'IR' ? '275K' : band === 'WV' ? 'WET' : '−';
  ctx.fillText(tl, bx + bw + 3, by + 8);
  ctx.fillText(bl, bx + bw + 3, by + bh);
}

// ── Convective markers ─────────────────────────────────
function _drawConvectiveMarkers(ctx, W, H, rng, scenario) {
  const n = 1 + Math.floor(rng() * 2);
  for (let k = 0; k < n; k++) {
    const cx = W * (.3 + rng() * .4);
    const cy = H * (.3 + rng() * .4);
    const r  = 8 + rng() * 12;

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.5);
    grd.addColorStop(0,   'rgba(248,113,113,.25)');
    grd.addColorStop(.5,  'rgba(251,191,36,.08)');
    grd.addColorStop(1,   'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function _fallback(canvas) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width  = canvas.clientWidth  || 600;
  const H = canvas.height = canvas.clientHeight || 400;
  ctx.fillStyle = '#0d1525';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(56,189,248,.3)';
  ctx.font = '13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Satellite data unavailable', W / 2, H / 2);
}

// ── Radar sweep animation ──────────────────────────────
let _sweepAnim = null;

export function startSweep(sweepCanvas) {
  if (_sweepAnim) cancelAnimationFrame(_sweepAnim);
  let angle = 0;
  const ctx = sweepCanvas.getContext('2d');

  function frame() {
    const W = sweepCanvas.width  = sweepCanvas.clientWidth  || 600;
    const H = sweepCanvas.height = sweepCanvas.clientHeight || 400;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const r  = Math.max(W, H) * .7;

    // Sweep wedge
    ctx.save();
    ctx.globalAlpha = .12;
    ctx.fillStyle = 'rgba(56,189,248,1)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle - Math.PI / 6, angle, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Sweep line
    ctx.save();
    ctx.globalAlpha = .4;
    ctx.strokeStyle = 'rgba(56,189,248,.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.stroke();
    ctx.restore();

    // Center dot
    ctx.save();
    ctx.globalAlpha = .5;
    ctx.fillStyle = 'rgba(56,189,248,1)';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Range rings
    ctx.save();
    ctx.globalAlpha = .05;
    ctx.strokeStyle = 'rgba(56,189,248,1)';
    ctx.lineWidth = 1;
    [.25, .5, .75, 1].forEach(f => {
      ctx.beginPath();
      ctx.arc(cx, cy, r * f, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();

    angle += .018;
    _sweepAnim = requestAnimationFrame(frame);
  }
  frame();
}

export function stopSweep() {
  if (_sweepAnim) { cancelAnimationFrame(_sweepAnim); _sweepAnim = null; }
}

// ── Noise utilities ────────────────────────────────────
function mulberry32(a) {
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, 1 | t);
    t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function makeNoiseGrid(gx, gy, W, H, rng) {
  const g = new Float32Array((gx + 1) * (gy + 1));
  for (let i = 0; i < g.length; i++) g[i] = rng();
  return { g, gx, gy };
}

function bilerp({ g, gx, gy }, x, y, W, H) {
  const fx = x / W * gx, fy = y / H * gy;
  const ix = Math.min(Math.floor(fx), gx - 1);
  const iy = Math.min(Math.floor(fy), gy - 1);
  const tx = fx - ix, ty = fy - iy;
  const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
  const get = (a, b) => g[Math.min(b, gy) * (gx + 1) + Math.min(a, gx)];
  return get(ix,   iy)   * (1 - sx) * (1 - sy)
       + get(ix+1, iy)   *      sx  * (1 - sy)
       + get(ix,   iy+1) * (1 - sx) *      sy
       + get(ix+1, iy+1) *      sx  *      sy;
}

function makeEnvelope(type, W, H, rng) {
  const cx = W / 2, cy = H / 2;
  if (['convective_burst','coast_storm','fy4a','btd_challenge','ne_monsoon'].includes(type)) {
    const ex = W * (.35 + rng() * .3), ey = H * (.35 + rng() * .3);
    const rx = W * .42, ry = H * .44;
    return (x, y) => Math.max(0, 1 - Math.sqrt(((x-ex)/rx)**2 + ((y-ey)/ry)**2) * .85);
  }
  if (['active_monsoon','conv_vs_strat'].includes(type)) {
    return (x, y) => {
      const t = (y - H * .1) / (H * .85);
      if (t < 0 || t > 1) return .25;
      return Math.sin(t * Math.PI * 2.5 + x / W * 1.5) * .2 + .8;
    };
  }
  if (type === 'orographic') {
    const rx = W * .28;
    return (x, y) => Math.max(.2, 1 - Math.abs(x - rx) / (W * .26) * .9);
  }
  if (['stratiform','gpm_radar','geo_diag','kalpana'].includes(type)) {
    return (x, y) => {
      const d = Math.sqrt(((x-cx)/W)**2 + ((y-cy)/H)**2);
      return Math.max(.55, 1 - d * .35);
    };
  }
  return () => 1;
}

function toRGB(t, band) {
  const L = (a, b, f) => Math.round(a + (b - a) * Math.max(0, Math.min(1, f)));
  if (band === 'IR') {
    if (t < .20) return [255, 255, 255];
    if (t < .45) { const f = (t-.20)/.25; return [L(255,180,f), L(255,220,f), 255]; }
    if (t < .70) { const f = (t-.45)/.25; return [L(180,80,f),  L(220,200,f), L(255,180,f)]; }
    const f = (t-.70)/.30; return [L(80,220,f), L(200,180,f), L(180,55,f)];
  }
  if (band === 'WV') {
    if (t < .33) return [245, 245, 255];
    if (t < .66) { const f = (t-.33)/.33; return [L(245,160,f), L(245,120,f), 255]; }
    const f = (t-.66)/.34; return [L(160,50,f), L(120,40,f), L(255,130,f)];
  }
  // BTD
  if (t < .33) return [240, 80, 80];
  if (t < .66) { const f = (t-.33)/.33; return [L(240,250,f), L(80,220,f), L(80,50,f)]; }
  const f = (t-.66)/.34; return [L(250,55,f), L(220,178,f), L(50,218,f)];
}
