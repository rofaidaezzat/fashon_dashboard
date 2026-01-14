import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ContactUsApiSlice = createApi({
    reducerPath: 'ContactUsApiSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://lavishly-fogless-sang.ngrok-free.dev',
        prepareHeaders: (headers, { getState }) => {
            // Check if auth slice exists in state before accessing
            const state = getState() as any;
            const token = state.auth?.accessToken || localStorage.getItem('accessToken');

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('ngrok-skip-browser-warning', 'true');

            return headers;
        }
    }),
    tagTypes: ['ContactUs'],
    endpoints: (builder) => ({
        getContactUs: builder.query<any, { page?: number; limit?: number } | void>({
            query: ({ page = 1, limit = 5 } = {}) => `api/v1/contact-us?page=${page}&limit=${limit}`,
            providesTags: ['ContactUs']
        }),
    })
});

export const { useGetContactUsQuery } = ContactUsApiSlice;
