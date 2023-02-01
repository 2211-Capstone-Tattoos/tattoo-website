import React from "react";
import { useAllUsersQuery, useDeleteUserMutation, useGetAllArtistsQuery, useUpdateUserMutation } from "../../api/shopAPI"

const Admin = ({APIclearCart}) => {
    const { data = [] } = useAllUsersQuery();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const makeArtist = async (userId) => {
        const body = {
            is_artist: true
        }
        const data = {userId, body}
        const updatedUser = await updateUser(data)
    }
    const makeAdmin = async (userId) => {
        const body = {
            admin: true
        }
        const data = {userId, body}
        const updatedUser = await updateUser(data)
    }

    const removeAllOfUser = async (userId) => {
        await APIclearCart(userId);
        await deleteUser(userId)
    }

    return (
        <div>
            <div>
                <div>All Users</div>
                {data.map(user => {
                    return (
                        <div key={user.id}>
                            <p>Username: {user.username}</p>
                            <p>{user.fullname}</p>
                            <p>{user.email}</p>
                            <p>{user.profile_img}</p>
                            <p>{user.location}</p>
                            <button onClick={() => makeArtist(user.id)}>Make Artist</button>
                            <button onClick={() => makeAdmin(user.id)}>Make Admin</button>
                            <button onClick={() => removeAllOfUser(user.id)}>Delete User</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Admin