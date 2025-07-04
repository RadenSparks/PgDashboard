import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery';

export interface Review {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  user: { id: number; username: string };
  status: 'Visible' | 'Hidden';
}

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    getProductReviews: builder.query<Review[], number>({
      query: (productId) => ({
        url: `/reviews/product/${productId}`,
        method: 'GET',
      }),
      providesTags: ['Review'],
    }),
    // ...other endpoints
  }),
});

export const { useGetProductReviewsQuery } = reviewsApi;