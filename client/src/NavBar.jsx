import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from './features/cart/cartSlice'

const NavBar = () => {
  const userId = JSON.parse(window.localStorage.getItem('user'))?.id
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log(userId)

  const handleLogout = () => {
    dispatch(clearCart())
    window.localStorage.clear()
    navigate('/')
  }

  return (
    <div className="navbar">
      <NavLink
        to="products"
        className={({ isActive }) =>
          isActive ? "active-nav" : undefined
        }>
        <button>Products</button>
      </NavLink>
      <NavLink
        to="artists"
        className={({ isActive }) =>
          isActive ? "active-nav" : undefined
        }>
        <button>Artists</button>
      </NavLink>
      <NavLink
        to="orders"
        className={({ isActive }) =>
          isActive ? "active-nav" : undefined
        }>
        <button>Orders</button>
      </NavLink>
      <NavLink
        to={`cart`}
        className={({ isActive }) =>
          isActive ? "active-nav" : undefined
        }>
        <button>Cart</button>
      </NavLink>
      {!userId
        ? < NavLink
          to="login"
          className={({ isActive }) =>
            isActive ? "active-nav" : undefined
          }>
          <button>Login</button>
        </NavLink>

        : < NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "active-nav" : undefined
          }>
          <button onClick={() => handleLogout()}>Log Out</button>
        </NavLink>
      }
    </div >
  )
}

export default NavBar
