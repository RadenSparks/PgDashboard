import { configureStore } from '@reduxjs/toolkit'
import { categoryApi } from './api/categoryApi'
import { tagsApi } from './api/tagsApi'
import { productsApi } from './api/productsApi'
import { ordersApi } from './api/ordersApi'
import { vouchersApi } from './api/vounchersApi'
import { postsApi } from './postsApi'

export const store = configureStore({
    reducer: {
        [categoryApi.reducerPath]: categoryApi.reducer,
        [tagsApi.reducerPath]: tagsApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
        [vouchersApi.reducerPath]: vouchersApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [postsApi.reducerPath]: postsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(categoryApi.middleware)
            .concat(tagsApi.middleware)
            .concat(productsApi.middleware)
            .concat(ordersApi.middleware)
            .concat(vouchersApi.middleware)
            .concat(postsApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch