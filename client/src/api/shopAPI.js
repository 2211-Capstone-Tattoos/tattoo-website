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
  tagTypes: ['Products', 'Artists', 'User', 'Cart'],
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
      query(data) {
        const {userId, body} = data
        return {
          url: `users/${userId}`,
          method: 'PATCH',
          body
        }
      },
      invalidatesTags: ['Users']
    }),
    deleteUser: builder.mutation({
      query(id) {
        return {
          url: `users/${id}`,
          method: 'DELETE',
        }
      }
    }),
    allUsers: builder.query({
      query: () => `users`,
      providesTags: ['Users']
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
    }),

    // Cart
    getCart: builder.query({
      query: (id) => `cart/${id}`,
      providesTags: ['Cart']
    }),

    addProductToCart: builder.mutation({
      query(data) {
        const { userId, productId, body } = data
        return {
          url: `cart/${userId}/${productId}`,
          method: 'POST',
          body
        }
      },
      invalidatesTags: ['Cart']
    }),

    patchCartProductQuantity: builder.mutation({
      query(data) {
        const { userId, body } = data
        return {
          url: `cart/${userId}`,
          method: 'PATCH',
          body
        }
      },
      invalidatesTags: ['Cart']
    }),

    removeProduct: builder.mutation({
      query({ userId, productId }) {
        console.log("this is productId and userId", productId, userId)
        return {
          url: `cart/${userId}/${productId}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      query(id) {
        return {
          url: `cart/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ["Cart"],
    }),
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
  useAllUsersQuery,
  useGetAllArtistsQuery,
  useGetArtistQuery,
  useGetCartQuery,
  useAddProductToCartMutation,
  usePatchCartProductQuantityMutation,
  useClearCartMutation,
  useRemoveProductMutation,
} = shopAPI