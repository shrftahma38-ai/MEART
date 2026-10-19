export type AgentRow = {
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

export type PropertyRow = {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  country: string;
  price: string | number;
  price_label: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: string | number;
  sqft: number;
  lot_size: string | null;
  year_built: number | null;
  garage: number | null;
  description: string;
  features: string[] | null;
  amenities: string[] | null;
  images: string[] | null;
  featured: boolean;
  agent_id: number | null;
};

export function mapAgent(row: AgentRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    phone: row.phone,
    email: row.email,
    photo: row.photo,
    bio: row.bio,
    linkedin: row.linkedin,
  };
}

export function mapProperty(row: PropertyRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    state: row.state,
    country: row.country,
    location: `${row.city}, ${row.state}, ${row.country}`,
    price: Number(row.price),
    priceLabel: row.price_label,
    type: row.type,
    status: row.status,
    bedrooms: row.bedrooms,
    bathrooms: Number(row.bathrooms),
    sqft: row.sqft,
    lotSize: row.lot_size,
    yearBuilt: row.year_built,
    garage: row.garage,
    description: row.description,
    features: row.features ?? [],
    amenities: row.amenities ?? [],
    images: row.images ?? [],
    featured: row.featured,
    agentId: row.agent_id,
  };
}

export const PROPERTY_COLUMNS = `p.id, p.slug, p.name, p.city, p.state, p.country, p.price, p.price_label,
  p.type, p.status, p.bedrooms, p.bathrooms, p.sqft, p.lot_size, p.year_built, p.garage,
  p.description, p.features, p.amenities, p.images, p.featured, p.agent_id`;
