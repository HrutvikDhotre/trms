import { React, useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri"
import { useOutletContext } from 'react-router-dom'
import axios from 'axios'
import { useStateContext } from '../../contexts/ContextProvider';
import { nanoid } from 'nanoid'
import '../../styles/login.css'
import { io } from 'socket.io-client';
import DeleteForm from '../DeleteForm'

const socket = io('http://localhost:5000')


const HallDetails = () => {

  const [bookingDate, setBookingDate, toBeBooked, hallName] = useOutletContext()
  const { userEmail, currentColour, themeMode, name,backgroundEffect,setBackgroundEffect } = useStateContext()
  const [bookingDetails, setBookingDetails] = useState({ startTime: '', endTime: '', purpose: '' })
  const [timeSlotDetails, setTimeSlotDetails] = useState([])
  const [existsTimeSlotAccomNError, setExistsTimeSlotAccomNError] = useState(false)
  const [existsInvalidTimeRange, setExistsInvalidTimeRange] = useState(false)
  const [existsStartTimeError, setExistsStartTimeError] = useState(false)
  const [existsEndTimeError, setExistsEndTimeError] = useState(false)

  const [toBeShown, setToBeShown] = useState(false)
  const [idForDeletion, setIdForDeletion] = useState(null)



  useEffect(() => {
    async function getDetails() {
      let details = await axios.get(`http://localhost:5000/resources/${hallName}/${bookingDate}`)
      // console.log(details)
      if (!details.data.noDataAvailable)
        setTimeSlotDetails(details.data)
      else
        setTimeSlotDetails([])
    }
    getDetails()
    setBookingDetails({ startTime: '', endTime: '', purpose: '' })
  }, [bookingDate])

  useEffect(() => {
  }, [timeSlotDetails])

  useEffect(() => {
    socket.on('slot-details-sent', (data) => {
      // console.log(data.data)
      if (data.data.hallName == hallName)
        setTimeSlotDetails(data.data.details)
    })
  }, [])

  useEffect(() => {
    socket.on('slot-updated-deletion', (data) => {
      // console.log(data.data)
      if (data.data.hallName == hallName)
        setTimeSlotDetails(data.data.details)
    })
  }, [])

  const handleInputFocus = (e) => {
    e.target.style.borderBottom = `2px solid ${currentColour}`
  }

  const handleInputBlur = (e) => {
    e.target.style.borderBottom = `none`
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!existsEndTimeError && !existsStartTimeError && !existsTimeSlotAccomNError) {
        let data = await axios.post(`http://localhost:5000/resources/${hallName}`, { ...bookingDetails, bookingDate, name, userEmail })

        socket.emit('slot-added', data)
        // setTimeSlotDetails(data.data)
        // document.getElementsByTagName('input').value = ''
        setBookingDetails({ startTime: '', endTime: '', purpose: '' })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleValidTimeSlot = () => {
    if (document.getElementById('endTime').value && document.getElementById('startTime').value) {
      let isError = false
      const startInput = document.getElementById('startTime').value
      const inputStartTime = `${bookingDate}T${startInput}:00.000Z`
      const inputStartTimeDate = new Date(inputStartTime)

      const endInput = document.getElementById('endTime').value
      const inputEndTime = `${bookingDate}T${endInput}:00.000Z`
      const inputEndTimeDate = new Date(inputEndTime)

      timeSlotDetails.forEach((slot) => {
        const startTime = new Date(slot.startTime)
        const endTime = new Date(slot.endTime)
        if (inputStartTimeDate < startTime && endTime < inputEndTimeDate) {
          setExistsTimeSlotAccomNError(true)
          isError = true
        }
      })

      if (!isError && (inputEndTimeDate <= inputStartTimeDate)) {
        setExistsInvalidTimeRange(true)
        isError = true
      } else {
        setExistsInvalidTimeRange(false)
      }

      if (!isError) {
        setExistsTimeSlotAccomNError(false)
        setExistsInvalidTimeRange(false)
      }
    }
  }

  const handleValidStartTime = (e) => {
    const startDateTimeStr = `${bookingDate}T${e.target.value}:00.000Z`;
    const startDateTimeUTC = new Date(startDateTimeStr);
    let isError = false

    setBookingDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })

    timeSlotDetails.forEach((slot) => {
      const startTime = new Date(slot.startTime)
      const endTime = new Date(slot.endTime)
      if (startTime <= startDateTimeUTC && startDateTimeUTC <= endTime) {
        // document.getElementById('startSlotError').style.display = 'block'
        setExistsStartTimeError(true)
        isError = true
        return
      }
    })

    if (!isError) {
      setExistsStartTimeError(false)
      // document.getElementById('startSlotError').style.display = 'none'
      handleValidTimeSlot()
    }
  }

  const handleValidEndTime = (e) => {
    const endDateTimeStr = `${bookingDate}T${e.target.value}:00.000Z`;
    const endDateTimeUTC = new Date(endDateTimeStr);
    let isError = false

    setBookingDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })

    timeSlotDetails.forEach((slot) => {
      const startTime = new Date(slot.startTime)
      const endTime = new Date(slot.endTime)
      if (startTime <= endDateTimeUTC && endDateTimeUTC <= endTime) {
        // document.getElementById('endSlotError').style.display = 'block'
        setExistsEndTimeError(true)
        isError = true
        return
      }
    })

    if (!isError) {
      setExistsEndTimeError(false)
      handleValidTimeSlot()
    }

  }

  // const deleteSlot = async (id) => {
  //   try {
  //     const data = await axios.delete(`http://localhost:5000/resources/${hallName}/${id}`, { data: { bookingDate } })
  //     console.log(data.data)
  //     if (!data.data.noDataAvailable) {
  //       socket.emit('slot-deleted', data)
  //       // setTimeSlotDetails(data.data)
  //     }
  //     else
  //       setTimeSlotDetails([])
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  const sortedTimeSlotDetails = timeSlotDetails.slice().sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  const displayData = sortedTimeSlotDetails.map((slot, index) => {
    const startTime = new Date(slot.startTime)
    const formattedStartTime = startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

    const endTime = new Date(slot.endTime)
    const formattedEndTime = endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    let bool = slot.email === userEmail

    return (
      <tr key={nanoid()}>
        <td className='p-2 text-center'>{index + 1}</td>
        <td className='p-2 text-center'>{formattedStartTime}</td>
        <td className='p-2 text-center'>{formattedEndTime}</td>
        <td className='p-2 text-center'>{slot.bookedBy}</td>
        <td className='p-2 text-center'>{slot.purpose}</td>
        <td className='p-2 text-center'>{bool ?
          <button onClick={() => {
            setToBeShown(true)
            setBackgroundEffect(true)
            setIdForDeletion(slot._id)
          }}>
            <RiDeleteBin6Line className='fs-5' style={{ color: '#dc3545' }} />
          </button> : '--'}</td>
      </tr >
    )
  })

  return (
    <>
      <div className='mt-2'>
        <div className='px-5 py-2'>
          {toBeBooked &&
            <form
              className='timeSlotForm mb-4'
              onSubmit={handleSubmit}
              style={{}}
            >
              <div className="formBlock" >
                <label htmlFor="startTime" className='fw-bold' >Start Time</label>
                <input
                  type='time'
                  name='startTime'
                  value={bookingDetails.startTime}
                  id='startTime'
                  onChange={handleValidStartTime}
                  min='05:00:00'
                  max='21:00:00'
                  required
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={{ borderRadius: '0' }}
                ></input>
                {existsStartTimeError && <p className='error' id='startSlotError'>Time Slot Occupied!</p>}</div>
              <div className="formBlock" >
                <label htmlFor="endTime" className='fw-bold' >End Time</label>
                <input
                  type='time'
                  name='endTime'
                  value={bookingDetails.endTime}
                  id='endTime'
                  onChange={handleValidEndTime}
                  min='05:00:00'
                  max='22:00:00'
                  required
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  style={{ borderRadius: '0' }}
                ></input>
                {existsEndTimeError && <p className='error' id='endSlotError'>Time Slot Occupied!</p>}</div>
              <div className="formBlock" >
                <label htmlFor="purpose" className='fw-bold' >Purpose</label>
                <input
                  type='text'
                  maxLength={10}
                  required
                  name='purpose'
                  value={bookingDetails.purpose}
                  placeholder='Maximum 10 letters'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onChange={(e) => setBookingDetails((prev) => {
                    return {
                      ...prev,
                      [e.target.name]: e.target.value
                    }
                  })}
                  style={{ borderRadius: '0' }}
                ></input>
                {existsTimeSlotAccomNError && <p className='error' id='accErr'>Time Slot Occupied!</p>}
                {existsInvalidTimeRange && <p className='error' id='validTimeRangeError'>Please Enter A Valid Time Range!</p>}
              </div>
              <div className="formBlock" style={{
                flexBasis: '70%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}>
                <button
                  className='p-2  mx-auto text-center'
                  style={{
                    backgroundColor: currentColour,
                    borderRadius: '5px',
                    height: '45px',
                    fontSize: '18px',
                    color: 'white',
                  }}
                >Book</button>
              </div>
            </form>
          }


          {
            timeSlotDetails.length == 0 ?
              <div className=''
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflowX: 'scroll'
                }}>
                <div className='fw-bold mt-5'>No bookings on {bookingDate}!</div>
              </div>
              :
              <div
                style={{
                  width: '100%'

                }}
              >
                <table className='dataTable'>
                  <thead className='p-2 m-2'>
                    <tr>
                      <td className='px-4 py-2 text-center'>No</td>
                      <td className='px-4 py-2  text-center'>From</td>
                      <td className='px-4 py-2 text-center'>To</td>
                      <td className='px-4 py-2 text-center'>Booked By</td>
                      <td className='px-4 py-2 text-center'>Purpose</td>
                      <td className='px-4 py-2 text-center'>Delete</td>
                    </tr>
                  </thead>
                  <tbody className='p-2 m-2'>{displayData}</tbody>
                </table>
              </div>
          }
        </div>
        {/* </div > */}
        {/* <DeleteForm toBeShown={toBeShown} setToBeShown={setToBeShown} /> */}
      </div >
      {toBeShown ? <DeleteForm hallName={hallName} toBeShown={toBeShown} setToBeShown={setToBeShown} idForDeletion={idForDeletion} setTimeSlotDetails={setTimeSlotDetails}
        bookingDate={bookingDate}  /> : ''}
    </>
  )
}

export default HallDetails