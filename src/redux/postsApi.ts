import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export interface Post {
  id: number;
  name: string;
  canonical: string;
  description?: string;
  content: string;
  meta_description?: string;
  meta_keyword?: string;
  meta_title?: string;
  image?: string;
  order?: number;
  publish?: boolean;
  created_at?: string;
  updated_at?: string;
  catalogueId?: number;
  catalogue?: any;
  galleryImages?: string[];
  textColor?: string;
  bgColor?: string;
  fontFamily?: string;
  fontSize?: string;
}

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => ({ url: '/posts', method: 'GET' }),
      providesTags: ['Post'],
    }),
    getPost: builder.query<Post, number>({
      query: (id) => ({ url: `/posts/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: '/posts',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation<Post, { id: number; body: Partial<Post> }>({
      query: ({ id, body }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: ['Post'],
    }),
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;