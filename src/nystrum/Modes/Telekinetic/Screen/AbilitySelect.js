import React, {useEffect} from 'react';
import * as lodash from 'lodash'
import { SOUNDS } from '../sounds'
import { fadeMusicInOut } from './useEffects/fadeMusicInOut';
import { CARTRIDGE } from '../../../Nystrum';
import CharacterSelect from '../UI/CharacterCardSelect'
import { SCREENS } from './constants';
import * as Constant from '../../../constants';
import { COLORS } from '../theme';
import { Say } from '../../../Actions/Say';
import * as Helper from '../../../../helper'
import { PrepareRangedAction } from '../../../Actions/PrepareRangedAction';
import { MindResource } from '../../../Actions/ActionResources/MindResource';
import ShadowHold from '../../../StatusEffects/ShadowHold';
import { AddStatusEffectAtPosition } from '../../../Actions/AddStatusEffectAtPosition';
import gradientPathEmitter from '../../../Engine/Particle/Emitters/gradientPathEmitter';
import Stunned from '../../../StatusEffects/Stunned';
import { MultiTargetAttackAndShove } from '../../../Actions/MultiTargetAttackAndShove';
import gradientRadialEmitter from '../../../Engine/Particle/Emitters/gradientRadialEmitter';


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

  function getActiveUpgrades () {
    const meta = props.meta()
    if (!meta?.upgrades) return []
    return meta.upgrades
  }

  function getActiveUpgradesNames() {
    return getActiveUpgrades().map((i) => i.name)
  }

  function getActiveUpgradesCountByName(name) {
    return getActiveUpgradesNames().filter((active) => active === name).length
  }

  const upgrades = {
    buffs: [
      {
        cost: 1,
        stacksUpTo: 2,
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
        stacksUpTo: 4,
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
        stacksUpTo: 10,
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
        cost: 1,
        name: 'Gain Mind Blast [1]',
        stacksUpTo: 1,
        description: 'Foes are pushed back 1 space in all cardinal directions from your position.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => {
            return new MultiTargetAttackAndShove({
              label: 'Mind Blast [1]',
              targetPositions: Helper.getPositionsFromStructure(Constant.CLONE_PATTERNS.clover, actor.getPosition()),
              game: actor.game,
              actor,
              energyCost: (Constant.ENERGY_THRESHOLD * 1),
              requiredResources: [new MindResource({ getResourceCost: () => 2 })],
              onSuccess: () => {
                gradientRadialEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  radius: 1,
                  colorGradient: [COLORS.light, COLORS.blue_light],
                  backgroundColorGradient: [COLORS.blue_light, COLORS.blue_light],
                }).start()
              }
            })
          }

          actor.addKeymapActionToBaseKeymap('1', keymapAction)
        },
      },
      {
        cost: 1,
        name: 'Gain Mind Blast [2]',
        stacksUpTo: 1,
        preRequirements: ['Gain Mind Blast [1]'],
        description: 'Foes are pushed back 2 space in all cardinal directions from your position.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => {
            return new MultiTargetAttackAndShove({
              label: 'Mind Blast [2]',
              targetPositions: Helper.getPositionsFromStructure(Constant.CLONE_PATTERNS.clover_2, actor.getPosition()),
              game: actor.game,
              actor,
              energyCost: (Constant.ENERGY_THRESHOLD * 1),
              requiredResources: [new MindResource({ getResourceCost: () => 3 })],
              onSuccess: () => {
                gradientRadialEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  radius: 1,
                  colorGradient: [COLORS.light, COLORS.blue_light],
                  backgroundColorGradient: [COLORS.blue_light, COLORS.blue_light],
                }).start()
              }
            })
          }

          actor.addKeymapActionToBaseKeymap('1', keymapAction)
        },
      },
      {
        cost: 1,
        name: 'Gain Mind Blast [3]',
        stacksUpTo: 1,
        preRequirements: ['Gain Mind Blast [2]'],
        description: 'Foes are pushed back 1 space in all directions from your position.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => {
            return new MultiTargetAttackAndShove({
              label: 'Mind Blast [3]',
              targetPositions: Helper.getPositionsFromStructure(Constant.CLONE_PATTERNS.circle_3, actor.getPosition()),
              game: actor.game,
              actor,
              energyCost: (Constant.ENERGY_THRESHOLD * 1),
              requiredResources: [new MindResource({ getResourceCost: () => 4 })],
              onSuccess: () => {
                gradientRadialEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  radius: 1,
                  colorGradient: [COLORS.light, COLORS.blue_light],
                  backgroundColorGradient: [COLORS.blue_light, COLORS.blue_light],
                }).start()
              }
            })
          }

          actor.addKeymapActionToBaseKeymap('1', keymapAction)
        },
      },
      {
        cost: 1,
        name: 'Gain Menacing Stare',
        stacksUpTo: 1,
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
            passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
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

          actor.addKeymapActionToBaseKeymap('2', keymapAction)
        },
      },
    ],
    potential_buffs: [
      {
        cost: 1,
        name: '+1 Actions',
        stacksUpTo: 1,
        description: 'My mind is racing! Everything around me is slowing down.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          console.log('active extra action');
          actor.speed += Constant.ENERGY_THRESHOLD;
          actor.energy += Constant.ENERGY_THRESHOLD;
        },
      },
    ],
    debuffs: [],
  }

  function availableUpgrades () {
    const available = upgrades.buffs.filter((upgrade) => {
      // check for stacking
      const activeCount = getActiveUpgradesCountByName(upgrade.name)
      if (activeCount >= upgrade.stacksUpTo) return false
      // check for prereqs
      if (upgrade?.preRequirements?.length) {
        const preReqSet = new Set(upgrade.preRequirements)
        const playerSet = new Set(getActiveUpgradesNames())
        return preReqSet.isSubsetOf(playerSet)
      }
      
      return true
    })

    return available
    // return Helper.getNumberOfItemsInArray(3, available)
  }
  
  return (
    <div className="Title">
      <div className="Title__content">
        <h2 className="Title__heading" style={{color: CARTRIDGE.theme.accent, zIndex: 100}}>Your Mind Expands</h2>
        <CharacterSelect 
          upgrades={availableUpgrades()} 
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