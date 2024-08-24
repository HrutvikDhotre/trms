import {React,useState,useEffect} from 'react'
import '../styles/ttviewer.css'
const TTViewer = ({selectedClass}) => {
    const [timetableData, setTimetableData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Assuming you have an API endpoint to fetch timetable data
        fetch(`http://localhost:4000/api/timetable/${selectedClass}`)
            .then((response) => response.json())
            .then((data) => setTimetableData(data))
            .catch((error) => {
                console.error('Error fetching timetable:', error);
                setError(error.message);
            });
    }, [selectedClass]);

    const getTimeSlot = (index) => {
        switch (index) {
            case 0:
                return '8:00 AM - 9:00 AM';
            case 1:
                return '9:00 AM - 10:00 AM';
            case 2:
                return '10:30 AM - 11:30 AM';
            case 3:
                return '11:30 AM - 12:30 PM';
            default:
                return '';
        }
    };

    return (
        <div>
            {error && <div className="error-message">Error: {error}</div>}
            {timetableData && timetableData.timetable ? (
                <table>
                    <thead>
                        <tr>
                            <th className='text-center'>Time Slot</th>
                            <th className='text-center'>Monday</th>
                            <th className='text-center'>Tuesday</th>
                            <th className='text-center'>Wednesday</th>
                            <th className='text-center'>Thursday</th>
                            <th className='text-center'>Friday</th>
                            <th className='text-center'>Saturday</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[0, 1, 2, 3].map((timeSlotIndex) => (
                            <tr key={timeSlotIndex}>
                                <td>{getTimeSlot(timeSlotIndex)}</td>
                                {[0, 1, 2, 3, 4, 5].map((dayIndex) => (
                                    <td key={dayIndex}>{timetableData.timetable[dayIndex * 4 + timeSlotIndex]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No timetable found for {selectedClass}.</div>
            )}
        </div>
    )
}

export default TTViewer