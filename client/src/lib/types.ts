export type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  productCount?: number;
};

export type ProductColor = {
  id: string;
  name: string;
  hex: string;
  image?: string | null;
};

export type ProductImage = { id: string; url: string; sortOrder: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  category?: Category;
  price: number | null;
  salePrice: number | null;
  effectivePrice: number | null;
  shortDescription?: string | null;
  description?: string | null;
  texture?: string | null;
  stock: number;
  isAvailable: boolean;
  isActive: boolean;
  minQty: number;
  unit: string;
  sku?: string | null;
  showOnHome: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  sortOrder: number;
  createdAt: string;
  images: ProductImage[];
  colors: ProductColor[];
};

export type CartLine = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  colorId: string | null;
  colorName: string | null;
  image: string | null;
  unit: string;
  quantity: number;
  minQty: number;
  stock: number;
  unitPrice: number | null;
  lineTotal: number | null;
  available: boolean;
  issue: string | null;
};

export type Cart = {
  items: CartLine[];
  count: number;
  subtotal: number;
  shippingCost: number;
  freeShippingThreshold: number;
  total: number;
  hasBlockingIssue: boolean;
  currency: string;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  announcement: string;
  aboutShort: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  postalCode: string;
  workingHours: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
  currency: string;
  shippingCost: number;
  freeShippingThreshold: number;
  shippingNote: string;
  paymentOnlineEnabled: boolean;
  paymentCodEnabled: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt?: string;
};

export type OrderItem = {
  id: string;
  name: string;
  colorName?: string | null;
  image?: string | null;
  unitPrice: number;
  quantity: number;
  unit: string;
  lineTotal: number;
};

export type Order = {
  id: string;
  number: string;
  customerName: string;
  phone: string;
  email?: string | null;
  province?: string | null;
  city?: string | null;
  address: string;
  postalCode?: string | null;
  note?: string | null;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
};

export type StorePage = { id: string; slug: string; title: string; body: string };
