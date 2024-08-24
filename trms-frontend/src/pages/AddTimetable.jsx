import { React, useState } from 'react'
import { Layout } from '../components'
import '../styles/addtimetable.css'
import { useStateContext } from '../contexts/ContextProvider';

const TimetableCell = ({ value, onChange, isError, errorMessage, onInput }) => (
    <td>
        <input
            type="text"
            value={value}
            onChange={onChange}
            className={isError ? 'error' : ''}
            onInput={onInput}
            required
            style={{
                width : '100%',
                padding : '8px',
                boxSizing : 'border-box'
            }}
        />
        {isError && <div className="error-message" style={{fontSize : '12px'}}>{errorMessage}</div>}
    </td>
)

const AddTimetable = () => {
    const { currentColour } = useStateContext()

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = ['8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:30 AM - 11:30 AM', '11:30 AM - 12:30 PM'];

    const [timetableData, setTimetableData] = useState(Array.from({ length: 6 }, () => Array(4).fill('')));
    const [selectedClass, setSelectedClass] = useState('');
    const [inputErrors, setInputErrors] = useState(Array.from({ length: 6 }, () => Array(4).fill(false)));
    const [globalError, setGlobalError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubjectChange = (day, slot, event) => {
        const newValue = event.target.value;

        // Validate at least one letter or space
        if (/^[a-zA-Z0-9\s\-]*$/.test(newValue)) {
            setInputErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors[day][slot] = false;
                return newErrors;
            });

            setTimetableData((prevData) => {
                const newData = [...prevData];
                newData[day][slot] = newValue;
                return newData;
            });
        } else {
            setInputErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors[day][slot] = true;
                return newErrors;
            });
        }

        // Clear global error and success message when the user starts typing
        setGlobalError('');
        setSuccessMessage('');
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
        // Clear global error and success message when the user starts typing
        setGlobalError('');
        setSuccessMessage('');
    };

    const handleSave = async () => {
        try {
            // Validate required fields
            if (!selectedClass || timetableData.flat().every((value) => value.trim() === '')) {
                setGlobalError('Please ensure that all fields are filled.');
                return;
            }

            // Make a POST request to the backend API
            const response = await fetch('http://localhost:4000/api/timetable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedClass,
                    timetableData: timetableData.flat(),
                }),
            });

            if (response.ok) {
                setSuccessMessage(`Timetable for class ${selectedClass} saved successfully!`);
                // Optionally, reset the form or perform other actions after a successful save
                setSelectedClass('');
                setTimetableData(Array.from({ length: 6 }, () => Array(4).fill('')));
            } else {
                const responseData = await response.json();

                if (response.status === 400 && responseData.error === 'Timetable already exists for this class.') {
                    setGlobalError('Timetable already exists for this class.');
                } else {
                    console.error('Error saving timetable:', response.statusText);
                    setGlobalError('Error saving timetable. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error saving timetable:', error.message);
            setGlobalError('Error saving timetable. Please try again.');
        }
    };

    return (
        <Layout>
            <div className=" mx-1 px-3" style={{ marginTop: '100px' }}>
                {/* <h2>Time Table Generator</h2> */}
                {globalError && <div className="global-error">{globalError}</div>}
                <div className="class-dropdown">
                    <select
                        id="classSelect"
                        value={selectedClass}
                        onChange={handleClassChange}
                        required
                        style={{
                            width: '20%',
                            height: '45px',
                            borderRadius: '6px',
                            fontSize: '18px',
                            padding: '0 15px',
                            outline: 'none',
                            border: ' 0.1px solid rgb(212, 212, 212)'
                        }}
                    >
                        <option value="" disabled>Select Class</option>
                        <option value="FY-BCA">FY-BCA</option>
                        <option value="SY-BCA">SY-BCA</option>
                        <option value="TY-BCA">TY-BCA</option>
                    </select>
                    <div className='p-0 mt-2 ms-3' style={{ display : 'inline' }}>
                        {/* <RiLockPasswordFill></RiLockPasswordFill> */}
                        <img src="./images/upcoming.gif" alt=""
                        style={{
                            width : '60px'
                        }}
                        />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            {daysOfWeek.map((day) => (
                                <th key={day} className='text-center'>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((timeSlot, slotIndex) => (
                            <tr key={timeSlot}>
                                <td className=''>{timeSlot}</td>
                                {daysOfWeek.map((day, dayIndex) => (
                                    <TimetableCell
                                        key={`${day}-${slotIndex}`}
                                        value={timetableData[dayIndex][slotIndex]}
                                        onChange={(e) => handleSubjectChange(dayIndex, slotIndex, e)}
                                        isError={inputErrors[dayIndex][slotIndex]}
                                        errorMessage="Only letters, digits, hyphen and spaces are allowed."
                                        onInput={() => setGlobalError('')}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    className="mt-4 p-2"
                    onClick={handleSave}
                    style={{
                        backgroundColor: currentColour,
                        borderRadius: '5px',
                        height: '45px',
                        fontSize: '18px',
                        color: 'white'
                    }}
                >
                    Save Timetable
                </button>
                {successMessage && (
                    <div className="success-message" onClick={() => setSuccessMessage('')}>
                        {successMessage}
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default AddTimetable