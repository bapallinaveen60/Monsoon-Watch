// ═══════════════════════════════════════════════════════
// INSAT-Sim — Real Satellite Imagery via NASA GIBS
// Uses NASA Worldview Snapshots API (public domain)
// https://wvs.earthdata.nasa.gov/api/v1/snapshot
// ═══════════════════════════════════════════════════════

const WVS = 'https://wvs.earthdata.nasa.gov/api/v1/snapshot';

// Cache so we don't re-fetch the same image
const _cache = new Map();

// Request queue — max 1 in-flight at a time, 800ms between requests
let _queue = [];
let _busy  = false;

function _enqueue(fn) {
  return new Promise((resolve, reject) => {
    _queue.push({ fn, resolve, reject });
    _drain();
  });
}

function _drain() {
  if (_busy || _queue.length === 0) return;
  _busy = true;
  const { fn, resolve, reject } = _queue.shift();

  fn().then(resolve, reject).finally(() => {
    setTimeout(() => { _busy = false; _drain(); }, 900);
  });
}

/**
 * Build a NASA WVS snapshot URL for a given scenario + band.
 * Returns a URL string.
 */
export function buildImageUrl(scenario, band) {
  const meta = SCENARIO_META[scenario.id] || SCENARIO_META[scenario.mapType] || SCENARIO_META._default;
  const { date, bbox } = meta;

  // Choose layer based on band
  let layers;
  if (band === 'WV') {
    // Water vapour: MODIS cloud fraction as proxy (no direct WV layer in GIBS for India)
    layers = 'MODIS_Terra_Cloud_Fraction_Day,Coastlines_15m';
  } else if (band === 'BTD') {
    // Cloud top temperature — closest to BTD
    layers = 'MODIS_Terra_Cloud_Top_Temp_Day,Coastlines_15m';
  } else {
    // IR default: true colour + cloud top temp overlay
    layers = 'MODIS_Terra_CorrectedReflectance_TrueColor,Coastlines_15m';
  }

  const [minLon, minLat, maxLon, maxLat] = bbox;
  const params = new URLSearchParams({
    REQUEST: 'GetSnapshot',
    TIME:    date,
    BBOX:    `${minLat},${minLon},${maxLat},${maxLon}`,
    CRS:     'EPSG:4326',
    LAYERS:  layers,
    WIDTH:   '800',
    HEIGHT:  '500',
    FORMAT:  'image/jpeg',
  });

  return `${WVS}?${params.toString()}`;
}

/**
 * Fetch and cache a real satellite image for a scenario + band.
 * Queued (900ms spacing) + exponential backoff on 429 rate limit.
 * Returns a Promise<HTMLImageElement>.
 */
export function fetchSatImage(scenario, band) {
  const key = `${scenario.id}:${band}`;
  if (_cache.has(key)) return Promise.resolve(_cache.get(key));

  const url = buildImageUrl(scenario, band);

  return _enqueue(() => _fetchWithRetry(url, key, 3));
}

function _fetchWithRetry(url, cacheKey, retriesLeft, delay = 1200) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      _cache.set(cacheKey, img);
      resolve(img);
    };

    img.onerror = () => {
      if (retriesLeft > 0) {
        // Exponential backoff: 1.2s → 2.4s → 4.8s
        setTimeout(() => {
          _fetchWithRetry(url, cacheKey, retriesLeft - 1, delay * 2)
            .then(resolve, reject);
        }, delay);
      } else {
        reject(new Error('Image failed after retries: ' + url));
      }
    };

    img.src = url;
  });
}

// ── Per-scenario metadata: date + bounding box ─────────
// bbox format: [minLon, minLat, maxLon, maxLat]
// Dates chosen to match active monsoon / scenario season
// All imagery is NASA MODIS public domain

