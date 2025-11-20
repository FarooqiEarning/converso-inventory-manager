import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth-context';
import type { Customer, InsertCustomer } from '@shared/schema';

export function useCustomers() {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['/api/customers', organization?.id],
    queryFn: async () => {
      if (!organization) return [];

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      return data as Customer[];
    },
    enabled: !!organization,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['/api/customers', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Customer;
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const { organization } = useAuth();

  return useMutation({
    mutationFn: async (customer: Omit<InsertCustomer, 'organizationId'>) => {
      if (!organization) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('customers')
        .insert({
          ...customer,
          organizationId: organization.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    },
  });
}

export function useUpdateCustomer() {
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Customer> & { id: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    },
  });
}

export function useDeleteCustomer() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    },
  });
}
