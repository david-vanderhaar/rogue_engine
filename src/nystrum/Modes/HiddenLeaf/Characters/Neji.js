// import deps
import * as Constant from '../../../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../Modes/HiddenLeaf/theme';
import { Player } from '../../../Entities/index';
import {ChakraResource} from '../../../Actions/ActionResources/ChakraResource';
import { PrepareDirectionalAction } from '../../../Actions/PrepareDirectionalAction';
import GradientRadialEmitter from '../../../Engine/Particle/Emitters/gradientRadialEmitter';
import { getPositionsFromStructure } from '../../../../helper';
import { StatChakraLeechAttack } from '../../../Actions/StatChakraLeechAttack';
import { MultiTargetAttackAndShove } from '../../../Actions/MultiTargetAttackAndShove';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions } from '../../../Modes/HiddenLeaf/Characters/Utilities/characterHelper';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../../Modes/HiddenLeaf/sounds';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/neji.png`;
const basicInfo = {
  name: 'Neji',
  description: 'Young master of the Gentle Fist.',
  renderer: {
    character: 'N',
    color: HIDDEN_LEAF_COLORS.neji_alt,
    background: HIDDEN_LEAF_COLORS.neji,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: '64 Palms',
      description: 'A precise area of effect technique.',
    },
    {
      name: 'Revolving Heaven',
      description: 'A large area of effect technique of both offense and defense.',
    },
    {
      name: 'Gentle Fist',
      description: 'A taijutsu style that targets the body\'s Chakra Pathway System.',
    },
  ],
  speedRating: 2,
  durabilityRating: 1,
  chakraRating: 2,
  speed: 500,
  durability: 4,
  charge: 6,
  portrait,
}

function initialize (engine) {

  // define keymap
  const keymap = (engine, actor) => {
    return {
      ...generateDefaultKeymapActions(engine, actor),
      c: () => new MultiTargetAttackAndShove({
        label: '64 Palms',
        targetPositions: getPositionsFromStructure(Constant.CLONE_PATTERNS.clover, actor.getPosition()),
        game: engine.game,
        actor,
        energyCost: (Constant.ENERGY_THRESHOLD * 1),
        requiredResources: [new ChakraResource({ getResourceCost: () => 2 })],
        onSuccess: () => {
          HIDDEN_LEAF_SOUNDS.summon_2.play();
          GradientRadialEmitter({
            game: engine.game,
            fromPosition: actor.getPosition(),
            radius: 1,
            colorGradient: [HIDDEN_LEAF_COLORS.wraps, HIDDEN_LEAF_COLORS.chakra],
            backgroundColorGradient: [HIDDEN_LEAF_COLORS.chakra, HIDDEN_LEAF_COLORS.chakra],
          }).start()
        }
      }),
      k: () => new MultiTargetAttackAndShove({
        label: 'Revolving Heaven',
        targetPositions: getPositionsFromStructure(Constant.CLONE_PATTERNS.bigSquare, actor.getPosition()),
        game: engine.game,
        actor,
        energyCost: (Constant.ENERGY_THRESHOLD * 2),
        requiredResources: [new ChakraResource({ getResourceCost: () => 5 })],
        onSuccess: () => {
          HIDDEN_LEAF_SOUNDS.summon_3.play();
          GradientRadialEmitter({
            game: engine.game,
            fromPosition: actor.getPosition(),
            radius: 3,
            colorGradient: [HIDDEN_LEAF_COLORS.wraps, HIDDEN_LEAF_COLORS.chakra],
            backgroundColorGradient: [HIDDEN_LEAF_COLORS.chakra, HIDDEN_LEAF_COLORS.chakra],
          }).start()
        }
      }),
      l: () => new PrepareDirectionalAction({
        label: 'Gentle Fist',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 3 })],
        actionLabel: 'Chakra Bleed 3:',
        actionClass: StatChakraLeechAttack,
        actionParams: {
          changeByValue: -3,
          onAfter: () => {
            HIDDEN_LEAF_SOUNDS.punch_01.play();
            setTimeout(() => {
              HIDDEN_LEAF_SOUNDS.punch_02.play();
            }, 125);
          }
        }
      }),
    };
  }
  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
  })

  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}