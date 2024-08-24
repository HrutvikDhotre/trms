import { React, useState, useEffect } from 'react'
import { Layout } from '../components'
import { useStateContext } from '../contexts/ContextProvider';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import '../styles/resources.css'
import { labData } from '../data/labdata'
import { LabDetail } from '../components';

const Labs = () => {

  const { currentColour, themeMode, name, backgroundEffect } = useStateContext()
  const [formData, setFormData] = useState({ labName: '', day: '' })
  const [showLabDetail, setShowLabDetail] = useState(false)
  const [labDetails, setLabDetails] = useState([])


  const mapOptions = labData.map((data) => (
    data.disabled && data.disabled === true ?
      <option key={data.name} value={data.value} disabled>{data.name}</option> :
      <option key={data.name} value={data.value}>{data.name}</option>
  ))

  // useEffect(()=>{},[formData])

  const handleChange = (e) => {
    console.log("changing")
    setFormData(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      const data = await axios.get(`http://localhost:5000/labs/get/${formData.labName}/${formData.day}`)
      // console.log(data.data.labDetails)
      setLabDetails(data.data.labDetails)
      setShowLabDetail(true)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <>
        <div
          className='px-5 py-3'
          style={{
            marginTop: '60px',
            pointerEvents: backgroundEffect ? 'none' : '',
            // overflow : backgroundEffect ? 'hidden' : ''
          }}
        >
          <div className='searchContainer p-3'
            style={{
              border: '1px solid rgba(0, 0, 0, 0.175)',
              borderRadius: '10px',
              // backgroundColor : 'white'
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div className='my-2 mx-3 text-center'>
                <select
                  required
                  name="labName"
                  style={{
                    width: '100%',
                    height: '45px',
                    borderRadius: '6px',
                    fontSize: '18px',
                    padding: '0 15px',
                    outline: 'none',
                    border: ' 0.1px solid rgb(212, 212, 212)'
                  }}
                  onChange={handleChange}
                  value={formData.labName}
                >
                  {/* <option value="" selected disabled>Choose Lab</option> */}
                  {mapOptions}
                </select>
              </div>
              <div className='my-2 mx-3 text-center'>
                <select
                  required
                  name="day"
                  style={{
                    width: '100%',
                    height: '45px',
                    borderRadius: '6px',
                    fontSize: '18px',
                    padding: '0 15px',
                    outline: 'none',
                    border: ' 0.1px solid rgb(212, 212, 212)'
                  }}
                  onChange={handleChange}
                  value={formData.day}
                >
                  <option value="" disabled >Choose Day</option>
                  <option value="Monday" >Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>

                </select>
              </div>
              <div className='my-2 mx-3 text-center'>
                <button
                  type='submit'
                  className='p-2 b1'
                  style={{
                    backgroundColor: currentColour,
                    borderRadius: '5px',
                    height: '45px',
                    fontSize: '18px',
                    color: 'white'
                  }}
                >
                  View Slots
                </button>
              </div>
            </form>
          </div>
        </div>

        {showLabDetail ? <LabDetail labDetails={labDetails} bookingDetails={formData} setLabDetails={setLabDetails} /> 
        : 
        <div className='my-auto mx-auto' style={{
          width : '90%',
          display : 'flex',
          justifyContent : 'center',
          alignItems : 'center',
          // border : '1px solid black'
        }}>
          <img src="./images/lab1.jpg" alt="" 
            style={{
              width : '65%',
              margin : 'auto'
            }}
          />
        </div>
        }
      </>
    </Layout>
  )
}

export default Labs