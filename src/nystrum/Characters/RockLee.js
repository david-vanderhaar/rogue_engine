// import deps
import * as Item from '../items';
import * as Constant from '../constants';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import { ChakraResource } from '../Actions/ActionResources/ChakraResource';
import { Say } from '../Actions/Say';
import { MoveOrAttack } from '../Actions/MoveOrAttack';
import { MultiTargetAttack } from '../Actions/MultiTargetAttack';
import { OpenInventory } from '../Actions/OpenInventory';
import { OpenEquipment } from '../Actions/OpenEquipment';
import { OpenDropInventory } from '../Actions/OpenDropInventory';
import { PickupRandomItem } from '../Actions/PickupRandomItem';
import { PrepareDirectionalThrow } from '../Actions/PrepareDirectionalThrow';
import { PrepareTackle } from '../Actions/PrepareTackle';
import { AddOpenGatesStatusEffect } from '../Actions/AddOpenGatesStatusEffect';
import { AddStatusEffect } from '../Actions/AddStatusEffect';
import { RemoveWeights } from '../Modes/HiddenLeaf/StatusEffects/RemoveWeights';
import { DrunkenFist } from '../Modes/HiddenLeaf/StatusEffects/DrunkenFist';
import { GoToPreviousKeymap } from '../Actions/GoToPreviousKeymap';
import { MoveTargetingCursor } from '../Actions/MoveTargetingCursor';
import { MoveTowards } from '../Actions/MoveTowards';

const portrait = `${window.PUBLIC_URL}/hidden_leaf/rock_full_01.png`

const basicInfo = {
  name: 'Rock Lee',
  description: 'A young ninja who can only use taijutsu.',
  renderer: {
    character: 'R',
    color: Constant.THEMES.SOLARIZED.base3,
    background: Constant.THEMES.NARUTO.rock_lee,
    portrait
  },
  abilities: [
    {
      name: 'Leaf Whirlwind',
      description: 'A taijutsu technique where the user spins rapidly to attack surrounding enemies.',
    },
    {
      name: 'Flying Lotus',
      description: 'Use your speed to close the distance and attack your enemy.',
    },
    {
      name: 'Inner Gates',
      description: 'How many gates can you open before you die?',
    },
  ],
  speedRating: 3,
  durabilityRating: 2,
  chakraRating: 0,
  speed: 600,
  durability: 6,
  charge: 0,
  chargeMax: 10,
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
        interrupt: true,
        energyCost: 0,
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
      t: () => new PrepareDirectionalThrow({
        label: 'Throw',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      l: () => new PrepareTackle({
        label: 'Flying Lotus',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      }),
      k: () => new AddStatusEffect({
        label: 'Remove Weights',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        effect: new RemoveWeights({
          lifespan: Constant.ENERGY_THRESHOLD * 10,
          speedBuff: Constant.ENERGY_THRESHOLD * 10,
          damageBuff: -1,
          game: engine.game,
          actor,
        }),
      }),
      j: () => new AddStatusEffect({
        label: 'Sip Sake',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        effect: new DrunkenFist({
          lifespan: Constant.ENERGY_THRESHOLD * 30,
          speedBuff: -Constant.ENERGY_THRESHOLD * 2,
          damageBuff: 3,
          game: engine.game,
          actor,
        }),
      }),
      h: () => new MultiTargetAttack({
        label: 'Leaf Whirlwind',
        targetPositions: [
          {
            x: actor.pos.x - 1,
            y: actor.pos.y,
          },
          {
            x: actor.pos.x - 1,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y + 1,
          },
          {
            x: actor.pos.x,
            y: actor.pos.y + 1,
          },
          {
            x: actor.pos.x - 1,
            y: actor.pos.y + 1,
          },
        ],
        game: engine.game,
        actor,
        energyCost: (Constant.ENERGY_THRESHOLD * 2),
        particleTemplate: Constant.PARTICLE_TEMPLATES.leaf,
      }),
      g: () => new AddOpenGatesStatusEffect({
        label: 'Open Inner Gate',
        game: engine.game,
        actor,
        // requiredResources: [
        //   new ChakraResource({ getResourceCost: () => 2 }),
        // ],
      }),
      // mouseOver: (mousePosition) => {
      //   return new MoveTargetingCursor({
      //     hidden: true,
      //     actor: actor,
      //     game: engine.game,
      //     targetPos: mousePosition,
      //   })
      // },
      mouseLeftButton: (mousePosition) => {
        return new MoveTowards({
          hidden: true,
          actor,
          game: engine.game,
          targetPos: mousePosition,
        })
      },
      mouseRightButton: (mousePosition) => {
        return new GoToPreviousKeymap({
          hidden: true,
          actor,
          game: engine.game,
        })
      },
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: basicInfo.renderer,
    name: basicInfo.name,
    enemyFactions: ['ALL'],
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

  return actor
}

export default function () {
  return {
    initialize: initialize,
    basicInfo: basicInfo,
  }
}
