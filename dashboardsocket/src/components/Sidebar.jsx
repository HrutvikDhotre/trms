import React, { useTransition } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider';
import { RxCross2 } from "react-icons/rx";
import { links, adminLinks } from '../data/sidebardata'
import '../styles/sidebar.css'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {


  const { setActiveMenu, screenSize, themeMode, currentColour, setCurrentColour, userType } = useStateContext();
  const navigate = useNavigate()


  const sideBarStyles = {
    // color : lightMode  ? 'black' : 'white',
  }



  const handleClick = () => {
    if (screenSize && screenSize < 576)
      setActiveMenu(false)
  }

  const getLinks = links.map((data) => (
    <div
      key={data.key}
      className='mt-3'
    >
      <p style={{ fontSize: '17px' }} className='text-uppercase fw-light'>
        {data.title}
      </p>
      {data.links.map((link) =>
        <NavLink
          to={`/${link.name}`}
          className='navlinks py-2 my-2 px-1 d-flex'
          key={link.name}
          style={({ isActive }) => ({
            backgroundColor: isActive ? currentColour : '',
            color: themeMode === 'light' ? (isActive ? 'white' : 'black') : (isActive ? 'black' : 'white'),
            fontSize: isActive ? 'large' : ''
          })}
          onClick={handleClick}
        >
          <span className="text-capitalize ms-2 fw-medium">{link.icon}{link.name}</span>
        </NavLink>
      )}
    </div>
  ))

  const getAdminLinks = adminLinks.map((data) => (
    <div
      key={data.key}
      className='mt-3'
    >
      <p style={{ fontSize: '17px' }} className='text-uppercase fw-light'>
        {data.title}
      </p>
      {data.links.map((link) =>
        <NavLink
          to={`/${link.name}`}
          className='navlinks py-2 my-2 px-1 d-flex'
          key={link.name}
          style={({ isActive }) => ({
            backgroundColor: isActive ? currentColour : '',
            color: themeMode === 'light' ? (isActive ? 'white' : 'black') : (isActive ? 'black' : 'white'),
            fontSize: isActive ? 'large' : ''
          })}
          onClick={handleClick}
        >
          <span className="text-capitalize ms-2 fw-medium">{link.icon}{link.name}</span>
        </NavLink>
      )}
    </div>
  ))

  const handleLogoClick = () => {
    if (userType == 'admin')
      navigate('/Add User')
    else
      navigate('/My Tasks')
  }

  return (
    <div
      className='subSideBar vh-100  ms-4 pe-3'
    >
      <div className='mt-3' style={{ width: '200px', display: 'inline-block' }}
        onClick={handleLogoClick}
      >
        <img src="./images/websitelogo.png" alt="logo" style={{ width: '100%' }} />
      </div>
      <button className='float-end mt-4 d-md-none ' onClick={() => setActiveMenu(false)}>
        <RxCross2 />
      </button>

      <div className='mt-4'>
        {userType == 'admin' ? getAdminLinks : getLinks}
      </div>
    </div>
  )
}

export default Sidebar