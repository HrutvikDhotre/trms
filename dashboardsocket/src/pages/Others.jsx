import React, { useEffect, useState } from 'react'
import { Layout } from '../components'
import { NavLink, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider';




const Others = () => {
  const { themeMode, currentColour ,backgroundEffect} = useStateContext();
  const [hallName, setHallName] = useState('tatahall')


  useEffect(() => {
    document.getElementById('first').click()
  }, [])


  return (
    <Layout>
      <div className='mb-3 px-5 py-3'
        style={{
          marginTop: '60px',
          borderBottom: '1px solid black',
          position: 'relative',
          // display : backgroundEffect ? 'none' : ''
          pointerEvents : backgroundEffect ? 'none' : ''
        }}>
        <div>
          <div className='hallContainer' >
            <NavLink
              id='first'
              to={`/halls/TataHall`}
              className='p-3 text-center'
              style={({ isActive }) => ({
                textDecoration: 'none',
                borderBottom: isActive ? `2px solid ${currentColour}` : '',
                color: themeMode === 'light' ? 'black' : 'white',
                fontWeight: isActive ? 'bolder' : '',
              })}
              onClick={() => {
                setHallName('tatahall')
              }}
            >
              Tata Hall
            </NavLink>
            <NavLink
              to={`/halls/CyrusHall`}
              className='p-3 text-center'
              style={({ isActive }) => ({
                textDecoration: 'none',
                borderBottom: isActive ? `2px solid ${currentColour}` : '',
                color: themeMode === 'light' ? 'black' : 'white',
                fontWeight: isActive ? 'bolder' : ''
              })}
              onClick={() => {
                setHallName('cyrushall')
              }}
            >
              Cyrus Hall
            </NavLink>
          </div>
        </div>
      </div>
      <Outlet context={[hallName]} />
    </Layout>
  )
}

export default Others