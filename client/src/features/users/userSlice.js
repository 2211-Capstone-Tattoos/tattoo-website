import { createSlice } from "@reduxjs/toolkit";

//write GET /me to retrive user using localStorage token
const initialState = JSON.parse(window.localStorage.getItem('user')) || false

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUser: (state, action) => {
      return state = action.payload
    },
    clearUser: () => initialState
  }
})

export const { loadUser, clearUser } = userSlice.actions

export default userSlice.reducer