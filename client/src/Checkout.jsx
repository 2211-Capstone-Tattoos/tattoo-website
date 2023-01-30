import React from 'react'
import { useState } from 'react'
import { useLoginMutation, useRegisterMutation } from './api/shopAPI'
import { useNavigate } from 'react-router-dom'
import { Login } from './features'

const Checkout = () => {
  const [view, setView] = useState(false)
  const navigate = useNavigate()



  return (

    <div className='checkout'>
      {!view
        ? <div>
          <h2>Would you like to..</h2>
          <button>Login</button>
          <button onClick={() => { setView(!view) }}>Register</button>
          <button onClick={() => navigate('/cart/checkout')}>Checkout As Guest</button>
        </div>
        : <Login />
      }

    </div>
  )
}

export default Checkout
