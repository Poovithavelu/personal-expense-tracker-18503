/**
 * Expense form component used for create and edit.
 */
import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Section, Select, TextArea } from "./UI";
import { useCategories } from "../hooks/useCategories";

function toISODateInput(dateStr) {
  if (!dateStr) return "";
  return dateStr;
}

// PUBLIC_INTERFACE
export function ExpenseForm({ initial, onSubmit, onCancel }) {
  /**
   * Render a form for expense data.
   * Props:
   *  - initial: existing expense object for editing (optional)
   *  - onSubmit: function(payload)
   *  - onCancel: function()
   */
  const { categories } = useCategories();
  const [form, setForm] = useState({
    amount: "",
    expense_date: "",
    category_id: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        amount: initial.amount ?? "",
        expense_date: toISODateInput(initial.expense_date) ?? "",
        category_id: initial.category_id ?? "",
        description: initial.description ?? "",
      });
    }
  }, [initial]);

  const categoryOptions = useMemo(
    () => [{ id: "", name: "Uncategorized" }, ...categories],
    [categories]
  );

  const validate = () => {
    const e = {};
    if (!form.amount || Number(form.amount) <= 0) {
      e.amount = "Amount must be greater than 0";
    }
    if (!form.expense_date) {
      e.expense_date = "Date is required";
    }
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const payload = {
      amount: Number(form.amount),
      expense_date: form.expense_date,
      category_id: form.category_id === "" ? null : Number(form.category_id),
      description: form.description || null,
    };
    onSubmit(payload);
  };

  return (
    <Section title={initial ? "Edit Expense" : "Add Expense"}>
      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input
              label="Amount"
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              error={errors.amount}
              placeholder="e.g. 25.99"
            />
            <Input
              label="Date"
              type="date"
              value={form.expense_date}
              onChange={(e) => setForm((f) => ({ ...f, expense_date: e.target.value }))}
              error={errors.expense_date}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
            <Select
              label="Category"
              value={form.category_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, category_id: e.target.value }))
              }
            >
              {categoryOptions.map((c) => (
                <option key={c.id || "none"} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <TextArea
              label="Description"
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Optional notes..."
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Button type="submit">{initial ? "Update" : "Add"}</Button>
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </Section>
  );
}
