/**
 * Phase 0.5: Calculation verification ??5 representative counties.
 * Compares the spec formula (docs/solar-pseo-handoff-spec-v2.md Â§4) against
 * seed-data estimates and (if NLR_API_KEY is set) live NLR API values.
 *
 * Usage:
 *   node scripts/verify_calc.mjs                  # seed-only mode
 *   NLR_API_KEY=xxx node scripts/verify_calc.mjs  # full API mode
 */

import { computeEconomics, computeCountyEconomics } from "../lib/pvwatts.js";
import { states } from "../lib/solar-data.js";

// ---------------------------------------------------------------------------
// 5 test counties: chosen to span rate, sun, and policy diversity
// Manual ("hand-calc") values are derived from spec formula with public data.
// ---------------------------------------------------------------------------
const TEST_COUNTIES = [
  {
    label: "Maui County, HI",
    stateAbbr: "HI",
    lat: 20.8,
    lon: -156.3,
    // Manual calc: prod=1400 kWh/kW, rate=$0.423/kWh, nem=0.75, $/W=$4.00
    // nc=28000; savings=4443/yr; payback??.3; net25k??7
    manualPaybackMin: 5,
    manualPaybackMax: 8,
    manualNet25kMin: 70,
    manualNet25kMax: 90,
    note: "High rate, capped NEM ??should show Exceptional score",
  },
  {
    label: "Middlesex County, MA",
    stateAbbr: "MA",
    lat: 42.4,
    lon: -71.4,
    // Manual calc: prod=1150, rate=$0.306, nem=1.0, $/W=$3.80
    // nc=26600; savings=3519/yr; payback??.6; net25k??7
    manualPaybackMin: 7,
    manualPaybackMax: 10,
    manualNet25kMin: 45,
    manualNet25kMax: 65,
    note: "High rate, full NEM, lower production ??should show Strong score",
  },
  {
    label: "Maricopa County, AZ",
    stateAbbr: "AZ",
    lat: 33.4,
    lon: -112.1,
    // Manual calc: prod=1900, rate=$0.152, nem=0.85, $/W=$2.90
    // nc=20300; savings=2454/yr; payback??.3; net25k??4
    manualPaybackMin: 7,
    manualPaybackMax: 12,
    manualNet25kMin: 28,
    manualNet25kMax: 50,
    note: "High sun, moderate rate, net billing ??APS territory",
  },
  {
    label: "San Diego County, CA",
    stateAbbr: "CA",
    lat: 32.7,
    lon: -117.2,
    // Manual calc: prod=1750, rate=$0.318, nem=0.60 (NEM 3.0), $/W=$3.20
    // nc=22400; savings=3342/yr; payback??.7; net25k??2
    manualPaybackMin: 6,
    manualPaybackMax: 12,
    manualNet25kMin: 35,
    manualNet25kMax: 65,
    note: "High rate, but NEM 3.0 reduces export value ??SDG&E territory",
  },
  {
    label: "King County, WA",
    stateAbbr: "WA",
    lat: 47.6,
    lon: -122.3,
    // Manual calc: prod=1050, rate=$0.104, nem=1.0, $/W=$3.00
    // nc=21000; savings=1092/yr; payback??9.2; net25k??
    manualPaybackMin: 16,
    manualPaybackMax: 25,
    manualNet25kMin: -5,
    manualNet25kMax: 15,
    note: "Cheap hydro power ??solar rarely makes financial sense here",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getState(abbr) {
  return states.find((s) => s.abbr === abbr);
}

function seedCalc(stateData) {
  const systemKw = 10;
  const grossCost = systemKw * 1000 * stateData.costPerWatt;
  const netCost = grossCost * 0.70;
  const annualSavings =
    systemKw * stateData.avgProduction * (stateData.rate / 100) * stateData.netMeteringFactor;
  if (annualSavings <= 0) return null;
  const paybackYears = netCost / annualSavings;
  let totalSavings = 0;
  let prod = systemKw * stateData.avgProduction;
  for (let yr = 1; yr <= 25; yr++) {
    totalSavings += prod * (stateData.rate / 100) * stateData.netMeteringFactor;
    prod *= 0.995;
  }
  const net25k = Math.round((totalSavings - netCost) / 1000);
  return { paybackYears: Math.round(paybackYears * 10) / 10, net25k };
}

function inRange(val, min, max) {
  return val >= min && val <= max;
}

function check(label, val, min, max) {
  const pass = inRange(val, min, max);
  const marker = pass ? "PASS" : "FAIL";
  console.log(`  ${marker} ${label}: ${val} (expected ${min}-${max})`);
  return pass;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const useApi = Boolean(process.env.NLR_API_KEY && process.env.NLR_API_KEY !== "DEMO_KEY");
console.log(`\n${"=".repeat(60)}`);
console.log("Phase 0.5 Calculation Verification");
console.log(`Mode: ${useApi ? "LIVE NLR API + seed comparison" : "SEED DATA ONLY (set NLR_API_KEY for API mode)"}`);
console.log(`${"=".repeat(60)}\n`);

let totalChecks = 0;
let passedChecks = 0;
const failures = [];

for (const county of TEST_COUNTIES) {
  const stateData = getState(county.stateAbbr);
  if (!stateData) {
    console.log(`SKIP ${county.label}: state ${county.stateAbbr} not found in seed data\n`);
    continue;
  }

  console.log(`County: ${county.label}`);
  console.log(`  State: ${county.stateAbbr} | Lat: ${county.lat} | Lon: ${county.lon}`);
  console.log(`  ${county.note}`);
  console.log(`  Seed: rate=${stateData.rate} cents/kWh, nem=${stateData.netMeteringFactor}, $/W=$${stateData.costPerWatt}, prod=${stateData.avgProduction}kWh/kW/yr`);

  // Seed-data calculation
  const seed = seedCalc(stateData);
  if (seed) {
    console.log(`  Seed calc: payback ${seed.paybackYears}yr, net25 $${seed.net25k}k`);
  }

  // Manual range check (seed calc)
  if (seed) {
    const pb = check("Seed payback in manual range", seed.paybackYears, county.manualPaybackMin, county.manualPaybackMax);
    const n25 = check("Seed net25k in manual range", seed.net25k, county.manualNet25kMin, county.manualNet25kMax);
    totalChecks += 2;
    if (pb) passedChecks++;
    else failures.push(`${county.label}: seed payback ${seed.paybackYears} outside [${county.manualPaybackMin}, ${county.manualPaybackMax}]`);
    if (n25) passedChecks++;
    else failures.push(`${county.label}: seed net25k ${seed.net25k} outside [${county.manualNet25kMin}, ${county.manualNet25kMax}]`);
  }

  // Live API (if key present)
  if (useApi) {
    try {
      console.log(`  Calling NLR API (lat=${county.lat}, lon=${county.lon})...`);
      const api = await computeCountyEconomics(county.lat, county.lon, stateData, 10);
      if (api) {
        console.log(`  API calc: payback ${api.paybackYears}yr, net25 $${api.net25k}k`);
        console.log(`  API pvwatts: ac_annual=${api.pvwatts.acAnnual} kWh/yr, solrad=${api.pvwatts.solradAnnual} kWh/m2/day`);
        console.log(`  API utility rate: $${api.utilityRate.residential}/kWh residential`);

        const pbApi = check("API payback in manual range", api.paybackYears, county.manualPaybackMin, county.manualPaybackMax);
        const n25Api = check("API net25k in manual range", api.net25k, county.manualNet25kMin, county.manualNet25kMax);
        totalChecks += 2;
        if (pbApi) passedChecks++;
        else failures.push(`${county.label}: API payback ${api.paybackYears} outside [${county.manualPaybackMin}, ${county.manualPaybackMax}]`);
        if (n25Api) passedChecks++;
        else failures.push(`${county.label}: API net25k ${api.net25k} outside [${county.manualNet25kMin}, ${county.manualNet25kMax}]`);

        // Seed vs API drift check: payback should agree within +/-4yr
        if (seed) {
          const drift = Math.abs(seed.paybackYears - api.paybackYears);
          const driftOk = drift <= 4;
          check(`Seed vs API payback drift <= 4yr (drift=${drift.toFixed(1)})`, drift, 0, 4);
          totalChecks++;
          if (driftOk) passedChecks++;
          else failures.push(`${county.label}: seed/API payback drift ${drift.toFixed(1)}yr exceeds 4yr tolerance`);
        }
      }
    } catch (err) {
      console.log(`  API ERROR: ${err.message}`);
      failures.push(`${county.label}: API call failed: ${err.message}`);
    }
  }

  console.log();
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`${"=".repeat(60)}`);
console.log(`Result: ${passedChecks}/${totalChecks} checks passed`);

if (failures.length) {
  console.log("\nFailed checks:");
  for (const f of failures) console.log(`  - ${f}`);
  console.log();
  process.exit(1);
} else {
  console.log("All checks passed. Calculation logic verified.");
  process.exit(0);
}
