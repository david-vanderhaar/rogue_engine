import React, { useEffect } from 'react';
import { CARTRIDGE } from '../../../Nystrum';
import { SCREENS } from '../Screen/constants';
import CharacterCardSelect from '../UI/CharacterCardSelect';

function getUnlocks (props) {
  return props.meta()?.unlocks || createMeatData(props)
}

function createMeatData () {
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

export default function CharacterSelectScreen(props) {
  const unlocks = getUnlocks(props)

  useEffect(() => {
    // set the meta data in a global state
    props.meta({...unlocks})
  }, []);

  return (
    <div className="Title">
      <div className="Title__content">
        <h1>God Speed soldier</h1>
        <CharacterCardSelect 
          characters={props.characters.map((character) => ({...character, locked: !unlocks.unlocked.includes(character.name)}))} 
          selectedCharacter={props.selectedCharacter} 
          // setSelectedCharacter={props.setSelectedCharacter}
          setSelectedCharacter={(character => setSelectedCharacter(props, character))}
          setActiveScreen={props.setActiveScreen}
        />
      </div>
    </div>
  );
};
