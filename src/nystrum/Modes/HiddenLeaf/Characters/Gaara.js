// import deps
import * as Constant from '../../../constants';
import { Player } from '../../../Entities/index';
import {ChakraResource} from '../../../Actions/ActionResources/ChakraResource';
import {PrepareSandWall} from '../../../Actions/SandWall';
import {PrepareSubstitution} from '../../../Actions/PrepareSubstitution';
import {SandPulse} from '../../../Actions/SandPulse';
import {AddSandSkinStatusEffect} from '../../../Actions/AddSandSkinStatusEffect';
import {CloneSelf} from '../../../Actions/CloneSelf';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions } from '../../../Modes/HiddenLeaf/Characters/Utilities/characterHelper';
import { SOUNDS } from '../sounds';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/gaara_full_01.png`;

const basicInfo = {
  name: 'Gaara',
  description: 'Some say he is a demon.',
  renderer: {
    character: 'G',
    color: Constant.THEMES.SOLARIZED.base2,
    background: Constant.THEMES.NARUTO.gaara,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Sand Wall',
      description: 'A technique where the user creates a wall of sand to protect themselves.',
    },
    {
      name: 'Sand Pulse',
      description: 'A technique where the user sends a wave of sand out in all directions.',
    },
    {
      name: 'Sand Skin',
      description: 'A technique where the user covers themselves in sand to protect themselves.',
    },
  ],
  speedRating: 1,
  durabilityRating: 3,
  chakraRating: 2,
  speed: 300,
  durability: 10,
  charge: 6,
  portrait,
  soundOptions: {
    onDecreaseDurability: {
      rate: 0.8,
    },
  }
}

function initialize (engine) {

  // define keymap
  const keymap = (engine, actor) => {
    return {
      ...generateDefaultKeymapActions(engine, actor),
      l: () => new PrepareSandWall({
        label: 'Sand Wall',
        game: engine.game,
        actor,
        sandWallRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      }),
      r: () => new PrepareSubstitution({
        label: 'Substitution',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      }),
      k: () => new SandPulse({
        label: 'Sand Pulse',
        game: engine.game,
        actor,
      }),
      h: () => new AddSandSkinStatusEffect({
        label: 'Sand Skin',
        game: engine.game,
        actor,
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 2 }),
        ],
      }),
      c: () => new CloneSelf({
        label: 'Sand Clone',
        game: engine.game,
        actor,
        cloneArgs: [
          {
            attribute: 'renderer',
            value: { ...actor.renderer, background: '#A89078' }
          },
          {
            attribute: 'ignoredKeys',
            value: ['g'],
          },
        ],
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 4 }),
        ],
        onSuccess: () => SOUNDS.sand_clone_01.play(),
      }),
    };
  }
  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
  })

  // add default items to container
  // const kunais = Array(100).fill('').map(() => Item.directionalKunai(engine, { ...actor.pos }, null, 10));
  // const swords = Array(2).fill('').map(() => Item.sword(engine));
  // actor.container = [
  //   new ContainerSlot({
  //     itemType: kunais[0].name,
  //     items: kunais,
  //   }),
  //   new ContainerSlot({
  //     itemType: swords[0].name,
  //     items: swords,
  //   }),
  // ]

  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}