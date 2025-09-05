/**
 * Dashboard page: combines categories manager, expense form (add/edit), expense list, and charts.
 */
import React, { useMemo, useState } from "react";
import { CategoriesManager } from "../components/Categories";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { ExpenseChart } from "../components/ExpenseChart";
import { useExpenses } from "../hooks/useExpenses";
import { useCategories } from "../hooks/useCategories";
import { Button, Section } from "../components/UI";

// PUBLIC_INTERFACE
export default function Dashboard() {
  /**
   * Main dashboard for the expense tracker.
   * Provides:
//  - Expense add/edit
//  - Expense list with filters and export
//  - Category management
//  - Chart visualization
   */
  const [editing, setEditing] = useState(null);
  const { categories } = useCategories();
  const catNameMap = useMemo(() => {
    const m = new Map();
    categories.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories]);

  const { expenses, create, update } = useExpenses();

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Personal Expense Tracker</h1>
        <ThemeToggle />
      </header>

      <ExpenseForm
        initial={editing}
        onSubmit={async (payload) => {
          if (editing) {
            await update(editing.id, payload);
            setEditing(null);
          } else {
            await create(payload);
          }
        }}
        onCancel={() => setEditing(null)}
      />

      <ExpenseList onEdit={(e) => setEditing(e)} />

      <ExpenseChart expenses={expenses} categoryNames={catNameMap} />

      <CategoriesManager />

      <Section title="About">
        <p style={{ opacity: 0.8 }}>
          Use the forms above to add expenses, filter by date/category, visualize monthly totals,
          and export your data as CSV. Categories help you organize spending trends.
        </p>
      </Section>
    </div>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "light");
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  };
  return (
    <Button onClick={toggle} aria-label="Toggle theme">
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </Button>
  );
}
