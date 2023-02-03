//const API_URL = import.meta.env.VITE_API_PATH || 'http://localhost:8080/api/'
const API_URL = "https://flashsheet.fly.dev/api/"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setToastPromise } from '../features/toast/toastSlice'

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
  tagTypes: ['Products', 'Artists', 'User', 'Cart', 'Orders'],
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
      providesTags: (result, error, id) => [{ type: 'Products', id }],
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
      invalidatesTags: (result, error, { artistId }) => [{ type: 'Products' }, { type: 'Artists', artistId }],
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Adding product...',
            success: "Got it in the bag",
            error: 'Error adding that product...'
          }
        }))
      }
    }),
    updateProduct: builder.mutation({
      query(data) {
        const { artistId, productId, body } = data
        return {
          url: `products/${productId}`,
          method: 'PATCH',
          body
        }
      },
      invalidatesTags: (result, error, { artistId }) => [{ type: 'Products' }, { type: 'Artists', artistId }],
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Updating product...',
            success: "Got it updated!",
            error: 'Error updating that product'
          }
        }))
      }
    }),
    deleteProduct: builder.mutation({
      query(data) {
        const { artistId, productId } = data
        return {
          url: `products/${productId}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (result, error, { artistId }) => [{ type: 'Products' }, { type: 'Artists', artistId }],
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Deleting product...',
            success: "She's gone",
            error: 'Error deleting that product'
          }
        }))
      }
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
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Registering...',
            success: "You're registered!",
            error: 'Trouble getting you registered in...'
          }
        }))
      }
    }),
    login: builder.mutation({
      query(body) {
        return {
          url: 'users/login',
          method: 'POST',
          body
        }
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Logging you in...',
            success: "You're logged!",
            error: 'Trouble getting you logged in...'
          }
        }))
      }
    }),
    updateUser: builder.mutation({
      query(data) {
        const { userId, body } = data
        return {
          url: `users/${userId}`,
          method: 'PATCH',
          body
        }
      },
      invalidatesTags: ['Users'],
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Applying your updates...',
            success: "All fresh!",
            error: 'Error getting you updated...'
          }
        }))
      }
    }),
    deleteUser: builder.mutation({
      query(id) {
        return {
          url: `users/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Users'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Saying goodbye...',
            success: "Gone for good.",
            error: 'Error deleting user'
          }
        }))
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
      providesTags: (result, error, id) => [{ type: 'Artists', id }],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Getting artist',
            success: "We got artist",
            error: "Could not get artist"
          }
        }))
      }
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
      invalidatesTags: ['Cart'],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Adding to cart...',
            success: "Added",
            error: 'Oops couldn\'t add that to your cart...'
          }
        }))
      }
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
      invalidatesTags: ['Cart'],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Updating cart...',
            success: "Good to go",
            error: 'Dang. Error updating your cart'
          }
        }))
      }
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
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Deleting from your cart...',
            success: "It's gone",
            error: 'Error removing product ;__;'
          }
        }))
      }
    }),

    clearCart: builder.mutation({
      query(id) {
        return {
          url: `cart/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ["Cart"],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Dumping your cart in the middle of the parking lot...',
            success: "Clear and clean",
            error: 'Trouble leaving your trash for others to pick up...'
          }
        }))
      }
    }),
    completeOrder: builder.mutation({
      query(body) {
        return {
          url: `cart/purchase`,
          method: 'POST',
          body
        }
      },
      invalidatesTags: ['Cart'],
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        dispatch(setToastPromise({
          promise: queryFulfilled,
          options: {
            loading: 'Wrapping up your order on our server',
            success: "Your order is all set",
            error: 'Error completing your order. Please contact customer service.'
          }
        }))
      }
    }),
    // ORDERS
    getUserOrders: builder.query({
      query: (userId) => `orders/${userId}`,
      providesTags: ['Orders']
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
  useCompleteOrderMutation,
  useRemoveProductMutation,
  useGetUserOrdersQuery
} = shopAPI
