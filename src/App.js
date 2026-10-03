import React, { useEffect, useState } from "react";

// ============================================================
// CONFIGURATION
// ============================================================

const WEATHER_KEY = "aa1cfdca5517464e84e205942260105";
const LOCATION = "Russellville,AR";

const GOLD = "#D4AF37";
const RED = "#FF453A";
const GREEN = "#28a745";
const BLUE = "#3498db";
const ORANGE = "#ff9f0a";
const PURPLE = "#9b59b6";

// ============================================================
// DEFAULT GOAT REGISTRY
// ============================================================

const DEFAULT_GOATS = [
  {
    id: "g1",
    name: "Elijah",
    role: "Herd Sire",
    weight: "145",
    color: "Black & Tan",
    lastCheck: "2026-08-15",
    photoUrl: "",
    dam: "",
    sire: "",
    bredDate: ""
  },
  {
    id: "g2",
    name: "Daisy",
    role: "Milking Doe",
    weight: "110",
    color: "Chamoisee",
    lastCheck: "2026-09-01",
    photoUrl: "",
    dam: "",
    sire: "",
    bredDate: "2026-06-10"
  },
  {
    id: "g3",
    name: "Bella",
    role: "Milking Doe",
    weight: "105",
    color: "Sundgau",
    lastCheck: "2026-07-20",
    photoUrl: "",
    dam: "Daisy",
    sire: "Elijah",
    bredDate: ""
  },
  {
    id: "g4",
    name: "Nutmeg",
    role: "Dry Doe",
    weight: "95",
    color: "Brown / White",
    lastCheck: "2026-06-10",
    photoUrl: "",
    dam: "",
    sire: "",
    bredDate: ""
  },
  {
    id: "g5",
    name: "Pip",
    role: "Kid",
    weight: "35",
    color: "Pinto",
    lastCheck: "2026-09-10",
    photoUrl: "",
    dam: "Daisy",
    sire: "Elijah",
    bredDate: ""
  }
];

// ============================================================
// DEFAULT MEDICINE & SUPPLY CABINET
// ============================================================

const DEFAULT_SUPPLIES = [
  {
    id: "s1",
    name: "Blackstrap Molasses",
    category: "Feed & Mash",
    qty: "2 Gallons",
    minQty: 1,
    isLow: false,
    expDate: "2027-05-01"
  },
  {
    id: "s2",
    name: "16% Dairy Pellet Grain",
    category: "Feed & Mash",
    qty: "3 Bags",
    minQty: 2,
    isLow: false,
    expDate: "2026-12-01"
  },
  {
    id: "s3",
    name: "Safeguard Dewormer",
    category: "Meds",
    qty: "1 Bottle",
    minQty: 1,
    isLow: true,
    expDate: "2026-11-15"
  },
  {
    id: "s4",
    name: "CD&T Vaccine",
    category: "Meds",
    qty: "1 Vial (10 dose)",
    minQty: 1,
    isLow: false,
    expDate: "2026-10-30"
  },
  {
    id: "s5",
    name: "Veterycin Wound Spray",
    category: "Meds",
    qty: "2 Spray Bottles",
    minQty: 1,
    isLow: false,
    expDate: "2028-01-01"
  },
  {
    id: "s6",
    name: "3cc Syringes w/ Needles",
    category: "Supplies",
    qty: "15 Count",
    minQty: 10,
    isLow: false,
    expDate: "N/A"
  }
];

// ============================================================
// EMERGENCY PROTOCOL DATA
// ============================================================

const EMERGENCY_CARDS = [
  {
    title: "🐐 Kidding Complications",
    color: RED,
    steps: [
      "• Slow Labor: If pushing > 30 mins with no progress, sanitize gloved hand and gently check presentation (front feet first, nose resting on top).",
      "• Repositioning Head/Legs: Gently push kid back slightly, cup hooves or muzzle to protect uterus while aligning.",
      "• Reviving Kid: Clear airway/mucus immediately with bulb syringe. Rub coat briskly with warm towels. Tickle inside nostril with hay stem to induce sneeze/gasp.",
      "• Hypothermia: Dip umbilical cord in Iodine. Place kid in warm box or under heat lamp until core temp reaches 101.5°F."
    ]
  },
  {
    title: "🤢 Bloat / Off-Feed Emergency",
    color: ORANGE,
    steps: [
      "• Assess Left Flank: Tightly ballooned left side indicates frothy bloat.",
      "• Drench Dosage: Mix 1/4 cup Mineral Oil or Cooking Oil with 2 tbsp Baking Soda in warm water.",
      "• Physical Steps: Drench slowly via syringe/drench bottle. Walk goat continuously on an incline (front legs elevated) while firm massaging left belly bottom-to-top.",
      "• Probiotics: Administer 10-15g Probios paste after bloat recedes."
    ]
  },
  {
    title: "🚨 Predator / Escape Alert",
    color: GOLD,
    steps: [
      "• Pen Isolation: Immediately herd all animals into main barn stall / hard enclosure and lock solid gates.",
      "• Fence Inspection: Sweep perimeter with high-lumen spotlight, starting at South Creek line, checking for dug holes or hot-wire shorts.",
      "• Emergency Contact / Vet: Keep local vet & animal control speed-dials handy on fridge board."
    ]
  }
];

// ============================================================
// INITIAL SEASONAL TASKS
// ============================================================

const DEFAULT_SEASONAL_TASKS = [
  {
    id: "st1",
    title: "Barn Deep Cleaning & Stall Cleanout",
    category: "Spring / Fall Overhauls",
    date: "2026-10-15",
    done: false
  },
  {
    id: "st2",
    title: "Check Heat Tapes on Water Lines",
    category: "Winterization",
    date: "2026-11-01",
    done: false
  },
  {
    id: "st3",
    title: "Install Barn Windbreak Tarps",
    category: "Winterization",
    date: "2026-11-10",
    done: false
  }
];

// ============================================================
// DAILY TEMPLATE GENERATOR
// ============================================================

