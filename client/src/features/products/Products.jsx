import React from 'react'
import { Form, Link, Outlet } from 'react-router-dom'
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
                    <p>{product.title}</p>
                    <div className="product-footer">
                      <Link to={`/products/${product.id}`}><button>View Product</button></Link>
                      <p>{product.price}</p>
                    </div>
                  </div>

                )
              }

            })
      }

    </div >
  )
}

export default Products
