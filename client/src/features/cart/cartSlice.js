import { createSlice } from "@reduxjs/toolkit";

const initialState = { products: [] } //shopAPI -> localStorage -> null

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    loadCart: (state, action) => {
      //Init or modifying?
      try {
        state.id = action.payload.id
        state.isComplete = action.payload.is_complete
        state.userId = action.payload.userId
        state.products = action.payload.products
      } catch (err) {
        console.error('Error loading cart', err)
      }
    },
    addProduct: (state, action) => {
      state.products.push(action.payload)
    },
    editQuantity: (state, action) => {
      const product = state.products.find(prod => prod.id === action.payload.id)
      product.quantity = action.payload.quantity
    },
    removeProduct: (state, action) => {
      // payload = productId
      state.products = state.products.filter(product => product.id !== action.payload)
    },
    clearCart: (state) => {
      state.products = []
    }
  }
})

export const { loadCart, addProduct, editQuantity, removeProduct, clearCart } = cartSlice.actions

export default cartSlice.reducer