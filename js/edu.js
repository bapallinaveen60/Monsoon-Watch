// ============================================================
// INSAT-Sim — Educational Academy Curriculum
// ============================================================

export const LESSONS = [
  {
    id: "l_sat_met",
    title: "1. Satellite Meteorology",
    desc: "Understand orbit configurations, solar reflective vs thermal infrared bands, and atmospheric transmission windows.",
    content: `
      <h3>Introduction to Satellite Channels</h3>
      <p>Meteorological satellites observe the Earth's atmosphere and surface using specific spectral bands that sample either reflected solar radiation (daytime) or emitted thermal radiation (day and night).</p>
      
      <table class="edu-table" style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:0.75rem;">
        <thead>
          <tr style="border-bottom:1px solid var(--bdr2); text-align:left; color:var(--acc);">
            <th style="padding:6px;">Channel / Band</th>
            <th style="padding:6px;">Wavelength</th>
            <th style="padding:6px;">Primary Physical Measurement</th>
            <th style="padding:6px;">Meteorological Application</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px dashed var(--bdr);">
            <td style="padding:6px; font-weight:bold;">Visible (VIS)</td>
            <td style="padding:6px;">0.55 – 0.75 μm</td>
            <td style="padding:6px;">Reflected sunlight (Albedo)</td>
            <td style="padding:6px;">Cloud thickness, texture, and daytime storm structure.</td>
          </tr>
          <tr style="border-bottom:1px dashed var(--bdr);">
            <td style="padding:6px; font-weight:bold;">Shortwave IR (SWIR)</td>
            <td style="padding:6px;">1.55 – 1.70 μm</td>
            <td style="padding:6px;">Reflected sunlight / absorption</td>
            <td style="padding:6px;">Snow vs. cloud discrimination; land cover and moisture.</td>
          </tr>
          <tr style="border-bottom:1px dashed var(--bdr);">
            <td style="padding:6px; font-weight:bold;">Mid-Infrared (MIR)</td>
            <td style="padding:6px;">3.80 – 4.00 μm</td>
            <td style="padding:6px;">Combined solar reflection & thermal emission</td>
            <td style="padding:6px;">Wildfires, hot spots, and fog/low stratus detection at night.</td>
          </tr>
          <tr style="border-bottom:1px dashed var(--bdr);">
            <td style="padding:6px; font-weight:bold;">Water Vapour (WV)</td>
            <td style="padding:6px;">6.50 – 7.00 μm</td>
            <td style="padding:6px;">Upper-tropospheric absorption/emission</td>
            <td style="padding:6px;">Mid-to-upper level moisture tracks, jet stream boundaries, wind shear.</td>
          </tr>
          <tr style="border-bottom:1px solid var(--bdr2);">
            <td style="padding:6px; font-weight:bold;">Thermal IR (TIR1/TIR2)</td>
            <td style="padding:6px;">10.2 – 12.5 μm</td>
            <td style="padding:6px;">Surface / cloud-top thermal emission</td>
            <td style="padding:6px;">Cloud-top temperature (TB₁₁), cloud height, and convective depth.</td>
          </tr>
        </tbody>
      </table>

      <h4>The Thermal Lapse Rate & Cloud Heights</h4>
      <p>In the troposphere, air temperature decreases with altitude at an average rate of <strong>6.5°C per kilometer</strong> (the environmental lapse rate). Because clouds emit radiation as blackbodies matching their ambient temperature, the satellite sensor measures their cloud-top Brightness Temperature (TB₁₁):</p>
      <ul>
        <li><strong>Warm Cloud Tops (>260 K):</strong> Emit radiation from lower altitudes, indicating shallow, warm cloud decks.</li>
        <li><strong>Cold Cloud Tops (<235 K):</strong> Reflect high-altitude cloud tops reaching the upper troposphere, typical of active convection.</li>
        <li><strong>Overshooting Tops (<200 K):</strong> Indicate intense updrafts that have penetrated the tropopause (14-16 km altitude), carrying ice and producing heavy precipitation.</li>
      </ul>
    `,
    quiz: [
      {
        q: "Why do high, towering convective clouds look extremely cold in thermal IR imagery?",
        a: "In the troposphere, temperature decreases with altitude, so high cloud tops emit at colder temperatures.",
        choices: [
          "They are closer to space, which cools them down.",
          "In the troposphere, temperature decreases with altitude, so high cloud tops emit at colder temperatures.",
          "High wind speeds aloft cool the cloud tops via convection.",
          "High clouds reflect more geothermal radiation."
        ]
      },
      {
        q: "Which channel is best suited for detecting upper-level wind shear and jet stream positions?",
        a: "Water Vapour (6.2μm)",
        choices: [
          "Thermal IR (11μm)",
          "Visible (0.6μm)",
          "Water Vapour (6.2μm)",
          "Microwave band"
        ]
      }
    ]
  },
  {
    id: "l_cloud_phys",
    title: "2. Cloud Physics",
    desc: "Discover how clouds form, the vertical temperature lapse rate, and warm rain processes vs ice crystal growth.",
    content: `
      <h3>Cloud Microphysics & Rain Processes</h3>
      <p>Precipitation processes are dictated by cloud temperature regimes, which govern whether water exists as liquid droplets, supercooled water, or ice crystals.</p>
      
      <h4>1. Warm Clouds (Collision-Coalescence Process)</h4>
      <p>In warm clouds, the cloud top temperature remains warmer than <strong>273 K (0°C)</strong>, containing liquid water droplets only. Rainfall forms through the <strong>collision-coalescence</strong> mechanism:</p>
      <ul>
        <li>Large cloud droplets fall faster than smaller ones under gravity.</li>
        <li>As they descend, they collide with smaller droplets, sweeping them up and growing via accretion.</li>
        <li>This process dominates along India's coastal Western Ghats, where highly moist maritime air is lifted to form shallow, highly efficient warm rain clouds.</li>
      </ul>

      <h4>2. Mixed-Phase Clouds (Bergeron-Findeisen Process)</h4>
      <p>Between <strong>273 K and 233 K (0°C to -40°C)</strong>, clouds contain a mixture of ice crystals and supercooled liquid water. The <strong>Bergeron-Findeisen</strong> process dominates because the saturation vapor pressure over ice is lower than over liquid water:</p>
      <ul>
        <li>Water vapor diffuses from evaporating liquid droplets toward growing ice crystals.</li>
        <li>Ice crystals grow rapidly by vapor deposition, forming snowflakes that eventually fall and melt into rain below the freezing level.</li>
      </ul>

      <h4>3. Cold Clouds (Ice Phase Convection)</h4>
      <p>Below <strong>233 K (-40°C)</strong>, supercooled water freezes spontaneously. Cloud tops consist entirely of ice crystals. The updrafts inside deep convective cumulonimbus carry moisture high above the freezing level, generating glaciated clouds and severe lightning discharges.</p>
    `,
    quiz: [
      {
        q: "What precipitation mechanism is responsible for sustained rain in clouds that do not reach the freezing level?",
        a: "Collision-Coalescence",
        choices: [
          "Bergeron-Findeisen process",
          "Sublimation",
          "Collision-Coalescence",
          "Condensation nucleation"
        ]
      }
    ]
  },
  {
    id: "l_btd_interp",
    title: "3. BTD Interpretation",
    desc: "Master the Brightness Temperature Difference. Use multi-spectral subtraction to identify cloud phases and filter out thin cirrus.",
    content: `
      <h3>Understanding BTD & Multi-Spectral Subtraction</h3>
      <p>A single infrared channel cannot distinguish a thin, non-precipitating cirrus cloud from a thick, raining stratus cloud if they share the same temperature. Brightness Temperature Difference (BTD) solves this by exploiting wavelength-dependent absorption.</p>
      
      <h4>BTD₁ (8.6 μm − 11.2 μm): Cloud Phase Detection</h4>
      <p>Water and ice have different refractive indices at 8.6 μm and 11.2 μm. Since ice absorbs more strongly at 11.2 μm than 8.6 μm, subtraction yields:</p>
      <ul>
        <li><strong>Positive BTD₁ (> 0 K):</strong> Confirms a glaciated (ice-dominated) cloud top, indicating deep convection.</li>
        <li><strong>Negative BTD₁ (< 0 K):</strong> Confirms a liquid-water cloud top, indicating a shallow or warm rain cloud system.</li>
      </ul>

      <h4>ΔBTD (6.2 μm − 11.2 μm): Deep Convective Overshooting</h4>
      <p>The 6.2 μm water vapour channel samples the upper troposphere, while the 11.2 μm channel samples cloud tops or the surface. Subtracting them yields:</p>
      <ul>
        <li><strong>Strongly Negative ΔBTD (e.g., -30 K to -40 K):</strong> Indicates thin cirrus. The 11.2 μm channel senses through the thin cloud to the warm surface, while the 6.2 μm channel measures cold upper-level vapor.</li>
        <li><strong>Near-Zero or Positive ΔBTD (>= 0 K):</strong> Indicates a deep, optically thick convective storm core. The cloud top is so tall and opaque that it blocks emission from lower layers, and may overshoot into the stratosphere, absorbing water vapor above the cloud top.</li>
      </ul>
    `,
    quiz: [
      {
        q: "A client reports thin clouds overhead. The satellite shows a cloud top temperature of 220 K, but ΔBTD is strongly negative (-30 K). What is this cloud type?",
        a: "Thin non-precipitating Cirrus",
        choices: [
          "Deep convective storm core",
          "Thin non-precipitating Cirrus",
          "Shallow warm rain stratus",
          "Active convective cell"
        ]
      }
    ]
  },
  {
    id: "l_radar_met",
    title: "4. Radar Meteorology",
    desc: "Learn how Doppler Weather Radars operate, the significance of reflectivity (dBZ), and the melting layer 'bright band'.",
    content: `
      <h3>Radar Reflectivity & Precipitation Profiling</h3>
      <p>Doppler weather radars and spaceborne active radars (like GPM DPR) emit microwave pulses and measure the backscattered energy returned from hydrometeors (Reflectivity, Z).</p>
      
      <h4>Reflectivity (Z) and dBZ</h4>
      <p>Reflectivity is proportional to the <strong>sixth power of drop diameter (Z ∝ D⁶)</strong>. A small increase in raindrop size produces a massive increase in radar return. Reflectivity is measured on a logarithmic scale in dBZ:</p>
      <ul>
        <li><strong>15 to 25 dBZ:</strong> Light rain or drizzle.</li>
        <li><strong>30 to 45 dBZ:</strong> Moderate, stratiform rain.</li>
        <li><strong>>45 dBZ:</strong> Heavy convective rain, potentially containing hail.</li>
      </ul>

      <h4>The Melting Layer 'Bright Band'</h4>
      <p>In stratiform precipitation, a distinct horizontal ring of extremely high reflectivity (often 40-45 dBZ) occurs at the freezing level (0°C isotherm):</p>
      <ul>
        <li>As snowflakes fall across the 0°C level, they begin to melt, forming a coating of liquid water.</li>
        <li>Water has a dielectric constant <strong>5.5 times higher than ice</strong>. The radar sees a giant, wet particle and interprets it as a massive raindrop, producing a spike in reflectivity.</li>
        <li>Once completely melted, the droplets collapse into smaller raindrops and fall faster, causing the reflectivity to drop sharply below the melting layer.</li>
      </ul>
    `,
    quiz: [
      {
        q: "What physical event causes the 'bright band' signature on radar displays?",
        a: "Snowflakes coating in water as they begin to melt at the 0°C freezing level.",
        choices: [
          "Extremely intense lightning discharges.",
          "Snowflakes coating in water as they begin to melt at the 0°C freezing level.",
          "Ground clutter reflections from nearby hills.",
          "Severe wind shear shifting radar wavelengths."
        ]
      }
    ]
  },
  {
    id: "l_monsoon_iso",
    title: "5. Active vs. Break Monsoon Spells",
    desc: "Understand intraseasonal monsoon oscillations, spatial rain fractions, and vertical structure differences.",
    content: `
      <h3>Monsoon Intraseasonal Oscillations (ISOs)</h3>
      <p>The Indian Summer Monsoon does not rain continuously. It features distinct active spells (copious rainfall) and break spells (dry periods) driven by northward-propagating atmospheric waves.</p>
      
      <h4>1. Active Monsoon Spells</h4>
      <p>Active spells feature widespread, organized precipitation across the core monsoon zone of Central India:</p>
      <ul>
        <li><strong>Widespread Stratiform Rain:</strong> Driven by large Mesoscale Convective Systems (MCS) with broad stratiform shields and persistent radar bright bands.</li>
        <li><strong>High Relative Humidity:</strong> Deep saturation throughout the troposphere stabilizes the lapse rate but sustains continuous rainfall.</li>
        <li><strong>Diurnal Peak:</strong> Rain peaks in the morning near mountain foothills (due to nocturnal drainage and wind convergence) and late night over southeast India.</li>
      </ul>

      <h4>2. Break Monsoon Spells</h4>
      <p>During break spells, the monsoon trough shifts north toward the Himalayas, suppressing rainfall over Central India:</p>
      <ul>
        <li><strong>Isolated Convection:</strong> High solar heating builds instability (high CAPE), causing isolated, severe convective thunder squalls in the afternoon.</li>
        <li><strong>Shallow Warm Rain:</strong> Convective systems are less organized, and shallow liquid-phase clouds dominate the rain fraction.</li>
        <li><strong>WV Dry Slots:</strong> Satellites detect mid-level dry air intrusions that cap and evaporate growing clouds.</li>
      </ul>
    `,
    quiz: [
      {
        q: "Which radar and cloud signature is most characteristic of an ACTIVE monsoon spell over the core zone?",
        a: "Widespread stratiform rain shields with a distinct melting layer bright band.",
        choices: [
          "Isolated convective cells with zero anvil development.",
          "Widespread stratiform rain shields with a distinct melting layer bright band.",
          "Shallow warm rain cells limited to below 3 km altitude.",
          "A complete lack of water vapor throughout the troposphere."
        ]
      }
    ]
  },
  {
    id: "l_mcs_modes",
    title: "6. Mesoscale Convective Systems",
    desc: "Classify linear MCS organizational modes (TS, PS, EL, Bow Echo) and their environmental parameters.",
    content: `
      <h3>Mesoscale Convective Systems (MCS)</h3>
      <p>MCSs are large clusters of thunderstorms that organize on scales of tens to hundreds of kilometers. Based on Doppler radar reflectivity, linear MCSs are classified into five organizational modes:</p>
      
      <ul>
        <li><strong>Trailing Stratiform (TS):</strong> The most common mode. Features a leading convective line of intense cell cores, followed by a wide trailing zone of lighter stratiform rain and a prominent bright band.</li>
        <li><strong>Leading Stratiform (LS):</strong> The reverse of TS, where the convective line forms on the back edge of a moving stratiform shield.</li>
        <li><strong>Parallel Stratiform (PS):</strong> The stratiform rain area aligns parallel/adjacent to the convective line.</li>
        <li><strong>Embedded Line (EL):</strong> A convective line is buried inside a large, uniform stratiform rain system (weakest convective intensity).</li>
        <li><strong>Bow Echo (BE):</strong> A convective line bent forward into a bow shape by a strong channel of descending air (the <em>rear-inflow jet</em>), producing damaging straight-line winds and extreme rain rates.</li>
      </ul>

      <h4>Environmental Composites</h4>
      <p>The development of these modes is dictated by three thermodynamic variables:</p>
      <ol>
        <li><strong>CAPE (Convective Available Potential Energy):</strong> Instability fueling vertical acceleration. Severe modes (BE, TS) require CAPE > 2000 J/kg.</li>
        <li><strong>TCWV (Total Column Water Vapour):</strong> Total precipitable water in the column. Needs deep saturation (> 55 mm).</li>
        <li><strong>Vertical Wind Shear:</strong> Controls storm longevity. Strong low-level shear tilts updrafts, separating them from downdrafts and preventing premature storm collapse.</li>
      </ol>
    `,
    quiz: [
      {
        q: "What physical force or mechanism is responsible for bending a convective line into a Bow Echo MCS?",
        a: "A strong rear-inflow jet of cold air descending and pushing the line forward.",
        choices: [
          "The Coriolis force deflecting winds clockwise.",
          "A strong rear-inflow jet of cold air descending and pushing the line forward.",
          "Warm air rising over steep mountain peaks.",
          "A lack of vertical wind shear causing symmetric collapse."
        ]
      }
    ]
  },
  {
    id: "l_sat_ml",
    title: "7. Machine Learning for Rain Classification",
    desc: "Explore feature engineering, class imbalance, Balanced Random Forest, and U-Net semantic segmentation.",
    content: `
      <h3>Machine Learning in Satellite Meteorology</h3>
      <p>Traditional rain detection relies on simple brightness temperature (BT) thresholding, which misses shallow warm rain and misidentifies thin cirrus as heavy rain. Modern approaches apply Machine Learning (ML) and Deep Learning (DL) to collocated datasets.</p>
      
      <h4>1. Feature Engineering (4 Bands vs. 34 Features)</h4>
      <p>To improve classifier performance, we expand our input parameters:</p>
      <ul>
        <li><strong>4-Band Inputs:</strong> Raw BT values from imager bands: TIR1, TIR2, MIR, WV.</li>
        <li><strong>34-Feature Inputs:</strong> 4 raw bands + 20 local statistical features (mean, median, standard deviation, minimum, maximum computed over 3x3 and 5x5 pixel neighborhoods to capture spatial texture) + 6 BTDs + 4 differences of BTD (DBTD) to resolve cloud microphysics.</li>
      </ul>

      <h4>2. Handling Class Imbalance</h4>
      <p>Precipitation datasets are highly imbalanced, as over <strong>90% of pixels represent 'No Rain'</strong>. Standard classifiers bias towards the majority class. We address this using:</p>
      <ul>
        <li><strong>Balanced Random Forest (BRF):</strong> Undersamples the majority class (No Rain) in the bootstrap sample of each decision tree to balance the class distribution during training.</li>
        <li><strong>U-Net Semantic Segmentation:</strong> A deep learning CNN trained on 128x128 patches. Uses contracting encoder paths to extract features and expanding decoder paths with <em>skip connections</em> to pass high-resolution spatial boundaries directly, yielding superior classification accuracy over BRF.</li>
      </ul>
    `,
    quiz: [
      {
        q: "Why does Balanced Random Forest (BRF) perform better than standard Random Forest on satellite rain datasets?",
        a: "It undersamples non-raining pixels in each tree bootstrap, preventing majority-class bias.",
        choices: [
          "It ignores thermal infrared channels.",
          "It undersamples non-raining pixels in each tree bootstrap, preventing majority-class bias.",
          "It artificially duplicates convective storm pixels.",
          "It uses deep neural networks to extract cloud textures."
        ]
      }
    ]
  },
  {
    id: "l_collocation",
    title: "8. Spaceborne Radar & Collocation",
    desc: "Examine TRMM PR and GPM DPR configurations, Ku-band range bins, and cKDTree collocation matching.",
    content: `
      <h3>Active Radar Profiling & Spatio-Temporal Collocation</h3>
      <p>To train satellite rain retrievals, geostationary satellite (INSAT-3DR) observations must be matched with ground truth vertical rain profiles from low-Earth orbiting active spaceborne radars (TRMM PR & GPM DPR).</p>
      
      <h4>1. GPM DPR Specifications</h4>
      <p>The Global Precipitation Measurement Dual-Frequency Precipitation Radar (GPM DPR) carries active Ku-band (13.6 GHz) and Ka-band (35.5 GHz) radars:</p>
      <ul>
        <li><strong>Swath Structure:</strong> Ku-band features a 245 km swath width with 49 angle rays.</li>
        <li><strong>Range Bins:</strong> Each ray contains <strong>176 range bins</strong> at <strong>125-meter vertical intervals</strong>. Bin 0 is located at the top of the scan window (~22 km), and bin 175 is at the Earth ellipsoid surface.</li>
      </ul>

      <h4>2. cKDTree Spatial Collocation</h4>
      <p>Because INSAT-3DR and GPM DPR fly at different altitudes and orbit types, their datasets must be collocated in space and time:</p>
      <ul>
        <li><strong>cKDTree Search:</strong> An optimized binary tree structure is used to run nearest-neighbor and ball queries to match pixels.</li>
        <li><strong>Spatio-Temporal Bounds:</strong> Data points are collocated only if their spatial separation is <strong><= 5 km</strong> and their scan time difference is <strong><= 10 minutes</strong>. This prevents cloud movement errors from corrupting the dataset.</li>
      </ul>
    `,
    quiz: [
      {
        q: "What is the vertical spacing and total bin count of GPM DPR L2 Ku swath precipitation profiles?",
        a: "176 bins spaced at 125-meter vertical intervals.",
        choices: [
          "100 bins spaced at 500-meter vertical intervals.",
          "176 bins spaced at 125-meter vertical intervals.",
          "2048 bins spaced at 10-meter vertical intervals.",
          "50 bins spaced at 1000-meter vertical intervals."
        ]
      }
    ]
  }
];

