import './Product.css'
import React from 'react'
import { useGetProductQuery } from '../../api/shopAPI';
import { useParams } from 'react-router-dom';
import NotFound from '../../NotFound';

const Product = () => {
  const { id } = useParams()
  const { data = [], isLoading, isFetching, isError } = useGetProductQuery(id)
  console.log(data)
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
                  <button>Add to Cart</button>
                  <button>+</button>
                  <p>0</p>
                  <button>+</button>
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
