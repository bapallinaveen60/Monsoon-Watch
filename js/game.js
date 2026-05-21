// ═══════════════════════════════════════════════════════
// MONSOON WATCH — Game Engine v2
// Features: timer, streak/multiplier, colour-coded readings,
// split question, hint cost, band-required, localStorage,
// topic breakdown, wrong-answer review, mobile bottom sheet,
// title screen preview
// ═══════════════════════════════════════════════════════
import { DB } from './scenarios.js';
import { drawMap, startSweep, stopSweep } from './map.js';
import { fetchSatImage } from './imagery.js';

// ── Constants ──────────────────────────────────────────
const TIMER_SECS  = { beginner:45, intermediate:35, advanced:30, master:25 };
const PTS         = { beginner:50, intermediate:100, advanced:150, master:200 };
const MAX_HINTS   = 3;
const HINT_COST   = 10;
const STREAK_MULT = { 3:1.5, 5:2.0 };   // streak → multiplier

// Bands that certain mapTypes should highlight
const BAND_REQUIRED = {
  btd_challenge: 'BTD',
  shallow_warm:  'BTD',
  conv_vs_strat: 'BTD',
};

// TB₁₁ thresholds for colour coding
const TB_THRESHOLDS = [
  { max:210, cls:'alert-red',  label:'Deep convection' },
  { max:235, cls:'alert-org',  label:'Active convection' },
  { max:260, cls:'alert-gold', label:'Moderate cloud' },
  { max:999, cls:'alert-grn',  label:'Shallow/warm cloud' },
];

// ── State ──────────────────────────────────────────────
const G = {
  level:null, score:0, qIdx:0, correct:0, wrong:0, skipped:0,
  answered:0, history:[], scenarios:[], current:null, band:'IR',
  totalQ:20, streak:0, bestStreak:0, hintsLeft:MAX_HINTS,
  timerInterval:null, timerSecs:0, timerMax:45,
  topicStats:{},   // { tagName: { correct, total } }
};

// ── DOM helpers ────────────────────────────────────────
const el   = id => document.getElementById(id);
const txt  = (id,v) => { const e=el(id); if(e) e.textContent=v; };
const css  = (id,p,v) => { const e=el(id); if(e) e.style[p]=v; };
const show = id => el(id)?.classList.remove('hide');
const hide = id => el(id)?.classList.add('hide');
const cls  = (id,c,on) => el(id)?.classList.toggle(c,on);

// ── Init ───────────────────────────────────────────────
export function initGame() {
  // Level card selection + preview
  document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      show('launch-btn');
    });
    // Populate preview with first scenario of that level
    const lvl = card.dataset.level;
    const first = DB[lvl]?.[0];
    if (first) {
      const prev = el('preview-' + lvl);
      if (prev) {
        prev.innerHTML = `<div class="lc-preview-q">"${first.question.slice(0,90)}…"</div>
          <span class="lc-preview-tag">${first.choices[0]?.tag || ''}</span>`;
      }
    }
  });

  el('launch-btn')?.addEventListener('click', () => {
    const sel = document.querySelector('.level-card.selected');
    if (sel) startLevel(sel.dataset.level);
  });

  // Band buttons
  el('band-ir')?.addEventListener('click',  () => changeBand('IR'));
  el('band-wv')?.addEventListener('click',  () => changeBand('WV'));
  el('band-btd')?.addEventListener('click', () => changeBand('BTD'));

  el('hint-btn')?.addEventListener('click', useHint);
  el('skip-btn')?.addEventListener('click', skipQuestion);
  el('next-btn')?.addEventListener('click', nextQuestion);

  el('play-again')?.addEventListener('click',   () => startLevel(G.level));
  el('change-level')?.addEventListener('click', () => { hide('debrief-screen'); show('title-screen'); });

  // Map resize
  new ResizeObserver(() => {
    if (G.current) drawMap(el('sat-map'), G.current, G.band);
  }).observe(el('map-wrap') || document.body);

  // Mobile bottom sheet drag-to-dismiss
  _initBottomSheet();

  // Show best scores on title
  _renderBestScores();
}

