import React, { Children, useEffect, useState } from 'react'
import { Sidebar, Navbar } from './'
import { useStateContext } from '../contexts/ContextProvider';
import '../styles/layout.css'


const Layout = ({ children }) => {

    const { activeMenu, setActiveMenu, screenSize, setScreenSize, themeMode, setThemeMode, setCurrentColour,
        backgroundEffect } = useStateContext();

    // const [backgroundEffect, setBackgroundEffect] = useState(false)

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth)
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])



    const inputTags = document.querySelectorAll('input')
    const selectTags = document.querySelectorAll('select')
    // backgroundEffect ?  .style.backgroundColor = 'rgba(0, 0, 0, 0.5)' : 'transparent'

    inputTags.forEach(function (input) {
        backgroundEffect ? input.style.backgroundColor = 'rgba(0, 0, 0, 0)' : 'transparent'
    })
    selectTags.forEach(function (input) {
        backgroundEffect ? input.style.backgroundColor = 'rgba(0, 0, 0, 0)' : 'transparent'
    })

    const bodyStyles = {
        marginLeft: activeMenu && screenSize > 576 ? '20%' : '0',
        flexGrow: '2',
        flexShrink: '2',
        // backgroundColor: 'white',
        backgroundColor:  'white',
        height: '100vh',
        pointerEvents: backgroundEffect ? 'none' : '',
        // filter: backgroundEffect ? 'blur(1px)' : 'none',
        overflow : backgroundEffect ? 'hidden' : '',
        // backgroundImage : 'url("./images/back.jpeg")',
        // backgroundSize: 'cover',
        // backgroundRepeat : 'repeat'
        // backgroundRepeat: 'repeat-y',
    }

    const navStyles = {
        width: activeMenu && screenSize > 576 ? '80%' : '100%',
        flexGrow: '2',
        flexShrink: '2',
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
        // backgroundColor: 'white',
        backgroundColor:  'white',
        // filter: backgroundEffect ? 'blur(1px)' : 'none',
        pointerEvents: backgroundEffect ? 'none' : ''
    }

    const sideBarStyles = {
        // backgroundColor: themeMode === 'light' ? 'white' : 'black',
        color: themeMode === 'light' ? 'black' : 'white',
        boxShadow: '0 7px 30px 0 hsla(210,7%,48%,.11)',
        backgroundColor:  'white',
        // filter: backgroundEffect ? 'blur(1px)' : 'none',
        pointerEvents: backgroundEffect ? 'none' : ''
    }


    return (
        <div className='d-flex position-relative' style={{
            // backgroundColor : backgroundEffect ? 'rgba(0, 0, 0, 0.5)' : '' 
        }}>
            {activeMenu &&
                <div className='sidebar' style={sideBarStyles}>
                    <Sidebar />
                </div>
            }

            <div style={bodyStyles} className='sideBody '>
                <div
                    className='navBar'
                    style={navStyles}
                >
                    <Navbar />
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>

    )
}

export default Layout