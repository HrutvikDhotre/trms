import { React, useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import '../styles/resources.css'
import { useNavigate, Outlet, useOutletContext } from 'react-router-dom'

const CyrusHall = () => {

  const [hallName] = useOutletContext()
  const [bookingDate, setBookingDate] = useState(null)
  const [toBeBooked, setToBeBooked] = useState(false)
  const { currentColour, themeMode, isLoggedIn, userType } = useStateContext()
  const navigate = useNavigate()

  const handleDate = async (e) => {
    e.preventDefault()
    setBookingDate(document.getElementById('slotDate').value)
    navigate('/halls/CyrusHall/halldetails')
  }

  return (
    <>
      <div className='px-5 py-3'>
        <div className='searchContainer p-3'
          style={{
            border: '1px solid rgba(0, 0, 0, 0.175)',
            borderRadius: '10px',
            // backgroundColor : 'white'
          }}
        >
          <form
            onSubmit={handleDate}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div className='my-2 mx-3 text-center'>
              <input
                type='date'
                placeholder='dd-mm-yyyy'
                name='bookingDate'
                id='slotDate'
                required
              >
              </input>
            </div>
            <div className='my-2 mx-3 text-center'>
              {userType == 'user' ? <button
                type='submit'
                className='p-2 b1'
                onClick={() => setToBeBooked(true)}
                style={{
                  backgroundColor: currentColour,
                  borderRadius: '5px',
                  height: '45px',
                  fontSize: '18px',
                  color: 'white'
                }}
              >
                Book Slots
              </button> : ''}
            </div>
            <div className='my-2 mx-3 text-center'>
              <button
                type='submit'
                className='p-2'
                onClick={() => setToBeBooked(false)}
                style={{
                  backgroundColor: currentColour,
                  borderRadius: '5px',
                  height: '45px',
                  fontSize: '18px',
                  color: 'white'
                }}
              >
                View Bookings
              </button>
            </div>

          </form>
        </div>
      </div>

      <Outlet context={[bookingDate, setBookingDate, toBeBooked, hallName]} />
    </>
  )
}

export default CyrusHall