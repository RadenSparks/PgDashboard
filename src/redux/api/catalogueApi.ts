import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../redux/axiosBaseQuery';

export interface Catalogue {
  id: number;
  name: string;
  canonical?: string;
}

export const cataloguesApi = createApi({
  reducerPath: 'cataloguesApi',
  baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Catalogue'],
  endpoints: (builder) => ({
    getCatalogues: builder.query<Catalogue[], void>({
      query: () => ({ url: '/post-catalogues', method: 'GET' }),
      providesTags: ['Catalogue'],
    }),
    addCatalogue: builder.mutation<Catalogue, { name: string; canonical: string }>({
      query: (body) => ({
        url: '/post-catalogues',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Catalogue'],
    }),
    updateCatalogue: builder.mutation<Catalogue, { id: number; name: string; canonical: string }>({
      query: ({ id, ...body }) => ({
        url: `/post-catalogues/${id}`,
        method: 'PATCH',
        data: body,
      }),
      invalidatesTags: ['Catalogue'],
    }),
    deleteCatalogue: builder.mutation<void, number>({
      query: (id) => ({
        url: `/post-catalogues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Catalogue'],
    }),
  }),
});

export const {
  useGetCataloguesQuery,
  useAddCatalogueMutation,
  useUpdateCatalogueMutation,
  useDeleteCatalogueMutation,
} = cataloguesApi;