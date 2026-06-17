// ============================================================
// MONSOON WATCH V2 — Educational Academy Curriculum
// ============================================================

export const LESSONS = [
  {
    id: "l_sat_met",
    title: "1. Satellite Meteorology",
    desc: "Understand orbit configurations, solar reflective vs thermal infrared bands, and atmospheric transmission windows.",
    content: `
      <h3>Introduction to Satellite Channels</h3>
      <p>Meteorological satellites observe the Earth using spectral channels that measure reflected sunlight or emitted thermal radiation.</p>
      <ul>
        <li><strong>Thermal Infrared (IR 11μm):</strong> Measures the temperature of the emitting surface (sea surface, land, or cloud tops). In the troposphere, temperature drops with height. Therefore, colder IR readings (e.g., &lt; 220 K) indicate tall cloud tops that reach high altitudes.</li>
        <li><strong>Water Vapour (WV 6.2μm):</strong> Measures moisture content in the mid-to-upper troposphere (between 300 to 600 hPa). Saturated columns show cold temperatures, while dry air columns reveal warmer temperatures from lower layers.</li>
        <li><strong>Visible (VIS 0.6μm):</strong> Measures reflected solar radiation. Used in daytime to resolve cloud thickness and texture.</li>
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
      <h3>Cloud Microphysics & Warm Rain</h3>
      <p>Rain does not always require freezing temperatures. Clouds are classified by temperature layers:</p>
      <ul>
        <li><strong>Warm Clouds:</strong> Cloud tops remain warmer than 273 K (0°C). Precipitation forms entirely through the <em>collision-coalescence</em> process, where water droplets collide and grow. Commonly seen along India's coastal Western Ghats.</li>
        <li><strong>Mixed-Phase Clouds:</strong> Contain both supercooled liquid water and ice crystals. The <em>Bergeron-Findeisen</em> process dominates: ice crystals grow at the expense of surrounding water droplets.</li>
        <li><strong>Cold Clouds:</strong> Cloud tops are colder than 233 K (-40°C), consisting entirely of ice crystals. These form the anvil structures of deep convective storms.</li>
      </ul>
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
      <h3>Understanding BTD & ΔBTD</h3>
      <p>Brightness Temperature Difference (BTD) is a powerful tool to identify cloud phase and thickness by subtracting channel readings.</p>
      <ul>
        <li><strong>BTD₁ (8.6μm − 11.2μm):</strong> Ice and liquid water have different refractive indices at these wavelengths. A positive BTD₁ indicates an ice-dominant cloud top, whereas a negative BTD₁ implies liquid water.</li>
        <li><strong>ΔBTD (6.2μm − 11.2μm):</strong> Compares upper-level water vapour emission to cloud top thermal emission. In thin cirrus, the satellite sees through to warmer lower layers, causing a highly negative difference. In deep convective storm cores, the cloud top blocks lower layers, making the difference positive.</li>
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
      <h3>Radar Reflectivity & Melting Layer</h3>
      <p>Ground-based and spaceborne radars (like GPM DPR) send pulses and measure backscatter energy (reflectivity, in dBZ).</p>
      <ul>
        <li><strong>The Bright Band:</strong> A horizontal ring of extremely high reflectivity located at the freezing level (0°C altitude). As snowflakes fall and begin to melt, they coat themselves in liquid water. This makes them appear to the radar as giant raindrops, producing a fake spike in reflectivity.</li>
        <li><strong>Convective vs Stratiform Echoes:</strong> Convective clouds show vertical columns of high reflectivity (&gt; 40 dBZ) and strong updrafts. Stratiform clouds display widespread, uniform reflectivity with a clear bright band.</li>
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
  }
];
