import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '../axiosBaseQuery'

export interface Voucher {
  collectionName: string;
  id: number;
  code: string;
  startDate: string;
  endDate: string;
  maxOrderValue: number;
  minOrderValue: number;
  usageLimit: number;
  discountPercent: number;
  status: "active" | "inactive" | "expired";
  milestonePoints?: number | null;
  description: string;
  collectionId?: number | null; // <-- add this line
}

export const vouchersApi = createApi({
  reducerPath: 'vouchersApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Voucher'],
  endpoints: (builder) => ({
    getVouchers: builder.query<Voucher[], void>({
      query: () => ({ url: '/coupons', method: 'GET' }),
      providesTags: ['Voucher'],
    }),
    addVoucher: builder.mutation<Voucher, Omit<Voucher, "id">>({
      query: (body) => ({
        url: '/coupons', // <-- CORRECT
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Voucher'],
    }),
    updateVoucher: builder.mutation<Voucher, Voucher>({
      query: (body) => ({
        url: '/coupons/' + body.id,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: ['Voucher'],
    }),
    deleteVoucher: builder.mutation<void, number>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Voucher'],
    }),
    setStatusVoucher: builder.mutation<void, { id: number; status: string }>({
      query: (body) => ({
        url: `/coupons/${body.id}/${body.status}/status`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Voucher'],
    }),

  }),
})

export const {
  useGetVouchersQuery,
  useAddVoucherMutation,
  useDeleteVoucherMutation,
  useSetStatusVoucherMutation,
  useUpdateVoucherMutation
} = vouchersApi
