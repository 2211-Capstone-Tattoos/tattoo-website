import { createSlice } from "@reduxjs/toolkit";

const initialState = {}

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