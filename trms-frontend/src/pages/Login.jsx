import React, { useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'
// import des from '../assets/des.PNG'
const Login = () => {


  const { currentColour, isLoggedIn, setIsLoggedIn,userEmail, setUserEmail, name, setName ,setUserType,userType} = useStateContext();
  const [formData, setFormData] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  async function handleLogin(e) {
    try {
      e.preventDefault()
      const data = await axios.post("http://localhost:5000/user/login", formData)
      if (data.data.loginSuccess) {
        // console.log(data.data)
        setUserEmail(data.data.email)
        setName(data.data.name)
        setIsLoggedIn(true)
        setUserType(data.data.userType)
        console.log(data.data.userType)
        console.log(userType)
        if(data.data.userType == 'admin')
            navigate('/Add User')
        else
           navigate('/My Tasks')
      }
      else if (data.data.userNotFound) {
        document.getElementById('userNotFound').style.display = 'block'
        document.getElementById('invalidPassword').style.display = 'none'
      }
      else if (!data.data.passwordResult) {
        document.getElementById('invalidPassword').style.display = 'block'
        document.getElementById('userNotFound').style.display = 'none'
      }
    } catch (err) {
      console.log(err)
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


  return (
    <>
      <div className='formContainer pb-5' style={{}}>
        <div className='imageContainer mx-auto '>
          <img src="./images/des.PNG" alt="" style={{ width: '100%' }} />
        </div>
        <div className='p-0 my-3'
          style={{ fontWeight: '600', fontSize: '2.5rem' }}>Login
        </div>

        <form onSubmit={handleLogin} className='p-0 m-0'>
          <div className='inputContainer'>
            <input
              required
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></input>
            <label htmlFor='username'>Email</label>
          </div>
          <p className='errorMsg' id='userNotFound'>User does not exist!</p>

          <div className='inputContainer'>
            <input
              required
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></input>
            <label htmlFor='password' >Password</label>
          </div>
          <p className='errorMsg' id='invalidPassword'>Invalid Password!</p>


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
            >Login</button>
          </div>

        </form>
      </div >
    </>
  )
}

export default Login