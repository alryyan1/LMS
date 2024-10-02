import React, { useState, useRef, useEffect } from 'react';

// Sample suggestions
const suggestionsList = [
  'console.log',
  'alert',
  'document.getElementById',
  'fetch',
  'Array.prototype.map',
  'Object.keys',
  'Promise.all',
];

const TextAreaWithIntelliSense = () => {
  const [input, setInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  const textareaRef = useRef(null);
  const suggestionBoxRef = useRef(null);

  const handleChange = (event) => {
    const value = event.target.value;
    setInput(value);

    // Get current cursor position
    const cursor = event.target.selectionStart;

    // Extract the current word being typed
    const currentWord = value.slice(0, cursor).split(' ').pop();

    // Show suggestions if the current word is not empty
    if (currentWord) {
      const filtered = suggestionsList.filter((suggestion) =>
        suggestion.startsWith(currentWord)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
      
      // Get the cursor position for suggestions
      const { clientHeight, clientWidth } = textareaRef.current;
      const cursorRect = textareaRef.current.getBoundingClientRect();
      const textareaScrollTop = textareaRef.current.scrollTop;

      // Set suggestion box position
      setCursorPosition({
        top: cursorRect.top + textareaRef.current.selectionStart * 1.5 + textareaScrollTop,
        left: cursorRect.left + (textareaRef.current.value.length + 1) * 7, // Approximate character width
      });
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const words = input.split(' ');
    words.pop(); // Remove the current word
    words.push(suggestion); // Add the selected suggestion
    setInput(words.join(' ') + ' '); // Update the input value
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    textareaRef.current.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows="10"
        cols="50"
        placeholder="Type your code here..."
        style={{ fontSize: '16px', padding: '10px', width: '100%' }}
      />
      {showSuggestions && (
        <ul
          ref={suggestionBoxRef}
          style={{
            position: 'absolute',
            top: cursorPosition.top + 'px',
            left: cursorPosition.left + 'px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            zIndex: 1,
            margin: 0,
            padding: '5px',
            listStyleType: 'none',
            maxHeight: '150px',
            overflowY: 'auto',
            width: 'fit-content',
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '5px',
                cursor: 'pointer',
                backgroundColor: '#fff',
                borderBottom: '1px solid #eee',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#fff')}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextAreaWithIntelliSense;
