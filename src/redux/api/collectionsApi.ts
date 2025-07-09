import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { Product } from '../../components/pages/products/types'

export interface Collection {
  id: number
  name: string
  slug: string
  image_url: string
  products: Product[]
}

export const collectionsApi = createApi({
  reducerPath: 'collectionsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Collection', 'Product'],
  endpoints: (builder) => ({
    getCollections: builder.query<Collection[], void>({
      query: () => ({ url: '/collections', method: 'GET' }),
      providesTags: ['Collection'],
    }),
    addCollection: builder.mutation<Collection, FormData>({
      query: (body) => ({
        url: '/collections',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Collection', 'Product'],
    }),
    updateCollection: builder.mutation<Collection, FormData>({
      query: (body) => ({
        url: '/collections/' + body.get('id'),
        method: 'PUT',
        data: body,
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
