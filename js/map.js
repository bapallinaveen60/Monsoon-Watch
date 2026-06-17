// ═══════════════════════════════════════════════════════
// MONSOON WATCH — Satellite Map Renderer v3
//
// Two-phase rendering:
//   Phase 1 (instant): dark placeholder + loading shimmer
//   Phase 2 (on image load): real NASA image fills canvas,
//     then lightweight UI annotations drawn on top only
//
// The procedural cloud blobs are ONLY used when no real
// image is available (offline / fetch failed).
// ═══════════════════════════════════════════════════════
import { STATIONS } from './scenarios.js';
import { fetchSatImage, SCENARIO_META } from './imagery.js';

let _currentKey = null;

export function drawMap(canvas, scenario, band) {
  if (!canvas || !scenario) return;

  const key = `${scenario.id}:${band}`;
  _currentKey = key;

  const W = canvas.width  = canvas.clientWidth  || 600;
  const H = canvas.height = canvas.clientHeight || 400;

  // Phase 1: dark placeholder immediately
  _drawPlaceholder(canvas, W, H);

  // Phase 2: real image → draw it clean, annotations on top
  fetchSatImage(scenario, band)
    .then(img => {
      if (_currentKey !== key) return;   // stale, skip
      _drawReal(canvas, img, scenario, band);
    })
    .catch(() => {
      // Offline fallback: procedural only
      if (_currentKey !== key) return;
      _drawProcedural(canvas, scenario, band, W, H);
    });
}

// ── Phase 1: dark placeholder while image loads ────────
function _drawPlaceholder(canvas, W, H) {
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#060e1c';
  ctx.fillRect(0, 0, W, H);

  // Subtle grid so it doesn't look broken
  ctx.strokeStyle = 'rgba(56,189,248,.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += W / 7) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += H / 5) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Loading text
  ctx.fillStyle = 'rgba(56,189,248,.2)';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Loading satellite imagery…', W / 2, H / 2);
}

// ── Phase 2: real NASA image — clean render ────────────
function _drawReal(canvas, img, scenario, band) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // 1. Draw the real image filling the entire canvas
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);

  // 2. Very light dark vignette to push UI elements forward
  //    — much lighter than before (0.18 not 0.45)
  const vignette = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, H*0.85);
  vignette.addColorStop(0, 'rgba(4,9,15,0)');
  vignette.addColorStop(1, 'rgba(4,9,15,0.35)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // 3. Annotations only — no cloud blobs
  _drawGrid(ctx, W, H);
  _drawColorbar(ctx, W, H, band);

  // V2 Overlays
  _drawWindVectors(ctx, W, H, scenario.mapType);
  _drawStormTracking(ctx, W, H, scenario.mapType);
  _drawStationOverlay(ctx, W, H, scenario);

  // 4. Convective core markers (small glows, not opaque blobs)
  if (['convective_burst','btd_challenge','coast_storm'].includes(scenario.mapType)) {
    const seed = [...(scenario.id||'x')].reduce((a,c) => a + c.charCodeAt(0)*31, 0);
    _drawConvectiveMarkers(ctx, W, H, mulberry32(seed));
  }

  // 5. Attribution
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '8px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('NASA MODIS · GIBS', 6, H - 6);
}

