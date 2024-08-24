import React, { useState, useEffect } from 'react';
import '../styles/groupdetailsform.css';
import generateGroupListPDF from './GroupListPdf'; // Corrected import statement
import { useStateContext } from '../contexts/ContextProvider'


const GroupDetailsForm = ({ maxRolls,minRolls }) => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [rollNumbers, setRollNumbers] = useState(Array.from({ length: maxRolls }, () => ''));
  const [errorMessage, setErrorMessage] = useState('');

  const {currentColour} = useStateContext()
  

  const handleSubmitGroup = () => {
    // Check if the group name is empty
    if (!groupName.trim()) {
      setErrorMessage("Group Name is required.");
      return;
    }
  
    // Check if the number of filled roll number fields among the first minRolls fields meets the minimum requirement
    const filledFirstRollNumbersCount = rollNumbers.slice(0, minRolls).filter(num => num.trim() !== '').length;
    if (filledFirstRollNumbersCount < minRolls) {
      setErrorMessage(`Please fill out the first ${minRolls} roll number fields.`);
      return;
    }
  
    // Create a new group object and add it to the groups array
    const newGroup = { groupName, rollNumbers: rollNumbers.filter(num => num.trim() !== '') };
    setGroups([...groups, newGroup]);
  
    // Clear form fields
    setGroupName('');
    setRollNumbers(Array.from({ length: maxRolls }, () => ''));
    setErrorMessage('');
  };
  

  const handleDeleteGroup = (index) => {
    const updatedGroups = [...groups];
    updatedGroups.splice(index, 1);
    setGroups(updatedGroups);
  };

  const handleRollNumberChange = (index, value) => {
    const numericValue = value.replace(/\D/g, '');
    const updatedRollNumbers = [...rollNumbers];
    updatedRollNumbers[index] = numericValue;
    setRollNumbers(updatedRollNumbers);
  };
  const generatePDF = async () => {
    try {
      // Prepare data to be sent to the backend
      const dataToSend = groups.map(group => ({
        groupName: group.groupName,
        rollNumbers: group.rollNumbers
      }));
      
      // Send the data to the backend
      const response = await fetch('http://localhost:3000/api/getAllStudentNames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ groups: dataToSend })
      });
      
      const data = await response.json();
      const { groupData } = data;
      console.log(groupData)
      // Call the PDF generator function with the group data
      generateGroupListPDF(groupData);
    } catch (error) {
      console.error('Error fetching student names:', error.message);
    }
  };
  useEffect(() => {
    // Function to clear error message when clicking outside the form
    const handleClickOutside = (e) => {
      if (!e.target.closest('.form-container')) {
        setErrorMessage('');
      }
    };

    // Function to clear error message when typing
    const handleKeyPress = () => {
      setErrorMessage('');
    };

    // Add event listeners
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keypress', handleKeyPress);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);
  
  

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className='ms-4 mb-2'>Create Groups</h2>
        <div className="form-group">
          <input type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        </div>
        {Array.from({ length: maxRolls }).map((_, index) => (
          <div key={index} className="form-group">
            <input
              type="text"
              placeholder={`Roll Number ${index + 1}`}
              value={rollNumbers[index]}
              onChange={(e) => handleRollNumberChange(index, e.target.value)}
              className='my-2'
            />
          </div>
        ))}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="button" onClick={handleSubmitGroup} className='grpdet-btn'
         style={{
            backgroundColor: currentColour,
            borderRadius: '5px',
            height: '45px',
            fontSize: '18px',
            color: 'white',
            padding : '10px 20px'
        }}>Add Group</button>
        {groups.length > 0 && (
          <div className="added-groups">
            <h3>Added Groups:</h3>
            <div className="groups-table">
              <table>
                <thead>
                  <tr>
                    <th>Group Name</th>
                    <th>Roll Numbers</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group, index) => (
                    <tr key={index}>
                      <td>{group.groupName}</td>
                      <td>{group.rollNumbers.join(', ')}</td>
                      <td>
                        <button type="button" className="delete-button" onClick={() => handleDeleteGroup(index)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {groups.length > 0 && (
          <button type="button" name="submit-form-button" onClick={generatePDF} className='grpdet-btn'
          style={{
            backgroundColor: currentColour,
            borderRadius: '5px',
            height: '45px',
            // fontSize: '18px',
            // color: 'white',
            // margin : '0 auto'
          }}>Generate List</button>
        )}
      </div>
    </div>
  );
};

export default GroupDetailsForm;
