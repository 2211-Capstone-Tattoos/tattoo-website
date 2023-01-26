import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { useGetCartQuery } from './api/shopAPI'
import { loadCart } from './features/cart/cartSlice'
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
  Product
} from './features'

import './App.css'

function App() {
  //const products = useSelector((state) => state.products)
  const dispatch = useDispatch()
  const user = JSON.parse(window.localStorage.getItem('user'))
  const { data = [] } = useGetCartQuery(user.id)
  //const stateCart = useSelector((state) => state.cart.value)
  const localCart = window.localStorage.getItem('cart')

  
  useEffect(() => {
    //check for db cart, then check localStorage, finally use empty init state.
    if (data.products) dispatch(loadCart(data))
    //else if (localCart.products) dispatch(loadCart(localCart))
  }, [data]) //change on log in


  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route
          element={<Home />}
          exact path="" />
        <Route
          element={<Login />}
          exact path="login" />
        <Route
          element={<Products />}
          path="products" />
        <Route
          element={<Product />}
          path="products/:id" />
        <Route
          element={<Artists />}
          exact path="artists/" />
        <Route
          element={<Artist />}
          path="artists/:id" />
        <Route
          element={<Orders />}
          path="orders" />
        <Route
          element={<Cart />}
          path="cart" />
        <Route
          element={<NotFound />}
          path="*" />
      </Routes>
    </div >
  )
}

export default App
