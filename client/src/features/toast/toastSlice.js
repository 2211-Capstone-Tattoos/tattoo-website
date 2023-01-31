import { createSlice } from "@reduxjs/toolkit";
import toast from 'react-hot-toast'

const initialState = {}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    loadingMessage: (state, action) => {
      return state = toast.loading(action.payload)
    },
    successMessage: (state, action) => {
      return state = toast.success(action.payload)
    },
    errorMessage: (state, action) => {
      return state = toast.error(action.payload)
    },
    setToastPromise: (state, action) => {
      return state = toast.promise(action.payload.promise, action.payload.options)
    }
  }
})

export const { loadingMessage, successMessage, errorMessage, setToastPromise } = toastSlice.actions
export default toastSlice.reducer