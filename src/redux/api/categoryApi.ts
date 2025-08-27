import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'

export interface Category {
  id: number
  name: string
  description?: string
  deletedAt?: string | null
}

// Interface for soft-deleted category recovery
export interface RecoverCategory {
  id: number
  name: string
  description?: string
  deletedAt: string // ISO date string
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/categories', method: 'GET' }),
      providesTags: ['Category'],
    }),
    getDeletedCategories: builder.query<RecoverCategory[], void>({ // <-- Add this endpoint
      query: () => ({ url: '/categories?deleted=true', method: 'GET' }),
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
    updateCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: '/categories/' + body.id,
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    restoreCategory: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/categories/${id}/restore`,
        method: 'PUT',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetDeletedCategoriesQuery, // <-- Export this hook
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useRestoreCategoryMutation
} = categoryApi
