// import deps
import * as Item from '../items';
import * as Constant from '../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../Modes/HiddenLeaf/theme';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import {ChakraResource} from '../Actions/ActionResources/ChakraResource';
import {Say} from '../Actions/Say';
import {MoveOrAttack} from '../Actions/MoveOrAttack';
import {PrepareRangedAttack} from '../Actions/PrepareRangedAttack';
import {PrepareDirectionalThrow} from '../Actions/PrepareDirectionalThrow';
import {OpenInventory} from '../Actions/OpenInventory';
import {OpenEquipment} from '../Actions/OpenEquipment';
import {OpenDropInventory} from '../Actions/OpenDropInventory';
import {PickupRandomItem} from '../Actions/PickupRandomItem';
import { PrepareDirectionalAction } from '../Actions/PrepareDirectionalAction';
import SpatterEmitter from '../Engine/Particle/Emitters/spatterEmitter';
import GradientRadialEmitter from '../Engine/Particle/Emitters/gradientRadialEmitter';
import * as Helper from '../../helper';
import { checkIsWalkingOnWater, checkIsWalkingOnFire } from '../Modes/HiddenLeaf/StatusEffects/helper';
import { PiercingKunai } from '../Modes/HiddenLeaf/Items/Weapons/PiercingKunai';
import { ExplodingTag } from '../Modes/HiddenLeaf/Items/Weapons/ExplodingTag';
import { PrepareSubstitution } from '../Actions/PrepareSubstitution';
import * as TentenSummons from '../Modes/HiddenLeaf/Items/Weapons/TentenSummons';
import { SpawnAndPlaceItem } from '../Actions/SpawnAndPlaceItem';
import { WindPush } from '../Modes/HiddenLeaf/Items/Weapons/WindPush';
import { WindSlice } from '../Modes/HiddenLeaf/Items/Weapons/WindSlice';
import { AddStatusEffect } from '../Actions/AddStatusEffect';
import { WindBursts } from '../Modes/HiddenLeaf/StatusEffects/WindBursts';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/temari.png`;
const basicInfo = {
  name: 'Temari',
  description: 'The Wind Ninja',
  renderer: {
    character: 'T',
    color: HIDDEN_LEAF_COLORS.temari_alt,
    background: HIDDEN_LEAF_COLORS.temari,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Wind Release',
      description: 'Summons a gust of wind in the direction of the target and pushes them away.',
    },
    {
      name: 'Wind Bursts',
      description: 'Summons short bursts of wind to speed up your movements and deflect attacks.',
    },
    {
      name: 'Wind Shuriken',
      description: 'Cuts through enemeies at range.',
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

  async function summonSuccess(position, direction) {
    const spatterEmitter = SpatterEmitter({
      game: engine.game,
      fromPosition: position,
      spatterRadius: 5,
      spatterAmount: 0.8,
      spatterDirection: { x: direction[0], y: direction[1] },
      spatterColors: [
        HIDDEN_LEAF_COLORS.wraps,
        HIDDEN_LEAF_COLORS.temari,
      ],
      animationTimeStep: 0.1,
      transfersBackground: false,
      transfersBackgroundOnDestroy: false,
    })
    await spatterEmitter.start()
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
      Backspace: () => new Say({
        label: 'Pass',
        message: 'pass turn...',
        game: engine.game,
        actor,
        energyCost: actor.energy,
      }),
      t: () => new PrepareDirectionalThrow({
        label: 'Wind Release',
        projectileType: 'wind push',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })],
        passThroughOnSuccess: ({direction}) => summonSuccess(actor.getPosition(), direction),
      }),
      f: () => new PrepareDirectionalThrow({
        label: 'Wind Slice',
        projectileType: 'wind slice',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 3 })],
        passThroughOnSuccess: ({direction}) => summonSuccess(actor.getPosition(), direction),
      }),
      l: () => new AddStatusEffect({
        label: 'Wind Bursts',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        effect: new WindBursts({
          game: engine.game,
          actor,
        }),
      }),
      // r: () => new PrepareSubstitution({
      //   label: 'Substitution',
      //   game: engine.game,
      //   actor,
      //   passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      //   passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      // }),
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
        attemptEquip: true,
      }),
      // h: () => null,
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: basicInfo.renderer,
    name: 'Tenten',
    faction: 'TENTEN',
    // enemyFactions: ['ALL'],
    enemyFactions: ['OPPONENT'],
    faction: 'PLAYER',
    traversableTiles: ['WATER'],
    actions: [],
    speed: basicInfo.speed,
    durability: basicInfo.durability,
    charge: basicInfo.charge,
    game: engine.game,
    presentingUI: true,
    initializeKeymap: keymap,
  })

  const windPushes = Array(100).fill('').map(() => WindPush(engine, { ...actor.pos }));
  const windSlices = Array(100).fill('').map(() => WindSlice(engine, { ...actor.pos }, null, 10));
  actor.container = [
    new ContainerSlot({
      itemType: windPushes[0].name,
      items: windPushes,
      hidden: true,
    }),
    new ContainerSlot({
      itemType: windSlices[0].name,
      items: windSlices,
      hidden: true,
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