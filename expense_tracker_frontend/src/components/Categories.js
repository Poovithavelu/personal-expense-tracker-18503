/**
 * Categories management components
 */
import React, { useEffect, useState } from "react";
import { Button, Card, ErrorBanner, Input, Section } from "./UI";
import { useCategories } from "../hooks/useCategories";

function CategoryForm({ onSubmit, initial }) {
  const [name, setName] = useState(initial?.name || "");
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(initial?.name || "");
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    onSubmit({ name: name.trim() });
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Groceries"
        error={error}
      />
      <Button type="submit">{initial ? "Update Category" : "Add Category"}</Button>
    </form>
  );
}

export function CategoriesManager() {
  const { categories, loading, error, create, update, remove } = useCategories();
  const [editing, setEditing] = useState(null);

  return (
    <Section title="Categories">
      <Card>
        <ErrorBanner error={error} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <h3 style={{ marginTop: 0 }}>Add / Edit</h3>
            <CategoryForm
              initial={editing}
              onSubmit={async (payload) => {
                if (editing) {
                  await update(editing.id, payload);
                  setEditing(null);
                } else {
                  await create(payload);
                }
              }}
            />
          </div>
          <div>
            <h3 style={{ marginTop: 0 }}>Existing</h3>
            {loading ? (
              <div>Loading...</div>
            ) : categories.length === 0 ? (
              <div>No categories yet.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {categories.map((c) => (
                  <li
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid var(--border-color)",
                      padding: "6px 0",
                    }}
                  >
                    <span>{c.name}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant="secondary" onClick={() => setEditing(c)}>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          if (window.confirm("Delete this category?")) remove(c.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>
    </Section>
  );
}
