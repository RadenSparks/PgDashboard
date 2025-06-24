import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'

export interface User {
  id: number;
  username: string;
  full_name: string;
  password: string;
  email: string;
  role: 'USER' | 'ADMIN';
  phone_number: string;
  avatar_url: string | null;
  status: boolean;
  address: string;
  points: number;
  minigame_tickets: number;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
}

export interface Delivery {
  id: number;
  name: string;
  description: string;
  fee: number;
  estimatedTime: string;
  isAvailable: boolean;
}

export interface Product {
  id: number;
  product_name: string;
  description: string;
  product_price: number;
  slug: string;
  status: 'Available' | 'Unavailable' | string;
  discount: number;
  meta_title: string;
  meta_description: string;
  quantity_sold: number;
  quantity_stock: number;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user: User;
  delivery: Delivery;
  coupon_id: number | null;
  coupon_code: string | null;
  payment_type: 'paypal' | 'payos' | string;
  order_date: string;
  total_price: number;
  shipping_address: string;
  payment_status: 'pending' | 'paid' | 'failed' | string;
  productStatus: 'pending' | 'shipped' | 'completed' | string;
  details: OrderDetail[];
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => ({ url: '/orders', method: 'GET' }),
      providesTags: ['Order'],
    }),
    addOrder: builder.mutation<Order, FormData>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrder: builder.mutation<Order, FormData>({
      query: (body) => ({
        url: '/orders/' + body.get('id'),
        method: 'PUT',
        data: body,
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useAddOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation
} = ordersApi
