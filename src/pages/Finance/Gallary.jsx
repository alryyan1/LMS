import React, { useState, useEffect } from 'react';
import axiosClient from '../../../axios-client';
import FileUpload from './FileUpload';
import ImageSlider from './ImageSlider';

function Gallary() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await axiosClient.get('images');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const handleImageUpload = (newFilename) => {
        // After successful upload, add the new image to the state
        setImages(prevImages => [...prevImages, { filename: newFilename }]);
    };

    return (
        <div className="Gallary">
            <h1>Image Slider with Upload</h1>
            <FileUpload onUpload={handleImageUpload} />
            <ImageSlider images={images} />
        </div>
    );
}

export default Gallary;