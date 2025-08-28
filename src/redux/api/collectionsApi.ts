import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { Product } from '../api/productsApi'
import type { Voucher } from './vounchersApi';

export interface Collection {
  id: number;
  name: string;
  description: string;
  image_url: string;
  products: Product[];
  createdAt?: string;
  hasSpecialCoupon?: boolean;
  baseDiscountPercent?: number;
  incrementPerExpansion?: number;
  specialCouponId?: number | null;
  specialCoupon?: Voucher | null;
}

export const collectionsApi = createApi({
  reducerPath: 'collectionsApi',
  baseQuery: axiosBaseQuery, // <-- no parentheses!
  tagTypes: ['Collection', 'Product'],
  endpoints: (builder) => ({
    getCollections: builder.query<Collection[], void>({
      query: () => ({ url: '/collections', method: 'GET' }),
      providesTags: ['Collection'],
    }),
    addCollection: builder.mutation<Collection, Partial<Collection> & { productIds?: number[] }>(
      {
        query: (body) => ({
          url: '/collections',
          method: 'POST',
          data: body, // This will send JSON
          headers: { 'Content-Type': 'application/json' },
        }),
        invalidatesTags: ['Collection', 'Product'],
      }),
    updateCollection: builder.mutation<Collection, { id: number; name?: string; description?: string; image_url?: string; productIds?: number[] }>(
      {
        query: ({ id, ...body }) => ({
          url: `/collections/${id}`,
          method: 'PUT',
          data: body,
          headers: { 'Content-Type': 'application/json' },
        }),
        invalidatesTags: ['Collection', 'Product'],
      }),
    deleteCollection: builder.mutation<void, number>({
      query: (id) => ({
        url: `/collections/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Collection', 'Product'],
    }),
  }),
})

export const {
  useGetCollectionsQuery,
  useAddCollectionMutation,
  useDeleteCollectionMutation,
  useUpdateCollectionMutation
} = collectionsApi
