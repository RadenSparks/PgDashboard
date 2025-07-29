import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'

export interface User {
  id: number;
  username: string;
  full_name: string;
  password?: string;
  email: string;
  role: string;
  phone_number?: string | null;
  avatar_url?: string | null;
  status: boolean;
  address?: string | null;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: axiosBaseQuery, // <-- FIXED: no parentheses, no arguments
  tagTypes: ['user'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({ url: '/users', method: 'GET' }),
      providesTags: ['user'],
    }),
    addUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: '/users/register',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['user'],
    }),
    updateUser: builder.mutation<User, { id: number; body: Partial<User> }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: ['user'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['user'],
    }),
    setUserStatus: builder.mutation<User, { id: number; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['user'],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => ({ url: `/users/${id}`, method: 'GET' }),
      providesTags: ['user'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSetUserStatusMutation,
  useGetUserByIdQuery,
} = usersApi;