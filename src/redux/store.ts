import { configureStore } from '@reduxjs/toolkit'
import { categoryApi } from './api/categoryApi'
import { tagsApi } from './api/tagsApi'
import { productsApi } from './api/productsApi'

export const store = configureStore({
    reducer: {
        [categoryApi.reducerPath]: categoryApi.reducer,
        [tagsApi.reducerPath]: tagsApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(categoryApi.middleware)
            .concat(tagsApi.middleware)
            .concat(productsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch