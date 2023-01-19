import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: 0, artistId: 4, name: 'A cool one!', description: 'Very nice thing', price: '$50', img:'/sincerely-media-CjHJbp3zInA-unsplash.jpg'},
  { id: 1, artistId: 5, name: 'Another!', description: 'Like, a mediocre thing', price: '$501', img:'/sincerely-media-CjHJbp3zInA-unsplash.jpg'}
]

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    loadProducts: (state, action) => {
      state.products = action.payload
    }
  }
})

export const { loadProducts } = productsSlice.actions

export default productsSlice.reducer