// ── Level start ────────────────────────────────────────
function startLevel(level) {
  G.level=level; G.score=0; G.qIdx=0; G.correct=0; G.wrong=0;
  G.skipped=0; G.answered=0; G.history=[]; G.streak=0;
  G.bestStreak=0; G.hintsLeft=MAX_HINTS; G.topicStats={};
  G.band='IR'; G.timerMax=TIMER_SECS[level]||45;

  G.scenarios = [...(DB[level]||[])];
  shuffle(G.scenarios);

  hide('title-screen'); hide('debrief-screen'); show('game-screen');

  const badges = {beginner:'#34d399',intermediate:'#38bdf8',advanced:'#fb923c',master:'#a78bfa'};
  const badge = el('level-badge');
  if (badge) {
    badge.textContent = level.charAt(0).toUpperCase()+level.slice(1);
    badge.style.background = badges[level]||'var(--s3)';
    badge.style.color = level==='master'?'#fff':'#000';
  }

  startSweep(el('sweep-canvas'));
  loadQuestion();
}

// ── Load question ──────────────────────────────────────
function loadQuestion() {
  if (G.qIdx >= G.totalQ) { showDebrief(); return; }
  stopTimer();

  G.current = G.scenarios[G.qIdx % G.scenarios.length];
  hide('feedback'); hide('hint-strip');
  show('hint-btn'); show('skip-btn');

  // Reset hint button state
  const hb = el('hint-btn');
  if (hb) {
    hb.disabled = G.hintsLeft <= 0;
    hb.title = G.hintsLeft <= 0 ? 'No hints remaining' : '';
  }
  txt('hints-left', `${G.hintsLeft} hint${G.hintsLeft!==1?'s':''} left`);

  renderScenario();
  updateHUD();
  startTimer();
}

// ── Render scenario ────────────────────────────────────
function renderScenario() {
  const sc = G.current;
  const d  = sc.data;

  txt('sc-day',    sc.day);
  txt('sc-title',  sc.title);
  txt('sc-region', sc.region);
  txt('sc-tag',    sc.choices?.[0]?.tag || '');
  txt('region-label', sc.region.split('(')[0].trim());

  // Band required badge
  const reqBand = BAND_REQUIRED[sc.mapType];
  const bandReqEl = el('sc-band-req');
  if (reqBand && bandReqEl) {
    bandReqEl.textContent = `🔍 Switch to ${reqBand}`;
    bandReqEl.classList.remove('hide');
  } else {
    bandReqEl?.classList.add('hide');
  }

  // Highlight required band button
  ['ir','wv','btd'].forEach(b => {
    cls('band-'+b, 'required', reqBand && b.toUpperCase()===reqBand && G.band!==reqBand);
  });

  // Band hint overlay
  const bh = el('band-hint');
  if (bh) {
    if (reqBand && G.band !== reqBand) {
      bh.style.display = 'block';
      txt('band-hint-text', `Switch to ${reqBand} band to analyse this scenario`);
    } else {
      bh.style.display = 'none';
    }
  }

  // Colour-coded satellite readings
  _renderReadings(d);

  // Split question into situation + decision
  _splitQuestion(sc.question);

  renderChoices(sc);

  // Map + real imagery
  drawMap(el('sat-map'), sc, G.band);
  show('img-loading');
  css('img-credit','display','none');
  fetchSatImage(sc, G.band)
    .then(()=>{ hide('img-loading'); css('img-credit','display','block'); })
    .catch(()=> hide('img-loading'));

  // Band buttons state
  ['ir','wv','btd'].forEach(b => {
    cls('band-'+b, 'active', b.toUpperCase()===G.band);
  });
  txt('map-label', _bandLabel(G.band));
}

