import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'
import { useSelector } from 'react-redux'
//const API_URL = import.meta.env.VITE_API_PATH || 'http://localhost:8080/api/'
const API_URL = "https://flashsheet.fly.dev/api/"

import './checkout.css'

// Personal test API 
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

const CheckoutPage = ({ completeOrder }) => {
  const [clientSecret, setClientSecret] = useState('')
  const [orderId, setOrderId] = useState('')
  const cartSelector = useSelector((state) => state.cart)

  // ---------Stripe---------
  useEffect(() => {
    fetch(`${API_URL}cart/create-payment-intent`, {
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
      <div></div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm completeOrder={completeOrder} orderId={orderId}/>
        </Elements>
      )}
      <div id="checkout-summary">
          <h3>Order Summary</h3>
          {
            cartSelector?.products
              ? cartSelector.products.map(product => {
                const imgUrl = new URL(`../../assets/images/${product.img}.png`, import.meta.url).href
                return (
                  <div key={product.id}>
                    <img src={imgUrl} alt="product-image" />
                    <p>{product.title}</p>
                    <p>{product.price}</p>
                    <p>Quantity: {product.quantity}</p>
                    <hr />
                  </div>
                )
              })
              : null
          }
          <h4>Total: ${cartSelector.total}</h4>
      </div>
    </div>
  )
}

export default CheckoutPage