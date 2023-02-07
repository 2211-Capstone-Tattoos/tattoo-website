import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserOrdersQuery } from '../../api/shopAPI'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import UpdateUserForm from './UpdateUserForm'
import './Orders.css'

const Orders = ({ user }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { id } = useParams()
  const { data = [], isLoading, isFetching, isError } = useGetUserOrdersQuery(id)
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  console.log('THIS IS DATA', data)
  console.log('THIS IS user', user)
  return (
    <div className='profile-order-container'>
      <div className="profile">
        <h2>Your profile</h2>
        <div className="profile-items">
          <img src={user.profile_img} alt="your profile picture" />
          <h3>{user.username}</h3>
          <p>Name: {user.fullname}</p>
          <p>Email: {user.email}</p>
          <p>Location: {user.location}</p>
          <hr />
          {user.is_artist
            ? <div>
              <p>Thanks for being one of our artists</p>
              <p>Description: {user.Description}</p>
            </div>
            : null
          }
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}>
          <button onClick={closeModal}>back</button>
          <UpdateUserForm user={user} closeModal={closeModal}></UpdateUserForm>
        </Modal>
        <button onClick={openModal}>Edit profile</button>
      </div>
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
                            const imgUrl = new URL(`../../assets/images/${product.img}.png`, import.meta.url).href

                            return (
                              <div className="order-product" key={product.id}>
                                <img src={imgUrl} alt="product-image" />
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
    </div>
  )
}

export default Orders
