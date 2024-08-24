import React, { useState, useEffect } from 'react';
import { Layout } from '../components'
import '../styles/fileupload.css'
import { useStateContext } from '../contexts/ContextProvider';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [fileToDeleteIndex, setFileToDeleteIndex] = useState(null);
    const [fileExistsError, setFileExistsError] = useState(false); // State for managing file exists error
    const { currentColour } = useStateContext()

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('http://localhost:5500/files');
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleFileChange = async (e) => {
        const fileList = e.target.files;
        const formData = new FormData();
        let duplicateFile = false;

        console.log("in file change")
        console.log(files)
        for (let i = 0; i < fileList.length; i++) {
            // Check if the filename already exists in the files state
            if (files.find(file => file.filename === fileList[i].name)) {
                duplicateFile = true;
                setFileExistsError(true); // Set file exists error to true
                continue; // Skip uploading the duplicate file
            }

            formData.append('file', fileList[i]);
        }

        if (duplicateFile) {
            // Optionally, you can display a message to the user here
            return;
        }

        try {
            const response = await fetch('http://localhost:5500/upload', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to upload file');
            }
            console.log('File(s) uploaded successfully');
            setFileExistsError(false); // Reset file exists error
            await fetchFiles(); // Refresh the file list after upload
            e.target.value = ''
        } catch (error) {
            console.error('Error uploading file:', error);
            e.target.value = ''
        }
    };

    const handleDeleteFileClick = (index, e) => {
        e.stopPropagation(); // Prevent click event from propagating
        setFileToDeleteIndex(index);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5500/files/${files[fileToDeleteIndex].filename}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete file');
            }
            console.log('File deleted successfully');
            document.getElementById('file-upload').value = ''
            fetchFiles(); // Refresh the file list after deletion
        } catch (error) {
            console.error('Error deleting file:', error);
        }
        setFileToDeleteIndex(null);
    };

    const handleCancelDelete = () => {
        setFileToDeleteIndex(null);
    };

    const handleFileOpen = async (filename) => {
        try {
            const response = await fetch(`http://localhost:5500/files/${filename}`);
            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        } catch (error) {
            console.error('Error opening file:', error);
        }
    };

    const handleFileDownload = async (filename) => {
        try {
            const response = await fetch(`http://localhost:5500/files/${filename}`);
            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Triggering download without opening the file
            const a = document.createElement('a');
            a.href = url;
            a.download = filename; // Set download attribute to force download
            a.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    // Function to clear file exists error when user clicks elsewhere on the page
    const clearFileExistsError = () => {
        setFileExistsError(false);
    };

    return (
        <Layout>
            <div className="file-storage-container" onClick={clearFileExistsError} style={{ marginTop: '80px', backgroundColor: 'white' }}>
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Hide the file input element
                />
                <label htmlFor="file-upload" className="upload-button" style={{
                    backgroundColor: currentColour
                }}>Upload File</label>  <div className='p-0 ms-3 ' style={{ display: 'inline' }}>
                    {/* <RiLockPasswordFill></RiLockPasswordFill> */}
                    <img src="./images/folder.gif" alt=""
                        style={{
                            width: '50px'
                        }}
                    />
                </div>
                {fileExistsError && <p className="error-message" style={{ fontSize: '14px',textAlign : 'start' }}>File already exists.</p>} {/* Display error message */}
                {files.length > 0 && (
                    <div className="file-list">
                        <h2>Uploaded Files:</h2>
                        {files.map((file, index) => (
                            <div key={index} className="file-box" onClick={() => handleFileOpen(file.filename)}>
                                <div className="file-item">
                                    <div className="file-preview" style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <img src='./images/file.gif' alt="file-icon" style={{
                                            width: '70%',
                                            height: '70%'
                                        }} />
                                    </div>
                                    <p className="file-name">{file.filename}</p>
                                </div>
                                <div className="button-group">
                                    <button onClick={() => handleFileDownload(file.filename)} className="download-button">Download</button>
                                    <button onClick={(e) => handleDeleteFileClick(index, e)} className="delete-button">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {fileToDeleteIndex !== null && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>Are you sure you want to delete this file?</p>
                            <div>
                                <button onClick={handleConfirmDelete} className="confirm-button">Yes</button>
                                <button onClick={handleCancelDelete} className="cancel-button">No</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {files.length == 0 ?
                <div className='' style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img src="./images/uploadfiles.jpg" alt=""
                        style={{
                            width: '65%',
                            margin: 'auto'
                        }}
                    />
                </div> : ''
            }
        </Layout>
    );
}

export default FileUpload