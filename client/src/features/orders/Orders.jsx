import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserOrdersQuery } from '../../api/shopAPI'
import { Link } from 'react-router-dom'
import './Orders.css'

const Orders = () => {
  const { id } = useParams()
  const { data = [], isLoading, isFetching, isError } = useGetUserOrdersQuery(id)

  console.log('THIS IS DATA', data)
  return (
    <div className="orders">
      <h2>Your Orders</h2>
      {
        isError
          ? <>Oh no, something broke!</>
          : isLoading || isFetching
            ? <>Loading Products...</>
            : data.length
              ? data.map((order, index) => {
                const orderedAt = (new Date(order.ordered_at))
                  .toString()
                  .split(' ')
                  .slice(1, 4)
                  .join(' ')
                return (
                  <div className="order" key={index}>
                    <div className="header">
                      <p>Order placed: {orderedAt}</p>
                      <p>Order #: {order.id}</p>
                      <p>Total: {order.total}</p>
                    </div>
                    <div className="order-products">
                      {
                        order.products.map((product) => {
                          return (
                            <div className="order-product">
                              <img src={product.img} alt="product-image" />
                              <div className="details">
                                <h3>{product.title}</h3>

                                <h3>{product.paid_price}</h3>
                                <h3>Quantity: {product.quantity}</h3>
                                <Link to={`/products/${product.id}`}><button>View Product</button></Link>

                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              })
              : <>There's nothing here!</>
      }
    </div>
  )
}

export default Orders
