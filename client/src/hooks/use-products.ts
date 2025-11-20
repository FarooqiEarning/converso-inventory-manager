import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/lib/auth-context';
import type { Product, InsertProduct } from '@shared/schema';

export function useProducts() {
  const { organization } = useAuth();

  return useQuery({
    queryKey: ['/api/products', organization?.id],
    queryFn: async () => {
      if (!organization) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('organization_id', organization.id)
        .order('name');

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!organization,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['/api/products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const { organization, user } = useAuth();

  return useMutation({
    mutationFn: async (product: Omit<InsertProduct, 'organizationId'>) => {
      if (!organization || !user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('products')
        .insert({
          sku: product.sku,
          name: product.name,
          category: product.category,
          unit: product.unit,
          cost_price: product.costPrice,
          sell_price: product.sellPrice,
          tax_percent: product.taxPercent,
          image_url: product.imageUrl,
          organization_id: organization.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      const result: Product = {
        id: data.id,
        sku: data.sku,
        name: data.name,
        category: data.category,
        unit: data.unit,
        costPrice: data.cost_price,
        sellPrice: data.sell_price,
        taxPercent: data.tax_percent,
        imageUrl: data.image_url,
        organizationId: data.organization_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
  });
}
