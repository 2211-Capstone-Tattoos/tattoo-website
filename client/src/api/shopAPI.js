import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_PATH || 'http://localhost:8080/api/'

export const shopAPI = createApi({
  reducerPath: 'shopAPI',
  baseQuery: fetchBaseQuery({baseUrl: API_URL}),
  tagTypes : ['Products'],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => `products`,
      
      //tags allow for 'stateless' rendering based on the application logic only using RTK query. The number of API calls will increase, but due to caching, the average packet size should decrease. It also greatly simplifies our app by allowing the UI actions to dictate what is fetched internally by RTK query. The logic is held internally by the query system, removing the need for reducer actions called inside useEffects on each pertinent component. Fantastic.

      //re-fetch *all* products upon tag invalidation
      //we can also have individual tag subscriptions with id: id
      providesTags: (result) => 
      result
      ? [
          //re-fetch if subscribed to a product containing 'id' upon invalidation
          //this will return an array of tags with each product's id and the 'LIST' id invalidated on addProduct
          ...result.map(({id}) => ({ type: 'Products', id })),
          { type: 'Products', id: 'LIST' }
        ]
      : //else upon error, still re-fetch all products
        [{ type: 'Products', id: 'LIST' }]
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }]
    }),
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