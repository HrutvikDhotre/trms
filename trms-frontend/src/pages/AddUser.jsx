import React, { useState } from 'react'
import { Layout } from '../components'
import { useStateContext } from '../contexts/ContextProvider';
import axios from 'axios';
import '../styles/changepassword.css'
import '../styles/login.css'
import { HiUserAdd } from "react-icons/hi"

const AddUser = () => {
  const { currentColour, activeMenu } = useStateContext()
  const [formData, setFormData] = useState({ useremail: '', name: '', userType: '' })
  const [userExists, setUserExists] = useState(false)
  const [userAdded, setUserAdded] = useState(false)
  const [serverFailed, setserverFailed] = useState(false)

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

  function handleChange(event) {
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      }
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const data = await axios.post("http://localhost:5000/user/adduser", formData)
      // console.log(data.data)
      if (data.data.userAlreadyExists) {
        setUserExists(true)
        setUserAdded(false)
      }
      if (data.data.userAddedSuccessfully) {
        setUserExists(false)
        setUserAdded(true)
        setFormData({ useremail: '', name: '', userType: '' })
      }

      if (data.data.errorOccured)
        throw new Error("An error occurred")

    } catch (err) {
      console.log(err)
      setserverFailed(true)
    }

  }


  return (
    <Layout>
      <div className='changePassword position-relative ' >
        <div className='formContainer pb-5'
          style={{
            boxShadow: `rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px`,
            position: 'absolute',
            width: activeMenu ? '35%' : '',
            // top : '30%'
          }}>

          <div className='p-0 mt-2' style={{}}>
            {/* <RiLockPasswordFill></RiLockPasswordFill> */}
            <img src="./images/add-user.gif" alt=""
              style={{
                width: '100px'
              }}
            />
          </div>
          <form onSubmit={handleSubmit} className='p-0 m-0'>
            <div className='inputContainer'>
              <input
                required
                type='email'
                name='useremail'
                value={formData.useremail}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              ></input>
              <label htmlFor='oldPassword'>Email</label>
            </div>
            <p className='errorMsg' id='incorrectOldPassword'>Invalid old password!</p>

            <div className='inputContainer'>
              <input
                required
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              ></input>
              <label htmlFor='password' >Full Name</label>
            </div>


            <div className='inputContainer'>
              <select
                required
                name="userType"
                style={{
                  width: '100%',
                  height: '45px',
                  borderRadius: '6px',
                  fontSize: '18px',
                  padding: '0 15px',
                  outline: 'none',
                  border: ' 0.1px solid rgb(212, 212, 212)'
                }}
                onChange={handleChange}
                value={formData.userType}
              >
                <option value="" disabled>Choose Usertype</option>
                <option value="admin">Admin</option>
                <option value="user" >Faculty</option>
              </select>
            </div>

            {userExists && <p className='error' id=''>User Already Exist!</p>}

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
              >Add User</button>
            </div>
            {userAdded && <p className='success' id=''>User Added Successfully!</p>}
            {serverFailed && <p className='error' id=''>Oops! An error occured.</p>}

          </form>
        </div >


      </div>
    </Layout>
  )
}

export default AddUser