import { DB } from './scenarios.js'
import { fetchBriefing, fetchHint } from './api.js'
import { drawMap } from './map.js'

// Central game state – will be extended later with timer, streak, XP, etc.
export const G = {
  level: null,
  apiKey: '',
  score: 0,
  qIdx: 0,
  correct: 0,
  answered: 0,
  history: [],
  scenarios: [],
  currentSc: null,
  band: 'IR',
  totalQ: 20,
  sectionStats: {}
}

/** Helper: safely get an element by ID. Returns null if not found. */
function el(id) { return document.getElementById(id) }
/** Helper: safely set textContent if element exists. */
function setText(id, txt) { const e = el(id); if (e) e.textContent = txt }
/** Helper: safely set style property if element exists. */
function setStyle(id, prop, val) { const e = el(id); if (e) e.style[prop] = val }
/** Helper: safely add/remove class if element exists. */
function classToggle(id, cls, add) { const e = el(id); if (e) e.classList.toggle(cls, add) }
/** Helper: safely add class. */
function addClass(id, cls) { const e = el(id); if (e) e.classList.add(cls) }
/** Helper: safely remove class. */
function removeClass(id, cls) { const e = el(id); if (e) e.classList.remove(cls) }

export function initGame(){
  // Level card selection
  document.querySelectorAll('.level-card').forEach(c => {
    c.onclick = () => {
      document.querySelectorAll('.level-card').forEach(x => x.classList.remove('selected'))
      c.classList.add('selected')
      const launchBtn = el('launch-btn')
      if (launchBtn) launchBtn.classList.remove('hide')
    }
  })

  // API key handling
  const saveKeyBtn = el('save-key-btn')
  if (saveKeyBtn) {
    saveKeyBtn.onclick = () => {
      const v = (el('api-key-input') || { value: '' }).value.trim()
      const st = el('key-status')
      if (v.startsWith('sk-ant-')) {
        G.apiKey = v
        if (st) { st.textContent = '✓ Key saved'; st.className = 'key-status valid' }
      } else {
        G.apiKey = ''
        if (st) { st.textContent = '✗ Invalid key format'; st.className = 'key-status invalid' }
      }
    }
  }

  // Launch button
  const launchBtn = el('launch-btn')
  if (launchBtn) {
    launchBtn.onclick = () => {
      const sel = document.querySelector('.level-card.selected')
      if (!sel) return
      if (!G.apiKey) { alert('Please enter your Anthropic API key first'); return }
      startLevel(sel.dataset.level)
    }
  }

  // Band buttons
  const bandIr = el('band-ir'), bandWv = el('band-wv'), bandBtd = el('band-btd')
  if (bandIr) bandIr.onclick = () => changeBand('IR')
  if (bandWv) bandWv.onclick = () => changeBand('WV')
  if (bandBtd) bandBtd.onclick = () => changeBand('BTD')

  // Skip button
  const skipBtn = el('skip-btn')
  if (skipBtn) skipBtn.onclick = skipQuestion

  // Section modal controls
  const sectionBtn = el('section-btn')
  if (sectionBtn) sectionBtn.onclick = openSectionModal
  document.querySelectorAll('#section-modal .card').forEach(c => {
    c.onclick = () => selectSection(c.dataset.level)
  })
  const closeBtn = document.querySelector('#section-modal .close')
  if (closeBtn) closeBtn.onclick = closeSectionModal

  // Debrief controls
  const playAgain = el('play-again')
  if (playAgain) playAgain.onclick = () => location.reload()
  const changeSection = el('change-section')
  if (changeSection) changeSection.onclick = openSectionModal

  // Resize observer for map redraw
  const mapPanel = el('map-panel')
  if (mapPanel) {
    new ResizeObserver(() => {
      if (G.currentSc) drawMap(el('sat-map'), G.currentSc, G.band)
    }).observe(mapPanel)
  }
}

function startLevel(level){
  G.level = level; G.score = 0; G.qIdx = 0
  G.correct = 0; G.answered = 0; G.history = []
  G.scenarios = [...DB[level]]
  shuffle(G.scenarios)
  G.band = 'IR'
  addClass('title-screen', 'hide')
  removeClass('game-screen', 'hide')
  updateHUD()
  loadQuestion()
}

function loadQuestion() {
  console.log('Loading question index', G.qIdx, 'of', G.totalQ);

  if (G.qIdx >= G.totalQ) {
    showDebrief();
    return;
  }

  G.currentSc = G.scenarios[G.qIdx % G.scenarios.length];

  console.log('Current scenario:', G.currentSc);

  renderScenario();
  updateHUD();
}

function renderScenario(){
  const sc = G.currentSc, d = sc.data
  setText('sc-day', sc.day)
  setText('sc-title', sc.title)
  setText('sc-region', sc.region)
  setText('question', sc.q)
  setText('region-name', sc.region.split('(')[0].trim())
  setText('val-tb', d.TB_11 + 'K')
  setText('val-btd1', d.BTD1 + 'K')
  setText('val-delta', d.ΔBTD + 'K')
  setText('val-stormh', d.stormH + ' km')
  setStyle('rain-bar', 'width', Math.min(d.rainRate/60*100,100) + '%')
  setStyle('hgt-bar', 'width', Math.min(d.stormH/16*100,100) + '%')

  // Remove previous explanation panel
  const old = el('explain')
  if (old) old.remove()

  // Show skip button
  const skipBtn = el('skip-btn')
  if (skipBtn) skipBtn.classList.remove('hide')

  // Hint button visibility
  const hb = el('hint-btn')
  if (hb) {
    const hideHint = !(G.level === 'beginner' || G.level === 'intermediate')
    hb.classList.toggle('hide', hideHint)
    hb.onclick = () => getHint()
  }

  // Populate choices
  const cDiv = el('choices')
  if (cDiv) {
    cDiv.innerHTML = ''
    const shuffled = [...sc.choices]
    shuffle(shuffled)
    shuffled.forEach(ch => {
      const btn = document.createElement('button')
      btn.className = 'pill'
      btn.style.cssText = 'width:100%;text-align:left;margin:.25rem 0;padding:.5rem .75rem;'
      btn.dataset.id = ch.id
      btn.innerHTML = `<span style="font-size:.7rem;color:var(--txt3);display:block">${ch.tag}</span>
        ${ch.text}
        <span style="font-size:.7rem;padding:.1rem .4rem;border-radius:4px;background:${ch.rc}22;color:${ch.rc};margin-left:.5rem">${ch.risk}</span>`
      btn.onclick = () => handleChoice(ch.id)
      cDiv.appendChild(btn)
    })
  }

  // AI briefing placeholder
  const aiBox = el('ai-box')
  if (aiBox) aiBox.textContent = 'Generating briefing…'
  fetchBriefing(sc, G.level, G.apiKey).then(t => { if (aiBox) aiBox.textContent = t })

  // Draw map with current band
  try {
    drawMap(el('sat-map'), sc, G.band);
  } catch (e) {
    console.error('Map rendering failed:', e);

    const canvas = el('sat-map');

    if (canvas) {
      const ctx = canvas.getContext('2d');

      const W = canvas.width = canvas.clientWidth || 600;
      const H = canvas.height = canvas.clientHeight || 400;

      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#fff';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';

      ctx.fillText('Map unavailable', W / 2, H / 2);
    }
  }
}

function handleChoice(chId){
  const sc = G.currentSc
  const isCorrect = chId === sc.ca
  document.querySelectorAll('#choices button').forEach(b => {
    b.disabled = true
    if (b.dataset.id === sc.ca) {
      b.style.border = '2px solid var(--grn)'
      b.style.background = 'rgba(52,211,153,.15)'
    } else if (b.dataset.id === chId && !isCorrect) {
      b.style.border = '2px solid var(--red)'
      b.style.background = 'rgba(248,113,113,.15)'
    } else {
      b.style.opacity = '.45'
    }
  })

  const pts = isCorrect ? pointsPerCorrect() : 0
  G.score += pts
  G.correct += isCorrect ? 1 : 0
  G.answered++
  G.history.push({ title: sc.title, correct: isCorrect, pts, skipped: false })

  const skipBtn = el('skip-btn')
  if (skipBtn) skipBtn.classList.add('hide')

  const exp = document.createElement('div')
  exp.id = 'explain'
  exp.innerHTML = `
    <div style="font-weight:bold;margin-bottom:.4rem;color:${isCorrect ? 'var(--grn)' : 'var(--red)'}">
      ${isCorrect ? '✅ Correct! +' + pts + ' pts' : '❌ Incorrect — 0 pts'}
    </div>
    <div style="font-size:.9rem;line-height:1.6">${sc.expl}</div>
    <div style="font-size:.75rem;color:var(--txt3);margin-top:.4rem">📚 ${sc.ref}</div>
    <button id="next-q">Next Question →</button>`
  const decision = el('decision')
  if (decision) decision.appendChild(exp)
  const nextBtn = el('next-q')
  if (nextBtn) nextBtn.onclick = () => {
    G.qIdx++
    const expl = el('explain')
    if (expl) expl.remove()
    loadQuestion()
  }
  exp.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  if (window.innerWidth <= 680) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }
  updateHUD()
}

