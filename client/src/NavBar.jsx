import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCart } from './features/cart/cartSlice'
import { clearUser } from './features/users/userSlice'
import { setBlankToast } from './features/toast/toastSlice'
import LoginFloat from './features/login/LoginFloat'
import NavItems from './NavItems'
import { useEffect } from 'react'

const NavBar = ({ cartSelector }) => {
  const userId = JSON.parse(window.localStorage.getItem('user'))?.id
  const [openLogin, setOpenLogin] = useState(false)
  const [responsiveNav, setResponsiveNav] = useState(false)
  const [showNavItems, setShowNavItems] = useState(false)
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

  useEffect(() => {
    if (window.innerWidth < 590) {
      setResponsiveNav(true)
    }
  })

  return (
    <div className='navbar'>
      <div className="full-nav">
        <NavItems cartSelector={cartSelector} />
      </div>
      <div className="small-nav">
        <button onClick={() => setShowNavItems(!showNavItems)}>☰</button>
        {showNavItems
          ? <NavItems cartSelector={cartSelector} setShowNavItems={setShowNavItems} />
          : null
        }
      </div>
    </div>
  )
}

export default NavBar
