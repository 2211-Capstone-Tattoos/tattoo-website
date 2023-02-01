import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import {
  useGetCartQuery,
  useAddProductToCartMutation,
  useClearCartMutation,
  usePatchCartProductQuantityMutation,
  useRemoveProductMutation
} from './api/shopAPI'
import { addProduct, loadCart, removeProduct, emptyCart } from './features/cart/cartSlice'
import Home from './Home'
import NotFound from './NotFound'
import NavBar from './NavBar'
import {
  Artists,
  Artist,
  Cart,
  Login,
  Orders,
  Products,
  Product,
  PurchaseCart,
  Admin,
  AdminUsers,
  UserDetails,
  AdminProducts
} from './features'
import { Toaster } from 'react-hot-toast'

import './App.css'
import { useDeferredValue } from 'react'

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

  // Cart population
  useEffect(() => {
    //check for db cart, then check localStorage, finally use empty init state.
    //TODO: add products from state to db on login
    if (user) {
      console.log('checking user to load cart...')
      if (data.products) {
        console.log('loading cart from db...')
        dispatch(loadCart(data))
      }
    }
    else if (localCart?.products) {
      console.log('loading cart from storage...')
      dispatch(loadCart(localCart))
      return
    }
  }, [user, data])

  // localStorage population
  useEffect(() => {
    updateCartStorage(cartSelector)
  })

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

  const editCartProductQuantity = (newCartState) => {
    dispatch(loadCart(newCartState))
    updateCartStorage(cartSelector)
    if (user) {
      const APIdata = {
        userId: user.id,
        body: {} //need to figure out db func.
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

  return (
    <div className="App">
      <NavBar user={user} />
      <Toaster
        position='top-right'
      //toastOptions={}
      />
      <Routes>
        <Route
          element={<Home />}
          exact path="" />
        <Route
          element={<Login cartSelector={cartSelector} />}
          exact path="login/:from" />
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
          element={<Orders />}
          path="orders/:id" />
        <Route
          element={<Cart editCartProductQuantity={editCartProductQuantity} removeProductFromCart={removeProductFromCart} clearCartProducts={clearCartProducts} />}
          exact path="cart/" />
        <Route
          element={<PurchaseCart />}
          path="cart/checkout" />
        <Route
          element={<Admin />}
          path="admin"
        />
        <Route
          element={<AdminUsers APIclearCart={APIclearCart}/>}
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
    </div >
  )
}

export default App
