import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'

// Match backend field names and types
export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: 'user' | 'admin';
  phone_number: string;
  avatar_url: string | null;
  status: boolean;
  address: string;
  points: number;
  minigame_tickets: number;
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
  status: string;
  discount: number;
  meta_title: string;
  meta_description: string;
  quantity_sold: number;
  quantity_stock: number;
  created_at: string;
  updated_at: string;
  images?: string[]; // For compatibility with order details
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
  payment_type: string;
  order_date: string;
  total_price: number;
  shipping_address: string;
  payment_status: string;
  productStatus: string;
  details: OrderDetail[];
  order_code?: string;
  paypal_order_id?: string;
}

export interface RefundRequest {
  id: number;
  user: User;
  order: Order;
  reason: string;
  amount: number;
  status: string;
  created_at: string;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: axiosBaseQuery,
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
    updateOrder: builder.mutation<Order, Partial<Order>>({
      query: (body) => ({
        url: `/orders/${body.id}`,
        method: 'PUT',
        data: body, // send as JSON
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
    updateStatus: builder.mutation<Order, { id: number; productStatus: string }>({
      query: ({ id, productStatus }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        data: { productStatus },
      }),
      invalidatesTags: ['Order'],
    }),
    getRefundRequests: builder.query<RefundRequest[], void>({
      query: () => ({ url: '/orders/refund-requests', method: 'GET' }),
      providesTags: ['Order'],
    }),
    updateRefundRequestStatus: builder.mutation<RefundRequest, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/refund-requests/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    processRefund: builder.mutation<RefundRequest, { id: number }>( {
      query: ({ id }) => ( {
        url: `/orders/refund-requests/${id}/process-refund`,
        method: 'PATCH', // <-- Change to PATCH
      } ),
      invalidatesTags: ['Order'],
    }),
    cancelOversoldOrders: builder.mutation<{ status: string }, void>({
      query: () => ({
        url: '/orders/cancel-oversold',
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
})

// Export hooks
export const {
  useGetOrdersQuery,
  useAddOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useUpdateStatusMutation,
  useGetRefundRequestsQuery,
  useUpdateRefundRequestStatusMutation,
  useProcessRefundMutation,
  useCancelOversoldOrdersMutation,
} = ordersApi
