import { React, useState } from 'react'
import { Layout, TTViewer } from '../components'

const ViewTimetable = () => {
    const [selectedClass, setSelectedClass] = useState('');

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };
    return (
        <Layout>
            <div className="container" style={{
                marginTop: '60px',
            }}>
                {/* <h2>Time Table Viewer</h2> */}
                <div className="class-dropdown">
                    <select
                        id="classSelect"
                        value={selectedClass}
                        onChange={handleClassChange}
                        style={{
                            width: '30%',
                            height: '45px',
                            borderRadius: '6px',
                            fontSize: '18px',
                            padding: '0 15px',
                            outline: 'none',
                            border: ' 0.1px solid rgb(212, 212, 212)'
                        }}
                        required>
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
                <div className="table-container" style={{ backgroundColor: 'white' }}>
                    {selectedClass && <TTViewer selectedClass={selectedClass} />}
                    {selectedClass.length == 0 &&
                        <div className='table-container' style={{
                            overflow: 'hidden',
                            borderRadius : '10px'
                        }}>
                            <img src="./images/timtable.jpeg" alt="Image" style={{
                                width: '100%',
                                height : '450px',
                                objectFit: 'cover'
                            }} />
                        </div>}
                </div>
            </div>
        </Layout>
    )
}

export default ViewTimetable