// import deps
import * as Item from '../items';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import * as Constant from '../constants';
import {Say} from '../Actions/Say';
import {Move} from '../Actions/Move';
import {PrepareSandWall} from '../Actions/SandWall';
import {PrepareSandPulse, SandPulse} from '../Actions/SandPulse';
import {ChakraResource} from '../Actions/ActionResources/ChakraResource';
import { createEightDirectionMoveOptions } from '../Keymap/helper';

export default function (engine) {
  // define keymap
  const keymap = (engine, actor) => {
    return {
      // ...createEightDirectionMoveOptions(Keymap.walk, engine, 'move', true),
      w: () => {
        const direction = Constant.DIRECTIONS.N;
        let newX = actor.pos.x + direction[0];
        let newY = actor.pos.y + direction[1];
        return new Move({
          targetPos: { x: newX, y: newY },
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        });
      },
      s: () => new Say({
        label: 'Stay',
        message: 'standing still...',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 1 }),
        ],
      }),
      p: () => new Say({
        label: 'Pass',
        message: 'pass turn...',
        game: engine.game,
        actor,
        interrupt: true,
        energyCost: 0,
      }),
      // l: new PrepareSandWall({
      //   label: 'Sand Wall',
      //   game: engine.game,
      //   actor,
      //   sandWallRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })]
      // }),
      k: () => new SandPulse({
        label: 'Sand Pulse',
        game: engine.game,
        actor,
      })
      // j: {
      //   activate: () => Keymap.sandTomb(engine),
      //   label: 'sandTomb',
      // },
      // h: {
      //   activate: () => Keymap.sandSkin(engine),
      //   label: 'sandSkin',
      // },
      // g: {
      //   activate: () => Keymap.sandClone(engine),
      //   label: 'sandClone',
      // },
      // i: {
      //   activate: () => Keymap.activateInventory(engine),
      //   label: 'Open Inventory',
      // },
      // o: {
      //   activate: () => Keymap.activateEquipment(engine),
      //   label: 'Open Equipment',
      // },
      // u: {
      //   activate: () => Keymap.activateDropItem(engine),
      //   label: 'Drop Item',
      // },
      // p: {
      //   activate: () => Keymap.pickupRandom(engine),
      //   label: 'Pickup',
      // },
      // t: {
      //   activate: () => Keymap.activateThrow(engine),
      //   label: 'Throw',
      // },
      // r: {
      //   activate: () => Keymap.teleport(engine, 5),
      //   label: 'substitution',
      // },
      // // DEV KEYS
      // y: {
      //   activate: () => Keymap.addActor(engine.game),
      //   label: 'Add NPC',
      // },
    };
  }
  // instantiate class
  let actor = new Player({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'G',
      color: Constant.THEMES.SOLARIZED.base2,
      background: Constant.THEMES.NARUTO.gaara,
    },
    name: 'Gaara',
    actions: [],
    speed: 400,
    durability: 20,
    charge: 10,
    presentingUI: true,
  })

  const newKeymap = keymap(engine, actor);
  actor.setKeymap(newKeymap);

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

  return actor;
}