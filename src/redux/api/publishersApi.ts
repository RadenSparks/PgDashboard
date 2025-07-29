import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { Product } from '../../components/pages/products/types';

export interface Publisher {
  id: number;
  name: string;
  products: Product[];
}

export const publishersApi = createApi({
  reducerPath: 'publishersApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Publisher'],
  endpoints: (builder) => ({
    getPublishers: builder.query<Publisher[], void>({
      query: () => ({ url: '/publishers', method: 'GET' }),
      providesTags: ['Publisher'],
    }),
    addPublisher: builder.mutation<Publisher, { name: string }>(
      {
        query: (body) => ({
          url: '/publishers',
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['Publisher'],
      }),
    updatePublisher: builder.mutation<Publisher, { id: number; name: string }>(
      {
        query: ({ id, ...body }) => ({
          url: `/publishers/${id}`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['Publisher'],
      }),
    deletePublisher: builder.mutation<void, number>({
      query: (id) => ({
        url: `/publishers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Publisher'],
    }),
  }),
})

export const {
  useGetPublishersQuery,
  useAddPublisherMutation,
  useUpdatePublisherMutation,
  useDeletePublisherMutation,
} = publishersApi