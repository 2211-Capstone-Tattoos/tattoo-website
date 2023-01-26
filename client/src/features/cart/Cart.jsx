import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { useGetCartQuery } from '../../api/shopAPI';
import './cart.css'

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart)

  return (
    <div>
      <h2>Your Cart</h2>
    <div className="cart">
      <div id="your-cart">
      {
        cart
        ? cart.products?.length
          ? cart.products.map(product => {
            return (
              <div className="product-card" key={product.id}>
                <img src={product.img} alt="product-image" />
                <Link to={`/products/${product.productId}`}><p>Title: {product.title}</p></Link>
                <p>Price: {product.price}</p>
                <p>Quantity: {product.quantity}</p>
              </div>
            )
          })
          : <>Your Cart is empty</>
        : <>Loading Cart...</>
      }
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
        }): null
        }
        <div>
        <h4>Your Total {cart?.total}</h4>
        <button>Purchase</button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Cart
