import './Product.css'
import React from 'react'
import { useGetProductQuery, } from '../../api/shopAPI';
import { useParams } from 'react-router-dom';
import NotFound from '../../NotFound';
import userSlice from '../users/userSlice';
import { useState } from 'react'
import toast from 'react-hot-toast'

const Product = ({ addProductToCart }) => {
  const { id } = useParams()
  const { data = [], isLoading, isFetching, isError, error } = useGetProductQuery(id)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (data) => {
    const product = { ...data }
    product.quantity = quantity
    addProductToCart(product)
  }

  const imgUrl = new URL(`../../assets/images/${data.img}.png`, import.meta.url).href

  return (
    <>
      {isError
        ? () => { toast.error('Something broke!'); console.error(error) }
        : !isLoading
          ?
          <div id="main-single-product">
          <div className="single-product">
            {toast.dismiss()}
            <div className="left">
              <div className="title">
                <h2>{data.title}</h2>
              </div>
              <div className="container">
                <img src={imgUrl}></img>
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
                      <button id='single-product-increment' onClick={() => { if (quantity > 1) {setQuantity(quantity - 1)} }} disabled={!data.active}>-</button>
                      {quantity}
                      <button id='single-product-increment' onClick={() => setQuantity(quantity + 1)} disabled={!data.active}>+</button>
                    </div>
                    <button id='single-product-button' onClick={() => handleAddToCart(data)} disabled={!data.active}>Add to Cart</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="right">
            </div>
          </div>
          </div>
          : toast.loading('loading product...')
      }
    </>
  )
}

export default Product
