import { createSlice } from "@reduxjs/toolkit";

//write GET /me to retrive user using localStorage token
const initialState = JSON.parse(window.localStorage.getItem('user'))

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUser: (state, action) => {
      state.user = action.payload
    },
    emptyUser: (state) => {
      state = initialState
    }
  }
})

export const { loadUser, emptyUser } = userSlice.actions

export default userSlice.reducer