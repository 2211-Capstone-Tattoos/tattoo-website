import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useClearCartMutation, useGetCartQuery, useRemoveProductMutation } from '../../api/shopAPI';
import Modal from 'react-modal'
Modal.setAppElement('#root');
import './cart.css'
import Checkout from '../../Checkout';

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart)
  const userId = JSON.parse(window.localStorage.getItem('user'))?.id
  const [clearCart] = useClearCartMutation();
  const [removeProduct] = useRemoveProductMutation();
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  console.log(cart)

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

  const { data = [] } = useGetCartQuery(userId);
  const prices = [];
  console.log('THIS IS DATA', data)
  // hey switch data.products to cart.products once cart works
  if (data.products) {
    data.products.map(product => {
      prices.push((+product.price.slice(1)) * product.quantity)
    })
  }

  let totalCart =
    (Math.round(prices.reduce((x, y) => {
      return x + y;
    }, 0) * 100) / 100).toFixed(2)

  prices.reduce((x, y) => {
    return x + y;
  }, 0)


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
                      <img src={product.img} alt="product-image" />
                      <div className="details">
                        <div className="top">
                          <Link to={`/products/${product.productId}`}><p>{product.title}</p></Link>
                          <p>{product.price}</p>
                        </div>
                        <div className="bottom">
                          <p>Quantity: {product.quantity}</p>
                          <button onClick={() => { const productId = product.productId; removeProduct({ userId, productId }) }}>Remove</button>
                        </div>
                      </div>
                    </div>
                  )
                })
                : <>Your Cart is empty</>
              : <>Loading Cart...</>
          }
          <h3>{`Subtotal (${cart ? cart.products.length : 0} items): $${totalCart}`}</h3>
          <button onClick={() => { clearCart(userId); console.log('this works brother') }}>Clear Cart</button>
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

            <h4>Your Total ${(Math.round(totalCart * 100) / 100).toFixed(2)}</h4>

          </div>
          <button onClick={() => {
            if (!userId) {
              openModal()
            } else {
              navigate('checkout')
            }
          }}>Checkout</button>
        </div>
      </div>
    </>
  )
}

export default Cart
