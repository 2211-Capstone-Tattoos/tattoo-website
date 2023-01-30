import React from 'react'
import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { loadUser } from '../users/userSlice'
import { useAddProductToCartMutation, useLoginMutation, useRegisterMutation } from '../../api/shopAPI'

const Login = ({ cartSelector }) => {
  const [loginView, setLoginView] = useState(true)
  const dispatch = useDispatch()
  const [registerUser] = useRegisterMutation()
  const [loginUser] = useLoginMutation()
  const [addToCart] = useAddProductToCartMutation()

  const emailRef = useRef()
  const usernameRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const passwordRef = useRef()

  const loginUsernameRef = useRef()
  const loginPasswordRef = useRef()

  return (
    <div className="login">
      {!loginView
        ? <>
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
              console.log(response)
              window.localStorage.setItem('token', response.token)
              window.localStorage.setItem('user', JSON.stringify(response.user))
              loadUser(response.user)
            } catch (err) {
              throw err
            }
          }}>
            <h4>Register</h4>
            <div>
              <label htmlFor="email">Email: </label>
              <input type="text" ref={emailRef} required={true} />
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
            <div>
              <button>Create account</button>
            </div>
          </form>
          <p>Already have an account?</p>
          <p><a onClick={() => setLoginView(!loginView)}>Click here</a> to login</p>
        </>

        : <>
          <form onSubmit={async (e) => {
            e.preventDefault()

            const body = {
              username: loginUsernameRef.current.value,
              password: loginPasswordRef.current.value
            }

            try {
              const { data: response } = await loginUser(body)
              if (response.token) {
                console.log(response)
                window.localStorage.setItem('token', response.token)
                window.localStorage.setItem('user', JSON.stringify(response.user))
                dispatch(loadUser(response.user))
                if (cartSelector.products.length) {
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
              } else {
                throw new Error(response.error, response.message)
              }
            } catch (err) {
              throw err
            }
          }}>
            <h4>Login</h4>
            <div>
              <label htmlFor="username">Username: </label>
              <input type="text" ref={loginUsernameRef} required={true} />
            </div>
            <div>
              <label htmlFor="password">Password: </label>
              <input type="password" ref={loginPasswordRef} required={true} />
            </div>
            <button>Login</button>
          </form>
          <p><a onClick={() => setLoginView(!loginView)}>Click here</a> to create an account</p>
        </>
      }
    </div>
  )
}

export default Login
