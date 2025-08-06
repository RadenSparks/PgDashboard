import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery';

export interface Review {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  user: { id: number; username: string };
  product?: { id: number; name: string }; // <-- add this
  status: 'Visible' | 'Hidden';
}

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    getAllReviews: builder.query<Review[], void>({
      query: () => ({
        url: `/reviews`,
        method: 'GET',
      }),
      providesTags: ['Review'],
    }),
    getProductReviews: builder.query<Review[], number>({
      query: (productId) => ({
        url: `/reviews/product/${productId}`,
        method: 'GET',
      }),
      providesTags: ['Review'],
    }),
  }),
});

export const { useGetAllReviewsQuery, useGetProductReviewsQuery } = reviewsApi;