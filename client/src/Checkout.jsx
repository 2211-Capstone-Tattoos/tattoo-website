import React from 'react'
import { useState } from 'react'
import { useLoginMutation, useRegisterMutation } from './api/shopAPI'

const Checkout = () => {
  const [view, setView] = useState(null)

  return (
    <div className='checkout'>
      {!view
        ? <div>
          <h2>Would you like to..</h2>
          <button>Login</button>
          <button>Register</button>
          <button>Checkout As Guest</button>
        </div>
        : <></>
      }

    </div>
  )
}

export default Checkout
