import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { shopAPI } from '../api/shopAPI'

import productsReducer from '../features/products/productsSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,

    [shopAPI.reducerPath]: shopAPI.reducer
  },

  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware().concat(shopAPI.middleware)
  }
})

//setupListeners