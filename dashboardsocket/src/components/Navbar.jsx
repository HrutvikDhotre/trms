import React, { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
// import { TbRectangleFilled } from "react-icons/fa6";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { TbRectangleFilled } from "react-icons/tb";
import { useStateContext } from '../contexts/ContextProvider';



const Navbar = () => {
  const { setActiveMenu, themeMode, setMode, currentColour, setColour, name } = useStateContext()
  const [themeBlock, setThemeBlock] = useState(false)

  return (
    <div className='my-3 mx-4'>
      <button>
        <GiHamburgerMenu
          className='fs-4'
          style={{ color: currentColour }}
          onClick={() => setActiveMenu((prev) => !prev)}
        />
      </button>


      <button
        className='float-end mx-2'
        onClick={() => { setThemeBlock((prev) => !prev) }}
      >
        <TbRectangleFilled
          className='fs-3'
          style={{
            color: currentColour
          }}
        />
        <MdOutlineArrowDropDown style={{
          color: themeMode === 'light' ? 'black' : 'white',
          fontSize: themeMode === 'light' ? '1rem' : '1.2rem'
        }} />
      </button>

      <div
        className='float-end  flex-column justify-content-center align-items-center py-2'
        style={{
          position: 'absolute',
          top: '2.7rem',
          right: '2rem',
          width: '3rem',
          border: '.5px solid gray',
          backgroundColor: 'white',
          borderRadius: '0.2rem',
          display: themeBlock ? 'flex' : 'none'
        }}
      >
        <TbRectangleFilled
          className='fs-4'
          style={{
            color: '#72CC50'
          }}
          onClick={() => setColour('#72CC50')}
        />
        <TbRectangleFilled
          className='fs-4'
          style={{
            color: '#03C9D7'
          }}
          onClick={() => setColour('#03C9D7')}
        />
        <TbRectangleFilled
          className='fs-4'
          style={{
            color: '#1E4DB7'
          }}
          onClick={() => setColour('#1E4DB7')}
        />
        <TbRectangleFilled
          className='fs-4'
          style={{
            color: '#FB9678'
          }}
          onClick={() => setColour('#FB9678')}
        />
      </div>

      {/* <button
        className={themeMode == 'light' ? 'float-end' : 'd-none'}
        onClick={() => setMode('dark')}
      >
        <FaMoon className='fs-5' />
      </button>
      <button
        className={themeMode == 'dark' ? 'float-end' : 'd-none'}
        onClick={() => setMode('light')}
      >
        <FaSun className='fs-4' style={{color : 'white'}} />
      </button> */}

      <span className='float-end mx-3 mt-1 fw-bold'>{`Hello, ${name}`}
      </span>
    </div>
  )
}

export default Navbar