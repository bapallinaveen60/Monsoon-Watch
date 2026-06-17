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
  el('hint-btn')?.addEventListener('click', requestCopilotBriefing);
  
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
  // Select default
  selectStation("delhi");
}

function selectStation(id) {
  G.selectedStation = id;
  updateCareerHUD();
  
  const met = STATIONS[id];
  if (!met) return;
  
  const unlocked = isStationUnlocked(id);
  const detail = el('station-detail-pane');
  if (!detail) return;
  
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
  } else {
    detail.innerHTML = `
      <h3 style="color:var(--red)">🔒 STATION SECTOR LOCKED</h3>
      <p>This regional radar network is currently out of range. Reach <strong>${met.unlockedAt} XP</strong> to decrypt live telemetry feeds.</p>
    `;
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
    // Populate scenarios based on station and level
    const pool = DB[G.selectedLevel] || [];
    // Filter by station if possible, else fallback
    let matched = pool.filter(sc => sc.station === G.selectedStation);
    if (matched.length === 0) matched = pool; // Fallback
    
    G.activeScenarios = [...matched];
    shuffle(G.activeScenarios);
    
    // Take up to 10 scenarios for this shift
    G.activeScenarios = G.activeScenarios.slice(0, 10);
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
  
  // Reset input selects
  el('forecast-rain').value = "moderate";
  el('forecast-class').value = "stratiform";
  el('forecast-hazard').value = "moderate";
  document.querySelectorAll('.alert-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.alert === "green");
  });
  
  // Re-enable elements
  el('submit-forecast-btn').disabled = false;
  el('hint-btn').disabled = false;
  html('copilot-text', "Satellite telemetry received. Issue forecast advisories.");
  
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
  stopTimer();
  el('submit-forecast-btn').disabled = true;
  el('hint-btn').disabled = true;
  
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
  
  // Display result in Co-pilot
  html('copilot-text', result.feedbackHtml);
  
  // Create Next Step Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn-next';
  nextBtn.style.marginTop = '10px';
  nextBtn.textContent = G.qIdx === G.activeScenarios.length - 1 ? "FINISH SHIFT" : "NEXT SIMULATION STEP";
  nextBtn.addEventListener('click', () => {
    G.qIdx++;
    loadSimulationStep();
  });
  el('copilot-text').appendChild(nextBtn);
}

// ── AI Co-pilot Advice ─────────────────────────────────
function requestCopilotBriefing() {
  if (G.xp < 10) {
    alert("Insufficient XP reserves to request real-time meteorological assistance.");
    return;
  }
  addXP(-10); // Deduct 10 XP as copilot briefing cost
  G.score = Math.max(0, G.score - 10);
  txt('score-hud', `${G.score} XP`);
  
  const brief = getCopilotBriefing(G.currentScenario);
  html('copilot-text', brief);
  
  el('hint-btn').disabled = true;
  logOp(`[COPILOT] Real-time support briefing retrieved (-10 XP)`);
}

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
  
  G.history.push({
    title: G.currentScenario.title,
    score: 0,
    outcomeClass: "wrong",
    feedbackHtml: `<p style="color:var(--red)"><strong>TIMELINE EXCEEDED:</strong> Forecaster failed to issue alerts within operational limits.</p>
                   <p style="font-size:0.8rem; margin-top:8px">${G.currentScenario.explanation}</p>`
  });
  
  // Load next button automatically in co-pilot
  html('copilot-text', `<p style="color:var(--red)">⏱️ SHIFT TIMELINE EXCEEDED — 0 XP awarded</p>`);
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn-next';
  nextBtn.style.marginTop = '10px';
  nextBtn.textContent = G.qIdx === G.activeScenarios.length - 1 ? "FINISH SHIFT" : "NEXT SIMULATION STEP";
  nextBtn.addEventListener('click', () => {
    G.qIdx++;
    loadSimulationStep();
  });
  el('copilot-text').appendChild(nextBtn);
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
