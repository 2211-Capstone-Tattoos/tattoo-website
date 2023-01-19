import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetAllProductsQuery } from './api/shopAPI'
import './App.css'

function App() {
  //const products = useSelector((state) => state.products)
  const { data = [], isLoading, isError } = useGetAllProductsQuery()

  return (
    <div className="App">
      <div className="products">{
        isError
        ? <>Oh noes something broke!</>
        : isLoading 
          ? <>Loading products...</> 
          : data.map(product => {
            return (
              <div className="product-card" key={product.id}>
                <img src={product.img} alt="product-image" />
                <p>Title: {product.name}</p>
                <p>{product.description}</p>
                <p>Price: {product.price}</p>
              </div>
            )
          })
      }</div>
    </div>
  )
}

export default App
