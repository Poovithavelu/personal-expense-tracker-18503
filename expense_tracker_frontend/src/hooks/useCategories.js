/**
 * Hook utilities to manage categories.
 * Returns list, CRUD helpers, and states.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

// PUBLIC_INTERFACE
export function useCategories() {
  /**
   * Manage categories: list, create, update, delete.
   * Returns: { categories, loading, error, refresh, create, update, remove }
   */
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listCategories();
      setCategories(data || []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => load(), [load]);

  const create = useCallback(
    async (payload) => {
      await api.createCategory(payload);
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id, payload) => {
      await api.updateCategory(id, payload);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      await api.deleteCategory(id);
      await refresh();
    },
    [refresh]
  );

  return useMemo(
    () => ({ categories, loading, error, refresh, create, update, remove }),
    [categories, loading, error, refresh, create, update, remove]
  );
}
