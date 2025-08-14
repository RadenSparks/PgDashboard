import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery';

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    markOrderAsPaid: builder.mutation<unknown, { orderId: number; userId: number; userRole: string }>({
      query: ({ orderId, userId, userRole }) => ({
        url: `/payments/mark-paid/${orderId}`,
        method: 'POST',
        data: { userId, userRole },
      }),
      invalidatesTags: ['Order'],
    }),
    refundOrder: builder.mutation<unknown, { orderId: number; userId: number; userRole: string }>({
      query: ({ orderId, userId, userRole }) => ({
        url: `/payments/refund/${orderId}`,
        method: 'POST',
        data: { userId, userRole },
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation<unknown, { orderId: number; userId: number; userRole: string }>({
      query: ({ orderId, userId, userRole }) => ({
        url: `/payments/cancel/${orderId}`,
        method: 'POST',
        data: { userId, userRole },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useMarkOrderAsPaidMutation,
  useRefundOrderMutation,
  useCancelOrderMutation,
} = paymentsApi;