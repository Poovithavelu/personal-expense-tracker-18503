/**
 * Hook utilities to manage expenses: list, create, update, delete, export.
 * Provides loading and error states, and refresh capabilities.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

// PUBLIC_INTERFACE
export function useExpenses(initialFilters = {}) {
  /**
   * Manage expense list with filters.
   * Returns: { expenses, loading, error, filters, setFilters, refresh, create, update, remove, exportCsv }
   */
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async (activeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listExpenses(activeFilters);
      setExpenses(data || []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  const refresh = useCallback(() => load(filters), [filters, load]);

  const create = useCallback(
    async (payload) => {
      await api.createExpense(payload);
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id, payload) => {
      await api.updateExpense(id, payload);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      await api.deleteExpense(id);
      await refresh();
    },
    [refresh]
  );

  const exportCsv = useCallback(async () => {
    return api.exportExpensesCsv(filters);
  }, [filters]);

  return useMemo(
    () => ({
      expenses,
      loading,
      error,
      filters,
      setFilters,
      refresh,
      create,
      update,
      remove,
      exportCsv,
    }),
    [expenses, loading, error, filters, refresh, create, update, remove, exportCsv]
  );
}
