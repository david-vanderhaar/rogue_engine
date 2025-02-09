// import deps
import * as Item from '../items';
import * as Constant from '../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../Modes/HiddenLeaf/theme';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import {ChakraResource} from '../Actions/ActionResources/ChakraResource';
import {Say} from '../Actions/Say';
import {MoveOrAttack} from '../Actions/MoveOrAttack';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenEquipment} from '../Actions/OpenEquipment';
import {OpenDropInventory} from '../Actions/OpenDropInventory';
import {PickupRandomItem} from '../Actions/PickupRandomItem';
import { PrepareDirectionalAction } from '../Actions/PrepareDirectionalAction';
import SpatterEmitter from '../Engine/Particle/Emitters/spatterEmitter';
import GradientRadialEmitter from '../Engine/Particle/Emitters/gradientRadialEmitter';
import { getPositionInDirection, getPositionsFromStructure } from '../../helper';
import { Attack } from '../Actions/Attack';
import { checkIsWalkingOnFire, checkIsWalkingOnWater } from '../Modes/HiddenLeaf/StatusEffects/helper';
import { SpawnKikaichu } from '../Actions/SpawnKikaichu';
import { StatLeechAttack } from '../Actions/StatLeechAttack';
import { StatChakraLeechAttack } from '../Actions/StatChakraLeechAttack';
import { PrepareDirectionalThrow } from '../Actions/PrepareDirectionalThrow';
import { MultiTargetAttack } from '../Actions/MultiTargetAttack';
import { MultiTargetAttackAndShove } from '../Actions/MultiTargetAttackAndShove';

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

  function onAfterMoveOrAttack(enginee, actor) {
    checkIsWalkingOnWater(enginee, actor)
    checkIsWalkingOnFire(enginee, actor)
  }
  // define keymap
  const keymap = (engine, actor) => {
    return {
      'w,ArrowUp': () => {
        const direction = Constant.DIRECTIONS.N;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onAfter: () => onAfterMoveOrAttack(engine, actor),
        });
      },
      's,ArrowDown': () => {
        const direction = Constant.DIRECTIONS.S;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onAfter: () => onAfterMoveOrAttack(engine, actor),
        });
      },
      'a,ArrowLeft': () => {
        const direction = Constant.DIRECTIONS.W;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onAfter: () => onAfterMoveOrAttack(engine, actor),
        });
      },
      'd,ArrowRight': () => {
        const direction = Constant.DIRECTIONS.E;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new MoveOrAttack({
          hidden: true,
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          onAfter: () => onAfterMoveOrAttack(engine, actor),
        });
      },
      p: () => new Say({
        label: 'Stay',
        message: 'standing still...',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      }),
      Escape: () => new Say({
        label: 'Pass',
        message: 'pass turn...',
        game: engine.game,
        actor,
        energyCost: actor.energy,
      }),
      i: () => new OpenInventory({
        label: 'Inventory',
        game: engine.game,
        actor,
      }),
      // o: () => new OpenEquipment({
      //   label: 'Equipment',
      //   game: engine.game,
      //   actor,
      // }),
      u: () => new OpenDropInventory({
        label: 'Drop Items',
        game: engine.game,
        actor,
      }),
      g: () => new PickupRandomItem({
        label: 'Pickup',
        game: engine.game,
        actor,
      }),
      c: () => new MultiTargetAttackAndShove({
        label: '64 Palms',
        targetPositions: getPositionsFromStructure(Constant.CLONE_PATTERNS.clover, actor.getPosition()),
        game: engine.game,
        actor,
        energyCost: (Constant.ENERGY_THRESHOLD * 1),
        requiredResources: [new ChakraResource({ getResourceCost: () => 2 })],
        onSuccess: () => {
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
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })],
        actionLabel: 'Chakra Leech',
        actionClass: StatChakraLeechAttack,
        actionParams: {
          changeByValue: -2,
        }
      }),
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: basicInfo.renderer,
    name: 'Neji',
    faction: 'NEJI',
    // enemyFactions: ['ALL'],
    enemyFactions: ['OPPONENT'],
    traversableTiles: ['WATER'],
    actions: [],
    speed: basicInfo.speed,
    durability: basicInfo.durability,
    charge: basicInfo.charge,
    game: engine.game,
    presentingUI: true,
    initializeKeymap: keymap,
  })

  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}