import React, { useEffect } from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';

function Lose(props) {
  function nextScreen () {
    props.setActiveScreen(SCREENS.CHARACTER_SELECT)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        nextScreen()
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
        <h2 style={{color: CARTRIDGE.theme.accent, marginBottom: 70}}>Down goes the hero. On goes the war.</h2>
        <button
          className='btn btn-main btn-themed'
          onClick={() => {
            props.setActiveScreen(SCREENS.CHARACTER_SELECT)
          }}
        >
          Hell on the beach.
        </button>
        <br/>
        <span>press enter to start</span>
      </div>
    </div>
  );
}

export default Lose;