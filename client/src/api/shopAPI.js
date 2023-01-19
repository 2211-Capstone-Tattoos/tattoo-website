import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_PATH || 'http://localhost:8080/api/'

export const shopAPI = createApi({
  reducerPath: 'shopAPI',
  baseQuery: fetchBaseQuery({baseUrl: API_URL}),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => `products`
    })
  })
})

export const { useGetAllProductsQuery } = shopAPI