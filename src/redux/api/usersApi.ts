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
  baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({ url: '/users', method: 'GET' }),
      providesTags: ['User'],
    }),
    addUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: number; body: Partial<User> }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;