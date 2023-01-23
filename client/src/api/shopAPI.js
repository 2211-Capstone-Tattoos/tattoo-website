import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const API_URL = import.meta.env.VITE_API_PATH || 'http://localhost:8080/api/'

export const shopAPI = createApi({
  reducerPath: 'shopAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token") 
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes : ['Products', 'Artists', 'User'],
  endpoints: (builder) => ({

    //-------- Products ---------
    getAllProducts: builder.query({
      query: () => `products`,

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

    //-------- User --------
    register: builder.mutation({
      query(body) {
        return {
          url: 'users/register',
          method: 'POST',
          body
        }
      },
      //tags?
    }),
    login: builder.mutation({
      query(body) {
        return {
          url: 'users/login',
          method: 'POST',
          body
        }
      }
    })
  })
})

export const { 
  useGetAllProductsQuery, 
  useAddProductMutation, 
  useGetProductQuery,
  useRegisterMutation,
  useLoginMutation
} = shopAPI