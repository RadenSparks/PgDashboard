import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axiosBaseQuery'

export interface Category {
  id: number
  name: string
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/categories', method: 'GET' }),
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: '/categories',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi
