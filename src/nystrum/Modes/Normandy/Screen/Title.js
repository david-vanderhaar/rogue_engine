import React, { useEffect } from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';
import HelpContent from '../UI/HelpContent';
import { JACINTO_SOUND_MANAGER } from '../../Jacinto/sounds';

function Title(props) {
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
        <h3 style={{color: CARTRIDGE.theme.text, marginBottom: 6}}>Iron and Sand</h3>
        <p style={{color: CARTRIDGE.theme.text, marginBottom: 30}}>A Beach Landing, 1944</p>
        <div style={{width: '75%'}}>
          <HelpContent />
        </div>
        <button
          className='btn btn-themed'
          onClick={() => {
            // props.setSelectedCharacter(props.characters[0])
            props.setActiveScreen(SCREENS.CHARACTER_SELECT)
          }}
        >
          press enter to start
        </button>
        <span className='text--blinking' style={{color: CARTRIDGE.theme.text}}>sound on for immersion</span>
      </div>
    </div>
  );
}

export default Title;