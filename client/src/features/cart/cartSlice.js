import { createSlice } from "@reduxjs/toolkit";

const initialState = {products: []} //shopAPI -> localStorage -> null

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCart: (state, action) => {
      //Init or modifying?
      try {
        state.cart = action.payload
      } catch (err) {
        console.error('Error loading cart', err)
      }
    },
    addProductToCart: (state, action) => {
      state.cart += action.payload
    },
    removeProductFromCart: (state, action) => {
      // payload = productId
      state.cart = state.cart.filter(product => product.id !== action.payload)
    },
    clearCart: (state) => {
      state.cart = []
    }
  }
})

export const { loadCart, addToCart, removeProductFromCart, clearCart } = cartSlice.actions

export default cartSlice.reducer