const getInitialTemplate = (
  dateObj,
  rainChance = 0,
  tempF = 70,
  goats = [],
  sunriseTime = "6:30 AM",
  sunsetTime = "7:00 PM"
) => {
  const dayName = dateObj.toLocaleDateString("en-US", {
    weekday: "long"
  });

  const dateStr = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  const isMashDay = dayName === "Monday" || dayName === "Friday";
  const isSunday = dayName === "Sunday";

  const start = new Date(dateObj.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (dateObj - start) / 86400000
  );

  const isBackwashDay = dayOfYear % 2 === 0;

  // ----------------------------------------------------------
  // SMART FEED CALCULATOR
  // ----------------------------------------------------------

  const milkers = goats.filter(
    (g) => g.role === "Milking Doe"
  ).length;

  const dryDoes = goats.filter(
    (g) => g.role === "Dry Doe"
  ).length;

  const bucks = goats.filter(
    (g) => g.role === "Herd Sire"
  ).length;

  const kidsCount = goats.filter(
    (g) => g.role === "Kid"
  ).length;

  const totalCups =
    milkers * 1.5 +
    dryDoes * 0.75 +
    bucks * 1.0 +
    kidsCount * 0.25;

  const mashDetails = [
    `TOTAL CALCULATED MASH: ${totalCups} CUPS NEEDED`,
    `• Milking Does (${milkers}): ${milkers * 1.5} c`,
    `• Dry Does (${dryDoes}): ${dryDoes * 0.75} c`,
    `• Herd Sires (${bucks}): ${bucks * 1.0} c`,
    `• Kids (${kidsCount}): ${kidsCount * 0.25} c`,
    "INSTRUCTIONS:",
    "• 3-3.5 pitchers of Mash into tote (yellow lid)",
    "• Soak 15-20 min, strain (fluid to compost)",
    "• Add 4-5 tbsp blackstrap molasses"
  ];

  // ----------------------------------------------------------
  // WEATHER TASKS
  // ----------------------------------------------------------

  const weatherTasksMorning = [];
  const weatherTasksEvening = [];

  if (tempF < 32) {
    weatherTasksMorning.push({
      id: "w_freeze_1",
      task: "CHECK HEATED WATER BUCKETS",
      measure: "Ensure de-icers working (<32°F)"
    });

    weatherTasksMorning.push({
      id: "w_freeze_2",
      task: "ADD EXTRA BARN BEDDING",
      measure: "Deep straw layers for heat retention"
    });
  } else if (tempF > 90) {
    weatherTasksMorning.push({
      id: "w_heat_1",
      task: "ADD ICE BLOCKS / ELECTROLYTES",
      measure: "Goat & chicken waters (>90°F)"
    });

    weatherTasksMorning.push({
      id: "w_heat_2",
      task: "TURN ON COOP MISTERS",
      measure: "Keep chickens cool"
    });
  }

  // ----------------------------------------------------------
  // KIDDING COUNTDOWN
  // ----------------------------------------------------------

  const kiddingAlerts = [];

  goats.forEach((g) => {
    if (g.bredDate) {
      const bDate = new Date(g.bredDate);

      const estKidding = new Date(bDate);
      estKidding.setDate(
        bDate.getDate() + 150
      );

      const daysUntil = Math.ceil(
        (estKidding - dateObj) /
          (1000 * 60 * 60 * 24)
      );

      if (daysUntil >= 0 && daysUntil <= 14) {
        kiddingAlerts.push({
          id: `kid_alert_${g.id}`,
          task: `🐐 KIDDING PREP: ${g.name.toUpperCase()} (Due in ~${daysUntil} days)`,
          measure:
            "Check udder ligaments, set up kidding pen, verify towels & heat lamps"
        });
      }
    }
  });

  // ----------------------------------------------------------
  // RETURN DAY TEMPLATE
  // ----------------------------------------------------------

  return {
    dateStr,

    morning: [
      ...weatherTasksMorning,
      ...kiddingAlerts,

      {
        id: "m1",
        task: "ALL GOATS HAY",
        measure: "Daily / Fresh"
      },

      {
        id: "m2",
        task: "CLEAN / REFILL WATERS",
        measure: "If murky/dirty"
      },

      {
        id: "m3",
        task: "ELECTRIC FENCE ON",
        measure: `At Sunrise (${sunriseTime})`
      },

      {
        id: "m4",
        task: "ALL CHICKENS TREATS",
        measure: "Daily morning"
      },

      {
        id: "m5",
        task: "POOL PUMP ON",
        measure: "Check Strainer/Chlorine"
      },

      ...(isBackwashDay
        ? [
            {
              id: "m6",
              task: "BACKWASH SAND FILTER",
              measure: "90 SECONDS"
            }
          ]
        : []),

      {
        id: "m7",
        task: isMashDay
          ? "FEED MASH (NO GRAIN)"
          : `FEED GOATS GRAIN (${totalCups} Cups Total)`,

        measure: isMashDay
          ? "FOLLOW CALCULATED MASH LIST BELOW"
          : `${milkers} Milking, ${dryDoes} Dry, ${bucks} Sires, ${kidsCount} Kids`,

        mash: isMashDay ? mashDetails : null
      },

      {
        id: "m8",
        task: "LET GOATS OUT",
        measure: "One pen at a time"
      }
    ],

    afternoon: [
      {
        id: "a1",
        task: `FEED GOATS GRAIN (${totalCups} Cups Total)`,
        measure: "Evening Feeding Schedule"
      },

      {
        id: "a2",
        task: "TOP OFF GOAT HAY",
        measure: "Check all racks"
      }
    ],

    evening: [
      ...weatherTasksEvening,

      {
        id: "e1",
        task: "WATER GARDEN",
        measure:
          rainChance > 40
            ? "AUTO-SKIP: RAIN"
            : "6:30-7:00 PM",
        isGarden: true,
        autoSkip: rainChance > 40
      },

      {
        id: "e2",
        task: "POOL PUMP OFF",
        measure: "5:00 PM"
      },

      {
        id: "e3",
        task: "ELECTRIC FENCE OFF",
        measure: `At Sunset (${sunsetTime})`
      }
    ],

    house: [
      {
        id: "h1",
        task: "FEED CATS",
        measure: "Morning & Evening"
      },

      {
        id: "h2",
        task: "CLEAN LITTER BOXES",
        measure: "Daily"
      },

      {
        id: "h3",
        task: "SWEEP / MOP",
        measure: "Main Floors"
      },

      {
        id: "h4",
        task: "CHANGE PET WATER",
        measure: "Fresh daily"
      },

      ...(isSunday
        ? [
            {
              id: "h5",
              task: "TAKE TRASH TO ROAD",
              measure: "SUNDAY NIGHT"
            }
          ]
        : [])
    ]
  };
};

// ============================================================
// INPUT STYLE
// ============================================================

const inputStyle = {
  width: "100%",
  backgroundColor: "#000",
  border: "1px solid #333",
  borderRadius: "6px",
  color: "#fff",
  padding: "8px 10px",
  fontSize: "12px",
  boxSizing: "border-box"
};

// ============================================================
// HOME MENU BUTTON STYLE
// ============================================================

const menuBtnStyle = (color) => ({
  backgroundColor: "#0d0d0d",
  color,
  border: `1px solid ${color}`,
  borderRadius: "10px",
  minHeight: "70px",
  padding: "8px 4px",
  fontSize: "21px",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px"
});

