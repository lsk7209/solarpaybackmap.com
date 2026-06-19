"use client";

import { useMemo, useState } from "react";
import { grade, scoreColor } from "@/lib/solar-data";

const columns = [
  { id: "rank", label: "Rank", numeric: true, getValue: (state, index) => index + 1 },
  { id: "state", label: "State", getValue: (state) => state.name },
  { id: "score", label: "Score", numeric: true, getValue: (state) => state.score, defaultDirection: "desc" },
  { id: "payback", label: "Payback", numeric: true, getValue: (state) => parseFloat(state.payback) },
  { id: "rate", label: "Rate", numeric: true, getValue: (state) => state.rate },
  { id: "policy", label: "Policy", getValue: (state) => state.policy },
  { id: "net25", label: "25-year net", numeric: true, getValue: (state) => state.net25, defaultDirection: "desc" },
  { id: "reviewed", label: "Reviewed", getValue: (state) => state.sourceDate },
];

export function ScoreTable({ rows }) {
  const [sort, setSort] = useState({ key: "score", direction: "desc" });
  const rankedRows = useMemo(
    () => [...rows].sort((a, b) => b.score - a.score).map((state, index) => ({ ...state, rank: index + 1 })),
    [rows]
  );
  const sorted = useMemo(() => {
    const column = columns.find((item) => item.id === sort.key) || columns[2];
    const direction = sort.direction === "asc" ? 1 : -1;

    return [...rankedRows].sort((a, b) => {
      const aValue = column.id === "rank" ? a.rank : column.getValue(a, a.rank - 1);
      const bValue = column.id === "rank" ? b.rank : column.getValue(b, b.rank - 1);
      if (column.numeric) return (Number(aValue) - Number(bValue)) * direction;
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }, [rankedRows, sort]);

  function updateSort(column) {
    setSort((current) => {
      const defaultDirection = column.defaultDirection || "asc";
      if (current.key !== column.id) return { key: column.id, direction: defaultDirection };
      return { key: column.id, direction: current.direction === "asc" ? "desc" : "asc" };
    });
  }

  return (
    <div className="card rank-table-card">
      <table className="rank">
        <caption>State solar payback ranking table with score, rate, policy, and review date</caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const isSorted = sort.key === column.id;
              const nextDirection = isSorted && sort.direction === "asc" ? "descending" : "ascending";
              const currentDirection = sort.direction === "asc" ? "ascending" : "descending";
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={isSorted ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
                >
                  <button type="button" onClick={() => updateSort(column)} aria-label={`Sort by ${column.label} ${nextDirection}`}>
                    {column.label}
                    <span className="arr" aria-hidden="true">{isSorted ? (sort.direction === "asc" ? "ASC" : "DESC") : ""}</span>
                    {isSorted ? <span className="sr-only">{` currently sorted ${currentDirection}`}</span> : null}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((state) => (
            <tr key={state.abbr}>
              <td className="place">{state.rank}</td>
              <th className="region" scope="row">{state.name}<small>{state.abbr}</small></th>
              <td>
                <span className="pill" style={{ color: scoreColor(state.score) }}>
                  {state.score} - {grade(state.score)}
                </span>
              </td>
              <td>{state.payback} yrs</td>
              <td>{state.rate.toFixed(1)}c/kWh</td>
              <td>{state.policy}</td>
              <td>${state.net25}k</td>
              <td><time dateTime={state.sourceDate}>{state.sourceDate}</time></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
