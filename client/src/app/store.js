import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import cartReducer from '../features/cart/cartSlice'
import userReducer from '../features/users/userSlice'
import { shopAPI } from '../api/shopAPI'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    [shopAPI.reducerPath]: shopAPI.reducer
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(shopAPI.middleware)
  }
})

//setupListeners