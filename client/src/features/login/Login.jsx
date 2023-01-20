import React from 'react'
import { useRef } from 'react'
import { useRegisterMutation } from '../../api/shopAPI'

const Login = () => {
  const [registerUser, { data = [], error, isError }] = useRegisterMutation()

  const emailRef = useRef()
  const usernameRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const passwordRef = useRef()

  return (
    <div className="login">
      This is Login
      <form onSubmit={(e) => {
        const body = {
          email: emailRef.current.value,
          username: usernameRef.current.value,
          fullname: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
          password: passwordRef.current.value
        }

        e.preventDefault()

        registerUser(body)
        console.log('data --->', data)
        isError && console.log('error --->', error)
      }}>
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
          <input type="password" ref={passwordRef} required={true}/>
        </div>
        <div>
          <button>Let's go!</button>
        </div>
      </form>
    </div>
  )
}

export default Login
