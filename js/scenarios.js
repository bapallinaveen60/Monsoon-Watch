// ============================================================
// MONSOON WATCH V2 — Professional Scenario and Station Database
// ============================================================

export const STATIONS = {
  delhi: {
    id: "delhi",
    name: "New Delhi (DEL)",
    unlockedAt: 0,
    coord: [28.6139, 77.2090],
    climate: "Composite climate. Susceptible to dry convective dust storms (Andhi), pre-monsoon squall lines, and winter fog.",
    monsoon: "Monsoon onset around June 27–30. Rains are driven by monsoon depressions migrating from the Bay of Bengal, interacting with westerly troughs.",
    history: "Urban flooding events (e.g., July 2023) when the Yamuna River breached warning levels due to 150+ mm sustained rainfall upstream."
  },
  mumbai: {
    id: "mumbai",
    name: "Mumbai (BOM)",
    unlockedAt: 0,
    coord: [19.0760, 72.8777],
    climate: "Tropical wet climate. Subject to intense orographic enhancement along the Western Ghats and offshore convective troughs.",
    monsoon: "Onset in early June. Features continuous, heavy rainfall bursts triggered by low-level jet streams and offshore vortices.",
    history: "July 26, 2005 disaster when 944 mm of rain fell in 24 hours, completely paralysing the city's infrastructure."
  },
  srinagar: {
    id: "srinagar",
    name: "Srinagar (SXR)",
    unlockedAt: 300,
    coord: [34.0837, 74.7973],
    climate: "Subtropical highland climate. Dominated by Western Disturbances bringing snow in winter and moderate rainfall in summer.",
    monsoon: "Lies at the extreme limit of the monsoon. Rainfall is typically light, but moisture intrusion can trigger catastrophic cloudbursts.",
    history: "Srinagar floods of September 2014, where continuous rainfall from a merged monsoon-westerly system caused Jhelum river breaches."
  },
  guwahati: {
    id: "guwahati",
    name: "Guwahati (GAU)",
    unlockedAt: 700,
    coord: [26.1445, 91.7362],
    climate: "Humid subtropical. Heavy moisture loading due to funnelling between the Himalayas and the Shillong plateau.",
    monsoon: "Heavy pre-monsoon convective bursts starting in April. Monsoon rainfall is sustained and highly active, causing Brahmaputra river overflow.",
    history: "Annual river floods and urban landslides. Sustained stratiform rain with embedded convective cells is common."
  },
  kolkata: {
    id: "kolkata",
    name: "Kolkata (CCU)",
    unlockedAt: 1200,
    coord: [22.5726, 88.3639],
    climate: "Tropical wet-and-dry. Extremely vulnerable to storm surges, tidal waves, and severe cyclonic storms.",
    monsoon: "Heavy rainfall from Bay of Bengal depressions. Nor'westers (Kalbaishakhi) bring extreme severe convective storms in spring.",
    history: "Super Cyclone Amphan (May 2020) causing category-3 equivalent winds and devastating water accumulation."
  },
  visakhapatnam: {
    id: "visakhapatnam",
    name: "Visakhapatnam (VTZ)",
    unlockedAt: 1800,
    coord: [17.6868, 83.2185],
    climate: "Tropical wet-and-dry. Coastline is highly vulnerable to post-monsoon tropical cyclones.",
    monsoon: "Receives moderate rainfall during southwest monsoon. Heavy rainfall during northeast monsoon retreat and cyclonic landfalls.",
    history: "Cyclone Hudhud (October 2014) made landfall directly over the city, generating winds of 185 km/h."
  },
  chennai: {
    id: "chennai",
    name: "Chennai (MAA)",
    unlockedAt: 2500,
    coord: [13.0827, 80.2707],
    climate: "Tropical wet-and-dry. Unique seasonal cycle where rainfall peaks during the winter monsoon (Northeast monsoon).",
    monsoon: "Southwest monsoon is dry (rain shadow). Northeast monsoon (Oct-Dec) brings 60% of annual rainfall via easterly waves and cyclones.",
    history: "November-December 2015 floods where a persistent low-pressure system dumped over 1000 mm in a month."
  },
  hyderabad: {
    id: "hyderabad",
    name: "Hyderabad (HYD)",
    unlockedAt: 3200,
    coord: [17.3850, 78.4867],
    climate: "Semi-arid climate. Situated on the Deccan plateau, rainfall is generally moderate and patchy.",
    monsoon: "Southwest monsoon brings steady rain. Peak activity occurs during localized convective thunder squalls.",
    history: "October 2020 flash floods, where a deep depression brought 192 mm of rain in 24 hours, overflowing Musi River drains."
  },
  bengaluru: {
    id: "bengaluru",
    name: "Bengaluru (BLR)",
    unlockedAt: 4000,
    coord: [12.9716, 77.5946],
    climate: "Tropical savanna climate. Moderate temperatures due to high altitude (920m).",
    monsoon: "Receives rainfall from both southwest and northeast monsoons. Dominated by evening convective storm cells.",
    history: "September 2022 urban floods, where high-intensity convective bursts overwhelmed lake systems in tech-corridors."
  },
  ahmedabad: {
    id: "ahmedabad",
    name: "Ahmedabad (AMD)",
    unlockedAt: 5000,
    coord: [23.0225, 72.5714],
    climate: "Hot semi-arid. High ambient temperatures before monsoon arrival.",
    monsoon: "Short monsoon season (July-September). Very erratic rainfall pattern, susceptible to dry spells or sudden extreme deluges.",
    history: "July 2017 floods when active monsoon conditions caused Sabarmati River flooding and submerged low-lying areas."
  }
};

