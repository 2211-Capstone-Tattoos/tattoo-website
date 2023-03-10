import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import {
  useGetCartQuery,
  useAddProductToCartMutation,
  useClearCartMutation,
  usePatchCartProductQuantityMutation,
  useRemoveProductMutation,
  useCompleteOrderMutation
} from './api/shopAPI'
import { addProduct, loadCart, removeProduct, emptyCart, editQuantity } from './features/cart/cartSlice'
import Home from './Home'
import NotFound from './NotFound'
import NavBar from './NavBar'
import Footer from './Footer'
import {
  Artists,
  Artist,
  Cart,
  Login,
  Orders,
  Products,
  Product,
  Admin,
  AdminUsers,
  UserDetails,
  AdminProducts
} from './features'
import { Toaster } from 'react-hot-toast'

import './App.css'
import CheckoutPage from './features/checkout/CheckoutPage'
import Register from './features/login/Register'

const updateCartStorage = (cart) => {
  window.localStorage.setItem('cart', JSON.stringify(cart))
}

function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const localCart = JSON.parse(window.localStorage.getItem('cart'))
  const cartSelector = useSelector((state) => state.cart)
  const { data = [] } = useGetCartQuery(user?.id)

  const [APIaddProduct] = useAddProductToCartMutation()
  const [APIeditQuantity] = usePatchCartProductQuantityMutation()
  const [APIremoveProduct] = useRemoveProductMutation()
  const [APIclearCart] = useClearCartMutation()
  const [APIcompleteOrder, { data: orderData = [] }] = useCompleteOrderMutation()

  // Cart population
  useEffect(() => {
    //check for db cart, then check localStorage, finally use empty init state.
    if (user) {
      console.log('checking user to load cart...')
      if (data?.products) {
        console.log('loading cart from db...')
        dispatch(loadCart(data))
      }
    }
  }, [user, data])

  useEffect(() => {
    if (localCart?.products) {
      console.log('loading cart from storage...')
      dispatch(loadCart(localCart))
    }
  }, [])

  // localStorage population
  useEffect(() => {
    updateCartStorage(cartSelector)
  })

  // ---------Cart Handlers---------
  const addProductToCart = (product) => {
    try {
      dispatch(addProduct(product))
      if (user) {
        const APIdata = {
          userId: user.id,
          productId: product.id,
          body: {
            quantity: product.quantity
          }
        }
        APIaddProduct(APIdata)
      }
    } catch (err) {
      throw err
    }
  }

  const editCartProductQuantity = (cartId, productId, quantity) => {
    dispatch(editQuantity({
      id: productId,
      quantity: quantity
    }))
    updateCartStorage(cartSelector)
    if (user) {
      const APIdata = {
        userId: user.id,
        body: {
          cartId,
          productId,
          quantity
        }
      }
      APIeditQuantity(APIdata)
    }
  }

  const removeProductFromCart = (product) => {
    dispatch(removeProduct(product.id))
    updateCartStorage(cartSelector)
    if (user) {
      const APIdata = {
        userId: user.id,
        productId: product.id
      }
      APIremoveProduct(APIdata)
    }
  }

  const clearCartProducts = () => {
    dispatch(emptyCart())
    updateCartStorage(cartSelector)
    if (user) {
      APIclearCart(user.id)
    }
  }

  const completeOrder = async (orderId) => {
    APIcompleteOrder({
      orderId
    })
    if (orderData) {
      dispatch(loadCart(orderData))
    } else {
      dispatch(emptyCart())
    }
    updateCartStorage(cartSelector)
  }

  return (
    <div className="App">
      <NavBar user={user} cartSelector={cartSelector} />
      {window.location.href.indexOf('admin') !== -1
        ? null
        : < NavLink to='/'>

          <h1 className='logo'>flashsheet</h1>
        </NavLink>
      }
      <Toaster
        position='bottom-right'
      //toastOptions={}
      />
      <div className='main'>
        <Routes>
          <Route
            element={<Home />}
            exact path="" />
          <Route
            element={<Register cartSelector={cartSelector} />}
            exact path="register/:from" />
          <Route
            element={<Products />}
            path="products" />
          <Route
            element={<Product addProductToCart={addProductToCart} />}
            path="products/:id" />
          <Route
            element={<Artists />}
            exact path="artists/" />
          <Route
            element={<Artist />}
            path="artists/:id" />
          <Route
            element={<Orders user={user} />}
            path="profile/:id" />
          <Route
            element={<Cart editCartProductQuantity={editCartProductQuantity} removeProductFromCart={removeProductFromCart} clearCartProducts={clearCartProducts} />}
            exact path="cart/" />
          <Route
            element={<CheckoutPage completeOrder={completeOrder} />}
            path='cart/checkout'
          />
          <Route
            element={
              <Navigate
                to='users'
                replace
              />}
            path="admin"
          />
          <Route
            element={<AdminUsers APIclearCart={APIclearCart} />}
            path="admin/users"
          />
          <Route
            element={<UserDetails />}
            path="admin/users/:userId"
          />
          <Route
            element={<AdminProducts />}
            path="admin/products"
          />
          <Route
            element={<NotFound />}
            path="*" />
        </Routes>
      </div>
      <Footer />
    </div >
  )
}

export default App
