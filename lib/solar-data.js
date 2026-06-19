const DATA_REVIEWED = "2026-06-09";
const RATE_SOURCE = "U.S. EIA Electric Power Monthly, 2024 residential average";
const POLICY_SOURCE = "DSIRE and state utility-policy review, 2024??025";
const COST_SOURCE = "LBNL Tracking the Sun, 2024 installed cost median";

// costPerWatt: $/W-DC installed (LBNL 2024 median), used for payback modeling
// netMeteringFactor: export credit as fraction of retail rate (1.0 = full retail)
// avgProduction: kWh/yr per kW-DC (PVWatts v8 representative tilt, 10% system losses)
export const states = [
  { abbr: "HI", name: "Hawaii",         score: 95, rate: 42.3, payback: "5-8",   net25: 78, policy: "Program capped",             costPerWatt: 4.0, netMeteringFactor: 0.75, avgProduction: 1400 },
  { abbr: "MA", name: "Massachusetts",  score: 90, rate: 30.6, payback: "7-10",  net25: 54, policy: "Retail net metering",          costPerWatt: 3.8, netMeteringFactor: 1.00, avgProduction: 1150 },
  { abbr: "NY", name: "New York",        score: 84, rate: 25.4, payback: "7-11",  net25: 51, policy: "Retail net metering",          costPerWatt: 3.8, netMeteringFactor: 1.00, avgProduction: 1200 },
  { abbr: "CT", name: "Connecticut",    score: 83, rate: 29.1, payback: "7-11",  net25: 50, policy: "Buyback tariff",               costPerWatt: 3.8, netMeteringFactor: 0.95, avgProduction: 1150 },
  { abbr: "CA", name: "California",     score: 82, rate: 31.8, payback: "8-12",  net25: 49, policy: "NEM 3.0",                      costPerWatt: 3.2, netMeteringFactor: 0.60, avgProduction: 1700 },
  { abbr: "NJ", name: "New Jersey",     score: 82, rate: 22.1, payback: "7-11",  net25: 48, policy: "Retail net metering",          costPerWatt: 3.5, netMeteringFactor: 1.00, avgProduction: 1200 },
  { abbr: "RI", name: "Rhode Island",   score: 80, rate: 28.4, payback: "8-12",  net25: 51, policy: "Retail net metering",          costPerWatt: 3.8, netMeteringFactor: 1.00, avgProduction: 1150 },
  { abbr: "AZ", name: "Arizona",        score: 79, rate: 15.2, payback: "8-12",  net25: 44, policy: "Net billing",                  costPerWatt: 2.9, netMeteringFactor: 0.85, avgProduction: 1900 },
  { abbr: "NH", name: "New Hampshire",  score: 76, rate: 25.2, payback: "9-13",  net25: 41, policy: "Retail net metering",          costPerWatt: 3.5, netMeteringFactor: 1.00, avgProduction: 1100 },
  { abbr: "FL", name: "Florida",        score: 76, rate: 13.9, payback: "9-13",  net25: 32, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1600 },
  { abbr: "NM", name: "New Mexico",     score: 73, rate: 14.4, payback: "9-13",  net25: 43, policy: "Retail net metering",          costPerWatt: 2.9, netMeteringFactor: 1.00, avgProduction: 1850 },
  { abbr: "MD", name: "Maryland",       score: 72, rate: 15.1, payback: "9-13",  net25: 36, policy: "Retail net metering + SREC",   costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1350 },
  { abbr: "CO", name: "Colorado",       score: 72, rate: 14.2, payback: "9-13",  net25: 37, policy: "Retail net metering",          costPerWatt: 3.2, netMeteringFactor: 1.00, avgProduction: 1600 },
  { abbr: "NV", name: "Nevada",         score: 72, rate: 12.3, payback: "8-12",  net25: 36, policy: "Retail net metering",          costPerWatt: 2.8, netMeteringFactor: 1.00, avgProduction: 1900 },
  { abbr: "ME", name: "Maine",          score: 71, rate: 24.6, payback: "8-12",  net25: 38, policy: "Retail net metering",          costPerWatt: 3.5, netMeteringFactor: 1.00, avgProduction: 1100 },
  { abbr: "PA", name: "Pennsylvania",   score: 71, rate: 18.1, payback: "9-13",  net25: 29, policy: "Retail net metering",          costPerWatt: 3.2, netMeteringFactor: 1.00, avgProduction: 1200 },
  { abbr: "NC", name: "North Carolina", score: 71, rate: 12.3, payback: "10-14", net25: 24, policy: "Retail net metering",          costPerWatt: 2.9, netMeteringFactor: 1.00, avgProduction: 1500 },
  { abbr: "VT", name: "Vermont",        score: 70, rate: 23.8, payback: "9-13",  net25: 38, policy: "Net metering (group)",         costPerWatt: 3.4, netMeteringFactor: 1.00, avgProduction: 1100 },
  { abbr: "DC", name: "Washington DC",  score: 69, rate: 16.3, payback: "9-13",  net25: 44, policy: "Retail net metering + SREC",   costPerWatt: 3.5, netMeteringFactor: 1.00, avgProduction: 1350 },
  { abbr: "DE", name: "Delaware",       score: 68, rate: 17.3, payback: "10-14", net25: 34, policy: "Retail net metering",          costPerWatt: 3.1, netMeteringFactor: 1.00, avgProduction: 1350 },
  { abbr: "MI", name: "Michigan",       score: 68, rate: 17.3, payback: "9-13",  net25: 28, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1200 },
  { abbr: "TX", name: "Texas",          score: 68, rate: 14.9, payback: "10-14", net25: 34, policy: "Utility dependent",            costPerWatt: 2.9, netMeteringFactor: 0.80, avgProduction: 1650 },
  { abbr: "WI", name: "Wisconsin",      score: 66, rate: 17.4, payback: "9-14",  net25: 29, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1200 },
  { abbr: "GA", name: "Georgia",        score: 64, rate: 13.2, payback: "10-15", net25: 23, policy: "Retail net metering",          costPerWatt: 2.9, netMeteringFactor: 0.90, avgProduction: 1550 },
  { abbr: "IL", name: "Illinois",       score: 63, rate: 14.4, payback: "10-14", net25: 24, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1300 },
  { abbr: "OH", name: "Ohio",           score: 63, rate: 14.0, payback: "10-14", net25: 21, policy: "Retail net metering",          costPerWatt: 2.9, netMeteringFactor: 1.00, avgProduction: 1250 },
  { abbr: "VA", name: "Virginia",       score: 63, rate: 13.0, payback: "11-15", net25: 21, policy: "Retail net metering",          costPerWatt: 2.9, netMeteringFactor: 0.95, avgProduction: 1400 },
  { abbr: "MN", name: "Minnesota",      score: 62, rate: 14.2, payback: "10-14", net25: 22, policy: "Retail net metering",          costPerWatt: 2.9, netMeteringFactor: 1.00, avgProduction: 1250 },
  { abbr: "SC", name: "South Carolina", score: 61, rate: 13.9, payback: "9-14",  net25: 30, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1550 },
  { abbr: "IN", name: "Indiana",        score: 57, rate: 14.2, payback: "11-15", net25: 18, policy: "Net billing (surplus)",        costPerWatt: 2.8, netMeteringFactor: 0.85, avgProduction: 1300 },
  { abbr: "AK", name: "Alaska",         score: 56, rate: 24.8, payback: "11-15", net25: 27, policy: "Retail net metering",          costPerWatt: 4.5, netMeteringFactor: 1.00, avgProduction: 1000 },
  { abbr: "KS", name: "Kansas",         score: 56, rate: 12.1, payback: "11-15", net25: 24, policy: "Retail net metering",          costPerWatt: 2.8, netMeteringFactor: 1.00, avgProduction: 1500 },
  { abbr: "UT", name: "Utah",           score: 55, rate: 10.4, payback: "11-15", net25: 13, policy: "Net billing",                  costPerWatt: 2.7, netMeteringFactor: 0.70, avgProduction: 1850 },
  { abbr: "IA", name: "Iowa",           score: 55, rate: 13.3, payback: "11-15", net25: 22, policy: "Retail net metering",          costPerWatt: 2.9, netMeteringFactor: 1.00, avgProduction: 1350 },
  { abbr: "MO", name: "Missouri",       score: 52, rate: 13.1, payback: "12-16", net25: 19, policy: "Retail net metering",          costPerWatt: 2.9, netMeteringFactor: 0.90, avgProduction: 1400 },
  { abbr: "OR", name: "Oregon",         score: 50, rate: 11.3, payback: "13-17", net25: 10, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1150 },
  { abbr: "MT", name: "Montana",        score: 48, rate: 11.4, payback: "13-17", net25: 17, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1400 },
  { abbr: "NE", name: "Nebraska",       score: 46, rate: 11.2, payback: "14-18", net25:  9, policy: "Varies by public utility",     costPerWatt: 2.8, netMeteringFactor: 0.75, avgProduction: 1450 },
  { abbr: "AR", name: "Arkansas",       score: 46, rate: 10.5, payback: "13-18", net25: 15, policy: "Retail net metering",          costPerWatt: 2.8, netMeteringFactor: 1.00, avgProduction: 1550 },
  { abbr: "SD", name: "South Dakota",   score: 45, rate: 11.4, payback: "14-18", net25: 20, policy: "Retail net metering",          costPerWatt: 2.8, netMeteringFactor: 1.00, avgProduction: 1450 },
  { abbr: "LA", name: "Louisiana",      score: 44, rate: 10.4, payback: "14-18", net25: 13, policy: "Retail net metering",          costPerWatt: 2.8, netMeteringFactor: 1.00, avgProduction: 1550 },
  { abbr: "OK", name: "Oklahoma",       score: 44, rate: 10.4, payback: "14-18", net25: 14, policy: "Net billing (utility)",        costPerWatt: 2.7, netMeteringFactor: 0.70, avgProduction: 1600 },
  { abbr: "KY", name: "Kentucky",       score: 43, rate: 10.4, payback: "15-20", net25: 11, policy: "Net metering (capacity cap)",  costPerWatt: 2.8, netMeteringFactor: 0.85, avgProduction: 1350 },
  { abbr: "ID", name: "Idaho",          score: 43, rate: 10.3, payback: "15-20", net25: 11, policy: "Retail net metering",          costPerWatt: 2.8, netMeteringFactor: 1.00, avgProduction: 1500 },
  { abbr: "WV", name: "West Virginia",  score: 42, rate: 12.0, payback: "15-20", net25: 11, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1250 },
  { abbr: "ND", name: "North Dakota",   score: 41, rate: 10.1, payback: "16-22", net25:  8, policy: "Retail net metering",          costPerWatt: 2.8, netMeteringFactor: 1.00, avgProduction: 1400 },
  { abbr: "WA", name: "Washington",     score: 38, rate: 10.4, payback: "17-24", net25:  9, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1050 },
  { abbr: "AL", name: "Alabama",        score: 37, rate: 13.4, payback: "14-18", net25: 11, policy: "Avoided cost buyback",         costPerWatt: 2.8, netMeteringFactor: 0.55, avgProduction: 1500 },
  { abbr: "WY", name: "Wyoming",        score: 36, rate: 10.1, payback: "16-22", net25:  7, policy: "Retail net metering",          costPerWatt: 3.0, netMeteringFactor: 1.00, avgProduction: 1500 },
  { abbr: "TN", name: "Tennessee",      score: 35, rate: 11.1, payback: "18-24", net25:  5, policy: "TVA Generation Partners",      costPerWatt: 2.8, netMeteringFactor: 0.50, avgProduction: 1450 },
  { abbr: "MS", name: "Mississippi",    score: 33, rate: 11.3, payback: "16-22", net25:  6, policy: "Avoided cost buyback",         costPerWatt: 2.8, netMeteringFactor: 0.55, avgProduction: 1500 },
].map((state) => ({
  ...state,
  sourceDate: DATA_REVIEWED,
  rateSource: RATE_SOURCE,
  costSource: COST_SOURCE,
  policySource: POLICY_SOURCE,
}));

