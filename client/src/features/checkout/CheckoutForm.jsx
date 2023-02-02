import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { setBlankToast } from "../toast/toastSlice";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ completeOrder, orderId }) => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState()
  const [message, setMessage] = useState()
  const [isLoading, setIsLoading] = useState()


  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then( async ({ paymentIntent }) => {
      console.log(paymentIntent)
      switch (paymentIntent.status) {
        //figure out toasts.
        case "succeeded":
          dispatch(setBlankToast('It worked!'))
          setMessage('Success!!')
          await completeOrder(orderId)
          navigate('/cart')
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    })
  }, [stripe])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/cart/checkout' //payment completion page
      }
    })

    if(error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        console.error(error)
        setMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);

  }

  const paymentElementOptions = {
    layout: 'tabs'
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        //onChange={(e) => setEmail(e.target.value)}
      />
      <PaymentElement id='payment-element' options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}

    </form>
  )
}

export default CheckoutForm