// ── Colour-coded readings ──────────────────────────────
function _renderReadings(d) {
  // TB₁₁ — colour by threshold
  const tbThresh = TB_THRESHOLDS.find(t => d.tb11 <= t.max) || TB_THRESHOLDS[3];
  txt('val-tb', d.tb11+' K');
  txt('thresh-tb', tbThresh.label);
  _setAlertClass('cell-tb', tbThresh.cls);

  // BTD₁ — negative = liquid, positive = ice
  txt('val-btd1', d.btd1+' K');
  if (d.btd1 < -20) {
    txt('thresh-btd1','Strong liquid phase'); _setAlertClass('cell-btd1','alert-grn');
  } else if (d.btd1 < 0) {
    txt('thresh-btd1','Liquid phase');        _setAlertClass('cell-btd1','alert-gold');
  } else {
    txt('thresh-btd1','Ice phase dominant');  _setAlertClass('cell-btd1','alert-red');
  }

  // ΔBTD — positive = ice/deep, negative = liquid/shallow
  txt('val-delta', d.deltaBtd+' K');
  if (d.deltaBtd > 2) {
    txt('thresh-delta','Deep ice storm');     _setAlertClass('cell-delta','alert-red');
  } else if (d.deltaBtd > 0) {
    txt('thresh-delta','Mixed phase');        _setAlertClass('cell-delta','alert-org');
  } else {
    txt('thresh-delta','Shallow/liquid');     _setAlertClass('cell-delta','alert-grn');
  }

  // Storm height
  txt('val-stormh', d.stormHeight+' km');
  if (d.stormHeight >= 12) {
    txt('thresh-stormh','Extreme depth');     _setAlertClass('cell-stormh','alert-red');
  } else if (d.stormHeight >= 8) {
    txt('thresh-stormh','Deep convection');   _setAlertClass('cell-stormh','alert-org');
  } else if (d.stormHeight >= 5) {
    txt('thresh-stormh','Moderate depth');    _setAlertClass('cell-stormh','alert-gold');
  } else {
    txt('thresh-stormh','Shallow cloud');     _setAlertClass('cell-stormh','alert-grn');
  }

  // Bars
  const rainPct  = Math.min(d.rainRate/60*100,100);
  const depthPct = Math.min(d.stormHeight/16*100,100);
  css('rain-bar','width',rainPct+'%');
  css('depth-bar','width',depthPct+'%');
  txt('rain-val',  d.rainRate+' mm/h');
  txt('depth-val', d.stormHeight+' km');
}

function _setAlertClass(cellId, cls) {
  const cell = el(cellId);
  if (!cell) return;
  cell.className = 'data-cell ' + cls;
}

// ── Split question into situation + decision ───────────
function _splitQuestion(question) {
  // Split on the last sentence that ends with '?' — that's the decision prompt
  // Everything before it is the situation context
  const sentences = question.match(/[^.!?]+[.!?]+/g) || [question];
  // Find last sentence ending with '?' — that's the decision prompt
  let lastQ = -1;
  for (let i = sentences.length - 1; i >= 0; i--) {
    if (sentences[i].trim().endsWith('?')) { lastQ = i; break; }
  }

  let situation, decision;
  if (lastQ > 0) {
    situation = sentences.slice(0, lastQ).join(' ').trim();
    decision  = sentences.slice(lastQ).join(' ').trim();
  } else {
    situation = '';
    decision  = question;
  }

  txt('q-situation', situation);
  txt('q-decision',  decision);
  css('q-situation', 'display', situation ? 'block' : 'none');
}

// ── Render choices ─────────────────────────────────────
function renderChoices(sc) {
  const container = el('choices');
  if (!container) return;
  container.innerHTML = '';
  const shuffled = [...sc.choices];
  shuffle(shuffled);
  shuffled.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.dataset.id = ch.id;
    btn.innerHTML = `
      <span class="choice-tag">${ch.tag||''}</span>
      <span>${ch.text}</span>
      <span class="choice-risk" style="color:${ch.color||'var(--txt2)'}">${ch.risk||''}</span>`;
    btn.addEventListener('click', () => handleChoice(ch.id));
    container.appendChild(btn);
  });
}

