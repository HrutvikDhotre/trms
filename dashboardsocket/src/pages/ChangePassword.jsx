import React, { useState } from 'react'
import { Layout } from '../components'
import { useStateContext } from '../contexts/ContextProvider';
import axios from 'axios';
import { RiLockPasswordFill } from "react-icons/ri";
import '../styles/changepassword.css'
import '../styles/login.css'



const ChangePassword = () => {

    const { userEmail, currentColour, activeMenu } = useStateContext()
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })

    const [isValidLengthError, setIsValidLengthError] = useState(false)
    const [containsSpaceError, setContainsSpaceError] = useState(false)
    const [containsSpecialCharError, setContainsSpecialCharError] = useState(true)


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

    function checkWhitespace(str) {
        return /\s/.test(str);
    }

    function handleChange(event) {
        const checkSpecialChar = /[^A-Za-z0-9]/
        if (event.target.name === 'newPassword') {
            if (checkWhitespace(event.target.value))
                setContainsSpaceError(true)
            else
                setContainsSpaceError(false)
            if (!checkSpecialChar.test(event.target.value))
                setContainsSpecialCharError(false)
            else
                setContainsSpecialCharError(true)
            if (event.target.value.length < 6)
                setIsValidLengthError(true)
            else
                setIsValidLengthError(false)

        }

        // if (!containsSpaceError && containsSpecialCharError && !isValidLengthError)
        setFormData((prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })

        if (event.target.name === 'confirmPassword') {
            if (formData.newPassword !== event.target.value)
                document.getElementById('passwordsDontMatch').style.display = 'block'
            else if (formData.newPassword === event.target.value)
                document.getElementById('passwordsDontMatch').style.display = 'none'
        }


    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            if ((!containsSpaceError && containsSpecialCharError && !isValidLengthError) && (formData.newPassword === formData.confirmPassword)) {
                // return
                const data = await axios.post("http://localhost:5000/user/changepassword", { ...formData, username: userEmail })
                console.log(data.data)
                if (data.data.incorrectOldPassword) {
                    document.getElementById('incorrectOldPassword').style.display = 'block'
                    document.getElementById('samePasswords').style.display = 'none'
                } else if (data.data.samePasswords) {
                    document.getElementById('samePasswords').style.display = 'block'
                    document.getElementById('incorrectOldPassword').style.display = 'none'
                } else if (data.data.passwordUpdateSuccessfull) {
                    document.getElementById('updateSuccessful').style.display = 'block'
                    document.getElementById('samePasswords').style.display = 'none'
                    document.getElementById('incorrectOldPassword').style.display = 'none'
                    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' })
                }
            }
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <Layout>
            <div className='changePassword position-relative' >
                <div className='formContainer pb-5'
                    style={{
                        // box-shadow: ;
                        backgroundColor: 'white',
                        boxShadow: `rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px`,
                        position: 'absolute',
                        width: activeMenu ? '35%' : ''
                    }}>

                    <div className='p-0 mt-2' style={{}}>
                        {/* <RiLockPasswordFill></RiLockPasswordFill> */}
                        <img src="./images/password.gif" alt=""
                            style={{
                                width: '100px'
                            }}
                        />
                    </div>

                    <form onSubmit={handleSubmit} className='p-0 m-0'>
                        <div className='inputContainer'>
                            <input
                                required
                                type='password'
                                name='oldPassword'
                                value={formData.oldPassword}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            ></input>
                            <label htmlFor='oldPassword'>Old Password</label>
                        </div>
                        <p className='errorMsg' id='incorrectOldPassword'>Invalid old password!</p>

                        <div className='inputContainer'>
                            <input
                                required
                                type='password'
                                name='newPassword'
                                value={formData.newPassword}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            ></input>
                            <label htmlFor='password' >New Password</label>
                        </div>
                        <p className='errorMsg' id='samePasswords'>Old and new password can't be the same.</p>
                        {containsSpaceError && <p className='error'>Password should not contain spaces!</p>}
                        {isValidLengthError && <p className='error'>Password should contain atleast 6 characters.</p>}
                        {!containsSpecialCharError && <p className='error'>Password should contain special characters.</p>}

                        <div className='inputContainer'>
                            <input
                                required
                                type='password'
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            ></input>
                            <label htmlFor='password' >Confirm Password</label>
                        </div>
                        <p className='errorMsg' id='passwordsDontMatch'>Passwords don't match!</p>
                        <p className='successMsg ' id='updateSuccessful'>Password Updated Successfully!</p>

                        <div className='inputContainer'>
                            <button
                                type='submit'
                                style={{
                                    backgroundColor: currentColour,
                                    width: '100%',
                                    borderRadius: '5px',
                                    height: '43px',
                                    fontSize: '20px',
                                    color: 'white'
                                }}
                            >Change Password</button>
                        </div>

                    </form>
                </div >


            </div>
        </Layout>
    )
}

export default ChangePassword