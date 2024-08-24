import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import axios from 'axios'
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000')





const DeleteForm = ({ hallName, toBeShown, setToBeShown, idForDeletion, setTimeSlotDetails, bookingDate, labId,
    deleteLabDetails, bookingDetails }) => {


    const { currentColour, themeMode, setBackgroundEffect, backgroundEffect, screenSize } = useStateContext()



    const deleteSlot = async (id) => {
        try {
            const data = await axios.delete(`http://localhost:5000/resources/${hallName}/${id}`, { data: { bookingDate } })
            console.log(data.data)
            if (!data.data.noDataAvailable) {
                socket.emit('slot-deleted', data)
                setToBeShown(false)
                setBackgroundEffect(false)
                // setTimeSlotDetails(data.data)
            }
            else {
                setTimeSlotDetails([])
                setToBeShown(false)
                setBackgroundEffect(false)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleSlotDeletion = async (slot) => {
        try {
            // console.log(slot)
            const data = await axios.delete(`http://localhost:5000/labs/delete/${slot}`, {
                data: {
                    labName: bookingDetails.labName,
                    day: bookingDetails.day
                }
            })
            console.log(data.data)
            socket.emit('lab-slot-deleted', { details: data.data, bookingDetails: bookingDetails })
            setBackgroundEffect(false)
            setToBeShown(false)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div style={{
            position : 'fixed',
            backgroundColor : 'rgba(0, 0, 0, 0.7)',
            zIndex : '101',
            width : '100%',
            height : '100%',
            top : '0',
            left : '0',
            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center'
        }}>
            <div
                className='deleteForm p-3'
                style={{
                    // position: 'absolute',
                    // // zIndex: '10',
                    // display: toBeShown ? 'block' : 'none',
                    // top: '50%',
                    // left: '50%',
                    // transform: 'translate(-50%,-50%)',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    width: screenSize > 576 ? '500px' : '300px',
                    // border: '.1px solid black',
                    pointerEvents: 'auto',
                    // // filter:  'none' 
                }}>
                <div className='my-2' style={{ width: '100%' }}>Are you sure you want to delete this slot ? </div>
                <div className='my-4' style={{ width: '' }}>
                    <button className='p-2  mx-2' style={{
                        backgroundColor: '#dc3545',
                        borderRadius: '5px',
                        height: '45px',
                        fontSize: '18px',
                        color: 'white',
                        float: 'right'
                    }}

                        onClick={() => {
                            if (deleteLabDetails && deleteLabDetails == true)
                                handleSlotDeletion(labId)
                            else
                                deleteSlot(idForDeletion)
                        }
                        }
                    >Delete</button>
                    <button
                        className='p-2  mx-2' style={{
                            backgroundColor: currentColour,
                            borderRadius: '5px',
                            height: '45px',
                            fontSize: '18px',
                            color: 'white',
                            float: 'right'
                        }}
                        onClick={() => {
                            setToBeShown(false)
                            setBackgroundEffect(false)
                        }}
                    >Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteForm