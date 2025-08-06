import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery';

export interface MediaItem {
  id?: number; // <-- use id (number) to match backend
  url: string;
  folder: string;
  name: string;
  ord?: number;
  product?: { id: number };
}

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: axiosBaseQuery,
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
    deleteMedia: builder.mutation<void, number>({
      // Accepts numeric id
      query: (id) => ({
        url: `/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),
    deleteCloudinary: builder.mutation<{ success: boolean }, { publicId: string }>({
      query: ({ publicId }) => ({
        url: '/images/delete-cloudinary',
        method: 'POST',
        data: { publicId },
      }),
    }),
    deleteFolder: builder.mutation<{ deleted: number; deletedFromCloudinary: number }, string>({
      // Accepts folder path as string
      query: (path) => ({
        url: `/images/folder?path=${encodeURIComponent(path)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Media'],
    }),
    getFolders: builder.query<string[], void>({
      query: () => ({ url: '/images/folders', method: 'GET' }),
    }),
    updateMedia: builder.mutation<MediaItem, { id: number; data: Partial<MediaItem> }>({
      query: ({ id, data }) => ({
        url: `/images/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Media'],
    }),
  }),
});

export const {
  useGetMediaQuery,
  useAddMediaMutation,
  useDeleteMediaMutation,
  useDeleteCloudinaryMutation,
  useDeleteFolderMutation,
  useGetFoldersQuery,
  useUpdateMediaMutation,
} = mediaApi;