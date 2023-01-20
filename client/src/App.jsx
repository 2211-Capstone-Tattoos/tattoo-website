import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import NotFound from './NotFound'
import {
  Artists,
  Cart,
  Login,
  Orders,
  Products
} from './features'
import './App.css'

function App() {
  //const products = useSelector((state) => state.products)


  return (
    <div className="App">
      <Routes>
        <Route
          element={<Home />}
          exact path="/" />
        <Route
          element={<Login />}
          exact path="/login" />
        <Route
          element={<Products />}
          path="/products/*" />
        <Route
          element={<Artists />}
          path="/artists/*" />
        <Route
          element={<Orders />}
          path="/orders" />
        <Route
          element={<Cart />}
          path="/cart" />
        <Route
          element={<NotFound />}
          path="/*" />
      </Routes>
    </div>
  )
}

export default App
