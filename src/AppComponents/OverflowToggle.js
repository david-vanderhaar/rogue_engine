import React, { useEffect } from 'react';

export default function OverflowToggle() {

  // a temporary helper to see overflow effect
  const overflowMap = {
    [false]: 'hidden',
    [true]: 'visible'
  }

  
  useEffect(() => {
    let overflow = true
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
    <span>toggle overflow: \</span>
  );
}
