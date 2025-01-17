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
import { Katon } from '../Modes/HiddenLeaf/Items/Weapons/Katon';
import { TackleByRange } from '../Actions/TackleByRange';
import { AddSharinganStatusEffect } from '../Actions/AddSharinganStatusEffect';
import { checkIsWalkingOnWater, checkIsWalkingOnFire } from '../Modes/HiddenLeaf/StatusEffects/helper';
import { PiercingKunai } from '../Modes/HiddenLeaf/Items/Weapons/PiercingKunai';
import { ExplodingTag } from '../Modes/HiddenLeaf/Items/Weapons/ExplodingTag';
import { PrepareSubstitution } from '../Actions/PrepareSubstitution';
import { EquipItem } from '../Actions/EquipItem';
import { PlaceItem } from '../Actions/PlaceItem';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/tenten.png`;
const basicInfo = {
  name: 'Tenten',
  description: 'The weapons specialist',
  renderer: {
    character: 'T',
    color: HIDDEN_LEAF_COLORS.tenten_alt,
    background: HIDDEN_LEAF_COLORS.tenten,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Weapon Barrage',
      description: 'An area attack that throws a barrage of weapons at the opponent.',
    },
    {
      name: 'Caltrops',
      description: 'A technique that scatters a large number of caltrops in the area.',
    },
    {
      name: 'Summon Weapon',
      description: 'Summons a random, powerful weapon.',
    },
  ],
  speedRating: 1,
  durabilityRating: 2,
  chakraRating: 2,
  speed: 300,
  durability: 5,
  charge: 7,
  portrait,
}

function initialize (engine) {

  function onAfterMoveOrAttack(enginee, actor) {
    checkIsWalkingOnWater(enginee, actor)
    checkIsWalkingOnFire(enginee, actor)
  }

  async function summonSuccess(actor) {
    const spatterEmitter = SpatterEmitter({
      game: engine.game,
      fromPosition: actor.getPosition(),
      spatterRadius: 5,
      spatterAmount: 0.3,
      spatterDirection: { x: 0, y: 0 },
      spatterColors: [HIDDEN_LEAF_COLORS.red, HIDDEN_LEAF_COLORS.wraps],
      animationTimeStep: 0.9,
      reverse: true,
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
      Escape: () => new Say({
        label: 'Pass',
        message: 'pass turn...',
        game: engine.game,
        actor,
        energyCost: actor.energy,
      }),
      l: () => {
        const item = Item.sword(engine);

        return new EquipItem({
          label: 'Weapon Scroll Summon',
          item,
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          requiredResources: [new ChakraResource({ getResourceCost: () => 1 })],
          onSuccess: () => summonSuccess(actor),
        });
        
        // // get open neighboring position
        // const neigbors = Helper.getNeighboringPoints(actor.getPosition(), false)
        // const neigbor = Helper.getRandomInArray(neigbors)
        // return new PlaceItem({
        //   label: 'Weapon Scroll Summon',
        //   entity: item,
        //   targetPos: neigbor,
        //   game: engine.game,
        //   actor,
        //   energyCost: Constant.ENERGY_THRESHOLD,
        //   requiredResources: [new ChakraResource({ getResourceCost: () => 1 })],
        // });
      },
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
      // h: () => null,
      t: () => new PrepareDirectionalThrow({
        label: 'Throw',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      })
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
  const kunais = Array(100).fill('').map(() => Item.directionalKunai(engine, { ...actor.pos }, null, 10));
  const swords = Array(2).fill('').map(() => Item.sword(engine));
  const tags = Array(2).fill('').map(() => ExplodingTag(engine, { ...actor.pos }));
  actor.container = [
    new ContainerSlot({
      itemType: kunais[0].name,
      items: kunais,
    }),
    new ContainerSlot({
      itemType: tags[0].name,
      items: tags,
    }),
  ]

  const jutsu = PiercingKunai(engine, actor.getPosition());
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