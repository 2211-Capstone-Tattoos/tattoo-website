import React from 'react'
import { useRef } from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
  useRegisterMutation,
  useUpdateUserMutation
} from "../../api/shopAPI"
import "./Admin.css"

const AdminUsers = ({ APIclearCart }) => {

  const navigate = useNavigate()
  const { data = [] } = useAllUsersQuery();
  const [createUser] = useRegisterMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [search, setSearch] = useState('')
  const [addView, setAddView] = useState(false)
  const [editView, setEditView] = useState(null)
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('email')
  const [location, setLocation] = useState('')
  const [isArtist, setIsArtist] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState(false)


  const makeArtist = async (user) => {
    const body = {
      is_artist: !user.is_artist
    }
    const data = { userId: user.id, body }

    const updatedUser = await updateUser(data)
  }
  const makeAdmin = async (user) => {
    const body = {
      admin: !user.admin
    }
    const data = { userId: user.id, body }
    if (!user.admin) {
      if (confirm(`Are you sure you want to make ${user.username} an admin?`)) {
        const updatedUser = await updateUser(data)
      }
    } else {
      if (confirm(`Are you sure you remove ${user.username}'s admin access?`)) {
        const updatedUser = await updateUser(data)
      }
    }
  }
  //doesnt work yet brother
  const removeAllOfUser = async (user) => {

    if (confirm(`Are you sure you want to delete ${user.username}? This action can not be undone.`)) {
      if (user.admin) {
        window.alert('Cannot delete a user with admin privileges')
      } else {
        await APIclearCart(user.id);
        await deleteUser(user.id)

      }
    }
  }

  const handleSubmit = async (productId) => {
    const body = {
      username: username,
      fullname: fullname,
      email: email,
      location: location,
      isArtist: isArtist,
      admin: isAdmin,
      password: password
    }
    if (addView) {
      await createUser(body)
    }
    if (editView) {
      await updateUser(body)

    }
    setAddView(false)


  }

  const handleClose = () => {
    setAddView(false)

  }

  return (
    <div>
      <div className="header">
        <div className="users">All Users</div>
        <div className="search-bar">
          <input onChange={(e) => setSearch(e.target.value)}></input>
        </div>
        {
          addView
            ? <button onClick={() => handleClose()}>Close</button>
            : <button onClick={() => setAddView(true)}>Add User</button>
        }
      </div>
      <table>

        <thead>
          <tr>
            <th>id</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Artist</th>
            <th>Admin</th>
            {addView
              ? <th>password</th>
              : null
            }
          </tr>
        </thead>
        <tbody>
          {addView
            ? <tr style={{ backgroundColor: 'red' }}>
              <td>-</td>
              <td contentEditable onInput={(e) => setUsername(e.currentTarget.textContent)}>-</td>
              <td><div className="edit-field" contentEditable onInput={(e) => setFullname(e.currentTarget.textContent)}>-</div></td>
              <td><div className="edit-field" contentEditable onInput={(e) => setEmail(e.currentTarget.textContent)}>-</div></td>
              <td><div className="edit-field" contentEditable onInput={(e) => setLocation(e.currentTarget.textContent)}>-</div></td>
              <td>
                <select onChange={(e) => setIsArtist(e.target.value)}>
                  <option>false</option>
                  <option>true</option>
                </select>
              </td>
              <td>
                <select onChange={(e) => setIsAdmin(e.target.value)}>
                  <option>false</option>
                  <option>true</option>
                </select>
              </td>
              <td><div contentEditable onInput={(e) => setPassword(e.currentTarget.textContent)}>-</div></td>
              <td><button onClick={() => handleSubmit()}>{"\u2714"}</button></td>
            </tr>
            : <></>
          }
          {[...data]
            .sort((a, b) => {
              return a.id - b.id
            })
            .filter(user => {
              if (user.username?.includes(search?.toLowerCase()
              ) || user.fullname?.toLowerCase().includes(search?.toLowerCase()
              ) || user.email?.toLowerCase().includes(search?.toLowerCase()
              ))
                return true
            })
            .map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username ? user.username : '---'}</td>
                  <td>{user.fullname ? user.fullname : '---'}</td>
                  <td>{user.email ? user.email : '---'}</td>
                  <td>{user.location ? user.location : '---'}</td>
                  <td><a onClick={() => makeArtist(user)}>{user.is_artist ? "\u2714" : "\u274C"}</a></td>
                  <td><a onClick={() => makeAdmin(user)}>{user.admin ? "\u2714" : "\u274C"}</a></td>
                  <td><a onClick={() => navigate(`${user.id}`)}>View Details</a></td>
                  <td><a onClick={() => removeAllOfUser(user)}>Delete User</a></td>
                </tr>
              )

            }
            )
          }
        </tbody>
      </table>
    </div >
  )
}

export default AdminUsers
