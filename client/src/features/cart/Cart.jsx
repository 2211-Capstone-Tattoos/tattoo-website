import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { useGetCartQuery } from '../../api/shopAPI';

const Cart = () => {
  const { id } = useParams();
  const {data = [], isLoading, isFetching, isError} = useGetCartQuery(id);
  //console.log("this is data: ", data)
  return (
    <div className="cart">
      <h2>Your Cart</h2>
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
              <p></p>
              <p>Price: {product.price}</p>
            </div>
          )
        })
        : <>Your Cart is empty</>
      }
      </div>
      <div id="order-summary">
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
        <h3>Your Total</h3>
        <p>{data?.total}</p>
        </div>
      </div>
    </div>
  )
}

export default Cart