// ── Offline fallback: procedural cloud simulation ──────
function _drawProcedural(canvas, scenario, band, W, H) {
  try {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#04090f';
    ctx.fillRect(0, 0, W, H);
    _drawLand(ctx, W, H);

    const seed = [...(scenario.id||'x')].reduce((a,c) => a + c.charCodeAt(0)*31, 0)
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
        const v = bilerp(n1,x,y,W,H)*.50 + bilerp(n2,x,y,W,H)*.35 + bilerp(n3,x,y,W,H)*.15;
        const ev = v * env(x, y);
        const i = (y*W+x)*4;
        if (ev < threshold) { d[i]=8; d[i+1]=18; d[i+2]=36; d[i+3]=255; continue; }
        const t = Math.min((ev-threshold)/(1-threshold), 1);
        const [r,g,b] = toRGB(t, band);
        d[i]=r; d[i+1]=g; d[i+2]=b; d[i+3]=255;
      }
    }
    ctx.putImageData(img, 0, 0);
    _drawGrid(ctx, W, H);
    _drawColorbar(ctx, W, H, band);

    // V2 Overlays
    _drawWindVectors(ctx, W, H, scenario.mapType);
    _drawStormTracking(ctx, W, H, scenario.mapType);
    _drawStationOverlay(ctx, W, H, scenario);

    if (['convective_burst','btd_challenge','coast_storm'].includes(scenario.mapType)) {
      _drawConvectiveMarkers(ctx, W, H, rng);
    }

    // Offline label
    ctx.fillStyle = 'rgba(251,191,36,.5)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('⚠ Offline — simulated imagery', 6, H - 6);
  } catch(e) {
    console.error('Procedural draw error:', e);
  }
}

// ── Land silhouette (used in offline mode only) ────────
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
  pts.forEach(([x,y],i) => i ? ctx.lineTo(x*W,y*H) : ctx.moveTo(x*W,y*H));
  ctx.closePath(); ctx.fill(); ctx.stroke();
}

// ── Grid ───────────────────────────────────────────────
function _drawGrid(ctx, W, H) {
  ctx.strokeStyle = 'rgba(56,189,248,.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += W/7) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += H/5) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
  }
}

// ── Colorbar ───────────────────────────────────────────
function _drawColorbar(ctx, W, H, band) {
  const bw=10, bh=80, bx=W-32, by=H-100;
  const gr = ctx.createLinearGradient(0, by, 0, by+bh);
  if (band==='IR') {
    gr.addColorStop(0,'#ffffff'); gr.addColorStop(.35,'#b4dcff');
    gr.addColorStop(.65,'#50c8b4'); gr.addColorStop(1,'#dcb43c');
  } else if (band==='WV') {
    gr.addColorStop(0,'#f5f5ff'); gr.addColorStop(.5,'#a078ff'); gr.addColorStop(1,'#322882');
  } else {
    gr.addColorStop(0,'#f05050'); gr.addColorStop(.45,'#fada50'); gr.addColorStop(1,'#3cb4dc');
  }
  ctx.fillStyle = gr;
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = 'rgba(255,255,255,.3)';
  ctx.lineWidth = .5;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.fillStyle = 'rgba(255,255,255,.65)';
  ctx.font = '7px monospace';
  ctx.textAlign = 'left';
  const tl = band==='IR'?'200K':band==='WV'?'DRY':'+';
  const bl = band==='IR'?'275K':band==='WV'?'WET':'−';
  ctx.fillText(tl, bx+bw+3, by+8);
  ctx.fillText(bl, bx+bw+3, by+bh);
}

// ── Convective markers — subtle glows only ─────────────
function _drawConvectiveMarkers(ctx, W, H, rng) {
  const n = 1 + Math.floor(rng() * 2);
  for (let k = 0; k < n; k++) {
    const cx = W * (.25 + rng() * .5);
    const cy = H * (.25 + rng() * .5);
    const r  = 18 + rng() * 20;

    // Outer glow ring only — no opaque fill
    const grd = ctx.createRadialGradient(cx, cy, r*0.3, cx, cy, r*2);
    grd.addColorStop(0,   'rgba(248,113,113,.22)');
    grd.addColorStop(.6,  'rgba(251,191,36,.06)');
    grd.addColorStop(1,   'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, r*2, 0, Math.PI*2);
    ctx.fill();

    // Small bright centre dot
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI*2);
    ctx.fill();
  }
}

// ── Radar sweep ────────────────────────────────────────
let _sweepAnim = null;