export const sources = [
  {
    name: "NREL PVWatts v8",
    role: "Solar generation modeling",
    url: "https://pvwatts.nrel.gov/",
  },
  {
    name: "U.S. Energy Information Administration",
    role: "Residential electricity rates (2024)",
    url: "https://www.eia.gov/electricity/",
  },
  {
    name: "LBNL Tracking the Sun",
    role: "Installed cost by state (2024)",
    url: "https://emp.lbl.gov/tracking-the-sun",
  },
  {
    name: "DSIRE",
    role: "State incentive and net metering policy",
    url: "https://www.dsireusa.org/",
  },
];

export function scoreColor(score) {
  if (score >= 85) return "#2F7E78";
  if (score >= 72) return "#6FA89B";
  if (score >= 55) return "#D8C8A6";
  if (score >= 45) return "#D08A6E";
  return "#B5544A";
}

export function grade(score) {
  if (score >= 85) return "Exceptional";
  if (score >= 72) return "Strong";
  if (score >= 55) return "Moderate";
  if (score >= 45) return "Weak";
  return "Poor";
}

/**
 * Estimate payback and 25-yr net savings for a custom system.
 * Seed-data model only; replaced by NLR API county results in Phase 2.
 *
 * @param {string} abbr - State abbreviation
 * @param {number} systemKw - System size in kW-DC (default 10)
 * @returns {{ paybackYears: number, net25k: number } | null}
 */
export function estimateEconomics(abbr, systemKw = 10) {
  const s = states.find((st) => st.abbr === abbr);
  if (!s) return null;
  const grossCost = systemKw * 1000 * s.costPerWatt;
  const netCost = grossCost * 0.70; // 30% federal ITC
  const annualSavings =
    systemKw * s.avgProduction * (s.rate / 100) * s.netMeteringFactor;
  if (annualSavings <= 0) return null;
  const paybackYears = netCost / annualSavings;
  const net25k = Math.round((annualSavings * 25 * 0.94 - netCost) / 1000);
  return { paybackYears: Math.round(paybackYears * 10) / 10, net25k };
}
