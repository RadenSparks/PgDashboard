import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery';

const baseUrl = import.meta.env.VITE_BASE_API || "http://localhost:3000"; // Use Vite env

export interface MediaItem {
  id: number; // <-- use id, not _id
  url: string;
  folder: string;
  name: string;
}

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: axiosBaseQuery({ baseUrl }), // <-- Pass baseUrl here!
  tagTypes: ['Media'],
  endpoints: (builder) => ({
    getMedia: builder.query<MediaItem[], void>({
      query: () => ({ url: '/images', method: 'GET' }),
      providesTags: ['Media'],
    }),
    addMedia: builder.mutation<MediaItem, Partial<MediaItem>>({
      query: (body) => ({
        url: '/images',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Media'],
    }),
    deleteMedia: builder.mutation<void, string>({
      query: (id) => ({
        url: `/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),
    updateMedia: builder.mutation<MediaItem, Partial<MediaItem> & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `/images/${id}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: ['Media'],
    }),
  }),
});

export const {
  useGetMediaQuery,
  useAddMediaMutation,
  useDeleteMediaMutation,
  useUpdateMediaMutation,
} = mediaApi;