export const HISTORICAL_MISSIONS = [
  {
    id: "m_fani",
    name: "Cyclone Fani (May 2019)",
    desc: "Track the rapid intensification of Cyclone Fani as it moves north-northwest through the Bay of Bengal toward Odisha coast.",
    difficulty: "Advanced",
    steps: [
      {
        id: "b06",
        station: "visakhapatnam",
        day: "30 Apr 2019 — 10:00 IST",
        title: "Cyclone Fani offshore tracking",
        region: "Bay of Bengal (14.2N, 86.5E)",
        mapType: "btd_challenge",
        data: { tb11: 201, btd1: 6.8, deltaBtd: 4.8, stormHeight: 15.6, rainRate: 58.0, cape: 3200, tcwv: 68 },
        question: "Cyclone Fani is located 400 km east of Andhra Pradesh. TB11 is extremely cold (201 K), and Delta BTD is +4.8 K. Cape is 3200 J/kg with Total Column Water Vapour (TCWV) at 68 mm. Radar sweep shows a clear spiral formatting. What is your forecast assessment?",
        targetRain: "heavy",
        targetAlert: "orange",
        targetClass: "deep_convective",
        targetHazard: "high",
        explanation: "Extremely cold cloud tops (201 K) and highly positive Delta BTD (+4.8 K) indicate massive ice-phase towering clouds and deep convection. Very high CAPE (3200 J/kg) and rich TCWV (68 mm) are fueling rapid cyclonic intensification. Orange alert is necessary for coastal Andhra Pradesh and Odisha.",
        hint: "Very low temperatures below 210 K imply deep convection. A positive BTD means ice-phase tops. Intense storm development is occurring."
      },
      {
        id: "b09",
        station: "kolkata",
        day: "2 May 2019 — 14:00 IST",
        title: "Fani Approaching Odisha Coast",
        region: "Odisha Coast (18.8N, 85.8E)",
        mapType: "convective_burst",
        data: { tb11: 194, btd1: 8.2, deltaBtd: 5.6, stormHeight: 16.8, rainRate: 75.0, cape: 3800, tcwv: 72 },
        question: "Cyclone Fani is now an Extremely Severe Cyclonic Storm approaching Puri. TB11 has plummeted to 194 K with storm heights reaching 16.8 km. Winds are exceeding 180 km/h. What alert level and classification do you issue?",
        targetRain: "heavy",
        targetAlert: "red",
        targetClass: "deep_convective",
        targetHazard: "high",
        explanation: "With storm height at 16.8 km (reaching the tropopause) and TB11 at 194 K, the convective eye-wall is highly active. A Red Alert (extreme warning) must be issued immediately as landfall is imminent, threatening heavy rain and storm surges.",
        hint: "A storm height above 15 km is extreme convective depth. Landfall requires immediate maximum warnings."
      }
    ]
  },
  {
    id: "m_kerala",
    name: "Kerala Floods (August 2018)",
    desc: "Manage the unprecedented active monsoon conditions over Kerala where continuous orographic rainfall filled all major dams.",
    difficulty: "Regional Director",
    steps: [
      {
        id: "b05",
        station: "mumbai",
        day: "14 Aug 2018 — 09:30 IST",
        title: "Orographic rain over Western Ghats",
        region: "Kerala / Ghats (10.5N, 76.2E)",
        mapType: "orographic",
        data: { tb11: 261, btd1: -12.4, deltaBtd: -0.8, stormHeight: 4.8, rainRate: 22.0, cape: 450, tcwv: 62 },
        question: "Sustained rainfall is reported across Idukki and Wayanad districts. The cloud tops are relatively warm (261 K) but radar shows continuous echo returns below the freezing level. The atmospheric instability is low (CAPE 450) but TCWV is saturated at 62 mm. What system classification is this?",
        targetRain: "moderate",
        targetAlert: "orange",
        targetClass: "shallow_warm",
        targetHazard: "high",
        explanation: "This is a classic 'warm rain' orographic system. Stable atmospheric conditions (low CAPE) with extremely high moisture (TCWV 62 mm) pushed up mountains create shallow, liquid-phase clouds that rain persistently. The continuous accumulation poses high flood hazard.",
        hint: "Warm temperatures (~260 K) with low CAPE and very high moisture points to liquid-phase warm rain. Persistent mountain rain leads to rapid accumulation."
      },
      {
        id: "b04",
        station: "chennai",
        day: "16 Aug 2018 — 15:00 IST",
        title: "Active Offshore Low Interaction",
        region: "Kerala Coast (9.8N, 75.8E)",
        mapType: "active_monsoon",
        data: { tb11: 225, btd1: -18.2, deltaBtd: 1.2, stormHeight: 8.9, rainRate: 48.0, cape: 1200, tcwv: 69 },
        question: "An offshore trough has merged with a monsoon depression. TB11 has cooled to 225 K. Ground sensors indicate rainfall has exceeded 150 mm in 12 hours. Dam levels are at 99%. What is your forecast warning?",
        targetRain: "heavy",
        targetAlert: "red",
        targetClass: "convective",
        targetHazard: "high",
        explanation: "Monsoon depression dynamics and high moisture saturation have intensified convective activity over saturated soils. Red Alert must be issued to trigger immediate reservoir release and evacuation.",
        hint: "99% dam level + active monsoon heavy rain = catastrophic flood risk. Red alert is mandatory."
      }
    ]
  },
  {
    id: "m_chennai",
    name: "Chennai Floods (Dec 2015)",
    desc: "Analyze the extreme Northeast Monsoon easterly wave surges that caused catastrophic coastal flooding in Chennai.",
    difficulty: "Senior Forecaster",
    steps: [
      {
        id: "b12",
        station: "chennai",
        day: "1 Dec 2015 — 23:00 IST",
        title: "Easterly Wave Surge",
        region: "Chennai Coast (13.1N, 80.4E)",
        mapType: "ne_monsoon",
        data: { tb11: 228, btd1: -16.5, deltaBtd: 1.1, stormHeight: 8.2, rainRate: 38.0, cape: 1400, tcwv: 65 },
        question: "It is late evening. An active easterly wave is generating a train of convective cloud cells moving from the Bay of Bengal directly over Chennai. TB11 is 228 K, and rainfall is 38 mm/h. Soils are fully saturated from last week's rain. What is the alert level?",
        targetRain: "heavy",
        targetAlert: "red",
        targetClass: "convective",
        targetHazard: "high",
        explanation: "During the Northeast Monsoon, intense convective bands propagate offshore overnight. Saturated soils and steady 38 mm/h rain trigger immediate extreme flood warnings (Red Alert).",
        hint: "Easterly wave surge over a saturated urban area requires the highest alert level."
      }
    ]
  }
];

