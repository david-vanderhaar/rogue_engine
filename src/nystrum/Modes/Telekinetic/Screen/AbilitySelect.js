import React, {useEffect} from 'react';
import { SOUNDS } from '../sounds'
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { CARTRIDGE } from '../../../Nystrum';
import CharacterSelect from '../UI/CharacterCardSelect'
import { SCREENS } from './constants';
import { ENERGY_THRESHOLD } from '../../../constants';
import { COLORS } from '../theme';
import { Say } from '../../../Actions/Say';


// display available upgrades
// on click:
  // add upgrade to meta data
  // move back to level screen
// on level screen, in mode init
  // run through all upgrades in meta data and activate them before first render

function AbilitySelectScreen(props) {
  // useEffect(fadeMusicInOut(SOUNDS.character_select_theme), [])
  const playButtonSound = () => {
    SOUNDS.wood_button.play();
  }

  function nextScreen () {
    playButtonSound()
    props.setActiveScreen(SCREENS.LEVEL)
  }

  function setSelectedAbility (upgrade) {
    const meta = props.meta()
    if (!meta?.upgrades) meta['upgrades'] = []
    meta['upgrades'].push(upgrade)
  }

  const upgrades = {
    buffs: [
      {
        cost: 1,
        name: '+4 Telekinesis Range',
        description: 'Your can reach out 2 tiles further into the world.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active extra 3 t range');
          if (!actor['telekenticTriggerRange']) actor['telekenticTriggerRange'] = 3;
          actor.telekenticTriggerRange += 2
        },
      },
      {
        cost: 1,
        name: '+3 Telekinesis Range',
        description: 'Your can reach out 2 tiles further into the world.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active extra 3 t range');
          if (!actor['telekenticTriggerRange']) actor['telekenticTriggerRange'] = 3;
          actor.telekenticTriggerRange += 2
        },
      },
      {
        cost: 1,
        name: '+2 Telekinesis Range',
        description: 'Your can reach out 2 tiles further into the world.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active extra t range');
          if (!actor['telekenticTriggerRange']) actor['telekenticTriggerRange'] = 3;
          actor.telekenticTriggerRange += 2
        },
      },
      {
        cost: 1,
        name: '+1 Telekinesis Range',
        description: 'Your can reach out 1 tile further into the world.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active extra t range');
          if (!actor['telekenticTriggerRange']) actor['telekenticTriggerRange'] = 2;
          actor.telekenticTriggerRange += 1
        },
      },
      {
        cost: 1,
        name: '+1 Throw Range',
        description: 'Your can throw objects 1 tile further.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active extra t throw range');
          if (!actor['telekineticThrowRange']) actor['telekineticThrowRange'] = 2;
          actor.telekineticThrowRange += 1
        },
      },
      {
        cost: 1,
        name: '+1 Health',
        description: 'Pain is only in the mind. Toughen Up.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active extra helth');
          actor.durabilityMax += 1
          actor.increaseDurability(1)
        },
      },
      {
        cost: 3,
        name: '+1 Actions',
        description: 'My mind is racing! Everything around me is slowing down.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active extra action');
          actor.speed += ENERGY_THRESHOLD;
          actor.energy += ENERGY_THRESHOLD;
        },
      },
      {
        cost: 3,
        name: 'Gain Menacing Stare',
        description: 'I can peirce their mind with a look. Hold still!',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active menacing stare');
          
          const keymapAction = () => new Say({
            label: 'Menacing Stare [1]',
            game: actor.game,
            actor,
            message: 'we out here'
          })

          actor.addKeymapActionToBaseKeymap('c', keymapAction)
        },
      },
    ],
    debuffs: [],
  }
  
  return (
    <div className="Title">
      <div className="Title__content">
        <h2 className="Title__heading" style={{color: CARTRIDGE.theme.accent, zIndex: 100}}>Your Mind Expands</h2>
        <CharacterSelect 
          upgrades={upgrades.buffs} 
          setSelectedAbility={setSelectedAbility}
          setActiveScreen={props.setActiveScreen}
        />
        
        {/* <button
          className="btn btn-main btn-themed Title__button"
          onClick={nextScreen}
        >
          Descend
        </button>
        <span className="Title__hint">press enter to continue</span> */}
      </div>
    </div>
  )
}

export default AbilitySelectScreen;