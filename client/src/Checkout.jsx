import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLoginMutation, useRegisterMutation } from './api/shopAPI'

const Checkout = () => {
  const [view, setView] = useState(null)

  return (
    <div className='checkout'>
      {!view
        ? <div>
          <h2>Would you like to..</h2>
          <Link to='/register/cart-redirect'><button>Login or Register?</button></Link>
          <Link to='/cart/checkout'><button>Checkout as Guest</button></Link>
        </div>
        : <></>
      }

    </div>
  )
}

export default Checkout
