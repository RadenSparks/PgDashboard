import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { CmsContent } from '../../components/pages/products/types'

export interface Product {
  id: number
  name: string
  type: string
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Product', 'CmsContent'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => ({ url: '/products', method: 'GET' }),
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
    getProductCms: builder.query<CmsContent, number>({
      query: (productId) => ({ url: `/products/${productId}/cms-content`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'CmsContent', id }],
    }),
    updateProductCms: builder.mutation<CmsContent, { productId: number; data: Partial<CmsContent> }>({
      query: ({ productId, data }) => ({
        url: `/products/${productId}/cms-content`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'CmsContent', id: productId }],
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
} = productsApi
