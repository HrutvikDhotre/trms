import React, { useEffect, useRef } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import '../styles/success.css';
import { useStateContext } from '../contexts/ContextProvider';

const SuccessPage = () => {
    const location = useLocation();
    const contentRef = useRef(null);

    const { currentColour, themeMode } = useStateContext()


    const {
        validRollNumbersWithNames,
        academicYear,
        subject,
        teacherName,
        date
    } = location.state;

    const handleDownloadAttendance = () => {
        const doc = new jsPDF();
        doc.setFont('Poppins', 'bold');
        doc.text('Attendance Details', 15, 15);
        doc.text(`Academic Year: ${academicYear}`, 15, 25);
        doc.text(`Subject: ${subject}`, 15, 35);
        doc.text(`Teacher Name: ${teacherName}`, 15, 45);
        doc.text(`Date: ${date}`, 15, 55);
        doc.autoTable({
            startY: 65,
            head: [['Roll Number', 'Name']],
            body: validRollNumbersWithNames.map(({ rollNumber, name }) => [rollNumber, name]),
        });
        doc.save('attendance_sheet.pdf');
    };

    return (
        <div className="container" ref={contentRef}>
            <h1 className="header">Attendance Details</h1>
            <table className="details-table">
                <tbody>
                    <tr>
                        <th>Academic Year</th>
                        <td className="details-value">{academicYear}</td>
                    </tr>
                    <tr>
                        <th>Subject</th>
                        <td className="details-value">{subject}</td>
                    </tr>
                    <tr>
                        <th>Teacher Name</th>
                        <td className="details-value">{teacherName}</td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <td className="details-value">{date}</td>
                    </tr>
                    <tr>
                        <th>Roll Number</th>
                        <th>Name</th>
                    </tr>
                    {validRollNumbersWithNames.map(({ rollNumber, name }) => (
                        <tr key={rollNumber}>
                            <td>{rollNumber}</td>
                            <td>{name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                className="download-button p-2"
                onClick={handleDownloadAttendance}
                style={{
                    backgroundColor: currentColour,
                    // width: '100%',
                    borderRadius: '5px',
                    height: '43px',
                    fontSize: '20px',
                    color: 'white'
                }}
            >Download Attendance</button>
        </div>
    );
};

export default SuccessPage;
