import React, { useState } from 'react';
import axiosClient from '../../../axios-client';

const FileUpload = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select an image first!');
            return;
        }

        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axiosClient.post('images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data); // Log the response from the backend
            onUpload(response.data.filename); // Pass the filename back to the parent component
            setSelectedFile(null);
            setPreviewImage(null);


        } catch (error) {
            console.error('Error uploading image:', error);
            setUploadError('Failed to upload image.  Please try again.');

            if (error.response) {
                console.log(error.response.data); // Log backend errors
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewImage && (
                <img src={previewImage} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            )}
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
        </div>
    );
};

export default FileUpload;