import React from 'react'
import { useRef } from 'react'
import { useLoginMutation, useRegisterMutation } from '../../api/shopAPI'

const Login = () => {
  const [registerUser] = useRegisterMutation()
  const [loginUser] = useLoginMutation()

  const emailRef = useRef()
  const usernameRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const passwordRef = useRef()

  const loginUsernameRef = useRef()
  const loginPasswordRef = useRef()

  return (
    <div className="login">
      This is Login
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
        } catch (err) {
          throw err
        }
      }}>
        <h4>Register</h4>
        <div>
          <label htmlFor="email">Email: </label>
          <input type="text" ref={emailRef} required={true}/>
        </div>
        <div>
          <label htmlFor="username">Username: </label>
          <input type="text" ref={usernameRef} required={true}/>
        </div>
        <div>
          <label htmlFor="first-name">First name: </label>
          <input type="text" ref={firstNameRef} required={true}/>
        </div>
        <div>
          <label htmlFor="last-name">Last name: </label>
          <input type="text" ref={lastNameRef} required={true}/>
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" ref={passwordRef} required={true} minLength={8} />
        </div>
        <div>
          <button>Let's go!</button>
        </div>
      </form>
      <hr />
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
        <button>Login!</button>
      </form>
    </div>
  )
}

export default Login
