/**
 * Static image bases for the catalogue.
 *
 * Only the host + photo path is stored; the client appends sizing parameters
 * (`?auto=format&fit=crop&w=<width>&q=<quality>`) in `client/src/lib/images.ts`
 * so every surface requests the size it renders (responsive srcset, no waste).
 */

export type SeedAgent = {
  slug: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  photo: string;
  linkedin: string;
  bio: string;
};

export const agents: SeedAgent[] = [
  {
    slug: 'daniel-morgan',
    name: 'Daniel Morgan',
    role: 'Managing Director',
    phone: '(555) 246-7890',
    email: 'daniel@horizonproperties.com',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    linkedin: 'https://www.linkedin.com/',
    bio: 'Two decades guiding private clients through the acquisition of architecturally significant homes across the American South and West Coast.',
  },
  {
    slug: 'olivia-carter',
    name: 'Olivia Carter',
    role: 'Luxury Property Advisor',
    phone: '(555) 246-7891',
    email: 'olivia@horizonproperties.com',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    linkedin: 'https://www.linkedin.com/',
    bio: 'Specialises in off-market coastal estates, pairing discerning buyers with residences that never reach a public listing.',
  },
  {
    slug: 'james-wilson',
    name: 'James Wilson',
    role: 'Investment Consultant',
    phone: '(555) 246-7892',
    email: 'james@horizonproperties.com',
    photo: 'https://images.unsplash.com/photo-1676989880361-091e12efc056',
    linkedin: 'https://www.linkedin.com/',
    bio: 'Advises private funds and family offices on residential portfolios, yield modelling and long-horizon capital appreciation.',
  },
  {
    slug: 'sophia-bennett',
    name: 'Sophia Bennett',
    role: 'Senior Property Specialist',
    phone: '(555) 246-7893',
    email: 'sophia@horizonproperties.com',
    photo: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6',
    linkedin: 'https://www.linkedin.com/',
    bio: 'Leads our downtown and penthouse practice, with a record of record-breaking sales in Austin’s high-rise market.',
  },
];