// ── Handle answer ──────────────────────────────────────
function handleChoice(choiceId) {
  stopTimer();
  const sc = G.current;
  const isCorrect = choiceId === sc.correctAnswer;

  // Streak + multiplier
  if (isCorrect) {
    G.streak++;
    if (G.streak > G.bestStreak) G.bestStreak = G.streak;
  } else {
    G.streak = 0;
  }

  const mult = Object.entries(STREAK_MULT)
    .filter(([k]) => G.streak >= +k)
    .reduce((_, [,v]) => v, 1.0);

  const basePts = PTS[G.level] ?? 50;
  const pts = isCorrect ? Math.round(basePts * mult) : 0;

  G.score    += pts;
  G.answered++;
  if (isCorrect) G.correct++; else G.wrong++;

  // Track topic stats
  const tag = sc.choices.find(c=>c.id===sc.correctAnswer)?.tag || 'General';
  if (!G.topicStats[tag]) G.topicStats[tag] = {correct:0,total:0};
  G.topicStats[tag].total++;
  if (isCorrect) G.topicStats[tag].correct++;

  G.history.push({
    title:sc.title, correct:isCorrect, pts, skipped:false,
    tag, correctAnswer:sc.correctAnswer,
    correctText: sc.choices.find(c=>c.id===sc.correctAnswer)?.text || '',
    explanation: sc.explanation,
  });

  // Highlight choices
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    const id = btn.dataset.id;
    if (id===sc.correctAnswer)          btn.classList.add('correct');
    else if (id===choiceId&&!isCorrect) btn.classList.add('wrong');
    else                                btn.classList.add('dimmed');
  });

  hide('hint-btn'); hide('skip-btn'); hide('hint-strip');

  // Verdict
  const verdict = el('feedback-verdict');
  if (verdict) {
    verdict.textContent = isCorrect
      ? `✅ Correct  +${pts} pts${mult>1?' ('+mult+'× streak)':''}`
      : '❌ Incorrect — 0 pts';
    verdict.style.color = isCorrect ? 'var(--grn)' : 'var(--red)';
  }

  // Streak message
  const streakEl = el('feedback-streak');
  if (streakEl) {
    if (G.streak >= 5)      streakEl.textContent = `🔥🔥 ${G.streak} in a row! 2× multiplier active`;
    else if (G.streak >= 3) streakEl.textContent = `🔥 ${G.streak} in a row! 1.5× multiplier active`;
    else                    streakEl.textContent = '';
  }

  txt('feedback-expl', sc.explanation);
  show('feedback');
  updateHUD();

  el('feedback')?.scrollIntoView({behavior:'smooth',block:'nearest'});
  if (window.innerWidth <= 768) _openBottomSheet();
}

// ── Skip ───────────────────────────────────────────────
function skipQuestion() {
  stopTimer();
  G.streak = 0;
  G.skipped++;
  G.history.push({title:G.current.title,correct:false,pts:0,skipped:true,tag:'',correctText:'',explanation:''});
  G.qIdx++;
  loadQuestion();
}

// ── Next ───────────────────────────────────────────────
function nextQuestion() {
  G.qIdx++;
  _closeBottomSheet();
  loadQuestion();
  el('right-col')?.scrollTo({top:0,behavior:'smooth'});
}

// ── Hint (with cost + limit) ───────────────────────────
function useHint() {
  if (G.hintsLeft <= 0) return;
  G.hintsLeft--;
  G.score = Math.max(0, G.score - HINT_COST);

  const strip = el('hint-strip');
  const hintTxt = el('hint-text');
  if (strip && hintTxt) {
    hintTxt.textContent = G.current.hint || 'Use the satellite readings to guide your decision.';
    strip.classList.remove('hide');
  }

  const hb = el('hint-btn');
  if (hb) hb.disabled = true;
  txt('hints-left', `${G.hintsLeft} hint${G.hintsLeft!==1?'s':''} left`);
  updateHUD();
}

// ── Timer ──────────────────────────────────────────────
function startTimer() {
  G.timerSecs = G.timerMax;
  _renderTimer(G.timerSecs);
  cls('timer-wrap','urgent',false);

  G.timerInterval = setInterval(() => {
    G.timerSecs--;
    _renderTimer(G.timerSecs);

    if (G.timerSecs <= 8) cls('timer-wrap','urgent',true);

    if (G.timerSecs <= 0) {
      stopTimer();
      _timeOut();
    }
  }, 1000);
}

function stopTimer() {
  if (G.timerInterval) { clearInterval(G.timerInterval); G.timerInterval=null; }
}

function _renderTimer(secs) {
  txt('timer-num', Math.max(0,secs));
  const ring = el('timer-ring');
  if (ring) {
    const pct = Math.max(0, secs / G.timerMax);
    ring.style.strokeDashoffset = 132 * (1 - pct);
    if (pct > .5)      ring.style.stroke = 'var(--grn)';
    else if (pct > .2) ring.style.stroke = 'var(--gold)';
    else               ring.style.stroke = 'var(--red)';
  }
}

