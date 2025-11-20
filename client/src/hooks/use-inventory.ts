import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth-context';
import type { InventoryItem } from '@shared/schema';

export function useInventory(storeId?: string) {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['/api/inventory', organization?.id, storeId],
    queryFn: async () => {
      if (!organization) return [];

      let query = supabase
        .from('inventory_items')
        .select('*, products(*), stores(*)')
        .eq('organization_id', organization.id);

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query.order('quantity', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });
}

export function useLowStockItems(threshold: number = 10) {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['/api/inventory/low-stock', organization?.id, threshold],
    queryFn: async () => {
      if (!organization) return [];

      const { data, error } = await supabase
        .from('inventory_items')
        .select('*, products(*), stores(*)')
        .eq('organization_id', organization.id)
        .lte('quantity', threshold)
        .order('quantity', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });
}

export function useUpdateInventory() {
  const { organization, user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      storeId,
      quantityDelta,
      reason,
    }: {
      productId: string;
      storeId: string;
      quantityDelta: number;
      reason?: string;
    }) => {
      if (!organization || !user) throw new Error('Not authenticated');

      // Get current inventory
      const { data: currentItem, error: fetchError } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('product_id', productId)
        .eq('store_id', storeId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      let newQuantity = quantityDelta;
      if (currentItem) {
        newQuantity = currentItem.quantity + quantityDelta;
      }

      // Upsert inventory item
      const { error: upsertError } = await supabase
        .from('inventory_items')
        .upsert({
          productId,
          storeId,
          quantity: newQuantity,
          organizationId: organization.id,
        });

      if (upsertError) throw upsertError;

      // Log adjustment
      const { error: logError } = await supabase
        .from('inventory_adjustments')
        .insert({
          productId,
          storeId,
          type: quantityDelta > 0 ? 'IN' : 'OUT',
          quantity: Math.abs(quantityDelta),
          reason,
          userId: user.id,
          organizationId: organization.id,
        });

      if (logError) throw logError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    },
  });
}
