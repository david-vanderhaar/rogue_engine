import React, {useEffect} from 'react';
import { SOUNDS } from '../sounds'
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { CARTRIDGE } from '../../../Nystrum';
import CharacterSelect from '../../../UI/CharacterCardSelect';

function CharacterSelectScreen(props) {
  // useEffect(fadeMusicInOut(SOUNDS.character_select_theme), [])
  
  return (
    <div className="Title">
      <div className="Title__content">
        <h1>Choose your Ninja</h1>
        <CharacterSelect 
          characters={props.characters} 
          selectedCharacter={props.selectedCharacter} 
          setSelectedCharacter={props.setSelectedCharacter}
          setActiveScreen={props.setActiveScreen}
        />
      </div>
    </div>
  )
}

export default CharacterSelectScreen;