function _timeOut() {
  // Auto-mark as wrong, show correct answer
  G.streak = 0;
  G.wrong++;
  G.answered++;
  const sc = G.current;
  const tag = sc.choices.find(c=>c.id===sc.correctAnswer)?.tag||'General';
  if (!G.topicStats[tag]) G.topicStats[tag]={correct:0,total:0};
  G.topicStats[tag].total++;
  G.history.push({title:sc.title,correct:false,pts:0,skipped:false,tag,
    correctText:sc.choices.find(c=>c.id===sc.correctAnswer)?.text||'',
    explanation:sc.explanation});

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.id===sc.correctAnswer) btn.classList.add('correct');
    else btn.classList.add('dimmed');
  });

  hide('hint-btn'); hide('skip-btn');
  const verdict = el('feedback-verdict');
  if (verdict) { verdict.textContent = '⏱️ Time\'s up — 0 pts'; verdict.style.color='var(--gold)'; }
  txt('feedback-streak','');
  txt('feedback-expl', sc.explanation);
  show('feedback');
  updateHUD();
  if (window.innerWidth<=768) _openBottomSheet();
}

// ── Band change ────────────────────────────────────────
function changeBand(b) {
  G.band = b;
  ['ir','wv','btd'].forEach(id => cls('band-'+id,'active',id.toUpperCase()===b));

  // Clear required pulse if user switched to the right band
  const reqBand = BAND_REQUIRED[G.current?.mapType];
  ['ir','wv','btd'].forEach(id => cls('band-'+id,'required',reqBand&&id.toUpperCase()===reqBand&&b!==reqBand));

  const bh = el('band-hint');
  if (bh) bh.style.display = (reqBand && b!==reqBand) ? 'block' : 'none';

  txt('map-label', _bandLabel(b));
  drawMap(el('sat-map'), G.current, b);
  show('img-loading'); css('img-credit','display','none');
  fetchSatImage(G.current, b)
    .then(()=>{ hide('img-loading'); css('img-credit','display','block'); })
    .catch(()=> hide('img-loading'));
}

function _bandLabel(b) {
  return {IR:'IR 11μm',WV:'WV 6.2μm',BTD:'BTD 8.6–11μm'}[b]||b;
}

// ── HUD ────────────────────────────────────────────────
function updateHUD() {
  css('prog-bar','width',(G.qIdx/G.totalQ*100)+'%');
  txt('q-hud',`Q ${G.qIdx+1} / ${G.totalQ}`);
  txt('score-hud', G.score+' pts');
  txt('acc-hud','Acc '+(G.answered?Math.round(G.correct/G.answered*100)+'%':'—'));

  const streakEl = el('streak-hud');
  if (streakEl) {
    if (G.streak >= 2) {
      streakEl.textContent = `🔥 ${G.streak}`;
      streakEl.classList.remove('hide');
    } else {
      streakEl.classList.add('hide');
    }
  }
}

// ── Debrief ────────────────────────────────────────────
function showDebrief() {
  stopTimer();
  stopSweep();
  hide('game-screen');
  show('debrief-screen');

  const max = G.totalQ * (PTS[G.level]??50);
  const pct = max>0 ? Math.round(G.score/max*100) : 0;

  const titles = {100:'🏆 Perfect Mission',85:'🛰️ Outstanding Forecaster',65:'📡 Mission Success',0:'🌧️ Keep Training'};
  const titleKey = Object.keys(titles).reverse().find(k=>pct>=+k);
  txt('debrief-title', titles[titleKey]);
  txt('debrief-sub', `${G.level.charAt(0).toUpperCase()+G.level.slice(1)} · ${G.answered} answered`);
  txt('score-pct', pct+'%');
  txt('score-pts', G.score+' pts');
  txt('stat-correct', G.correct);
  txt('stat-wrong',   G.wrong);
  txt('stat-skipped', G.skipped);
  txt('stat-best-streak', G.bestStreak);

  setTimeout(()=>{
    const ring = el('score-ring');
    if (ring) {
      ring.style.strokeDashoffset = 327*(1-pct/100);
      ring.style.stroke = pct>=85?'var(--grn)':pct>=65?'var(--acc)':pct>=40?'var(--gold)':'var(--red)';
    }
  }, 200);

  // Save best score to localStorage
  _saveBestScore(G.level, G.score, pct);

  // Topic breakdown
  _renderTopicBreakdown();

  // Wrong answer review
  _renderWrongReview();

  // History cards
  const grid = el('history-grid');
  if (grid) {
    grid.innerHTML = '';
    G.history.forEach((h,i)=>{
      const card = document.createElement('div');
      const cls  = h.skipped?'skipped':h.correct?'correct':'wrong';
      card.className = `hist-card ${cls}`;
      const col  = h.skipped?'var(--txt3)':h.correct?'var(--grn)':'var(--red)';
      const pts  = h.skipped?'skipped':h.correct?`+${h.pts} pts`:'0 pts';
      card.innerHTML = `<div class="hist-q">Q${i+1}</div>
        <div class="hist-title">${h.title.slice(0,34)}${h.title.length>34?'…':''}</div>
        <div class="hist-result" style="color:${col}">${pts}</div>`;
      grid.appendChild(card);
    });
  }
}

