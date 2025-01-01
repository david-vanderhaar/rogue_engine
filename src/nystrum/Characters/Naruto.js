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
import { AddNineTailsStatusEffect } from '../Actions/AddNineTailsStatusEffect';
import { PrepareCallReinforcements } from '../Actions/PrepareCallReinforcements';
import { SpawnShadowClones } from '../Actions/SpawnShadowClones';
import { DurabilityResource } from '../Actions/ActionResources/DurabilityResource';
import { UzumakiBarrage } from '../Modes/HiddenLeaf/Items/Weapons/UzumakiBarrage';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/naruto.png`;
const basicInfo = {
  name: 'Naruto',
  description: 'Believe it!',
  renderer: {
    character: 'N',
    color: HIDDEN_LEAF_COLORS.black,
    background: HIDDEN_LEAF_COLORS.orange,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Uzumaki Combo',
      description: 'A barrage of punches and kicks.',
    },
    {
      name: 'Shadow Clone Jutsu',
      description: 'A technique where the user creates many clones to overwhelm their opponent.',
    },
    {
      name: 'Nine Tails',
      description: 'The nine tailed fox can\'t be stopped.',
    },
  ],
  speedRating: 1,
  durabilityRating: 2,
  chakraRating: 3,
  speed: 300,
  durability: 5,
  charge: 9,
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
          energyCost: Constant.ENERGY_THRESHOLD
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
          energyCost: Constant.ENERGY_THRESHOLD
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
          energyCost: Constant.ENERGY_THRESHOLD
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
          energyCost: Constant.ENERGY_THRESHOLD
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
      c: () => new SpawnShadowClones({
        label: 'Shadow Clone Jutsu',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD * 1,
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 9 }),
        ],
      }),
      h: () => new AddNineTailsStatusEffect({
        label: 'Tailed Beast',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD * 3,
        requiredResources: [
          new DurabilityResource({ getResourceCost: () => 2 }),
        ],
      }),
      t: () => new PrepareDirectionalThrow({
        label: 'Throw',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      f: () => new PrepareRangedAttack({
        label: 'Uzumaki Barrage',
        game: engine.game,
        actor,
        equipmentSlotType: 'Uzumaki Barrage',
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 3 })]
      }),
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: basicInfo.renderer,
    name: 'Naruto',
    faction: 'NARUTO',
    // enemyFactions: ['ALL'],
    enemyFactions: ['OPPONENT'],
    actions: [],
    speed: basicInfo.speed,
    durability: basicInfo.durability,
    charge: basicInfo.charge,
    game: engine.game,
    presentingUI: true,
    initializeKeymap: keymap,
  })

  // add default items to container
  const kunais = Array(100).fill('').map(() => Item.directionalKunai(engine, { ...actor.pos }, null, 10));
  const swords = Array(2).fill('').map(() => Item.sword(engine));
  actor.container = [
    new ContainerSlot({
      itemType: kunais[0].name,
      items: kunais,
    }),
    new ContainerSlot({
      itemType: swords[0].name,
      items: swords,
    }),
  ]

  const jutsu = UzumakiBarrage(engine, actor.getPosition());
  actor.addEquipmentSlot({type: jutsu.equipmentType})
  actor.equip(jutsu.equipmentType, jutsu);
  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}