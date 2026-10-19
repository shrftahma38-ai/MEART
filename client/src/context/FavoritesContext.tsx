import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, type Property } from '../lib/api';

type FavoritesContextValue = {
  items: Property[];
  isSaved: (propertyId: number) => boolean;
  toggle: (property: Property) => void;
  count: number;
  loading: boolean;
  pendingId: number | null;
  error: string | null;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Saved properties live on the API keyed by an anonymous visitor id, so they
 * survive reloads. Updates are optimistic and roll back if the request fails.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .listFavorites(controller.signal)
      .then((saved) => setItems(saved))
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError('Saved properties are unavailable right now.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const isSaved = useCallback(
    (propertyId: number) => items.some((item) => item.id === propertyId),
    [items],
  );

  const toggle = useCallback(
    (property: Property) => {
      const saved = items.some((item) => item.id === property.id);
      setPendingId(property.id);
      setError(null);
      setItems((previous) =>
        saved ? previous.filter((item) => item.id !== property.id) : [property, ...previous],
      );

      const request = saved ? api.removeFavorite(property.id) : api.saveFavorite(property.id);
      request
        .catch(() => {
          setItems((previous) =>
            saved
              ? [property, ...previous.filter((item) => item.id !== property.id)]
              : previous.filter((item) => item.id !== property.id),
          );
          setError('We could not update your saved properties. Please try again.');
        })
        .finally(() => setPendingId(null));
    },
    [items],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ items, isSaved, toggle, count: items.length, loading, pendingId, error }),
    [items, isSaved, toggle, loading, pendingId, error],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
}