function _renderTopicBreakdown() {
  const grid = el('topic-grid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.entries(G.topicStats).forEach(([tag,{correct,total}])=>{
    const pct = total>0 ? Math.round(correct/total*100) : 0;
    const col = pct>=80?'var(--grn)':pct>=50?'var(--gold)':'var(--red)';
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.innerHTML = `<div class="topic-name">${tag}</div>
      <div class="topic-bar-wrap">
        <div class="topic-bar-track">
          <div class="topic-bar-fill" style="width:${pct}%;background:${col}"></div>
        </div>
        <span class="topic-score">${correct}/${total} (${pct}%)</span>
      </div>`;
    grid.appendChild(card);
  });
  const section = el('topic-breakdown');
  if (section) section.style.display = Object.keys(G.topicStats).length ? 'block' : 'none';
}

function _renderWrongReview() {
  const list = el('review-list');
  if (!list) return;
  list.innerHTML = '';
  const wrongs = G.history.filter(h=>!h.correct&&!h.skipped&&h.correctText);
  wrongs.forEach(h=>{
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `<div class="review-q-title">${h.title}</div>
      <div class="review-correct">✅ Correct answer: <span>${h.correctText}</span></div>
      <div class="review-expl">${h.explanation}</div>`;
    list.appendChild(card);
  });
  const section = el('review-section');
  if (section) section.style.display = wrongs.length ? 'block' : 'none';
}

// ── localStorage persistence ───────────────────────────
function _saveBestScore(level, score, pct) {
  try {
    const key = 'mw_best_'+level;
    const prev = JSON.parse(localStorage.getItem(key)||'{}');
    if (!prev.score || score > prev.score) {
      localStorage.setItem(key, JSON.stringify({score, pct, date: new Date().toLocaleDateString()}));
    }
  } catch(e) {}
}

function _renderBestScores() {
  const wrap = el('best-scores');
  if (!wrap) return;
  const levels = ['beginner','intermediate','advanced','master'];
  const items = levels.map(lvl=>{
    try {
      const d = JSON.parse(localStorage.getItem('mw_best_'+lvl)||'null');
      if (d) return `<span class="best-score-item">${lvl.charAt(0).toUpperCase()+lvl.slice(1)}: <strong>${d.score} pts</strong> (${d.pct}%)</span>`;
    } catch(e) {}
    return null;
  }).filter(Boolean);
  wrap.innerHTML = items.length ? items.join('') : '';
}

// ── Mobile bottom sheet ────────────────────────────────
function _initBottomSheet() {
  const sheet = el('bottom-sheet');
  const backdrop = el('bs-backdrop');
  if (!sheet) return;

  // Tap backdrop to close
  backdrop?.addEventListener('click', _closeBottomSheet);

  // On mobile, mirror right-col content into bottom sheet
  // We do this by moving DOM nodes when opening
}

function _openBottomSheet() {
  const sheet = el('bottom-sheet');
  const backdrop = el('bs-backdrop');
  const bsContent = el('bs-content');
  const rightCol = el('right-col');
  if (!sheet || !bsContent || !rightCol) return;

  // Clone right-col content into sheet
  bsContent.innerHTML = rightCol.innerHTML;

  // Wire up next button in the clone
  const nextBtn = bsContent.querySelector('#next-btn');
  if (nextBtn) nextBtn.addEventListener('click', nextQuestion);

  sheet.classList.add('open');
  backdrop?.classList.remove('hide');
  document.body.style.overflow = 'hidden';
}

function _closeBottomSheet() {
  el('bottom-sheet')?.classList.remove('open');
  el('bs-backdrop')?.classList.add('hide');
  document.body.style.overflow = '';
}

// ── Utilities ──────────────────────────────────────────
function shuffle(arr) {
  for (let i=arr.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}
