import { createSlice } from "@reduxjs/toolkit";
import toast from 'react-hot-toast'

const initialState = {}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setBlankToast: (state, action) => {
      return state = toast(action.payload)
    },
    setCustomToast: (state, action) => {
      return state = toast.custom(action.payload)
    },
    setToastPromise: (state, action) => {
      return state = toast.promise(action.payload.promise, action.payload.options)
    }
  }
})

export const { setBlankToast, setCustomToast, setToastPromise } = toastSlice.actions
export default toastSlice.reducer