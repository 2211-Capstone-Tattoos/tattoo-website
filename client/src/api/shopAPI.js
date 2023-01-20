import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_PATH || 'http://localhost:8080/api/'

export const shopAPI = createApi({
  reducerPath: 'shopAPI',
  baseQuery: fetchBaseQuery({baseUrl: API_URL}),
  tagTypes : ['Products'],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => `products`,

      //re-fetch *all* products upon tag invalidation
      //we can also have individual tag subscriptions with id: id
      providesTags: [{type: 'Products', id: 'LIST'}]
    }),
    //getProduct:
    addProduct: builder.mutation({
      query(body) {
        return {
          url: 'products',
          method: 'POST',
          body
        }
      },
      invalidatesTags: [{type: 'Products', id: 'LIST'}]
    }),
    //updateProduct:
    //deleteProduct:
  })
})

export const { useGetAllProductsQuery } = shopAPI