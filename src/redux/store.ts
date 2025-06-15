import { configureStore } from '@reduxjs/toolkit'
import { categoryApi } from './api/categoryApi'
import { tagsApi } from './api/tagsApi'

export const store = configureStore({
    reducer: {
        [categoryApi.reducerPath]: categoryApi.reducer,
        [tagsApi.reducerPath]: tagsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(categoryApi.middleware)
            .concat(tagsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch