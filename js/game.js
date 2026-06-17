// ═══════════════════════════════════════════════════════
// MONSOON WATCH V2 — Professional Game Engine
// ═══════════════════════════════════════════════════════
import { DB, STATIONS, HISTORICAL_MISSIONS } from './scenarios.js';
import { getCopilotBriefing, evaluateForecast, generateDailyChallenge } from './copilot.js';
import { LESSONS } from './edu.js';
import { drawMap, startSweep, stopSweep } from './map.js';
import { fetchSatImage } from './imagery.js';

// ── Constants ──────────────────────────────────────────
const TIMER_SECS  = { beginner: 45, intermediate: 35, advanced: 30, master: 25 };
const RANKS = [
  { xp: 0, title: "Observer" },
  { xp: 100, title: "Junior Analyst" },
  { xp: 300, title: "Analyst" },
  { xp: 700, title: "Senior Analyst" },
  { xp: 1200, title: "Forecaster" },
  { xp: 1800, title: "Senior Forecaster" },
  { xp: 2500, title: "Regional Director" },
  { xp: 3500, title: "National Director" }
];

// ── State ──────────────────────────────────────────────
const G = {
  // Career profile
  xp: 0,
  completedLessons: [],
  selectedStation: "delhi",
  selectedLevel: "beginner",
  
  // Shift state
  activeShiftType: "career", // "career" | "historical" | "daily"
  activeScenarios: [],
  currentScenario: null,
  qIdx: 0,
  score: 0, // XP earned in this shift
  correct: 0, // Perfect forecasts
  wrong: 0, // Wrong forecasts (score < 50)
  partial: 0, // Partials (50 <= score < 100)
  history: [], // Shift history log
  
  // Active forecast selections
  forecastAlert: "green",
  forecastRain: "moderate",
  forecastClass: "stratiform",
  forecastHazard: "moderate",

  // Transition state
  awaitingNext: false,
  
  // System variables
  band: "IR",
  timerMax: 45,
  timerSecs: 45,
  timerInterval: null,
  
  // Historical context
  activeHistoricalMission: null,
  activeHistoricalStepIdx: 0
};

// ── DOM helpers ────────────────────────────────────────
const el   = id => document.getElementById(id);
const txt  = (id, v) => { const e = el(id); if (e) e.textContent = v; };
const html = (id, v) => { const e = el(id); if (e) e.innerHTML = v; };
const css  = (id, p, v) => { const e = el(id); if (e) e.style[p] = v; };
const show = id => el(id)?.classList.remove('hide');
const hide = id => el(id)?.classList.add('hide');
const cls  = (id, c, on) => el(id)?.classList.toggle(c, on);

// ── Init ───────────────────────────────────────────────
export function initGame() {
  loadProfile();
  
  // --- HQ Dashboard Setups ---
  initInteractiveMap();
  initCareerLevels();
  initDailyChallenge();
  initAcademy();
  initHistoricalMissions();
  initMobileNav();
  
  // Launch Career Simulation
  el('launch-btn')?.addEventListener('click', () => {
    const unlocked = isStationUnlocked(G.selectedStation);
    if (!unlocked) {
      alert("This meteorological station is currently locked. Gain more XP to unlock subsequent regional sectors.");
      return;
    }
    startShift("career");
  });

  // Simulator Screen controls
  el('band-ir')?.addEventListener('click', () => changeBand('IR'));
  el('band-wv')?.addEventListener('click', () => changeBand('WV'));
  el('band-btd')?.addEventListener('click', () => changeBand('BTD'));
  
  el('abort-btn')?.addEventListener('click', abortShift);
  el('submit-forecast-btn')?.addEventListener('click', submitForecast);
  el('skip-question-btn')?.addEventListener('click', skipQuestion);
  
  el('play-again')?.addEventListener('click', () => {
    hide('debrief-screen');
    if (G.activeShiftType === "career") {
      startShift("career");
    } else if (G.activeShiftType === "historical") {
      startHistoricalMission(G.activeHistoricalMission);
    } else {
      startShift("daily");
    }
  });
  
  el('change-level')?.addEventListener('click', () => {
    hide('debrief-screen');
    show('title-screen');
    updateCareerHUD();
  });

  // Forecast input button selectors
  document.querySelectorAll('.alert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.alert-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      G.forecastAlert = btn.dataset.alert;
      logOp(`[WARN] Alert level adjusted to ${G.forecastAlert.toUpperCase()}`);
    });
  });

  // Visual grid toggles
  el('toggle-grid')?.addEventListener('change', (e) => {
    logOp(`[GRID] Visual grid display: ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
  });

  // Setup tab toggling
  el('tab-btn-academy')?.addEventListener('click', () => {
    el('tab-btn-academy').classList.add('active');
    el('tab-btn-history').classList.remove('active');
    show('tab-academy');
    hide('tab-history');
  });

  el('tab-btn-history')?.addEventListener('click', () => {
    el('tab-btn-history').classList.add('active');
    el('tab-btn-academy').classList.remove('active');
    show('tab-history');
    hide('tab-academy');
  });

  // Close lesson modal
  el('close-lesson-btn')?.addEventListener('click', () => {
    hide('lesson-modal');
  });

  // Map resize
  new ResizeObserver(() => {
    if (G.currentScenario) drawMap(el('sat-map'), G.currentScenario, G.band);
  }).observe(el('map-wrap') || document.body);
}

// ── LocalStorage Profile ───────────────────────────────
function loadProfile() {
  try {
    const p = JSON.parse(localStorage.getItem('mw_v2_profile') || '{}');
    G.xp = p.xp || 0;
    G.completedLessons = p.completedLessons || [];
  } catch(e) {
    G.xp = 0;
    G.completedLessons = [];
  }
}

function saveProfile() {
  try {
    localStorage.setItem('mw_v2_profile', JSON.stringify({
      xp: G.xp,
      completedLessons: G.completedLessons
    }));
  } catch(e) {}
}

function addXP(amount) {
  G.xp += amount;
  saveProfile();
}

function getRank(xp) {
  let title = RANKS[0].title;
  for (let r of RANKS) {
    if (xp >= r.xp) title = r.title;
  }
  return title;
}

function getNextRankInfo(xp) {
  const current = getRank(xp);
  const currentIdx = RANKS.findIndex(r => r.title === current);
  if (currentIdx === RANKS.length - 1) return "MAX RANK ACHIEVED";
  const next = RANKS[currentIdx + 1];
  return `Next rank (${next.title}) unlocks at ${next.xp} XP`;
}

function isStationUnlocked(stationId) {
  const met = STATIONS[stationId];
  return met ? G.xp >= met.unlockedAt : false;
}

function updateCareerHUD() {
  const rank = getRank(G.xp);
  txt('career-rank', rank);
  txt('career-xp', `${G.xp} XP`);
  txt('career-next-rank', getNextRankInfo(G.xp));
  
  // Progress bar calculation
  const currentIdx = RANKS.findIndex(r => r.title === rank);
  const minXp = RANKS[currentIdx].xp;
  if (currentIdx === RANKS.length - 1) {
    css('career-xp-bar', 'width', '100%');
  } else {
    const maxXp = RANKS[currentIdx + 1].xp;
    const pct = ((G.xp - minXp) / (maxXp - minXp)) * 100;
    css('career-xp-bar', 'width', `${Math.max(0, Math.min(100, pct))}%`);
  }
  
  // Update map SVG highlights
  Object.keys(STATIONS).forEach(id => {
    const unlocked = isStationUnlocked(id);
    const node = el('node-' + id);
    if (node) {
      node.className.baseVal = `map-node ${unlocked ? 'unlocked' : 'locked'} ${G.selectedStation === id ? 'selected' : ''}`;
    }
  });
}

// ── HQ Map & Stations ──────────────────────────────────
function initInteractiveMap() {
  Object.keys(STATIONS).forEach(id => {
    const node = el('node-' + id);
    if (node) {
      node.addEventListener('click', () => {
        selectStation(id);
      });
    }
  });
  // Show general climate overview by default instead of auto-selecting Delhi
  showGeneralClimate();
}

function showGeneralClimate() {
  G.selectedStation = null;
  updateCareerHUD();
  
  const detail = el('station-detail-pane');
  if (detail) {
    detail.innerHTML = `
      <h3>Indian Weather & Climate System</h3>
      <p><strong>Overview:</strong> Tropical monsoon climate. Dominated by the Southwest Monsoon (June–September) providing 75–90% of annual rainfall, and the Northeast Monsoon (October–December) affecting southern coastal sectors.</p>
      <div class="sd-grid">
        <div class="sd-cell">
          <span class="sd-label">MONSOON REGIME</span>
          <span class="sd-val">Highly dynamic seasonal cycle critical for agricultural security, monitored via satellite observations (brightness temperatures, water vapor channels, CAPE stability).</span>
        </div>
        <div class="sd-cell">
          <span class="sd-label">WARNING THRESHOLDS</span>
          <span class="sd-val">Forecasters monitor convective indices, storm height depth, and microwave rain estimates to issue timely severe weather and flood warnings.</span>
        </div>
      </div>
    `;
  }

  // Update launch button text
  const launchBtn = el('launch-btn');
  if (launchBtn) {
    launchBtn.innerHTML = `
      <span>SELECT A STATION ON MAP TO LAUNCH</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    `;
    launchBtn.classList.add('disabled-btn');
  }
}

function selectStation(id) {
  G.selectedStation = id;
  updateCareerHUD();
  
  const met = STATIONS[id];
  if (!met) return;
  
  const unlocked = isStationUnlocked(id);
  const detail = el('station-detail-pane');
  if (!detail) return;
  
  const launchBtn = el('launch-btn');
  
  if (unlocked) {
    detail.innerHTML = `
      <h3>${met.name}</h3>
      <p><strong>Climate:</strong> ${met.climate}</p>
      <div class="sd-grid">
        <div class="sd-cell">
          <span class="sd-label">MONSOON REGIME</span>
          <span class="sd-val">${met.monsoon.slice(0, 45)}...</span>
        </div>
        <div class="sd-cell">
          <span class="sd-label">HISTORICAL INCIDENT</span>
          <span class="sd-val">${met.history.slice(0, 45)}...</span>
        </div>
      </div>
    `;
    if (launchBtn) {
      launchBtn.innerHTML = `
        <span>LAUNCH SYSTEM SIMULATION</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      `;
      launchBtn.classList.remove('disabled-btn');
    }
  } else {
    detail.innerHTML = `
      <h3 style="color:var(--red)">🔒 STATION SECTOR LOCKED</h3>
      <p>This regional radar network is currently out of range. Reach <strong>${met.unlockedAt} XP</strong> to decrypt live telemetry feeds.</p>
    `;
    if (launchBtn) {
      launchBtn.innerHTML = `
        <span>STATION LOCKED (XP REQUIRED)</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      `;
      launchBtn.classList.add('disabled-btn');
    }
  }
}

function initCareerLevels() {
  document.querySelectorAll('.level-card-v2').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.level-card-v2').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      G.selectedLevel = card.dataset.level;
    });
  });
}

// ── Daily forecast challenges ──────────────────────────
function initDailyChallenge() {
  const c = generateDailyChallenge();
  txt('dc-desc', `${c.title}: ${c.desc}`);
  el('launch-dc-btn')?.addEventListener('click', () => {
    startShift("daily");
  });
}

// ── Academy Lessons ────────────────────────────────────
function initAcademy() {
  const list = el('academy-list');
  if (!list) return;
  list.innerHTML = '';
  
  LESSONS.forEach(l => {
    const card = document.createElement('div');
    const comp = G.completedLessons.includes(l.id);
    card.className = `lesson-card-item ${comp ? 'completed' : ''}`;
    card.innerHTML = `
      <h4>${l.title} ${comp ? '✅' : ''}</h4>
      <p>${l.desc}</p>
    `;
    card.addEventListener('click', () => openLesson(l));
    list.appendChild(card);
  });
}

function openLesson(lesson) {
  show('lesson-modal');
  html('lesson-body', `
    <h2>${lesson.title}</h2>
    <div>${lesson.content}</div>
  `);
  
  // Render Lesson Quiz
  const qSection = el('lesson-quiz-section');
  if (!qSection) return;
  qSection.innerHTML = `<h4>💡 QUICK EXAM / CERTIFICATION QUIZ</h4>`;
  
  lesson.quiz.forEach((qz, idx) => {
    const block = document.createElement('div');
    block.style.marginBottom = '1rem';
    block.innerHTML = `<p class="quiz-q">${idx + 1}. ${qz.q}</p>`;
    
    const choicesDiv = document.createElement('div');
    choicesDiv.className = 'quiz-choices';
    
    qz.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'quiz-choice-btn';
      btn.textContent = ch;
      btn.addEventListener('click', () => {
        if (ch === qz.a) {
          btn.classList.add('correct');
          btn.disabled = true;
          // Check if quiz is passed
          handleLessonCompleted(lesson.id);
        } else {
          btn.classList.add('wrong');
          btn.disabled = true;
        }
      });
      choicesDiv.appendChild(btn);
    });
    
    block.appendChild(choicesDiv);
    qSection.appendChild(block);
  });
}

function handleLessonCompleted(lessonId) {
  if (G.completedLessons.includes(lessonId)) return;
  G.completedLessons.push(lessonId);
  saveProfile();
  addXP(30); // Reward 30 XP for passing lesson
  alert("Certification Quiz Passed! +30 XP awarded. Dynamic lessons updated.");
  initAcademy();
}

// ── Historical Missions ────────────────────────────────
function initHistoricalMissions() {
  const list = el('history-list');
  if (!list) return;
  list.innerHTML = '';
  
  HISTORICAL_MISSIONS.forEach(m => {
    const card = document.createElement('div');
    card.className = 'history-card-item';
    card.innerHTML = `
      <h4>${m.name}</h4>
      <p>${m.desc} (Difficulty: <em style="color:var(--gold)">${m.difficulty}</em>)</p>
    `;
    card.addEventListener('click', () => {
      startHistoricalMission(m);
    });
    list.appendChild(card);
  });
}

function startHistoricalMission(mission) {
  G.activeShiftType = "historical";
  G.activeHistoricalMission = mission;
  G.activeHistoricalStepIdx = 0;
  G.activeScenarios = [...mission.steps];
  
  startShift("historical");
}

// ── Start Forecasting Shift ────────────────────────────
function startShift(type) {
  G.activeShiftType = type;
  G.score = 0;
  G.qIdx = 0;
  G.correct = 0;
  G.wrong = 0;
  G.partial = 0;
  G.history = [];
  G.band = "IR";
  
  if (type === "career") {
    // Populate all scenarios for this level to allow exactly 20 questions
    const pool = DB[G.selectedLevel] || [];
    G.activeScenarios = [...pool];
    shuffle(G.activeScenarios);
    
    // Limit to 20 questions
    G.activeScenarios = G.activeScenarios.slice(0, 20);
  } else if (type === "daily") {
    // Select 3 random high-convective scenarios from Advanced/Master pools
    const all = [...DB.advanced, ...DB.master];
    shuffle(all);
    G.activeScenarios = all.slice(0, 3);
  }
  
  if (G.activeScenarios.length === 0) {
    alert("Meteorological anomaly: No active telemetry grids registered for this configuration.");
    return;
  }
  
  G.timerMax = TIMER_SECS[G.selectedLevel] || 45;
  
  hide('title-screen');
  hide('debrief-screen');
  show('game-screen');
  
  // Dynamic header setup
  const st = STATIONS[G.selectedStation] || { name: "CENTRAL OPERATIONS" };
  txt('hud-station-name', st.name.toUpperCase());
  txt('hud-rank-label', `${getRank(G.xp).toUpperCase()} SHIFT`);
  
  startSweep(el('sweep-canvas'));
  loadSimulationStep();
}

function loadSimulationStep() {
  if (G.qIdx >= G.activeScenarios.length) {
    endShift();
    return;
  }
  stopTimer();
  
  // Set current scenario
  G.currentScenario = G.activeScenarios[G.qIdx];
  G.forecastAlert = "green";
  G.forecastRain = "moderate";
  G.forecastClass = "stratiform";
  G.forecastHazard = "moderate";
  
  // Reset input selects and re-enable them
  const rainSelect = el('forecast-rain');
  const classSelect = el('forecast-class');
  const hazardSelect = el('forecast-hazard');

  if (rainSelect) {
    rainSelect.value = "moderate";
    rainSelect.disabled = false;
  }
  if (classSelect) {
    classSelect.value = "stratiform";
    classSelect.disabled = false;
  }
  if (hazardSelect) {
    hazardSelect.value = "moderate";
    hazardSelect.disabled = false;
  }

  document.querySelectorAll('.alert-btn').forEach(btn => {
    btn.disabled = false;
    btn.classList.toggle('active', btn.dataset.alert === "green");
  });
  
  // Reset submit button state and text
  G.awaitingNext = false;
  const submitBtn = el('submit-forecast-btn');
  if (submitBtn) {
    submitBtn.textContent = "SUBMIT FORECAST";
    submitBtn.disabled = false;
  }
  
  // Reset skip button
  const skipBtn = el('skip-question-btn');
  if (skipBtn) {
    skipBtn.disabled = false;
  }
  
  // Hide feedback container
  hide('forecast-feedback');
  html('copilot-text', "");
  
  renderSimulationTelemetry();
  startTimer();
}

function renderSimulationTelemetry() {
  const sc = G.currentScenario;
  const d = sc.data;
  
  txt('hud-callsign', `ST-ID: ${sc.id.toUpperCase()}`);
  txt('q-hud', `STEP ${G.qIdx + 1} / ${G.activeScenarios.length}`);
  txt('score-hud', `${G.score} XP`);
  
  txt('sc-day', sc.day);
  txt('sc-title', sc.title);
  txt('sc-region', sc.region);
  txt('q-situation', sc.question);
  
  // Colour-coded readings in Bottom Telemetry Bar
  _renderTelemetryCell('cell-tb', 'val-tb', 'thresh-tb', `${d.tb11} K`, d.tb11 <= 210 ? 'Deep convection' : d.tb11 <= 235 ? 'Active convection' : 'Shallow warm cloud', d.tb11 <= 210 ? 'alert-red' : d.tb11 <= 235 ? 'alert-org' : 'alert-grn');
  _renderTelemetryCell('cell-btd1', 'val-btd1', 'thresh-btd1', `${d.btd1} K`, d.btd1 >= 0 ? 'Ice dominant' : d.btd1 <= -20 ? 'Strong liquid' : 'Liquid phase', d.btd1 >= 0 ? 'alert-red' : d.btd1 <= -20 ? 'alert-grn' : 'alert-gold');
  _renderTelemetryCell('cell-delta', 'val-delta', 'thresh-delta', `${d.deltaBtd} K`, d.deltaBtd >= 2 ? 'Deep ice storm' : d.deltaBtd >= 0 ? 'Mixed phase' : 'Shallow/liquid', d.deltaBtd >= 2 ? 'alert-red' : d.deltaBtd >= 0 ? 'alert-org' : 'alert-grn');
  
  // Extra indicators: CAPE and TCWV
  _renderTelemetryCell('cell-cape', 'val-cape', 'thresh-cape', `${d.cape} J/kg`, d.cape >= 2500 ? 'Extreme instability' : d.cape >= 1200 ? 'Moderate' : 'Stable', d.cape >= 2500 ? 'alert-red' : d.cape >= 1200 ? 'alert-org' : 'alert-grn');
  _renderTelemetryCell('cell-tcwv', 'val-tcwv', 'thresh-tcwv', `${d.tcwv} mm`, d.tcwv >= 60 ? 'Fully saturated' : d.tcwv >= 40 ? 'Moist' : 'Dry', d.tcwv >= 60 ? 'alert-red' : d.tcwv >= 40 ? 'alert-org' : 'alert-grn');
  _renderTelemetryCell('cell-stormh', 'val-stormh', 'thresh-stormh', `${d.stormHeight} km`, d.stormHeight >= 12 ? 'Extreme depth' : d.stormHeight >= 8 ? 'Deep' : 'Shallow', d.stormHeight >= 12 ? 'alert-red' : d.stormHeight >= 8 ? 'alert-org' : 'alert-grn');
  
  // Render Map
  drawMap(el('sat-map'), sc, G.band);
  show('img-loading');
  fetchSatImage(sc, G.band)
    .then(() => hide('img-loading'))
    .catch(() => hide('img-loading'));
    
  logOp(`[OPS] Loaded telemetry for ${sc.title}`);
}

function _renderTelemetryCell(cellId, valId, threshId, val, label, alertClass) {
  txt(valId, val);
  txt(threshId, label);
  const cell = el(cellId);
  if (cell) {
    cell.className = `telemetry-cell ${alertClass}`;
  }
}

// ── Submit Forecast Action ─────────────────────────────
function submitForecast() {
  // If we are awaiting next, this button acts as the transition to the next scenario
  if (G.awaitingNext) {
    G.qIdx++;
    loadSimulationStep();
    return;
  }

  stopTimer();
  
  const sc = G.currentScenario;
  const userForecast = {
    rain: el('forecast-rain').value,
    alert: G.forecastAlert,
    systemClass: el('forecast-class').value,
    hazard: G.forecastHazard
  };
  
  const result = evaluateForecast(userForecast, sc);
  
  // Update state statistics
  G.score += result.score;
  addXP(result.score);
  
  let outcomeClass = "wrong";
  if (result.score === 100) {
    G.correct++;
    outcomeClass = "correct";
    logOp(`[ACC] PERFECT FORECAST (+100 XP) at ${sc.title}`, "correct");
  } else if (result.score >= 50) {
    G.partial++;
    outcomeClass = "partial";
    logOp(`[ACC] PARTIAL FORECAST (+${result.score} XP) at ${sc.title}`, "alert");
  } else {
    G.wrong++;
    logOp(`[ACC] INACCURATE FORECAST WARNING (+${result.score} XP) at ${sc.title}`);
  }
  
  // Save log history
  G.history.push({
    title: sc.title,
    score: result.score,
    outcomeClass,
    feedbackHtml: result.feedbackHtml
  });
  
  // Display result in feedback panel
  html('copilot-text', result.feedbackHtml);
  show('forecast-feedback');
  
  // Disable forecast input select elements so user can't change their answers
  const rainSelect = el('forecast-rain');
  const classSelect = el('forecast-class');
  const hazardSelect = el('forecast-hazard');
  if (rainSelect) rainSelect.disabled = true;
  if (classSelect) classSelect.disabled = true;
  if (hazardSelect) hazardSelect.disabled = true;

  document.querySelectorAll('.alert-btn').forEach(btn => {
    btn.disabled = true;
  });

  // Disable skip button during feedback phase
  const skipBtn = el('skip-question-btn');
  if (skipBtn) {
    skipBtn.disabled = true;
  }

  // Set dual-state trigger to proceed
  G.awaitingNext = true;
  
  const submitBtn = el('submit-forecast-btn');
  if (submitBtn) {
    const isLastQuestion = G.qIdx === G.activeScenarios.length - 1;
    submitBtn.textContent = isLastQuestion ? "FINISH SHIFT" : "NEXT STEP";
    submitBtn.disabled = false;
  }
}

// Hint functionality has been removed in alignment with Co-pilot section removal.

// ── Shift End / Debrief ────────────────────────────────
function endShift() {
  stopTimer();
  stopSweep();
  
  hide('game-screen');
  show('debrief-screen');
  
  const totalSteps = G.activeScenarios.length;
  const maxPossibleXp = totalSteps * 100;
  const pct = maxPossibleXp > 0 ? Math.round(G.score / maxPossibleXp * 100) : 0;
  
  txt('score-pct', `${pct}%`);
  txt('score-pts', `${G.score} XP`);
  txt('stat-correct', G.correct);
  txt('stat-wrong', G.wrong);
  txt('stat-skipped', G.partial);
  txt('stat-best-streak', `${G.correct}/${totalSteps}`);
  
  // Set debrief subtitle details dynamically
  const st = STATIONS[G.selectedStation] || { name: "Central Operations" };
  txt('debrief-sub', `${st.name.toUpperCase()} · ${totalSteps} scenarios analysed`);
  
  // Debrief Ring styling
  setTimeout(() => {
    const ring = el('score-ring');
    if (ring) {
      ring.style.strokeDashoffset = 327 * (1 - pct / 100);
      ring.style.stroke = pct >= 85 ? 'var(--grn)' : pct >= 65 ? 'var(--acc)' : pct >= 45 ? 'var(--gold)' : 'var(--red)';
    }
  }, 200);
  
  // Render detailed review logs
  const rList = el('review-list');
  if (rList) {
    rList.innerHTML = '';
    G.history.forEach((h, idx) => {
      const card = document.createElement('div');
      card.className = `history-review-card ${h.outcomeClass}`;
      card.innerHTML = `
        <div class="hr-header">
          <span>STEP ${idx + 1}: ${h.title}</span>
          <span style="color:${h.outcomeClass==='correct'?'var(--grn)':h.outcomeClass==='partial'?'var(--gold)':'var(--red)'}">${h.score}/100 XP</span>
        </div>
        <div class="hr-details">${h.feedbackHtml}</div>
      `;
      rList.appendChild(card);
    });
  }
  
  // Unlocks and Achievements notifications
  const unlocks = el('debrief-unlocks');
  if (unlocks) {
    unlocks.innerHTML = '';
    const newRank = getRank(G.xp);
    let notifications = [];
    
    // Check if new stations are unlocked
    Object.keys(STATIONS).forEach(id => {
      const st = STATIONS[id];
      // If XP just passed unlocked threshold during this shift
      if (G.xp >= st.unlockedAt && (G.xp - G.score) < st.unlockedAt && st.unlockedAt > 0) {
        notifications.push(`🌍 <strong>NEW RADAR SECTOR UNLOCKED:</strong> decryptions active for ${st.name}!`);
      }
    });
    
    if (notifications.length > 0) {
      unlocks.innerHTML = notifications.join('<br>');
      show('debrief-unlocks');
    } else {
      hide('debrief-unlocks');
    }
  }
}

// ── Timer Systems ──────────────────────────────────────
function startTimer() {
  G.timerSecs = G.timerMax;
  _renderTimer(G.timerSecs);
  
  G.timerInterval = setInterval(() => {
    G.timerSecs--;
    _renderTimer(G.timerSecs);
    
    if (G.timerSecs <= 0) {
      stopTimer();
      timeOut();
    }
  }, 1000);
}

function stopTimer() {
  if (G.timerInterval) {
    clearInterval(G.timerInterval);
    G.timerInterval = null;
  }
}

function _renderTimer(secs) {
  txt('timer-num', `${secs}s`);
  const box = el('timer-box');
  if (box) {
    box.classList.toggle('urgent', secs <= 8);
  }
}

function timeOut() {
  logOp(`[WARN] Shift timeline exceeded. Zero forecast capability calculated.`);
  G.wrong++;
  
  const explanationHtml = `<p style="color:var(--red)">⏱️ SHIFT TIMELINE EXCEEDED — 0 XP awarded</p>
                           <p style="color:var(--red); font-size:0.85rem;"><strong>TIMELINE EXCEEDED:</strong> Forecaster failed to issue alerts within operational limits.</p>
                           <p style="font-size:0.8rem; margin-top:8px">${G.currentScenario.explanation}</p>`;
  
  G.history.push({
    title: G.currentScenario.title,
    score: 0,
    outcomeClass: "wrong",
    feedbackHtml: explanationHtml
  });
  
  html('copilot-text', explanationHtml);
  show('forecast-feedback');
  
  // Disable forecast input select elements
  const rainSelect = el('forecast-rain');
  const classSelect = el('forecast-class');
  const hazardSelect = el('forecast-hazard');
  if (rainSelect) rainSelect.disabled = true;
  if (classSelect) classSelect.disabled = true;
  if (hazardSelect) hazardSelect.disabled = true;

  document.querySelectorAll('.alert-btn').forEach(btn => {
    btn.disabled = true;
  });

  // Disable skip button
  const skipBtn = el('skip-question-btn');
  if (skipBtn) {
    skipBtn.disabled = true;
  }

  G.awaitingNext = true;
  
  const submitBtn = el('submit-forecast-btn');
  if (submitBtn) {
    const isLastQuestion = G.qIdx === G.activeScenarios.length - 1;
    submitBtn.textContent = isLastQuestion ? "FINISH SHIFT" : "NEXT STEP";
    submitBtn.disabled = false;
  }
}

// ── Abort & Bands ──────────────────────────────────────
function abortShift() {
  if (confirm("Abort current duty shift? Career progression points will not be modified.")) {
    stopTimer();
    stopSweep();
    hide('game-screen');
    show('title-screen');
    updateCareerHUD();
  }
}

function changeBand(b) {
  G.band = b;
  document.querySelectorAll('.btn-band').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(b));
  });
  
  txt('map-label', `BAND: ${b === 'IR' ? 'IR 11μm' : b === 'WV' ? 'WV 6.2μm' : 'BTD 8.6-11μm'}`);
  logOp(`[SENSOR] Spectral channel adjusted to ${b}`);
  
  // Redraw map with new band
  drawMap(el('sat-map'), G.currentScenario, G.band);
  show('img-loading');
  fetchSatImage(G.currentScenario, G.band)
    .then(() => hide('img-loading'))
    .catch(() => hide('img-loading'));
}

// ── Operations Event logger ────────────────────────────
function logOp(text, type = "normal") {
  const panel = el('ops-log-panel');
  if (!panel) return;
  
  const time = new Date().toLocaleTimeString().slice(0, 8);
  const entry = document.createElement('div');
  entry.className = `log-entry ${type === 'alert' ? 'log-alert' : type === 'correct' ? 'log-correct' : ''}`;
  entry.textContent = `[${time}] ${text}`;
  
  panel.appendChild(entry);
  panel.scrollTop = panel.scrollHeight;
}

// ── Utilities ──────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function initMobileNav() {
  const btns = document.querySelectorAll('.m-nav-btn');
  const cards = document.querySelectorAll('.ops-card');
  
  // Set default active tab
  const defaultTab = "map-card";
  cards.forEach(card => {
    card.classList.toggle('active-mobile', card.classList.contains(defaultTab));
  });
  
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const target = btn.dataset.target;
      cards.forEach(card => {
        card.classList.toggle('active-mobile', card.classList.contains(target));
      });
    });
  });
}

function skipQuestion() {
  if (G.awaitingNext) return;
  stopTimer();
  
  const sc = G.currentScenario;
  
  G.history.push({
    title: sc.title,
    score: 0,
    outcomeClass: "wrong",
    feedbackHtml: `<p style="color:var(--red)"><strong>SKIPPED:</strong> Forecaster bypassed this simulation step.</p>
                   <p style="font-size:0.8rem; margin-top:8px"><strong>Correct Analysis:</strong> ${sc.explanation}</p>`
  });
  
  G.wrong++;
  logOp(`[OPS] Skipped forecast at ${sc.title}`);
  
  G.qIdx++;
  loadSimulationStep();
}
