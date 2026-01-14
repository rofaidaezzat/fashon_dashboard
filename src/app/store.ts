import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/crudAuth';
import { ProductApislice } from './services/crudProduct';
import { ContactUsApiSlice } from './services/crudContactus';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [ProductApislice.reducerPath]: ProductApislice.reducer,
        [ContactUsApiSlice.reducerPath]: ContactUsApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, ProductApislice.middleware, ContactUsApiSlice.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
