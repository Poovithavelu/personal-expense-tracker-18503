/**
 * Expense list and filters
 */
import React, { useMemo, useState } from "react";
import { Button, Card, ErrorBanner, Input, Section, Select } from "./UI";
import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";

function currency(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  return num.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

// PUBLIC_INTERFACE
export function ExpenseList({ onEdit }) {
  /**
   * Render expense list with filters and CSV export.
   * Props:
   *  - onEdit: function(expense) to open edit form
   */
  const { categories } = useCategories();
  const [localFilters, setLocalFilters] = useState({
    start_date: "",
    end_date: "",
    category_id: "",
  });

  const { expenses, loading, error, setFilters, remove, exportCsv } = useExpenses({
    start_date: "",
    end_date: "",
    category_id: "",
  });

  const categoryMap = useMemo(() => {
    const m = new Map();
    categories.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories]);

  const total = useMemo(
    () => expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0),
    [expenses]
  );

  const applyFilters = () => {
    setFilters({
      start_date: localFilters.start_date || undefined,
      end_date: localFilters.end_date || undefined,
      category_id:
        localFilters.category_id === "" ? undefined : Number(localFilters.category_id),
    });
  };

  const resetFilters = () => {
    const reset = { start_date: "", end_date: "", category_id: "" };
    setLocalFilters(reset);
    setFilters({});
  };

  const handleExport = async () => {
    try {
      const url = await exportCsv();
      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e?.message || "Export failed.");
    }
  };

  return (
    <Section
      title="Expenses"
      right={
        <Button onClick={handleExport} aria-label="Export CSV">
          Export CSV
        </Button>
      }
    >
      <Card>
        <ErrorBanner error={error} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Input
            label="Start Date"
            type="date"
            value={localFilters.start_date}
            onChange={(e) =>
              setLocalFilters((f) => ({ ...f, start_date: e.target.value }))
            }
          />
          <Input
            label="End Date"
            type="date"
            value={localFilters.end_date}
            onChange={(e) => setLocalFilters((f) => ({ ...f, end_date: e.target.value }))}
          />
          <Select
            label="Category"
            value={localFilters.category_id}
            onChange={(e) =>
              setLocalFilters((f) => ({ ...f, category_id: e.target.value }))
            }
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <Button onClick={applyFilters}>Apply</Button>
            <Button variant="secondary" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>

        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>Date</th>
                <th style={th}>Category</th>
                <th style={th}>Description</th>
                <th style={th}>Amount</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={td}>
                    Loading...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} style={td}>
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id}>
                    <td style={td}>{e.expense_date}</td>
                    <td style={td}>
                      {e.category_id ? categoryMap.get(e.category_id) : "Uncategorized"}
                    </td>
                    <td style={td}>{e.description || "-"}</td>
                    <td style={{ ...td, textAlign: "right" }}>{currency(e.amount)}</td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Button variant="secondary" onClick={() => onEdit?.(e)}>
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            if (window.confirm("Delete this expense?")) remove(e.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td style={td} colSpan={3}>
                  Total
                </td>
                <td style={{ ...td, textAlign: "right" }}>{currency(total)}</td>
                <td style={td}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </Section>
  );
}

const th = {
  textAlign: "left",
  padding: "8px 6px",
  borderBottom: "1px solid var(--border-color)",
  fontWeight: 600,
  fontSize: 14,
};

const td = {
  padding: "8px 6px",
  borderBottom: "1px solid var(--border-color)",
  fontSize: 14,
};
