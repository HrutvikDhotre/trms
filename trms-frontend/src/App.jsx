import React, { useEffect, useState } from 'react'
import { BrowserRouter, Router, Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar, Navbar, CyrusHall, TataHall, HallDetails, Success, AttendanceDetails, DeleteForm } from './components'
import { Login, Page1, Labs, Others, ChangePassword, ProtectedRoutes, Attendance, ViewAttendance, ViewTimetable, Admin, AddUser, AddTimetable, ToDoList, DeleteUser, FileUpload ,ListGenerator} from './pages';
import { useStateContext } from './contexts/ContextProvider';
import './App.css'

function App() {
  const { activeMenu, setActiveMenu, screenSize, setScreenSize, themeMode, setThemeMode, setCurrentColour } = useStateContext();


  const [validRollNumbersWithNames, setValidRollNumbersWithNames] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherName, setTeacherName] = useState('');

  // const [showDeleteForm, setShowDeleteForm] = useState(false)
  // const [idForDeletion,setIdForDeletion] = useState(null)


  useEffect(() => {
    const currentMode = localStorage.getItem('themeMode')
    const currColour = localStorage.getItem('colourMode')
    if (currentMode && currColour) {
      setThemeMode(currentMode)
      setCurrentColour(currColour)
    }
  }, [])


  return (
    <>
      <div className='bodyWrapper'>
        <BrowserRouter>
          <Routes>
            <Route index element={(<Login />)} />

            <Route element={(<ProtectedRoutes />)}>
              <Route path='/home' element={(<Page1 />)} />
              <Route path='/labs' element={(<Labs />)} />


              <Route path='/halls' element={(<Others />)} >
                <Route path='TataHall' element={(<TataHall />)} >
                  <Route path='halldetails' element={(<HallDetails />)} />
                </Route>

                <Route path='CyrusHall' element={(<CyrusHall />)} >
                  <Route path='halldetails' element={(<HallDetails />)} />
                </Route>
              </Route >

              <Route path='/Mark Attendance' element={(<Attendance
                setValidRollNumbersWithNames={setValidRollNumbersWithNames}
                setAcademicYear={setAcademicYear}
                setDate={setDate}
                setSubject={setSubject}
                setTeacherName={setTeacherName}
              />)}>

                <Route path='Success' element={(<Success
                  validRollNumbersWithNames={validRollNumbersWithNames}
                  academicYear={academicYear}
                  date={date}
                  subject={subject}
                  teacherName={teacherName}
                />)} />

              </Route >

              <Route path='/View Attendance' element={(<ViewAttendance />)}>
                <Route path='AttendanceDetailsPage' element={(<AttendanceDetails />)} />
              </Route >


              <Route path='/page4' element='page4' />
              <Route path='/Change Password' element={(<ChangePassword />)} />
              <Route path='/View Timetable' element={(<ViewTimetable />)} />
              <Route path='/My Tasks' element={(<ToDoList />)} />
              <Route path='/Upload Files' element={(<FileUpload />)} />
              <Route path='/List Generator' element={(<ListGenerator/>)} />


              {/* Admin */}
              <Route path='/Add User' element={(<AddUser />)} />
              <Route path='/Add Timetable' element={(<AddTimetable />)} />
              <Route path='/Delete User' element={(<DeleteUser />)} />



            </Route>
          </Routes>
        </BrowserRouter>

      </div>
      {/* <DeleteForm showDeleteForm={showDeleteForm} setShowDeleteForm={setShowDeleteForm} idForDeletion = {idForDeletion} /> */}
    </>
  )
}

export default App