export function startSweep(sweepCanvas) {
  if (_sweepAnim) cancelAnimationFrame(_sweepAnim);
  let angle = 0;
  const ctx = sweepCanvas.getContext('2d');

  function frame() {
    const W = sweepCanvas.width  = sweepCanvas.clientWidth  || 600;
    const H = sweepCanvas.height = sweepCanvas.clientHeight || 400;
    ctx.clearRect(0, 0, W, H);
    const cx = W/2, cy = H/2, r = Math.max(W,H)*.7;

    ctx.save(); ctx.globalAlpha = .10;
    ctx.fillStyle = 'rgba(56,189,248,1)';
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx, cy, r, angle-Math.PI/6, angle, false);
    ctx.closePath(); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha = .35;
    ctx.strokeStyle = 'rgba(56,189,248,.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(angle)*r, cy+Math.sin(angle)*r);
    ctx.stroke(); ctx.restore();

    ctx.save(); ctx.globalAlpha = .45;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(cx,cy,3,0,Math.PI*2); ctx.fill(); ctx.restore();

    ctx.save(); ctx.globalAlpha = .04;
    ctx.strokeStyle = 'rgba(56,189,248,1)'; ctx.lineWidth = 1;
    [.25,.5,.75,1].forEach(f => {
      ctx.beginPath(); ctx.arc(cx,cy,r*f,0,Math.PI*2); ctx.stroke();
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

// ── Noise utilities (offline fallback only) ────────────
function mulberry32(a) {
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t^t>>>15, 1|t);
    t = (t + Math.imul(t^t>>>7, 61|t)) ^ t;
    return ((t^t>>>14)>>>0) / 4294967296;
  };
}

function makeNoiseGrid(gx, gy, W, H, rng) {
  const g = new Float32Array((gx+1)*(gy+1));
  for (let i=0; i<g.length; i++) g[i]=rng();
  return {g,gx,gy};
}

function bilerp({g,gx,gy}, x, y, W, H) {
  const fx=x/W*gx, fy=y/H*gy;
  const ix=Math.min(Math.floor(fx),gx-1), iy=Math.min(Math.floor(fy),gy-1);
  const tx=fx-ix, ty=fy-iy;
  const sx=tx*tx*(3-2*tx), sy=ty*ty*(3-2*ty);
  const get=(a,b)=>g[Math.min(b,gy)*(gx+1)+Math.min(a,gx)];
  return get(ix,iy)*(1-sx)*(1-sy)+get(ix+1,iy)*sx*(1-sy)
       + get(ix,iy+1)*(1-sx)*sy+get(ix+1,iy+1)*sx*sy;
}

function makeEnvelope(type, W, H, rng) {
  const cx=W/2, cy=H/2;
  if (['convective_burst','coast_storm','fy4a','btd_challenge','ne_monsoon'].includes(type)) {
    const ex=W*(.35+rng()*.3), ey=H*(.35+rng()*.3), rx=W*.42, ry=H*.44;
    return (x,y)=>Math.max(0,1-Math.sqrt(((x-ex)/rx)**2+((y-ey)/ry)**2)*.85);
  }
  if (['active_monsoon','conv_vs_strat'].includes(type)) {
    return (x,y)=>{const t=(y-H*.1)/(H*.85);if(t<0||t>1)return .25;return Math.sin(t*Math.PI*2.5+x/W*1.5)*.2+.8;};
  }
  if (type==='orographic') {
    const rx=W*.28; return (x,y)=>Math.max(.2,1-Math.abs(x-rx)/(W*.26)*.9);
  }
  if (['stratiform','gpm_radar','geo_diag','kalpana'].includes(type)) {
    return (x,y)=>{const d=Math.sqrt(((x-cx)/W)**2+((y-cy)/H)**2);return Math.max(.55,1-d*.35);};
  }
  return ()=>1;
}

function toRGB(t, band) {
  const L=(a,b,f)=>Math.round(a+(b-a)*Math.max(0,Math.min(1,f)));
  if (band==='IR') {
    if (t<.20) return [255,255,255];
    if (t<.45) {const f=(t-.20)/.25;return[L(255,180,f),L(255,220,f),255];}
    if (t<.70) {const f=(t-.45)/.25;return[L(180,80,f),L(220,200,f),L(255,180,f)];}
    const f=(t-.70)/.30;return[L(80,220,f),L(200,180,f),L(180,55,f)];
  }
  if (band==='WV') {
    if (t<.33) return [245,245,255];
    if (t<.66) {const f=(t-.33)/.33;return[L(245,160,f),L(245,120,f),255];}
    const f=(t-.66)/.34;return[L(160,50,f),L(120,40,f),L(255,130,f)];
  }
  if (t<.33) return [240,80,80];
  if (t<.66) {const f=(t-.33)/.33;return[L(240,250,f),L(80,220,f),L(80,50,f)];}
  const f=(t-.66)/.34;return[L(250,55,f),L(220,178,f),L(50,218,f)];
}

function _drawStationOverlay(ctx, W, H, scenario) {
  if (!scenario || !scenario.station) return;
  const stationMeta = STATIONS[scenario.station];
  if (!stationMeta) return;

  const meta = SCENARIO_META[scenario.id] || SCENARIO_META[scenario.mapType] || SCENARIO_META._default;
  const [minLon, minLat, maxLon, maxLat] = meta.bbox;
  const [lat, lon] = stationMeta.coord;

  // Map lon/lat to canvas x/y
  const x = ((lon - minLon) / (maxLon - minLon)) * W;
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * H;

  // Draw scope target
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 1.5;

  // Outer dashed circle
  ctx.save();
  ctx.strokeStyle = '#00f2fe';
  ctx.setLineDash([3, 2]);
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Inner crosshair
  ctx.beginPath();
  ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y);
  ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6);
  ctx.stroke();

  // Center solid dot
  ctx.fillStyle = '#ff073a';
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Label
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(stationMeta.name.split(' ')[0], x + 10, y + 3);
}

