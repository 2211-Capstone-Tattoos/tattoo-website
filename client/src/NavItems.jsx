import React from 'react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from './features/cart/cartSlice'
import { clearUser } from './features/users/userSlice'
import { setBlankToast } from './features/toast/toastSlice'
import LoginFloat from './features/login/LoginFloat'

const NavItems = ({ cartSelector, setShowNavItems }) => {

  const userId = JSON.parse(window.localStorage.getItem('user'))?.id
  const [openLogin, setOpenLogin] = useState(false)
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
    <>
      {
        window.location.href.indexOf('admin') > -1
          ? <>
            <NavLink
              to="/"
              onClick={() => setShowNavItems(false)}
              className={({ isActive }) =>
                isActive ? "active-nav nav-link" : 'nav-link'

              }>
              <button>Main Site</button>
            </NavLink>
            <NavLink
              to="admin/users"
              onClick={() => setShowNavItems(false)}
              className={({ isActive }) =>
                isActive ? "active-nav nav-link" : 'nav-link'
              }>
              <button>Users</button>
            </NavLink>
            <NavLink
              to="admin/orders"
              onClick={() => setShowNavItems(false)}
              className={({ isActive }) =>
                isActive ? "active-nav nav-link" : 'nav-link'
              }>
              <button>Orders</button>
            </NavLink>
            <NavLink
              to="admin/products"
              onClick={() => setShowNavItems(false)}
              className={({ isActive }) =>
                isActive ? "active-nav nav-link" : 'nav-link'
              }>
              <button>Products</button>
            </NavLink>
          </>
          : <>
            <NavLink
              to="products"
              onClick={() => setShowNavItems(false)}
              className={({ isActive }) =>
                isActive ? "active-nav nav-link" : 'nav-link'
              }>
              <button>Products</button>
            </NavLink>
            <NavLink
              to="artists"
              onClick={() => setShowNavItems(false)}
              className={({ isActive }) =>
                isActive ? "active-nav nav-link" : 'nav-link'
              }>
              <button>Artists</button>
            </NavLink>
            {
              userId
                ? <NavLink
                  to={`profile/${userId}`}
                  onClick={() => setShowNavItems(false)}
                  className={({ isActive }) =>
                    isActive ? "active-nav nav-link" : 'nav-link'
                  }>
                  <button>Profile</button>
                </NavLink>
                : <></>
            }
            <NavLink
              to={`cart`}
              onClick={() => setShowNavItems(false)}
              className={({ isActive }) =>
                isActive ? "active-nav nav-link" : 'nav-link'
              }>
              <button>Cart</button>
            </NavLink>
            {!userId
              ? <>
                <button onClick={() => setOpenLogin(!openLogin)}>Login</button>
              </>
              : < NavLink
                className='nav-link'
                to="/">
                <button onClick={() => handleLogout()}>Log Out</button>
              </NavLink>
            }
          </>
      }
      <>{
        openLogin
          ? <>
            <LoginFloat setOpenLogin={setOpenLogin} cartSelector={cartSelector} />
          </>
          : null
      }
      </>
    </>
  )
}

export default NavItems
