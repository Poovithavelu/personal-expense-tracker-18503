//
// API service layer for Expense Tracker frontend
// Uses environment variable REACT_APP_API_BASE_URL for backend base URL.
//
// PUBLIC_INTERFACE
export const getApiBaseUrl = () => {
  /**
   * Returns the base URL for the backend API.
   * Reads REACT_APP_API_BASE_URL from environment; falls back to same-origin proxy '/api'.
   */
  // Try .env variable
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, "");
  }
  // Fallback to relative /api to support dev proxy setups if configured externally
  return "/api";
};

const API_BASE = getApiBaseUrl();

// Generic request handler with JSON handling, query params, and error mapping
async function request(path, { method = "GET", body, params } = {}) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}`.length > 0) {
        url.searchParams.append(k, v);
      }
    });
  }

  const headers = {
    "Content-Type": "application/json",
  };

  const res = await fetch(url.toString().replace(window.location.origin, ""), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // No-content
  if (res.status === 204) return null;

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.detail)) ||
      `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// Categories endpoints
// PUBLIC_INTERFACE
export const api = {
  /** List all categories */
  listCategories: () => request("/categories/"),
  /** Create a category */
  createCategory: (payload) => request("/categories/", { method: "POST", body: payload }),
  /** Update category */
  updateCategory: (id, payload) =>
    request(`/categories/${id}`, { method: "PUT", body: payload }),
  /** Delete category */
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  /** List expenses with optional filters (start_date, end_date, category_id)
   * Always normalize to an array to protect UI from runtime errors if backend returns unexpected shapes.
   */
  listExpenses: async (filters) => {
    const data = await request("/expenses/", { params: filters });
    // Normalize server response to array defensively
    if (Array.isArray(data)) return data;
    if (!data) return [];
    // Some backends might wrap list in { items: [...] } or { data: [...] }
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.data)) return data.data;
    // Fallback: not an array, return empty list to avoid reduce/map errors
    return [];
  },
  /** Create expense */
  createExpense: (payload) => request("/expenses/", { method: "POST", body: payload }),
  /** Update expense */
  updateExpense: (id, payload) =>
    request(`/expenses/${id}`, { method: "PUT", body: payload }),
  /** Delete expense */
  deleteExpense: (id) => request(`/expenses/${id}`, { method: "DELETE" }),

  /** Export expenses as CSV with same filters as list */
  exportExpensesCsv: async (filters) => {
    // Build URL with filters, then fetch as blob and return URL for download
    const url = new URL(`${API_BASE}/export/`, window.location.origin);
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && `${v}`.length > 0) {
          url.searchParams.append(k, v);
        }
      });
    }
    const res = await fetch(url.toString().replace(window.location.origin, ""), {
      method: "GET",
      headers: { Accept: "text/csv" },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Export failed with status ${res.status}`);
    }
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  },
};
