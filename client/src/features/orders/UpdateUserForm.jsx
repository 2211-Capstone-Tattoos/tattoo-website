import React from "react";
import { useRef } from "react";
import { useUpdateUserMutation } from "../../api/shopAPI";

const UpdateUserForm = ({ user, closeModal }) => {

    const [updateUser] = useUpdateUserMutation();

    const emailRef = useRef()
    const usernameRef = useRef()
    const fullnameRef = useRef()
    const profile_imgRef = useRef()
    const locationRef = useRef()
    const descriptionRef = useRef()
    const userId = user.id

    return (
        <div className="edit-profile">
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
                const data = { userId, body }
                const updatedProfile = await updateUser(data)
                window.localStorage.setItem('user', JSON.stringify(updatedProfile.data))
                closeModal();
                location.reload();
            }}>
                <div className="section">
                    <div className="label"><label htmlFor="email">Email:</label></div>
                    <div className="value"><input type="text" ref={emailRef} defaultValue={user.email} /></div>
                </div>
                <div className="section">
                    <div className="label"><label htmlFor="email">Username:</label></div>
                    <div className="value"><input type="text" ref={usernameRef} defaultValue={user.username} /></div>
                </div>
                <div className="section">
                    <div className="label"><label htmlFor="email">Fullname:</label></div>
                    <div className="value"><input type="text" ref={fullnameRef} defaultValue={user.fullname} /></div>
                </div>
                <div className="section">
                    <div className="label"><label htmlFor="email">Location:</label></div>
                    <div className="value"><input type="text" ref={locationRef} defaultValue={user.location} /></div>
                </div>
                {
                    user.is_artist
                        ? <>
                            <div className="section">
                                <div className="label"><label htmlFor="email">Profile Picture:</label></div>
                                <div className="value"><input type="text" ref={profile_imgRef} defaultValue={user.profile_img} /></div>
                            </div>
                            <div className="section">
                                <div className="label"><label htmlFor="email">Description:</label></div>
                                <div className="value"><textarea cols="30" rows="8" ref={descriptionRef} defaultValue={user.description} /></div>
                            </div>
                        </>
                        : null
                }
                <button>Submit</button>
            </form>
        </div>
    )
}

export default UpdateUserForm