import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { CmsContent } from '../../components/pages/products/types'

export type Product = {
  description: string;
  discount: number;
  slug: string;
  meta_title: string;
  meta_description: string;
  quantity_sold: number;
  status: string;
  publisherID: { id: number; name: string }; // <-- unified
  tags: never[];
  id: number;
  product_name: string;
  product_price: number;
  quantity_stock: number;
  images?: { url: string; name?: string }[];
  category_ID?: { id: number; name: string };
   deletedAt?: string | null;
};

export type PaginatedProducts = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Product', 'CmsContent'],
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedProducts, { page?: number; limit?: number; search?: string; name?: string }>({
      query: ({ page = 1, limit = 10, search, name } = {}) => ({
        url: '/products',
        method: 'GET',
        params: { page, limit, search, name },
      }),
      providesTags: ['Product'],
    }),
    addProduct: builder.mutation<Product, FormData>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, FormData>({
      query: (body) => ({
        url: '/products/' + body.get('id'),
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    restoreProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}/restore`,
        method: 'PUT',
      }),
      invalidatesTags: ['Product'],
    }),
    getProductCms: builder.query<CmsContent, number>({
      query: (productId) => ({ url: `/products/${productId}/cms-content`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'CmsContent', id }],
    }),
    updateProductCms: builder.mutation<CmsContent, { productId: number; data: Partial<CmsContent> }>({
      query: ({ productId, data }) => ({
        url: `/products/${productId}/cms-content`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [{ type: 'CmsContent', id: productId }],
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => ({ url: `/products/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductCmsQuery,
  useUpdateProductCmsMutation,
  useGetProductByIdQuery,
  useRestoreProductMutation,
} = productsApi
