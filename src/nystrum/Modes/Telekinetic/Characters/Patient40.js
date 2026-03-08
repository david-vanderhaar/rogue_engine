// import deps
import * as Constant from '../../../constants';
import { Player } from '../../../Entities/index';
import BlitzerBehaviors from '../../../Entities/AI/Archetypes/BlitzerBehaviors';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions, playRandomSoundFromArray } from '../../Telekinetic/Characters/Utilities/characterHelper';
import { COLORS } from '../theme';
import * as Helper from '../../../../helper';
import { SandPulse } from '../../../Actions/SandPulse';
import { MindResource } from '../../../Actions/ActionResources/MindResource';
import { PrepareRangedAction } from '../../../Actions/PrepareRangedAction';
import { AddStatusEffectAtPosition } from '../../../Actions/AddStatusEffectAtPosition';
import ShadowHold from '../../../StatusEffects/ShadowHold';
import gradientPathEmitter from '../../../Engine/Particle/Emitters/gradientPathEmitter';
import Thrown from '../StatusEffects/Thrown';
import FollowAndAttack from '../../../Entities/AI/BehaviorChains/FollowAndAttack';
import { AddStatusEffectAtPositions } from '../../../Actions/AddStatusEffectAtPositions';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';
import { PrepareDirectionalAction } from '../../../Actions/PrepareDirectionalAction';
import { PrepareTelekinesisThrow } from '../../../Actions/PrepareTelekinesisThrow';
import { PrepareRangedTelekinesisAction } from '../../../Actions/PrepareRangedTelekinesisAction';
import { MultiTargetAttackAndShove } from '../../../Actions/MultiTargetAttackAndShove';
import gradientRadialEmitter from '../../../Engine/Particle/Emitters/gradientRadialEmitter';
import { HealthDrain } from '../StatusEffects/HealthDrain';
import { AddStatusEffect } from '../../../Actions/AddStatusEffect';
import { SpeedDefenseDamageBuff } from '../StatusEffects/SpeedDefenseDamageBuff';
import { PrepareSubstitution } from '../../../Actions/PrepareSubstitution';
import { MoveOrShove } from '../../../Actions/MoveOrShove';
import { StatChangeOnSelf } from '../../../Actions/StatChangeOnSelf';

const portrait = `${window.PUBLIC_URL}/telekinetic/portrait_0.png`

const speedRating = 1;
const durabilityRating = 2;
const chakraRating = 3;

const basicInfo = {
  name: 'Patient #40',
  description: 'Where am I? What is this place? Why do I feel so... light?',
  renderer: {
    character: '@',
    color: COLORS.dark_accent,
    background: COLORS.white,
    // portrait,
    // basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Telekinesis [1]',
      description: '',
    },
    {
      name: 'Mind Tap [1]',
      description: '',
    },
    {
      name: 'Mass Tap [1]',
      description: '',
    },
  ],
  speedRating,
  durabilityRating,
  chakraRating,
  speed: speedRating * 100,
  durability: durabilityRating,
  charge: chakraRating,
  chargeMax: chakraRating,
  attackDamage: 0,
  // portrait,
}
  

function initialize (engine) {
  // define keymap
  const keymap = (engine, actor) => {
    return {
      ...generateDefaultKeymapActions(engine, actor),
      f: () => new PrepareRangedTelekinesisAction({
        label: 'Telekinesis',
        game: engine.game,
        actor,
        triggerRange: actor.telekenticTriggerRange,
        throwRange: actor.telekineticThrowRange,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 2 })],
        keymapTriggerString: 'f',
        cursorShape: Constant.CLONE_PATTERNS.point,
        // cursorShape: Constant.CLONE_PATTERNS.smallSquare,
      }),
      o: () => new StatChangeOnSelf({
        label: 'Mind Gain [1]',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        changeByValue: 1,
        statAttributePath: 'charge',
        statAttributePathMax: 'chargeMax',
        statAttributeValueMin: 0,
      }),
    }
  }

  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
  })

  return actor
}

export default function () {
  return {
    initialize: initialize,
    basicInfo: {...basicInfo},
  }
}

// potential powers
 // 1: () => new SandPulse({
//   label: 'Push [1]',
//   game: engine.game,
//   actor,
//   requiredResources: [new MindResource({ getResourceCost: () => 1 })]
// }),