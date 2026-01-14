import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ProductApislice = createApi({
    reducerPath: 'ProductApislice',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://lavishly-fogless-sang.ngrok-free.dev',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('ngrok-skip-browser-warning', 'true');
            return headers;
        }
    }),
    tagTypes: ['Products'],

    endpoints: (builder) => ({
        getProducts: builder.query<any, { page?: number; limit?: number } | void>({
            query: ({ page = 1, limit = 5 } = {}) => `api/v1/products?page=${page}&limit=${limit}`,
            providesTags: ['Products']
        }),
        getSpecificProduct: builder.query({
            query: (id: string) => `api/v1/products/${id}`,
            providesTags: ['Products']
        }),
        addProduct: builder.mutation({
            query: (formData: FormData) => ({
                url: 'api/v1/products',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Products']
        }),
        updateProduct: builder.mutation({
            query: ({ id, formData }: { id: string, formData: FormData }) => ({
                url: `api/v1/products/${id}`,
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: ['Products']
        }),
        deleteProduct: builder.mutation({
            query: (id: string) => ({
                url: `api/v1/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products']
        }),
    })
})

export const {
    useGetProductsQuery,
    useGetSpecificProductQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = ProductApislice;
