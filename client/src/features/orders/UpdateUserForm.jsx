import React from "react";
import { useRef } from "react";
import { useUpdateUserMutation } from "../../api/shopAPI";

 const UpdateUserForm = ({user, closeModal}) => {

    const [updateUser] = useUpdateUserMutation();

    const emailRef = useRef()
    const usernameRef = useRef()
    const fullnameRef = useRef()
    const profile_imgRef = useRef()
    const locationRef = useRef()
    const descriptionRef = useRef()
    const userId = user.id

    return (
        <div>
            <form onSubmit={async (e) => {
                e.preventDefault();
                const body = {
                    email: emailRef.current.value,
                    username: usernameRef.current.value,
                    fullname: fullnameRef.current.value,
                    profile_img: profile_imgRef.current.value,
                    location: locationRef.current.value,
                    description: descriptionRef.current.value
                }
                const data = {userId, body}
                const updatedProfile = await updateUser(data)
                console.log("this is updated profile",updatedProfile)
                // probably gonna have to change this bottom part brother
                window.localStorage.setItem('user', JSON.stringify(updatedProfile.data))
                closeModal();
                location.reload();
            }}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="text" ref={emailRef} defaultValue={user.email}/>
                </div>
                <div>
                    <label htmlFor="email">Username:</label>
                    <input type="text" ref={usernameRef} defaultValue={user.username}/>
                </div>
                <div>
                    <label htmlFor="email">Fullname:</label>
                    <input type="text" ref={fullnameRef} defaultValue={user.fullname}/>
                </div>
                <div>
                    <label htmlFor="email">Location:</label>
                    <input type="text" ref={locationRef} defaultValue={user.location}/>
                </div>
                {
                user.is_artist
                ?
                <div>
                <div>
                    <label htmlFor="email">Profile Picture:</label>
                    <input type="text" ref={profile_imgRef} defaultValue={user.profile_img}/>
                </div>
                <div>
                    <label htmlFor="email">Description:</label>
                    <input type="text" ref={descriptionRef} defaultValue={user.description}/>
                </div>
                </div>
                : null
                }
                <button>Submit</button>
            </form>
        </div>
    )
}

export default UpdateUserForm