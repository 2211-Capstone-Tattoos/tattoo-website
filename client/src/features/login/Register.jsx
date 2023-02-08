import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { loadUser } from '../users/userSlice'
import { useAddProductToCartMutation, useRegisterMutation } from '../../api/shopAPI'

import './Register.css'

const Register = ({ cartSelector }) => {
  const params = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [registerUser] = useRegisterMutation()
  const [addToCart] = useAddProductToCartMutation()

  const emailRef = useRef()
  const usernameRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const passwordRef = useRef()

  return (
    <div className="register">
          <form onSubmit={async (e) => {
            e.preventDefault()

            const body = {
              email: emailRef.current.value,
              username: usernameRef.current.value,
              fullname: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
              password: passwordRef.current.value
            }

            try {
              const { data: response } = await registerUser(body)
              window.localStorage.setItem('token', response.token)
              window.localStorage.setItem('user', JSON.stringify(response.user))
              dispatch(loadUser(response.user))
              navigate('/')
              // Add existing cart to user db
              if (cartSelector.products?.length) {
                cartSelector.products.map(product => {
                  addToCart({
                    userId: response.user.id,
                    productId: product.id,
                    body: {
                      quantity: product.quantity
                    }
                  })
                })
              }
              if (params.from === 'cart-redirect') {
                navigate('/cart')
              } else {
                navigate('/')
              }
            } catch (err) {
              throw err
            }
          }}>
            <h4>Register</h4>
            <div className="register-inputs">
              <div>
                <label htmlFor="email">Email: </label>
                <input type="text" id='email-ref' ref={emailRef} defaultValue='' required={true} />
              </div>
              <div>
                <label htmlFor="username">Username: </label>
                <input type="text" ref={usernameRef} required={true} />
              </div>
              <div>
                <label htmlFor="first-name">First name: </label>
                <input type="text" ref={firstNameRef} required={true} />
              </div>
              <div>
                <label htmlFor="last-name">Last name: </label>
                <input type="text" ref={lastNameRef} required={true} />
              </div>
              <div>
                <label htmlFor="password">Password: </label>
                <input type="password" ref={passwordRef} required={true} minLength={8} />
              </div>
            </div>
            <div className='register-create-button'>
              <button>Create account</button>
            </div>
          </form>
    </div>
  )
}

export default Register
