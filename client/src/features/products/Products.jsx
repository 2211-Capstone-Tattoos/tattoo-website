import React from 'react'
import { Outlet } from 'react-router-dom'
import { useGetAllProductsQuery } from '../../api/shopAPI'

const Products = () => {
  const { data = [], isLoading, isFetching, isError } = useGetAllProductsQuery()

  return (
    <div className="products">{
      isError
        ? <>Oh noes something broke!</>
        : isLoading || isFetching
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
    }
    </div >
  )
}

export default Products
