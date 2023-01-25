import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Routes, Route } from 'react-router-dom'
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
          path="cart/:id" />
        <Route
          element={<NotFound />}
          path="*" />
      </Routes>
    </div >
  )
}

export default App
