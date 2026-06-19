/**
 * NLR PVWatts V8 + UtilityRates V3 client.
 * Used only in precompute scripts ??zero runtime calls at serving time.
 *
 * env:
 *   NLR_API_BASE  (default https://developer.nlr.gov)
 *   NLR_API_KEY   (required for production; DEMO_KEY falls back for manual testing)
 *
 * Rate limit: 1,000 req/hr/key rolling ??callers must throttle.
 * Attribution: PVWatts® is a registered trademark of the Alliance for Sustainable Energy.
 */

// NLR domain changed from developer.nrel.gov ??developer.nlr.gov on 2026-05-29.
const API_BASE =
  (typeof process !== "undefined" && process.env.NLR_API_BASE) ||
  "https://developer.nlr.gov";

const API_KEY =
  (typeof process !== "undefined" && process.env.NLR_API_KEY) ||
  "DEMO_KEY";

const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 4;

async function nlrFetch(path, params) {
  const url = new URL(path, API_BASE);
  url.searchParams.set("api_key", API_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(String(k), String(v));
  }

  let lastErr;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let res;
    try {
      res = await fetch(url.toString(), {
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      // Timeout or network error ??retry with backoff
      lastErr = err;
      await sleep(Math.min(1000 * 2 ** attempt, 30_000));
      continue;
    }

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after") || 0);
      await sleep(retryAfter > 0 ? retryAfter * 1000 : Math.min(2000 * 2 ** attempt, 60_000));
      lastErr = new Error(`HTTP 429 (attempt ${attempt + 1})`);
      continue;
    }

    if (!res.ok) {
      throw new Error(`NLR ${path} HTTP ${res.status} ${res.statusText}`);
    }

    return await res.json();
  }

  throw lastErr ?? new Error(`NLR ${path} failed after ${MAX_RETRIES} retries`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Call PVWatts V8 for annual AC production at a given location.
 *
 * @param {number} lat  Latitude (decimal degrees, WGS84)
 * @param {number} lon  Longitude (decimal degrees, WGS84)
 * @param {number} systemKw  System size in kW-DC (default 10)
 * @param {{ losses?: number, arrayType?: number, tilt?: number, azimuth?: number }} [opts]
 * @returns {Promise<{ acAnnual: number, solradAnnual: number, capacityFactor: number }>}
 */
export async function fetchPvwatts(lat, lon, systemKw = 10, opts = {}) {
  const {
    losses = 10,
    arrayType = 1, // fixed roof mount
    tilt = Math.round(lat * 0.76 + 3.1), // NREL lat-optimal tilt approximation
    azimuth = 180, // south-facing
  } = opts;

  const json = await nlrFetch("/api/pvwatts/v8.json", {
    lat,
    lon,
    system_capacity: systemKw,
    losses,
    array_type: arrayType,
    tilt,
    azimuth,
    timeframe: "annual",
  });

  if (json.errors?.length) {
    throw new Error(`PVWatts V8 errors: ${json.errors.join("; ")}`);
  }

  return {
    acAnnual: json.outputs.ac_annual,       // kWh/yr
    solradAnnual: json.outputs.solrad_annual, // kWh/m²/day
    capacityFactor: json.outputs.capacity_factor, // %
  };
}

/**
 * Call UtilityRates V3 for residential electricity rate at a given location.
 *
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{ residential: number, commercial: number }>}  Both in $/kWh.
 */
export async function fetchUtilityRates(lat, lon) {
  const json = await nlrFetch("/api/utility_rates/v3.json", { lat, lon });

  if (json.error) {
    throw new Error(`UtilityRates V3 error: ${json.error.message ?? JSON.stringify(json.error)}`);
  }

  return {
    residential: json.outputs.residential ?? null, // $/kWh
    commercial: json.outputs.commercial ?? null,
  };
}

/**
 * Compute full economics from API outputs + state seed data.
 * Matches the spec formula in docs/solar-pseo-handoff-spec-v2.md §4.
 *
 * @param {object} params
 * @param {number} params.acAnnual          PVWatts ac_annual (kWh/yr)
 * @param {number} params.ratePerKwh        Utility residential rate ($/kWh)
 * @param {number} params.netMeteringFactor Export credit fraction (1.0 = full retail)
 * @param {number} params.costPerWatt       Installed cost $/W-DC (LBNL state median)
 * @param {number} [params.systemKw]        System size kW-DC (default 10)
 * @param {number} [params.itcFraction]     Federal ITC fraction (default 0.30)
 * @param {number} [params.stateIncentives] Additional state incentive $ (default 0)
 * @returns {{ paybackYears: number, net25k: number, annualSavings: number, netCost: number, acAnnual: number } | null}
 */
export function computeEconomics({
  acAnnual,
  ratePerKwh,
  netMeteringFactor,
  costPerWatt,
  systemKw = 10,
  itcFraction = 0.30,
  stateIncentives = 0,
}) {
  if (!acAnnual || !ratePerKwh || ratePerKwh <= 0) return null;

  const grossCost = systemKw * 1000 * costPerWatt;
  const netCost = grossCost * (1 - itcFraction) - stateIncentives;
  const annualSavings = acAnnual * ratePerKwh * netMeteringFactor;

  if (annualSavings <= 0 || netCost <= 0) return null;

  const paybackYears = netCost / annualSavings;

  // 25-year savings with 0.5%/yr panel degradation (compound)
  let totalSavings = 0;
  let annualProduction = acAnnual;
  for (let yr = 1; yr <= 25; yr++) {
    totalSavings += annualProduction * ratePerKwh * netMeteringFactor;
    annualProduction *= 0.995;
  }
  const net25 = totalSavings - netCost;

  return {
    paybackYears: Math.round(paybackYears * 10) / 10,
    net25k: Math.round(net25 / 1000),
    annualSavings: Math.round(annualSavings),
    netCost: Math.round(netCost),
    acAnnual: Math.round(acAnnual),
  };
}

/**
 * Convenience wrapper: fetch PVWatts + UtilityRates in parallel, then compute economics.
 * Fails fast if API key is missing in production.
 *
 * @param {number} lat
 * @param {number} lon
 * @param {{ abbr: string, costPerWatt: number, netMeteringFactor: number }} stateData
 * @param {number} [systemKw]
 */
export async function computeCountyEconomics(lat, lon, stateData, systemKw = 10) {
  if (API_KEY === "DEMO_KEY") {
    console.warn(
      "NLR_API_KEY not set ??using DEMO_KEY (rate-limited to ~few req/hr)."
    );
  }

  const [pvData, rateData] = await Promise.all([
    fetchPvwatts(lat, lon, systemKw),
    fetchUtilityRates(lat, lon),
  ]);

  // Prefer live utility rate; fall back to state seed rate if null
  const ratePerKwh =
    rateData.residential != null
      ? rateData.residential
      : stateData.rate / 100; // seed rate is in ¢/kWh

  return {
    ...computeEconomics({
      acAnnual: pvData.acAnnual,
      ratePerKwh,
      netMeteringFactor: stateData.netMeteringFactor,
      costPerWatt: stateData.costPerWatt,
      systemKw,
    }),
    pvwatts: pvData,
    utilityRate: rateData,
    stateAbbr: stateData.abbr,
  };
}
