import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery';

export interface Delivery {
  id: number;
  name: string;
  description?: string;
  fee?: number;
  estimatedTime?: string;
  isAvailable: boolean;
}

export const deliveryApi = createApi({
  reducerPath: 'deliveryApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getDeliveryMethods: builder.query<Delivery[], void>({
      query: () => ({ url: '/delivery', method: 'GET' }),
    }),
    // Add more endpoints if needed (create, update, delete)
  }),
});

export const { useGetDeliveryMethodsQuery } = deliveryApi;