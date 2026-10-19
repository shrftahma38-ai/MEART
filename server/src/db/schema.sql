-- Horizon Properties schema. Applied by `npm run migrate` (idempotent).

create table if not exists agents (
  id serial primary key,
  slug text unique not null,
  name text not null,
  role text not null,
  phone text,
  email text,
  photo text,
  bio text,
  linkedin text,
  created_at timestamptz not null default now()
);

create table if not exists properties (
  id serial primary key,
  slug text unique not null,
  name text not null,
  city text not null,
  state text not null,
  country text not null,
  price numeric(12, 2) not null,
  price_label text not null,
  type text not null,
  status text not null default 'For Sale',
  bedrooms integer not null,
  bathrooms numeric(4, 1) not null,
  sqft integer not null,
  lot_size text,
  year_built integer,
  garage integer,
  description text not null,
  features jsonb not null default '[]'::jsonb,
  amenities jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  agent_id integer references agents (id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists properties_state_idx on properties (state);
create index if not exists properties_type_idx on properties (type);
create index if not exists properties_price_idx on properties (price);

create table if not exists favorites (
  id serial primary key,
  visitor_id text not null,
  property_id integer not null references properties (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (visitor_id, property_id)
);

create index if not exists favorites_visitor_idx on favorites (visitor_id);

create table if not exists inquiries (
  id serial primary key,
  kind text not null default 'contact',
  name text not null,
  email text not null,
  phone text,
  message text,
  property_id integer references properties (id) on delete set null,
  preferred_date date,
  created_at timestamptz not null default now()
);
