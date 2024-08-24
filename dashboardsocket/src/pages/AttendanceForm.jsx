import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
// import '../styles/attendance.css';
import '../styles/login.css';

import { Layout } from '../components'
import { useStateContext } from '../contexts/ContextProvider';

// const ViewRecordsButton = () => {
//     const navigate = useNavigate();
//     const handleViewRecords = () => {
//         // Navigate to the "PreviousAttendanceForm" page
//         navigate('/PreviousAttendanceForm'); // Update with your actual route
//     };
//     return (
//         <div className="form-group center">
//             <button type="button" onClick={handleViewRecords}>
//                 View Records
//             </button>
//         </div>
//     );
// };




const RollNumbersTextarea = ({ rollNumbers, handleRollNumbersChange, handleBlur, handleFocus }) => (
    <div className="inputContainer">
        <textarea
            type="text"
            id="rollNumbers"
            value={rollNumbers}
            onChange={handleRollNumbersChange}
            // placeholder="Enter roll numbers separated by spaces"
            required
            className="remaining-fields"
            style={{
                width: '100%',
                borderRadius: '6px',
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
        />
        <label htmlFor="" className='textLabel'>Roll Nos With Spaces</label>
    </div>
);


const AttendanceForm = ({ setValidRollNumbersWithNames }) => {
    const [academicYear, setAcademicYear] = useState('');
    const [rollNumbers, setRollNumbers] = useState('');
    const [subject, setSubject] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const subjects = ['Python', 'Linux', 'Cyber Security', 'E-Commerce'];

    const { currentColour, themeMode, activeMenu } = useStateContext()


    const validateTeacherName = (input) => {
        return /^[A-Za-z ]+$/.test(input);
    };

    const handleTeacherNameChange = (e) => {
        const inputValue = e.target.value;
        if (validateTeacherName(inputValue) || inputValue === '') {
            setTeacherName(inputValue);
        }
    };

    const handleRollNumbersChange = (e) => {
        const inputValue = e.target.value;
        const key = e.key;
        if (key === ' ' && inputValue.endsWith(' ')) {
            e.preventDefault();
            return;
        }
        const formattedValue = inputValue.replace(/\s+/g, ' ');
        setRollNumbers(formattedValue);


    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const rollNumbersArray = rollNumbers
                .split(/\s+/)
                .filter(Boolean)
                .map((rollNumber) => parseInt(rollNumber, 10))
                .filter((value, index, self) => self.indexOf(value) === index);

            rollNumbersArray.sort((a, b) => a - b);
            const response = await fetch('http://localhost:3000/submitRollNumbers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    academicYear,
                    rollNumbers: rollNumbersArray,
                    subject,
                    teacherName,
                    date,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Server response:', data);
                setValidRollNumbersWithNames(data.validRollNumbersWithNames);
                // setShowForm(false)
                setError('')
                navigate('Success', {
                    state: {
                        validRollNumbersWithNames: data.validRollNumbersWithNames,
                        academicYear,
                        date,

                        subject,
                        teacherName,
                    },
                });
            } else if (response.status === 400) {
                // Attendance already marked error
                const data = await response.json();
                setError(data.error);
            } else {
                setError('Failed to submit attendance. Please try again.');
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            setError('An error occurred. Please try again.');
        }
    };


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


    const AcademicYearSelect = ({ academicYear, setAcademicYear }) => (
        <div className="inputContainer">
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
        <div className="form-group inputContainer">
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
        <div className="form-group inputContainer">
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
            <label htmlFor=''>Teacher's Name</label>

        </div>
    );

    const DateInput = ({ date, setDate }) => {
        const today = new Date().toISOString().split('T')[0];
        return (
            <div className="form-group inputContainer">
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
        <div className="form-group center inputContainer">
            <button type="submit"
                style={{
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
            {<div className="center-box position-relative" style={{
                marginTop: '60px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh'
            }}>
                <div className="formContainer pb-4"
                    style={{
                        position: 'absolute',
                        boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                        width: activeMenu ? '35%' : ''
                    }}>
                    {/* <h1>Attendance Management System</h1> */}
                    <form onSubmit={handleSubmit}>
                        <AcademicYearSelect academicYear={academicYear} setAcademicYear={setAcademicYear} />
                        <RollNumbersTextarea rollNumbers={rollNumbers} handleRollNumbersChange={handleRollNumbersChange} handleFocus={handleFocus} handleBlur={handleBlur} />
                        <SubjectSelect subject={subject} setSubject={setSubject} />
                        <TeacherNameInput teacherName={teacherName} handleTeacherNameChange={handleTeacherNameChange} />
                        <DateInput date={date} setDate={setDate} />
                        <ErrorDisplay error={error} />
                        <SubmitButton />
                    </form>
                    {/* <ViewRecordsButton /> */}
                </div>
            </div>
            }
            <Outlet context={[]} />
        </Layout >
    );
};

export default AttendanceForm;
