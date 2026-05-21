// ============================================================
// MONSOON WATCH — Pure Field Scenario Database
// ZERO paper names. ZERO author names. ZERO technical jargon
// in question text. Every question reads like a duty forecaster
// facing a real operational decision.
// Correct answer rotates across a/b/c/d positions.
// ============================================================

export const DB = {

// ────────────────────────────────────────────────────────────
// BEGINNER — 20 Scenarios
// ────────────────────────────────────────────────────────────
beginner: [

{
  id:"b01", day:"5 Jul — 14:00 IST",
  title:"Drizzle Cloud Over Kerala Coast",
  region:"Kerala Coast (8–12N, 75–77E)",
  mapType:"shallow_warm",
  data:{tb11:278, btd1:-42, deltaBtd:-1.8, stormHeight:2.4, rainRate:2.1},
  question:"You are duty forecaster at Thiruvananthapuram. INSAT-3D shows a cloud brightness temperature of 278 K over the coast — almost identical to the warm sea surface below. The difference between the 6.2 μm water vapour channel and the 11 μm IR channel reads −42 K. Fishermen are asking if it is safe to head out. What is your assessment?",
  choices:[
    {id:"a", text:"A shallow, low cloud with liquid droplets only. Its top is well below the freezing level. Expect light drizzle — safe for coastal fishing.", correct:true, risk:"LIGHT DRIZZLE", color:"var(--grn)", tag:"Cloud Type"},
    {id:"b", text:"A towering storm with a top above 12 km. Dangerous gusty winds and heavy rain expected. Fishermen must stay ashore.", correct:false, risk:"EXTREME WARNING", color:"var(--red)", tag:"Cloud Type"},
    {id:"c", text:"High cirrus producing no rain at all. Perfectly safe — clear skies at low levels.", correct:false, risk:"NO RAIN", color:"var(--txt3)", tag:"Cloud Type"},
    {id:"d", text:"A deep anvil cloud with embedded lightning. Issue a thunder-squall warning.", correct:false, risk:"THUNDER WARNING", color:"var(--gold)", tag:"Cloud Type"},
  ],
  correctAnswer:"a",
  explanation:"A brightness temperature of 278 K is nearly the same as the ocean surface, meaning the cloud top is very close to the ground — a shallow, warm cloud. The strongly negative channel difference (−42 K) confirms liquid water droplets with no ice. Shallow liquid-phase clouds produce only light drizzle and pose no danger. Deep thunderstorm clouds would show temperatures below 230 K with a completely different channel signature.",
  hint:"A very warm brightness temperature means the cloud top is very low. Liquid water with no ice means no deep storm. Shallow + liquid = light rain only."
},

{
  id:"b02", day:"20 Jul — 08:30 IST",
  title:"To Issue or Not — Rain Detection Over Peninsular India",
  region:"Peninsular India (12–18N, 76–84E)",
  mapType:"kalpana",
  data:{tb11:252, btd1:-19, deltaBtd:0.9, stormHeight:4.2, rainRate:4.8},
  question:"Your satellite shows a cloud top temperature of 252 K AND the thermal channel is 24 K colder than the water vapour channel. The old single-channel rule in your office says 'issue rain warning only if cloud top is below 235 K' — which this cloud does NOT meet. Your newer multi-signal tool flags it as rain because the cloud is below 260 K AND the channel difference exceeds 19 K. Which call do you make?",
  choices:[
    {id:"a", text:"Trust only the old 235 K rule. No rain warning. The new tool must be giving a false alarm.", correct:false, risk:"NO WARNING", color:"var(--txt3)", tag:"Rain Detection"},
    {id:"b", text:"Trust the multi-signal result. Issue a rain area advisory — two independent signals agreeing is more reliable than one signal alone.", correct:true, risk:"RAIN ADVISORY", color:"var(--ac)", tag:"Rain Detection"},
    {id:"c", text:"Wait for ground station reports before issuing anything — satellite alone is insufficient.", correct:false, risk:"DELAYED RESPONSE", color:"var(--gold)", tag:"Rain Detection"},
    {id:"d", text:"Issue a severe thunderstorm warning based on the water vapour channel reading alone.", correct:false, risk:"OVER-WARNING", color:"var(--red)", tag:"Rain Detection"},
  ],
  correctAnswer:"b",
  explanation:"A single temperature threshold misses many real rain events from moderate-depth clouds. When TWO independent satellite signals both point to rain — the cloud-top temperature test AND the channel-difference test — confidence is much higher. The channel difference specifically filters out thin cirrus (which looks cold but doesn't rain) from real deep convective cloud tops. Combining two signals using AND logic eliminates false alarms while catching real rain that the single old threshold misses.",
  hint:"Two signals agreeing = higher confidence. The channel difference between thermal IR and water vapour specifically catches real rain clouds that a temperature-only rule misses."
},

{
  id:"b03", day:"12 Aug — 15:30 IST",
  title:"Two Storm Peaks in One Day — Western Ghats",
  region:"Western Ghats Coast (14–18N, 73–75E)",
  mapType:"convective_burst",
  data:{tb11:216, btd1:-21, deltaBtd:2.6, stormHeight:11.3, rainRate:32.4},
  question:"Radar at Goa shows two bursts of storm activity every day — one around 1500–1700 local time and another around 0200–0500 local time. Your senior officer asks why storms are peaking TWICE a day along this coast. What is the correct explanation?",
  choices:[
    {id:"a", text:"It is a radar malfunction — real storms cannot occur at 0300 in the morning. Only one afternoon peak is physically possible.", correct:false, risk:"EQUIPMENT ISSUE", color:"var(--txt3)", tag:"Diurnal Cycle"},
    {id:"b", text:"The afternoon peak is driven by solar heating of the mountain and sea-breeze convergence. The early-morning peak is driven by cool land air draining down the mountain and converging with warm ocean air overnight. Two different mechanisms produce two peaks.", correct:true, risk:"DUAL ALERT VALID", color:"var(--org)", tag:"Diurnal Cycle"},
    {id:"c", text:"Both peaks are the same storm system circling the region twice per day under the Coriolis force.", correct:false, risk:"INCORRECT PHYSICS", color:"var(--red)", tag:"Diurnal Cycle"},
    {id:"d", text:"The second peak is caused by sea surface temperature peaking at midnight.", correct:false, risk:"SST WRONG", color:"var(--gold)", tag:"Diurnal Cycle"},
  ],
  correctAnswer:"b",
  explanation:"The Western Ghats show a clear twice-daily storm pattern. The afternoon peak (1400–1800 local time) happens because the mountain surface heats up, destabilising the air while the sea breeze pushes moisture upslope. The early-morning peak (0100–0600 local time) happens because the land cools overnight, cool air drains down the mountain, and where it meets the still-warm coastal ocean, storms ignite. These are two completely different physical triggers operating at different times.",
  hint:"Think about what drives afternoon storms (solar heating) versus what drives night storms (land cooling). The mountain does different things at different times of day."
},

{
  id:"b04", day:"25 Jul — 18:00 IST",
  title:"Active Monsoon Flood Warning — Central India",
  region:"Central India (18–24N, 78–84E)",
  mapType:"active_monsoon",
  data:{tb11:229, btd1:-17, deltaBtd:1.1, stormHeight:8.9, rainRate:14.6},
  question:"Satellite imagery shows a large organised band of cold clouds (brightness temperature below 235 K) stretching across Madhya Pradesh and Vidarbha, covering hundreds of kilometres. Ground stations report widespread moderate rain for the past 3 days. Is this an active or break monsoon spell, and what warning should you issue?",
  choices:[
    {id:"a", text:"Break spell — organised bands mean the monsoon is weakening. No warning needed.", correct:false, risk:"NO WARNING", color:"var(--txt3)", tag:"Monsoon Phase"},
    {id:"b", text:"A pre-monsoon event — the monsoon has not yet reached Central India.", correct:false, risk:"WRONG PHASE", color:"var(--gold)", tag:"Monsoon Phase"},
    {id:"c", text:"Active monsoon spell — widespread organised cold cloud bands with sustained multi-day rain is the signature. Issue a flood advisory for low-lying areas.", correct:true, risk:"FLOOD ADVISORY", color:"var(--org)", tag:"Monsoon Phase"},
    {id:"d", text:"A cyclone approaching inland — organised cloud bands at this scale indicate a cyclone track.", correct:false, risk:"CYCLONE FALSE ALARM", color:"var(--red)", tag:"Monsoon Phase"},
  ],
  correctAnswer:"c",
  explanation:"Active monsoon spells are identified by widespread organised cold cloud bands visible in satellite imagery, sustained rainfall over large areas, and multi-day duration. The storm tops are taller and the overall cloud system more organised than during break spells. Most of India's seasonal rainfall occurs during these active phases, which can produce flood conditions when sustained for 3 or more days. Break spells show dry conditions over central India with patchy scattered cloud.",
  hint:"Organised widespread cold cloud bands lasting multiple days = active monsoon. Break = dry and patchy. This organised band spanning hundreds of km is the classic active monsoon signature."
},

{
  id:"b05", day:"8 Sep — 06:00 IST",
  title:"Sustained Rain from a Tiny Shallow Cloud",
  region:"Western Ghats (15–18N, 73.5–75.5E)",
  mapType:"orographic",
  data:{tb11:264, btd1:-12, deltaBtd:-0.5, stormHeight:3.2, rainRate:5.8},
  question:"A tourist resort on the Western Ghats calls your office. The radar echo top is only 3.2 km — well below the freezing level at 5 km. Yet it has been raining continuously for 6 hours. The caller asks: 'How can it rain so much from such a small shallow cloud?' What is your explanation?",
  choices:[
    {id:"a", text:"The satellite must be wrong — shallow clouds cannot produce sustained rain. A hidden deep system must be responsible.", correct:false, risk:"DATA ERROR ASSUMED", color:"var(--txt3)", tag:"Shallow Rain"},
    {id:"b", text:"These are warm-rain clouds producing rain purely through liquid droplets colliding and merging, with no need for ice. The mountain forces moist ocean air upward slowly and steadily, keeping these shallow clouds continuously raining.", correct:true, risk:"SUSTAINED RAIN VALID", color:"var(--grn)", tag:"Shallow Rain"},
    {id:"c", text:"Ice crystals are melting from a higher hidden cloud layer and causing the rain.", correct:false, risk:"ICE WRONG", color:"var(--gold)", tag:"Shallow Rain"},
    {id:"d", text:"The rain is fog drip off tree leaves — not actual precipitation from clouds.", correct:false, risk:"FOG DRIP", color:"var(--txt2)", tag:"Shallow Rain"},
  ],
  correctAnswer:"b",
  explanation:"The Western Ghats are famous for warm rain — precipitation that forms entirely through liquid-phase processes where water droplets collide and merge, without any ice formation. The mountain forces moist ocean air upward slowly and steadily, giving cloud droplets plenty of time to grow. The result is a shallow cloud that rains efficiently and persistently even though its top never reaches the freezing level. This is unique to regions with slow sustained orographic uplift.",
  hint:"Slow steady mountain uplift gives droplets a long time to collide and grow into raindrops — no ice needed. Shallow does not mean weak when the uplift is continuous."
},

{
  id:"b06", day:"3 Aug — 13:00 IST",
  title:"What Does a Positive BTD Tell You?",
  region:"Bay of Bengal (12–18N, 85–92E)",
  mapType:"btd_challenge",
  data:{tb11:231, btd1:-18, deltaBtd:2.3, stormHeight:9.7, rainRate:18.2},
  question:"The satellite brightness temperature difference between the 8.6 μm and 11.2 μm channels reads +2.3 K (positive) over a Bay of Bengal storm. Your trainee asks what this positive value means. How do you explain it simply?",
  choices:[
    {id:"a", text:"A positive value means ice crystals dominate the cloud. The storm is tall and deep, producing heavier rain.", correct:true, risk:"HEAVY RAIN", color:"var(--org)", tag:"Cloud Phase"},
    {id:"b", text:"Positive means warm liquid cloud — the cloud is below the freezing level with only liquid water.", correct:false, risk:"WRONG INTERPRETATION", color:"var(--txt3)", tag:"Cloud Phase"},
    {id:"c", text:"Positive means the cloud is non-precipitating. Rain only occurs when this value is negative.", correct:false, risk:"NO RAIN WRONG", color:"var(--gold)", tag:"Cloud Phase"},
    {id:"d", text:"The sign has no meteorological meaning — only the magnitude matters.", correct:false, risk:"INCORRECT", color:"var(--txt2)", tag:"Cloud Phase"},
  ],
  correctAnswer:"a",
  explanation:"Ice crystals and liquid water droplets emit infrared radiation differently at wavelengths above 10 μm. Ice has a stronger effect on longer IR wavelengths, causing the temperature difference between the 8.6 μm and 11.2 μm channels to become positive when ice dominates. Positive = ice-phase dominant = taller, deeper storm. Negative = liquid water dominant = shallower storm. This simple sign test tells you the microphysical state of the cloud without needing a radar.",
  hint:"Positive channel difference = ice. Negative = liquid water. Ice means tall deep cloud. The sign is a quick phase test you can read at a glance."
},

{
  id:"b07", day:"18 Jul — 10:00 IST",
  title:"Bright Ring on Radar — Eastern India",
  region:"Eastern India (20–24N, 83–88E)",
  mapType:"gpm_radar",
  data:{tb11:244, btd1:-14, deltaBtd:0.4, stormHeight:5.6, rainRate:6.2},
  question:"The weather radar at Ranchi shows a distinct bright horizontal ring at about 4.5 km altitude — reflectivity is highest at this level and drops sharply above. Rain is falling broadly but gently at 6 mm/hr. What does this ring tell you and what should you communicate to district authorities?",
  choices:[
    {id:"a", text:"The ring marks where lightning is occurring inside the cloud. Issue a thunder warning immediately.", correct:false, risk:"LIGHTNING WRONG", color:"var(--red)", tag:"Radar Signature"},
    {id:"b", text:"This is the melting layer — snowflakes from above partially melt into large wet particles here, creating a spike in radar return. It is the signature of widespread moderate organised rain with no embedded severe convection.", correct:true, risk:"STRATIFORM MODERATE RAIN", color:"var(--gold)", tag:"Radar Signature"},
    {id:"c", text:"The ring marks the cloud top. Everything below is dry air with no precipitation.", correct:false, risk:"WRONG INTERPRETATION", color:"var(--txt3)", tag:"Radar Signature"},
    {id:"d", text:"This is a radar antenna artefact — hardware malfunction. Ignore the ring.", correct:false, risk:"EQUIPMENT ERROR", color:"var(--txt2)", tag:"Radar Signature"},
  ],
  correctAnswer:"b",
  explanation:"The bright ring is called the melting layer or bright band. At the 0°C level around 4–5 km altitude, snowflakes falling from above begin to melt and briefly exist as large water-coated ice particles. These create a sharp spike in radar reflectivity at that altitude. Above the bright band, reflectivity drops sharply (snow). Below it, reflectivity continues as rain. This pattern is the reliable signature of widespread, gentle, organised rain — moderate and long-lasting, but not severe.",
  hint:"The bright ring is at the melting level where snow turns to rain. It is the classic signature of widespread gentle organised rain, not severe convection."
},

{
  id:"b08", day:"22 Aug — 16:30 IST",
  title:"Why Did the New AI Catch What the Old System Missed?",
  region:"Central India (20–25N, 78–85E)",
  mapType:"convective_burst",
  data:{tb11:220, btd1:-23, deltaBtd:2.9, stormHeight:12.1, rainRate:37.0},
  question:"Your office is testing a new AI storm detection system. For today's large storm over Nagpur, both the old fixed-temperature-threshold method and the new AI flag it. But for a smaller earlier storm with an irregular shape, only the AI caught it. Your colleague says the AI must be over-detecting. What is the most likely reason the AI correctly caught that irregular storm?",
  choices:[
    {id:"a", text:"The AI has a lower temperature threshold, so it flags more pixels as storm by default — classic false-alarm inflation.", correct:false, risk:"AI OVER-DETECT", color:"var(--txt3)", tag:"Detection Method"},
    {id:"b", text:"The AI uses data from a future time step to confirm current convection — it cheats by looking ahead.", correct:false, risk:"IMPOSSIBLE", color:"var(--gold)", tag:"Detection Method"},
    {id:"c", text:"The AI analyses cloud shape, boundary, and surrounding context — not just a single temperature number. Irregular-shaped convective cells missed by a fixed threshold are caught because the AI recognises the overall cloud pattern.", correct:true, risk:"CORRECT DETECTION", color:"var(--ac)", tag:"Detection Method"},
    {id:"d", text:"The AI is simply set to a lower temperature threshold, so it detects more clouds automatically.", correct:false, risk:"THRESHOLD ONLY", color:"var(--red)", tag:"Detection Method"},
  ],
  correctAnswer:"c",
  explanation:"A fixed temperature threshold treats every pixel independently — if the temperature is below the threshold it gets flagged, otherwise not. Real convective clouds have complex, irregular, fluid-like shapes. An AI system examines the spatial context around each pixel — the shape of the cloud, its boundary characteristics, the pattern of neighbouring pixels — not just one temperature value. This allows it to correctly identify convection even when the cloud has an unusual shape or hasn't yet reached the simple temperature threshold.",
  hint:"Fixed thresholds look at one pixel at a time. AI looks at the whole cloud shape and its neighbourhood. Shape matters for identifying irregular convective cells."
},

{
  id:"b09", day:"10 Sep — 09:00 IST",
  title:"Radar Echo Reaching 12 km — Bay of Bengal",
  region:"Bay of Bengal (15–19N, 86–93E)",
  mapType:"gpm_radar",
  data:{tb11:214, btd1:-25, deltaBtd:3.4, stormHeight:14.2, rainRate:52.0},
  question:"Satellite radar detects a convective cell over the Bay of Bengal where the radar echo extends all the way to 12 km altitude, and the cloud base is below 3 km. The cloud is over 9 km deep. How do you classify this and what warning do you issue?",
  choices:[
    {id:"a", text:"Shallow warm cloud — the 12 km echo is a radar reflection artefact. Light rain advisory only.", correct:false, risk:"UNDER-WARNING", color:"var(--txt3)", tag:"Deep Storm"},
    {id:"b", text:"Stratiform cloud with a melting layer near 12 km — moderate rain, no severe weather risk.", correct:false, risk:"WRONG TYPE", color:"var(--gold)", tag:"Deep Storm"},
    {id:"c", text:"A very deep, vigorous cumulonimbus. Updrafts strong enough to push radar-detectable particles to 12 km altitude. Issue a severe storm warning for vessels in the area.", correct:true, risk:"SEVERE STORM WARNING", color:"var(--red)", tag:"Deep Storm"},
    {id:"d", text:"A medium-depth cloud at the boundary of normal monsoon clouds. No special warning required.", correct:false, risk:"UNDER-CLASSIFIED", color:"var(--txt2)", tag:"Deep Storm"},
  ],
  correctAnswer:"c",
  explanation:"A cloud with meaningful radar echo at 12 km altitude and base below 3 km — a depth of 9+ km — is classified as an extreme cumulonimbus tower. Reaching 12 km requires extremely vigorous updrafts that can loft large rain and hail particles to near the tropopause. These are the most intense convective cells in the tropics, associated with heavy rain, hail, strong winds, and lightning. Vessels in the area need immediate warnings.",
  hint:"Echo at 12 km means updrafts that powerful = most extreme convection possible. A 9+ km deep cloud is the signature of the most severe tropical storms."
},

{
  id:"b10", day:"28 Jul — 12:00 IST",
  title:"Why Shallow Clouds Are So Common Over the Western Ghats",
  region:"Western Ghats (15–18N, 73.5–75.5E)",
  mapType:"orographic",
  data:{tb11:258, btd1:-10, deltaBtd:-0.4, stormHeight:3.8, rainRate:7.4},
  question:"A geography student visits your forecast centre. She asks why the Western Ghats have so many shallow rain clouds with tops below 4–5 km, while Cherrapunji in Meghalaya receives far more annual rainfall yet has very few such shallow clouds. How do you explain this paradox?",
  choices:[
    {id:"a", text:"The Western Ghats are lower than Meghalaya in altitude, so clouds automatically stay shallower.", correct:false, risk:"ALTITUDE ONLY", color:"var(--txt3)", tag:"Warm Rain"},
    {id:"b", text:"The Ghats create slow, gentle uplift of moist ocean air, giving liquid droplets time to collide and grow into raindrops without needing ice. Meghalaya's funnel-shaped terrain forces rapid violent uplift, creating deep convective clouds instead.", correct:true, risk:"MECHANISM CORRECT", color:"var(--grn)", tag:"Warm Rain"},
    {id:"c", text:"The Arabian Sea is warmer than the Bay of Bengal so it produces more liquid-phase clouds along the west coast.", correct:false, risk:"SST ONLY", color:"var(--gold)", tag:"Warm Rain"},
    {id:"d", text:"Shallow clouds are simply more common over all coastal areas — terrain type makes no difference.", correct:false, risk:"TERRAIN IGNORED", color:"var(--txt2)", tag:"Warm Rain"},
  ],
  correctAnswer:"b",
  explanation:"The type of orographic uplift determines the type of cloud. The Western Ghats create slow, sustained, gentle ascent of moist monsoon air. This gentle uplift gives cloud droplets time to grow through collision and merging — producing shallow warm clouds that rain efficiently without ice. Meghalaya's Khasi Hills funnel moisture into rapid, intense uplift, creating deep convective towers. Different terrain geometries produce fundamentally different cloud populations, even if total rainfall differs.",
  hint:"The TYPE of uplift determines the type of cloud. Slow and gentle = time for warm rain droplets to grow. Fast and violent = deep ice-phase convection."
},

{
  id:"b11", day:"5 Aug — 07:30 IST",
  title:"Cloud Temperature vs Ocean Temperature — Arabian Sea",
  region:"Arabian Sea (10–15N, 68–74E)",
  mapType:"shallow_warm",
  data:{tb11:283, btd1:-6, deltaBtd:-1.2, stormHeight:1.1, rainRate:0.4},
  question:"You check satellite thermal data over the Arabian Sea. The ocean surface temperature is about 302 K, but the cloud brightness temperature reads 283 K. A trainee says: 'TB = 283 K is warm, so this cannot be a real cloud.' Is the trainee right?",
  choices:[
    {id:"a", text:"Yes — 283 K is too warm to be a cloud. The satellite is seeing the ocean surface directly.", correct:false, risk:"TRAINEE WRONG", color:"var(--txt3)", tag:"TB Physics"},
    {id:"b", text:"No. 283 K is COLDER than the 302 K ocean surface. A real cloud exists — but it is a low, thin cloud sitting just 1–2 km above the sea. Temperature decreases with height, so 283 K = a genuine low cloud.", correct:true, risk:"LOW CLOUD CONFIRMED", color:"var(--grn)", tag:"TB Physics"},
    {id:"c", text:"TB = 283 K means the cloud is in the stratosphere where temperatures warm back up.", correct:false, risk:"STRATOSPHERE WRONG", color:"var(--red)", tag:"TB Physics"},
    {id:"d", text:"Any TB above 273 K always means no precipitation — issue a rain warning only when TB drops below 273 K.", correct:false, risk:"WRONG RULE", color:"var(--gold)", tag:"TB Physics"},
  ],
  correctAnswer:"b",
  explanation:"In the troposphere, temperature decreases with altitude at roughly 6–7 degrees per km. The satellite measures the temperature of whatever emits from the top of the atmosphere. TB = 283 K is cooler than the 302 K ocean surface, confirming a real cloud exists with its top at a temperature of 283 K. Working back through the temperature profile, this corresponds to only 1–2 km above the sea — a very low, shallow cloud. Deep convective clouds would show TB below 230 K.",
  hint:"Temperature drops with height. TB cooler than the ocean surface means a cloud is really there — just a bit above the sea. How low depends on how much cooler the TB is compared to the sea surface."
},

{
  id:"b12", day:"15 Oct — 14:00 IST",
  title:"Midnight Rain Over Chennai — Not an Error",
  region:"Tamil Nadu / Bay of Bengal (9–13N, 79–82E)",
  mapType:"ne_monsoon",
  data:{tb11:238, btd1:-16, deltaBtd:1.0, stormHeight:7.2, rainRate:12.8},
  question:"A district collector in Chennai calls at 0100 local time, puzzled by heavy rain when the forecast mentioned afternoon thunderstorms. You explain that during the active northeast monsoon, rain in southeastern India actually peaks at a very different time. What do you tell him?",
  choices:[
    {id:"a", text:"The forecast was simply wrong — afternoon is always the only possible peak for any storm system in India.", correct:false, risk:"FORECAST ERROR", color:"var(--txt3)", tag:"Diurnal Phase"},
    {id:"b", text:"During active monsoon conditions over southeastern India, rain frequently peaks around midnight to early morning. Large organised cloud systems from the Bay of Bengal propagate inland overnight, arriving at the coast around midnight.", correct:true, risk:"MIDNIGHT PEAK CORRECT", color:"var(--ac)", tag:"Diurnal Phase"},
    {id:"c", text:"Midnight rain is only caused by urban heat islands. Chennai's city heat is creating this local effect.", correct:false, risk:"URBAN ONLY", color:"var(--gold)", tag:"Diurnal Phase"},
    {id:"d", text:"The rain must have come from an unreported cyclone — issue a cyclone warning immediately.", correct:false, risk:"FALSE CYCLONE", color:"var(--red)", tag:"Diurnal Phase"},
  ],
  correctAnswer:"b",
  explanation:"Satellite and radar data shows southeastern India has a distinct midnight-to-early-morning rainfall peak during active monsoon conditions. Large organised storm systems initiate offshore in the Bay of Bengal, often in the evening or early night, and then propagate westward, reaching the Tamil Nadu coast around midnight. This is a well-documented pattern. The rainfall timing is highly location-specific and not always aligned with afternoon peak expectations.",
  hint:"Large storm systems travel. They form offshore in the Bay and arrive at the coast overnight. The afternoon storm becomes a midnight arrival after travelling across the water."
},

{
  id:"b13", day:"2 Jul — 11:00 IST",
  title:"What the Satellite Radar Cannot See",
  region:"Indo-Gangetic Plain (26–30N, 78–85E)",
  mapType:"stratiform",
  data:{tb11:254, btd1:-13, deltaBtd:0.3, stormHeight:4.5, rainRate:3.8},
  question:"A researcher is using satellite radar data over the IGP. She asks you what types of precipitation the satellite radar might be missing. What do you tell her?",
  choices:[
    {id:"a", text:"The satellite radar misses everything above 12 km — it cannot detect tall convective storms.", correct:false, risk:"WRONG LIMITATION", color:"var(--txt3)", tag:"Instrument Limit"},
    {id:"b", text:"Below the radar's sensitivity floor, very light drizzle, thin stratiform layers, and shallow warm drizzle clouds may be completely invisible to the satellite radar.", correct:true, risk:"MISSED RAIN TYPES", color:"var(--txt2)", tag:"Instrument Limit"},
    {id:"c", text:"The sensitivity floor only matters over mountains — over flat plains the radar has no detection limit.", correct:false, risk:"WRONG TERRAIN", color:"var(--gold)", tag:"Instrument Limit"},
    {id:"d", text:"The satellite radar detects all precipitation without exception — it has no blind spots.", correct:false, risk:"REVERSED", color:"var(--red)", tag:"Instrument Limit"},
  ],
  correctAnswer:"b",
  explanation:"All radars have a minimum detectable signal — the sensitivity floor. Below this threshold, any cloud or precipitation is invisible. Very light rain, drizzle, fog droplets, and thin stratiform layers often fall below this sensitivity floor. This limitation is important when interpreting satellite radar data — it sees moderate-to-heavy rain very well, but systematically underestimates the frequency of very light precipitation.",
  hint:"Every radar instrument has a detection floor. Below it equals invisible. Light rain and drizzle often fall below what satellite radars can detect."
},

{
  id:"b14", day:"18 Jun — 16:00 IST",
  title:"What Matters Most for Widespread Stratiform Rain?",
  region:"Central India (18–24N, 78–85E)",
  mapType:"active_monsoon",
  data:{tb11:241, btd1:-15, deltaBtd:0.7, stormHeight:7.8, rainRate:10.2},
  question:"You are briefing colleagues on which satellite indicators matter most for forecasting widespread STRATIFORM rainfall. A colleague argues you should focus on CAPE and atmospheric instability. You disagree. What do you say?",
  choices:[
    {id:"a", text:"CAPE and lapse rate are the most important predictors for ALL rainfall types including stratiform.", correct:false, risk:"WRONG PREDICTOR", color:"var(--txt3)", tag:"Stratiform Predictors"},
    {id:"b", text:"For stratiform rain, how much moisture and water vapour is in the atmosphere matters most. Instability (CAPE) is more relevant for convective rain — the two rain types have different drivers.", correct:true, risk:"STRATIFORM CORRECT", color:"var(--gold)", tag:"Stratiform Predictors"},
    {id:"c", text:"Wind shear is the only important predictor for stratiform rain.", correct:false, risk:"SHEAR ONLY", color:"var(--txt2)", tag:"Stratiform Predictors"},
    {id:"d", text:"Stratiform and convective rain have identical predictors — the distinction is irrelevant.", correct:false, risk:"SAME PREDICTORS", color:"var(--red)", tag:"Stratiform Predictors"},
  ],
  correctAnswer:"b",
  explanation:"For stratiform rainfall, the most important drivers are moisture-related — total atmospheric humidity and the amount of water vapour in the column. Stratiform rain needs a moist, saturated atmosphere to produce widespread gentle rainfall. Convective rain, by contrast, is driven by atmospheric instability (CAPE) and how quickly temperature drops with height. Confusing the predictors leads to poor forecasts of rainfall type and amount.",
  hint:"Stratiform rain is gentle and widespread — it needs a moist atmosphere, not an unstable one. Convection needs instability. Different rain types have different drivers."
},

{
  id:"b15", day:"30 Aug — 08:00 IST",
  title:"Dry August Over Central India — Explaining the Break",
  region:"Central India (20–26N, 76–84E)",
  mapType:"shallow_warm",
  data:{tb11:272, btd1:-7, deltaBtd:-0.6, stormHeight:2.0, rainRate:1.2},
  question:"It is late August and central India is suddenly dry after weeks of rain. Satellite shows warm brightness temperatures (272 K), scattered small clouds, and no organised cloud bands. Farmers are worried. You need to explain the situation. What is this called and what character does any remaining rain have?",
  choices:[
    {id:"a", text:"The monsoon has permanently withdrawn early. Issue an end-of-season advisory.", correct:false, risk:"PREMATURE WITHDRAWAL", color:"var(--txt3)", tag:"Break Spell"},
    {id:"b", text:"This is a monsoon break spell. Central India becomes temporarily dry. Any rain that does occur will be mostly shallow, isolated convective showers — not the organised heavy rainfall of active conditions.", correct:true, risk:"BREAK SPELL DRY", color:"var(--pur)", tag:"Break Spell"},
    {id:"c", text:"A western disturbance is arriving — rain will intensify soon.", correct:false, risk:"WRONG SYSTEM", color:"var(--gold)", tag:"Break Spell"},
    {id:"d", text:"Nothing has changed — this is normal monsoon weather.", correct:false, risk:"MISSED BREAK", color:"var(--txt2)", tag:"Break Spell"},
  ],
  correctAnswer:"b",
  explanation:"The Indian monsoon alternates between active spells (heavy organised rain over central India) and break spells (dry central India, rain shifted to Himalayan foothills and east coast). During breaks, brightness temperatures over central India warm up (less cloud cover), and any remaining rainfall comes from shallow, scattered convective cells rather than organised storm systems. The break is temporary — active conditions typically return within days to weeks.",
  hint:"Active = organised widespread rain. Break = dry central India with scattered shallow showers only. The cloud type changes completely, not just the rainfall amount."
},

{
  id:"b16", day:"14 Jul — 15:00 IST",
  title:"Mountain Top Storms Deeper Than Coastal Storms",
  region:"Western Ghats (14–18N, 73.5–75.5E)",
  mapType:"convective_burst",
  data:{tb11:218, btd1:-22, deltaBtd:2.4, stormHeight:11.4, rainRate:29.6},
  question:"Radar shows afternoon storms over the Western Ghats mountain top have echo tops at 11 km, while coastal storms at the same time only reach 6 km. A meteorology student asks why mountain top storms are so much deeper in the afternoon. What is the key reason?",
  choices:[
    {id:"a", text:"Mountain altitude reduces air pressure so clouds naturally expand vertically — it is a pure pressure effect.", correct:false, risk:"PRESSURE ONLY", color:"var(--txt3)", tag:"Terrain Convection"},
    {id:"b", text:"In the afternoon, the mountain surface heats intensely, acting as an elevated heat source. This extra heating energy, combined with forced uplift and moisture convergence from the sea breeze, produces much deeper and more vigorous storms on the mountain top than over the cooler coast.", correct:true, risk:"DEEP MOUNTAIN STORM", color:"var(--org)", tag:"Terrain Convection"},
    {id:"c", text:"Coastal storms are weakened by sea spray entering the radar beam. Mountain radar is unaffected.", correct:false, risk:"RADAR ERROR", color:"var(--gold)", tag:"Terrain Convection"},
    {id:"d", text:"Mountain storms are older and have had more time to develop since morning.", correct:false, risk:"AGE ONLY", color:"var(--txt2)", tag:"Terrain Convection"},
  ],
  correctAnswer:"b",
  explanation:"Three factors combine to make mountain-top afternoon storms deeper: (1) The hot mountain surface in the afternoon acts as an elevated heat source, boosting instability. (2) Orographic uplift forces moist air upward. (3) Sea-breeze convergence adds more moisture at low levels. Together these produce storms with much higher echo tops and stronger vertical motion than coastal storms at the same time. Mountain top storms reach their maximum depth around 1500–1700 local time.",
  hint:"The mountain surface is a heat source in the afternoon. This energy + forced uplift + moisture from the sea breeze = deeper, more powerful storms than over the coast."
},

{
  id:"b17", day:"22 Sep — 17:30 IST",
  title:"Old Single-Channel vs New Dual-Signal Detection",
  region:"Southwest Monsoon India (12–28N, 68–90E)",
  mapType:"kalpana",
  data:{tb11:248, btd1:-16, deltaBtd:0.8, stormHeight:6.1, rainRate:8.4},
  question:"Your forecast office switches from an old single-channel rain detection method (using only cloud top temperature) to a new dual-signal method that checks both cloud top temperature AND the difference between the thermal and water vapour channels. Your supervisor asks for the main operational benefit. What do you say?",
  choices:[
    {id:"a", text:"The old method was already perfect. The new method is redundant and creates unnecessary complexity.", correct:false, risk:"OLD IS FINE", color:"var(--txt3)", tag:"Algorithm Upgrade"},
    {id:"b", text:"The new dual-signal method detects many rain cases the single temperature threshold misses — especially moderate-depth clouds — and rejects false alarms from thin cirrus that looks cold but does not rain.", correct:true, risk:"IMPROVED DETECTION", color:"var(--ac)", tag:"Algorithm Upgrade"},
    {id:"c", text:"The main benefit is that the new method works only at night when the old method fails completely.", correct:false, risk:"NIGHTTIME ONLY", color:"var(--gold)", tag:"Algorithm Upgrade"},
    {id:"d", text:"The new method runs faster — computational speed is the only improvement.", correct:false, risk:"SPEED ONLY", color:"var(--txt2)", tag:"Algorithm Upgrade"},
  ],
  correctAnswer:"b",
  explanation:"A single temperature threshold misses moderate-depth rain clouds and falsely flags thin high cirrus (cold temperature but no rain). Adding a second condition — the difference between the thermal IR and water vapour channel — specifically filters out cirrus (where this difference is small) while capturing deep convective clouds (where this difference is large because the cold cloud top stands out from the moisture layer below it). Two signals agreeing gives much better rain area detection.",
  hint:"Two signals saying rain is much more trustworthy than one. The second signal also rejects cirrus false alarms that fooled the old method."
},

{
  id:"b18", day:"8 Aug — 14:00 IST",
  title:"Which Risk Matters More — 80% or 20%?",
  region:"Central India (20–25N, 78–84E)",
  mapType:"conv_vs_strat",
  data:{tb11:234, btd1:-15, deltaBtd:1.0, stormHeight:7.6, convFrac:0.20, stratFrac:0.80, rainRate:11.2},
  question:"Satellite radar maps show that over Central India this afternoon, 80% of the cloudy area is gentle widespread rain and only 20% is intense convective cores. A dam operator asks: 'Should I be worried about the 80% or the 20%?' How do you advise him?",
  choices:[
    {id:"a", text:"The 80% gentle rain is the bigger risk because it covers more ground and produces more total water. Ignore the 20% intense cores.", correct:false, risk:"WRONG PRIORITY", color:"var(--txt3)", tag:"Conv vs Strat"},
    {id:"b", text:"Both matter but differently. The 80% gentle rain is slowly filling your reservoir. The 20% intense cores produce 2–3 times higher local rain rates — these are the flash flood risk for rivers immediately downstream.", correct:true, risk:"DUAL RISK ADVISORY", color:"var(--org)", tag:"Conv vs Strat"},
    {id:"c", text:"Neither is a risk when gentle rain dominates — convective fraction below 25% means the system is safe.", correct:false, risk:"UNDER-ESTIMATE", color:"var(--gold)", tag:"Conv vs Strat"},
    {id:"d", text:"A 20%/80% split means the storm is dissipating — no significant rain expected from either type.", correct:false, risk:"DISSIPATING WRONG", color:"var(--txt2)", tag:"Conv vs Strat"},
  ],
  correctAnswer:"b",
  explanation:"Convective rain (intense, localised) and gentle widespread rain pose different types of risk. The large gentle-rain area gradually fills reservoirs and saturates soils. The convective cores, though small in area, produce rain rates 2–4 times higher — capable of causing localised flash flooding in river channels. A dam operator needs to track both: the cumulative inflow from widespread gentle rain across the whole catchment, AND the sudden high-intensity bursts from convective cells upstream.",
  hint:"Small intense cores = flash flood risk. Large gentle rain area = slow steady inflow. Both risks are real but completely different. Advise for both."
},

{
  id:"b19", day:"12 Jun — 13:00 IST",
  title:"Both Channel Differences Negative — Arabian Sea",
  region:"Arabian Sea (10–15N, 65–72E)",
  mapType:"shallow_warm",
  data:{tb11:271, btd1:-35, deltaBtd:-2.1, stormHeight:1.8, rainRate:1.6},
  question:"You are analysing a cloud over the Arabian Sea. The temperature difference between 8.6 μm and 11.2 μm reads −3 K (negative). The temperature difference between 6.2 μm and 11.2 μm reads −35 K (also negative). What do these two negative values together tell you about the cloud?",
  choices:[
    {id:"a", text:"Both negative values indicate ice crystals dominate — this is a cold deep storm cloud.", correct:false, risk:"SIGN REVERSED", color:"var(--red)", tag:"BTD Phase"},
    {id:"b", text:"Both negative values point to liquid water droplets dominating — this is a warm shallow cloud with no significant ice content.", correct:true, risk:"WARM PHASE CLOUD", color:"var(--ac)", tag:"BTD Phase"},
    {id:"c", text:"Negative values mean the cloud is optically thin and non-precipitating — rain cannot occur.", correct:false, risk:"NON-PRECIPITATING WRONG", color:"var(--txt3)", tag:"BTD Phase"},
    {id:"d", text:"Channel differences are irrelevant — only the single brightness temperature value matters for phase determination.", correct:false, risk:"SIGN IRRELEVANT WRONG", color:"var(--gold)", tag:"BTD Phase"},
  ],
  correctAnswer:"b",
  explanation:"Ice crystals and liquid water droplets emit infrared radiation differently. At wavelengths above 10 μm, ice has a stronger effect, causing the channel differences to tend positive for ice-dominant clouds. Negative values for both channel differences here confirm liquid water droplets dominate — the cloud is shallow, below the freezing level, with liquid droplets only. Both tests agree: warm-phase liquid cloud with no ice.",
  hint:"Both channel differences negative = strong liquid water signal. Negative = liquid. Positive = ice. When two tests agree, confidence is high."
},

{
  id:"b20", day:"27 Aug — 10:00 IST",
  title:"Where Are the World's Most Intense Monsoon Storms?",
  region:"Himalayan Foothills (28–32N, 76–84E)",
  mapType:"convective_burst",
  data:{tb11:212, btd1:-26, deltaBtd:3.6, stormHeight:13.8, rainRate:48.0},
  question:"A journalist asks you: globally, where do satellite radars detect the most intense tropical convective storms? She expects the answer to be somewhere in the Pacific or Caribbean. What does the 10-year satellite radar data actually show?",
  choices:[
    {id:"a", text:"The most intense storms are uniformly distributed — no regional concentration exists globally.", correct:false, risk:"NO CONCENTRATION", color:"var(--txt3)", tag:"Global Convection"},
    {id:"b", text:"The foothills of the western Himalayas in India, along with parts of southeastern South America and central Africa, are among the world's top locations for extreme convective storm intensity.", correct:true, risk:"GLOBAL HOTSPOT", color:"var(--red)", tag:"Global Convection"},
    {id:"c", text:"The most intense storms are over the central Pacific Ocean near Hawaii.", correct:false, risk:"PACIFIC WRONG", color:"var(--gold)", tag:"Global Convection"},
    {id:"d", text:"The Arabian Sea and Bay of Bengal produce the world's most intense storms — all extreme convection is oceanic.", correct:false, risk:"OCEAN ONLY WRONG", color:"var(--txt2)", tag:"Global Convection"},
  ],
  correctAnswer:"b",
  explanation:"Ten years of satellite radar data reveals that the globally most intense convective storms concentrate over three land regions: the western Himalayan foothills in India, southeastern South America, and equatorial Africa. These locations share warm, moist air sources feeding into areas with strong thermal or terrain forcing. The Himalayan foothills combine Bay of Bengal moisture with terrain triggering and extreme atmospheric instability. This surprises many people who expect open-ocean regions to dominate.",
  hint:"The most intense global convection is NOT over the open ocean — it is where warm moist air meets dramatic land terrain. India's Himalayan foothills are a global hotspot."
},

], // end beginner

// ────────────────────────────────────────────────────────────
// INTERMEDIATE — 20 Scenarios
// ────────────────────────────────────────────────────────────
intermediate: [

{
  id:"i01", day:"6 Jul — 14:30 IST",
  title:"Positive ΔBTD — Classifying the Bay of Bengal Storm",
  region:"Bay of Bengal (15–20N, 85–93E)",
  mapType:"btd_challenge",
  data:{tb11:227, btd1:-17, deltaBtd:2.4, stormHeight:9.6, rainRate:19.2},
  question:"Satellite data over a Bay of Bengal storm shows the difference between two infrared channel pairs gives ΔBTD = +2.4 K (positive). Your supervisor asks: given this positive ΔBTD, what storm class does this fall into, and what rain rate do you expect at the surface?",
  choices:[
    {id:"a", text:"Positive ΔBTD → water-phase dominant, shorter storm. Classify as low-height cloud. Light rain expected under 10 mm/hr.", correct:false, risk:"WRONG CLASS", color:"var(--txt3)", tag:"ΔBTD Classification"},
    {id:"b", text:"Positive ΔBTD → ice-phase dominant, taller storm. This is the deeper ice-dominant class. Expect heavy rain around 18–22 mm/hr.", correct:true, risk:"HEAVY RAIN", color:"var(--org)", tag:"ΔBTD Classification"},
    {id:"c", text:"Positive ΔBTD → non-precipitating cirrus. No rain warning needed.", correct:false, risk:"NO RAIN WRONG", color:"var(--gold)", tag:"ΔBTD Classification"},
    {id:"d", text:"Positive ΔBTD → storm is weakening. Issue an all-clear for the region.", correct:false, risk:"ALL CLEAR WRONG", color:"var(--txt2)", tag:"ΔBTD Classification"},
  ],
  correctAnswer:"b",
  explanation:"ΔBTD is calculated from two channel differences. A positive value means ice-phase hydrometeors dominate the cloud — ice particles interact differently with different infrared wavelengths compared to liquid droplets. Ice-dominant clouds are taller, reaching higher into the atmosphere. This places the storm in the ice-dominant, taller class with higher storm tops and correspondingly heavier near-surface rain rates. A positive ΔBTD of +2.4 K combined with a cold brightness temperature of 227 K is consistent with an organised deep convective system producing 18–22 mm/hr.",
  hint:"ΔBTD positive = ice dominant = taller storm. ΔBTD negative = water dominant = shorter storm. More ice = more height = heavier rain expected."
},

{
  id:"i02", day:"19 Jul — 09:00 IST",
  title:"Seasonal Variation in Algorithm Performance",
  region:"India (Kalpana-1 Coverage)",
  mapType:"kalpana",
  data:{tb11:249, btd1:-18, deltaBtd:0.9, stormHeight:6.3, rainRate:9.4},
  question:"Your rain detection algorithm has been tested over four monsoon seasons. Detection performance (probability of detecting real rain) ranges from 0.52 in September to 0.85 in July. A colleague argues this variability means the algorithm is unreliable. How do you respond?",
  choices:[
    {id:"a", text:"Agree — a good algorithm should give identical performance every season. Variability means the algorithm is broken.", correct:false, risk:"ALGORITHM BROKEN", color:"var(--txt3)", tag:"Algorithm Validation"},
    {id:"b", text:"This variability is expected and does not mean the algorithm is unreliable. Monsoon rainfall character changes month to month — July storms are different from September storms. Performance varying with the character of rainfall is normal and expected.", correct:true, risk:"CONSISTENT PERFORMANCE", color:"var(--ac)", tag:"Algorithm Validation"},
    {id:"c", text:"Only the worst-case performance matters for safety. Redesign the algorithm around the worst month only.", correct:false, risk:"WORST CASE ONLY", color:"var(--gold)", tag:"Algorithm Validation"},
    {id:"d", text:"Discard any validation case where performance falls below 0.80.", correct:false, risk:"TOO STRICT", color:"var(--txt2)", tag:"Algorithm Validation"},
  ],
  correctAnswer:"b",
  explanation:"Rain detection algorithm performance naturally varies across seasons because monsoon rainfall character changes. Early June has shallow systems; July–August has deep organised storms; September transitions to less organised rainfall. A well-designed algorithm consistently selects the best approach across 13 out of 15 test cases, with detection rates ranging from 0.52–0.85. This range reflects the changing nature of rainfall, not algorithm failure. Seasonal variability in performance is a feature of reality, not a defect.",
  hint:"Monsoon changes character month to month. Algorithm performance will naturally vary too. What matters is consistent best-choice selection across all conditions, not identical numbers every time."
},

{
  id:"i03", day:"25 Aug — 16:00 IST",
  title:"Why Gentle Widespread Rain Dominates Active Monsoon Statistics",
  region:"Central India (20–26N, 76–84E)",
  mapType:"active_monsoon",
  data:{tb11:228, btd1:-16, deltaBtd:1.3, stormHeight:9.0, rainRate:15.4},
  question:"During active monsoon spells, the fraction of rain area classified as gentle widespread rain is HIGHER than during dry break spells — even though active spells produce far more total rainfall. A student finds this paradoxical. What is the physical explanation?",
  choices:[
    {id:"a", text:"Active spells suppress intense convection through high atmospheric pressure, forcing all rain into the gentle widespread category.", correct:false, risk:"HIGH PRESSURE WRONG", color:"var(--txt3)", tag:"Stratiform Dominance"},
    {id:"b", text:"During active spells, large organised storm systems dominate. Each system has a small intense convective core but a vast surrounding cloud anvil that covers 5–10 times more area. Many simultaneous systems mean the collective anvil area dwarfs the convective cores in statistics.", correct:true, risk:"MCS PHYSICS", color:"var(--gold)", tag:"Stratiform Dominance"},
    {id:"c", text:"Gentle widespread rain dominates because the monsoon jet stream shears apart all convective cells during active spells.", correct:false, risk:"JET SHEAR WRONG", color:"var(--red)", tag:"Stratiform Dominance"},
    {id:"d", text:"Active spells are actually drier than break spells — this paradox shows the classification system is wrong.", correct:false, risk:"WRONG CONCEPT", color:"var(--txt2)", tag:"Stratiform Dominance"},
  ],
  correctAnswer:"b",
  explanation:"An individual large monsoon storm system has a concentrated intense core (perhaps 50 km wide) surrounded by a vast cloud anvil region extending hundreds of kilometres. During active monsoon spells, multiple such systems develop simultaneously across central India. The collective anvil area from all these systems dwarfs their intense cores in total area, making gentle widespread rain dominate the area statistics. This is not a contradiction — the intense cores still drive the heaviest rain totals, but they are vastly outnumbered in area by their own cloud halos.",
  hint:"One large storm = tiny intense core + huge surrounding cloud anvil. Many simultaneous storms = enormous total gentle-rain area. The gentle rain tail wags the intense core dog in area terms."
},

{
  id:"i04", day:"8 Sep — 11:00 IST",
  title:"Why Cloud Boundaries Matter for AI Detection",
  region:"Eastern India (22–26N, 86–92E)",
  mapType:"convective_burst",
  data:{tb11:219, btd1:-24, deltaBtd:3.2, stormHeight:12.8, rainRate:42.0},
  question:"A software engineer building a storm detection AI asks you: why is it important to include a module that specifically extracts cloud boundary and shape features, instead of just using brightness temperature values pixel by pixel? What do you explain?",
  choices:[
    {id:"a", text:"Cloud boundaries are irrelevant — only the coldest pixels need to be identified. Shape information adds noise.", correct:false, risk:"BOUNDARIES IRRELEVANT WRONG", color:"var(--txt3)", tag:"AI Architecture"},
    {id:"b", text:"Convective clouds have fluid, irregular, evolving shapes. A pixel-by-pixel threshold misses the spatial organisation that makes a cluster of cold pixels a real convective system versus random cold patches. Shape and boundary features capture this organisational information.", correct:true, risk:"SHAPE MATTERS", color:"var(--ac)", tag:"AI Architecture"},
    {id:"c", text:"Cloud boundaries only matter for cyclone detection, not for monsoon convection.", correct:false, risk:"CYCLONE ONLY WRONG", color:"var(--gold)", tag:"AI Architecture"},
    {id:"d", text:"A shape module is purely a speed optimisation, not a meteorological improvement.", correct:false, risk:"SPEED ONLY WRONG", color:"var(--txt2)", tag:"AI Architecture"},
  ],
  correctAnswer:"b",
  explanation:"Convective clouds are fluid and irregular — they have complex, continuously changing shapes. A small convective cell doesn't always stand out by temperature alone; its spatial organisation (how cold pixels cluster, how the boundary looks) is a key distinguishing feature. A pixel-by-pixel threshold approach lacks this spatial awareness and misses irregular or boundary-ambiguous convective cells. By explicitly extracting shape and boundary features, the AI can recognise the overall organisational pattern of convection, not just isolated cold spots.",
  hint:"Convective clouds are fluid and irregular. Recognising them requires understanding the shape pattern across multiple pixels, not just the temperature at each single point."
},

{
  id:"i05", day:"15 Jul — 15:00 IST",
  title:"Growing vs Mature Cell — Reading the Radar Profile",
  region:"Bay of Bengal (15–19N, 86–93E)",
  mapType:"gpm_radar",
  data:{tb11:224, btd1:-21, deltaBtd:2.1, stormHeight:11.0, rainRate:28.5},
  question:"Satellite radar shows two convective cells side by side. Cell A has its highest radar reflectivity near 8 km altitude with weaker echo near 3 km. Cell B has its highest reflectivity near 3 km altitude with weaker echo at 8 km. Which cell is in an earlier (growing) stage and which is later (mature/declining)?",
  choices:[
    {id:"a", text:"Both cells are in the same life-cycle stage — vertical reflectivity distribution has no relationship to development stage.", correct:false, risk:"NO DIFFERENCE WRONG", color:"var(--txt3)", tag:"Cell Life Cycle"},
    {id:"b", text:"Cell A (peak at 8 km) is growing — vigorous updrafts are lifting large particles high. Cell B (peak at 3 km) is later-mature — particles have descended below the freezing level as updrafts weaken.", correct:true, risk:"LIFE CYCLE CORRECT", color:"var(--ac)", tag:"Cell Life Cycle"},
    {id:"c", text:"Cell B (near-surface peak) is more dangerous and must be the growing cell. High surface reflectivity equals intense updraft.", correct:false, risk:"REVERSED LIFE CYCLE", color:"var(--red)", tag:"Cell Life Cycle"},
    {id:"d", text:"The cell with the highest total reflectivity anywhere is always the growing cell regardless of height.", correct:false, risk:"TOTAL Ze ONLY WRONG", color:"var(--gold)", tag:"Cell Life Cycle"},
  ],
  correctAnswer:"b",
  explanation:"During the growing and early mature phase of a convective cell, vigorous updrafts carry large ice particles high into the upper troposphere, producing maximum radar reflectivity at 8–10 km. As the cell matures and updrafts weaken, particles fall out — descending through the melting level and accumulating near the surface, shifting the peak reflectivity downward to 3–4 km. Cell A will soon produce the heaviest rain as particles fall; Cell B is already in its heavy-rain phase but may be weakening.",
  hint:"Peak reflectivity high up = updraft still strong = early stage. Peak reflectivity low down = particles have fallen = late stage. The peak descends over the storm's lifetime."
},

{
  id:"i06", day:"28 Jun — 10:00 IST",
  title:"Western Ghats vs Meghalaya — Different Warnings for Different Clouds",
  region:"Western Ghats vs. Meghalaya",
  mapType:"orographic",
  data:{tb11:262, btd1:-10, deltaBtd:-0.4, stormHeight:3.6, rainRate:6.8},
  question:"You compare cloud data over the Western Ghats (3,000 mm/year) and Cherrapunji, Meghalaya (11,000 mm/year). The Ghats have mostly shallow clouds with tops below 4.5 km. Meghalaya has mostly deep clouds. As a forecaster, what different warning implications does this difference have?",
  choices:[
    {id:"a", text:"No operational difference — shallow and deep clouds use identical warning thresholds.", correct:false, risk:"NO DIFFERENCE WRONG", color:"var(--txt3)", tag:"Cloud Type Warnings"},
    {id:"b", text:"Ghats shallow clouds produce sustained moderate rain over long periods — cumulative flood risk from soil saturation. Meghalaya's deep clouds produce extreme short-burst rain rates — immediate flash flood and landslide risk. Different cloud types need different warning strategies.", correct:true, risk:"DIFFERENT WARNINGS", color:"var(--org)", tag:"Cloud Type Warnings"},
    {id:"c", text:"Ghats shallow clouds are harmless — only deep clouds like Meghalaya's deserve warnings.", correct:false, risk:"WG SAFE WRONG", color:"var(--txt3)", tag:"Cloud Type Warnings"},
    {id:"d", text:"Since Meghalaya has more total rain, it always gets heavier warnings. Cloud type is irrelevant.", correct:false, risk:"TOTAL RAIN ONLY WRONG", color:"var(--gold)", tag:"Cloud Type Warnings"},
  ],
  correctAnswer:"b",
  explanation:"The operational warning implications differ fundamentally. Ghats shallow warm-rain clouds produce persistent moderate rain over many hours — cumulative totals saturate hillside soils causing gradual landslides and fills streams slowly. Meghalaya's deep convective systems can produce extreme short-burst rainfall causing near-instantaneous flash floods. Alert timing and thresholds must be different: cumulative totals for the Ghats, peak intensity thresholds for Meghalaya.",
  hint:"Shallow clouds = sustained moderate rain = cumulative flood risk. Deep convective clouds = short intense bursts = flash flood risk. Different threats need different warnings."
},

{
  id:"i07", day:"3 Aug — 16:30 IST",
  title:"Why Does Spatial Pattern Help Rain Classification?",
  region:"India (INSAT Coverage)",
  mapType:"geo_diag",
  data:{tb11:236, btd1:-14, deltaBtd:1.2, stormHeight:7.5, rainRate:11.6},
  question:"Your rain-estimation system uses only the infrared channel brightness temperature. A study shows that adding information about how variable the brightness temperature is in the surrounding area (spatial texture) significantly improves convective rain classification. Why would neighbourhood texture help when temperature alone does not?",
  choices:[
    {id:"a", text:"Texture processing removes sensor noise, making temperature readings more accurate.", correct:false, risk:"NOISE ONLY WRONG", color:"var(--txt3)", tag:"Texture Predictors"},
    {id:"b", text:"A convective storm has high spatial variability — a very cold core surrounded by rapidly warming cloud edges. This spatial pattern is a fingerprint of convection that a single pixel's temperature cannot capture. Texture measures this spatial contrast.", correct:true, risk:"TEXTURE ADDS INFORMATION", color:"var(--pur)", tag:"Texture Predictors"},
    {id:"c", text:"Texture only helps for hail detection — it has no benefit for classifying convective versus gentle widespread rain.", correct:false, risk:"HAIL ONLY WRONG", color:"var(--gold)", tag:"Texture Predictors"},
    {id:"d", text:"Texture algorithms are simply faster to compute — the improvement is purely computational.", correct:false, risk:"SPEED ONLY WRONG", color:"var(--txt2)", tag:"Texture Predictors"},
  ],
  correctAnswer:"b",
  explanation:"A single pixel's temperature tells you how cold the cloud top is at one point. But a convective system has a characteristic spatial pattern: a very cold core transitioning quickly to warm cloud edges — high spatial variability. Gentle widespread rain is spatially smooth with gradual temperature changes. Texture metrics (variance, contrast) quantify this spatial variability. Including them gives the system the ability to recognise the organisational fingerprint of convection that single pixels miss.",
  hint:"One cold pixel could be anything. A very cold centre surrounded by warm edges is a specific spatial pattern — the convective fingerprint. Texture measures this pattern."
},

{
  id:"i08", day:"12 Aug — 08:00 IST",
  title:"Two Rainfall Peaks — Why Gentle Rain Has Two Daily Maxima",
  region:"Mountain Monsoon Region",
  mapType:"conv_vs_strat",
  data:{tb11:232, btd1:-12, deltaBtd:2.0, stormHeight:8.9, convFrac:0.22, stratFrac:0.78, rainRate:11.4},
  question:"Satellite data analysis shows convective (intense) rain always peaks in the afternoon. But gentle widespread rain shows TWO peaks in a day — one in the morning and one in the late afternoon. A junior forecaster asks why gentle rain has two peaks. What do you explain?",
  choices:[
    {id:"a", text:"Gentle widespread rain follows the same single afternoon peak as convective rain. The two-peak pattern is a data processing error.", correct:false, risk:"DATA ERROR WRONG", color:"var(--txt3)", tag:"Stratiform Diurnal"},
    {id:"b", text:"Afternoon deep convective systems generate large cloud anvils that produce gentle rain hours later, creating an afternoon–evening gentle rain peak. Separate large-scale overnight forcing from synoptic weather systems creates a morning gentle rain peak. Two different mechanisms produce two peaks.", correct:true, risk:"BIMODAL STRATIFORM", color:"var(--ac)", tag:"Stratiform Diurnal"},
    {id:"c", text:"Gentle rain has two peaks because the sun heats clouds twice during the day — at sunrise and again at noon.", correct:false, risk:"SOLAR TWICE WRONG", color:"var(--gold)", tag:"Stratiform Diurnal"},
    {id:"d", text:"Gentle widespread rain is controlled by tidal cycles, producing twice-daily pulses.", correct:false, risk:"TIDAL WRONG", color:"var(--txt2)", tag:"Stratiform Diurnal"},
  ],
  correctAnswer:"b",
  explanation:"Two processes operate at different times. Afternoon deep convective storms generate large cloud anvil regions that persist and produce gentle rain through the evening and night — one peak. Large-scale weather systems and overnight low-level jets generate a separate morning gentle rain maximum. These are independent physical processes acting at different times, creating the two-peak signature. Forecasters need to issue advisories for both windows.",
  hint:"Afternoon convective anvils rain into the evening — one gentle rain peak. Overnight large-scale systems create a separate morning gentle rain peak. Two mechanisms = two peaks."
},

{
  id:"i09", day:"19 Sep — 15:00 IST",
  title:"Shallow Clouds Build Liquid Water Faster Near the Surface",
  region:"Western Ghats (15–18N, 73.5–75.5E)",
  mapType:"orographic",
  data:{tb11:255, btd1:-11, deltaBtd:-0.3, stormHeight:3.4, rainRate:6.2},
  question:"A hydrologist asks: do shallow clouds (tops below 4.5 km) or medium-depth clouds (tops 4.5–8 km) build up liquid water content faster near the surface? Her answer will determine which cloud type triggers the landslide warning system.",
  choices:[
    {id:"a", text:"Medium clouds build faster near-surface liquid water because they are taller and contain more total water.", correct:false, risk:"TOTAL WATER WRONG", color:"var(--txt3)", tag:"PLW Profile"},
    {id:"b", text:"Shallow clouds actually show a FASTER rate of liquid water increase near the surface. The warm-rain process is highly efficient in the lowest layers of shallow clouds.", correct:true, risk:"SHALLOW FASTER", color:"var(--grn)", tag:"PLW Profile"},
    {id:"c", text:"Both cloud types have identical liquid water increase rates below 3 km. Cloud depth makes no difference.", correct:false, risk:"IDENTICAL WRONG", color:"var(--gold)", tag:"PLW Profile"},
    {id:"d", text:"Liquid water decreases toward the surface in all clouds due to evaporation. Neither type accumulates liquid water near the ground.", correct:false, risk:"WRONG DIRECTION", color:"var(--red)", tag:"PLW Profile"},
  ],
  correctAnswer:"b",
  explanation:"Satellite radar data analysis shows shallow clouds have a faster rate of liquid water increase near the surface (approximately 0.16 g/m³ per km descent) compared to medium clouds (approximately 0.05–0.08 g/m³). The collision-coalescence warm-rain process is most efficient in the lower cloud layers of shallow clouds — rapidly converting small cloud droplets into large precipitation-sized drops very close to the surface. For landslide warnings, shallow cloud events deserve as much attention as deeper cloud events.",
  hint:"Shallow clouds convert cloud water to rain very efficiently near the surface. The rate of liquid water buildup near the ground is actually faster for shallow than deep clouds — counter-intuitive but data-confirmed."
},

{
  id:"i10", day:"5 Jul — 12:00 IST",
  title:"Choosing a Balanced Detection Threshold",
  region:"Tropical Ocean (Satellite Coverage)",
  mapType:"btd_challenge",
  data:{tb11:235, btd1:-8, deltaBtd:0.2, stormHeight:6.0, rainRate:9.8},
  question:"You are calibrating a rain detection temperature threshold. Setting it very cold (e.g., below 220 K) misses lots of real rain but has few false alarms. Setting it very warm (e.g., below 270 K) catches most rain but also flags many clear-sky pixels. Which statistical approach finds the best BALANCED threshold?",
  choices:[
    {id:"a", text:"Use only the detection rate (fraction of real rain caught) — maximise it regardless of false alarms.", correct:false, risk:"DETECTION ONLY WRONG", color:"var(--txt3)", tag:"Threshold Optimisation"},
    {id:"b", text:"Use a balanced skill score that simultaneously rewards correct detections of BOTH rainy AND dry cases, penalising both missed rain and false alarms equally. This finds the optimal balanced threshold.", correct:true, risk:"BALANCED THRESHOLD", color:"var(--ac)", tag:"Threshold Optimisation"},
    {id:"c", text:"Use only the false alarm rate — minimise false alarms regardless of how many real rain events are missed.", correct:false, risk:"FAR ONLY WRONG", color:"var(--gold)", tag:"Threshold Optimisation"},
    {id:"d", text:"Use simple accuracy (fraction of all pixels correctly labelled) — this is always the fairest measure.", correct:false, risk:"ACCURACY MISLEADING", color:"var(--txt2)", tag:"Threshold Optimisation"},
  ],
  correctAnswer:"b",
  explanation:"A balanced skill score such as the Heidke Skill Score (HSS) measures improvement over a random forecast by accounting for all four outcomes: correctly detected rain, correctly detected dry sky, missed rain, and false alarms. Unlike simple accuracy (dominated by the abundant dry pixels), a balanced score penalises errors in both directions. Maximising detection rate alone leads to flagging everything as rain. Minimising false alarms leads to flagging almost nothing. The balanced approach finds the sweet spot.",
  hint:"A balanced skill score rewards getting both rain AND no-rain correct. It cannot be fooled by setting everything to one label. It is the fair, balanced measure."
},

{
  id:"i11", day:"22 Jul — 09:00 IST",
  title:"Training AI on Rare Storm Events — Class Imbalance",
  region:"Satellite Operations Centre",
  mapType:"convective_burst",
  data:{tb11:221, btd1:-22, deltaBtd:2.8, stormHeight:12.0, rainRate:38.0},
  question:"A data science team training an AI to detect convective storms complains the AI keeps predicting 'no storm' everywhere because clear-sky pixels outnumber storm pixels by 50 to 1 in the training data. What should they do to fix this?",
  choices:[
    {id:"a", text:"Collect more satellite data until storm pixels equal clear-sky pixels — only then can the AI be trained.", correct:false, risk:"IMPRACTICAL", color:"var(--txt3)", tag:"Class Imbalance"},
    {id:"b", text:"Use a loss function that reduces the influence of easy-to-classify clear-sky pixels so the AI focuses its learning effort on the rare but important storm pixels.", correct:true, risk:"FOCAL LOSS SOLUTION", color:"var(--ac)", tag:"Class Imbalance"},
    {id:"c", text:"Remove all clear-sky data from training. Only train on storm cases.", correct:false, risk:"BIAS NEW PROBLEM", color:"var(--gold)", tag:"Class Imbalance"},
    {id:"d", text:"The 50:1 imbalance is not a problem — AI systems are immune to class imbalance by design.", correct:false, risk:"WRONG ASSUMPTION", color:"var(--txt2)", tag:"Class Imbalance"},
  ],
  correctAnswer:"b",
  explanation:"When training data is heavily imbalanced (50 clear-sky pixels for every 1 storm pixel), a naive AI learns to predict 'no storm' everywhere and achieves 98% accuracy without ever detecting a storm. A focal loss function solves this by reducing the gradient contribution of easy, correctly-classified clear-sky pixels, forcing the AI to spend its learning capacity on the hard, rare storm cases. This technique is specifically designed for situations where the target class (storms) is rare in the overall dataset.",
  hint:"If clear sky is 50 times more common, AI takes the easy route and ignores storms. A special loss function tells the AI to pay less attention to easy clear-sky examples and more attention to rare but important storm cases."
},

{
  id:"i12", day:"1 Aug — 16:00 IST",
  title:"Two Cloud Populations on One Radar Chart",
  region:"Western Ghats vs. Northeast India",
  mapType:"orographic",
  data:{tb11:265, btd1:-9, deltaBtd:-0.5, stormHeight:2.8, rainRate:4.4},
  question:"Radar statistics show the Western Ghats have a bimodal cloud echo-top distribution with peaks at both 3 km AND 6 km. Northeast India (Meghalaya region) has only a single peak near 6–7 km. What does the Western Ghats double-peak distribution tell you about its cloud population?",
  choices:[
    {id:"a", text:"The Western Ghats radar is malfunctioning — a real atmosphere cannot have two separate cloud populations simultaneously.", correct:false, risk:"RADAR ERROR WRONG", color:"var(--txt3)", tag:"ETH Distribution"},
    {id:"b", text:"The Ghats have TWO distinct cloud populations simultaneously: shallow warm-rain clouds topping near 3 km AND deeper clouds near 6 km. This coexistence of two types is unique to regions with slow sustained orographic uplift.", correct:true, risk:"DUAL CLOUD POPULATION", color:"var(--grn)", tag:"ETH Distribution"},
    {id:"c", text:"The 3 km peak is daytime cloud and the 6 km peak is nighttime cloud — two peaks represent a diurnal cycle, not two cloud types.", correct:false, risk:"DIURNAL CONFUSION WRONG", color:"var(--gold)", tag:"ETH Distribution"},
    {id:"d", text:"The surface elevation of the Ghats is 3 km, making the cloud top appear at 3 km relative to ground level while the sea-level equivalent is 6 km.", correct:false, risk:"ALTITUDE CONFUSION WRONG", color:"var(--txt2)", tag:"ETH Distribution"},
  ],
  correctAnswer:"b",
  explanation:"The bimodal distribution over the Western Ghats is a direct signature of two coexisting cloud populations: (1) shallow warm-rain clouds with tops near 3 km — unique to the Ghats' slow gentle uplift; (2) deeper mixed-phase clouds near 6 km. This coexistence is a characteristic fingerprint of the Western Ghats. Meghalaya's steep terrain forces rapid deep uplift that only produces the deeper cloud type, explaining the single-peak distribution there.",
  hint:"Two peaks in the echo-top chart = two different types of clouds happening at the same time. Western Ghats uniquely supports both shallow warm-rain and deeper clouds simultaneously."
},

{
  id:"i13", day:"15 Sep — 10:00 IST",
  title:"Which Channel Combination Improves Rain Detection Most?",
  region:"India / Indian Ocean Satellite",
  mapType:"geo_diag",
  data:{tb11:242, btd1:-15, deltaBtd:1.1, stormHeight:7.8, rainRate:10.6},
  question:"A satellite meteorology team designing a new rain classification algorithm must choose which channels to combine. Based on research with multi-spectral satellite data, which channel pairing gives the biggest improvement over using only the thermal infrared window channel?",
  choices:[
    {id:"a", text:"Add the visible channel (0.6 μm) — visible brightness is the most important additional predictor for round-the-clock rain detection.", correct:false, risk:"VISIBLE WRONG", color:"var(--txt3)", tag:"Channel Combination"},
    {id:"b", text:"Combine the water vapour channel (around 6.2–6.7 μm) with the thermal infrared window channel (around 11 μm) — this pairing is specifically identified as the most beneficial combination for precipitation classification, day and night.", correct:true, risk:"WV + IR BEST", color:"var(--ac)", tag:"Channel Combination"},
    {id:"c", text:"Use only the 12 μm channel — the split-window technique with 12 μm is more accurate than any water vapour combination.", correct:false, risk:"12 μm ONLY WRONG", color:"var(--gold)", tag:"Channel Combination"},
    {id:"d", text:"All available channels must be used simultaneously — fewer channels always means worse performance.", correct:false, risk:"ALL CHANNELS WRONG", color:"var(--txt2)", tag:"Channel Combination"},
  ],
  correctAnswer:"b",
  explanation:"Research using multi-spectral geostationary satellite data with machine learning analysis shows that combining the water vapour channel with the thermal infrared window channel is specifically recommended for improved precipitation classification. The thermal channel sees the cloud-top temperature; the water vapour channel sees upper-tropospheric moisture. Their combination distinguishes deep convective cloud tops (where both channels see similar temperatures — cloud overshoot) from thin cirrus (where temperatures differ greatly — moisture above but thin cloud). This combination works day and night.",
  hint:"Water vapour channel + thermal infrared window = the most informative pairing. One sees the cloud top; the other sees moisture above and around the cloud. Together they reveal cloud structure."
},

{
  id:"i14", day:"28 Jul — 13:00 IST",
  title:"Storm Tops 2–3 km Higher in Convective Than Gentle Rain",
  region:"Mountain Catchment",
  mapType:"conv_vs_strat",
  data:{tb11:229, btd1:-13, deltaBtd:1.8, stormHeight:8.2, convFrac:0.22, stratFrac:0.78, rainRate:12.1},
  question:"You are advising a hydroelectric project. Satellite radar shows two types of precipitation: intense (20%) averaging 12 km storm tops, and gentle widespread (80%) averaging 9 km storm tops. What does the 3 km difference in storm top height tell you about the two types and their different risks to your dam?",
  choices:[
    {id:"a", text:"Gentle rain (9 km tops) is more dangerous because it covers more area. The 3 km height difference is irrelevant to rainfall.", correct:false, risk:"AREA CONFUSION WRONG", color:"var(--txt3)", tag:"Storm Height Meaning"},
    {id:"b", text:"The 12 km intense storm tops indicate much stronger updrafts — reaching higher means far stronger vertical motion. These produce locally intense rain (2–8 mm/hr) creating flash flood risk. The gentle widespread rain (9 km tops, weaker updrafts) slowly fills the reservoir — different risk types needing different responses.", correct:true, risk:"DUAL RISK PLAN", color:"var(--org)", tag:"Storm Height Meaning"},
    {id:"c", text:"The height difference means gentle rain reaches the ground first because it starts from lower altitude.", correct:false, risk:"ARRIVAL TIME WRONG", color:"var(--gold)", tag:"Storm Height Meaning"},
    {id:"d", text:"Storm top height has no relationship to updraft strength or rain intensity.", correct:false, risk:"NO RELATIONSHIP WRONG", color:"var(--txt2)", tag:"Storm Height Meaning"},
  ],
  correctAnswer:"b",
  explanation:"The 2–3 km difference in storm top height directly reflects updraft vigour. Reaching 12 km requires vigorous vertical motion strong enough to push heavy ice particles to near-tropopause levels. Gentle widespread rain clouds form through slower large-scale ascent reaching only 9–10 km. Higher tops = stronger updrafts = more intense localised rain rates. For the dam: intense cells cause rapid localised river spikes (flash floods), while gentle widespread rain gradually fills the reservoir — requiring different response plans for each.",
  hint:"Higher storm top = stronger updraft = more intense local rain. Lower top = gentler uplift = moderate widespread rain. Two completely different hydrological risks for the project."
},

{
  id:"i15", day:"4 Aug — 17:00 IST",
  title:"Small Cells Have Highest Fraction of Intense Rain",
  region:"Indian Summer Monsoon",
  mapType:"gpm_radar",
  data:{tb11:226, btd1:-18, deltaBtd:1.6, stormHeight:9.8, rainRate:21.0},
  question:"You compare large monsoon cloud systems (area over 1000 km²) with small isolated convective cells (area under 100 km²). The SMALL cells have a higher FRACTION of their area showing very high radar reflectivity (intense rain cores). A hydrologist finds this surprising. How do you explain it?",
  choices:[
    {id:"a", text:"Small cells appear more intense only because radar resolution is coarser — it is a measurement artefact.", correct:false, risk:"RESOLUTION ARTEFACT WRONG", color:"var(--txt3)", tag:"System Size vs Intensity"},
    {id:"b", text:"A small isolated cell is almost entirely intense core — all its area is active. A large storm system has a small intense core embedded in a vast moderate-intensity cloud anvil. So the FRACTION of intense area is higher in small systems even though the large system may have more intense area in absolute terms.", correct:true, risk:"SMALL CELLS INTENSE", color:"var(--ac)", tag:"System Size vs Intensity"},
    {id:"c", text:"Large systems are always more intense than small systems. This result must be a data error.", correct:false, risk:"LARGE ALWAYS INTENSE WRONG", color:"var(--red)", tag:"System Size vs Intensity"},
    {id:"d", text:"Small systems are isolated from ocean moisture so they concentrate all available water into a small intense core.", correct:false, risk:"MOISTURE WRONG", color:"var(--gold)", tag:"System Size vs Intensity"},
  ],
  correctAnswer:"b",
  explanation:"A small isolated convective cell is essentially all intense core — most of its area is actively precipitating. A large mesoscale storm system has a concentrated intense core (50–100 km²) embedded in a vast cloud anvil (500–2000 km²). The fraction of the total system area showing intense reflectivity is therefore much lower for the large system, even though it has more total intense area in absolute terms. This inverse relationship between system size and fractional intense precipitation area is confirmed in satellite radar data over Indian monsoon regions.",
  hint:"A small cell is mostly intense core. A giant storm is mostly gentle anvil with a small intense core. The FRACTION (not total) of intense area goes down as the system grows larger."
},

{
  id:"i16", day:"10 Sep — 08:00 IST",
  title:"AND vs OR Logic — Which Detection Configuration Is Correct?",
  region:"India (Satellite-Based Detection)",
  mapType:"kalpana",
  data:{tb11:247, btd1:-17, deltaBtd:0.8, stormHeight:6.0, rainRate:8.8},
  question:"Two rain detection configurations: Configuration A flags rain if cloud temperature is below 260 K OR the channel difference exceeds 19 K. Configuration B flags rain if cloud temperature is below 260 K AND the channel difference exceeds 19 K. Configuration A flags 30% of pixels as rain; Configuration B flags 18%. Which gives more accurate rain area and why?",
  choices:[
    {id:"a", text:"Configuration A (OR, 30%) is better because it catches more rain events. Missing rain is always worse than a false alarm.", correct:false, risk:"OR ALWAYS BETTER WRONG", color:"var(--txt3)", tag:"Logic Gates"},
    {id:"b", text:"Configuration B (AND, 18%) is stricter and likely gives more accurate rain area. OR logic introduces false alarms from thin cirrus that satisfies one condition alone but produces no rain.", correct:true, risk:"AND MORE ACCURATE", color:"var(--ac)", tag:"Logic Gates"},
    {id:"c", text:"Both configurations give identical results — AND and OR logic produce the same output for satellite rain detection.", correct:false, risk:"IDENTICAL WRONG", color:"var(--gold)", tag:"Logic Gates"},
    {id:"d", text:"Neither is valid without adding a third condition. Two conditions are always insufficient.", correct:false, risk:"THREE CONDITIONS WRONG", color:"var(--txt2)", tag:"Logic Gates"},
  ],
  correctAnswer:"b",
  explanation:"OR logic flags a pixel as rain if EITHER condition is met — giving a larger detection area but with more false alarms. Many thin cirrus clouds satisfy the temperature condition alone (cold but no rain) without the channel-difference condition. AND logic requires BOTH conditions to be met simultaneously, eliminating pixels where only one signal says rain. Research optimising multi-signal rain detection over India found the AND combination gives the best balance of detection and false alarm suppression, outperforming both single conditions and OR combinations.",
  hint:"OR = more detections + more false alarms from cirrus. AND = fewer detections + fewer false alarms. Which gives more accurate rain area depends on what the extra OR detections actually are — mostly thin cirrus false alarms."
},

{
  id:"i17", day:"22 Aug — 11:00 IST",
  title:"Bay of Bengal Storms Look Similar to Indian Ocean Storms",
  region:"Bay of Bengal + Indian Ocean",
  mapType:"gpm_radar",
  data:{tb11:230, btd1:-19, deltaBtd:1.4, stormHeight:8.8, rainRate:16.5},
  question:"Ten years of satellite radar data shows that intense convective storm profiles over the Bay of Bengal, the Indian Ocean, and the Pacific Ocean are remarkably similar in the lower and middle troposphere — less than 2 radar units difference. What does this tell a regional forecaster about applying Bay of Bengal knowledge to other ocean basins?",
  choices:[
    {id:"a", text:"The similarity is a measurement error — each ocean has fundamentally unique storm dynamics.", correct:false, risk:"MEASUREMENT ERROR WRONG", color:"var(--txt3)", tag:"Ocean Storm Similarity"},
    {id:"b", text:"The similarity confirms that vigorous oceanic deep convection follows the same fundamental physics across all warm tropical oceans. Forecasting insights and classification thresholds developed in one ocean basin can be reliably applied to others.", correct:true, risk:"TRANSFERABLE KNOWLEDGE", color:"var(--grn)", tag:"Ocean Storm Similarity"},
    {id:"c", text:"Oceanic storms are always weaker than land storms at all altitudes — the similarity only applies to very weak storms.", correct:false, risk:"WEAK ONLY WRONG", color:"var(--gold)", tag:"Ocean Storm Similarity"},
    {id:"d", text:"The similarity means no regional calibration is ever needed for any location over any ocean.", correct:false, risk:"NO CALIBRATION OVERSTATED", color:"var(--txt2)", tag:"Ocean Storm Similarity"},
  ],
  correctAnswer:"b",
  explanation:"Ten years of satellite radar data show that the most intense convective storm vertical profiles from pure oceanic locations differ by less than 2 radar reflectivity units globally. This consistency confirms that the fundamental physics of tropical oceanic deep convection operates similarly regardless of ocean basin — governed by warm sea surface temperatures, moisture, and atmospheric instability. For forecasters, this means classification rules and storm-type thresholds developed in one ocean can be applied with confidence to another.",
  hint:"If oceanic storms look almost identical across all oceans, the underlying physics must be the same everywhere. Knowledge learned in the Bay of Bengal applies to the Indian Ocean and Pacific."
},

{
  id:"i18", day:"30 Jul — 14:00 IST",
  title:"Better Labels Lead to Better AI — What Reference Data to Use?",
  region:"Satellite Operations Centre",
  mapType:"convective_burst",
  data:{tb11:217, btd1:-25, deltaBtd:3.3, stormHeight:13.2, rainRate:44.0},
  question:"You are building a labelled dataset for training an AI storm detection system. A colleague argues you should label convective storms by looking at only the thermal infrared satellite image. You propose also displaying the radar image and the visible satellite channel side by side. Why is your approach better?",
  choices:[
    {id:"a", text:"The visible channel and radar data slow down labelling unnecessarily. Thermal infrared alone is always sufficient for accurate convection labels.", correct:false, risk:"IR ALONE WRONG", color:"var(--txt3)", tag:"Label Quality"},
    {id:"b", text:"Thermal infrared shows cloud top temperature but can confuse cold non-convective cloud tops with real convection. Radar confirms whether precipitation is actually occurring. Visible shows cloud physical structure. Combining all three gives labellers the most complete picture and minimises labelling errors.", correct:true, risk:"MULTI-SOURCE LABELLING", color:"var(--ac)", tag:"Label Quality"},
    {id:"c", text:"Only radar data should be used for labels — any satellite data introduces instrument-specific biases.", correct:false, risk:"RADAR ONLY WRONG", color:"var(--gold)", tag:"Label Quality"},
    {id:"d", text:"The labelling data source does not matter — AI systems correct for labelling errors automatically during training.", correct:false, risk:"AI CORRECTS AUTOMATICALLY WRONG", color:"var(--txt2)", tag:"Label Quality"},
  ],
  correctAnswer:"b",
  explanation:"Creating high-quality labels requires the most complete information. Thermal infrared images show cloud top temperatures but can be fooled by cold non-precipitating cirrus or thin anvil clouds. Radar provides the ground truth of actual precipitation location and intensity. Visible imagery shows cloud physical structure. When human labellers see all three simultaneously, they make much more accurate judgements about whether a cold cluster in the thermal image is actually convective. Poor labels train poor AI — label quality is the foundation of any successful machine learning system.",
  hint:"More information sources = better human judgement = better labels = better AI. Thermal alone can be fooled; radar + visible together remove that ambiguity."
},

{
  id:"i19", day:"16 Jun — 10:00 IST",
  title:"Monsoon Onset — Multiple Criteria Must All Be Met",
  region:"Kerala (8–12N, 75–77E)",
  mapType:"active_monsoon",
  data:{tb11:220, btd1:-22, deltaBtd:2.5, stormHeight:11.8, rainRate:33.4},
  question:"It is early June. Heavy rain has been reported at several Kerala stations for 2 days. Satellite shows organised cold cloud bands. However, wind measurements show the low-level jet has not yet reached the required speed threshold and the outgoing longwave radiation criterion has not been met. Should you declare official monsoon onset?",
  choices:[
    {id:"a", text:"Yes — two days of heavy rain at stations is sufficient proof of monsoon onset. Declare immediately.", correct:false, risk:"PREMATURE DECLARATION", color:"var(--txt3)", tag:"Onset Criteria"},
    {id:"b", text:"No — monsoon onset requires multiple criteria to be simultaneously met: organised deep cloud bands, wind reversal to westerlies at sufficient depth, outgoing radiation below threshold, AND sustained rainfall at a majority of stations. With the wind and radiation criteria not met, onset cannot be declared.", correct:true, risk:"HOLD FOR ALL CRITERIA", color:"var(--gold)", tag:"Onset Criteria"},
    {id:"c", text:"Declare onset based on the satellite evidence alone. Other criteria are outdated and less reliable than satellite data.", correct:false, risk:"SATELLITE ONLY WRONG", color:"var(--txt2)", tag:"Onset Criteria"},
    {id:"d", text:"Wait 7 more days regardless of current evidence — onset can never be declared before June 7.", correct:false, risk:"ARBITRARY WAIT WRONG", color:"var(--red)", tag:"Onset Criteria"},
  ],
  correctAnswer:"b",
  explanation:"Official monsoon onset declaration requires multiple criteria to be satisfied simultaneously: organised deep cloud bands visible in satellite, wind reversal to westerlies at sufficient atmospheric depth, outgoing radiation dropping below threshold, AND sustained rainfall at majority of designated stations. This multi-criteria approach was specifically adopted after cases of false declaration based on individual signals. Heavy rain alone without the wind and radiation criteria may be a pre-monsoon event, not the true onset.",
  hint:"Monsoon onset needs multiple signals to agree simultaneously. One or two criteria met is not enough. All key criteria must be satisfied at the same time."
},

{
  id:"i20", day:"20 Aug — 16:00 IST",
  title:"Reading the Daily Storm Depth Chart — Mountain Warnings",
  region:"Western Ghats Mountain Top",
  mapType:"convective_burst",
  data:{tb11:215, btd1:-23, deltaBtd:2.9, stormHeight:12.0, rainRate:35.0},
  question:"Radar data over the Western Ghats mountain top is used to create a two-dimensional chart: storm echo-top height on the vertical axis and time of day on the horizontal axis. The chart shows the highest echo-top values concentrated between 1400–1900 local time. What does this pattern tell you for operational warnings?",
  choices:[
    {id:"a", text:"This pattern is only relevant for cyclone conditions — it has no use for routine monsoon forecasting.", correct:false, risk:"CYCLONE ONLY WRONG", color:"var(--txt3)", tag:"ETH Diurnal Pattern"},
    {id:"b", text:"The deepest storms consistently occur in the afternoon–evening window on the mountain top. This is when the highest rain rates, strongest updrafts, and greatest lightning risk all peak. Warnings for mountaineers, tourists, and construction workers should be concentrated in this window.", correct:true, risk:"AFTERNOON DEEP STORM WINDOW", color:"var(--org)", tag:"ETH Diurnal Pattern"},
    {id:"c", text:"The afternoon concentration means storms are actually weakest then. Storms at other times are more dangerous.", correct:false, risk:"REVERSED INTERPRETATION WRONG", color:"var(--red)", tag:"ETH Diurnal Pattern"},
    {id:"d", text:"All hours have similar echo-top heights — the apparent concentration is a radar scanning angle effect.", correct:false, risk:"RADAR ARTEFACT WRONG", color:"var(--gold)", tag:"ETH Diurnal Pattern"},
  ],
  correctAnswer:"b",
  explanation:"The two-dimensional echo-top height versus time-of-day chart from radar over the Western Ghats mountain top clearly shows the deepest (most vigorous) storms concentrated in the 1400–1900 local time window. This directly translates to: maximum rain rates, maximum lightning risk, and maximum severe weather risk all peak in the afternoon on the mountain top. Seasonal forecasting guidance should specify this window explicitly for any outdoor high-altitude activities. Issuing warnings only for 'afternoon thunderstorms' without this specificity undersells the localised mountain risk.",
  hint:"Where the chart shows tallest storms by time of day = that is when warnings must be most urgent for mountain areas. The afternoon peak is sharp and predictable."
},

], // end intermediate

// ────────────────────────────────────────────────────────────
// ADVANCED — 20 Scenarios
// ────────────────────────────────────────────────────────────
advanced: [

{
  id:"a01", day:"7 Jul — 14:00 IST",
  title:"Applying the 5-Step Cloud Classification — Bay of Bengal",
  region:"Bay of Bengal (15–20N, 85–93E)",
  mapType:"btd_challenge",
  data:{tb11:222, btd1:-16, deltaBtd:2.2, stormHeight:9.8, rainRate:21.0},
  question:"Satellite data: brightness temperature (11 μm) = 222 K; channel difference BTD1 (6.2−11.2 μm) = −16 K (confirmed non-shallow); ΔBTD = +2.2 K (positive). Using the three-step classification: Step 1 — shallow or not? Step 2 — ΔBTD positive or negative? Step 3 — how cold is BTD1 within the group? Which class and what rain rate do you report?",
  choices:[
    {id:"a", text:"Non-shallow-tall-cold: ΔBTD positive, but BTD1 = −16 K places it in the 'cold' subclass making it the tall group. Expect 25–35 mm/hr.", correct:false, risk:"WRONG SUBCLASS", color:"var(--txt3)", tag:"5-Class BTD"},
    {id:"b", text:"Non-shallow-taller-cold: ΔBTD positive → ice-dominant → 'taller' group. BTD1 = −16 K is moderate coldness → 'cold' subclass within the taller group. Organised deep convection, approximately 20–25 mm/hr.", correct:true, risk:"TALLER-COLD CLASS", color:"var(--org)", tag:"5-Class BTD"},
    {id:"c", text:"Shallow: BTD1 = −16 K is negative and therefore classifies as shallow liquid-phase cloud.", correct:false, risk:"SHALLOW WRONG", color:"var(--grn)", tag:"5-Class BTD"},
    {id:"d", text:"Non-shallow-taller-colder: ΔBTD positive → taller group, and BTD1 = −16 K is the extreme coldest subclass.", correct:false, risk:"COLDER WRONG", color:"var(--gold)", tag:"5-Class BTD"},
  ],
  correctAnswer:"b",
  explanation:"The classification tree: (1) BTD1 = −16 K is modest — not the strongly negative values of shallow clouds — confirming non-shallow. (2) ΔBTD = +2.2 K is positive → ice-phase dominant → 'taller' group. (3) Within the 'taller' group, BTD1 = −16 K is moderate coldness → 'cold' subclass (the 'colder' subclass has more negative BTD1). Result: non-shallow-taller-cold. This class has organised deep ice-phase convection with storm tops typically at 9–11 km and near-surface rain rates around 20–25 mm/hr.",
  hint:"Step 1: non-shallow confirmed. Step 2: ΔBTD positive → taller (ice) group. Step 3: BTD1 = −16 K within that group → cold not colder. Three steps, three decisions."
},

{
  id:"a02", day:"21 Aug — 09:00 IST",
  title:"Apply the Dual Rain Detection Rule — Three Pixels",
  region:"India (INSAT Coverage)",
  mapType:"kalpana",
  data:{tb11:256, btd1:-19, deltaBtd:1.0, stormHeight:6.5, rainRate:9.2},
  question:"Three pixels over peninsular India. Rule: flag rain if cloud temperature (TIR) < 260 K AND (TIR minus water vapour temperature WV) > 19 K. Pixel X: TIR=256K, WV=232K. Pixel Y: TIR=231K, WV=228K. Pixel Z: TIR=259K, WV=219K. Which pixels are rain?",
  choices:[
    {id:"a", text:"Only Pixel X: TIR=256<260 ✓; TIR−WV=24>19 ✓. Both conditions met. Y fails: TIR−WV=3, not >19. Z: TIR=259<260 ✓; TIR−WV=40>19 ✓ — also rain.", correct:true, risk:"X AND Z = RAIN", color:"var(--ac)", tag:"MIRD Application"},
    {id:"b", text:"All three pixels: all have TIR below 260 K so all three are rain.", correct:false, risk:"SINGLE CONDITION ONLY", color:"var(--txt3)", tag:"MIRD Application"},
    {id:"c", text:"Only Pixel Y: TIR=231 is the coldest so it is definitely the most active rain pixel.", correct:false, risk:"COLDEST ONLY WRONG", color:"var(--gold)", tag:"MIRD Application"},
    {id:"d", text:"No pixels: none reach the 235 K strict threshold for any detection.", correct:false, risk:"WRONG THRESHOLD", color:"var(--red)", tag:"MIRD Application"},
  ],
  correctAnswer:"a",
  explanation:"Checking each pixel with both conditions: X: TIR=256<260 ✓; TIR−WV=256−232=24>19 ✓ → RAIN. Y: TIR=231<260 ✓; TIR−WV=231−228=3<19 ✗ → NOT RAIN. Y likely represents thin cirrus — very cold but water vapour channel is nearly equal to TIR, meaning no deep convective overshoot. Z: TIR=259<260 ✓; TIR−WV=259−219=40>19 ✓ → RAIN. The key lesson: Pixel Y fails despite being the coldest — it passes only one of the two required conditions. AND logic prevents this cirrus false alarm.",
  hint:"Check BOTH conditions for every pixel. TIR<260 alone is not enough. Calculate TIR−WV for each and compare to 19. Pixel Y is the surprise — very cold but fails the second condition, revealing it as cirrus."
},

{
  id:"a03", day:"9 Sep — 15:00 IST",
  title:"Active vs Break Monsoon from Radar Profile Alone",
  region:"Core Monsoon Zone India (20–26N, 75–85E)",
  mapType:"active_monsoon",
  data:{tb11:226, btd1:-16, deltaBtd:1.2, stormHeight:9.2, rainRate:16.8},
  question:"You have 3D satellite radar profiles for two periods. Period 1 shows radar reflectivity broadly distributed at high altitudes (8–12 km). Period 2 shows reflectivity concentrated near the surface (2–5 km) with little signal above 8 km. Without checking any surface station data, which period is the active monsoon spell?",
  choices:[
    {id:"a", text:"Period 1 (reflectivity high up) is the active spell — broad high-altitude signal indicates tall deep organised systems with strong updrafts.", correct:true, risk:"ACTIVE = HIGH SIGNAL ALOFT", color:"var(--org)", tag:"Ze Active/Break"},
    {id:"b", text:"Period 2 (reflectivity near surface) is the active spell — more rain is reaching the ground.", correct:false, risk:"SURFACE Ze WRONG", color:"var(--txt3)", tag:"Ze Active/Break"},
    {id:"c", text:"Both periods are equally likely to be active spells — radar profile altitude has no relationship to monsoon phase.", correct:false, risk:"NO RELATIONSHIP WRONG", color:"var(--gold)", tag:"Ze Active/Break"},
    {id:"d", text:"Period 2 is the active spell because shallow rain dominates the active monsoon season.", correct:false, risk:"SHALLOW ACTIVE WRONG", color:"var(--txt2)", tag:"Ze Active/Break"},
  ],
  correctAnswer:"a",
  explanation:"Fifteen years of satellite radar data analysis shows a clear difference in vertical reflectivity structure between active and break monsoon spells. Active spells: broader reflectivity distributions at HIGHER altitudes — taller storms, stronger updrafts lofting particles high, larger average storm heights. Break spells: reflectivity concentrated at lower altitudes — shallow rainfall, weak updrafts, smaller storm depths. The vertical radar profile alone is a reliable satellite-based discriminant of monsoon phase.",
  hint:"Active monsoon = tall deep organised systems = radar signal found at high altitudes. Break monsoon = shallow weak systems = signal concentrated near the surface."
},

{
  id:"a04", day:"18 Aug — 08:00 IST",
  title:"Why Learnable Upsampling Sharpens Storm Boundaries",
  region:"Satellite AI Operations",
  mapType:"convective_burst",
  data:{tb11:218, btd1:-24, deltaBtd:3.1, stormHeight:12.5, rainRate:41.0},
  question:"An AI storm detection system uses fixed mathematical upsampling in its decoder. Predicted storm boundaries are blurry — the convective region bleeds into surrounding cloud by 20–30 km. A colleague proposes replacing this with a learnable data-dependent upsampling method. Why would this specifically improve boundary accuracy?",
  choices:[
    {id:"a", text:"Learnable upsampling increases output image resolution, which always improves boundary sharpness regardless of the method.", correct:false, risk:"RESOLUTION ONLY WRONG", color:"var(--txt3)", tag:"Upsampling"},
    {id:"b", text:"Fixed mathematical weights treat all spatial locations identically during upsampling, smoothing storm edges. Learnable weights adapt during training — they learn to preserve the sharp temperature gradients at real cloud boundaries rather than blurring them.", correct:true, risk:"SHARP BOUNDARY ACHIEVED", color:"var(--ac)", tag:"Upsampling"},
    {id:"c", text:"Learnable upsampling uses three-dimensional convolutions instead of two-dimensional, capturing vertical storm structure better.", correct:false, risk:"3D CONVOLUTION WRONG", color:"var(--gold)", tag:"Upsampling"},
    {id:"d", text:"Any upsampling method gives identical boundary accuracy — the blurriness comes from the encoder, not the decoder.", correct:false, risk:"ENCODER ONLY WRONG", color:"var(--txt2)", tag:"Upsampling"},
  ],
  correctAnswer:"b",
  explanation:"Fixed mathematical upsampling applies predetermined weights that produce smooth interpolation — inherently blurring sharp edges. Convective cloud boundaries are characterised by sharp temperature gradients (very cold core transitioning quickly to warm environment). A learnable upsampling operation trains its weights from data, learning to preserve exactly these sharp gradient transitions that represent physical storm edges. The AI essentially learns that sharp gradients at certain spatial locations mean storm boundaries and should not be blurred.",
  hint:"Fixed method = always smooths everything. Learnable = adapts to preserve sharp edges where training data shows they're important. Storm boundaries are sharp edges — learnable upsampling respects that."
},

{
  id:"a05", day:"1 Jul — 16:00 IST",
  title:"Bright Band Profile — Identifying Stratiform Rain Type",
  region:"Bay of Bengal / Indian Ocean",
  mapType:"gpm_radar",
  data:{tb11:243, btd1:-14, deltaBtd:0.5, stormHeight:6.2, rainRate:7.8},
  question:"Satellite radar shows a cloud system with enhanced radar signal at 5 km altitude, with liquid water content also peaking at this level. Above 5 km, signal drops sharply. Below 5 km, signal decreases gradually toward the surface. How do you characterise this system and what surface rain rate do you expect?",
  choices:[
    {id:"a", text:"The peak at 5 km is the top of an intense convective cell updraft core. Issue a severe storm warning.", correct:false, risk:"CONVECTIVE WRONG", color:"var(--red)", tag:"Bright Band System"},
    {id:"b", text:"This is a widespread gentle rain cloud system with a melting layer at 5 km — where snowflakes aggregate and partially melt into large wet particles (causing the radar peak). Expect steady moderate rain, 5–10 mm/hr at the surface.", correct:true, risk:"STRATIFORM MODERATE RAIN", color:"var(--gold)", tag:"Bright Band System"},
    {id:"c", text:"The 5 km peak indicates the storm is topping out at 5 km — a very shallow system producing no rain below.", correct:false, risk:"SHALLOW TOP WRONG", color:"var(--txt3)", tag:"Bright Band System"},
    {id:"d", text:"Enhanced signal at 5 km with liquid water peak there = active hail production zone. Issue a hail warning.", correct:false, risk:"HAIL WRONG", color:"var(--org)", tag:"Bright Band System"},
  ],
  correctAnswer:"b",
  explanation:"The combination of: radar signal peak at ~5 km, liquid water peak at the same level, sharp signal decrease above, gradual decrease below is the classic melting layer (bright band) signature of widespread organised gentle rain. The 5 km level corresponds to the 0°C isotherm in the tropics. Snowflakes falling from above melt here, temporarily becoming large water-coated particles with much higher radar return. Below this layer, particles fall as normal liquid rain. This system produces steady widespread moderate rainfall, not a severe weather threat.",
  hint:"Radar peak at the melting level + liquid water peak at same altitude + sharp decrease above = melting layer = widespread organised gentle rain. Not convective, not severe."
},

{
  id:"a06", day:"25 Jul — 12:00 IST",
  title:"Counter-Intuitive: More Rain in Meghalaya But Fewer Shallow Clouds",
  region:"Western Ghats vs. Khasi Hills Operational Comparison",
  mapType:"orographic",
  data:{tb11:260, btd1:-9, deltaBtd:-0.5, stormHeight:3.1, rainRate:5.4},
  question:"A district forecaster in Meghalaya asks why her region — receiving 11,000 mm/year — sees so few shallow warm-rain clouds compared to the Western Ghats which receive only 3,000 mm/year. She argues more rainfall should produce more cloud types. What is the correct explanation?",
  choices:[
    {id:"a", text:"The Western Ghats are closer to the sea, reducing moisture available for deep convection and forcing more shallow cloud formation.", correct:false, risk:"PROXIMITY WRONG", color:"var(--txt3)", tag:"Regional Cloud Types"},
    {id:"b", text:"The Khasi Hills create rapid, forced uplift generating deep convective towers. The Ghats create slow sustained gentle uplift giving droplets time to grow by collision-merging without ice — the unique shallow warm-rain population. Different orographic geometries produce different cloud types regardless of total rainfall.", correct:true, risk:"MECHANISM CORRECT", color:"var(--ac)", tag:"Regional Cloud Types"},
    {id:"c", text:"Meghalaya is too cold for shallow warm-rain clouds — the temperature profile there is fundamentally different.", correct:false, risk:"TEMPERATURE WRONG", color:"var(--gold)", tag:"Regional Cloud Types"},
    {id:"d", text:"The Ghats receive more solar radiation due to their western facing position, driving more shallow cloud formation.", correct:false, risk:"SOLAR RADIATION WRONG", color:"var(--txt2)", tag:"Regional Cloud Types"},
  ],
  correctAnswer:"b",
  explanation:"The critical factor is the speed and nature of orographic uplift, not total rainfall amount. The Khasi Hills create funnel-effect intense rapid forced ascent — conditions that produce deep convective towers (high-topped clouds). The Western Ghats are lower mountains with gradual windward slopes creating slow, sustained, gentle ascent — ideal for collision-coalescence warm rain formation (low-topped shallow clouds). The Khasi Hills produce essentially no shallow clouds despite their extreme rainfall — almost all their rain comes from deep systems.",
  hint:"It is not how MUCH rain falls but HOW the air is forced upward. Slow gentle uplift = warm rain. Fast violent uplift = deep ice-phase convection. Terrain geometry matters more than total rainfall."
},

{
  id:"a07", day:"13 Sep — 10:00 IST",
  title:"Environmental vs Satellite Data — Which Matters More for Rain Type?",
  region:"Rain Forecasting Operations",
  mapType:"geo_diag",
  data:{tb11:235, btd1:-15, deltaBtd:1.1, stormHeight:7.6, rainRate:11.0},
  question:"Your team built a machine learning rain classification system using both satellite channel data AND atmospheric model variables (instability, humidity, wind shear). Analysis shows the atmospheric model variables score higher for importance than satellite variables. A colleague argues this means satellite data is useless. How do you respond?",
  choices:[
    {id:"a", text:"Agree — if atmospheric model variables score higher, satellite should be removed to simplify the algorithm.", correct:false, risk:"REMOVE SATELLITE WRONG", color:"var(--txt3)", tag:"Feature Importance"},
    {id:"b", text:"Disagree. Atmospheric model variables better determine WHAT TYPE of rain is occurring (convective vs gentle). Satellite observations are specifically essential for locating WHERE the rain is at any given moment. Both questions are needed and both data sources are needed.", correct:true, risk:"BOTH NEEDED", color:"var(--pur)", tag:"Feature Importance"},
    {id:"c", text:"Atmospheric models are always more accurate than satellite for all aspects of precipitation forecasting.", correct:false, risk:"MODEL ALWAYS BETTER WRONG", color:"var(--gold)", tag:"Feature Importance"},
    {id:"d", text:"Feature importance analysis is unreliable — ignore it and keep all data regardless.", correct:false, risk:"IGNORE ANALYSIS WRONG", color:"var(--txt2)", tag:"Feature Importance"},
  ],
  correctAnswer:"b",
  explanation:"Atmospheric model variables (instability, humidity, lapse rate) have higher importance for discriminating between rain TYPES because rain type is fundamentally controlled by atmospheric thermodynamics. However, satellite observations are specifically critical for determining the SPATIAL BOUNDARY of precipitation — where rain is occurring right now at the spatial scales relevant to operational forecasting. Atmospheric models have limited horizontal resolution and temporal frequency. The two data sources complement each other: model for type, satellite for location.",
  hint:"Model variables = what type of rain. Satellite = where the rain is. You need answers to both questions. High model importance does not make satellite useless — they answer different questions."
},

{
  id:"a08", day:"4 Aug — 15:00 IST",
  title:"Global Hotspots for the Most Intense Convective Cells",
  region:"Himalayan Foothills (28–32N, 76–84E)",
  mapType:"gpm_radar",
  data:{tb11:213, btd1:-26, deltaBtd:3.4, stormHeight:13.6, rainRate:47.0},
  question:"A global analysis of 10 years of satellite radar data identifies the most intense convective cells — specifically those with strong radar echoes at 8 km altitude (in the upper mixed-phase region). Which three land/terrain-transition regions globally show the most intense profiles at this level?",
  choices:[
    {id:"a", text:"Pacific typhoon regions, Caribbean hurricane belt, and Arabian Sea — warm-ocean cyclone formation zones.", correct:false, risk:"OCEAN CYCLONE WRONG", color:"var(--txt3)", tag:"Global ICC Hotspots"},
    {id:"b", text:"Equatorial Africa, the western Himalayan foothills in India, and equatorial South America — land and terrain-influenced regions with extreme convective cell intensity.", correct:true, risk:"GLOBAL HOTSPOT CORRECT", color:"var(--red)", tag:"Global ICC Hotspots"},
    {id:"c", text:"Maritime Continent (Indonesia), central Pacific, and the Bay of Bengal — warm oceans with high sea surface temperature.", correct:false, risk:"MARITIME CONTINENT WRONG", color:"var(--gold)", tag:"Global ICC Hotspots"},
    {id:"d", text:"All tropical regions show identical convective intensity — no regional hotspots exist in global data.", correct:false, risk:"NO HOTSPOT WRONG", color:"var(--txt2)", tag:"Global ICC Hotspots"},
  ],
  correctAnswer:"b",
  explanation:"Ten years of satellite radar data reveals that the globally most intense convective cells at the 8 km reference level concentrate over three land regions: equatorial Africa, the western Himalayan foothills in India, and equatorial South America. These locations combine warm moist air sources with convergence zones near strong thermal or orographic forcing. The Himalayan foothills are particularly extreme — combining Bay of Bengal moisture with terrain triggering and exceptional atmospheric instability.",
  hint:"The most intense global convective cells are NOT over open oceans — they are where warm moist air encounters dramatic land terrain or strong convergence zones. Three regions dominate globally."
},

{
  id:"a09", day:"20 Jul — 08:00 IST",
  title:"High Detection Rate Can Mean Low Skill — Why?",
  region:"India Rain Detection Operations",
  mapType:"kalpana",
  data:{tb11:244, btd1:-16, deltaBtd:0.9, stormHeight:6.0, rainRate:8.2},
  question:"Two rain detection approaches: Method A maximises detection rate (probability of catching real rain), achieving 0.95 detection rate but balanced skill score = 0.18. Method B uses multi-criteria optimisation, achieving detection rate = 0.76, but balanced skill score = 0.49. Which is operationally more useful and why?",
  choices:[
    {id:"a", text:"Method A is better — higher detection rate (0.95) is always the operational priority. Missing rain is always worse than a false alarm.", correct:false, risk:"DETECTION ONLY WRONG", color:"var(--txt3)", tag:"Optimisation Comparison"},
    {id:"b", text:"Method B is far better operationally. A detection rate of 0.95 with skill score = 0.18 means Method A is flagging almost everything as rain — near-useless false alarm rate. Method B's balanced skill (0.49) means warnings are reliable enough for responders to act on them.", correct:true, risk:"BALANCED OPTIMAL", color:"var(--ac)", tag:"Optimisation Comparison"},
    {id:"c", text:"Both methods produce equivalent results — the difference in skill score is statistically insignificant.", correct:false, risk:"EQUIVALENT WRONG", color:"var(--gold)", tag:"Optimisation Comparison"},
    {id:"d", text:"Neither is valid — use false alarm rate as the sole criterion instead.", correct:false, risk:"FAR ONLY WRONG", color:"var(--txt2)", tag:"Optimisation Comparison"},
  ],
  correctAnswer:"b",
  explanation:"A balanced skill score = 0.18 means the forecast is barely better than random — despite detecting 95% of rain events, the algorithm generates so many false alarms that it provides little operational value. Emergency managers receiving rain warnings for 80% of the region when only 30% actually rains quickly learn to ignore the system. Multi-criteria optimisation finds a threshold that is simultaneously closest to ideal performance across all statistics. The result (detection = 0.76, skill = 0.49) is far more useful: warnings are reliable enough that responders actually act on them.",
  hint:"Skill score = 0.18 means nearly random performance despite high detection rate. A warning system that cries wolf constantly gets ignored. Balanced optimisation gives the operationally trustworthy result."
},

{
  id:"a10", day:"28 Sep — 16:00 IST",
  title:"Break Spell Evening Showers — Pure Solar Driving",
  region:"Central India Break Phase (18–26N, 74–84E)",
  mapType:"active_monsoon",
  data:{tb11:271, btd1:-6, deltaBtd:-0.5, stormHeight:1.8, rainRate:0.9},
  question:"It is late September, monsoon is in a break phase over central India. The few shower events that do occur are concentrated between 1600–2000 local time. A district meteorologist asks why even these weak break-spell showers peak in the evening. What is the physical explanation?",
  choices:[
    {id:"a", text:"Evening winds during break spells bring moisture from the Bay of Bengal to central India, triggering evening rain.", correct:false, risk:"BOB WRONG", color:"var(--txt3)", tag:"Break Diurnal"},
    {id:"b", text:"During break spells, isolated convection is thermally driven by daytime solar heating of the land surface. Maximum instability builds through the afternoon and triggers storms in the evening — a simple solar-driven daily cycle with no large-scale organisation.", correct:true, risk:"THERMAL BREAK PEAK", color:"var(--gold)", tag:"Break Diurnal"},
    {id:"c", text:"Evening peaks only occur during active spells. Break spell rain has no daily timing preference.", correct:false, risk:"NO BREAK DIURNAL WRONG", color:"var(--txt2)", tag:"Break Diurnal"},
    {id:"d", text:"The evening peak during break spells is caused by urban heat islands in large cities generating local convection.", correct:false, risk:"URBAN ONLY WRONG", color:"var(--red)", tag:"Break Diurnal"},
  ],
  correctAnswer:"b",
  explanation:"During active monsoon spells, large organised storm systems complicate the daily timing cycle. During break spells, the atmosphere reverts to a simple solar-driven regime: the land surface heats through the day, atmospheric instability builds from morning onward, reaches maximum in the afternoon, and isolated convective cells trigger in the afternoon–evening. This classic solar-driven daily cycle is much cleaner during breaks precisely because the large-scale organised weather systems that normally obscure it are absent.",
  hint:"Break spell = no organised systems = pure solar heating drives the daily cycle. Land heats all day → peak instability in the evening → isolated showers then. Simple and predictable."
},

{
  id:"a11", day:"12 Jul — 11:00 IST",
  title:"Why Tropical Rain Types Are Still Hard with 16 Channels",
  region:"Operational Rain Classification",
  mapType:"geo_diag",
  data:{tb11:240, btd1:-15, deltaBtd:1.0, stormHeight:7.2, rainRate:10.8},
  question:"Your agency upgrades from single-channel to 16-channel multi-spectral satellite rain classification. Overall accuracy exceeds 75%. However, tropical convective rain and tropical mixed types remain the hardest categories. A manager asks why these remain challenging even with 16 channels. What do you explain?",
  choices:[
    {id:"a", text:"Tropical convection appears identical to gentle widespread rain in all 16 channels — multi-spectral adds no value for tropical types.", correct:false, risk:"NO VALUE WRONG", color:"var(--txt3)", tag:"Multi-Spectral Limits"},
    {id:"b", text:"Tropical convective and tropical mixed types have overlapping spectral signatures because they represent different stages of a continuous physical process. The physical boundary between them is gradual in nature, not sharp — so satellite fingerprints overlap even with all 16 channels.", correct:true, risk:"INHERENT AMBIGUITY", color:"var(--ac)", tag:"Multi-Spectral Limits"},
    {id:"c", text:"The tropical atmosphere blocks all infrared channels, making satellite data fundamentally unreliable in the tropics.", correct:false, risk:"TROPICS BLOCK IR WRONG", color:"var(--red)", tag:"Multi-Spectral Limits"},
    {id:"d", text:"The algorithm needs more tropical training data — collecting more data will completely solve this problem.", correct:false, risk:"TRAINING DATA ONLY WRONG", color:"var(--gold)", tag:"Multi-Spectral Limits"},
  ],
  correctAnswer:"b",
  explanation:"Some categories are genuinely difficult because they are physically similar. A tropical convective cell losing intensity transitions continuously through 'tropical mixed' into 'tropical stratiform' — these categories shade into each other in nature. Their satellite spectral signatures overlap because the underlying physics overlaps. More channels help enormously for categories with clear physical differences, but cannot eliminate ambiguity for categories that are genuinely gradational in nature. This is a fundamental limit of any classification system when the classes themselves are not sharply distinct.",
  hint:"Some categories are hard to classify because they are genuinely similar in the real atmosphere, not because the satellite or algorithm is failing. Nature does not always fit into neat boxes."
},

{
  id:"a12", day:"19 Aug — 14:00 IST",
  title:"Nocturnal Coastal Storm — Two Wind Systems Converging",
  region:"Western Ghats Coast (14–18N, 73–75E)",
  mapType:"coast_storm",
  data:{tb11:219, btd1:-22, deltaBtd:2.4, stormHeight:11.2, rainRate:30.5},
  question:"At 0300 local time, intense storms are occurring right along the Konkan coast. You need to explain the mechanism to emergency managers. What two wind systems are converging to trigger these nocturnal storms?",
  choices:[
    {id:"a", text:"Upper-level jet stream descending to the surface and colliding with the sea breeze — creating a low-level convergence zone.", correct:false, risk:"JET STREAM WRONG", color:"var(--txt3)", tag:"Nocturnal Convergence"},
    {id:"b", text:"Cool drainage wind / land breeze flowing down from the cooled mountain top converging with the warm moist prevailing monsoon flow over the coastal ocean — the temperature contrast between cooled land and warm ocean drives this nocturnal convergence zone just offshore.", correct:true, risk:"LAND BREEZE + MONSOON FLOW", color:"var(--org)", tag:"Nocturnal Convergence"},
    {id:"c", text:"Two sea breezes from north and south coasts meeting over the Konkan.", correct:false, risk:"DUAL SEA BREEZE WRONG", color:"var(--gold)", tag:"Nocturnal Convergence"},
    {id:"d", text:"Urban heat island from Mumbai keeping the land warm at night — purely an urban effect.", correct:false, risk:"URBAN ONLY WRONG", color:"var(--txt2)", tag:"Nocturnal Convergence"},
  ],
  correctAnswer:"b",
  explanation:"Atmospheric wind analysis combined with radar data shows nocturnal coastal storms along the Western Ghats are triggered by two wind systems converging: (1) Downslope drainage winds or land breeze flowing from the now-cooled mountain top toward the coast — land cools rapidly after sunset while the ocean retains heat. (2) The prevailing southwest monsoon flow, which remains active through the night. Where these meet just offshore, surface convergence forces air upward over the warm ocean, providing both uplift and moisture for intense nocturnal storms.",
  hint:"Night: land cools, mountain drains cool air toward coast. Ocean stays warm. Monsoon flow still blowing onshore. Cool downslope air meets warm moist onshore flow = convergence = storms."
},

{
  id:"a13", day:"5 Sep — 09:00 IST",
  title:"Descending Radar Peak — Reading the Storm Life Cycle",
  region:"Indian Monsoon Region",
  mapType:"gpm_radar",
  data:{tb11:228, btd1:-16, deltaBtd:1.4, stormHeight:9.0, rainRate:17.2},
  question:"Time-lapse radar over Odisha: at 1400 the maximum radar signal is at 10 km altitude. By 1600 it has shifted to 5 km. By 1800 it is at 3 km. What does this descending radar peak tell you, and what do you expect at the surface by 1800?",
  choices:[
    {id:"a", text:"The storm is intensifying — signal moving lower means updrafts are strengthening and pushing rain toward the surface. Maximum rain and storm surge expected.", correct:false, risk:"INTENSIFYING WRONG", color:"var(--red)", tag:"Ze Life Cycle"},
    {id:"b", text:"The storm is progressing through its mature phase toward decline. Early: signal peaks high up (updrafts lofting particles to 10 km). Later: particles descend. By 1800 with signal at 3 km, intense surface rain is occurring NOW but the storm may be weakening soon.", correct:true, risk:"LATE MATURE RAIN NOW", color:"var(--ac)", tag:"Ze Life Cycle"},
    {id:"c", text:"Signal descending means cloud top is lowering. Issue a clear-sky advisory since cloud top below 3 km equals shallow cloud and negligible rain.", correct:false, risk:"CLOUD TOP WRONG", color:"var(--txt3)", tag:"Ze Life Cycle"},
    {id:"d", text:"Signal descent from 10 km to 3 km in 4 hours indicates the storm is moving westward — this is a motion signal not a life cycle signal.", correct:false, risk:"MOTION WRONG", color:"var(--gold)", tag:"Ze Life Cycle"},
  ],
  correctAnswer:"b",
  explanation:"The vertical descent of the radar signal peak traces the convective cell life cycle: (1) Growing/early-mature (1400): vigorous updrafts carry large ice particles to 10 km, signal peaks high. (2) Mid-mature (1600): updrafts weakening, particles descend, signal at 5 km near the melting layer. (3) Late-mature (1800): signal at 3 km — particles well below the freezing level falling as large raindrops — currently intense surface rain. This is when maximum surface accumulation occurs. The storm is producing heavy rain NOW but may approach dissipation within 1–2 hours.",
  hint:"Signal peak at 10 km = particles still held aloft by updrafts = early stage. Signal at 3 km = particles have fallen all the way down = surface rain occurring NOW, storm nearing its end."
},

{
  id:"a14", day:"17 Jul — 16:00 IST",
  title:"Why the 8–14 μm Infrared Window Is Used for Cloud Imaging",
  region:"Arabian Sea (10–16N, 62–72E)",
  mapType:"shallow_warm",
  data:{tb11:276, btd1:-38, deltaBtd:-2.0, stormHeight:2.0, rainRate:1.4},
  question:"A physics intern asks why weather satellites use the 8–14 μm infrared spectral region to observe clouds, when other parts of the spectrum are available. What is the fundamental reason?",
  choices:[
    {id:"a", text:"8–14 μm is completely blocked by the atmosphere — so satellites can only detect clouds at the very top layer without interference.", correct:false, risk:"BLOCKED WRONG", color:"var(--red)", tag:"IR Window Physics"},
    {id:"b", text:"The 8–14 μm region has relatively LOW atmospheric absorption — the atmosphere is mostly transparent here. Thermal emission from cloud tops passes through the clear atmosphere to reach the satellite sensor with minimal interference, allowing cloud-top temperature to be measured directly.", correct:true, risk:"CORRECT PHYSICS", color:"var(--grn)", tag:"IR Window Physics"},
    {id:"c", text:"8–14 μm is primarily reflected solar radiation — clouds reflect this wavelength strongly, giving excellent cloud signals.", correct:false, risk:"REFLECTED SOLAR WRONG", color:"var(--txt3)", tag:"IR Window Physics"},
    {id:"d", text:"The choice of 8–14 μm is purely historical — any spectral band would give equivalent cloud information.", correct:false, risk:"ARBITRARY WRONG", color:"var(--gold)", tag:"IR Window Physics"},
  ],
  correctAnswer:"b",
  explanation:"The 8–14 μm region is called an atmospheric window because molecular absorption by atmospheric gases is relatively low there. The atmosphere is mostly transparent, allowing thermal emission from cloud tops — and the surface beneath cloud-free regions — to travel upward and reach the satellite sensor. The satellite then converts the measured energy to brightness temperature using Planck's law. In more absorbing spectral regions (like the 6.2 μm water vapour band), the atmosphere itself dominates emission and the satellite cannot see cloud tops.",
  hint:"Window = transparent. The atmosphere does not absorb much at 8–14 μm, so cloud thermal emission passes straight through to the satellite. Other wavelengths get absorbed by atmospheric gases before reaching the sensor."
},

{
  id:"a15", day:"23 Aug — 11:00 IST",
  title:"Quadratic Moisture-Rain Relationship — Flash Flood Thresholds",
  region:"Mountain Monsoon Regions",
  mapType:"conv_vs_strat",
  data:{tb11:230, btd1:-14, deltaBtd:1.6, stormHeight:8.5, convFrac:0.20, stratFrac:0.80, rainRate:12.0},
  question:"GPM satellite data combined with atmospheric moisture analysis shows that near-surface rain rate increases with total column water vapour approximately as a quadratic (squared) function rather than a simple linear one. What does this nonlinear relationship imply for setting flash flood warning thresholds?",
  choices:[
    {id:"a", text:"The quadratic relationship means rain rate doubles for every 10 kg/m² increase in water vapour — use this to linearly scale rain rate forecasts.", correct:false, risk:"LINEAR WRONG", color:"var(--txt3)", tag:"TCWV Scaling"},
    {id:"b", text:"Rain rate accelerates rapidly once moisture exceeds a certain level. Crossing from moderate to high moisture produces disproportionately intense rain — flash flood risk rises sharply and non-linearly with moisture. Monitor moisture thresholds very closely, as small additional moisture increases at already high levels cause large rain rate jumps.", correct:true, risk:"QUADRATIC FLASH FLOOD", color:"var(--ac)", tag:"TCWV Scaling"},
    {id:"c", text:"A quadratic relationship means there is a moisture maximum beyond which rain rate decreases. Most extreme rain occurs at moderate moisture levels.", correct:false, risk:"PEAK THEN DECREASE WRONG", color:"var(--gold)", tag:"TCWV Scaling"},
    {id:"d", text:"The quadratic scaling is only valid for gentle widespread rain. Convective rain follows a simple linear moisture relationship.", correct:false, risk:"STRATIFORM ONLY WRONG", color:"var(--txt2)", tag:"TCWV Scaling"},
  ],
  correctAnswer:"b",
  explanation:"The approximately quadratic relationship between near-surface rain rate and total column water vapour has important operational implications. If you double moisture, you quadruple the rain rate — not just double it. In practice, once atmospheric moisture crosses a regional threshold, small additional moisture increases can shift a moderate rain event into an extreme flash flood event. The curve steepens sharply at high moisture values. For flash flood forecasting, this means the difference between 40 and 50 kg/m² of precipitable water could be the difference between heavy rain and a catastrophic flash flood.",
  hint:"Quadratic means doubling moisture quadruples rain — not just doubles it. The relationship steepens. Small additional moisture at already high levels produces disproportionately extreme rain — the classic tipping point."
},

{
  id:"a16", day:"11 Aug — 13:00 IST",
  title:"Morning Peak at Himalayan Foothills During Active Monsoon",
  region:"Himalayan Foothills (30–34N, 74–84E)",
  mapType:"active_monsoon",
  data:{tb11:231, btd1:-16, deltaBtd:1.2, stormHeight:9.1, rainRate:15.6},
  question:"Rainfall records from Dehradun, Shimla, and Mussoorie show a consistent morning peak (0600–1100 local time) during active monsoon periods — quite different from the afternoon peak over flat terrain. What causes this distinct morning peak at the Himalayan foothills?",
  choices:[
    {id:"a", text:"Morning fog in the Himalayas condenses into rain — dew accumulates on slopes and drips as precipitation.", correct:false, risk:"DEW CONDENSATION WRONG", color:"var(--txt3)", tag:"Himalayan Diurnal"},
    {id:"b", text:"Large organised storm systems form over the Gangetic Plains in the afternoon and evening, propagate northward overnight, and arrive at the Himalayan foothills by early morning. Overnight moisture convergence against the mountain barrier also enhances morning precipitation.", correct:true, risk:"PROPAGATING SYSTEMS MORNING", color:"var(--ac)", tag:"Himalayan Diurnal"},
    {id:"c", text:"The morning sun heats the Himalayas faster than the plains, causing upslope convection that produces morning rain exclusively at the foothills.", correct:false, risk:"MORNING SOLAR WRONG", color:"var(--gold)", tag:"Himalayan Diurnal"},
    {id:"d", text:"Western disturbances always arrive from the west in the morning, bringing rain to the foothills at that time.", correct:false, risk:"WD WRONG SEASON", color:"var(--txt2)", tag:"Himalayan Diurnal"},
  ],
  correctAnswer:"b",
  explanation:"During active monsoon spells, a distinct morning rainfall peak at the Himalayan foothills results from two mechanisms: (1) Large storm systems that develop over the Gangetic Plains in the afternoon propagate northward or northwestward overnight, reaching the mountain barrier by early morning — blocked and enhanced by the terrain. (2) The overnight low-level jet intensifies after sunset, transporting moist Bay of Bengal air toward the foothills and causing moisture convergence against the Himalayan barrier in the pre-dawn to morning hours. This morning peak is well-documented in satellite and rain gauge data.",
  hint:"Storms form over the plains in the afternoon and travel toward the mountains overnight. By morning they hit the Himalayan barrier. Combined with overnight moisture delivery by the low-level jet, this creates the morning peak."
},

{
  id:"a17", day:"3 Jul — 16:00 IST",
  title:"Why the Same Channel Difference Behaves Differently for Thick vs Thin Clouds",
  region:"Bay of Bengal / Arabian Sea",
  mapType:"btd_challenge",
  data:{tb11:225, btd1:-4, deltaBtd:1.8, stormHeight:9.5, rainRate:20.0},
  question:"A shallow cloud shows BTD (6.2−11.2 μm) = −40 K (very negative). A thick deep cloud shows BTD = −4 K (near zero). Both are precipitating. Why is the same channel difference so different for the two cloud types?",
  choices:[
    {id:"a", text:"Shallow clouds have stronger updrafts that amplify the channel difference signal. Deep clouds suppress it due to their weight.", correct:false, risk:"UPDRAFT WRONG", color:"var(--txt3)", tag:"BTD Optical Thickness"},
    {id:"b", text:"For the thin shallow cloud, the 6.2 μm and 11.2 μm channels see different atmospheric levels — creating a large difference. For the thick opaque deep cloud, BOTH channels are blocked by the opaque cloud top and see the same level — so their difference collapses to near zero. The near-zero value for thick clouds then reflects how much moisture is ABOVE the cloud top.", correct:true, risk:"CORRECT PHYSICS", color:"var(--ac)", tag:"BTD Optical Thickness"},
    {id:"c", text:"Both should show identical channel differences since both clouds are precipitating. The observed difference must be a sensor calibration error.", correct:false, risk:"CALIBRATION ERROR WRONG", color:"var(--red)", tag:"BTD Optical Thickness"},
    {id:"d", text:"The channel difference is meaningless for deep clouds — it should only be used for shallow cloud classification.", correct:false, risk:"MEANINGLESS WRONG", color:"var(--gold)", tag:"BTD Optical Thickness"},
  ],
  correctAnswer:"b",
  explanation:"The physical reason the same channel difference behaves differently is cloud optical thickness. For a thin shallow cloud: the 6.2 μm water vapour channel sees a weighted average of the atmosphere below and above the cloud, while 11.2 μm sees the cold liquid-droplet cloud top — creating a large negative difference. For an optically thick deep cloud: BOTH the 6.2 μm and 11.2 μm channels are completely blocked and both see only the cloud-top layer. Their difference collapses to near zero. For thick clouds, the channel difference then reflects moisture above the cloud top, not the cloud itself.",
  hint:"Thin cloud: two channels see different atmospheric levels = big difference. Thick opaque cloud: both channels see the same opaque top = near-zero difference. The physics changes completely with optical thickness."
},

{
  id:"a18", day:"14 Sep — 09:00 IST",
  title:"AI Beats All Baselines — But Colleague Prefers the Simple Method",
  region:"Satellite AI Operations Centre",
  mapType:"convective_burst",
  data:{tb11:216, btd1:-23, deltaBtd:3.0, stormHeight:12.3, rainRate:40.5},
  question:"Your team benchmarks five convection detection methods. The new AI system with shape detection and imbalance correction outperforms all others on all metrics. A sceptical colleague says: 'We should stick with the simple temperature threshold — it is explainable and does not need training data.' How do you respond?",
  choices:[
    {id:"a", text:"Agree — simplicity always beats performance for operational forecasting.", correct:false, risk:"SIMPLE ALWAYS BETTER WRONG", color:"var(--txt3)", tag:"Method Comparison"},
    {id:"b", text:"The simple threshold approach is rigid — it fails for clouds with unusual shapes, in different seasons, or different geographic locations. The AI performance advantage translates directly to more storm events caught earlier, which has real life-saving implications that outweigh explainability concerns.", correct:true, risk:"PERFORMANCE WINS HERE", color:"var(--grn)", tag:"Method Comparison"},
    {id:"c", text:"Agree — the AI needs 10 years of additional data before it can be trusted operationally.", correct:false, risk:"DATA WAITING WRONG", color:"var(--gold)", tag:"Method Comparison"},
    {id:"d", text:"Neither approach is valid — only numerical model output should be used for convection detection.", correct:false, risk:"MODEL ONLY WRONG", color:"var(--txt2)", tag:"Method Comparison"},
  ],
  correctAnswer:"b",
  explanation:"The simple threshold's rigidity is well-documented. A fixed temperature threshold fails because: (1) Seasonal variability means the same threshold misidentifies summer versus winter cloud tops; (2) Geographic variation means what looks convective in the tropics appears different at 30°N; (3) Cloud shape variation means irregular cells are not detected. These are not theoretical concerns — they cause real missed warnings. The AI's systematic advantage across all benchmark metrics means operationally it catches more real events earlier. Better detection means more lead time for warnings, which translates to lives protected.",
  hint:"The simple threshold fails because it is rigid — it cannot adapt to season, geography, or irregular shapes. The AI learns these variations from data. Better detection = more lead time = more lives protected."
},

{
  id:"a19", day:"26 Jun — 15:00 IST",
  title:"Warm TB vs Cold TB — Which Area Has a Cloud?",
  region:"Arabian Sea (12–16N, 65–72E)",
  mapType:"shallow_warm",
  data:{tb11:279, btd1:-30, deltaBtd:-1.6, stormHeight:1.6, rainRate:1.0},
  question:"Satellite thermal data: Area A shows brightness temperature = 279 K. Area B shows brightness temperature = 302 K. The ocean surface temperature everywhere is about 302 K. A new trainee asks: 'If Area B is warmer, doesn't that mean it has a more intense cloud?' What do you explain?",
  choices:[
    {id:"a", text:"Area B (302 K) has a warmer more intense cloud — higher temperature means more active convection in the tropics.", correct:false, risk:"HIGHER TB = MORE DANGER WRONG", color:"var(--red)", tag:"TB vs Surface"},
    {id:"b", text:"Area B (302 K) is the warm ocean surface with no cloud at all — the satellite is seeing the sea surface directly. Area A (279 K) has a low cloud whose top is a few hundred metres to 2 km above the sea, producing a cooler observed temperature.", correct:true, risk:"A HAS CLOUD B IS OCEAN", color:"var(--grn)", tag:"TB vs Surface"},
    {id:"c", text:"Both areas have equal cloud conditions — brightness temperatures in the 270–310 K range all indicate identical risk.", correct:false, risk:"IDENTICAL RISK WRONG", color:"var(--txt3)", tag:"TB vs Surface"},
    {id:"d", text:"Area B must have a tropopause-penetrating storm cloud — 302 K is the brightness temperature of an extreme cold cloud top.", correct:false, risk:"302K EXTREME WRONG", color:"var(--gold)", tag:"TB vs Surface"},
  ],
  correctAnswer:"b",
  explanation:"The satellite measures the temperature of the highest emitting surface in its view. Brightness temperature = 302 K in Area B exactly matches the ocean sea surface temperature — the satellite is seeing warm sea surface directly, meaning no cloud is present (clear sky). Brightness temperature = 279 K in Area A is cooler than the sea surface — a cloud top is present at a lower temperature, sitting a few hundred metres to a couple of km above the sea. In the tropics where sea surface temperature is 28–32°C, any brightness temperature cooler than the local sea surface temperature confirms a cloud is present.",
  hint:"Brightness temperature warmer than the ocean = no cloud = direct sea surface emission. Cooler than the ocean = cloud present with its top at the altitude matching that temperature. Area B is simply clear sky over warm water."
},

{
  id:"a20", day:"30 Sep — 10:00 IST",
  title:"Arabian Sea High Stratiform Fraction vs Central India High Intensity",
  region:"Arabian Sea / Indian Ocean",
  mapType:"active_monsoon",
  data:{tb11:235, btd1:-15, deltaBtd:1.0, stormHeight:8.0, rainRate:12.5},
  question:"Satellite radar shows the Arabian Sea has the highest fraction of widespread gentle rain area (~35%) in the Indian region, while Central India has higher average precipitation intensity. How do you explain this contrast to a water resources engineer?",
  choices:[
    {id:"a", text:"The Arabian Sea stratiform fraction must be wrong — an ocean without terrain cannot produce widespread gentle rain.", correct:false, risk:"OCEAN NO STRATIFORM WRONG", color:"var(--txt3)", tag:"Regional Precip Character"},
    {id:"b", text:"The Arabian Sea has abundant shallow clouds and large gentle-rain cloud systems but relatively weak convective intensity. Central India receives organised monsoon low-pressure systems and embedded convective cores that produce higher peak intensities. High gentle-rain fraction means widespread moderate rain, not intense localised rain.", correct:true, risk:"CORRECT CHARACTERISATION", color:"var(--gold)", tag:"Regional Precip Character"},
    {id:"c", text:"The two statistics measure the same thing — the Arabian Sea must therefore have higher intensity than Central India.", correct:false, risk:"SAME THING WRONG", color:"var(--red)", tag:"Regional Precip Character"},
    {id:"d", text:"Gentle-rain fraction and rain intensity are always inversely correlated everywhere — more gentle rain always means less intensity.", correct:false, risk:"ALWAYS INVERSE WRONG", color:"var(--txt2)", tag:"Regional Precip Character"},
  ],
  correctAnswer:"b",
  explanation:"The Arabian Sea has the highest gentle-rain fraction because it hosts large areas of organised widespread cloud systems and abundant shallow warm-rain clouds — both producing widespread moderate rainfall. However, the lack of terrain-triggered vigorous convection means peak rain rates are moderate. Central India hosts monsoon low-pressure system tracks and embedded convective cells, producing higher peak intensities even though the gentle-rain fraction is lower. For the water engineer: Arabian Sea-type rainfall means slow steady inflow; Central India type means risk of sudden intense spikes requiring spillway readiness.",
  hint:"High gentle-rain fraction = widespread moderate rain = slow steady inflow. High intensity = intense convective cores = risk of sudden spikes. Different rainfall characters need different reservoir management strategies."
},

], // end advanced

// ────────────────────────────────────────────────────────────
// MASTER — 20 Scenarios
// ────────────────────────────────────────────────────────────
master: [

{
  id:"m01", day:"7 Jul — 14:00 IST",
  title:"Computing the Balanced Skill Score from a Contingency Table",
  region:"Satellite Operations",
  mapType:"btd_challenge",
  data:{tb11:228, btd1:-16, deltaBtd:2.1, stormHeight:9.4, rainRate:20.0},
  question:"Your cloud classification test gives: A=800 (correctly classed shallow), B=200 (shallow misclassified), C=150 (non-shallow misclassified), D=1850 (correctly classed non-shallow). Calculate the balanced skill score using the formula: 2(AD−BC) / [(A+C)(C+D) + (A+B)(B+D)]. What is the approximate result and what does it mean operationally?",
  choices:[
    {id:"a", text:"Result ≈ 0.73 — good operational skill, substantially better than random classification.", correct:true, risk:"HIGH SKILL", color:"var(--ac)", tag:"Skill Score Calculation"},
    {id:"b", text:"Result ≈ 0.45 — moderate skill, similar to random classification.", correct:false, risk:"MODERATE SKILL WRONG", color:"var(--txt3)", tag:"Skill Score Calculation"},
    {id:"c", text:"Result ≈ 0.12 — near-random performance, algorithm is unreliable.", correct:false, risk:"LOW SKILL WRONG", color:"var(--red)", tag:"Skill Score Calculation"},
    {id:"d", text:"Result ≈ 1.00 — perfect classification with no errors.", correct:false, risk:"PERFECT WRONG", color:"var(--gold)", tag:"Skill Score Calculation"},
  ],
  correctAnswer:"a",
  explanation:"Numerator = 2(AD−BC) = 2(800×1850 − 200×150) = 2(1,480,000 − 30,000) = 2,900,000. Denominator = (A+C)(C+D) + (A+B)(B+D) = (950)(2000) + (1000)(2050) = 1,900,000 + 2,050,000 = 3,950,000. Score = 2,900,000 / 3,950,000 ≈ 0.73. A score above 0.7 is considered good operational skill — substantially better than random (score = 0). This threshold reliably discriminates between shallow and non-shallow clouds.",
  hint:"Work step by step: calculate AD and BC, then 2(AD−BC) for the numerator. Calculate each denominator bracket separately, add them, then divide. Compare your result to 0 (random) and 1 (perfect)."
},

{
  id:"m02", day:"20 Aug — 09:00 IST",
  title:"High Detection Rate Can Mean Zero Skill",
  region:"India Rain Detection",
  mapType:"kalpana",
  data:{tb11:248, btd1:-17, deltaBtd:0.9, stormHeight:6.4, rainRate:9.0},
  question:"Your dataset: 20% of pixels are rainy, 80% are dry. Algorithm X flags ALL pixels as rain → detection rate = 1.00, balanced skill score = 0. Algorithm Y flags 25% as rain with 75% hit rate → detection rate = 0.94, balanced skill score = 0.52. Which is operationally better, and what does this reveal about using detection rate alone?",
  choices:[
    {id:"a", text:"Algorithm X is better — detection rate = 1.00 is perfect. Maximising rain detection is always the correct operational priority.", correct:false, risk:"DETECTION = 1 IS USELESS", color:"var(--txt3)", tag:"Detection Rate Limitation"},
    {id:"b", text:"Algorithm Y is far better. Algorithm X achieves detection rate = 1 trivially by flagging everything — it has zero real skill. An algorithm that warns the entire country every day is operationally useless. Algorithm Y's balanced skill of 0.52 means warnings are reliable enough to act on.", correct:true, risk:"SKILL IS ESSENTIAL", color:"var(--ac)", tag:"Detection Rate Limitation"},
    {id:"c", text:"Both algorithms are equally valid — both detect most rain events. Choose Algorithm X for simplicity.", correct:false, risk:"EQUAL WRONG", color:"var(--gold)", tag:"Detection Rate Limitation"},
    {id:"d", text:"Algorithm X is better for tropical monsoon because missing rain is catastrophic — the 6% miss rate of Algorithm Y is unacceptable.", correct:false, risk:"MISS RATE WRONG", color:"var(--txt2)", tag:"Detection Rate Limitation"},
  ],
  correctAnswer:"b",
  explanation:"This is the trivial forecaster problem. Algorithm X achieves detection rate = 1.00 by flagging every single pixel as rain — it detects all rain events but generates false alarms for 80% of the area (all the dry pixels). Balanced skill score = 0 means no skill beyond random. Algorithm Y has detection rate = 0.94 but balanced skill = 0.52 — real skill. A warning service that warns everyone everywhere every day achieves detection rate = 1 but is completely ignored by emergency managers because its false alarm rate is 100%. This is why detection rate alone must always be evaluated alongside a balanced skill score.",
  hint:"Algorithm X cheats at detection rate by flagging everything. A weather service that warns everyone every day achieves detection = 1 but is useless. The balanced skill score catches this cheat — it equals 0 for Algorithm X."
},

{
  id:"m03", day:"12 Sep — 15:00 IST",
  title:"Active Spell Duration Statistics — Crop Season Implications",
  region:"India Monsoon Zones",
  mapType:"active_monsoon",
  data:{tb11:227, btd1:-16, deltaBtd:1.2, stormHeight:9.0, rainRate:15.8},
  question:"Climatological analysis shows: approximately 70% of active monsoon spells last 4 days or less; about 20–30% of break spells last more than 10 days; only 5% of active spells last longer than 10 days. What does this asymmetry in duration tell agricultural planners about within-season drought risk?",
  choices:[
    {id:"a", text:"Active spells should be relied on for irrigation since they last longer than break spells on average.", correct:false, risk:"ACTIVE LONGER WRONG", color:"var(--txt3)", tag:"Spell Duration"},
    {id:"b", text:"Active spells are typically SHORT (70% last ≤4 days) — they deliver intense rain rapidly. Break spells can be very LONG (20–30% lasting >10 days) — prolonged dry periods within the monsoon season. Crop planning must account for extended within-season droughts, not just total seasonal rainfall.", correct:true, risk:"CROP PLANNING INSIGHT", color:"var(--gold)", tag:"Spell Duration"},
    {id:"c", text:"The symmetry in duration means there is no operational difference between active and break spell planning for agriculture.", correct:false, risk:"SYMMETRY WRONG", color:"var(--txt2)", tag:"Spell Duration"},
    {id:"d", text:"Only the 5% of active spells lasting more than 10 days matter for agriculture — shorter active spells provide insufficient moisture.", correct:false, risk:"LONG ACTIVE ONLY WRONG", color:"var(--red)", tag:"Spell Duration"},
  ],
  correctAnswer:"b",
  explanation:"The duration asymmetry has profound implications. Active spells are brief but intense (70% ≤4 days) — they deliver large rainfall amounts quickly. Break spells can be extremely prolonged — 20–30% exceed 10 days. During a 10+ day break in August at a critical crop growth stage, crops can fail without irrigation even though total seasonal rainfall may be normal. The conventional view that 'the monsoon provides water throughout June–September' misses this internal structure. Meteorological services that monitor and forecast active/break phase transitions provide critical guidance for agricultural planning.",
  hint:"Short intense active spells versus potentially very long dry break spells. The asymmetry means the monsoon does not distribute rain evenly — it clusters in brief bursts separated by potentially extended dry periods."
},

{
  id:"m04", day:"8 Aug — 08:00 IST",
  title:"Attention Map in Gated Convolution — Why the Residual Matters",
  region:"AI Satellite Operations",
  mapType:"convective_burst",
  data:{tb11:218, btd1:-24, deltaBtd:3.2, stormHeight:12.8, rainRate:42.0},
  question:"In a gated convolution: attention map α = sigmoid(convolution of input and gate features); output = convolution of (input × α) + input. Why is the residual connection (the added input term at the end) specifically important for convection boundary detection?",
  choices:[
    {id:"a", text:"The residual connection reduces computation time by skipping part of the forward pass.", correct:false, risk:"SPEED WRONG", color:"var(--txt3)", tag:"Residual Connection"},
    {id:"b", text:"Without the residual, if attention map α ≈ 0 at a region, those features are completely zeroed out. The residual ensures even non-boundary regions still pass their original features forward — preventing loss of spatial context needed for downstream classification.", correct:true, risk:"GRADIENT FLOW PRESERVED", color:"var(--ac)", tag:"Residual Connection"},
    {id:"c", text:"The residual doubles feature map resolution, which is essential for boundary sharpness.", correct:false, risk:"RESOLUTION WRONG", color:"var(--gold)", tag:"Residual Connection"},
    {id:"d", text:"Residual connections are a standard choice with no specific purpose in this particular context.", correct:false, risk:"NO PURPOSE WRONG", color:"var(--txt2)", tag:"Residual Connection"},
  ],
  correctAnswer:"b",
  explanation:"In the gated convolution, multiplying input features by α applies element-wise suppression. If α ≈ 0 at a location (the attention mechanism decides this is NOT a boundary), the product ≈ 0, effectively zeroing out that location. Without the residual term, those spatial locations contribute nothing to subsequent layers — losing context information needed for classifying cloud interior versus clear sky. Adding the original input back (the residual) ensures even suppressed locations retain their original feature values. This also provides a direct gradient path during training, preventing gradient vanishing and making deep networks trainable.",
  hint:"What happens if α is nearly zero everywhere? Features become zero — information is lost. The residual added-input term prevents this: even when attention suppresses a region, the original information still flows through."
},

{
  id:"m05", day:"25 Jul — 16:00 IST",
  title:"Land vs Ocean Storm Profiles — Upper Troposphere Difference",
  region:"Multiple Tropical Locations",
  mapType:"gpm_radar",
  data:{tb11:224, btd1:-21, deltaBtd:2.3, stormHeight:11.2, rainRate:30.0},
  question:"Satellite radar shows oceanic intense storm profiles differ from each other by less than 2 radar reflectivity units globally. But land-based intense storm profiles, particularly the Himalayan foothills, differ substantially from oceanic profiles — especially in the upper troposphere. What would you expect when comparing Himalayan foothill storms against Bay of Bengal oceanic storms, and why?",
  choices:[
    {id:"a", text:"Himalayan storms would be identical to Bay of Bengal storms since both are in South Asia and share the same monsoon moisture.", correct:false, risk:"IDENTICAL WRONG", color:"var(--txt3)", tag:"Land vs Ocean Ze"},
    {id:"b", text:"Himalayan foothill storms would show HIGHER radar reflectivity in the upper troposphere than Bay of Bengal oceanic storms. Terrain-triggered vigorous updrafts combined with extreme atmospheric instability at the foothills produce larger ice particles reaching higher altitudes — much stronger signals aloft.", correct:true, risk:"HIMALAYAN MORE INTENSE ALOFT", color:"var(--red)", tag:"Land vs Ocean Ze"},
    {id:"c", text:"Bay of Bengal storms would always be more intense because warm ocean sea surface temperature provides more energy than terrain forcing.", correct:false, risk:"BOB STRONGER WRONG", color:"var(--gold)", tag:"Land vs Ocean Ze"},
    {id:"d", text:"No comparison is possible without specifying which radar reference height is used.", correct:false, risk:"REFERENCE AMBIGUITY WRONG", color:"var(--txt2)", tag:"Land vs Ocean Ze"},
  ],
  correctAnswer:"b",
  explanation:"Satellite radar data establishes the Himalayan foothills as one of the globally most intense storm regions. Land-based intense storm profiles, particularly at terrain-transition zones, have higher radar reflectivity in the upper troposphere compared to oceanic storms because: (1) Larger atmospheric instability (CAPE) available at terrain transitions; (2) Stronger updrafts lofting larger ice particles higher; (3) Terrain acts as both moisture concentrator and forced uplift mechanism. Oceanic profiles are remarkably similar globally (less than 2 units spread) because the physics of warm-ocean convection is similar everywhere. Land and terrain-transition storms diverge strongly.",
  hint:"Ocean storms all look similar — same warm ocean physics everywhere. Himalayan foothill storms are amplified by terrain forcing and extreme instability. The foothills are a global intensity hotspot, much stronger than marine convection in the upper troposphere."
},

{
  id:"m06", day:"3 Sep — 11:00 IST",
  title:"Why Tropical Mixed Rain Types Remain Hard to Classify",
  region:"Tropical Satellite Operations",
  mapType:"geo_diag",
  data:{tb11:236, btd1:-14, deltaBtd:1.1, stormHeight:7.5, rainRate:10.5},
  question:"A machine learning system achieves over 75% overall accuracy classifying precipitation types using 249 satellite and atmospheric model variables. But it specifically struggles with tropical convective and tropical mixed types. You are asked to explain to management why these types are inherently harder — not just a model limitation. What is the fundamental reason?",
  choices:[
    {id:"a", text:"The training dataset is too small for tropical types — more data will completely solve the problem.", correct:false, risk:"DATA SIZE ONLY WRONG", color:"var(--txt3)", tag:"Classification Difficulty"},
    {id:"b", text:"Tropical convective and tropical mixed precipitation types are not sharply distinct in nature — a convective cell actively transitioning into a cloud anvil simultaneously belongs to both categories. Their satellite spectral signatures overlap because the underlying physics overlaps, representing different stages of a continuous process.", correct:true, risk:"INHERENT AMBIGUITY", color:"var(--pur)", tag:"Classification Difficulty"},
    {id:"c", text:"The tropical atmosphere is opaque to all satellite channels — no satellite can distinguish precipitation types in the tropics.", correct:false, risk:"OPAQUE TROPICS WRONG", color:"var(--red)", tag:"Classification Difficulty"},
    {id:"d", text:"The machine learning model chosen does not work for tropical precipitation — a different algorithm would eliminate the problem entirely.", correct:false, risk:"WRONG ALGORITHM WRONG", color:"var(--gold)", tag:"Classification Difficulty"},
  ],
  correctAnswer:"b",
  explanation:"The fundamental challenge is that the categories represent stages of a continuous physical process. A developing tropical convective cell transitions through all three categories during its life cycle — convective, mixed, stratiform. The physical boundaries between them are gradual. Satellite spectral signatures similarly change continuously as the system evolves. Any classification system faces irreducible confusion at these boundaries because the categories themselves are not crisp divisions of nature. More data, better algorithms, or more channels improve accuracy at the margins but cannot eliminate the fundamental overlap.",
  hint:"The categories are ambiguous because nature is ambiguous at these transitions. A cell growing into a mature system passes through all these categories continuously. The satellite sees the same gradual physical change — not a sharp transition."
},

{
  id:"m07", day:"14 Aug — 14:00 IST",
  title:"Bimodal Echo-Top Distribution — Hydrological Implications",
  region:"Western Ghats (15–18N, 73–75E)",
  mapType:"orographic",
  data:{tb11:256, btd1:-10, deltaBtd:-0.4, stormHeight:3.6, rainRate:6.1},
  question:"The Western Ghats echo-top height distribution has a primary peak at 5–6 km and a secondary peak at 3–4 km. All other regional orographic regions show only a single peak near 6–7 km. You present this to a hydrology conference. What is the key hydrological implication of the 3–4 km secondary peak?",
  choices:[
    {id:"a", text:"The 3–4 km secondary peak represents dissipating storm clouds — a sign of decreasing rainfall risk.", correct:false, risk:"DISSIPATING WRONG", color:"var(--txt3)", tag:"ETH Hydrology"},
    {id:"b", text:"The secondary 3–4 km peak is a distinct population of shallow warm-rain clouds unique to the Western Ghats. These contribute significant rainfall that cold-cloud temperature algorithms completely miss — hydrological models ignoring these clouds systematically underestimate western Ghats water budgets and runoff.", correct:true, risk:"WARM RAIN HYDROLOGY CRITICAL", color:"var(--grn)", tag:"ETH Hydrology"},
    {id:"c", text:"The secondary peak at 3–4 km represents the radar melting layer altitude — present everywhere but only appearing in Ghats data due to measurement bias.", correct:false, risk:"BRIGHT BAND WRONG", color:"var(--gold)", tag:"ETH Hydrology"},
    {id:"d", text:"The 3–4 km secondary peak occurs only during break monsoon periods with no rainfall associated.", correct:false, risk:"BREAK PERIOD WRONG", color:"var(--txt2)", tag:"ETH Hydrology"},
  ],
  correctAnswer:"b",
  explanation:"The 3–4 km secondary peak is the direct signature of shallow warm-rain clouds unique to the Western Ghats' orographic environment. These clouds are completely invisible to standard cold-cloud temperature algorithms (which only flag temperatures below 235 K) since their brightness temperatures are warm (above 260 K). Despite being missed by standard algorithms, they contribute substantially to the Ghats' total water budget. Hydrological models calibrated without accounting for warm rain systematically underestimate Western Ghats runoff and river flows, compromising dam management and flood forecasting accuracy.",
  hint:"The secondary peak = shallow warm rain = invisible to cold-cloud algorithms. A significant fraction of Ghats rainfall is in this category. Hydrology ignoring it systematically underestimates real water input to the region."
},

{
  id:"m08", day:"22 Jun — 09:00 IST",
  title:"40% and 20% Radar Reflectivity Coverage Fractions",
  region:"Indian Summer Monsoon",
  mapType:"gpm_radar",
  data:{tb11:233, btd1:-15, deltaBtd:1.2, stormHeight:8.2, rainRate:15.0},
  question:"Satellite radar analysis of Indian monsoon cloud systems shows: more than 40% of the precipitation area within any defined active cloud system exceeds 30 units of radar reflectivity, and more than 20% exceeds 35 units — regardless of system size. A hydrologist asks: does this mean all Indian monsoon cloud systems are uniformly intense? How do you interpret this correctly?",
  choices:[
    {id:"a", text:"Yes — if 40% of area exceeds 30 reflectivity units, all Indian monsoon clouds are producing moderate-to-intense rainfall uniformly.", correct:false, risk:"UNIFORM INTENSITY WRONG", color:"var(--txt3)", tag:"Ze Area Fractions"},
    {id:"b", text:"No — this is a minimum fraction observed within defined ACTIVE precipitating cloud systems (already selected by meeting a high reflectivity criterion). Within these active systems, a substantial fraction of their precipitation area shows moderate-to-strong rain intensities. Quiet days with light drizzle would not appear in this dataset.", correct:true, risk:"CONTEXT MATTERS", color:"var(--ac)", tag:"Ze Area Fractions"},
    {id:"c", text:"The 40% figure means 60% of clouds are non-precipitating. Monitor only the 40% for flood warnings.", correct:false, risk:"NON-PRECIP WRONG", color:"var(--gold)", tag:"Ze Area Fractions"},
    {id:"d", text:"30 reflectivity units corresponds to light drizzle only — 40% coverage at this level means minimal flood risk.", correct:false, risk:"30 dBZ LIGHT WRONG", color:"var(--txt2)", tag:"Ze Area Fractions"},
  ],
  correctAnswer:"b",
  explanation:"The 40%/20% coverage statistics apply to cloud systems that already meet a minimum criterion ensuring only active precipitating systems are included. Within these active systems, more than 40% of precipitation area shows moderate-to-strong rain intensity. This demonstrates that when Indian monsoon cloud systems are active, most of their area is doing meaningful rainfall work — not just a few intense pixels surrounded by weak drizzle. For operational use: when a cloud system qualifies as active, expect most of its area to produce at least moderate rainfall.",
  hint:"These statistics apply to ACTIVE PRECIPITATING CLOUD SYSTEMS already selected by a high reflectivity criterion. Within these active systems, the 40% and 20% figures tell you that once a system is active, most of its area is genuinely raining at moderate-to-strong rates."
},

{
  id:"m09", day:"5 Aug — 16:00 IST",
  title:"Multi-Scale Spatial Pooling for Convection Detection",
  region:"AI Satellite Operations",
  mapType:"convective_burst",
  data:{tb11:215, btd1:-25, deltaBtd:3.4, stormHeight:13.4, rainRate:45.0},
  question:"An AI storm detection system uses parallel convolutions with different dilation rates (sampling every 1, 6, 12, or 18 pixels) to extract features simultaneously at multiple spatial scales. Why are DIFFERENT dilation rates needed rather than using a single fixed rate?",
  choices:[
    {id:"a", text:"Different dilation rates reduce computation time by distributing work across parallel processors — it is a hardware optimisation.", correct:false, risk:"SPEED ONLY WRONG", color:"var(--txt3)", tag:"Multi-Scale Detection"},
    {id:"b", text:"Convective clouds appear at multiple spatial scales simultaneously — isolated cells are 5–20 km wide while large organised systems span hundreds of km. Different dilation rates capture features at different spatial scales. ASPP simultaneously captures all scales, essential for detecting both isolated cells and large organised systems.", correct:true, risk:"MULTI-SCALE DETECTION", color:"var(--ac)", tag:"Multi-Scale Detection"},
    {id:"c", text:"A single dilation rate is sufficient for all spatial scales of convection. Multiple rates provide only redundant information.", correct:false, risk:"SINGLE RATE WRONG", color:"var(--gold)", tag:"Multi-Scale Detection"},
    {id:"d", text:"Dilation rates correspond to different atmospheric pressure levels — rate 1 detects surface convection while rate 18 detects upper-tropospheric convection.", correct:false, risk:"PRESSURE LEVELS WRONG", color:"var(--txt2)", tag:"Multi-Scale Detection"},
  ],
  correctAnswer:"b",
  explanation:"Dilated convolution with dilation rate r samples input features r pixels apart instead of adjacent pixels, effectively increasing the spatial field of view without increasing the number of parameters. Rate 1 = local patterns at 5 km scale. Rate 6 = patterns at 30 km scale. Rate 12 = 60 km scale. Rate 18 = 90+ km scale. Convective systems occur at ALL these scales simultaneously — individual cells at 5–20 km, clusters at 50–100 km, large systems at 200–500 km. Parallel multi-rate architecture captures spatial context at all meteorologically relevant scales simultaneously, enabling detection of both small isolated cells and large organised convective systems.",
  hint:"Different dilation rates = different spatial scales captured in one operation. Convection occurs at scales from individual cells (5 km) to large systems (500 km). You need all scales captured simultaneously to detect both types."
},

{
  id:"m10", day:"17 Sep — 12:00 IST",
  title:"Setting a Flash Flood Warning Threshold from the Moisture-Rain Relationship",
  region:"Mountain Monsoon Regions",
  mapType:"conv_vs_strat",
  data:{tb11:231, btd1:-13, deltaBtd:1.7, stormHeight:8.3, convFrac:0.20, stratFrac:0.80, rainRate:11.6},
  question:"GPM data shows rain rate R increases approximately as the square of total column water vapour (TCWV). Historical data: TCWV=30 → R≈4 mm/hr; TCWV=45 → R≈9 mm/hr; TCWV=60 → R≈16 mm/hr. Your flash flood threshold is R > 15 mm/hr. Approximately what TCWV value should trigger your pre-warning?",
  choices:[
    {id:"a", text:"TCWV > 45 kg/m² — since 45 gives about 9 mm/hr which is already significant.", correct:false, risk:"TOO LOW THRESHOLD", color:"var(--txt3)", tag:"TCWV Threshold"},
    {id:"b", text:"TCWV > 58–62 kg/m² — based on the quadratic scaling, R ≈ 15–16 mm/hr corresponds to TCWV near 60 kg/m². Pre-warning at 58 kg/m² gives lead time before the flash flood threshold is crossed.", correct:true, risk:"OPERATIONAL THRESHOLD", color:"var(--ac)", tag:"TCWV Threshold"},
    {id:"c", text:"TCWV > 80 kg/m² — to be conservative and avoid false alarms, only act at very high moisture levels.", correct:false, risk:"TOO HIGH THRESHOLD", color:"var(--gold)", tag:"TCWV Threshold"},
    {id:"d", text:"TCWV thresholds cannot be used for flash flood warnings — only real-time rain gauge data is operationally valid.", correct:false, risk:"GAUGE ONLY WRONG", color:"var(--txt2)", tag:"TCWV Threshold"},
  ],
  correctAnswer:"b",
  explanation:"The data points (30→4, 45→9, 60→16) fit R ≈ k × TCWV². Using (30,4): k ≈ 4/900 ≈ 0.0044. Check (45,9): 0.0044×2025 ≈ 8.9 ≈ 9 ✓. Check (60,16): 0.0044×3600 ≈ 16 ✓. For R=15 mm/hr threshold: TCWV ≈ √(15/0.0044) ≈ √3409 ≈ 58 kg/m². Pre-warning at TCWV = 58 kg/m² (just below the 60 at which 16 mm/hr occurs) provides lead time. TCWV-based warnings can anticipate flash flood conditions from atmospheric moisture data available hours before rainfall begins — a valuable operational advantage.",
  hint:"R ∝ TCWV². If TCWV=60 gives R≈16 mm/hr (above your threshold), you need TCWV just below 60 for the pre-warning. Calculate: if k is fixed and 60 gives 16, what TCWV gives 15?"
},

{
  id:"m11", day:"4 Jul — 11:00 IST",
  title:"Why 30 Reflectivity Units — Not the Minimum Detectable Signal",
  region:"Western Ghats Orographic Studies",
  mapType:"orographic",
  data:{tb11:263, btd1:-9, deltaBtd:-0.5, stormHeight:2.9, rainRate:4.2},
  question:"A study defining orographic cloud types uses 30 radar reflectivity units at 1.5 km altitude as the minimum for any cloud to be included. A colleague argues the satellite radar's sensitivity floor (which is approximately 17 units) should be used instead to capture all precipitation. What is wrong with the 17-unit approach for this study?",
  choices:[
    {id:"a", text:"17 units is too high a threshold — it would miss many light precipitation events. The study should use 0 units to capture all cloud water.", correct:false, risk:"0 UNITS WRONG", color:"var(--txt3)", tag:"Ze Threshold Choice"},
    {id:"b", text:"Using 17 units would include very light drizzle and residual cloud echoes not meaningfully precipitating at the surface. The 30-unit threshold corresponds to approximately 1 mm/hr rain rate — ensuring only clouds delivering usable precipitation to the watershed are studied.", correct:true, risk:"30 UNITS CORRECT", color:"var(--grn)", tag:"Ze Threshold Choice"},
    {id:"c", text:"17 units is too high — the satellite cannot detect echoes below 17 units, so there is no reason not to use this as the threshold for everything.", correct:false, risk:"SENSITIVITY FLOOR CONFUSION", color:"var(--gold)", tag:"Ze Threshold Choice"},
    {id:"d", text:"Both 17 and 30 units give identical results for western Ghats clouds — all clouds there exceed 40 units anyway.", correct:false, risk:"IDENTICAL WRONG", color:"var(--txt2)", tag:"Ze Threshold Choice"},
  ],
  correctAnswer:"b",
  explanation:"The satellite radar's sensitivity floor of approximately 17 units is the MINIMUM DETECTABLE signal — anything below is invisible. Above 17 units, echoes exist, but 17–30 units corresponds to very light drizzle under 1 mm/hr that may not generate meaningful surface runoff. The study investigates orographically-relevant precipitation — rain that actually affects watershed hydrology. The 30-unit threshold ensures only active rain-producing clouds are included. Using 17 units would include marginal echoes that inflate cloud counts without contributing to hydrologically significant precipitation.",
  hint:"17 units = minimum the instrument can detect = includes very light drizzle and noise. 30 units = meaningful rain rate of about 1 mm/hr. The study wants hydrologically significant precipitation, not all detectable echoes."
},

{
  id:"m12", day:"13 Aug — 16:00 IST",
  title:"North vs South Bay of Bengal — Two Distinct Weather Regimes",
  region:"Bay of Bengal (North vs South)",
  mapType:"active_monsoon",
  data:{tb11:229, btd1:-16, deltaBtd:1.3, stormHeight:9.2, rainRate:16.4},
  question:"A monsoon analysis study defines separate weather zones for the northern Bay of Bengal (head of the bay) and southern Bay of Bengal rather than treating the entire bay as one zone. During the southwest monsoon, why must these be treated as distinct zones?",
  choices:[
    {id:"a", text:"The two zones have different sea surface temperatures — northern bay is always 2°C warmer than southern bay.", correct:false, risk:"SST ONLY WRONG", color:"var(--txt3)", tag:"BOB Zones"},
    {id:"b", text:"The head of the bay is the primary formation zone for monsoon low-pressure systems that track westward bringing heavy rain to Odisha and central India. The southern bay has a different seasonal rainfall cycle and different storm occurrence pattern — treating them as one zone would merge fundamentally different weather regimes into misleading statistics.", correct:true, risk:"DISTINCT REGIMES", color:"var(--ac)", tag:"BOB Zones"},
    {id:"c", text:"Both bay zones should be merged — there is no meteorological difference between northern and southern bay during the monsoon.", correct:false, risk:"MERGE WRONG", color:"var(--gold)", tag:"BOB Zones"},
    {id:"d", text:"The zones are defined by satellite orbital paths — the orbit boundary dictates the zone boundary, not meteorological reasoning.", correct:false, risk:"ORBITAL WRONG", color:"var(--txt2)", tag:"BOB Zones"},
  ],
  correctAnswer:"b",
  explanation:"The Bay of Bengal is explicitly split into two zones because they exhibit different seasonal rainfall cycles and different low-pressure system occurrence patterns. The northern bay (head of the bay) is where monsoon depressions and low pressure systems form and from where they track westward into the Indian subcontinent — delivering the core monsoon rainfall to east-central India. During the southwest monsoon, the northern bay is a primary synoptic action centre. The southern bay has different wind patterns, different storm organisation, and different cyclone risk timing. Merging them would produce misleading composite statistics.",
  hint:"Northern bay = monsoon depression formation zone. Southern bay = different rainfall regime and storm timing. Same ocean, but operated by different weather systems at different times of year."
},

{
  id:"m13", day:"28 Jul — 09:00 IST",
  title:"Wien's Law — Peak Emission Wavelength Difference Between Storm Top and Ocean",
  region:"Tropical Deep Convection",
  mapType:"shallow_warm",
  data:{tb11:282, btd1:-28, deltaBtd:-1.8, stormHeight:1.5, rainRate:0.8},
  question:"A deep convective cloud top has brightness temperature = 208 K. The ocean surface is 302 K. Wien's displacement law states peak emission wavelength = 2898 divided by temperature in Kelvin. What is the difference in peak emission wavelength between the storm top and the ocean surface, and what does this mean for infrared channel design?",
  choices:[
    {id:"a", text:"Storm top peak wavelength = 2898/208 ≈ 13.9 μm. Ocean peak = 2898/302 ≈ 9.6 μm. Difference ≈ 4.3 μm. Channels in the 9–14 μm window sample both temperatures but at different positions on their Planck emission curves — requiring careful multi-channel design to capture both temperature regimes.", correct:true, risk:"CHANNEL DESIGN INSIGHT", color:"var(--ac)", tag:"Wien's Law Application"},
    {id:"b", text:"Both emit at identical wavelengths — Wien's law only applies to perfect blackbodies, not to clouds or ocean surfaces.", correct:false, risk:"BLACKBODY ONLY WRONG", color:"var(--txt3)", tag:"Wien's Law Application"},
    {id:"c", text:"The wavelength difference is irrelevant because modern satellite sensors have broad spectral response that eliminates Wien's law effects.", correct:false, risk:"IRRELEVANT WRONG", color:"var(--gold)", tag:"Wien's Law Application"},
    {id:"d", text:"The 13.9 μm channel should be used exclusively for storm top detection and the 9.6 μm channel for ocean SST — no overlap needed between the two temperature regimes.", correct:false, risk:"EXCLUSIVE CHANNELS WRONG", color:"var(--txt2)", tag:"Wien's Law Application"},
  ],
  correctAnswer:"a",
  explanation:"Calculating: Storm top (208 K): peak wavelength = 2898/208 = 13.94 μm. Ocean surface (302 K): peak wavelength = 2898/302 = 9.60 μm. Difference = 13.94 − 9.60 = 4.34 μm. This 4+ μm shift in peak emission wavelength is significant for instrument design. The 11.2 μm channel sits between both peaks and is sensitive to both temperature ranges. The 12.4 μm channel is closer to the cold storm-top peak. Channels at 8.5–9 μm are closer to the warm surface peak. These spectral differences explain why different infrared channels provide complementary information about clouds at different temperatures.",
  hint:"Calculate peak wavelength for each temperature: divide 2898 by the temperature in Kelvin. The ~4 μm difference means different infrared channels within the window sample different temperature scenes at different positions on their emission curves."
},

{
  id:"m14", day:"3 Oct — 14:00 IST",
  title:"Maximum Signal Profile vs High-Intensity Core Profile — Dam Forecasting",
  region:"Indian Monsoon Regions",
  mapType:"gpm_radar",
  data:{tb11:230, btd1:-17, deltaBtd:1.4, stormHeight:9.5, rainRate:18.5},
  question:"A flood forecasting centre asks: for an approaching monsoon low-pressure system, which radar profile product is more useful for estimating PEAK FLOOD-CAUSING RAIN INTENSITY, and which gives better information about the system's SPATIAL ORGANISATION — the profile selecting the maximum signal at each altitude across all cells, or the profile selecting only pixels with very high signal (above 40 reflectivity units)?",
  choices:[
    {id:"a", text:"The maximum-signal profile is always better for both purposes — it captures maximum intensity at each level and the full spatial extent simultaneously.", correct:false, risk:"MAX ONLY WRONG", color:"var(--txt3)", tag:"Profile Products"},
    {id:"b", text:"The high-intensity core profile (above 40 units) better identifies peak rain intensity — it isolates active intense precipitation cores directly linked to the highest surface rain rates. The maximum-signal profile better characterises the system's overall peak capability and spatial extent.", correct:true, risk:"BOTH PROFILES NEEDED", color:"var(--ac)", tag:"Profile Products"},
    {id:"c", text:"The high-intensity core profile is always more useful for all operational purposes.", correct:false, risk:"HIGH INTENSITY ALWAYS WRONG", color:"var(--gold)", tag:"Profile Products"},
    {id:"d", text:"Both profiles show identical information for any given system.", correct:false, risk:"IDENTICAL WRONG", color:"var(--txt2)", tag:"Profile Products"},
  ],
  correctAnswer:"b",
  explanation:"The maximum-signal profile selects the peak radar signal at EACH altitude level across all cloud cells in a single satellite overpass — it represents the maximum possible intensity the system has achieved at any location for each height level. Useful for characterising overall system peak capability and spatial distribution. The high-intensity core profile (selecting pixels above 40 reflectivity units specifically) isolates the active intense precipitation locations and their vertical extent — directly relevant to which river subcatchments are receiving intense input now. For dam forecasting: the high-intensity core profile locates current intense rain; the maximum-signal profile shows the system's overall potential.",
  hint:"Maximum-signal profile = best signal anywhere = overall system capability. High-intensity core profile = only the most intense active cores = where flash flooding is happening right now. Both questions need to be answered for dam management."
},

{
  id:"m15", day:"17 Aug — 11:00 IST",
  title:"Same Two Channels — Two Different Detection Uses",
  region:"India (INSAT Operational Forecasting)",
  mapType:"kalpana",
  data:{tb11:253, btd1:-18, deltaBtd:0.9, stormHeight:6.2, rainRate:9.0},
  question:"Two pixels: Pixel A: thermal channel = 228 K, water vapour channel = 210 K → difference = 18 K. Pixel B: thermal = 228 K, water vapour = 227 K → difference = 1 K. Both have the same cold thermal temperature. Which is more likely to be a deep convective rain cloud, and why does the channel difference matter despite identical thermal temperatures?",
  choices:[
    {id:"a", text:"Both are equally likely — they have identical thermal temperatures so all other information is irrelevant.", correct:false, risk:"THERMAL ONLY WRONG", color:"var(--txt3)", tag:"Channel Difference Physics"},
    {id:"b", text:"Pixel A (difference = 18 K) is more likely deep convective rain. The large gap between the cold cloud top seen by the thermal channel and the warmer water vapour reading indicates a real cold convective cloud top distinct from surrounding moisture. Pixel B (difference = 1 K) looks like thin cirrus — both channels see nearly the same temperature, suggesting a thin transparent cloud rather than a solid deep cloud.", correct:true, risk:"PIXEL A = DEEP CONVECTION", color:"var(--ac)", tag:"Channel Difference Physics"},
    {id:"c", text:"Pixel B (difference = 1 K) is deep convection — when both channels see the same temperature, both are seeing the same deep cloud top, confirming a solid tall cloud.", correct:false, risk:"REVERSED WRONG", color:"var(--red)", tag:"Channel Difference Physics"},
    {id:"d", text:"Neither pixel is precipitating — 228 K is not cold enough to classify either as deep convective.", correct:false, risk:"228K NOT COLD WRONG", color:"var(--gold)", tag:"Channel Difference Physics"},
  ],
  correctAnswer:"b",
  explanation:"The water vapour channel (around 6.2 μm) senses upper-tropospheric moisture at around 400–600 hPa. For a deep convective cloud overshooting to 10+ km, the thermal channel sees the very cold cloud top (228 K) while the water vapour channel still sees moisture at lower altitudes below the cloud top (210 K — still cold but warmer than the cloud top). The resulting large difference (18 K) signals that a real solid cold cloud top exists, distinct from the ambient upper troposphere. Pixel B's difference of 1 K means both channels see nearly the same temperature — characteristic of thin cirrus that is partially transparent, not a real deep solid cloud.",
  hint:"Large channel difference = big gap between what thermal sees (cold cloud top) and what water vapour sees (warmer moisture below) = real deep cloud. Small difference = both channels see the same level = transparent thin cirrus = no real rain."
},

{
  id:"m16", day:"5 Sep — 09:00 IST",
  title:"Why 10-Minute Collocation Window — Not 60 Minutes",
  region:"India Satellite-Radar Validation",
  mapType:"kalpana",
  data:{tb11:251, btd1:-17, deltaBtd:0.8, stormHeight:6.6, rainRate:9.3},
  question:"Satellite validation studies match geostationary satellite images (15-minute frequency) with satellite radar swath data (instantaneous, 1–2 passes per day) using a maximum 10-minute time difference for matching. What happens to validation statistics if you relax this to a 60-minute maximum?",
  choices:[
    {id:"a", text:"Validation becomes more accurate with a 60-minute window because you collect more matched data points, reducing sampling noise.", correct:false, risk:"MORE DATA = BETTER WRONG", color:"var(--txt3)", tag:"Collocation Window"},
    {id:"b", text:"Relaxing to 60 minutes introduces location mismatch errors — monsoon cloud systems move 20–40 km in 60 minutes. A satellite image from 60 minutes ago shows different cloud structure at any given location than the radar now. This creates both false matches and missed matches, systematically degrading all validation statistics.", correct:true, risk:"TEMPORAL MISMATCH", color:"var(--ac)", tag:"Collocation Window"},
    {id:"c", text:"No change — monsoon clouds are stationary and do not move within a 60-minute window.", correct:false, risk:"STATIONARY WRONG", color:"var(--gold)", tag:"Collocation Window"},
    {id:"d", text:"A 60-minute window is standard practice — the 10-minute requirement is unnecessarily strict for any operational application.", correct:false, risk:"60 MIN STANDARD WRONG", color:"var(--txt2)", tag:"Collocation Window"},
  ],
  correctAnswer:"b",
  explanation:"Monsoon cloud systems move at 20–40 km/hr during active conditions. In 60 minutes, a system moves 20–40 km — equivalent to 2–5 pixels at typical geostationary satellite resolution. Pairing a 60-minute-old satellite image with an instantaneous radar scan creates systematic mismatches: satellite shows cloud at the storm's OLD position while radar shows clear sky there NOW, and satellite shows clear sky where the storm IS NOW while radar shows rain there. Both types of mismatch degrade detection statistics, false alarm rates, and skill scores artificially. The 10-minute window limits mismatch to approximately 3–7 km — within one pixel, acceptable for validation purposes.",
  hint:"Storms move. After 60 minutes, the storm has shifted 20–40 km. The old satellite image shows the storm at its previous position. The radar sees it at its current position. You are comparing two different spatial locations, not the same weather."
},

{
  id:"m17", day:"20 Sep — 15:00 IST",
  title:"Vertical Wind Divergence Pattern — Active vs Suppressed Precipitation",
  region:"Mountain Precipitation Regions",
  mapType:"conv_vs_strat",
  data:{tb11:233, btd1:-13, deltaBtd:1.6, stormHeight:8.0, convFrac:0.20, stratFrac:0.80, rainRate:11.0},
  question:"Atmospheric model data shows: main rainfall zone has inward wind convergence at low levels (850 hPa) and outward wind divergence at high levels (200 hPa). A separate Region X shows the opposite — outward divergence at low levels and inward convergence at high levels. Which zone has active precipitation development and what does Region X's pattern indicate?",
  choices:[
    {id:"a", text:"Region X (divergence below, convergence above) is developing active precipitation. Low-level divergence feeds moisture into the storm base.", correct:false, risk:"REVERSED WRONG", color:"var(--txt3)", tag:"Divergence Pattern"},
    {id:"b", text:"The main zone (convergence below, divergence above) has active precipitation — low-level convergence feeds the updraft base; upper-level divergence removes air from the cloud top, sustaining the circulation. Region X's pattern (divergence below, convergence above) indicates subsidence — a downdraft that suppresses precipitation.", correct:true, risk:"CORRECT CIRCULATION", color:"var(--ac)", tag:"Divergence Pattern"},
    {id:"c", text:"Both zones equally support precipitation — divergence pattern has no relationship to whether precipitation develops.", correct:false, risk:"NO RELATIONSHIP WRONG", color:"var(--gold)", tag:"Divergence Pattern"},
    {id:"d", text:"Region X develops more intense precipitation because upper convergence concentrates moisture at the top of clouds.", correct:false, risk:"TOP CONVERGENCE WRONG", color:"var(--txt2)", tag:"Divergence Pattern"},
  ],
  correctAnswer:"b",
  explanation:"Active deep convection requires a specific vertical divergence profile: low-level convergence (mass inflow) feeds the updraft base with moist air, forcing air upward. Upper-level divergence (mass outflow) removes air from the cloud anvil top, preventing the column from filling up and maintaining the updraft circulation. This is the classic circulation pattern for organised deep convection. Region X shows the opposite: low-level divergence means air is flowing outward at the surface — no mass input for updrafts — and upper-level convergence means air is piling up at the top, further suppressing upward motion. Region X is under subsiding, cloud-suppressing conditions.",
  hint:"For a storm: air flows IN at the bottom (convergence) and OUT at the top (divergence). This creates and sustains the updraft. The opposite — divergence below, convergence above — creates a downdraft that kills any developing storm."
},

{
  id:"m18", day:"11 Jul — 10:00 IST",
  title:"Regional Calibration — Why Tropical Algorithm Fails in Subtropics",
  region:"Multiple Latitude Bands",
  mapType:"btd_challenge",
  data:{tb11:226, btd1:-16, deltaBtd:2.0, stormHeight:9.4, rainRate:20.0},
  question:"Satellite rain rate estimation algorithms calibrated over the tropics (0–15°N) are applied over the subtropics (15–30°N) and show systematic underestimation of subtropical monsoon rainfall. The brightness temperature–rain rate relationship differs for the same cloud type between latitude bands. What is the physical reason?",
  choices:[
    {id:"a", text:"Satellites observe at different viewing angles at different latitudes — geometric distortion creates artificial differences.", correct:false, risk:"VIEWING ANGLE ONLY WRONG", color:"var(--txt3)", tag:"Regional Calibration"},
    {id:"b", text:"The same cloud type has different brightness temperature–rain rate relationships at different latitudes because: the freezing level height varies with latitude (higher in tropics, lower in subtropics); atmospheric humidity profiles differ; lapse rates differ. All these modify how efficiently a given cloud type converts its water content into surface rain.", correct:true, risk:"LATITUDE CALIBRATION NEEDED", color:"var(--ac)", tag:"Regional Calibration"},
    {id:"c", text:"The brightness temperature–rain rate relationship is identical at all latitudes — no regional calibration is ever needed.", correct:false, risk:"NO CALIBRATION WRONG", color:"var(--gold)", tag:"Regional Calibration"},
    {id:"d", text:"Latitude differences only matter for the land versus ocean distinction, not for within-latitude regional variations.", correct:false, risk:"LAND OCEAN ONLY WRONG", color:"var(--txt2)", tag:"Regional Calibration"},
  ],
  correctAnswer:"b",
  explanation:"The same cloud type shows different brightness temperature–rain rate relationships at different latitudes because: (1) Freezing level height varies — tropics approximately 5 km, subtropics approximately 4 km, mid-latitudes approximately 3 km. A cloud with brightness temperature = 225 K sits at a different absolute altitude at different latitudes, experiencing different microphysical environments. (2) Atmospheric humidity profiles differ — subtropical monsoon air is drier aloft than tropical air, affecting precipitation efficiency. (3) Lapse rates differ between latitudes. All these modify how much rain a given cloud type produces for the same observed satellite temperature. Separate regional calibration by latitude band is necessary.",
  hint:"Same cloud type, different latitude = different atmospheric context = different rain rate for the same brightness temperature. The freezing level is at a different height, the humidity profile is different, the temperature profile is different."
},

{
  id:"m19", day:"29 Aug — 14:00 IST",
  title:"Below-Freezing-Level Radar Variability — Liquid Microphysics",
  region:"Indian Monsoon Regions",
  mapType:"gpm_radar",
  data:{tb11:228, btd1:-17, deltaBtd:1.5, stormHeight:9.8, rainRate:22.0},
  question:"Satellite radar data shows larger regional differences in radar reflectivity below the freezing level (~5 km) than above it, across different Indian monsoon regions. A colleague argues this is because different regions have different amounts of cloud. What is the more physically complete explanation?",
  choices:[
    {id:"a", text:"The difference is purely due to different cloud amounts — more clouds means higher reflectivity everywhere below the freezing level.", correct:false, risk:"CLOUD AMOUNT ONLY WRONG", color:"var(--txt3)", tag:"Below Freezing Level Ze"},
    {id:"b", text:"Below the freezing level, precipitation is liquid. Radar reflectivity is governed by raindrop size distributions which depend on local humidity (evaporation causes smaller drops in dry sub-cloud layers), local rain intensity history, and collision-coalescence growth. These liquid-phase microphysical processes vary significantly between humid coastal and dry interior monsoon regions.", correct:true, risk:"LIQUID MICROPHYSICS", color:"var(--ac)", tag:"Below Freezing Level Ze"},
    {id:"c", text:"Radar reflectivity below the freezing level is constant and uniform across all regions — microphysical processes have no effect at low altitudes.", correct:false, risk:"CONSTANT WRONG", color:"var(--gold)", tag:"Below Freezing Level Ze"},
    {id:"d", text:"The difference below the freezing level is entirely a radar calibration artefact.", correct:false, risk:"CALIBRATION WRONG", color:"var(--txt2)", tag:"Below Freezing Level Ze"},
  ],
  correctAnswer:"b",
  explanation:"Above the freezing level, ice-phase microphysics is relatively similar across regions for equivalent cloud types. Below the freezing level, liquid-phase microphysics introduces strong regional variability: (1) Evaporation: in drier sub-cloud layers over Rajasthan and northwest India, large raindrops partially evaporate before reaching the surface, reducing radar reflectivity and surface rain rate. (2) In humid coastal environments, drops continue growing through collision-coalescence below the melting layer, increasing reflectivity. (3) Regional humidity profiles control how much evaporation occurs between the melting level and the surface. These processes create the observed regional diversity in below-freezing-level profiles.",
  hint:"Above freezing = ice physics = similar everywhere for same cloud type. Below freezing = liquid rain physics = strongly dependent on local humidity and evaporation. Dry sub-cloud layers cause heavy drop evaporation and reduced signal. Humid layers preserve drops all the way to the surface."
},

{
  id:"m20", day:"15 Oct — 16:00 IST",
  title:"Same Channel Pair — Two Different Uses in Two Different Systems",
  region:"Operational Satellite Meteorology",
  mapType:"geo_diag",
  data:{tb11:244, btd1:-19, deltaBtd:1.0, stormHeight:6.8, rainRate:10.0},
  question:"System A uses the difference (6.2 μm minus 11.2 μm) to CLASSIFY whether a cloud is shallow or deep. System B uses the reverse difference (11.2 μm minus 6.2 μm) as a RAIN DETECTION index, triggering a warning when this value exceeds 19 K. A new analyst is confused — both systems use the same two channels but give opposite-signed values for different purposes. Explain the unified physical logic.",
  choices:[
    {id:"a", text:"The two systems are contradictory — you cannot use the same channel pair for both classification and rain detection. One system must be wrong.", correct:false, risk:"CONTRADICTORY WRONG", color:"var(--txt3)", tag:"Cross-System BTD"},
    {id:"b", text:"Both systems exploit the SAME physical reality from two different perspectives: the 6.2 μm water vapour and 11.2 μm thermal channels respond differently to clouds and moisture. System A: large negative difference means liquid water shallow cloud or near-zero for thick deep cloud. System B: large positive difference (11.2 minus 6.2 greater than 19 K) means the cold cloud top stands out from the warmer moisture layer below — confirming deep convective overshoot. Same physics, same channels, two different operational questions.", correct:true, risk:"UNIFIED PHYSICS", color:"var(--ac)", tag:"Cross-System BTD"},
    {id:"c", text:"System A uses the 6.2 μm channel and System B uses the 11.2 μm channel — they actually use completely different channels with no physical connection.", correct:false, risk:"DIFFERENT CHANNELS WRONG", color:"var(--gold)", tag:"Cross-System BTD"},
    {id:"d", text:"The sign convention difference means System A measures liquid-phase clouds and System B measures ice-phase clouds — completely separate phenomena.", correct:false, risk:"PHASE ONLY WRONG", color:"var(--txt2)", tag:"Cross-System BTD"},
  ],
  correctAnswer:"b",
  explanation:"The unified physical logic: the 6.2 μm water vapour channel and 11.2 μm thermal window channel sample different atmospheric levels. Their difference captures cloud phase (ice vs water), cloud optical thickness (thick opaque cloud collapses the difference to near zero), and depth of cloud top relative to ambient moisture (deep overshooting cloud top appears colder in thermal than water vapour channel — large positive thermal minus WV difference). System A exploits cloud phase and thickness information to classify cloud type. System B exploits the cloud top depth information to detect deep convection. Same channel pair, same physical measurements — answering two different classification questions for two different operational purposes.",
  hint:"Both systems use the same 6.2 μm and 11.2 μm channels because these two channels together reveal cloud phase, thickness, AND depth relative to ambient moisture — three aspects of cloud physics encoded in one measurement pair. Classification and detection each need different aspects of this shared information."
},

], // end master

}; // end DB

if (typeof module !== 'undefined') module.exports = DB;