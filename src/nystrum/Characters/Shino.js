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
import { getPositionInDirection } from '../../helper';
import { Attack } from '../Actions/Attack';
import { checkIsWalkingOnFire, checkIsWalkingOnWater } from '../Modes/HiddenLeaf/StatusEffects/helper';
import { SpawnKikaichu } from '../Actions/SpawnKikaichu';
import { StatLeechAttack } from '../Actions/StatLeechAttack';
import { StatChakraLeechAttack } from '../Actions/StatChakraLeechAttack';
import { SmokeGrenade } from '../Items/Weapons/SmokeGrenade';
import { PrepareDirectionalThrow } from '../Actions/PrepareDirectionalThrow';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/shino.png`;
const basicInfo = {
  name: 'Shino',
  description: 'Bugs are cool.',
  renderer: {
    character: 'S',
    color: HIDDEN_LEAF_COLORS.shino_alt,
    background: HIDDEN_LEAF_COLORS.shino,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Kikaichu Release',
      description: 'Spawn many chakra-eating insects.',
    },
    {
      name: 'Insect Cage',
      description: 'Surround the enemy with insects such that they struggle to even move.',
    },
  ],
  speedRating: 1,
  durabilityRating: 1,
  chakraRating: 3,
  speed: 300,
  durability: 40,
  charge: 8,
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
      c: () => new SpawnKikaichu({
        label: 'Kikaichu Release',
        game: engine.game,
        actor,
        cloneCount: 6,
        energyCost: Constant.ENERGY_THRESHOLD * 1,
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 8 }),
        ],
      }),
      l: () => new PrepareDirectionalAction({
        label: 'Chakra Leech',
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
      k: () => new PrepareDirectionalThrow({
        label: 'Smoke Grenade',
        projectileType: 'Smoke Grenade',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: basicInfo.renderer,
    name: 'Shino',
    faction: 'SHINO',
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

  // add default items to container
  const smokes = Array(4).fill('').map(() => SmokeGrenade(engine, 2));
  actor.container = [
    new ContainerSlot({
      itemType: smokes[0].name,
      items: smokes,
    }),
  ]

  // const jutsu = UzumakiBarrage(engine, actor.getPosition());
  // actor.addEquipmentSlot({type: jutsu.equipmentType})
  // actor.equip(jutsu.equipmentType, jutsu);
  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}