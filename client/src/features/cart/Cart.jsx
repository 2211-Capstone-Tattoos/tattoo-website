import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-modal'
Modal.setAppElement('#root');
import './cart.css'
import Checkout from '../../Checkout';
import CartProduct from './CartProduct';
import { setBlankToast } from '../toast/toastSlice';
import { useEffect } from 'react';
import { sumCartTotal } from './cartSlice';

const Cart = ({ editCartProductQuantity, removeProductFromCart, clearCartProducts }) => {
  const cart = useSelector((state) => state.cart)
  const userId = JSON.parse(window.localStorage.getItem('user'))?.id
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  const prices = [];
  if (cart.products) {
    cart.products.map(product => {
      prices.push((+product.price.slice(1)) * product.quantity)
    })
  }

  let totalCart =
    (Math.round(prices.reduce((x, y) => {
      return x + y;
    }, 0) * 100) / 100).toFixed(2)

  useEffect(() => {
    dispatch(sumCartTotal(totalCart))
  }, [totalCart])

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0',
            padding: '0'
          },
          content: {
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '550px',
            left: '0',
            position: 'relative',
            flex: '0 0 auto',
          }
        }}
      >

        <button onClick={closeModal} style={{ width: '30px' }}>←</button>
        <Checkout />

      </Modal>
      <h2>Your Cart</h2>
      <div className="cart">
        <div id="your-cart">

          {
            cart // try passing down isLoading from cart query
              ? cart.products?.length
                ? cart.products.map(product => {
                  return (
                    <div className="product-card" key={product.id}>
                      <CartProduct product={product} editCartProductQuantity={editCartProductQuantity} removeProductFromCart={removeProductFromCart}/>
                    </div>
                  )
                })
                : <>Your Cart is empty</>
              : <>Loading Cart...</>
          }
          <h3>{`Subtotal (${cart && cart.products ? cart.products?.length : 0} items): $${totalCart}`}</h3>
          <button id="clear-button" onClick={() => { clearCartProducts() }}>Clear Cart</button>
        </div>
        <div id="order-summary">
          <h3>Order Summary</h3>
          {
            cart?.products
              ? cart.products.map(product => {
                return (
                  <div key={product.id}>
                    <p>{product.price}</p>
                  </div>
                )
              }) : null
          }
          <div>

            <h4>Your Total ${cart.total}</h4>

          </div>
          <button onClick={() => {
            if(cart.products) {
              if (!userId) {
                openModal()
              } else {
                navigate('checkout')
              }
            } else {
              dispatch(setBlankToast('You need some items in your cart before checking out.'))
            }
          }}>Checkout</button>
        </div>
      </div>
    </>
  )
}

export default Cart
