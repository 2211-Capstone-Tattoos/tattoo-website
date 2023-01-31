import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAllUsersQuery, useGetAllArtistsQuery, useUpdateUserMutation } from "../../api/shopAPI"
import "./Admin.css"

const AdminUsers = () => {

  const { data = [] } = useAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate()

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
  const deleteUser = async (userId) => {

  }


  return (
    <div>
      <div>
        <div className="users">All Users</div>
        <thead>
          <tr>
            <th>id</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Artist</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {data.map(user => {
            if (user.email) {
              return (
                <tr placementIndex={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username ? user.username : '---'}</td>
                  <td>{user.fullname ? user.fullname : '---'}</td>
                  <td>{user.email ? user.email : '---'}</td>
                  <td>{user.location ? user.location : '---'}</td>
                  <td><a onClick={() => makeArtist(user)}>{user.is_artist ? "\u2714" : "\u274C"}</a></td>
                  <td><a onClick={() => makeAdmin(user)}>{user.admin ? "\u2714" : "\u274C"}</a></td>
                  <td><a onClick={() => navigate(`${user.id}`)}>View Details</a></td>
                </tr>
              )
            }
          })}
        </tbody>
      </div>
    </div >
  )
}

export default AdminUsers
