import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { useGetCartQuery } from '../../api/shopAPI';
import './cart.css'

const Cart = () => {
  const { id } = useParams();
  const {data = [], isLoading, isFetching, isError} = useGetCartQuery(id);
  console.log("this is data: ", data)
  return (
    <div>
      <h2>Your Cart</h2>
    <div className="cart">
      <div id="your-cart">
      {
        isError
        ? <>Ope something broke!</>
        : isLoading || isFetching
        ? <>Loading Cart...</>
        : data.products.length
        ? data.products.map(product => {
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
      }
      </div>
      <div id="order-summary">
      <h3>Order Summary</h3>
        {
        data.products
        ? data.products.map(product => {
          return (
            <div key={product.id}>
              <p>{product.price}</p>
            </div>
          )
        }): null
        }
        <div>
        <h4>Your Total {data?.total}</h4>
        <button>Purchase</button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Cart