// ============================================================
// GENERAL BUTTON STYLE
// ============================================================

const navBtnStyle = (color) => ({
  backgroundColor: "#0d0d0d",
  color,
  border: `1px solid ${color}`,
  borderRadius: "10px",
  padding: "12px",
  fontSize: "11px",
  fontWeight: "bold",
  cursor: "pointer",
  textAlign: "center"
});

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [view, setView] = useState("hub");
  const [selectedDay, setSelectedDay] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isMasterEdit, setIsMasterEdit] = useState(false);

  // ----------------------------------------------------------
  // MASTER APP STATE
  // ----------------------------------------------------------

  const [appData, setAppData] = useState({
    brand: "DEVARIM",
    notes: "",
    checks: {},
    currentWeek: [],
    goats: DEFAULT_GOATS,
    supplies: DEFAULT_SUPPLIES,
    shiftNotes: [],
    flaggedTasks: [],
    seasonalTasks: DEFAULT_SEASONAL_TASKS
  });

  // ----------------------------------------------------------
  // GOAT FORM STATE
  // ----------------------------------------------------------

  const [editingGoat, setEditingGoat] = useState(null);

  const [newGoat, setNewGoat] = useState({
    name: "",
    role: "Milking Doe",
    weight: "",
    color: "",
    lastCheck: "",
    photoUrl: "",
    dam: "",
    sire: "",
    bredDate: ""
  });

  // ----------------------------------------------------------
  // HAND-OFF STATE
  // ----------------------------------------------------------

  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteAuthor, setNewNoteAuthor] = useState("");

  // ----------------------------------------------------------
  // INITIALIZE APP
  // ----------------------------------------------------------

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      html,
      body,
      #root {
        background-color: #000 !important;
        margin: 0;
        padding: 0;
        color-scheme: dark;
      }

      * {
        box-sizing: border-box;
      }

      button,
      input,
      textarea,
      select {
        font-family: inherit;
      }

      button:active {
        transform: scale(0.98);
      }

      input::placeholder,
      textarea::placeholder {
        color: #666;
      }

      select option {
        background-color: #111;
        color: #fff;
      }
    `;

    document.head.appendChild(style);

    async function init() {
      let weatherObj = null;

      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_KEY}&q=${LOCATION}&days=7`
        );

        if (res.ok) {
          weatherObj = await res.json();
        }
      } catch (e) {
        console.error("Weather unreachable", e);
      }

      let saved = {};

      try {
        saved = JSON.parse(
          localStorage.getItem("devarim_master_v2") || "{}"
        );
      } catch (e) {
        console.error("Unable to load saved ranch data", e);
      }

      const loadedGoats =
        saved.goats || DEFAULT_GOATS;

      const loadedSupplies =
        saved.supplies || DEFAULT_SUPPLIES;

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const tempF =
        weatherObj?.current?.temp_f || 70;

      const sunrise =
        weatherObj?.forecast?.forecastday?.[0]?.astro
          ?.sunrise || "6:30 AM";

      const sunset =
        weatherObj?.forecast?.forecastday?.[0]?.astro
          ?.sunset || "7:00 PM";

      const newWeek = Array.from(
        { length: 7 },
        (_, i) => {
          const d = new Date(today);

          d.setDate(today.getDate() + i);

          const dayRain =
            weatherObj?.forecast?.forecastday?.[i]?.day
              ?.daily_chance_of_rain || 0;

          return getInitialTemplate(
            d,
            dayRain,
            tempF,
            loadedGoats,
            sunrise,
            sunset
          );
        }
      );

      setAppData({
        brand: saved.brand || "DEVARIM",
        notes: saved.notes || "",
        checks: saved.checks || {},
        goats: loadedGoats,
        supplies: loadedSupplies,
        shiftNotes: saved.shiftNotes || [],
        flaggedTasks: saved.flaggedTasks || [],
        seasonalTasks:
          saved.seasonalTasks ||
          DEFAULT_SEASONAL_TASKS,
        currentWeek: newWeek
      });

      setWeather(weatherObj);
    }

    init();

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ----------------------------------------------------------
  // SAVE DATA
  // ----------------------------------------------------------

  const save = (upd) => {
    const updatedData = {
      ...appData,
      ...upd
    };

    setAppData(updatedData);

    try {
      localStorage.setItem(
        "devarim_master_v2",
        JSON.stringify(updatedData)
      );
    } catch (e) {
      console.error("Unable to save ranch data", e);
    }
  };

  // ----------------------------------------------------------
  // CHECK SECTION COMPLETION
  // ----------------------------------------------------------

  const isSecDone = (dayStr, secName) => {
    const day = appData.currentWeek.find(
      (d) => d.dateStr === dayStr
    );

    if (!day || !day[secName]) {
      return false;
    }

    return day[secName].every(
      (t) =>
        appData.checks[dayStr]?.[t.id] ||
        t.autoSkip
    );
  };

  // ----------------------------------------------------------
  // OVERDUE CHECK
  // ----------------------------------------------------------

  const isOverdue = (dateStr) => {
    if (!dateStr) {
      return false;
    }

    const diffDays =
      (new Date() - new Date(dateStr)) /
      (1000 * 60 * 60 * 24);

    return diffDays > 60;
  };

  // ----------------------------------------------------------
  // UPDATE A CHECKBOX
  // ----------------------------------------------------------

  const toggleTask = (dayStr, taskId) => {
    save({
      checks: {
        ...appData.checks,

        [dayStr]: {
          ...(appData.checks[dayStr] || {}),

          [taskId]:
            !appData.checks[dayStr]?.[taskId]
        }
      }
    });
  };

  // ----------------------------------------------------------
  // ADD GOAT
  // ----------------------------------------------------------

  const addGoat = () => {
    if (!newGoat.name.trim()) {
      return;
    }

    const updated = [
      ...appData.goats,

      {
        ...newGoat,
        id: "g_" + Date.now(),
        lastCheck:
          newGoat.lastCheck ||
          new Date()
            .toISOString()
            .split("T")[0]
      }
    ];

    save({
      goats: updated
    });

    setNewGoat({
      name: "",
      role: "Milking Doe",
      weight: "",
      color: "",
      lastCheck: "",
      photoUrl: "",
      dam: "",
      sire: "",
      bredDate: ""
    });
  };

  // ----------------------------------------------------------
  // SAVE GOAT UPDATE
  // ----------------------------------------------------------

  const saveGoatUpdate = () => {
    const updated = appData.goats.map((g) =>
      g.id === editingGoat.id
        ? editingGoat
        : g
    );

    save({
      goats: updated
    });

    setEditingGoat(null);
  };

  // ----------------------------------------------------------
  // ADD HAND-OFF NOTE
  // ----------------------------------------------------------

  const addShiftNote = () => {
    if (!newNoteText.trim()) {
      return;
    }

    const noteObj = {
      id: "n_" + Date.now(),
      author:
        newNoteAuthor.trim() || "Anon",
      text: newNoteText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    save({
      shiftNotes: [
        noteObj,
        ...appData.shiftNotes
      ]
    });

    setNewNoteText("");
    setNewNoteAuthor("");
  };

  // ----------------------------------------------------------
  // APP LOADING
  // ----------------------------------------------------------

  if (!appData.currentWeek.length) {
    return (
      <div
        style={{
          backgroundColor: "#000",
          color: GOLD,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        <div
          style={{
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: "34px",
              fontWeight: "900",
              letterSpacing: "3px"
            }}
          >
            DEVARIM
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#666",
              fontSize: "10px",
              letterSpacing: "3px"
            }}
          >
            LOADING RANCH OPERATIONS
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // APP
  // ==========================================================

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#FFF",
        minHeight: "100vh",
        padding: "15px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto"
        }}
      >

        {/* ====================================================
            HOME PAGE
            TITLE + WEATHER + DAYS + 3 COLUMN MENU
        ==================================================== */}

        {view === "hub" && (
          <>
            {/* TITLE */}

            {isMasterEdit ? (
              <input
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "32px",
                  fontWeight: "900",
                  color: GOLD,
                  background: "none",
                  border: `1px dashed ${GOLD}`,
                  marginBottom: "5px",
                  boxSizing: "border-box"
                }}
                value={appData.brand}
                onChange={(e) =>
                  save({
                    brand: e.target.value
                  })
                }
              />
            ) : (
              <h1
                style={{
                  textAlign: "center",
                  fontSize: "36px",
                  fontWeight: "900",
                  color: GOLD,
                  margin: "5px 0 0",
                  letterSpacing: "2px"
                }}
              >
                {appData.brand}
              </h1>
            )}

            <p
              style={{
                textAlign: "center",
                color: "#555",
                fontSize: "9px",
                letterSpacing: "4px",
                marginBottom: "18px"
              }}
            >
              RANCH OPERATIONS HUB
            </p>

            {/* WEATHER */}

            {weather && (
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  borderRadius: "15px",
                  padding: "15px",
                  marginBottom: "18px",
                  border: "1px solid #1a1a1a",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: "900",
                      color: GOLD
                    }}
                  >
                    {Math.round(
                      weather.current.temp_f
                    )}
                    °F
                  </div>

                  <div
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      letterSpacing: "1px"
                    }}
                  >
                    {weather.current.condition.text.toUpperCase()}{" "}
                    • RUSSELLVILLE
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right"
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: BLUE,
                      fontWeight: "bold"
                    }}
                  >
                    🌧️{" "}
                    {
                      weather.forecast
                        .forecastday[0].day
                        .daily_chance_of_rain
                    }
                    % Rain
                  </div>

                  <div
                    style={{
                      fontSize: "10px",
                      color: "#aaa",
                      marginTop: "4px"
                    }}
                  >
                    ☀️{" "}
                    {
                      weather.forecast
                        .forecastday[0].astro.sunrise
                    }
                    {" / "}
                    🌙{" "}
                    {
                      weather.forecast
                        .forecastday[0].astro.sunset
                    }
                  </div>
                </div>
              </div>
            )}

            {/* DAYS OF THE WEEK */}

            <div
              style={{
                display: "grid",
                gap: "8px",
                marginBottom: "20px"
              }}
            >
              {appData.currentWeek.map(
                (day, index) => (
                  <div
                    key={day.dateStr}
                    onClick={() => {
                      setSelectedDay(day);
                      setView("day");
                    }}
                    style={{
                      backgroundColor: "#0d0d0d",
                      padding: "14px",
                      borderRadius: "13px",
                      border:
                        index === 0
                          ? `1px solid ${GOLD}`
                          : "1px solid #222",
                      cursor: "pointer"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: "800"
                          }}
                        >
                          {index === 0
                            ? "TODAY"
                            : day.dateStr}
                        </div>

                        {index === 0 && (
                          <div
                            style={{
                              color: "#777",
                              fontSize: "9px",
                              marginTop: "2px"
                            }}
                          >
                            {day.dateStr}
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          color: GOLD,
                          fontSize: "10px",
                          fontWeight: "bold"
                        }}
                      >
                        OPEN →
                      </div>
                    </div>

                    {/* COMPLETION BARS */}

                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        marginTop: "9px"
                      }}
                    >
                      {[
                        "morning",
                        "afternoon",
                        "evening",
                        "house"
                      ].map((section) => {
                        const complete =
                          isSecDone(
                            day.dateStr,
                            section
                          );

                        return (
                          <div
                            key={section}
                            style={{
                              flex: 1,
                              height: "4px",
                              borderRadius: "3px",
                              backgroundColor:
                                complete
                                  ? GREEN
                                  : "#333"
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* 3 COLUMN MENU */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                gap: "8px",
                marginBottom: "15px"
              }}
            >
              <button
                onClick={() =>
                  setView("goats")
                }
                style={menuBtnStyle(GOLD)}
              >
                <span>🐐</span>
                <span
                  style={{
                    fontSize: "9px"
                  }}
                >
                  GOATS
                </span>
              </button>

              <button
                onClick={() =>
                  setView("emergency")
                }
                style={menuBtnStyle(RED)}
              >
                <span>🚨</span>
                <span
                  style={{
                    fontSize: "9px"
                  }}
                >
                  EMERGENCY
                </span>
              </button>

              <button
                onClick={() =>
                  setView("cabinet")
                }
                style={menuBtnStyle(BLUE)}
              >
                <span>💊</span>
                <span
                  style={{
                    fontSize: "9px"
                  }}
                >
                  SUPPLIES
                </span>
              </button>

              <button
                onClick={() =>
                  setView("handoff")
                }
                style={menuBtnStyle(ORANGE)}
              >
                <span>📝</span>
                <span
                  style={{
                    fontSize: "9px"
                  }}
                >
                  HAND-OFF
                </span>
              </button>

              <button
                onClick={() =>
                  setView("seasonal")
                }
                style={menuBtnStyle(PURPLE)}
              >
                <span>🚜</span>
                <span
                  style={{
                    fontSize: "9px"
                  }}
                >
                  SEASONAL
                </span>
              </button>

              <button
                onClick={() =>
                  setIsMasterEdit(
                    !isMasterEdit
                  )
                }
                style={menuBtnStyle(GOLD)}
              >
                <span>⚙️</span>
                <span
                  style={{
                    fontSize: "9px"
                  }}
                >
                  {isMasterEdit
                    ? "SAVE"
                    : "MASTER EDIT"}
                </span>
              </button>
            </div>

            {/* LOW SUPPLY ALERT */}

            {appData.supplies.some(
              (s) => s.isLow
            ) && (
              <div
                onClick={() =>
                  setView("cabinet")
                }
                style={{
                  backgroundColor: "#2a0808",
                  border: `1px solid ${RED}`,
                  borderRadius: "10px",
                  padding: "9px",
                  marginBottom: "15px",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    color: RED,
                    fontWeight: "bold",
                    fontSize: "10px"
                  }}
                >
                  ⚠️ LOW SUPPLY ALERT
                </div>

                <div
                  style={{
                    color: "#aaa",
                    fontSize: "9px",
                    marginTop: "2px"
                  }}
                >
                  {appData.supplies
                    .filter(
                      (s) => s.isLow
                    )
                    .map((s) => s.name)
                    .join(", ")}
                </div>
              </div>
            )}
          </>
        )}

        {/* ====================================================
            ALL OTHER PAGES
        ==================================================== */}

        {view !== "hub" && (
          <div>
            {/* BACK BUTTON */}

            <button
              onClick={() =>
                setView("hub")
              }
              style={{
                color: GOLD,
                background: "none",
                border: "none",
                fontWeight: "bold",
                marginBottom: "15px",
                fontSize: "15px",
                cursor: "pointer"
              }}
            >
              ← BACK TO HOME
            </button>

            {/* =================================================
                DAY CHECKLIST
            ================================================= */}

            {view === "day" &&
              selectedDay && (
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      marginBottom: "20px",
                      color: GOLD
                    }}
                  >
                    {selectedDay.dateStr}{" "}
                    Operations
                  </h2>

                  {[
                    "morning",
                    "afternoon",
                    "evening",
                    "house"
                  ].map((section) => (
                    <div
                      key={section}
                      style={{
                        marginBottom: "30px"
                      }}
                    >
                      <div
                        style={{
                          color: GOLD,
                          fontSize: "11px",
                          letterSpacing: "2px",
                          marginBottom: "10px",
                          borderBottom:
                            "1px solid #1a1a1a",
                          paddingBottom: "4px",
                          fontWeight: "bold"
                        }}
                      >
                        {section.toUpperCase()}
                      </div>

                      {selectedDay[
                        section
                      ].map((task) => {
                        const isChecked =
                          appData.checks[
                            selectedDay
                              .dateStr
                          ]?.[
                            task.id
                          ] ||
                          task.autoSkip;

                        return (
                          <div
                            key={task.id}
                            onClick={() =>
                              !task.autoSkip &&
                              toggleTask(
                                selectedDay.dateStr,
                                task.id
                              )
                            }
                            style={{
                              backgroundColor:
                                "#0d0d0d",
                              padding: "14px",
                              borderRadius:
                                "12px",
                              marginBottom:
                                "8px",
                              opacity:
                                isChecked
                                  ? 0.35
                                  : 1,
                              border:
                                "1px solid #1a1a1a",
                              cursor:
                                task.autoSkip
                                  ? "default"
                                  : "pointer"
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "flex-start"
                              }}
                            >
                              <div
                                style={{
                                  width: "18px",
                                  height: "18px",
                                  border: `2px solid ${
                                    task.autoSkip
                                      ? BLUE
                                      : GOLD
                                  }`,
                                  backgroundColor:
                                    isChecked
                                      ? task.autoSkip
                                        ? BLUE
                                        : GOLD
                                      : "transparent",
                                  borderRadius:
                                    "5px",
                                  marginRight:
                                    "12px",
                                  flexShrink: 0
                                }}
                              />

                              <div
                                style={{
                                  flex: 1
                                }}
                              >
                                <div
                                  style={{
                                    fontSize:
                                      "15px",
                                    fontWeight:
                                      "700",
                                    textDecoration:
                                      task.autoSkip
                                        ? "line-through"
                                        : "none"
                                  }}
                                >
                                  {task.task}
                                </div>

                                <div
                                  style={{
                                    color:
                                      task.autoSkip
                                        ? BLUE
                                        : GOLD,
                                    fontSize:
                                      "11px",
                                    marginTop:
                                      "2px"
                                  }}
                                >
                                  {task.measure}
                                </div>

                                {task.mash &&
                                  !isChecked && (
                                    <div
                                      style={{
                                        marginTop:
                                          "10px",
                                        padding:
                                          "12px",
                                        backgroundColor:
                                          "#000",
                                        borderRadius:
                                          "8px",
                                        fontSize:
                                          "11px",
                                        borderLeft:
                                          `3px solid ${GOLD}`,
                                        color:
                                          "#ccc",
                                        lineHeight:
                                          "1.5"
                                      }}
                                    >
                                      {task.mash.map(
                                        (
                                          line,
                                          i
                                        ) => (
                                          <div
                                            key={
                                              i
                                            }
                                            style={{
                                              marginBottom:
                                                "2px",
                                              fontWeight:
                                                line.includes(
                                                  ":"
                                                )
                                                  ? "bold"
                                                  : "normal",
                                              color:
                                                line.includes(
                                                  ":"
                                                )
                                                  ? GOLD
                                                  : "#ccc"
                                            }}
                                          >
                                            {line}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

            {/* =================================================
                GOAT REGISTRY
            ================================================= */}

            {view === "goats" && (
              <div>
                <h2
                  style={{
                    fontSize: "22px",
                    marginBottom: "15px",
                    color: GOLD
                  }}
                >
                  🐐 Goat Herd & Breeding
                  Registry
                </h2>

                {/* ADD GOAT */}

                <div
                  style={{
                    backgroundColor: "#0d0d0d",
                    padding: "15px",
                    borderRadius: "12px",
                    marginBottom: "20px",
                    border: "1px solid #222"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: GOLD,
                      marginBottom: "10px"
                    }}
                  >
                    REGISTER NEW GOAT
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "8px",
                      marginBottom: "8px"
                    }}
                  >
                    <input
                      placeholder="Name"
                      value={
                        newGoat.name
                      }
                      onChange={(e) =>
                        setNewGoat({
                          ...newGoat,
                          name: e.target
                            .value
                        })
                      }
                      style={inputStyle}
                    />

                    <select
                      value={
                        newGoat.role
                      }
                      onChange={(e) =>
                        setNewGoat({
                          ...newGoat,
                          role: e.target
                            .value
                        })
                      }
                      style={inputStyle}
                    >
                      <option>
                        Milking Doe
                      </option>
                      <option>
                        Dry Doe
                      </option>
                      <option>
                        Herd Sire
                      </option>
                      <option>
                        Kid
                      </option>
                    </select>

                    <input
                      placeholder="Weight (lbs)"
                      value={
                        newGoat.weight
                      }
                      onChange={(e) =>
                        setNewGoat({
                          ...newGoat,
                          weight: e.target
                            .value
                        })
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Color / Markings"
                      value={
                        newGoat.color
                      }
                      onChange={(e) =>
                        setNewGoat({
                          ...newGoat,
                          color: e.target
                            .value
                        })
                      }
                      style={inputStyle}
                    />

                    <select
                      value={newGoat.dam}
                      onChange={(e) =>
                        setNewGoat({
                          ...newGoat,
                          dam: e.target
                            .value
                        })
                      }
                      style={inputStyle}
                    >
                      <option value="">
                        Select Dam (Mother)
                      </option>

                      {appData.goats.map(
                        (goat) => (
                          <option
                            key={goat.id}
                            value={
                              goat.name
                            }
                          >
                            {goat.name}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      value={
                        newGoat.sire
                      }
                      onChange={(e) =>
                        setNewGoat({
                          ...newGoat,
                          sire: e.target
                            .value
                        })
                      }
                      style={inputStyle}
                    >
                      <option value="">
                        Select Sire (Father)
                      </option>

                      {appData.goats.map(
                        (goat) => (
                          <option
                            key={goat.id}
                            value={
                              goat.name
                            }
                          >
                            {goat.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <input
                    placeholder="Photo Image URL (Optional)"
                    value={
                      newGoat.photoUrl
                    }
                    onChange={(e) =>
                      setNewGoat({
                        ...newGoat,
                        photoUrl:
                          e.target.value
                      })
                    }
                    style={{
                      ...inputStyle,
                      marginBottom:
                        "8px"
                    }}
                  />

                  <div
                    style={{
                      fontSize: "10px",
                      color: "#aaa",
                      marginBottom: "4px"
                    }}
                  >
                    Breeding Date (if bred):
                  </div>

                  <input
                    type="date"
                    value={
                      newGoat.bredDate
                    }
                    onChange={(e) =>
                      setNewGoat({
                        ...newGoat,
                        bredDate:
                          e.target.value
                      })
                    }
                    style={{
                      ...inputStyle,
                      marginBottom:
                        "10px"
                    }}
                  />

                  <button
                    onClick={addGoat}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor:
                        GOLD,
                      color: "#000",
                      fontWeight: "bold",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    + ADD GOAT TO HERD
                  </button>
                </div>

                {/* GOAT LIST */}

                <div
                  style={{
                    display: "grid",
                    gap: "15px"
                  }}
                >
                  {appData.goats.map(
                    (goat) => {
                      const overdue =
                        isOverdue(
                          goat.lastCheck
                        );

                      let estDueStr =
                        null;

                      let daysUntilDue =
                        null;

                      if (
                        goat.bredDate
                      ) {
                        const bDate =
                          new Date(
                            goat.bredDate
                          );

                        const due =
                          new Date(
                            bDate
                          );

                        due.setDate(
                          bDate.getDate() +
                            150
                        );

                        estDueStr =
                          due.toLocaleDateString(
                            "en-US",
                            {
                              month:
                                "short",
                              day: "numeric",
                              year: "numeric"
                            }
                          );

                        daysUntilDue =
                          Math.ceil(
                            (due -
                              new Date()) /
                              (1000 *
                                60 *
                                60 *
                                24)
                          );
                      }

                      return (
                        <div
                          key={goat.id}
                          style={{
                            backgroundColor:
                              "#0d0d0d",
                            borderRadius:
                              "12px",
                            padding:
                              "15px",
                            border:
                              overdue
                                ? `1px solid ${RED}`
                                : "1px solid #222"
                          }}
                        >
                          <div
                            style={{
                              display:
                                "flex",
                              gap: "12px",
                              alignItems:
                                "center",
                              marginBottom:
                                "10px"
                            }}
                          >
                            {goat.photoUrl ? (
                              <img
                                src={
                                  goat.photoUrl
                                }
                                alt={
                                  goat.name
                                }
                                style={{
                                  width:
                                    "50px",
                                  height:
                                    "50px",
                                  borderRadius:
                                    "25px",
                                  objectFit:
                                    "cover"
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width:
                                    "50px",
                                  height:
                                    "50px",
                                  borderRadius:
                                    "25px",
                                  backgroundColor:
                                    "#222",
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  justifyContent:
                                    "center",
                                  fontSize:
                                    "20px"
                                }}
                              >
                                🐐
                              </div>
                            )}

                            <div
                              style={{
                                flex: 1
                              }}
                            >
                              <div
                                style={{
                                  fontSize:
                                    "18px",
                                  fontWeight:
                                    "bold",
                                  color:
                                    GOLD
                                }}
                              >
                                {
                                  goat.name
                                }
                              </div>

                              <div
                                style={{
                                  fontSize:
                                    "11px",
                                  color:
                                    "#888"
                                }}
                              >
                                {
                                  goat.role
                                }{" "}
                                •{" "}
                                {
                                  goat.weight
                                }{" "}
                                lbs •{" "}
                                {
                                  goat.color
                                }
                              </div>

                              {(goat.dam ||
                                goat.sire) && (
                                <div
                                  style={{
                                    fontSize:
                                      "10px",
                                    color:
                                      BLUE,
                                    marginTop:
                                      "2px"
                                  }}
                                >
                                  Pedigree:
                                  {" "}
                                  Dam:{" "}
                                  {goat.dam ||
                                    "N/A"}{" "}
                                  | Sire:{" "}
                                  {goat.sire ||
                                    "N/A"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* GESTATION */}

                          {goat.bredDate && (
                            <div
                              style={{
                                backgroundColor:
                                  "#151500",
                                border: `1px solid ${GOLD}`,
                                padding:
                                  "8px",
                                borderRadius:
                                  "6px",
                                fontSize:
                                  "11px",
                                marginBottom:
                                  "8px",
                                color:
                                  "#eee"
                              }}
                            >
                              🤰{" "}
                              <strong>
                                Bred Date:
                              </strong>{" "}
                              {
                                goat.bredDate
                              }{" "}
                              |{" "}
                              <strong>
                                Est Kidding:
                              </strong>{" "}
                              {estDueStr}{" "}
                              (
                              {
                                daysUntilDue
                              }{" "}
                              days)
                            </div>
                          )}

                          {/* CHECKUP */}

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "center",
                              backgroundColor:
                                "#000",
                              padding:
                                "8px",
                              borderRadius:
                                "6px",
                              border:
                                "1px solid #1a1a1a"
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize:
                                    "10px",
                                  color:
                                    "#888"
                                }}
                              >
                                LAST CHECK-UP /
                                HOOF TRIM:
                              </div>

                              <div
                                style={{
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    "bold",
                                  color:
                                    overdue
                                      ? RED
                                      : GREEN
                                }}
                              >
                                {goat.lastCheck ||
                                  "Never"}{" "}
                                {overdue &&
                                  "(OVERDUE >60 DAYS)"}
                              </div>
                            </div>

                            <button
                              onClick={() =>
                                setEditingGoat(
                                  goat
                                )
                              }
                              style={{
                                backgroundColor:
                                  "#222",
                                color:
                                  GOLD,
                                border: `1px solid ${GOLD}`,
                                padding:
                                  "5px 10px",
                                borderRadius:
                                  "4px",
                                fontSize:
                                  "10px",
                                fontWeight:
                                  "bold",
                                cursor:
                                  "pointer"
                              }}
                            >
                              UPDATE
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* GOAT EDIT MODAL */}

                {editingGoat && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor:
                        "rgba(0,0,0,0.85)",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      padding: "20px",
                      zIndex: 100
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          "#111",
                        border: `1px solid ${GOLD}`,
                        padding: "20px",
                        borderRadius:
                          "12px",
                        width: "100%",
                        maxWidth: "400px"
                      }}
                    >
                      <h3
                        style={{
                          color: GOLD,
                          margin:
                            "0 0 10px"
                        }}
                      >
                        Update{" "}
                        {
                          editingGoat.name
                        }{" "}
                        Record
                      </h3>

                      <div
                        style={{
                          fontSize: "11px",
                          color: "#aaa",
                          marginBottom:
                            "5px"
                        }}
                      >
                        Check-up Date:
                      </div>

                      <input
                        type="date"
                        value={
                          editingGoat.lastCheck
                        }
                        onChange={(e) =>
                          setEditingGoat({
                            ...editingGoat,
                            lastCheck:
                              e.target
                                .value
                          })
                        }
                        style={{
                          ...inputStyle,
                          marginBottom:
                            "10px"
                        }}
                      />

                      <div
                        style={{
                          fontSize: "11px",
                          color: "#aaa",
                          marginBottom:
                            "5px"
                        }}
                      >
                        Current Weight
                        (lbs):
                      </div>

                      <input
                        type="number"
                        value={
                          editingGoat.weight
                        }
                        onChange={(e) =>
                          setEditingGoat({
                            ...editingGoat,
                            weight:
                              e.target.value
                          })
                        }
                        style={{
                          ...inputStyle,
                          marginBottom:
                            "15px"
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          gap: "10px"
                        }}
                      >
                        <button
                          onClick={
                            saveGoatUpdate
                          }
                          style={{
                            flex: 1,
                            padding:
                              "10px",
                            backgroundColor:
                              GOLD,
                            color:
                              "#000",
                            border:
                              "none",
                            borderRadius:
                              "6px",
                            fontWeight:
                              "bold"
                          }}
                        >
                          SAVE UPDATE
                        </button>

                        <button
                          onClick={() =>
                            setEditingGoat(
                              null
                            )
                          }
                          style={{
                            padding:
                              "10px",
                            backgroundColor:
                              "#333",
                            color:
                              "#fff",
                            border:
                              "none",
                            borderRadius:
                              "6px"
                          }}
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                EMERGENCY
            ================================================= */}

            {view === "emergency" && (
              <div>
                <h2
                  style={{
                    fontSize: "22px",
                    marginBottom: "15px",
                    color: RED
                  }}
                >
                  🚨 Red-Alert Emergency
                  Protocols
                </h2>

                <div
                  style={{
                    backgroundColor:
                      "#250606",
                    border: `1px solid ${RED}`,
                    borderRadius:
                      "10px",
                    padding: "10px",
                    marginBottom:
                      "15px",
                    color: "#ffb3b0",
                    fontSize: "11px",
                    lineHeight: "1.4"
                  }}
                >
                  Emergency protocols are
                  provided as a quick-reference
                  ranch checklist. For serious
                  animal emergencies, contact
                  your veterinarian promptly.
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "15px"
                  }}
                >
                  {EMERGENCY_CARDS.map(
                    (card, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor:
                            "#0d0d0d",
                          borderRadius:
                            "12px",
                          padding:
                            "16px",
                          border: `1px solid ${card.color}`
                        }}
                      >
                        <h3
                          style={{
                            color:
                              card.color,
                            margin:
                              "0 0 10px",
                            fontSize:
                              "16px"
                          }}
                        >
                          {card.title}
                        </h3>

                        {card.steps.map(
                          (
                            step,
                            stepIndex
                          ) => (
                            <div
                              key={
                                stepIndex
                              }
                              style={{
                                fontSize:
                                  "12px",
                                color:
                                  "#ddd",
                                marginBottom:
                                  "8px",
                                lineHeight:
                                  "1.4"
                              }}
                            >
                              {step}
                            </div>
                          )
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                CABINET
            ================================================= */}

            {view === "cabinet" && (
              <div>
                <h2
                  style={{
                    fontSize: "22px",
                    marginBottom: "15px",
                    color: BLUE
                  }}
                >
                  💊 Ranch Meds &
                  Supply Cabinet
                </h2>

                <div
                  style={{
                    backgroundColor:
                      "#061525",
                    border: `1px solid ${BLUE}`,
                    borderRadius:
                      "10px",
                    padding: "10px",
                    marginBottom:
                      "15px",
                    color: "#b9dcf5",
                    fontSize: "10px"
                  }}
                >
                  Tap MARK LOW to flag an
                  item. Flagged items appear
                  on the home dashboard.
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "10px"
                  }}
                >
                  {appData.supplies.map(
                    (supply) => (
                      <div
                        key={supply.id}
                        style={{
                          backgroundColor:
                            "#0d0d0d",
                          padding:
                            "14px",
                          borderRadius:
                            "10px",
                          border:
                            supply.isLow
                              ? `1px solid ${RED}`
                              : "1px solid #222",
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "10px"
                        }}
                      >
                        <div
                          style={{
                            flex: 1
                          }}
                        >
                          <div
                            style={{
                              fontSize:
                                "15px",
                              fontWeight:
                                "bold",
                              color:
                                supply.isLow
                                  ? RED
                                  : "#eee"
                            }}
                          >
                            {
                              supply.name
                            }
                          </div>

                          <div
                            style={{
                              fontSize:
                                "11px",
                              color:
                                "#888"
                            }}
                          >
                            Category:{" "}
                            {
                              supply.category
                            }{" "}
                            • In Stock:{" "}
                            <strong
                              style={{
                                color:
                                  GOLD
                              }}
                            >
                              {
                                supply.qty
                              }
                            </strong>
                          </div>

                          <div
                            style={{
                              fontSize:
                                "10px",
                              color:
                                "#666",
                              marginTop:
                                "2px"
                            }}
                          >
                            Exp Date:{" "}
                            {
                              supply.expDate
                            }
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated =
                              appData.supplies.map(
                                (s) =>
                                  s.id ===
                                  supply.id
                                    ? {
                                        ...s,
                                        isLow:
                                          !s.isLow
                                      }
                                    : s
                              );

                            save({
                              supplies:
                                updated
                            });
                          }}
                          style={{
                            backgroundColor:
                              supply.isLow
                                ? RED
                                : "#222",
                            color:
                              "#fff",
                            border:
                              "none",
                            padding:
                              "6px 12px",
                            borderRadius:
                              "6px",
                            fontSize:
                              "10px",
                            fontWeight:
                              "bold",
                            cursor:
                              "pointer"
                          }}
                        >
                          {supply.isLow
                            ? "FLAGGED LOW"
                            : "MARK LOW"}
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* =================================================
                HAND-OFF
            ================================================= */}

            {view === "handoff" && (
              <div>
                <h2
                  style={{
                    fontSize: "22px",
                    marginBottom: "15px",
                    color: ORANGE
                  }}
                >
                  📝 Shift / Chore
                  Hand-Off Notes
                </h2>

                <div
                  style={{
                    backgroundColor:
                      "#0d0d0d",
                    padding: "15px",
                    borderRadius:
                      "12px",
                    marginBottom:
                      "20px",
                    border:
                      "1px solid #222"
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "12px",
                      fontWeight:
                        "bold",
                      color:
                        ORANGE,
                      marginBottom:
                        "8px"
                    }}
                  >
                    LOG CHORE NOTE /
                    FLAGGED TASK
                  </div>

                  <input
                    placeholder="Your Name"
                    value={
                      newNoteAuthor
                    }
                    onChange={(e) =>
                      setNewNoteAuthor(
                        e.target
                          .value
                      )
                    }
                    style={{
                      ...inputStyle,
                      marginBottom:
                        "8px"
                    }}
                  />

                  <textarea
                    placeholder="e.g. 6:45 AM - Daisy seemed slow eating grain, gave extra probios."
                    value={
                      newNoteText
                    }
                    onChange={(e) =>
                      setNewNoteText(
                        e.target
                          .value
                      )
                    }
                    style={{
                      ...inputStyle,
                      height: "60px",
                      marginBottom:
                        "8px",
                      resize:
                        "vertical"
                    }}
                  />

                  <button
                    onClick={
                      addShiftNote
                    }
                    style={{
                      width:
                        "100%",
                      padding:
                        "10px",
                      backgroundColor:
                        ORANGE,
                      color:
                        "#000",
                      fontWeight:
                        "bold",
                      border:
                        "none",
                      borderRadius:
                        "6px",
                      cursor:
                        "pointer"
                    }}
                  >
                    POST SHIFT LOG
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "10px"
                  }}
                >
                  {appData.shiftNotes.map(
                    (note) => (
                      <div
                        key={note.id}
                        style={{
                          backgroundColor:
                            "#0d0d0d",
                          padding:
                            "12px",
                          borderRadius:
                            "8px",
                          borderLeft:
                            `3px solid ${ORANGE}`
                        }}
                      >
                        <div
                          style={{
                            fontSize:
                              "10px",
                            color:
                              ORANGE,
                            fontWeight:
                              "bold"
                          }}
                        >
                          {
                            note.author
                          }{" "}
                          @{" "}
                          {
                            note.time
                          }
                        </div>

                        <div
                          style={{
                            fontSize:
                              "13px",
                            color:
                              "#eee",
                            marginTop:
                              "4px",
                            lineHeight:
                              "1.4"
                          }}
                        >
                          {
                            note.text
                          }
                        </div>
                      </div>
                    )
                  )}
                </div>

                {appData.shiftNotes
                  .length === 0 && (
                  <div
                    style={{
                      textAlign:
                        "center",
                      color:
                        "#555",
                      fontSize:
                        "12px",
                      padding:
                        "30px 10px"
                    }}
                  >
                    No shift notes
                    yet.
                  </div>
                )}
              </div>
            )}

            {/* =================================================
                SEASONAL
            ================================================= */}

            {view === "seasonal" && (
              <div>
                <h2
                  style={{
                    fontSize: "22px",
                    marginBottom: "15px",
                    color: PURPLE
                  }}
                >
                  🚜 Seasonal Ranch
                  Maintenance
                </h2>

                <div
                  style={{
                    backgroundColor:
                      "#12091a",
                    border: `1px solid ${PURPLE}`,
                    borderRadius:
                      "10px",
                    padding: "10px",
                    marginBottom:
                      "15px",
                    color: "#d8bde8",
                    fontSize: "10px"
                  }}
                >
                  Tap a maintenance task
                  to mark it complete.
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "10px"
                  }}
                >
                  {appData.seasonalTasks.map(
                    (task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          const updated =
                            appData.seasonalTasks.map(
                              (item) =>
                                item.id ===
                                task.id
                                  ? {
                                      ...item,
                                      done:
                                        !item.done
                                    }
                                  : item
                            );

                          save({
                            seasonalTasks:
                              updated
                          });
                        }}
                        style={{
                          backgroundColor:
                            "#0d0d0d",
                          padding:
                            "14px",
                          borderRadius:
                            "10px",
                          border:
                            "1px solid #222",
                          opacity:
                            task.done
                              ? 0.4
                              : 1,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          cursor:
                            "pointer"
                        }}
                      >
                        <div
                          style={{
                            width:
                              "18px",
                            height:
                              "18px",
                            border: `2px solid ${PURPLE}`,
                            backgroundColor:
                              task.done
                                ? PURPLE
                                : "transparent",
                            borderRadius:
                              "4px",
                            marginRight:
                              "12px",
                            flexShrink:
                              0
                          }}
                        />

                        <div>
                          <div
                            style={{
                              fontSize:
                                "14px",
                              fontWeight:
                                "bold",
                              textDecoration:
                                task.done
                                  ? "line-through"
                                  : "none"
                            }}
                          >
                            {
                              task.title
                            }
                          </div>

                          <div
                            style={{
                              fontSize:
                                "10px",
                              color:
                                "#888",
                              marginTop:
                                "2px"
                            }}
                          >
                            Category:{" "}
                            {
                              task.category
                            }{" "}
                            • Target Date:{" "}
                            {
                              task.date
                            }
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
