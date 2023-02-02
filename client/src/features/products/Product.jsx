import './Product.css'
import React from 'react'
import { useGetProductQuery, } from '../../api/shopAPI';
import { useParams } from 'react-router-dom';
import NotFound from '../../NotFound';
import userSlice from '../users/userSlice';
import { useState } from 'react'
import toast from 'react-hot-toast'

const Product = ({addProductToCart}) => {
  const { id } = useParams()
  const { data = [], isLoading, isFetching, isError, error } = useGetProductQuery(id)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (data) => {
    const product = {...data}
    product.quantity = quantity
    addProductToCart(product)
  }

  return (
    <>
      {isError 
      ? () => {toast.error('Something broke!'); console.error(error)}
      : !isLoading
        ? 
        <div className="single-product">
          {toast.dismiss()} 
          <div className="left">
            <div className="title">
              <h2>{data.title}</h2>
            </div>
            <div className="container">
              <div className="product-img">
                <img src={data.img}></img>
              </div>
              <div className="bottom">
                <div className="description">
                  {data.description}
                </div>
                {data.active
                ? null
                : <p>This product is no longer available</p>
                }
                <div className="product-footer">
                  <h2>{data.price}</h2>
                  <div>
                    <button onClick={() => { if (quantity > 1) setQuantity(quantity - 1) }} disabled={!data.active}>-</button>
                    {quantity}
                    <button onClick={() => setQuantity(quantity + 1)} disabled={!data.active}>+</button>
                  </div>
                  <button onClick={() => handleAddToCart(data)} disabled={!data.active}>Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
          </div>
        </div>
        : toast.loading('loading product...')
      }
    </>
  )
}

export default Product
