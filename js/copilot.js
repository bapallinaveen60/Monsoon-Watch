// ============================================================
// MONSOON WATCH V2 — AI Forecaster Assistant & Co-Pilot Engine
// ============================================================

export function getCopilotBriefing(sc) {
  if (!sc || !sc.data) return "Select a station to begin shift operations.";
  const d = sc.data;
  
  let analysis = `<strong>METEOROLOGICAL BRIEFING:</strong><br>`;
  analysis += `Analyzing <strong>${sc.region}</strong>. `;
  
  // TB11 Temperature Interpretation
  if (d.tb11 <= 200) {
    analysis += `The cloud top thermal emission ($TB_{11}$) is extremely cold at <strong>${d.tb11} K</strong>, indicating massive vertical development penetrating the tropopause. `;
  } else if (d.tb11 <= 220) {
    analysis += `Cloud top temperature reads <strong>${d.tb11} K</strong>, pointing to active deep convective towers. `;
  } else if (d.tb11 <= 240) {
    analysis += `Cloud tops are moderately cold (<strong>${d.tb11} K</strong>), reflecting mid-to-high tropospheric clouds. `;
  } else if (d.tb11 <= 265) {
    analysis += `Thermal band shows moderate temperatures of <strong>${d.tb11} K</strong>, indicating mid-level cloud systems. `;
  } else {
    analysis += `The thermal profile is warm at <strong>${d.tb11} K</strong>, meaning cloud tops are low-level and warm. `;
  }

  // BTD / ΔBTD Interpretation
  if (d.deltaBtd > 2.5) {
    analysis += `$\Delta BTD$ is highly positive (<strong>${d.deltaBtd} K</strong>), confirming a dominant ice-phase crystal cloud top, typical of anvil-headed cumulonimbus. `;
  } else if (d.deltaBtd > 0) {
    analysis += `$\Delta BTD$ is positive (<strong>${d.deltaBtd} K</strong>), indicating mixed-phase cloud tops (ice and water). `;
  } else {
    analysis += `$\Delta BTD$ is negative (<strong>${d.deltaBtd} K</strong>), indicating liquid-water droplets dominate the cloud top. `;
  }

  // CAPE and instability
  if (d.cape >= 3000) {
    analysis += `Extremely high instability (CAPE: <strong>${d.cape} J/kg</strong>) provides severe kinetic potential for rapid convective updrafts and severe squalls. `;
  } else if (d.cape >= 1500) {
    analysis += `Moderate to high instability (CAPE: <strong>${d.cape} J/kg</strong>) supports energetic thunderstorm cell development. `;
  } else if (d.cape >= 500) {
    analysis += `Low instability (CAPE: <strong>${d.cape} J/kg</strong>) limits vertical acceleration, but can support convective showers in the presence of terrain forcing. `;
  } else {
    analysis += `The atmosphere is thermodynamically stable (CAPE: <strong>${d.cape} J/kg</strong>). Any rainfall will be driven by steady low-level moisture convergence or orographic uplift rather than instability. `;
  }

  // Moisture loading (TCWV)
  if (d.tcwv >= 60) {
    analysis += `Total Column Water Vapour (TCWV) is saturated at <strong>${d.tcwv} mm</strong>, showing a deep precipitable water column ripe for flood-triggering rains. `;
  } else if (d.tcwv >= 45) {
    analysis += `TCWV is moderate at <strong>${d.tcwv} mm</strong>, supplying sufficient moisture for sustained rain bands. `;
  } else {
    analysis += `TCWV is dry at <strong>${d.tcwv} mm</strong>, which will cap maximum precipitation totals. `;
  }

  return analysis;
}

