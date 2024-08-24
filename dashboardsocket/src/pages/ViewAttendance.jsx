import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Layout } from '../components'
import '../styles/login.css';
import { useStateContext } from '../contexts/ContextProvider';
// import '../styles/login.css';
import '../styles/resources.css'




const PreviousAttendanceForm = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [fetchedRollNumbers, setFetchedRollNumbers] = useState([]); // New state for roll numbers
  const navigate = useNavigate();
  const { currentColour, themeMode, activeMenu } = useStateContext()



  function handleFocus(e) {
    e.target.style.border = `1.5px solid ${currentColour}`
    e.target.style.outline = `1.5px solid ${currentColour}`
    const label = e.target.parentNode.querySelector('label');
    if (label) {
      label.style.color = currentColour;
    }
  }

  function handleBlur(e) {
    e.target.style.border = ``
    e.target.style.outline = `none`
    const label = e.target.parentNode.querySelector('label');
    if (label) {
      label.style.color = '';
    }
  }

  const validateTeacherName = (input) => {
    return /^[A-Za-z ]+$/.test(input);
  };

  const handleTeacherNameChange = (e) => {
    const inputValue = e.target.value;
    if (validateTeacherName(inputValue) || inputValue === '') {
      setTeacherName(inputValue);
    }
  };

  // Inside handleSubmit function in PreviousAttendanceForm component
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/findAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          academicYear,
          subject,
          teacherName,
          date,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Form submission successful:', data);

        if (data.success) {
          if (data.rollNumbers.length > 0) {
            // Store roll numbers in state
            setFetchedRollNumbers(data.rollNumbers);

            // Redirect to a new page with data
            navigate('/View Attendance/AttendanceDetailsPage', { state: { fetchedRollNumbers: data.rollNumbers } });
          } else {
            setError('Data not found. Please check your inputs');
          }
        } else {
          setError('An error occurred. Please try again.');
        }
      } else if (response.status === 404) {
        const errorData = await response.json();
        setError(`Error: ${errorData.message}`);
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setError('An error occurred. Please try again.');
    }
  };
  const handleFormChange = () => {
    setError('');
  };




  const subjects = ['Python', 'Linux', 'Cyber Security', 'E-Commerce'];

  const AcademicYearSelect = ({ academicYear, setAcademicYear }) => (
    <div className="form-group inputContainer">
      <select
        id="academicYear"
        value={academicYear}
        onChange={(e) => setAcademicYear(e.target.value)}
        placeholder="Select Academic Year"
        required
        className="academic-year-dropdown"
        style={{
          width: '100%',
          height: '45px',
          padding: '8px',
          borderRadius: '6px',
          fontSize: '18px',
          // padding: '0 15px',
          outline: 'none',
          border: '0.1px solid rgb(212, 212, 212)'
        }}
      >
        <option value="" disabled>
          Select Academic Year
        </option>
        <option value="TY-BCA-2024">TY-BCA-2024</option>
      </select>
    </div>
  );

  const SubjectSelect = ({ subject, setSubject }) => (
    <div className="form-group  inputContainer">
      <select
        id="subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
        className="remaining-fields"
        style={{
          width: '100%',
          height: '45px',
          padding: '8px',
          borderRadius: '6px',
          fontSize: '18px',
          // padding: '0 15px',
          outline: 'none',
          border: '0.1px solid rgb(212, 212, 212)'
        }}
      >
        <option value="" disabled>
          Select Subject
        </option>
        {subjects.map((subj) => (
          <option key={subj} value={subj}>
            {subj}
          </option>
        ))}
      </select>
    </div>
  );

  const TeacherNameInput = ({ teacherName, handleTeacherNameChange }) => (
    <div className="form-group  inputContainer">
      <input
        type="text"
        id="teacherName"
        value={teacherName}
        onChange={handleTeacherNameChange}
        // placeholder=" Enter Teacher Name"
        required
        className="remaining-fields"
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{width :'100%'}}
      />
      <label>Teacher's Name</label>
    </div>
  );

  const DateInput = ({ date, setDate }) => {
    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="form-group  inputContainer">
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
          required
          className="remaining-fields"

        />
      </div>
    );
  };

  const ErrorDisplay = ({ error }) => (
    <>
      {error && <div className="error-message mt-2" style={{ color: 'red', fontSize: '13px' }}>{error}</div>}
    </>
  );

  const SubmitButton = () => (
    <div className="form-group center mt-4">
      <button type="submit" style={{
        backgroundColor: currentColour,
        width: '100%',
        borderRadius: '5px',
        height: '43px',
        fontSize: '20px',
        color: 'white'
      }}>Submit</button>
    </div>
  );



  return (

    <Layout>
      <div className="center-box position-relative" style={{
        marginTop: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh'
      }}>
        <div className="formContainer pb-4" style={{
          position: 'absolute',
          boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
          width: activeMenu ? '35%' : ''
        }}>
             <div className='p-0 mt-2' style={{}}>
                        {/* <RiLockPasswordFill></RiLockPasswordFill> */}
                        <img src="./images/classroom.gif" alt=""
                            style={{
                                width: '100px'
                            }}
                        />
                    </div>
          {/* <h1>Previous Attendance Form</h1> */}
          <form onSubmit={handleSubmit} onChange={handleFormChange} className=''>


                <AcademicYearSelect academicYear={academicYear} setAcademicYear={setAcademicYear} />
             
                <SubjectSelect subject={subject} setSubject={setSubject} />
      
                <TeacherNameInput teacherName={teacherName} handleTeacherNameChange={handleTeacherNameChange} />
            
                <DateInput date={date} setDate={setDate} />
             

            <ErrorDisplay error={error} />
            <SubmitButton />
          </form>
        </div>
      </div>

      <Outlet />
    </Layout>
  );
};

export default PreviousAttendanceForm;
