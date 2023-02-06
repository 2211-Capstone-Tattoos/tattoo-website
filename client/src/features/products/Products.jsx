import React from 'react'
import imgThree from "../../assets/images/3.png"
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
                const imgUrl = new URL(`../../assets/images/${product.img}.png`, import.meta.url).href
                console.log(imgUrl)
                console.log(product.img)
                return (
                  <div className="product-card" key={product.id}>
                    <img src={imgUrl} alt="product-image" />
                    <h3>{product.title}</h3>
                    <div className="product-footer">
                      <Link to={`/products/${product.id}`}><button>View Product</button></Link>
                      <h3>{product.price}</h3>
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
