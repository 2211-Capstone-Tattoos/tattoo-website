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
  tagTypes: ['Products', 'Artists', 'User'],
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
            ...result.map(({ id }) => ({ type: 'Products', id })),
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
      query(data) {
        const { artistId, body } = data
        console.log(`artistId: ${artistId}  newBody: ${body}`)
        return {
          url: 'products',
          method: 'POST',
          body
        }
      },
      invalidatesTags: (result, error, { artistId }) => [{ type: 'Artists', artistId }],
    }),
    //updateProduct:
    updateProduct: builder.mutation({
      query(data) {
        const { artistId, productId, body } = data
        return {
          url: `products/${productId}`,
          method: 'PATCH',
          body
        }
      },
      invalidatesTags: (result, error, { artistId }) => [{ type: 'Artists', artistId }],
    }),
    //deleteProduct:
    deleteProduct: builder.mutation({
      query(data) {
        const { artistId, productId } = data
        return {
          url: `products/${productId}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (result, error, { artistId }) => [{ type: 'Artists', artistId }],
    }),

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
    }),
    updateUser: builder.mutation({
      query(body, id) {
        return {
          url: `users/${id}`,
          method: 'PATCH',
          body
        }
      }
    }),
    deleteUser: builder.mutation({
      query(id) {
        return {
          url: `users/${id}`,
          method: 'DELETE',
        }
      }

    }),

    // ARTISTS
    getAllArtists: builder.query({
      query: () => `artists`,

      //re-fetch *all* products upon tag invalidation
      //we can also have individual tag subscriptions with id: id
      providesTags: (result) =>
        result
          ? [
            //re-fetch if subscribed to a product containing 'id' upon invalidation
            //this will return an array of tags with each product's id and the 'LIST' id invalidated on addProduct
            ...result.map(({ id }) => ({ type: 'Artists', id })),
            { type: 'Artists', id: 'LIST' }
          ]
          : //else upon error, still re-fetch all products
          [{ type: 'Artists', id: 'LIST' }]
    }),

    getArtist: builder.query({
      query: (id) => `artists/${id}`,
      providesTags: (result, error, id) => [{ type: 'Artists', id }]
    })
  })
})

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useRegisterMutation,
  useLoginMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAllArtistsQuery,
  useGetArtistQuery, 
} = shopAPI