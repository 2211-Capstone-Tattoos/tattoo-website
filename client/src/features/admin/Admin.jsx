import React from "react";
import { useAllUsersQuery, useGetAllArtistsQuery, useUpdateUserMutation } from "../../api/shopAPI"
import "./Admin.css"

const Admin = () => {
    const { data = [] } = useAllUsersQuery();
    const [updateUser] = useUpdateUserMutation();

    const makeArtist = async (userId) => {
        const body = {
            is_artist: true
        }
        const data = { userId, body }
        const updatedUser = await updateUser(data)
    }
    const makeAdmin = async (userId) => {
        const body = {
            admin: true
        }
        const data = { userId, body }
        const updatedUser = await updateUser(data)
    }

    return (
        <div>
            <div>
                <div className="users">All Users</div>
                <thead>
                    <tr>
                        <th>Id</th>
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
                                <tr>
                                    <td>{user.id}</td>
                                    <td>{user.username ? user.username : '---'}</td>
                                    <td>{user.fullname ? user.fullname : '---'}</td>
                                    <td>{user.email ? user.email : '---'}</td>
                                    <td>{user.location ? user.location : '---'}</td>
                                    <td>{user.is_artist ? "\u2714" : "\u274C"}</td>
                                    <td>{user.admin ? "\u2714" : "\u274C"}</td>
                                    <td><a onClick={() => makeArtist(user.id)}>Make Artist</a></td>
                                    <td><a onClick={() => makeAdmin(user.id)}>Make Admin</a></td>
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </div>
        </div>
    )
}

export default Admin