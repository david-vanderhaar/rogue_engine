import React, {useEffect} from 'react';
import { SOUNDS } from '../sounds'
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { CARTRIDGE } from '../../../Nystrum';
import CharacterSelect from '../UI/CharacterCardSelect'
import { SCREENS } from './constants';
import { ENERGY_THRESHOLD } from '../../../constants';
import { COLORS } from '../theme';
import { Say } from '../../../Actions/Say';
import { getNumberOfItemsInArray } from '../../../../helper';
import { PrepareRangedAction } from '../../../Actions/PrepareRangedAction';
import { MindResource } from '../../../Actions/ActionResources/MindResource';
import ShadowHold from '../../../StatusEffects/ShadowHold';
import { AddStatusEffectAtPosition } from '../../../Actions/AddStatusEffectAtPosition';
import gradientPathEmitter from '../../../Engine/Particle/Emitters/gradientPathEmitter';
import Stunned from '../../../StatusEffects/Stunned';


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
    meta['upgrades'].push({...upgrade})
  }

  const upgrades = {
    buffs: [
      {
        cost: 1,
        name: '+1 Telekinesis Range',
        description: 'Your can activate a throw 1 tile further.',
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
        name: '+1 Throw Distance',
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
        name: 'Gain Menacing Stare',
        description: 'I can peirce their mind with a look. Hold still!',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active menacing stare');
          const keymapAction = () => new PrepareRangedAction({
            label: 'Menacing Stare [1]',
            game: actor.game,
            actor,
            range: 10,
            passThroughEnergyCost: ENERGY_THRESHOLD,
            passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 1 })],
            keymapTriggerString: 'c',
            // cursorShape: Constant.CLONE_PATTERNS.smallSquare,
            actionClass: AddStatusEffectAtPosition,
            actionParams: {
              effect: new ShadowHold({ game: actor.game, turnsStunned: 2, backgroundColor: COLORS.blue_light }),
              label: 'Paralyzed [2]',
              onSuccess: () => {
                gradientPathEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  targetPositions: actor.getCursorPositions(),
                  animationTimeStep: 0.8,
                  // animationTimeStep: 0.1,
                  // transfersBackground: true,
                  backgroundColorGradient: [COLORS.blue_light, COLORS.black],
                  character: '',
                }).start()
              }
            }
          })

          actor.addKeymapActionToBaseKeymap('c', keymapAction)
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
    ],
    potential_buffs: [
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
    ],
    debuffs: [],
  }
  
  return (
    <div className="Title">
      <div className="Title__content">
        <h2 className="Title__heading" style={{color: CARTRIDGE.theme.accent, zIndex: 100}}>Your Mind Expands</h2>
        <CharacterSelect 
          // upgrades={getNumberOfItemsInArray(3, upgrades.buffs)} 
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