export function evaluateForecast(user, target) {
  // user: { rain, alert, systemClass, hazard }
  // target: { targetRain, targetAlert, targetClass, targetHazard }
  
  let score = 0;
  let breakdown = [];
  
  // 1. Rain Rate Category (25 points)
  if (user.rain === target.targetRain) {
    score += 25;
    breakdown.push(`<span class="acc-check">✅</span> <strong>Rainfall:</strong> Correctly forecasted <em>${user.rain.toUpperCase()}</em> (+25 pts)`);
  } else {
    breakdown.push(`<span class="acc-err">❌</span> <strong>Rainfall:</strong> Forecasted <em>${user.rain.toUpperCase()}</em>, but actual was <em>${target.targetRain.toUpperCase()}</em>`);
  }

  // 2. Alert Level (25 points)
  if (user.alert === target.targetAlert) {
    score += 25;
    breakdown.push(`<span class="acc-check">✅</span> <strong>Alert Level:</strong> Correctly issued <em>${user.alert.toUpperCase()} Alert</em> (+25 pts)`);
  } else {
    breakdown.push(`<span class="acc-err">❌</span> <strong>Alert Level:</strong> Issued <em>${user.alert.toUpperCase()}</em>, but operational guideline required <em>${target.targetAlert.toUpperCase()}</em>`);
  }

  // 3. System Classification (25 points)
  if (user.systemClass === target.targetClass) {
    score += 25;
    breakdown.push(`<span class="acc-check">✅</span> <strong>Classification:</strong> Correctly identified as <em>${user.systemClass.replace('_', ' ').toUpperCase()}</em> (+25 pts)`);
  } else {
    const actText = target.targetClass.replace('_', ' ').toUpperCase();
    breakdown.push(`<span class="acc-err">❌</span> <strong>Classification:</strong> Identified as <em>${user.systemClass.replace('_', ' ').toUpperCase()}</em>, actual classification was <em>${actText}</em>`);
  }

  // 4. Hazard Risk (25 points)
  if (user.hazard === target.targetHazard) {
    score += 25;
    breakdown.push(`<span class="acc-check">✅</span> <strong>Hazard Level:</strong> Correctly assessed as <em>${user.hazard.toUpperCase()} Risk</em> (+25 pts)`);
  } else {
    breakdown.push(`<span class="acc-err">❌</span> <strong>Hazard Level:</strong> Assessed <em>${user.hazard.toUpperCase()}</em>, actual risk was <em>${target.targetHazard.toUpperCase()}</em>`);
  }

  let rating = "NEED TRAINING";
  let ratingColor = "var(--red)";
  if (score === 100) { rating = "PERFECT CAPABILITY"; ratingColor = "var(--grn)"; }
  else if (score >= 75) { rating = "EXCELLENT ANALYSIS"; ratingColor = "var(--acc)"; }
  else if (score >= 50) { rating = "ACCEPTABLE ACCURACY"; ratingColor = "var(--gold)"; }

  let feedbackHtml = `
    <div style="border-left:3px solid ${ratingColor}; padding-left:12px; margin-bottom:12px">
      <h4 style="margin:0; color:${ratingColor}">${rating} (${score}/100 pts)</h4>
      <div style="font-size:0.85rem; margin-top:6px; display:grid; gap:4px">
        ${breakdown.join('<br>')}
      </div>
    </div>
    <div style="font-size:0.8rem; margin-top:10px; background:rgba(255,255,255,0.03); padding:8px; border-radius:4px">
      <strong>Co-Pilot Physical Explanation:</strong><br>${target.explanation}
    </div>
  `;

  return { score, feedbackHtml };
}

export function generateDailyChallenge() {
  const challenges = [
    {
      title: "Nor'wester Outbreak",
      desc: "CAPE exceeds 3500 J/kg over Bengal. Issue a rapid storm nowcast before cells merge into a squall line."
    },
    {
      title: "Active Ghats Orographic Cycle",
      desc: "Moisture levels at 95% over Konkan coast. Distinguish shallow rain clouds from towering anvil cells."
    },
    {
      title: "Post-Monsoon Cyclone Landfall",
      desc: "Verify storm height profiles and BTD sign transitions over coastal Andhra Pradesh."
    }
  ];
  return challenges[Math.floor(Math.random() * challenges.length)];
}
