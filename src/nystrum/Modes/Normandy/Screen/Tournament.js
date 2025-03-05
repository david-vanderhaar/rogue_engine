import React, { useEffect } from 'react';
import { SCREENS } from '../../../Modes/HiddenLeaf/Screen/constants';

export default function Tournament(props) {
  function gotToLevel () {
    props.setActiveScreen(SCREENS.LEVEL)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        gotToLevel()
      }
    };
    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);
    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="Title">
      <div className="Title__content">
        <h1>A moment of rest...</h1>
        <button
          className='btn btn-main btn-themed'
          onClick={gotToLevel}
        >
          Onward!
        </button>
        <br/>
        <span>press enter to start</span>
      </div>
    </div>
  );
}
