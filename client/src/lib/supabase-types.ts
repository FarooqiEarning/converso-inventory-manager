// Type-safe converters between TypeScript (camelCase) and Supabase (snake_case)

import type { Product, Customer, Sale, Store, Organization, User, InventoryItem, Credit } from '@shared/schema';

// Database row types (snake_case as returned from Supabase)
export type ProductRow = {
  id: string;
  sku: string;
  name: string;
  category?: string;
  unit?: string;
  cost_price: number;
  sell_price: number;
  tax_percent?: number;
  image_url?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
};

export type CustomerRow = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
};

export type StoreRow = {
  id: string;
  name: string;
  address?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
};

// Converters
export function productFromRow(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    unit: row.unit,
    costPrice: row.cost_price,
    sellPrice: row.sell_price,
    taxPercent: row.tax_percent,
    imageUrl: row.image_url,
    organizationId: row.organization_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function productToRow(product: Partial<Product>): Partial<ProductRow> {
  const row: Partial<ProductRow> = {};
  if (product.id) row.id = product.id;
  if (product.sku) row.sku = product.sku;
  if (product.name) row.name = product.name;
  if (product.category !== undefined) row.category = product.category;
  if (product.unit !== undefined) row.unit = product.unit;
  if (product.costPrice !== undefined) row.cost_price = product.costPrice;
  if (product.sellPrice !== undefined) row.sell_price = product.sellPrice;
  if (product.taxPercent !== undefined) row.tax_percent = product.taxPercent;
  if (product.imageUrl !== undefined) row.image_url = product.imageUrl;
  if (product.organizationId) row.organization_id = product.organizationId;
  return row;
}

export function customerFromRow(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    organizationId: row.organization_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function customerToRow(customer: Partial<Customer>): Partial<CustomerRow> {
  const row: Partial<CustomerRow> = {};
  if (customer.id) row.id = customer.id;
  if (customer.name) row.name = customer.name;
  if (customer.phone !== undefined) row.phone = customer.phone;
  if (customer.email !== undefined) row.email = customer.email;
  if (customer.organizationId) row.organization_id = customer.organizationId;
  return row;
}

export function storeFromRow(row: StoreRow): Store {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    organizationId: row.organization_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function storeToRow(store: Partial<Store>): Partial<StoreRow> {
  const row: Partial<StoreRow> = {};
  if (store.id) row.id = store.id;
  if (store.name) row.name = store.name;
  if (store.address !== undefined) row.address = store.address;
  if (store.organizationId) row.organization_id = store.organizationId;
  return row;
}
