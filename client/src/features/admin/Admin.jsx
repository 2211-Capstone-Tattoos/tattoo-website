import React from "react";
import { useAllUsersQuery } from "../../api/shopAPI"

const Admin = () => {
    const {data = []} = useAllUsersQuery();
    console.log(data)
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
                            <button>Make Artist</button>
                            <button>Make Admin</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Admin