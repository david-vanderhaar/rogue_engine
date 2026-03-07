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
import { AddStatusEffectAtPositions } from '../../../Actions/AddStatusEffectAtPositions';
import { HealthDrain } from '../StatusEffects/HealthDrain';
import { AddStatusEffect } from '../../../Actions/AddStatusEffect';
import { SpeedDefenseDamageBuff } from '../StatusEffects/SpeedDefenseDamageBuff';
import { MoveOrShove } from '../../../Actions/MoveOrShove';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';


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
      // Stacking Buffs
      // // Tele Range
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
      // // Tele Throw Distance
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
      // // +1 Health
      {
        cost: 1,
        name: '+1 Health',
        alwaysAvailable: true,
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
      // // +1 Mind
      {
        cost: 1,
        name: '+1 Mind',
        stacksUpTo: 10,
        alwaysAvailable: true,
        description: 'You mind expands, allowing more powerful manouvers.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          actor.chargeMax += 1
          actor.increaseCharge(1)
        },
      },
      // Mind Blast 1
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
      // Menacing Stare 2
      {
        cost: 1,
        name: 'Gain Menacing Stare [1]',
        stacksUpTo: 1,
        description: 'Freezes an enemy with fear for 1 turn.',
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
            keymapTriggerString: '1',
            // cursorShape: Constant.CLONE_PATTERNS.smallSquare,
            actionClass: AddStatusEffectAtPosition,
            actionParams: {
              effect: new ShadowHold({ game: actor.game, turnsStunned: 2, backgroundColor: COLORS.blue_light }),
              label: 'Paralyzed [1]',
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
      {
        cost: 1,
        name: 'Gain Menacing Stare [2]',
        stacksUpTo: 1,
        preRequirements: ['Gain Menacing Stare [1]'],
        description: 'Freezes an enemy with fear for 2 turns.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new PrepareRangedAction({
            label: 'Menacing Stare [2]',
            game: actor.game,
            actor,
            range: 10,
            passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
            passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 1 })],
            keymapTriggerString: '2',
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
      {
        cost: 1,
        name: 'Gain Menacing Stare [3]',
        stacksUpTo: 1,
        preRequirements: ['Gain Menacing Stare [2]'],
        description: 'Freezes multiple enemies with fear for 3 turns.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new PrepareRangedAction({
            label: 'Menacing Stare [3]',
            game: actor.game,
            actor,
            range: 10,
            passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
            passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 1 })],
            keymapTriggerString: '2',
            actionClass: AddStatusEffectAtPositions,
            cursorShape: Constant.CLONE_PATTERNS.circle_2_filled,
            actionParams: {
              doNotApplyToSelf: true,
              createEffect: () => new ShadowHold({ game: actor.game, turnsStunned: 3, backgroundColor: COLORS.blue_light }),
              label: 'Paralyzed [3]',
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
      // Cerebral Pressure 3
      {
        cost: 1,
        name: 'Gain Cerebral Pressure [1]',
        stacksUpTo: 1,
        description: 'Does 1 damage per turn until death, but with limited activation range.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new PrepareRangedAction({
            label: 'Cerebral Pressure [1]',
            game: actor.game,
            actor,
            range: 3,
            passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
            passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 3 })],
            keymapTriggerString: '3',
            actionClass: AddStatusEffectAtPositions,
            cursorShape: Constant.CLONE_PATTERNS.point,
            actionParams: {
              doNotApplyToSelf: true,
              createEffect: () => new HealthDrain({ game: actor.game, changeByValue: 1 }),
              label: 'Bleed [1]',
              onSuccess: () => {
                gradientPathEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  targetPositions: actor.getCursorPositions(),
                  animationTimeStep: 0.8,
                  // animationTimeStep: 0.1,
                  // transfersBackground: true,
                  backgroundColorGradient: [COLORS.black, COLORS.red],
                  character: '',
                }).start()
              }
            }
          })

          actor.addKeymapActionToBaseKeymap('3', keymapAction)
        },
      },
      {
        cost: 1,
        name: 'Gain Cerebral Pressure [2]',
        preRequirements: ['Gain Cerebral Pressure [1]'],
        stacksUpTo: 1,
        description: 'Does 1 damage per turn until death, with extended activation range.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new PrepareRangedAction({
            label: 'Cerebral Pressure [2]',
            game: actor.game,
            actor,
            range: 6,
            passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
            passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 3 })],
            keymapTriggerString: '3',
            actionClass: AddStatusEffectAtPositions,
            cursorShape: Constant.CLONE_PATTERNS.point,
            actionParams: {
              doNotApplyToSelf: true,
              createEffect: () => new HealthDrain({ game: actor.game, changeByValue: 1 }),
              label: 'Bleed [1]',
              onSuccess: () => {
                gradientPathEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  targetPositions: actor.getCursorPositions(),
                  animationTimeStep: 0.8,
                  // animationTimeStep: 0.1,
                  // transfersBackground: true,
                  backgroundColorGradient: [COLORS.black, COLORS.red],
                  character: '',
                }).start()
              }
            }
          })

          actor.addKeymapActionToBaseKeymap('3', keymapAction)
        },
      },
      {
        cost: 1,
        name: 'Gain Cerebral Pressure [3]',
        preRequirements: ['Gain Cerebral Pressure [2]'],
        stacksUpTo: 1,
        description: 'Does 2 damage per turn until death, with extended activation range and area of effect.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new PrepareRangedAction({
            label: 'Cerebral Pressure [3]',
            game: actor.game,
            actor,
            range: 6,
            passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
            passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 3 })],
            keymapTriggerString: '3',
            actionClass: AddStatusEffectAtPositions,
            cursorShape: Constant.CLONE_PATTERNS.square,
            actionParams: {
              doNotApplyToSelf: true,
              createEffect: () => new HealthDrain({ game: actor.game, changeByValue: 2 }),
              label: 'Bleed [2]',
              onSuccess: () => {
                gradientPathEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  targetPositions: actor.getCursorPositions(),
                  animationTimeStep: 0.8,
                  // animationTimeStep: 0.1,
                  // transfersBackground: true,
                  backgroundColorGradient: [COLORS.black, COLORS.red],
                  character: '',
                }).start()
              }
            }
          })

          actor.addKeymapActionToBaseKeymap('3', keymapAction)
        },
      },
      // Adrenal Control 4
      {
        cost: 1,
        name: 'Gain Adrenal Control',
        stacksUpTo: 1,
        description: 'Increase your actions per turn by 1 for 3 turns',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new AddStatusEffect({
            label: 'Adrenal Control',
            game: actor.game,
            actor,
            energyCost: 0,
            requiredResources:  [new MindResource({ getResourceCost: () => 3 })],
            effect: new SpeedDefenseDamageBuff({
              game: actor.game,
              actor,
              speedBuff: 1,
              lifespan: Constant.ENERGY_THRESHOLD * 3,
              name: 'Adrenal Control',
              description: 'at the cost of mind, you are faster'
            }),
          })

          actor.addKeymapActionToBaseKeymap('4', keymapAction)
        },
      },
      // Melee Capable 5
      {
        cost: 1,
        name: 'Gain Melee Capable',
        stacksUpTo: 1,
        description: 'Increase your attack damage by 1 for 3 turns',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new AddStatusEffect({
            label: 'Melee Capable',
            game: actor.game,
            actor,
            energyCost: 0,
            requiredResources:  [new MindResource({ getResourceCost: () => 3 })],
            effect: new SpeedDefenseDamageBuff({
              game: actor.game,
              actor,
              damageBuff: 1,
              lifespan: Constant.ENERGY_THRESHOLD * 3,
              name: 'Melee Capable',
              description: 'at the cost of mind, you are stronger'
            }),
          })

          actor.addKeymapActionToBaseKeymap('5', keymapAction)
        },
      },
      // Harden Body 6
      {
        cost: 1,
        name: 'Gain Ignore Pain',
        stacksUpTo: 1,
        description: 'Increase your defense by 1 for 3 turns. Defense blocks incoming damage.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new AddStatusEffect({
            label: 'Ignore Pain',
            game: actor.game,
            actor,
            energyCost: 0,
            requiredResources:  [new MindResource({ getResourceCost: () => 3 })],
            effect: new SpeedDefenseDamageBuff({
              game: actor.game,
              actor,
              speedBuff: 1,
              lifespan: Constant.ENERGY_THRESHOLD * 3,
              name: 'Ignore Pain',
              description: 'at the cost of mind, you are harder'
            }),
          })

          actor.addKeymapActionToBaseKeymap('6', keymapAction)
        },
      },
      // Temporal Gap 7
      {
        cost: 1,
        name: 'Gain Temporal Gap [1]',
        stacksUpTo: 1,
        description: 'Bend time for a quick getaway. Move up to 3 spaces away instantly.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new PrepareRangedAction({
            label: 'Temporal Gap [1]',
            game: actor.game,
            actor,
            passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
            passThroughRequiredResources: [new MindResource({ getResourceCost: () => 3 })],
            keymapTriggerString: '7',
            range: 3,
            actionClass: MoveOrShove,
            cursorShape: Constant.CLONE_PATTERNS.point,
            actionParams: {
              onSuccess: () => {
                SpatterEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  spatterAmount: .4,
                  spatterRadius: 3,
                  animationTimeStep: 0.9,
                  spatterDirection: { x: 0, y: 0 },
                  transfersBackground: false,
                  spatterColors: [actor.renderer.background, COLORS.blue_light]
                }).start()
              },
            },
          })

          actor.addKeymapActionToBaseKeymap('7', keymapAction)
        },
      },
      {
        cost: 1,
        name: 'Gain Temporal Gap [2]',
        preRequirements: ['Gain Temporal Gap [1]'],
        stacksUpTo: 1,
        description: 'Bend time for a quick getaway. Move up to 6 spaces away instantly.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new PrepareRangedAction({
            label: 'Temporal Gap [2]',
            game: actor.game,
            actor,
            passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
            passThroughRequiredResources: [new MindResource({ getResourceCost: () => 4 })],
            keymapTriggerString: '7',
            range: 6,
            actionClass: MoveOrShove,
            cursorShape: Constant.CLONE_PATTERNS.point,
            actionParams: {
              onSuccess: () => {
                SpatterEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  spatterAmount: .4,
                  spatterRadius: 3,
                  animationTimeStep: 0.9,
                  spatterDirection: { x: 0, y: 0 },
                  transfersBackground: false,
                  spatterColors: [actor.renderer.background, COLORS.blue_light]
                }).start()
              },
            },
          })

          actor.addKeymapActionToBaseKeymap('7', keymapAction)
        },
      },
      {
        cost: 1,
        name: 'Gain Temporal Gap [3]',
        preRequirements: ['Gain Temporal Gap [2]'],
        stacksUpTo: 1,
        description: 'Bend time for a quick getaway. Move up to 12 spaces away instantly.',
        renderer: {
          background: COLORS.dark_accent,
          color: COLORS.light,
        },
        activate: (actor) => {
          const keymapAction = () => new PrepareRangedAction({
            label: 'Temporal Gap [3]',
            game: actor.game,
            actor,
            passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
            passThroughRequiredResources: [new MindResource({ getResourceCost: () => 5 })],
            keymapTriggerString: '7',
            range: 12,
            actionClass: MoveOrShove,
            cursorShape: Constant.CLONE_PATTERNS.point,
            actionParams: {
              onSuccess: () => {
                SpatterEmitter({
                  game: actor.game,
                  fromPosition: actor.getPosition(),
                  spatterAmount: .4,
                  spatterRadius: 3,
                  animationTimeStep: 0.9,
                  spatterDirection: { x: 0, y: 0 },
                  transfersBackground: false,
                  spatterColors: [actor.renderer.background, COLORS.blue_light]
                }).start()
              },
            },
          })

          actor.addKeymapActionToBaseKeymap('7', keymapAction)
        },
      },
      // Illusory Copy 8
      // Alter Swap 9
      // Memory Seed 0
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
      // check if always available, ignore on this pass, add back in at the end
      if (upgrade?.alwaysAvailable) return false
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

    const alwaysAvailable = upgrades.buffs.filter((upgrade) => upgrade?.alwaysAvailable)

    // return available
    return [
      ...Helper.getNumberOfItemsInArray(2, available),
      ...Helper.getNumberOfItemsInArray(1, alwaysAvailable),
    ]
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