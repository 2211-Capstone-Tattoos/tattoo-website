import React from 'react'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
  const userId = JSON.parse(window.localStorage.getItem('user'))?.id
  console.log(userId)

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
      {userId
        ? < NavLink
          to="login"
          className={({ isActive }) =>
            isActive ? "active-nav" : undefined
          }>
          <button>Login</button>
        </NavLink>

        : < NavLink
          to="login"
          className={({ isActive }) =>
            isActive ? "active-nav" : undefined
          }>
          <button>Log Out</button>
        </NavLink>
      }
    </div >
  )
}

export default NavBar