export const DB = {
  // Career Mode Scenarios grouped by simulation career level
  beginner: [
    {
      id: "b01",
      station: "delhi",
      day: "5 Jul — 14:00 IST",
      title: "Shallow Convection Over Northern Plains",
      region: "Haryana / Delhi (28.6N, 76.9E)",
      mapType: "shallow_warm",
      data: { tb11: 278, btd1: -42, deltaBtd: -1.8, stormHeight: 2.4, rainRate: 2.1, cape: 300, tcwv: 42 },
      question: "INSAT-3D thermal band shows a warm cloud top temperature of 278 K over Delhi NCR. The water vapour channel difference reads −42 K. Local flight operators request a briefing. What cloud type and rainfall rate do you report?",
      targetRain: "light",
      targetAlert: "green",
      targetClass: "shallow_warm",
      targetHazard: "low",
      explanation: "A brightness temperature of 278 K is very warm, meaning the cloud top is low (around 2 km). The highly negative channel difference (-42 K) confirms liquid water droplets with no ice. This is a shallow warm rain cloud producing light drizzle.",
      hint: "Warm brightness temperature = low cloud top. Strong negative BTD = liquid phase only. Low storm height = no severe threat."
    },
    {
      id: "b02",
      station: "mumbai",
      day: "12 Jun — 10:30 IST",
      title: "Pre-Monsoon Convection Detection",
      region: "Mumbai Coast (18.9N, 72.5E)",
      mapType: "kalpana",
      data: { tb11: 252, btd1: -19, deltaBtd: 0.9, stormHeight: 4.2, rainRate: 8.5, cape: 1100, tcwv: 52 },
      question: "Satellite thermal channel shows a cloud top temperature of 252 K and BTD1 of -19 K. Cape is moderately high (1100 J/kg). The old forecast rule requires warning only below 235 K, but multi-sensor tools flag rain. What classification fits best?",
      targetRain: "light",
      targetAlert: "yellow",
      targetClass: "stratiform",
      targetHazard: "low",
      explanation: "A cloud top temperature of 252 K indicates moderate depth. Instability is present, but the system is mostly stratiform rain clouds. Yellow alert is appropriate for early localized showers.",
      hint: "Moderate cloud depth + low-medium rain rates = stratiform cloud type. Instability is present but moderate."
    },
    {
      id: "b11",
      station: "mumbai",
      day: "5 Aug — 07:30 IST",
      title: "Arabian Sea Low-Level Stratus",
      region: "Arabian Sea (15N, 70E)",
      mapType: "shallow_warm",
      data: { tb11: 283, btd1: -6, deltaBtd: -1.2, stormHeight: 1.1, rainRate: 0.2, cape: 150, tcwv: 48 },
      question: "Thermal sensors over the Arabian Sea measure 283 K cloud top temperatures. The sea surface temperature is 302 K. Instability is negligible (CAPE 150). A trainee asks if this cloud contains ice. What is your call?",
      targetRain: "none",
      targetAlert: "green",
      targetClass: "cirrus", // cirrus or shallow stratiform
      targetHazard: "low",
      explanation: "The cloud top temperature of 283 K is only slightly cooler than the sea, meaning it is a very low-level warm marine stratus layer. It contains no ice (which requires temperatures below 273 K). Low risk, no precipitation.",
      hint: "Cloud temperature above freezing (273 K) cannot contain ice phase elements."
    }
  ],
  intermediate: [
    {
      id: "i01",
      station: "hyderabad",
      day: "6 Jul — 14:30 IST",
      title: "Severe Thunderstorm over Deccan Plateau",
      region: "Telangana (17.4N, 78.5E)",
      mapType: "btd_challenge",
      data: { tb11: 227, btd1: -17, deltaBtd: 2.4, stormHeight: 9.6, rainRate: 19.2, cape: 2200, tcwv: 54 },
      question: "Mid-afternoon satellite thermal imagery displays a cold storm system with a brightness temperature of 227 K over Hyderabad. Delta BTD is +2.4 K. High CAPE (2200 J/kg) indicates robust convection. What classification and alert level do you issue?",
      targetRain: "moderate",
      targetAlert: "yellow",
      targetClass: "convective",
      targetHazard: "moderate",
      explanation: "A positive Delta BTD (+2.4 K) along with 227 K cloud temperature indicates ice-dominated cloud tops and active convective cores. High CAPE supports strong thunder updrafts. Alert level Yellow is required.",
      hint: "Positive Delta BTD points to ice-phase convection. High CAPE indicates energetic thunderstorm development."
    },
    {
      id: "i05",
      station: "visakhapatnam",
      day: "15 Jul — 16:00 IST",
      title: "Offshore Convective Cluster",
      region: "Andhra Coast (17.0N, 83.5E)",
      mapType: "gpm_radar",
      data: { tb11: 218, btd1: -22, deltaBtd: 1.8, stormHeight: 11.2, rainRate: 32.0, cape: 1800, tcwv: 59 },
      question: "GPM satellite radar shows storm echo tops reaching 11.2 km over coastal Visakhapatnam. TB11 is 218 K and CAPE is 1800 J/kg. Ground radar indicates high reflectivity. What is your forecast?",
      targetRain: "heavy",
      targetAlert: "orange",
      targetClass: "deep_convective",
      targetHazard: "moderate",
      explanation: "Echo tops reaching 11.2 km represent deep convective structures. Moderate-to-heavy rain (32 mm/h) is occurring, making an Orange alert necessary for marine vessels and low-lying coastal zones.",
      hint: "Storm heights above 10 km mean convective structures are penetrating the upper troposphere."
    }
  ],
  advanced: [
    {
      id: "a01",
      station: "srinagar",
      day: "12 Mar — 16:00 IST",
      title: "Western Disturbance Cloudburst Risk",
      region: "Kashmir Valley (34.1N, 74.8E)",
      mapType: "btd_challenge",
      data: { tb11: 212, btd1: -28, deltaBtd: 3.4, stormHeight: 12.8, rainRate: 45.0, cape: 900, tcwv: 38 },
      question: "A severe Western Disturbance is crossing Jammu & Kashmir. High-resolution satellite scans show TB11 of 212 K over Srinagar. BTD1 is -28 K and storm height is 12.8 km. Moisture funnelling is high. What is your alert decision?",
      targetRain: "heavy",
      targetAlert: "orange",
      targetClass: "deep_convective",
      targetHazard: "high",
      explanation: "Even with moderate CAPE (900 J/kg), orographic lift forcing moist winds up mountains creates deep convective bursts. Cloud height of 12.8 km and cold temperatures (212 K) indicate cloudburst and landslide hazard. Issue Orange Alert.",
      hint: "Orographic forcing can turn moderate convective instability into catastrophic localized cloudbursts."
    },
    {
      id: "a03",
      station: "guwahati",
      day: "18 Jun — 18:00 IST",
      title: "Brahmaputra Valley Convective Surge",
      region: "Guwahati (26.1N, 91.7E)",
      mapType: "active_monsoon",
      data: { tb11: 219, btd1: -24, deltaBtd: 2.8, stormHeight: 11.9, rainRate: 42.0, cape: 2400, tcwv: 64 },
      question: "A massive convective system has developed over the Brahmaputra Valley. TB11 is 219 K with storm height at 11.9 km. High moisture loading (TCWV 64 mm) and CAPE (2400 J/kg) are observed. Rivers are already near flood stage. Forecast action?",
      targetRain: "heavy",
      targetAlert: "red",
      targetClass: "deep_convective",
      targetHazard: "high",
      explanation: "Very high CAPE, saturated moisture columns, and 11.9 km storm height indicate massive storm cells capable of causing flash floods. Combined with high river levels, a Red Alert is mandatory.",
      hint: "Sustained high rain rate over a pre-flooded river basin warrants a Red Alert."
    }
  ],
  master: [
    {
      id: "m01",
      station: "kolkata",
      day: "19 May — 12:00 IST",
      title: "Nor'wester Severe Squall Line",
      region: "West Bengal (22.6N, 88.4E)",
      mapType: "btd_challenge",
      data: { tb11: 198, btd1: -32, deltaBtd: 5.2, stormHeight: 16.2, rainRate: 68.0, cape: 4200, tcwv: 58 },
      question: "A severe squall line (Nor'wester) is approaching Kolkata. CAPE is at an extreme 4200 J/kg, and TB11 is a freezing 198 K with storm tops breaching 16 km. High-frequency radar shows intense reflectivity and severe wind shear. Select forecast parameters.",
      targetRain: "heavy",
      targetAlert: "red",
      targetClass: "deep_convective",
      targetHazard: "high",
      explanation: "Extreme CAPE (4200 J/kg) and storm heights of 16.2 km indicate supercell structures with severe updrafts. High hail probability, destructive winds, and torrential rain require immediate Red Alert warning.",
      hint: "CAPE above 3500 J/kg + storm height > 15 km = extreme convective storm hazard."
    },
    {
      id: "m08",
      station: "ahmedabad",
      day: "28 Jul — 17:00 IST",
      title: "Erratic Monsoon Depressional Surge",
      region: "Gujarat Coast (22.5N, 70.2E)",
      mapType: "gpm_radar",
      data: { tb11: 220, btd1: -19, deltaBtd: 2.1, stormHeight: 10.8, rainRate: 35.0, cape: 1600, tcwv: 61 },
      question: "A deep depression from the Arabian Sea has stalled over the Gujarat coast. Telemetry shows TB11 is 220 K, BTD is positive, and TCWV is 61 mm. Soil absorption capacity is zero. What are your operational decisions?",
      targetRain: "heavy",
      targetAlert: "orange",
      targetClass: "convective",
      targetHazard: "high",
      explanation: "The stalled monsoon depression has continuous convective moisture feeds. Saturated soils mean all rainfall will convert to runoff, posing extreme flood risk. Issue Orange Alert.",
      hint: "Stalled storm systems over saturated coastal soil convert moderate-heavy rain into immediate floods."
    }
  ]
};