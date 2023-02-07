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
  const imgUrl = new URL(`../../assets/images/a${user.profile_img}.png`, import.meta.url).href

  return (
    <>
      <div className='profile-order-container'>
        <div className="profile">
        
          <div className="profile-items">
            <img src={user.is_artist ? imgUrl : user.profile_img} alt="your profile picture" />
            <div className="section">
              <div className="title">Username: </div>
              <div className="value">{user.username}</div>
            </div>
            <div className="section">
              <div className="title">Name: </div>
              <div className="value">{user.fullname}</div>
            </div>
            <div className="section">
              <div className="title">Email: </div>
              <div className="value">{user.email}</div>
            </div>
            <div className="section">
              <div className="title">Location:</div>
              <div className="value">{user.location}</div>
            </div>
            <hr />
            {user.is_artist
              ? <p>Thanks for being one of our artists</p>
              : null
            }
          </div>
          <button onClick={openModal}>Edit...</button>
          <Modal
            className="edit-modal"
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={{
              overlay: {
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0',
                padding: '0'
              }
            }}>
            <button className="back-button" onClick={closeModal}>{"\u274C"}</button>
            <UpdateUserForm user={user} closeModal={closeModal}></UpdateUserForm>
          </Modal>
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
    </>
  )
}

export default Orders
