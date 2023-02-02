import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import { useSelector } from 'react-redux'

// Generic test API 
// CHANGE BEFORE PRODUCTION
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

const CheckoutPage = ({ completeOrder }) => {
  const [clientSecret, setClientSecret] = useState('')
  const [orderId, setOrderId] = useState('')
  const cartSelector = useSelector((state) => state.cart)

  // ---------Stripe---------
  useEffect(() => {
    fetch('http://localhost:8080/api/cart/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.localStorage.getItem('token')}`
      },
      body: JSON.stringify(cartSelector),
    })
      .then((res) => res.json())
      .then((data) => {setClientSecret(data.clientSecret); setOrderId(data.orderId)})
  }, [])

  const appearance = {
    theme: 'stripe'
  }
  const options = {
    clientSecret,
    appearance
  }

  return (
    <div className='checkout'>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm completeOrder={completeOrder} orderId={orderId}/>
        </Elements>

      )}
    </div>
  )
}

export default CheckoutPage