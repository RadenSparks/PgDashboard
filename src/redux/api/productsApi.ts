import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'
import type { CmsContent, Product } from '../../components/pages/products/types' // <-- import Product here

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: axiosBaseQuery,
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