export type SeedProperty = {
  slug: string;
  name: string;
  city: string;
  state: string;
  country: string;
  price: number;
  priceLabel: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  garage: number;
  description: string;
  features: string[];
  amenities: string[];
  images: string[];
  featured: boolean;
  agent: string;
};

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const properties: SeedProperty[] = [
  {
    slug: 'lakeside-modern-villa',
    name: 'Lakeside Modern Villa',
    city: 'Austin',
    state: 'Texas',
    country: 'USA',
    price: 2350000,
    priceLabel: '$2.35 Million',
    type: 'Villa',
    status: 'Exclusive',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 5200,
    lotSize: '0.6 acres',
    yearBuilt: 2021,
    garage: 3,
    description:
      'Positioned on a quiet stretch of shoreline, Lakeside Modern Villa is an exercise in restraint. Floor-to-ceiling glazing dissolves the boundary between the living pavilion and the water, while limestone floors and a monolithic fireplace anchor the interior in warm, tactile calm. The primary suite occupies its own wing with a private terrace overlooking the lake.',
    features: [
      'Floor-to-ceiling lake-facing glazing',
      'Infinity pool with sun shelf',
      'Chef’s kitchen with marble island',
      'Primary wing with private terrace',
      'Climate-controlled wine room',
      'Triple garage with EV charging',
    ],
    amenities: [
      'Infinity pool',
      'Private dock',
      'Home cinema',
      'Gym',
      'Smart home system',
      'Heated floors',
      'Outdoor kitchen',
      'Gated entry',
    ],
    images: [u('1613490493576-7fde63acd811'), u('1564078516393-cf04bd966897'), u('1778731660397-6a66493be391'), u('1562438668-bcf0ca6578f0'), u('1613545325278-f24b0cae1224')],
    featured: true,
    agent: 'olivia-carter',
  },
  {
    slug: 'pacific-glass-house',
    name: 'Pacific Glass House',
    city: 'Malibu',
    state: 'California',
    country: 'USA',
    price: 4800000,
    priceLabel: '$4.8 Million',
    type: 'Modern Home',
    status: 'For Sale',
    bedrooms: 4,
    bathrooms: 5,
    sqft: 4300,
    lotSize: '0.4 acres',
    yearBuilt: 2019,
    garage: 2,
    description:
      'A study in glass and light on a bluff above the Pacific. Living spaces open fully to a cantilevered terrace, where the pool appears to spill toward the horizon. The house is engineered for both intimacy and entertaining, with a lower level devoted to wellness and a screening room that opens to an ocean-facing courtyard.',
    features: [
      'Cantilevered ocean-view terrace',
      'Full-height pocketing glass walls',
      'Lower-level wellness suite',
      'Screening room',
      'Oak and micro-cement interiors',
      'Two-car gallery garage',
    ],
    amenities: [
      'Infinity pool',
      'Spa and sauna',
      'Home cinema',
      'Wine cellar',
      'Outdoor shower',
      'Solar array',
      'Fire pit terrace',
      'Guest casita',
    ],
    images: [u('1512917774080-9991f1c4c750'), u('1772567732985-6fefa2dff56d'), u('1600210491892-03d54c0aaf87'), u('1564078516393-cf04bd966897'), u('1757524552833-4dba4949a5b2')],
    featured: true,
    agent: 'daniel-morgan',
  },
  {
    slug: 'desert-horizon-estate',
    name: 'Desert Horizon Estate',
    city: 'Scottsdale',
    state: 'Arizona',
    country: 'USA',
    price: 3150000,
    priceLabel: '$3.15 Million',
    type: 'Estate',
    status: 'For Sale',
    bedrooms: 6,
    bathrooms: 5,
    sqft: 6100,
    lotSize: '1.4 acres',
    yearBuilt: 2022,
    garage: 4,
    description:
      'Low, horizontal and deeply private, Desert Horizon Estate is organised around a central courtyard that cools the house naturally. Rammed-earth walls meet bronze-framed glazing, and every principal room frames a view of the McDowell ridgeline. The grounds include a shaded outdoor lounge and a 25-metre lap pool.',
    features: [
      'Central courtyard plan',
      'Rammed-earth and bronze exterior',
      'Mountain-ridge outlook',
      '25-metre lap pool',
      'Casita with private entrance',
      'Detached four-car garage',
    ],
    amenities: [
      'Lap pool',
      'Casita',
      'Outdoor lounge',
      'Fireplace terrace',
      'Desert garden',
      'Motor court',
      'EV charging',
      'Security system',
    ],
    images: [u('1783125127199-860da9744dcc'), u('1781794902242-f8578908d640'), u('1613545325278-f24b0cae1224'), u('1778731660397-6a66493be391'), u('1600210491892-03d54c0aaf87')],
    featured: false,
    agent: 'james-wilson',
  },
  {
    slug: 'oceanfront-residence',
    name: 'Oceanfront Residence',
    city: 'Miami',
    state: 'Florida',
    country: 'USA',
    price: 5200000,
    priceLabel: '$5.2 Million',
    type: 'Residence',
    status: 'New Listing',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 5800,
    lotSize: '0.5 acres',
    yearBuilt: 2020,
    garage: 3,
    description:
      'Direct ocean frontage with a rare 40 metres of private beach. The residence is arranged over two levels, both turned toward the water, with a floating staircase and a double-height living room. Evening light washes the interiors in amber, while the infinity pool reflects the blue hour sky.',
    features: [
      '40 metres of private beach frontage',
      'Double-height living room',
      'Floating stone staircase',
      'Water-facing primary suite',
      'Summer kitchen and bar',
      'Impact-rated glazing throughout',
    ],
    amenities: [
      'Infinity pool',
      'Private beach access',
      'Boat dock',
      'Summer kitchen',
      'Spa bath',
      'Elevator',
      'Guest suite',
      'Full house generator',
    ],
    images: [u('1542314831-068cd1dbfeeb'), u('1757524552833-4dba4949a5b2'), u('1772567732985-6fefa2dff56d'), u('1564078516393-cf04bd966897'), u('1562438668-bcf0ca6578f0')],
    featured: true,
    agent: 'sophia-bennett',
  },
  {
    slug: 'modern-hillside-retreat',
    name: 'Modern Hillside Retreat',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    price: 3750000,
    priceLabel: '$3.75 Million',
    type: 'Modern Home',
    status: 'For Sale',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 4600,
    lotSize: '0.8 acres',
    yearBuilt: 2018,
    garage: 2,
    description:
      'Terraced into a canyon ridge, this residence steps down the hillside in three volumes, each opening to a deck. At dusk the glass facades glow amber against the blue sky — the image the house was designed around. An evening garden of olive and agave frames the entry.',
    features: [
      'Three terraced volumes',
      'Canyon and city-light views',
      'Wrap-around ipe decks',
      'Floating oak staircase',
      'Rooftop terrace with fire table',
      'Two-car garage plus motor court',
    ],
    amenities: [
      'Plunge pool',
      'Rooftop terrace',
      'Fire table',
      'Outdoor dining deck',
      'Studio',
      'Home office',
      'Irrigated gardens',
      'Gated drive',
    ],
    images: [u('1757524492552-d47a66a2b63e'), u('1564078516393-cf04bd966897'), u('1613545325278-f24b0cae1224'), u('1778731660397-6a66493be391'), u('1600210491892-03d54c0aaf87')],
    featured: true,
    agent: 'olivia-carter',
  },
  {
    slug: 'palm-garden-residence',
    name: 'Palm Garden Residence',
    city: 'Beverly Hills',
    state: 'California',
    country: 'USA',
    price: 6400000,
    priceLabel: '$6.4 Million',
    type: 'Estate',
    status: 'Exclusive',
    bedrooms: 6,
    bathrooms: 7,
    sqft: 7400,
    lotSize: '1.1 acres',
    yearBuilt: 2017,
    garage: 4,
    description:
      'A discreet estate behind mature hedging, with formal gardens and a palm-lined motor court. Interiors are generous and quiet: book-matched marble, hand-finished plaster and a series of rooms that open to the pool terrace. A separate guest house completes the compound.',
    features: [
      'Formal gardens and hedged perimeter',
      'Palm-lined motor court',
      'Book-matched marble interiors',
      'Pool terrace with loggia',
      'Detached guest house',
      'Staff quarters',
    ],
    amenities: [
      'Heated pool',
      'Spa',
      'Guest house',
      'Loggia with fireplace',
      'Wine room',
      'Gym',
      'Elevator',
      'Smart security',
    ],
    images: [u('1782720829237-ec146b0afe0a'), u('1600210491892-03d54c0aaf87'), u('1562438668-bcf0ca6578f0'), u('1781794902242-f8578908d640'), u('1613545325278-f24b0cae1224')],
    featured: true,
    agent: 'daniel-morgan',
  },
  {
    slug: 'contemporary-lake-house',
    name: 'Contemporary Lake House',
    city: 'Lake Tahoe',
    state: 'Nevada',
    country: 'USA',
    price: 2950000,
    priceLabel: '$2.95 Million',
    type: 'House',
    status: 'For Sale',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3900,
    lotSize: '0.7 acres',
    yearBuilt: 2023,
    garage: 2,
    description:
      'A new lake house in cedar and stone, built for both winter and summer living. The great room opens to a sheltered deck with a fire pit; a bunk room and hot tub deck make the house effortless for guests. Berths for two boats are included in the private marina.',
    features: [
      'Cedar, stone and blackened steel',
      'Sheltered deck with fire pit',
      'Bunk room for guests',
      'Lake and mountain outlook',
      'Two private marina berths',
      'Heated driveway',
    ],
    amenities: [
      'Hot tub',
      'Fire pit',
      'Boat berths',
      'Ski storage',
      'Mudroom',
      'Radiant floors',
      'Generator',
      'Snow-melt driveway',
    ],
    images: [u('1544984243-ec57ea16fe25'), u('1778731660397-6a66493be391'), u('1564078516393-cf04bd966897'), u('1757524552833-4dba4949a5b2'), u('1562438668-bcf0ca6578f0')],
    featured: false,
    agent: 'james-wilson',
  },
  {
    slug: 'architectural-downtown-penthouse',
    name: 'Architectural Downtown Penthouse',
    city: 'Austin',
    state: 'Texas',
    country: 'USA',
    price: 1850000,
    priceLabel: '$1.85 Million',
    type: 'Penthouse',
    status: 'New Listing',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2900,
    lotSize: 'Full floor',
    yearBuilt: 2022,
    garage: 2,
    description:
      'A full-floor penthouse with 270-degree views of the skyline and the river beyond. Interiors are pared back and precise, with continuous pale oak floors and a kitchen conceived as a piece of furniture. Two deeded parking spaces and a private lift lobby are included.',
    features: [
      'Full-floor with 270° outlook',
      'Private lift lobby',
      'Continuous pale oak flooring',
      'Gaggenau kitchen suite',
      'Corner primary suite',
      'Two deeded parking spaces',
    ],
    amenities: [
      'Concierge',
      'Residents’ pool',
      'Fitness studio',
      'Private dining room',
      'Terrace with grill',
      'Storage unit',
      'EV charging',
      'Pet spa',
    ],
    images: [u('1600596542815-ffad4c1539a9'), u('1778731660397-6a66493be391'), u('1772567732985-6fefa2dff56d'), u('1600210491892-03d54c0aaf87'), u('1564078516393-cf04bd966897')],
    featured: false,
    agent: 'sophia-bennett',
  },
];

/** Editorial imagery used by the marketing sections (about, why-choose). */
export const editorialImages = {
  aboutPrimary: u('1580587771525-78b9dba3b914'),
  aboutSecondary: u('1562438668-bcf0ca6578f0'),
  whyChoose: u('1757356657991-c3fd6e2e812e'),
  hero: 'https://media.base44.com/images/public/6ad1efc1a118498b010e2d0c/e8f6be365_TwilightModernVillabytheReflectingPool.png',
};

