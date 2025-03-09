import React, { useEffect } from 'react';
import { SCREENS } from '../../../Modes/HiddenLeaf/Screen/constants';
import { CARTRIDGE } from '../../../Nystrum';

export default function Tournament(props) {
  function nextScreen () {
    props.setActiveScreen(SCREENS.LEVEL)
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
        <h3 style={{color: CARTRIDGE.theme.text, marginBottom: 6}}>a moment of rest...</h3>
        <p style={{color: CARTRIDGE.theme.text, marginBottom: 30}}>gather your courage.</p>
        <div
          style={{
            height: '400px',
            backgroundImage: `url("${window.PUBLIC_URL}/normandy/war_poster_0.png")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '50%',
            marginBottom: 36,
            backgroundPositionY: 'top',
          }}
        />
        <button
          className='btn btn-themed'
          onClick={() => {
            nextScreen()
          }}
        >
          press enter to continue
        </button>
        <span className='text--blinking' style={{color: CARTRIDGE.theme.text}}>sound on for immersion</span>
      </div>
    </div>
  );
}
