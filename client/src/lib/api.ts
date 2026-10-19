import { getVisitorId } from './visitor';

export type Property = {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  country: string;
  location: string;
  price: number;
  priceLabel: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: string | null;
  yearBuilt: number | null;
  garage: number | null;
  description: string;
  features: string[];
  amenities: string[];
  images: string[];
  featured: boolean;
  agentId: number | null;
};

export type Agent = {
  id: number;
  slug: string;
  name: string;
  role: string;
  phone: string | null;
  email: string | null;
  photo: string | null;
  bio: string | null;
  linkedin: string | null;
};

export type PropertyDetail = Property & { agent: Agent | null };

export type PropertyQuery = {
  search?: string;
  location?: string;
  type?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  beds?: number | string;
  baths?: number | string;
  sort?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
};

export type Facets = {
  locations: string[];
  types: string[];
  minPrice: number;
  maxPrice: number;
};

export type PropertyListResponse = {
  items: Property[];
  total: number;
  facets: Facets;
};

export type InquiryPayload = {
  kind: 'contact' | 'viewing' | 'newsletter' | 'valuation';
  name?: string;
  email: string;
  phone?: string;
  message?: string;
  propertySlug?: string;
  preferredDate?: string;
};

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (payload && typeof payload.error === 'string' && payload.error) || 'Request failed';
    throw new ApiError(message, response.status, payload?.fields);
  }

  return payload as T;
}

function toQueryString(query: PropertyQuery): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) return;
    params.set(key, String(value));
  });
  const serialised = params.toString();
  return serialised ? `?${serialised}` : '';
}

export const api = {
  listProperties(query: PropertyQuery = {}, signal?: AbortSignal) {
    return request<PropertyListResponse>(`/properties${toQueryString(query)}`, { signal });
  },

  async getProperty(slug: string, signal?: AbortSignal) {
    const { property } = await request<{ property: PropertyDetail }>(`/properties/${slug}`, { signal });
    return property;
  },

  async getSimilar(slug: string, signal?: AbortSignal) {
    const { items } = await request<{ items: Property[] }>(`/properties/${slug}/similar`, { signal });
    return items;
  },

  async listAgents(signal?: AbortSignal) {
    const { items } = await request<{ items: Agent[] }>('/agents', { signal });
    return items;
  },

  async listFavorites(signal?: AbortSignal) {
    const { items } = await request<{ items: Property[] }>('/favorites', {
      signal,
      headers: { 'x-visitor-id': getVisitorId() },
    });
    return items;
  },

  saveFavorite(propertyId: number) {
    return request<{ saved: boolean }>('/favorites', {
      method: 'POST',
      headers: { 'x-visitor-id': getVisitorId() },
      body: JSON.stringify({ propertyId }),
    });
  },

  removeFavorite(propertyId: number) {
    return request<{ saved: boolean }>(`/favorites/${propertyId}`, {
      method: 'DELETE',
      headers: { 'x-visitor-id': getVisitorId() },
    });
  },

  createInquiry(payload: InquiryPayload) {
    return request<{ ok: boolean; id: number }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