function _drawWindVectors(ctx, W, H, mapType) {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
  ctx.fillStyle = 'rgba(0, 242, 254, 0.08)';
  ctx.lineWidth = 1;

  const spacing = 45;
  for (let x = spacing; x < W; x += spacing) {
    for (let y = spacing; y < H; y += spacing) {
      let dx = 15;
      let dy = 0;

      if (['coast_storm', 'btd_challenge'].includes(mapType)) {
        const cx = W / 2;
        const cy = H / 2;
        const rx = x - cx;
        const ry = y - cy;
        const dist = Math.sqrt(rx * rx + ry * ry) || 1;
        dx = (-ry / dist) * 14;
        dy = (rx / dist) * 14;
      } else if (mapType === 'orographic') {
        dx = 15;
        dy = -2;
      } else {
        dx = 12;
        dy = -8;
      }

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx, y + dy);
      ctx.stroke();

      const angle = Math.atan2(dy, dx);
      ctx.beginPath();
      ctx.moveTo(x + dx, y + dy);
      ctx.lineTo(x + dx - 4 * Math.cos(angle - Math.PI / 6), y + dy - 4 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x + dx - 4 * Math.cos(angle + Math.PI / 6), y + dy - 4 * Math.sin(angle + Math.PI / 6));
      ctx.fill();
    }
  }
  ctx.restore();
}

function _drawStormTracking(ctx, W, H, mapType) {
  if (!['convective_burst', 'coast_storm', 'btd_challenge'].includes(mapType)) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 7, 58, 0.4)';
  ctx.fillStyle = 'rgba(255, 7, 58, 0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]);

  const startX = W * 0.4;
  const startY = H * 0.6;
  const endX = W * 0.55;
  const endY = H * 0.35;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  const angle = Math.atan2(endY - startY, endX - startX);
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - 8 * Math.cos(angle - Math.PI / 6), endY - 8 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(endX - 8 * Math.cos(angle + Math.PI / 6), endY - 8 * Math.sin(angle + Math.PI / 6));
  ctx.fill();

  ctx.fillStyle = '#ff073a';
  ctx.font = 'bold 7px monospace';
  ctx.fillText('STORM PATH PROJECTION', endX + 8, endY - 4);
  ctx.restore();
}
