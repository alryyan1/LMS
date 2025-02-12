import React, { useState, useRef } from 'react';

function GeminiImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setDescription('Please select an image.');
      return;
    }

    setIsLoading(true); // Start loading
    setDescription(''); // Clear previous description

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result.split(',')[1]; // Extract base64 part

      const payload = {
        contents: [
          {
            parts: [
              { text: "بنائا علي القائمه الدخل المرفقه في الصوره اشرحها لي وبين نشاط مربح ام خسران" },
              {
                inlineData: {
                  mimeType: selectedImage.type, // Use the file's actual mime type
                  data: base64Image,
                },
              },
            ],
          },
        ],
      };


      const API_KEY = "AIzaSyCW19EOEQWlS1nDGtNv0z847mdUvhCtxC0";  // Replace with your actual API key
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Correct Content-Type
          },
          body: JSON.stringify(payload) //stringify
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
          const text = data.candidates[0].content.parts[0].text;
          setDescription(text);
        } else {
          setDescription("Could not extract text from the response.");
        }

      } catch (error) {
        setDescription("Error: " + error);
      } finally {
        setIsLoading(false); // Stop loading, regardless of success/failure
      }
    };

    reader.onerror = (error) => {
      setDescription("Error reading file: " + error);
      setIsLoading(false);
    };

    reader.readAsDataURL(selectedImage); // Read as Data URL (Base64)
  };

  const handleChooseImage = () => {
    fileInputRef.current.click(); // Programmatically trigger the file input
  };

  return (
    <div>
      <h1>Gemini Image Uploader</h1>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <button onClick={handleChooseImage}>Choose Image</button> {/* Styled button */}
      {selectedImage && (
        <div>
          <img
            src={URL.createObjectURL(selectedImage)} // Display selected image
            alt="Selected"
            style={{ maxWidth: '200px', marginTop: '10px' }}
          />
        </div>
      )}
      <button onClick={handleUpload} disabled={isLoading}> {/* Disable button while loading */}
        {isLoading ? 'Uploading...' : 'Upload and Describe'}
      </button>
      {description && (
        <div style={{ marginTop: '20px' }}>
          <h2>Description:</h2>
          <h4>{description}</h4>
        </div>
      )}
    </div>
  );
}

export default GeminiImageUploader;