import './Product.css'
import React from 'react'
import { useAddProductToCartMutation, useGetProductQuery, } from '../../api/shopAPI';
import { useParams } from 'react-router-dom';
import NotFound from '../../NotFound';
import userSlice from '../users/userSlice';
import { useState } from 'react';

const Product = () => {
  const { id } = useParams()
  const { data = [], isLoading, isFetching, isError } = useGetProductQuery(id)
  const [quantity, setQuantity] = useState(1)
  const [addProductToCart] = useAddProductToCartMutation()

  const handleAddToCart = async () => {

    const user = JSON.parse(window.localStorage.getItem('user'))
    try {
      if (!user) {
        const localCart = JSON.parse(window.localStorage.getItem('cart'))
        const newCart = []
        if (localCart) {
          localCart.map(item => {
            newCart.push(item)
          })
        }
        newCart.push({ id: data.id, quantity: quantity })
        console.log(newCart)
        window.localStorage.setItem('cart', JSON.stringify(newCart))

      } else {

        const body = { userId: user.id, productId: data.id, quantity }
        const addedProduct = await addProductToCart({ userId: user.id, productId: data.id, body })
        console.log(addedProduct)
      }


    } catch (error) {

    }
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
                  {data.price}
                  <button onClick={() => handleAddToCart()}>Add to Cart</button>
                  <button onClick={() => { if (quantity > 1) setQuantity(quantity - 1) }}>-</button>
                  {quantity}
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
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
