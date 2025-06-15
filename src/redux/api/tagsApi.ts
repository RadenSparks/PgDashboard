import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'

export interface Tag {
  id: number
  name: string
  type: string
}

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Tag'],
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => ({ url: '/tags', method: 'GET' }),
      providesTags: ['Tag'],
    }),
    addTag: builder.mutation<Tag, Partial<Tag>>({
      query: (body) => ({
        url: '/tags',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Tag'],
    }),
    updateTag: builder.mutation<Tag, Partial<Tag>>({
      query: (body) => ({
        url: '/tags/' + body.id,
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: ['Tag'],
    }),
    deleteTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tag'],
    }),
  }),
})

export const {
  useGetTagsQuery,
  useAddTagMutation,
  useDeleteTagMutation,
  useUpdateTagMutation
} = tagsApi
