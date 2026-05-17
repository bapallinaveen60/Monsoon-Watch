let lastBriefAttempt = 0;
let lastHintAttempt = 0;
const COOLDOWN_MS = 30000; // 30 seconds cooldown between retries

function setApiStatus(message, success){
  const el = document.getElementById('api-status');
  if(el){
    el.textContent = message;
    el.className = 'pill ' + (success ? 'acc' : 'red');
  }
}

export async function fetchBriefing(scenario, level, apiKey) {
  // Offline mock briefing generation – no external API calls.
  // Combine scenario data to produce a plausible sounding forecast.
  const {rainRate, stormH, TB_11, BTD1, ΔBTD} = scenario.data
  // Determine intensity based on rain rate
  const intensity = rainRate > 40 ? 'severe' : rainRate > 20 ? 'moderate' : 'light'
  const cyclones = stormH < 5 ? 'potential cyclonic activity' : 'stable conditions'
  const templates = [
    `Current IR band imagery shows ${intensity} rainfall with a rate of ${rainRate.toFixed(1)} mm/h. Storm height estimates around ${stormH.toFixed(1)} km suggest ${cyclones}.`,
    `Analysis of TB_11 (${TB_11}K) and BTD1 (${BTD1}K) indicates ${intensity} precipitation. Expect ${stormH > 10 ? 'strong' : 'moderate'} convection throughout the region.`,
    `Satellite observations reveal ${ΔBTD > 0 ? 'ice' : 'water'}‑dominant cloud tops. Rainfall is ${intensity} at ${rainRate.toFixed(1)} mm/h, with storm heights nearing ${stormH.toFixed(1)} km.`
  ]
  const briefing = templates[Math.floor(Math.random()*templates.length)]
  // Simulate brief loading delay
  await new Promise(r=>setTimeout(r, 200))
  setApiStatus('Mock briefing', true)
  return briefing
}

export async function fetchHint(scenario, apiKey) {
  // Offline mock hint generation – no external API calls.
  const {rainRate, stormH, TB_11, BTD1, ΔBTD} = scenario.data
  const hints = []
  if(rainRate > 30) hints.push('Heavy rain is expected; watch for flooding.')
  if(stormH < 5) hints.push('Low storm height suggests possible cyclonic development.')
  if(ΔBTD > 0) hints.push('Ice crystals dominate the upper atmosphere.')
  if(ΔBTD < 0) hints.push('Water‑rich clouds indicate strong convection.')
  if(TB_11 < 210) hints.push('Cold cloud tops point to deep convection.')
  const hint = hints.length ? hints[Math.floor(Math.random()*hints.length)] : 'Monitor the satellite imagery closely for changes.'
  await new Promise(r=>setTimeout(r, 150))
  setApiStatus('Mock hint', true)
  return hint
}
