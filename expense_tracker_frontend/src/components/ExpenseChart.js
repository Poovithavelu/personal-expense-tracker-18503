/**
 * Simple bar chart visual for monthly totals by category using SVG (no external deps).
 */
import React, { useMemo } from "react";
import { Card, Section } from "./UI";

function groupByMonthAndCategory(expenses) {
  // Create a key "YYYY-MM|categoryName"
  const map = new Map();
  expenses.forEach((e) => {
    const month = (e.expense_date || "").slice(0, 7); // YYYY-MM
    const cat = e.category_name || e.category || e.category_id || "Uncategorized";
    const key = `${month}|${cat || "Uncategorized"}`;
    const prev = map.get(key) || 0;
    map.set(key, prev + Number(e.amount || 0));
  });

  const months = new Set();
  const categories = new Set();

  [...map.keys()].forEach((k) => {
    const [m, c] = k.split("|");
    months.add(m);
    categories.add(c);
  });

  // Sort months chronologically
  const monthList = [...months].sort();
  const categoryList = [...categories];

  // Build matrix months x categories
  const data = monthList.map((m) => {
    const row = { month: m };
    categoryList.forEach((c) => {
      const key = `${m}|${c}`;
      row[c] = map.get(key) || 0;
    });
    return row;
  });

  return { monthList, categoryList, data };
}

// PUBLIC_INTERFACE
export function ExpenseChart({ expenses, categoryNames }) {
  /**
   * Render stacked bar chart of monthly totals per category.
   * Props:
   *  - expenses: list of expense objects
   *  - categoryNames: map of {category_id: category_name}
   */
  const normalized = useMemo(() => {
    // Attach name to each expense for grouping
    return expenses.map((e) => ({
      ...e,
      category_name: e.category_id ? categoryNames.get(e.category_id) : "Uncategorized",
    }));
  }, [expenses, categoryNames]);

  const { monthList, categoryList, data } = useMemo(
    () => groupByMonthAndCategory(normalized),
    [normalized]
  );

  // Chart setup
  const width = Math.max(600, monthList.length * 80);
  const height = 260;
  const padding = { top: 10, right: 10, bottom: 50, left: 50 };

  const totals = data.map((row) =>
    categoryList.reduce((acc, c) => acc + (row[c] || 0), 0)
  );
  const maxTotal = Math.max(1, ...totals);

  const colors = categoryList.reduce((acc, c, idx) => {
    const hue = (idx * 67) % 360;
    acc[c] = `hsl(${hue}, 70%, 50%)`;
    return acc;
  }, {});

  const barWidth = (width - padding.left - padding.right) / Math.max(1, monthList.length) - 20;
  const xPositions = monthList.map(
    (_, i) => padding.left + i * ((width - padding.left - padding.right) / Math.max(1, monthList.length)) + 10
  );

  return (
    <Section title="Monthly Overview">
      <Card>
        {monthList.length === 0 ? (
          <div>No data yet to visualize.</div>
        ) : (
          <>
            <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Monthly expenses chart">
              {/* Axes */}
              <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="var(--border-color)" />
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="var(--border-color)" />

              {/* Bars */}
              {data.map((row, idx) => {
                const x = xPositions[idx];
                let y = height - padding.bottom;
                return (
                  <g key={row.month}>
                    {categoryList.map((c) => {
                      const value = row[c] || 0;
                      const h = (value / maxTotal) * (height - padding.top - padding.bottom);
                      y -= h;
                      return (
                        <rect
                          key={`${row.month}-${c}`}
                          x={x}
                          y={y}
                          width={barWidth}
                          height={h}
                          fill={colors[c]}
                        >
                          <title>{`${row.month} • ${c}: ${value.toFixed(2)}`}</title>
                        </rect>
                      );
                    })}
                    {/* Month label */}
                    <text x={x + barWidth / 2} y={height - padding.bottom + 18} fontSize="10" textAnchor="middle" fill="var(--text-primary)">
                      {row.month}
                    </text>
                  </g>
                );
              })}

              {/* Y axis ticks */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const y = height - padding.bottom - t * (height - padding.top - padding.bottom);
                const val = maxTotal * t;
                return (
                  <g key={t}>
                    <line x1={padding.left - 4} y1={y} x2={width - padding.right} y2={y} stroke="var(--border-color)" strokeDasharray="2,4" />
                    <text x={padding.left - 8} y={y + 4} fontSize="10" textAnchor="end" fill="var(--text-primary)">
                      {val.toFixed(0)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
              {categoryList.map((c) => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 12, height: 12, background: colors[c], display: "inline-block", borderRadius: 2 }} />
                  <span style={{ fontSize: 12 }}>{c}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </Section>
  );
}
