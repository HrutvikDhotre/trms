import React, { useState, useRef, useEffect } from 'react';
import '../styles/grouplistForm.css';
import { GroupDetailsForm } from '../components';
import { useStateContext } from '../contexts/ContextProvider';


const GroupListForm = ({ onSubmit }) => {
    const [minRolls, setMinRolls] = useState('');
    const [maxRolls, setMaxRolls] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const formRef = useRef(null);
    const {currentColour} = useStateContext()

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!minRolls || !maxRolls) {
            setErrorMessage('Please fill out all fields.');
            return;
        }
        if (parseInt(maxRolls) < parseInt(minRolls)) {
            setErrorMessage('Maximum number of roll numbers should be greater than or equal to the minimum number.');
            return;
        }
        setShowDetailsForm(true);
    };

    const handleClickOutside = (e) => {
        if (formRef.current && !formRef.current.contains(e.target)) {
            setErrorMessage('');
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
        <div className="form-container" ref={formRef} 
        style={{
            // position : 'fixed',
            // top : '50%',
            // left : '50%',
            // transform : 'translate(-50%,-50%)',
            // width : '50%'
        }}>
            {showDetailsForm ? (
                <GroupDetailsForm onSubmit={onSubmit} minRolls={parseInt(minRolls)} maxRolls={parseInt(maxRolls)} />
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-box">
                        <h2 className='ms-4 mb-3'>Roll Number Limits</h2>
                        <div className="form-group my-4">
                            <input type="number" value={minRolls} onChange={(e) => setMinRolls(e.target.value)} placeholder="Minimum Number of Roll Numbers" min={1}/>
                        </div>
                        <div className="form-group my-4">
                            <input type="number" value={maxRolls} onChange={(e) => setMaxRolls(e.target.value)} placeholder="Maximum Number of Roll Numbers" min={1}/>
                        </div>
                        {errorMessage && <div className="error-message"> {errorMessage}</div>}
                        <button type="submit" className='grplist-btn mx-auto'
                        style={{
                            backgroundColor: currentColour,
                            borderRadius: '5px',
                            height: '45px',
                            fontSize: '18px',
                            color: 'white',
                            padding : '10px 20px'
                        }}>Next</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default GroupListForm;
