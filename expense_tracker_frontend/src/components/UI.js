/**
 * Simple UI primitives with minimal styles.
 */
import React from "react";

export function Section({ title, right, children }) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.h2}>{title}</h2>
        <div>{right}</div>
      </div>
      <div>{children}</div>
    </section>
  );
}

export function Card({ children }) {
  return <div style={styles.card}>{children}</div>;
}

export function Button({ variant = "primary", ...props }) {
  const style =
    variant === "secondary"
      ? { ...styles.btn, ...styles.btnSecondary }
      : variant === "danger"
      ? { ...styles.btn, ...styles.btnDanger }
      : styles.btn;
  return <button style={style} {...props} />;
}

export function Input({ label, error, ...props }) {
  return (
    <div style={styles.field}>
      {label && (
        <label style={styles.label}>
          {label}
        </label>
      )}
      <input style={{ ...styles.input, ...(error ? styles.inputError : {}) }} {...props} />
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

export function Select({ label, error, children, ...props }) {
  return (
    <div style={styles.field}>
      {label && <label style={styles.label}>{label}</label>}
      <select style={{ ...styles.input, ...(error ? styles.inputError : {}) }} {...props}>
        {children}
      </select>
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

export function TextArea({ label, error, ...props }) {
  return (
    <div style={styles.field}>
      {label && <label style={styles.label}>{label}</label>}
      <textarea style={{ ...styles.input, height: 80, ...(error ? styles.inputError : {}) }} {...props} />
      {error && <div style={styles.errorText}>{error}</div>}
    </div>
  );
}

export function Loading({ text = "Loading..." }) {
  return <div style={styles.muted}>{text}</div>;
}

export function ErrorBanner({ error }) {
  if (!error) return null;
  const message = error?.message || "Something went wrong.";
  return (
    <div style={styles.errorBanner} role="alert">
      ⚠️ {message}
    </div>
  );
}

const styles = {
  section: {
    margin: "16px 0",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  h2: {
    margin: 0,
    fontSize: 18,
  },
  card: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    padding: 16,
  },
  btn: {
    background: "var(--button-bg)",
    color: "var(--button-text)",
    border: "none",
    borderRadius: 6,
    padding: "8px 12px",
    cursor: "pointer",
  },
  btnSecondary: {
    background: "#6c757d",
  },
  btnDanger: {
    background: "#dc3545",
  },
  field: {
    marginBottom: 12,
  },
  label: {
    display: "block",
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.8,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid var(--border-color)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 4,
  },
  errorBanner: {
    background: "#ffe3e6",
    color: "#6b111a",
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #f5c2c7",
    marginBottom: 12,
  },
  muted: {
    opacity: 0.7,
  },
};
