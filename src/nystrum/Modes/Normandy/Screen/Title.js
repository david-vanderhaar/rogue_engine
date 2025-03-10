import React, { useEffect } from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../../../Screen/constants';
import HelpContent from '../UI/HelpContent';

function getUnlocks (props) {
  return props.meta()?.unlocks || createMetaData(props)
}

function createMetaData () {
  return {
    score: 0,
    level: 0,
    unlocked: ['TheRifleman'],
    // possible values: 'The Rifleman', 'The Medic', 'The Engineer', 'The Machine Gunner'
  }
}

function setSelectedCharacter (props, character) {
  props.setSelectedCharacter(character)
  const meta = props.meta()
  props.meta({
    ...meta,
    player: character,
  })
}

function Title(props) {
  const unlocks = getUnlocks(props)
  
  function nextScreen () {
    setSelectedCharacter(props, props.characters[0])
    props.setActiveScreen(SCREENS.LEVEL)
    // props.setActiveScreen(SCREENS.CHARACTER_SELECT)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        nextScreen()
      }
    };
    // Add event listener when the component mounts
    window.addEventListener('keydown', handleKeyPress);
    props.meta({...unlocks})
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
            nextScreen()
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