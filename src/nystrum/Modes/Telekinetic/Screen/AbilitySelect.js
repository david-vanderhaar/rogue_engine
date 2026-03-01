import React, {useEffect} from 'react';
import { SOUNDS } from '../sounds'
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { CARTRIDGE } from '../../../Nystrum';
import CharacterSelect from '../../../UI/CharacterCardSelect';
import { SCREENS } from './constants';

function AbilitySelectScreen(props) {
  // useEffect(fadeMusicInOut(SOUNDS.character_select_theme), [])
  const playButtonSound = () => {
    SOUNDS.wood_button.play();
  }

  function nextScreen () {
    const character = props.characters.at(0)
    
    props.setSelectedCharacter(character);
    props.meta({tournament: {player: character, maxRounds: 3}});
    
    playButtonSound()
    props.setActiveScreen(SCREENS.LEVEL)
  }

  // useEffect(fadeMusicInOut(SOUNDS.title_theme), [])
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
        {/* <h1>Your Mind Expands</h1>
        <CharacterSelect 
          characters={props.characters} 
          selectedCharacter={props.selectedCharacter} 
          setSelectedCharacter={props.setSelectedCharacter}
          setActiveScreen={props.setActiveScreen}
        /> */}
        <h2 className="Title__heading" style={{color: CARTRIDGE.theme.accent, zIndex: 100}}>Your Mind Expands</h2>
        <button
          className="btn btn-main btn-themed Title__button"
          onClick={nextScreen}
        >
          Descend
        </button>
        <span className="Title__hint">press enter to continue</span>
      </div>
    </div>
  )
}

export default AbilitySelectScreen;