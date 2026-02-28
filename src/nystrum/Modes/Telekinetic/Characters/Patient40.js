// import deps
import * as Constant from '../../../constants';
import { Player } from '../../../Entities/index';
import BlitzerBehaviors from '../../../Entities/AI/Archetypes/BlitzerBehaviors';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions, playRandomSoundFromArray } from '../../Telekinetic/Characters/Utilities/characterHelper';
import { COLORS } from '../theme';
import * as Helper from '../../../../helper';
import { SandPulse } from '../../../Actions/SandPulse';
import { ChakraResource } from '../../../Actions/ActionResources/ChakraResource';

const portrait = `${window.PUBLIC_URL}/hidden_leaf/rock_full_01.png`

const speedRating = 3;
const durabilityRating = 2;
const chakraRating = 1;

const basicInfo = {
  name: 'Patient #40',
  description: 'Where am I? What is this place? Why do I feel so... light?',
  renderer: {
    character: '@',
    color: COLORS.dark_accent,
    background: COLORS.white,
    portrait,
    basePortrait: portrait,
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
  speed: speedRating * 200,
  durability: durabilityRating * 3,
  charge: chakraRating * 3,
  chargeMax: chakraRating * 3,
  attackDamage: 1,
  portrait,
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
        requiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      }),
    };
  }

  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
  })

  actor.traversableTiles = [];

  return actor
}

// a mock for AI behaviors
const behaviors = BlitzerBehaviors(basicInfo);

export default function () {
  return {
    initialize: initialize,
    basicInfo: {behaviors, ...basicInfo},
  }
}
