import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from './features/cart/cartSlice'
import { clearUser } from './features/users/userSlice'
import { setBlankToast } from './features/toast/toastSlice'

const NavBar = () => {
  const userId = JSON.parse(window.localStorage.getItem('user'))?.id
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(setBlankToast('Logging you out...'))
    dispatch(clearCart())
    dispatch(clearUser())
    window.localStorage.clear()
    if (!window.localStorage.getItem('user')) {
      dispatch(setBlankToast('Logged out!'))
      navigate('/')
    }
  }

  return (
    <div className="navbar">
      {
        window.location.href.indexOf('admin') > -1
          ? <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-nav" : undefined
              }>
              <button>Main Site</button>
            </NavLink>
            <NavLink
              to="admin/users"
              className={({ isActive }) =>
                isActive ? "active-nav" : undefined
              }>
              <button>Users</button>
            </NavLink>
            <NavLink
              to="admin/orders"
              className={({ isActive }) =>
                isActive ? "active-nav" : undefined
              }>
              <button>Orders</button>
            </NavLink>
            <NavLink
              to="admin/products"
              className={({ isActive }) =>
                isActive ? "active-nav" : undefined
              }>
              <button>Products</button>
            </NavLink>
          </>
          : <>
            <div className="left-nav"></div>
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
            {
              userId
                ? <NavLink
                  to={`profile/${userId}`}
                  className={({ isActive }) =>
                    isActive ? "active-nav" : undefined
                  }>
                  <button>Profile</button>
                </NavLink>
                : <></>
            }


            <NavLink
              to={`cart`}
              className={({ isActive }) =>
                isActive ? "active-nav" : undefined
              }>
              <button>Cart</button>
            </NavLink>

            {!userId
              ? < NavLink
                to="login/nav"
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
          </>
      }
    </div >
  )
}

export default NavBar
