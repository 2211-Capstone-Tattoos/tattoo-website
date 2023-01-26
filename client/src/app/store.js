import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { shopAPI } from '../api/shopAPI'

import productsReducer from '../features/products/productsSlice'
import cartReducer from '../features/cart/cartSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,

    [shopAPI.reducerPath]: shopAPI.reducer
  },

  middleware: (getDefaultMiddleware) => {
   return getDefaultMiddleware().concat(shopAPI.middleware)
  }
})

//setupListeners