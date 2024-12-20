import React, { useEffect } from 'react';
import './App.css';
import Nystrum from './nystrum/Nystrum';

function App() {

  // a temporary helper to see overflow effect
  const overflowMap = {
    [false]: 'hidden',
    [true]: 'visible'
  }

  let overflow = true

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Backslash') {
        overflow = !overflow
        document.documentElement.style.setProperty('--overflow', overflowMap[overflow])
      }
    };
    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);
    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  // end

  return (
    <div className="App">
      <Nystrum />
    </div>
  );
}

export default App;
