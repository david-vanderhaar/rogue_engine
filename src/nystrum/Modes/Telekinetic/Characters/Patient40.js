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
      k: () => new SandPulse({
        label: 'Pulse [1]',
        game: engine.game,
        actor,
        requiredResources: [new MindResource({ getResourceCost: () => 1 })]
      }),
      f: () => new PrepareRangedTelekinesisAction({
        label: 'Telekinesis',
        game: engine.game,
        actor,
        triggerRange: actor?.telekenticTriggerRange || 2,
        throwRange: actor?.telekineticThrowRange || 2,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 2 })],
        keymapTriggerString: 'f',
        cursorShape: Constant.CLONE_PATTERNS.point,
        // cursorShape: Constant.CLONE_PATTERNS.smallSquare,
      }),
      // f: () => new PrepareRangedAction({
      //   label: 'Telekinesis E',
      //   game: engine.game,
      //   actor,
      //   range: 10,
      //   passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      //   passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 1 })],
      //   keymapTriggerString: 'f',
      //   cursorShape: Constant.CLONE_PATTERNS.point,
      //   // cursorShape: Constant.CLONE_PATTERNS.smallSquare,
      //   actionClass: AddStatusEffectAtPositions,
      //   actionParams: {
      //     createEffect: () => new Thrown({ game: engine.game, direction: Constant.DIRECTIONS.E, range: 3 }),
      //     label: 'Throw E',
      //   }
      // }),
      // c: () => new PrepareRangedAction({
      //   label: 'Menacing Stare [1]',
      //   game: engine.game,
      //   actor,
      //   range: 10,
      //   passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      //   passThroughRequiredResources:  [new MindResource({ getResourceCost: () => 1 })],
      //   keymapTriggerString: 'f',
      //   // cursorShape: Constant.CLONE_PATTERNS.smallSquare,
      //   actionClass: AddStatusEffectAtPosition,
      //   actionParams: {
      //     effect: new ShadowHold({ game: engine.game, turnsStunned: 1 }),
      //     label: 'Stare [1]',
      //     onSuccess: () => {
      //       gradientPathEmitter({
      //         game: engine.game,
      //         fromPosition: actor.getPosition(),
      //         targetPositions: actor.getCursorPositions(),
      //         animationTimeStep: 0.8,
      //         // animationTimeStep: 0.1,
      //         // transfersBackground: true,
      //         backgroundColorGradient: [COLORS.black, COLORS.black],
      //         character: '',
      //       }).start()
      //     }
      //   }
      // }),
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
