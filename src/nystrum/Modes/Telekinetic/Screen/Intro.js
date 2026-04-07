import React, { useEffect } from 'react';
import { SOUNDS } from '../sounds'
import { CARTRIDGE } from '../../../Nystrum';
import { fadeOutMusic } from './useEffects/fadeMusicInOut';
import { SCREENS } from './constants';
import HelpContent from '../UI/HelpContent';
import { GLOBAL_EVENT_BUS } from '../../../Events/EventBus';
import SoundManager from '../../../Sounds/SoundManager';

function Intro(props) {
  const playButtonSound = () => {
    SoundManager.getSound('ui_button').play()
  }

  // function incrementEnemiesDestroyed () {
  //   console.log('incrementEnemiesDestroyed');
    
  //   const currentMeta = props.meta()
  //   currentMeta.enemiesDefeated += 1
  //   props.meta({...currentMeta})
  //   console.log(currentMeta);
    
  // }
  // function incrementTurnsTaken () {
  //   const currentMeta = props.meta()
  //   currentMeta.turnsTaken += 1
  //   props.meta({...currentMeta})
  // }

  function nextScreen () {
    const character = props.characters.at(0)

    // GLOBAL_EVENT_BUS.off('OPPONENT:destroy');
    // GLOBAL_EVENT_BUS.off('PLAYER:takeTurn');
    // GLOBAL_EVENT_BUS.on('OPPONENT:destroy', incrementEnemiesDestroyed);
    // GLOBAL_EVENT_BUS.on('PLAYER:takeTurn', incrementTurnsTaken);
    
    props.setSelectedCharacter(character);
    props.meta({
      tournament: {player: character, currentRound: 1},
      turnsTaken: 0,
      enemiesDefeated: 0,
    });
    
    playButtonSound()
    props.setActiveScreen(SCREENS.LEVEL)
  }

  useEffect(fadeOutMusic(SOUNDS.title_theme), [])
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
    <div className="Title" style={{height: 720, width: 1280, position: 'relative', overflow: 'visible'}}>
      <div className="Title__content" style={{height: '100%', width: '100%', position: 'relative', overflow: 'visible', maxHeight: 720, maxWidth: 1280}}>
        <h2 className="Title__heading" style={{color: CARTRIDGE.theme.accent, zIndex: 100}}>Intro!</h2>
        <div style={{margin: '0 50px'}}>
          <HelpContent />
        </div>
        <button
          className="btn btn-main btn-themed Title__button"
          onClick={nextScreen}
        >
          Skip
        </button>
        <span className="Title__hint">press enter to skip</span>
      </div>
    </div>
  );
}

export default Intro;