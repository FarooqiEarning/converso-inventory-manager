import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth-context';
import type { Credit, CreditTransaction } from '@shared/schema';

export function useCredits() {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['/api/credits', organization?.id],
    queryFn: async () => {
      if (!organization) return [];

      const { data, error } = await supabase
        .from('credits')
        .select('*, customers(*)')
        .eq('organization_id', organization.id)
        .order('outstanding_amount', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!organization,
  });
}

export function useCreditTransactions(creditId: string) {
  return useQuery({
    queryKey: ['/api/credits', creditId, 'transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*, users(name)')
        .eq('credit_id', creditId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!creditId,
  });
}

export function useCreditStats() {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['/api/credits/stats', organization?.id],
    queryFn: async () => {
      if (!organization) return { total: 0, count: 0, aging: { recent: 0, medium: 0, overdue: 0 } };

      const { data, error } = await supabase
        .from('credits')
        .select('outstanding_amount, created_at')
        .eq('organization_id', organization.id);

      if (error) throw error;

      const now = new Date();
      const stats = data.reduce(
        (acc, credit) => {
          acc.total += credit.outstanding_amount;
          acc.count += 1;

          const daysOld = Math.floor(
            (now.getTime() - new Date(credit.created_at).getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysOld <= 30) {
            acc.aging.recent += credit.outstanding_amount;
          } else if (daysOld <= 60) {
            acc.aging.medium += credit.outstanding_amount;
          } else {
            acc.aging.overdue += credit.outstanding_amount;
          }

          return acc;
        },
        { total: 0, count: 0, aging: { recent: 0, medium: 0, overdue: 0 } }
      );

      return stats;
    },
    enabled: !!organization,
  });
}

export function useAddCreditPayment() {
  const { organization, user } = useAuth();

  return useMutation({
    mutationFn: async ({
      creditId,
      amount,
      note,
    }: {
      creditId: string;
      amount: number;
      note?: string;
    }) => {
      if (!organization || !user) throw new Error('Not authenticated');

      // Add payment transaction
      const { error: txError } = await supabase
        .from('credit_transactions')
        .insert({
          creditId,
          type: 'PAYMENT_RECEIVED',
          amount,
          note,
          userId: user.id,
          organizationId: organization.id,
        });

      if (txError) throw txError;

      // Update credit amounts
      const { data: credit } = await supabase
        .from('credits')
        .select('*')
        .eq('id', creditId)
        .single();

      if (credit) {
        await supabase
          .from('credits')
          .update({
            paidAmount: credit.paidAmount + amount,
            outstandingAmount: credit.outstandingAmount - amount,
          })
          .eq('id', creditId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/credits'] });
    },
  });
}