export const SCENARIO_META = {

  // ── BEGINNER ──────────────────────────────────────────
  b01: { date: '2022-07-05', bbox: [73, 7,  79, 14]  },  // Kerala coast shallow cloud
  b02: { date: '2022-07-20', bbox: [74, 10, 86, 20]  },  // Peninsular India rain detection
  b03: { date: '2022-08-12', bbox: [72, 13, 76, 19]  },  // Western Ghats convective burst
  b04: { date: '2022-07-25', bbox: [76, 17, 85, 25]  },  // Central India active monsoon
  b05: { date: '2022-09-08', bbox: [72, 14, 76, 19]  },  // Western Ghats orographic
  b06: { date: '2022-08-03', bbox: [83, 11, 93, 19]  },  // Bay of Bengal BTD
  b07: { date: '2022-07-18', bbox: [81, 19, 89, 25]  },  // Eastern India radar bright band
  b08: { date: '2022-08-22', bbox: [76, 19, 86, 26]  },  // Central India convective burst
  b09: { date: '2022-09-10', bbox: [84, 14, 94, 20]  },  // Bay of Bengal deep storm
  b10: { date: '2022-07-28', bbox: [72, 14, 76, 19]  },  // Western Ghats shallow clouds
  b11: { date: '2022-08-05', bbox: [66, 9,  75, 16]  },  // Arabian Sea shallow warm
  b12: { date: '2022-10-15', bbox: [78, 8,  83, 14]  },  // Tamil Nadu NE monsoon
  b13: { date: '2022-07-02', bbox: [76, 25, 86, 31]  },  // IGP stratiform
  b14: { date: '2022-06-18', bbox: [76, 17, 86, 25]  },  // Central India active monsoon
  b15: { date: '2022-08-30', bbox: [74, 19, 85, 27]  },  // Central India break spell
  b16: { date: '2022-07-14', bbox: [72, 13, 76, 19]  },  // Western Ghats mountain storms
  b17: { date: '2022-09-22', bbox: [66, 11, 92, 29]  },  // India-wide Kalpana
  b18: { date: '2022-08-08', bbox: [76, 19, 85, 26]  },  // Central India conv vs strat
  b19: { date: '2022-06-12', bbox: [63, 9,  73, 16]  },  // Arabian Sea shallow warm
  b20: { date: '2022-08-27', bbox: [74, 27, 85, 33]  },  // Himalayan foothills

  // ── INTERMEDIATE ──────────────────────────────────────
  i01: { date: '2022-07-06', bbox: [83, 14, 94, 21]  },  // Bay of Bengal BTD
  i02: { date: '2022-07-19', bbox: [66, 8,  98, 36]  },  // India-wide Kalpana
  i03: { date: '2022-08-25', bbox: [74, 19, 85, 27]  },  // Central India active monsoon
  i04: { date: '2022-09-08', bbox: [84, 21, 93, 27]  },  // Eastern India convective burst
  i05: { date: '2022-07-15', bbox: [84, 14, 94, 20]  },  // Bay of Bengal GPM radar
  i06: { date: '2022-06-28', bbox: [72, 13, 76, 19]  },  // Western Ghats orographic
  i07: { date: '2022-08-03', bbox: [66, 8,  98, 36]  },  // India geo diag
  i08: { date: '2022-08-12', bbox: [72, 14, 76, 19]  },  // Mountain conv vs strat
  i09: { date: '2022-09-19', bbox: [72, 14, 76, 19]  },  // Western Ghats orographic
  i10: { date: '2022-07-05', bbox: [60, 5, 100, 30]  },  // Tropical ocean BTD
  i11: { date: '2022-07-22', bbox: [66, 8,  98, 36]  },  // India convective burst
  i12: { date: '2022-08-01', bbox: [72, 13, 76, 19]  },  // Western Ghats orographic
  i13: { date: '2022-09-15', bbox: [66, 8,  98, 36]  },  // India geo diag
  i14: { date: '2022-07-28', bbox: [72, 14, 76, 19]  },  // Mountain conv vs strat
  i15: { date: '2022-08-04', bbox: [66, 8,  98, 36]  },  // India GPM radar
  i16: { date: '2022-09-10', bbox: [66, 8,  98, 36]  },  // India Kalpana
  i17: { date: '2022-07-30', bbox: [60, 5, 100, 30]  },  // Bay of Bengal GPM radar
  i18: { date: '2022-07-30', bbox: [66, 8,  98, 36]  },  // India convective burst
  i19: { date: '2022-06-16', bbox: [73, 7,  79, 14]  },  // Kerala active monsoon
  i20: { date: '2022-08-20', bbox: [72, 13, 76, 19]  },  // Western Ghats convective burst

  // ── ADVANCED ──────────────────────────────────────────
  a01: { date: '2022-07-10', bbox: [83, 14, 94, 21]  },  // Bay of Bengal BTD
  a02: { date: '2022-08-15', bbox: [66, 8,  98, 36]  },  // India Kalpana
  a03: { date: '2022-09-09', bbox: [73, 19, 86, 27]  },  // Core monsoon zone active
  a04: { date: '2022-08-18', bbox: [66, 8,  98, 36]  },  // India convective burst
  a05: { date: '2022-07-01', bbox: [60, 5, 100, 30]  },  // Bay of Bengal GPM radar
  a06: { date: '2022-07-25', bbox: [72, 13, 76, 19]  },  // Western Ghats orographic
  a07: { date: '2022-09-13', bbox: [66, 8,  98, 36]  },  // India geo diag
  a08: { date: '2022-08-04', bbox: [74, 27, 85, 33]  },  // Himalayan foothills GPM
  a09: { date: '2022-07-20', bbox: [66, 8,  98, 36]  },  // India Kalpana
  a10: { date: '2022-09-28', bbox: [72, 17, 85, 27]  },  // Central India break
  a11: { date: '2022-07-12', bbox: [66, 8,  98, 36]  },  // India geo diag
  a12: { date: '2022-08-12', bbox: [72, 13, 76, 19]  },  // Western Ghats coast storm
  a13: { date: '2022-09-05', bbox: [82, 19, 90, 25]  },  // Odisha GPM radar
  a14: { date: '2022-08-17', bbox: [60, 9,  73, 17]  },  // Arabian Sea shallow warm
  a15: { date: '2022-08-23', bbox: [72, 14, 76, 19]  },  // Mountain conv vs strat
  a16: { date: '2022-07-08', bbox: [83, 14, 94, 21]  },  // Bay of Bengal BTD
  a17: { date: '2022-08-28', bbox: [66, 8,  98, 36]  },  // India Kalpana
  a18: { date: '2022-07-16', bbox: [66, 8,  98, 36]  },  // India geo diag
  a19: { date: '2022-09-02', bbox: [66, 8,  98, 36]  },  // India active monsoon
  a20: { date: '2022-07-22', bbox: [60, 5, 100, 30]  },  // Arabian Sea stratiform

  // ── MASTER ────────────────────────────────────────────
  m01: { date: '2022-07-07', bbox: [83, 14, 94, 21]  },  // Bay of Bengal BTD
  m02: { date: '2022-08-20', bbox: [66, 8,  98, 36]  },  // India Kalpana
  m03: { date: '2022-09-12', bbox: [66, 8,  98, 36]  },  // India active monsoon
  m04: { date: '2022-08-08', bbox: [66, 8,  98, 36]  },  // India convective burst
  m05: { date: '2022-07-25', bbox: [60, 5, 100, 30]  },  // GPM radar multi-region
  m06: { date: '2022-09-03', bbox: [60, 5, 100, 30]  },  // Tropical geo diag
  m07: { date: '2022-08-14', bbox: [72, 13, 76, 19]  },  // Western Ghats orographic
  m08: { date: '2022-06-22', bbox: [66, 8,  98, 36]  },  // India GPM radar
  m09: { date: '2022-08-05', bbox: [66, 8,  98, 36]  },  // India convective burst
  m10: { date: '2022-09-17', bbox: [72, 14, 76, 19]  },  // Mountain conv vs strat
  m11: { date: '2022-07-04', bbox: [72, 13, 76, 19]  },  // Western Ghats orographic
  m12: { date: '2022-07-19', bbox: [66, 8,  98, 36]  },  // India Kalpana
  m13: { date: '2022-08-16', bbox: [66, 8,  98, 36]  },  // India active monsoon
  m14: { date: '2022-09-20', bbox: [66, 8,  98, 36]  },  // India geo diag
  m15: { date: '2022-07-11', bbox: [83, 14, 94, 21]  },  // Bay of Bengal BTD
  m16: { date: '2022-08-26', bbox: [66, 8,  98, 36]  },  // India Kalpana
  m17: { date: '2022-07-30', bbox: [66, 8,  98, 36]  },  // India active monsoon
  m18: { date: '2022-09-06', bbox: [66, 8,  98, 36]  },  // India geo diag
  m19: { date: '2022-08-10', bbox: [66, 8,  98, 36]  },  // India convective burst
  m20: { date: '2022-07-24', bbox: [66, 8,  98, 36]  },  // India geo diag

  // ── Fallbacks by mapType ───────────────────────────────
  convective_burst: { date: '2022-08-10', bbox: [74, 17, 86, 27]  },
  active_monsoon:   { date: '2022-07-25', bbox: [74, 17, 86, 27]  },
  stratiform:       { date: '2022-07-18', bbox: [74, 17, 86, 27]  },
  shallow_warm:     { date: '2022-07-05', bbox: [72, 7,  80, 16]  },
  orographic:       { date: '2022-08-12', bbox: [72, 13, 76, 19]  },
  btd_challenge:    { date: '2022-08-03', bbox: [83, 11, 93, 19]  },
  gpm_radar:        { date: '2022-07-18', bbox: [74, 17, 86, 27]  },
  kalpana:          { date: '2022-07-20', bbox: [66, 8,  98, 36]  },
  coast_storm:      { date: '2022-08-12', bbox: [72, 13, 76, 19]  },
  conv_vs_strat:    { date: '2022-08-08', bbox: [74, 17, 86, 27]  },
  geo_diag:         { date: '2022-09-13', bbox: [66, 8,  98, 36]  },
  ne_monsoon:       { date: '2022-10-15', bbox: [78, 8,  83, 14]  },
  fy4a:             { date: '2022-07-20', bbox: [66, 8,  98, 36]  },

  _default:         { date: '2022-07-20', bbox: [66, 8,  98, 36]  },
};
