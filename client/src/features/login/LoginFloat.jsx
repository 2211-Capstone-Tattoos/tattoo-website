import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loadUser } from '../users/userSlice'
import { useAddProductToCartMutation, useLoginMutation } from '../../api/shopAPI'

const LoginFloat = ({ setOpenLogin, cartSelector, setShowNavItems }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loginUser] = useLoginMutation()
  const [addToCart] = useAddProductToCartMutation()

  const loginUsernameRef = useRef()
  const loginPasswordRef = useRef()

  return (
    <div className="login-float">
      <>
        <form id='login-form' onSubmit={async (e) => {
          e.preventDefault()

          const body = {
            username: loginUsernameRef.current.value.toLowerCase(),
            password: loginPasswordRef.current.value
          }

          try {
            const { data: response } = await loginUser(body)

            if (response.token) {
              window.localStorage.setItem('token', response.token)
              window.localStorage.setItem('user', JSON.stringify(response.user))
              dispatch(loadUser(response.user))
              setOpenLogin(false)
              setShowNavItems(false)
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
            } else {
              throw new Error(response.error, response.message)
            }
          } catch (err) {
            throw err
          }
        }}>
          <div className="login-form-inputs">
            <div>
              <label htmlFor="username">Username: </label>
              <input type="text" id='usernameRef' ref={loginUsernameRef} defaultValue='' required={true} />
            </div>
            <div>
              <label htmlFor="password">Password: </label>
              <input type="password" ref={loginPasswordRef} required={true} />
            </div>
          </div>
        </form>
        <div className="login-buttons">
          <button type='submit' form='login-form'>Login</button>
          <button type='button' onClick={() => { setOpenLogin(false); setShowNavItems(false); navigate('/register/main'); }} >Register</button>
        </div>
      </>
    </div>
  )
}

export default LoginFloat