function skipQuestion(){
  G.history.push({ title: G.currentSc.title, correct: false, pts: 0, skipped: true })
  const old = el('explain')
  if (old) old.remove()
  G.qIdx++
  loadQuestion()
}

function getHint(){
  const aiBox = el('ai-box')
  if (aiBox) aiBox.textContent = 'Fetching hint…'
  fetchHint(G.currentSc, G.apiKey).then(t => { if (aiBox) aiBox.textContent = t })
}

function changeBand(b){
  G.band = b
  ;['band-ir', 'band-wv', 'band-btd'].forEach(id => {
    const elBtn = el(id)
    if (elBtn) elBtn.classList.remove('acc')
  })
  const active = el('band-' + b.toLowerCase())
  if (active) active.classList.add('acc')
  drawMap(el('sat-map'), G.currentSc, b)
}

function updateHUD(){
  setStyle('prog-bar', 'width', (G.qIdx / G.totalQ * 100) + '%')
  setText('score-hud', 'Score: ' + G.score)
  setText('q-hud', `Q: ${G.qIdx + 1}/${G.totalQ}`)
  const accText = G.answered ? Math.round(G.correct / G.answered * 100) + '%' : '—'
  setText('acc-hud', 'Acc: ' + accText)
  setText('level-badge', G.level ? G.level.charAt(0).toUpperCase() + G.level.slice(1) : '')
}

function pointsPerCorrect(){
  return { beginner: 50, intermediate: 100, advanced: 150, master: 200 }[G.level] ?? 50
}

function openSectionModal(){
  document.querySelectorAll('#section-modal .card').forEach(c => {
    const lvl = c.dataset.level
    const st = G.sectionStats[lvl]
    const statusEl = c.querySelector('.status')
    if (statusEl) {
      statusEl.textContent = G.level === lvl ? '▶ Current section' : st ? `${st.correct}/${st.answered} — ${st.score}pts` : 'Not started'
    }
  })
  const modal = el('section-modal')
  if (modal) modal.classList.remove('hide')
}

function closeSectionModal(){
  const modal = el('section-modal')
  if (modal) modal.classList.add('hide')
}

function selectSection(level){
  if (G.level) {
    G.sectionStats[G.level] = { score: G.score, correct: G.correct, answered: G.answered }
  }
  startLevel(level)
  closeSectionModal()
}

function showDebrief(){
  addClass('game-screen', 'hide')
  removeClass('debrief-screen', 'hide')
  const max = G.totalQ * pointsPerCorrect()
  const pct = Math.round(G.score / max * 100)
  const titleEl = el('debrief-title')
  if (titleEl) titleEl.textContent = pct >= 85 ? '🏆 Outstanding Forecaster!' : pct >= 65 ? '🛰️ Mission Success' : '📡 Keep Training'
  setText('final-score', G.score)
  setText('accuracy-summary', `Accuracy: ${G.correct}/${G.answered} (${pct}%)`)
  setTimeout(() => {
    const ring = el('score-ring')
    if (ring) {
      ring.style.transition = 'stroke-dashoffset .8s ease-out'
      ring.style.strokeDashoffset = 327 * (1 - pct / 100)
    }
  }, 300)
  const hist = document.querySelector('#debrief-screen .history')
  if (hist) {
    hist.innerHTML = ''
    G.history.forEach((h, i) => {
      const card = document.createElement('div')
      card.className = 'card'
      const col = h.correct ? 'var(--gold)' : 'var(--red)'
      const pts = h.skipped ? 'skipped' : '+' + h.pts
      card.innerHTML = `<strong>Q${i + 1}</strong><br>${h.title.slice(0, 30)}…<br><span style="color:${col}">${pts}</span>`
      hist.appendChild(card)
    })
  }
}

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}
