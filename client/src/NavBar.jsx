import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from './features/cart/cartSlice'
import { clearUser } from './features/users/userSlice'
import { setBlankToast } from './features/toast/toastSlice'
import LoginFloat from './features/login/LoginFloat'

const NavBar = ({cartSelector}) => {
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
                ? <>
                    <button onClick={() => setOpenLogin(!openLogin)}>Login</button>
                  </>
                : < NavLink
                  to="/">
                  <button onClick={() => handleLogout()}>Log Out</button>
                </NavLink>
              }
            </>
        }
      </div >
      <>{
      openLogin
      ? <>
          <LoginFloat setOpenLogin={setOpenLogin} cartSelector={cartSelector}/>
        </>
      : null
      }
      </>
    </>
  )
}

export default NavBar
