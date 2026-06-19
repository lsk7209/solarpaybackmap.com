"use client";

import { useMemo, useState } from "react";

export function Calculator() {
  const [systemKw, setSystemKw] = useState(7);
  const [costW, setCostW] = useState(3.1);
  const [rate, setRate] = useState(18);
  const [production, setProduction] = useState(1350);
  const [exportFactor, setExportFactor] = useState(.85);

  const result = useMemo(() => {
    const gross = systemKw * 1000 * costW;
    const net = gross * .7;
    const annual = systemKw * production * (rate / 100) * exportFactor;
    const payback = annual > 0 ? net / annual : 0;
    const net25 = annual * 25 * .94 - net;
    return { gross, net, annual, payback, net25 };
  }, [systemKw, costW, rate, production, exportFactor]);

  return (
    <div className="card card-pad calculator">
      <fieldset className="calc-fieldset" aria-describedby="calculator-help">
        <legend>Solar payback scenario inputs</legend>
        <p className="dlabel" id="calculator-help">
          Enter quote and bill assumptions to update the payback estimate below.
        </p>
        <div className="calc-grid">
          <div className="field">
            <label htmlFor="system">System size (kW)</label>
            <input id="system" type="number" inputMode="decimal" min="1" max="20" step=".5" value={systemKw} aria-describedby="system-help" onChange={(e) => setSystemKw(clampNumber(e.target.value, 1, 20, 7))} />
            <span className="sr-only" id="system-help">Use a residential system size between 1 and 20 kW.</span>
          </div>
          <div className="field">
            <label htmlFor="cost">Installed cost ($/W)</label>
            <input id="cost" type="number" inputMode="decimal" min="1" max="8" step=".1" value={costW} aria-describedby="cost-help" onChange={(e) => setCostW(clampNumber(e.target.value, 1, 8, 3.1))} />
            <span className="sr-only" id="cost-help">Use installed cost from 1 to 8 dollars per watt.</span>
          </div>
          <div className="field">
            <label htmlFor="rate">Electricity rate (c/kWh)</label>
            <input id="rate" type="number" inputMode="decimal" min="1" max="80" step=".1" value={rate} aria-describedby="rate-help" onChange={(e) => setRate(clampNumber(e.target.value, 1, 80, 18))} />
            <span className="sr-only" id="rate-help">Use a retail electricity rate between 1 and 80 cents per kWh.</span>
          </div>
          <div className="field">
            <label htmlFor="production">Production (kWh/kW/yr)</label>
            <input id="production" type="number" inputMode="numeric" min="800" max="2200" step="25" value={production} aria-describedby="production-help" onChange={(e) => setProduction(clampNumber(e.target.value, 800, 2200, 1350))} />
            <span className="sr-only" id="production-help">Use annual production between 800 and 2200 kWh per kW.</span>
          </div>
          <div className="field">
            <label htmlFor="export">Export-credit factor</label>
            <select id="export" value={exportFactor} aria-describedby="export-help" onChange={(e) => setExportFactor(Number(e.target.value))}>
              <option value="1">Retail credit</option>
              <option value=".85">Typical conservative</option>
              <option value=".55">Net billing</option>
              <option value=".35">Weak export credit</option>
            </select>
            <span className="sr-only" id="export-help">Choose how much exported solar production is worth compared with retail electricity.</span>
          </div>
        </div>
      </fieldset>
      <dl className="calc-assumptions" aria-label="Current solar payback assumptions">
        <div>
          <dt>System</dt>
          <dd>{systemKw} kW at ${costW.toFixed(2)}/W</dd>
        </div>
        <div>
          <dt>Bill value</dt>
          <dd>{rate.toFixed(1)} c/kWh with {production.toLocaleString()} kWh/kW/yr production</dd>
        </div>
        <div>
          <dt>Export scenario</dt>
          <dd>{getExportScenarioLabel(exportFactor)}</dd>
        </div>
      </dl>
      <dl className="stat-grid" aria-label="Solar payback calculator results" aria-live="polite" role="status">
        <div className="stat-card">
          <dt className="dlabel">net cost after 30% credit</dt>
          <dd><output className="metric" htmlFor="system cost rate production export">${Math.round(result.net).toLocaleString()}</output></dd>
        </div>
        <div className="stat-card">
          <dt className="dlabel">estimated annual savings</dt>
          <dd><output className="metric" htmlFor="system cost rate production export">${Math.round(result.annual).toLocaleString()}</output></dd>
        </div>
        <div className="stat-card">
          <dt className="dlabel">simple payback</dt>
          <dd><output className="metric" htmlFor="system cost rate production export">{result.payback.toFixed(1)} yrs</output></dd>
        </div>
        <div className="stat-card">
          <dt className="dlabel">25-year net estimate</dt>
          <dd><output className="metric" htmlFor="system cost rate production export">${Math.round(result.net25).toLocaleString()}</output></dd>
        </div>
      </dl>
      <p className="disclaimer">This calculator is a screening estimate. It excludes roof-specific shading, financing, tax appetite, panel selection, and local installer quote variance.</p>
    </div>
  );
}

function clampNumber(value, min, max, fallback) {
  const next = Number(value);
  if (!Number.isFinite(next)) return fallback;
  return Math.min(max, Math.max(min, next));
}

function getExportScenarioLabel(value) {
  if (value >= 1) return "Retail credit";
  if (value >= .85) return "Typical conservative";
  if (value >= .55) return "Net billing";
  return "Weak export credit";
}
