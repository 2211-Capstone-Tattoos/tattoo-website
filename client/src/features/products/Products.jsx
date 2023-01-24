import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useGetAllProductsQuery } from '../../api/shopAPI'

const Products = () => {
  const { data = [], isLoading, isFetching, isError } = useGetAllProductsQuery()

  return (
    <div className="products">
      {
        isError
          ? <>Oh noes something broke!</>
          : isLoading || isFetching
            ? <>Loading products...</>
            : data.map(product => {
              if (product.active) {
                return (
                  <div className="product-card" key={product.id}>
                    <img src={product.img} alt="product-image" />
                    <Link to={`/products/${product.id}`}><p>Title: {product.title}</p></Link>
                    <p>{product.description}</p>
                    <p>Price: {product.price}</p>
                    <p>{product.active ? 'true' : 'false'}</p>
                  </div>
                )
              }
            })
      }

    </div >
  )
}

export default Products
