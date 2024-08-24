import React, { useState, createContext, useContext } from 'react'

const StateContext = createContext();

const ContextProvider = ({ children }) => {

    const [activeMenu, setActiveMenu] = useState(true)

    const [screenSize, setScreenSize] = useState(undefined)

    const [themeMode, setThemeMode] = useState('light')

    const [currentColour, setCurrentColour] = useState('blue')

    const [userEmail, setUserEmail] = useState('')

    const [name, setName] = useState('')

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [backgroundEffect,setBackgroundEffect] = useState(false)

    const [userType , setUserType] = useState(null)


    const setMode = (e) => {
        setThemeMode(e);
        localStorage.setItem('themeMode', e);
        // console.log("local   " + localStorage.getItem('themeMode'))
    };

    const setColour = (color) => {
        setCurrentColour(color);
        localStorage.setItem('colourMode', color)
    }

    return (
        <StateContext.Provider
            value={
                {
                    activeMenu,
                    setActiveMenu,
                    screenSize,
                    setScreenSize,
                    themeMode,
                    setThemeMode,
                    setMode,
                    currentColour,
                    setCurrentColour,
                    setColour,
                    userEmail, 
                    setUserEmail,
                    isLoggedIn,
                    setIsLoggedIn,
                    name,
                    setName,
                    backgroundEffect,
                    setBackgroundEffect,
                    userType,
                    setUserType
                }
            }
        >
            {children}
        </StateContext.Provider>
    )
}

export default ContextProvider

export const useStateContext = () => useContext(StateContext)