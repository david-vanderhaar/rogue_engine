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
import { getPositionInDirection } from '../../helper';
import { Katon } from '../Modes/HiddenLeaf/Items/Weapons/Katon';
import { TackleByRange } from '../Actions/TackleByRange';
import { AddSharinganStatusEffect } from '../Actions/AddSharinganStatusEffect';
import { checkIsWalkingOnWater } from '../Modes/HiddenLeaf/StatusEffects/helper';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/sasuke.png`;
const basicInfo = {
  name: 'Sasuke',
  description: 'The last of his clan.',
  renderer: {
    character: 'S',
    color: HIDDEN_LEAF_COLORS.sasuke_alt,
    background: HIDDEN_LEAF_COLORS.sasuke,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Katon',
      description: 'A technique where the user creates a ball of fire to attack their opponent.',
    },
    {
      name: 'Chidori',
      description: 'A technique where the user creates a ball of lightning to attack their opponent.',
    },
    {
      name: 'Sharin-gan',
      description: 'A technique where the user can see their opponents moves.',
    },
  ],
  speedRating: 2,
  durabilityRating: 2,
  chakraRating: 2,
  speed: 400,
  durability: 5,
  charge: 6,
  portrait,
}

function initialize (engine) {
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
          onAfter: () => checkIsWalkingOnWater(engine, actor),
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
          onAfter: () => checkIsWalkingOnWater(engine, actor),
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
          onAfter: () => checkIsWalkingOnWater(engine, actor),
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
          onAfter: () => checkIsWalkingOnWater(engine, actor),
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
      l: () => new PrepareDirectionalAction({
        label: 'Chidori',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD * (basicInfo.speed/100),
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })],
        actionLabel: 'Chidori',
        actionClass: TackleByRange,
        positionsByDirection: (actor, direction) => {
          const pos = actor.getPosition();
          return Array(10).fill('').map((none, distance) => {
            if (distance > 0) {
              return getPositionInDirection(pos, direction.map((dir) => dir * (distance)))
            } else {
              return null;
            }
          }).filter((pos) => pos !== null);
        },
        actionParams: {
          additionalDamage: 5,
          range: 10,
          onAfter: () => {
            if (actor.energy <= 0) {
              GradientRadialEmitter({
                game: engine.game,
                fromPosition: actor.getPosition(),
                radius: 3,
                colorGradient: ['#d3d3d3', '#94e0ef'],
                backgroundColorGradient: ['#d3d3d3', '#94e0ef']
              }).start()
            }
            SpatterEmitter({
              game: engine.game,
              fromPosition: actor.getPosition(),
              spatterAmount: 0.1,
              spatterRadius: 3,
              animationTimeStep: 0.6,
              transfersBackground: false,
              spatterColors: ['#94e0ef', '#d3d3d3', '#495877']
            }).start()
          }
        }
      }),
      f: () => new PrepareRangedAttack({
        label: 'Katon',
        game: engine.game,
        actor,
        equipmentSlotType: Constant.EQUIPMENT_TYPES.JUTSU,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 3 })]
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
      h: () => new AddSharinganStatusEffect({
        label: 'Sharingan',
        game: engine.game,
        actor,
        energyCost: 0,
        requiredResources: [
          // new EnergyResource({ getResourceCost: () => Constant.ENERGY_THRESHOLD }),
          // new ChakraResource({ getResourceCost: () => 1 }),
        ],
      }),
      // t: () => new PrepareDirectionalThrow({
      //   label: 'Throw',
      //   game: engine.game,
      //   actor,
      //   passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      // })
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: basicInfo.renderer,
    name: 'Sasuke',
    faction: 'SASUKE',
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

  const katon = Katon(engine, actor.getPosition());
  actor.addEquipmentSlot({type: katon.equipmentType})
  actor.equip(katon.equipmentType, katon);
  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}