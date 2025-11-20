import Dexie, { Table } from 'dexie';
import type { Product, Sale, SaleItem, Customer, InventoryItem } from '@shared/schema';

// Offline database for local storage and sync queue
export class CIMDatabase extends Dexie {
  products!: Table<Product>;
  sales!: Table<Sale>;
  saleItems!: Table<SaleItem>;
  customers!: Table<Customer>;
  inventoryItems!: Table<InventoryItem>;
  syncQueue!: Table<{
    id?: number;
    type: 'sale' | 'inventory' | 'payment';
    data: any;
    createdAt: string;
    synced: boolean;
  }>;

  constructor() {
    super('CIMDatabase');
    
    this.version(1).stores({
      products: 'id, organizationId, sku, name, category',
      sales: 'id, organizationId, storeId, createdAt',
      saleItems: 'id, saleId, productId',
      customers: 'id, organizationId, name',
      inventoryItems: 'id, organizationId, productId, storeId',
      syncQueue: '++id, type, synced, createdAt',
    });
  }
}

export const db = new CIMDatabase();

// Sync queue management
export async function addToSyncQueue(type: 'sale' | 'inventory' | 'payment', data: any) {
  await db.syncQueue.add({
    type,
    data,
    createdAt: new Date().toISOString(),
    synced: false,
  });
}

export async function getPendingSyncItems() {
  return await db.syncQueue.where('synced').equals(false).toArray();
}

export async function markSynced(id: number) {
  await db.syncQueue.update(id, { synced: true });
}

export async function clearSyncedItems() {
  await db.syncQueue.where('synced').equals(true).delete();
}
