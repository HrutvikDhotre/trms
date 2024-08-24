import React from 'react';
import { useLocation } from 'react-router-dom';

const AttendanceDetailsPage = () => {
  const { state } = useLocation();
  const fetchedRollNumbers = state?.fetchedRollNumbers || [];

  // Use fetchedRollNumbers in your component

   const fetchAttendance = fetchedRollNumbers.map((row,index)=>{
    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{row}</td>
      </tr>
    )
   })

  return (
    <div className='container'>
      <h2>Attendance Details Page</h2>
      {/* <ul>
        {fetchedRollNumbers.map((rollNumber) => (
          <li key={rollNumber}>{rollNumber}</li>
        ))}
      </ul> */}
      <table>
        <thead>
          <tr>
            <td>Sr No.</td>
            <td>Roll No</td>
          </tr>
        </thead>
        <tbody>
        {fetchAttendance}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDetailsPage;
