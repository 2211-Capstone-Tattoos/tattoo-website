import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'

// Generic test API 
// CHANGE BEFORE PRODUCTION
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx")

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState('')

  // ---------Stripe---------
  useEffect(() => {
    fetch('http://localhost:8080/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'test-item' }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
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
          <CheckoutForm />
        </Elements>
      )}
    </div>
  )
}

export default CheckoutPage