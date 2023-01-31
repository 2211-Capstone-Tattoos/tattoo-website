import './Product.css'
import React from 'react'
import { useGetProductQuery, } from '../../api/shopAPI';
import { useParams } from 'react-router-dom';
import NotFound from '../../NotFound';
import userSlice from '../users/userSlice';
import { useState } from 'react';

const Product = ({addProductToCart}) => {
  const { id } = useParams()
  const { data = [], isLoading, isFetching, isError } = useGetProductQuery(id)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (data) => {
    const product = {...data}
    product.quantity = quantity
    addProductToCart(product)
  }

  return (
    <>
      {data.active
        ? <div className="single-product">
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
                <div className="product-footer">
                  <h2>{data.price}</h2>
                  <div>
                    <button onClick={() => { if (quantity > 1) setQuantity(quantity - 1) }}>-</button>
                    {quantity}
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => handleAddToCart(data)}>Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
          </div>
        </div>
        : <>Not working</>
      }
    </>
  )
}

export default Product
