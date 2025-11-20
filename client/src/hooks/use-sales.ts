import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth-context';
import { db, addToSyncQueue } from '@/lib/db';
import { getOnlineStatus } from '@/lib/sync-manager';
import type { Sale, SaleItem } from '@shared/schema';

export function useTodaySales() {
  const { organization } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['/api/sales/today', organization?.id],
    queryFn: async () => {
      if (!organization) return [];

      const { data, error } = await supabase
        .from('sales')
        .select('*, sale_items(*), customers(name)')
        .eq('organization_id', organization.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });
}

export function useCreateSale() {
  const { organization, user } = useAuth();

  return useMutation({
    mutationFn: async ({ sale, items }: { sale: any; items: any[] }) => {
      if (!organization || !user) throw new Error('Not authenticated');

      const saleData = {
        ...sale,
        userId: user.id,
        organizationId: organization.id,
      };

      if (!getOnlineStatus()) {
        // Store in IndexedDB for later sync
        const localSale = {
          ...saleData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };

        await db.sales.add(localSale);
        await addToSyncQueue('sale', { sale: localSale, items });

        return localSale;
      }

      // Online - save directly to Supabase
      const { data: savedSale, error: saleError } = await supabase
        .from('sales')
        .insert(saleData)
        .select()
        .single();

      if (saleError) throw saleError;

      const saleItems = items.map((item) => ({
        ...item,
        saleId: savedSale.id,
        organizationId: organization.id,
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      return savedSale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sales'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    },
  });
}

export function useDailySalesStats() {
  const { organization } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['/api/sales/stats/today', organization?.id],
    queryFn: async () => {
      if (!organization) return { total: 0, cash: 0, credit: 0, count: 0 };

      const { data, error } = await supabase
        .from('sales')
        .select('total, payment_type, cash_amount, credit_amount')
        .eq('organization_id', organization.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      if (error) throw error;

      const stats = data.reduce(
        (acc, sale) => {
          acc.total += sale.total;
          acc.count += 1;

          if (sale.payment_type === 'CASH') {
            acc.cash += sale.total;
          } else if (sale.payment_type === 'CREDIT') {
            acc.credit += sale.total;
          } else if (sale.payment_type === 'MIXED') {
            acc.cash += sale.cash_amount || 0;
            acc.credit += sale.credit_amount || 0;
          }

          return acc;
        },
        { total: 0, cash: 0, credit: 0, count: 0 }
      );

      return stats;
    },
    enabled: !!organization,
  });
}
