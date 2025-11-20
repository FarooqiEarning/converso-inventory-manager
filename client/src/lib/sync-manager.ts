import { db, getPendingSyncItems, markSynced, clearSyncedItems } from './db';
import { supabase } from './supabase';

let syncInterval: NodeJS.Timeout | null = null;
let isOnline = navigator.onLine;

// Monitor online/offline status
window.addEventListener('online', () => {
  isOnline = true;
  console.log('[Sync] Back online - initiating sync');
  syncData();
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('[Sync] Offline mode activated');
});

// Periodic sync every 30 seconds when online
export function startSyncManager() {
  if (syncInterval) return;
  
  syncInterval = setInterval(() => {
    if (isOnline) {
      syncData();
    }
  }, 30000);

  // Initial sync if online
  if (isOnline) {
    syncData();
  }
}

export function stopSyncManager() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}

export async function syncData() {
  if (!isOnline) {
    console.log('[Sync] Skipping sync - offline');
    return;
  }

  try {
    const pendingItems = await getPendingSyncItems();
    console.log(`[Sync] Found ${pendingItems.length} items to sync`);

    for (const item of pendingItems) {
      try {
        switch (item.type) {
          case 'sale':
            await syncSale(item.data);
            break;
          case 'inventory':
            await syncInventory(item.data);
            break;
          case 'payment':
            await syncPayment(item.data);
            break;
        }
        
        await markSynced(item.id!);
        console.log(`[Sync] Successfully synced ${item.type} item ${item.id}`);
      } catch (error) {
        console.error(`[Sync] Failed to sync item ${item.id}:`, error);
        // Don't mark as synced - will retry later
      }
    }

    // Clean up old synced items
    await clearSyncedItems();
  } catch (error) {
    console.error('[Sync] Sync process failed:', error);
  }
}

async function syncSale(saleData: any) {
  // Insert sale
  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert(saleData.sale)
    .select()
    .single();

  if (saleError) throw saleError;

  // Insert sale items
  const saleItems = saleData.items.map((item: any) => ({
    ...item,
    saleId: sale.id,
  }));

  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(saleItems);

  if (itemsError) throw itemsError;

  // Update inventory
  for (const item of saleData.items) {
    const { error: invError } = await supabase.rpc('decrement_inventory', {
      p_product_id: item.productId,
      p_store_id: saleData.sale.storeId,
      p_quantity: item.quantity,
    });

    if (invError) console.error('Inventory update error:', invError);
  }

  // Handle credit if applicable
  if (saleData.sale.paymentType === 'CREDIT' || saleData.sale.paymentType === 'MIXED') {
    if (saleData.sale.customerId && saleData.sale.creditAmount > 0) {
      await syncCreditTransaction(
        saleData.sale.customerId,
        saleData.sale.creditAmount,
        saleData.sale.userId,
        saleData.sale.organizationId
      );
    }
  }
}

async function syncInventory(inventoryData: any) {
  const { error } = await supabase
    .from('inventory_adjustments')
    .insert(inventoryData);

  if (error) throw error;

  // Update inventory item quantity
  const { error: updateError } = await supabase.rpc('update_inventory_quantity', {
    p_product_id: inventoryData.productId,
    p_store_id: inventoryData.storeId,
    p_quantity_delta: inventoryData.type === 'IN' ? inventoryData.quantity : -inventoryData.quantity,
  });

  if (updateError) throw updateError;
}

async function syncPayment(paymentData: any) {
  const { error } = await supabase
    .from('credit_transactions')
    .insert(paymentData);

  if (error) throw error;

  // Update credit outstanding amount
  const { error: creditError } = await supabase.rpc('update_credit_amount', {
    p_credit_id: paymentData.creditId,
    p_amount: paymentData.amount,
  });

  if (creditError) throw creditError;
}

async function syncCreditTransaction(
  customerId: string,
  creditAmount: number,
  userId: string,
  organizationId: string
) {
  // Get or create credit account for customer
  const { data: existingCredit } = await supabase
    .from('credits')
    .select('*')
    .eq('customerId', customerId)
    .single();

  let creditId: string;

  if (existingCredit) {
    creditId = existingCredit.id;
    
    // Update credit
    await supabase
      .from('credits')
      .update({
        totalAmount: existingCredit.totalAmount + creditAmount,
        outstandingAmount: existingCredit.outstandingAmount + creditAmount,
      })
      .eq('id', creditId);
  } else {
    // Create new credit account
    const { data: newCredit } = await supabase
      .from('credits')
      .insert({
        customerId,
        totalAmount: creditAmount,
        paidAmount: 0,
        outstandingAmount: creditAmount,
        organizationId,
      })
      .select()
      .single();

    creditId = newCredit!.id;
  }

  // Add credit transaction
  await supabase
    .from('credit_transactions')
    .insert({
      creditId,
      type: 'CREDIT_GIVEN',
      amount: creditAmount,
      userId,
      organizationId,
    });
}

export function getOnlineStatus() {
  return isOnline;
}

// Re-export for convenience
export { getPendingSyncItems } from './db';
