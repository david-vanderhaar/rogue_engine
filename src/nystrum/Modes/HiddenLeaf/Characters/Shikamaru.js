// import deps
import * as Constant from '../../../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../Modes/HiddenLeaf/theme';
import { Player } from '../../../Entities/index';
import { ContainerSlot } from '../../../Entities/Containing';
import {ChakraResource} from '../../../Actions/ActionResources/ChakraResource';
import {PrepareDirectionalThrow} from '../../../Actions/PrepareDirectionalThrow';
import { ExplodingTag } from '../../../Modes/HiddenLeaf/Items/Weapons/ExplodingTag';
import { PrepareSubstitution } from '../../../Actions/PrepareSubstitution';
import { PrepareRangedAction } from '../../../Actions/PrepareRangedAction';
import { AddStatusEffectAtPosition } from '../../../Actions/AddStatusEffectAtPosition';
import GradientPathEmitter from '../../../Engine/Particle/Emitters/gradientPathEmitter';
import ShadowHold from '../../../StatusEffects/ShadowHold';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions } from '../../../Modes/HiddenLeaf/Characters/Utilities/characterHelper';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../sounds';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/shikamaru.png`;
const basicInfo = {
  name: 'Shikamaru',
  description: 'The master strategist',
  renderer: {
    character: 'S',
    color: HIDDEN_LEAF_COLORS.shikamaru_alt,
    background: HIDDEN_LEAF_COLORS.shikamaru,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Sub. Jutsu',
      description: 'You were never there.',
    },
    {
      name: 'Exploding Tags',
      description: 'Throws an exploding tag in the direction of the target.',
    },
    {
      name: 'Shadow Hold',
      description: 'Bind your opponent with the Nara Clan\'s jutsu.',
    },
  ],
  speedRating: 2,
  durabilityRating: 1,
  chakraRating: 2,
  speed: 500,
  durability: 4,
  charge: 7,
  portrait,
}

function initialize (engine) {

  // define keymap
  const keymap = (engine, actor) => {
    return {
      ...generateDefaultKeymapActions(engine, actor),
      l: () => new PrepareRangedAction({
        label: 'Shadow Hold',
        game: engine.game,
        actor,
        range: 5,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [],
        keymapTriggerString: 'l',
        // cursorShape: Constant.CLONE_PATTERNS.smallSquare,
        actionClass: AddStatusEffectAtPosition,
        actionParams: {
          effect: new ShadowHold({ game: engine.game, turnsStunned: 3 }),
          label: 'Shadow Hold',
          onSuccess: () => {
            HIDDEN_LEAF_SOUNDS.shadow_move.play();
            GradientPathEmitter({
              game: engine.game,
              fromPosition: actor.getPosition(),
              targetPositions: actor.getCursorPositions(),
              animationTimeStep: 0.8,
              // animationTimeStep: 0.1,
              // transfersBackground: true,
              backgroundColorGradient: [HIDDEN_LEAF_COLORS.black, HIDDEN_LEAF_COLORS.black],
              character: '',
            }).start()
          }
        }
      }),
      f: () => new PrepareDirectionalThrow({
        label: 'Exploding Tag',
        projectileType: 'exploding tag',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      r: () => new PrepareSubstitution({
        label: 'Substitution',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      }),
    };
  }
  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
  })

  // add default items to container
  // const swords = Array(2).fill('').map(() => Item.sword(engine));
  const tags = Array(2).fill('').map(() => ExplodingTag(engine, { ...actor.pos }));
  actor.container = [
    new ContainerSlot({
      itemType: tags[0].name,
      items: tags,
    }),
  ]

  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}