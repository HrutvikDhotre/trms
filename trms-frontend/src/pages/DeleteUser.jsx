import React, { useState } from 'react'
import { Layout } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import '../styles/login.css'
import '../styles/resources.css'
import axios from 'axios'

const DeleteUser = () => {
    const { currentColour } = useStateContext()
    const [formData, setFormData] = useState({ useremail: '' })
    const [errorOccurred, setErrorOccurred] = useState(false)
    const [successfullyDeleted, setSuccessFullyDeleted] = useState(false)
    const [userDoesNotExists, setUserDoesNotExists] = useState(false)

    function handleChange(event) {
        setFormData((prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }

    function handleFocus(e) {
        e.target.style.border = `1.5px solid ${currentColour}`
        e.target.style.outline = `1.5px solid ${currentColour}`
        const label = e.target.parentNode.querySelector('label');
        if (label) {
            label.style.color = currentColour;
        }
    }

    function handleBlur(e) {
        e.target.style.border = ``
        e.target.style.outline = `none`
        const label = e.target.parentNode.querySelector('label');
        if (label) {
            label.style.color = '';
        }
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const useremail = formData.useremail
            const data = await axios.delete(`http://localhost:5000/user/deleteuser/${useremail}`)
            if (data.data.errorOccurred) {
                setUserDoesNotExists(false)
                setErrorOccurred(true)
            } else if (data.data.userDoesNotExists) {
                setErrorOccurred(false)
                setUserDoesNotExists(true)
            } else if (data.data.userDeletedSuccessfully) {
                setErrorOccurred(false)
                setUserDoesNotExists(false)
                setSuccessFullyDeleted(true)
            }
        } catch (err) {
            console.log(err)
            setErrorOccurred(true)
        }
    }
    return (
        <Layout>
            <div
                className='px-5 py-3'
                style={{
                    marginTop: '60px',
                    // overflow : backgroundEffect ? 'hidden' : ''
                }}
            >
                <div className='searchContainer p-3'
                    style={{
                        border: '1px solid rgba(0, 0, 0, 0.175)',
                        borderRadius: '10px',
                    }}
                >
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <div className='p-0 mt-2 ms-3' style={{ display: 'inline' }}>
                            {/* <RiLockPasswordFill></RiLockPasswordFill> */}
                            <img src="./images/remove-user.gif" alt=""
                                style={{
                                    width: '60px'
                                }}
                            />
                        </div>
                        <div className="inputContainer"
                            style={{
                                position: 'relative'
                            }}>
                            <input
                                required
                                type='text'
                                name='useremail'
                                value={formData.useremail}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                            <label htmlFor="">Email</label>


                        </div>
                        <div className='my-2 mx-3 text-center'>
                            <button
                                type='submit'
                                className='p-2 b1'
                                style={{
                                    backgroundColor: currentColour,
                                    borderRadius: '5px',
                                    height: '45px',
                                    fontSize: '18px',
                                    color: 'white'
                                }}
                            >
                                Delete User
                            </button>
                        </div>
                        {successfullyDeleted && <p className='success' id=''>User Deleted Successfully!</p>}
                        {errorOccurred && <p className='error'>Oops! An error occurred.</p>}
                        {userDoesNotExists && <p className='error'>User does not exist!</p>}
                    </form>
                </div>
                {/* <div className='mx-auto' style={{
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img src="./images/deleteuser.jpg" alt="Image" style={{
                        width: '60%',
                        height: '80%'
                    }} />
                </div> */}
            </div>
        </Layout>
    )
}

export default DeleteUser