export const BIBLIOGRAPHY = [
  {
    title: "A study of Mesoscale Convective Systems over the Complex Terrain of the Indian subcontinent",
    authors: "Partha Roy & Rajdip Saha (2024)",
    journal: "Journal of Geophysical Research / IMD Report",
    cat: "Convective & Orographic Precipitation",
    summary: "Investigates linear vs. nonlinear MCS modes over India using 27 years of GPM/TRMM observations, showing that TS/LS modes are most common while Bow Echoes (BE) produce the most extreme wind and hourly rain rates."
  },
  {
    title: "Differences in the Climatological Characteristics of Precipitation between Active and Break Spells",
    authors: "T. Narayana Rao, K. Saikranthi, B. Radhakrishna, S. Vijaya Bhaskara Rao (2016)",
    journal: "Journal of Climate",
    cat: "Convective & Orographic Precipitation",
    summary: "Utilizes 15 years of TRMM PR profiles to show active spells are dominated by stratiform rain shields and distinct bright bands, whereas break spells exhibit shallow rain and isolated convective storm towers."
  },
  {
    title: "Physical processes controlling the diurnal cycle of convective storms in the Western Ghats",
    authors: "U. V. Murali Krishna, Subrata Kumar Das, Sachin M. Deshpande, G. Pandithurai (2021)",
    journal: "Scientific Reports",
    cat: "Convective & Orographic Precipitation",
    summary: "Examines bimodal diurnal cycles over the Western Ghats, identifying an afternoon convective peak driven by slope solar heating and an early morning peak driven by nocturnal land breeze convergence."
  },
  {
    title: "Classifying precipitation from GEO satellite observations: Prognostic and Diagnostic Models",
    authors: "Shruti A. Upadhyaya, Pierre-Emmanuel Kirstetter, et al. (2021)",
    journal: "Quarterly Journal of the Royal Meteorological Society",
    cat: "Machine Learning & Deep Learning",
    summary: "Develops machine learning algorithms using GOES-16 ABI multispectral data and NWP variables, identifying that CAPE and lapse rates are critical for convective classification while moisture indices govern stratiform areas."
  },
  {
    title: "Precipitation Type Classification with INSAT 3DR and GPM DPR Satellite Observations",
    authors: "Atheeswaran. B (Supervised by Dr. Shruti Upadhyaya) (2024)",
    journal: "M.Tech Thesis, Department of Climate Change, IIT Hyderabad",
    cat: "Theses & Presentations",
    summary: "First study to construct collocated datasets for INSAT-3DR and GPM DPR Ku-band over India. Trains Balanced Random Forest and U-Net semantic segmentation models, highlighting the superiority of U-Net patch classification."
  },
  {
    title: "Multi-index rain detection: A new approach for regional rain area detection",
    authors: "Shruti Upadhyaya & Raaj Ramsankaran (2014)",
    journal: "Journal of Hydrometeorology",
    cat: "Satellite Rain Detection & Physical Models",
    summary: "Introduces a multi-index rain detection technique utilizing water vapor and thermal infrared channel differences (BTD and ΔBTD) to accurately separate rain areas from non-precipitating clouds."
  },
  {
    title: "Tropospheric water vapor, convection, and climate",
    authors: "Steven C. Sherwood, Natalia Andronova, et al. (2010)",
    journal: "Reviews of Geophysics",
    cat: "Climate & General Data Formats",
    summary: "Analyzes tropospheric moisture loading feedback mechanisms and details the 7% increase in saturation vapor pressure per 1K warming (Clausius-Clapeyron scaling) that fuels convective storms."
  }
];
