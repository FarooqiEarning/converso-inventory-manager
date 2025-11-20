import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth-context';
import type { Store, InsertStore } from '@shared/schema';

export function useStores() {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['/api/stores', organization?.id],
    queryFn: async () => {
      if (!organization) return [];

      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      return data as Store[];
    },
    enabled: !!organization,
  });
}

export function useCreateStore() {
  const { organization } = useAuth();

  return useMutation({
    mutationFn: async (store: Omit<InsertStore, 'organizationId'>) => {
      if (!organization) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('stores')
        .insert({
          ...store,
          organizationId: organization.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Store;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
    },
  });
}
