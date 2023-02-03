import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { loadUser } from '../users/userSlice'
import { useAddProductToCartMutation, useLoginMutation, useRegisterMutation } from '../../api/shopAPI'

const Login = ({ cartSelector }) => {
  const params = useParams()

  const [loginView, setLoginView] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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

  const resetInputs = () => {
    emailRef.current.value = ''
    usernameRef.current.value = ''
    firstNameRef.current.value = ''
    lastNameRef.current.value = ''
    passwordRef.current.value = ''

    loginUsernameRef.current.value = ''
    loginPasswordRef.current.value = ''
  }

  return (
    <div className="login">
      {!loginView // REGISTER
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
              navigate('/')

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
            <div>
              <button>Create account</button>
            </div>
            <p>Already have an account?</p>
          </form>
          <button type='reset' onClick={() => { setLoginView(!loginView); resetInputs() }} >Click here to login</button>
        </>
        // LOGIN
        : <>
          <form onSubmit={async (e) => {
            e.preventDefault()

            const body = {
              username: loginUsernameRef.current.value.toLowerCase(),
              password: loginPasswordRef.current.value
            }

            try {
              const { data: response } = await loginUser(body)

              if (response.token) {
                console.log(response)
                window.localStorage.setItem('token', response.token)
                window.localStorage.setItem('user', JSON.stringify(response.user))
                dispatch(loadUser(response.user))

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
              <input type="text" id='usernameRef' ref={loginUsernameRef} defaultValue='' required={true} />
            </div>
            <div>
              <label htmlFor="password">Password: </label>
              <input type="password" ref={loginPasswordRef} required={true} />
            </div>
            <button>Login</button>
          </form>
          <button type='reset' onClick={() => { setLoginView(!loginView); resetInputs() }} >Click here to create an account</button>
        </>
      }
    </div>
  )
}

export default Login
