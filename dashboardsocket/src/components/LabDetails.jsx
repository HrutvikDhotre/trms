import { React, useEffect, useState } from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import axios from 'axios';
import { io } from 'socket.io-client';
import { RiDeleteBin6Line } from "react-icons/ri"
import DeleteForm from './DeleteForm';

const socket = io('http://localhost:5000')

const LabDetail = ({ labDetails, bookingDetails, setLabDetails }) => {
  const [timeSlotDetails, setTimeSlotDetails] = useState(generateSlots())
  const { currentColour, name, userEmail, setBackgroundEffect, userType } = useStateContext()
  const [toBeShown, setToBeShown] = useState(false)
  const [labId, setLabId] = useState(null)

  useEffect(() => {
    // console.log("near genrateslots")
    setTimeSlotDetails(generateSlots())
  }, [labDetails])


  useEffect(() => { }, [bookingDetails])

  useEffect(() => {
    socket.on('lab-Schedule-Updated', (data) => {
      console.log('inside effect')
      // console.log(data)
      console.log(bookingDetails)
      console.log(data.bookingDetails)
      if (data.bookingDetails.labName == bookingDetails.labName && data.bookingDetails.day == bookingDetails.day)
        setLabDetails(data.details.labDetails)
    })
  }, [bookingDetails])

  useEffect(() => {
    socket.on('lab-slot-deleted', (data) => {
      // console.log('inside effect')
      // console.log(data)
      // console.log(bookingDetails)
      if (data.bookingDetails.labName == bookingDetails.labName && data.bookingDetails.day == bookingDetails.day)
        setLabDetails(data.details.labDetails)
    })
  }, [bookingDetails])

  useEffect(() => {

  }, [timeSlotDetails])

  function generateSlots() {
    // console.log('inside gen slots')
    const timeSlots = []
    let startTime = 6
    let endTime = 20
    let timeSlotDetails = labDetails.length > 0 ? [labDetails[0].timeSlots] : []
    let counter = 0

    for (let time = startTime; time < endTime; time++) {
      if (timeSlotDetails.length != 0 && timeSlotDetails[0].length != 0 && timeSlotDetails[0].length != counter && timeSlotDetails[0][counter].slot == time) {
        timeSlots.push({
          bookedBy: timeSlotDetails[0][counter].bookedBy,
          subject: timeSlotDetails[0][counter].subject,
          email: timeSlotDetails[0][counter].email,
          slotRange: `${time < 10 ? '0' + time : time}:00 - ${time + 1 < 10 ? '0' + (time + 1) : time + 1}:00`,
          isBooked: true,
          slot: time
        })
        counter++
      } else {
        timeSlots.push({
          bookedBy: '',
          subject: '',
          email: '',
          slotRange: `${time < 10 ? '0' + time : time}:00 - ${time + 1 < 10 ? '0' + (time + 1) : time + 1}:00`,
          isBooked: false,
          slot: time
        })
      }
    }
    return timeSlots
  }

  const handleSlotBooking = async (index, slot) => {
    const subject = document.getElementById('subjectField' + index)
    if (!subject.checkValidity()) {
      subject.reportValidity()
    } else {
      try {
        const slotDetails = {
          bookedBy: name,
          subject: subject.value,
          slot: slot
        }
        const data = await axios.put(`http://localhost:5000/labs/update`, {
          name: bookingDetails.labName, day: bookingDetails.day, email: userEmail, timeSlots: slotDetails
        })

        socket.emit('lab-Schedule-Updated', { details: data.data, bookingDetails: bookingDetails })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSlotDeletion = async (slot) => {
    try {
      console.log(slot)
      const data = await axios.delete(`http://localhost:5000/labs/delete/${slot}`, {
        data: {
          labName: bookingDetails.labName,
          day: bookingDetails.day
        }
      })
      console.log(data.data)

      socket.emit('lab-slot-deleted', { details: data.data, bookingDetails: bookingDetails })

    } catch (error) {
      console.log(error)
    }
  }

  const displayData = timeSlotDetails.map((slot, index) => {
    // console.log("slot",slot)
    return (
      <tr key={index}>
        <td className='p-2 text-center'>{index + 1}</td>
        <td className='p-2 text-center'>{slot.slotRange}</td>
        <td className='p-2 text-center'>{slot.bookedBy != '' ? slot.bookedBy : '--'}</td>
        <td className='p-2 text-center'>{slot.subject != '' ? slot.subject :
         userType == 'user' ? <input
            required
            id={`subjectField` + (index + 1)}
            type="text"
            style={{
              border: 'none',
              height: '30px',
              borderBottom: '1px solid gray',
              width: '45%',
              borderRadius: '0'
            }} /> : '--'
        }</td>
        {userType == 'user' ? <td className='p-2 text-center'>{slot.isBooked ? slot.email == userEmail ?
          <button
            // onClick={() => handleSlotDeletion(slot.slot)} 
            onClick={() => {
              // console.log("jaaalkansdg")
              setBackgroundEffect(true)
              setToBeShown(true)
              setLabId(slot.slot)
              // console.log(toBeShown)
            }}
          >
            <RiDeleteBin6Line className='fs-5' style={{ color: 'red' }} />
          </button>
          : '--'
          : <button
            className='px-2 py-0'
            style={{
              backgroundColor: currentColour,
              borderRadius: '5px',
              height: '35px',
              fontSize: '18px',
              color: 'white'
            }}
            onClick={() => handleSlotBooking(index + 1, slot.slot)}
          >
            Book
          </button>

        }</td> : ''}
      </tr >
    )
  })

  return (
    <>
      <div className='px-5 py-3'>
        {/* <div>{bookingDetails.labName}</div> */}
        <table className='dataTable'  >
          <thead className='p-2 m-2'>
            <tr >
              <td className='px-4 py-2 text-center'>No</td>
              <td className='px-4 py-2  text-center'>Slot</td>
              <td className='px-4 py-2 text-center'>Booked By</td>
              <td className='px-4 py-2 text-center'>Subject</td>
              {userType == 'user' ? <td className='px-4 py-2 text-center'>Book</td> : ''}

              {/* <td className='px-4 py-2 text-center'>Delete</td> */}
            </tr>
          </thead>
          <tbody className='p-2 m-2'>{displayData}</tbody>
        </table>
      </div>
      {toBeShown ? <DeleteForm toBeShown={toBeShown} setToBeShown={setToBeShown} labId={labId} deleteLabDetails={true} bookingDetails={bookingDetails}
      /> : ''}
    </>
  )
}

export default LabDetail