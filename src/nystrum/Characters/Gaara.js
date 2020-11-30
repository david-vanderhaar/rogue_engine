// import deps
import * as Item from '../items';
import { Player } from '../Entities/index';
import { ContainerSlot } from '../Entities/Containing';
import * as Constant from '../constants';
import * as Keymap from '../Keymap';
import { Say } from "../Actions/Say";
import { ChakraResource } from '../Actions/ActionResources/ChakraResource';
import { EnergyResource } from '../Actions/ActionResources/EnergyResource';
import { createEightDirectionMoveOptions } from '../Keymap/helper';

export default function (engine) {
  // define keymap
  const keymap = (engine, actor) => {
    return {
      // ...createEightDirectionMoveOptions(Keymap.walk, engine, 'move', true),
      s: {
        // activate: ({actor, action}) => Keymap.none(engine, actor, action),
        activate: ({action}) => {
          console.log('activate');
          console.log(action);
          
          actor.setNextAction(action)
        },
        label: 'stay',
        action: new Say({
          message: 'standing still...',
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD,
          requiredResources: [
            new EnergyResource({ getResourceCost: () => Constant.ENERGY_THRESHOLD }),
            new ChakraResource({ getResourceCost: () => 1 }),
          ],
        }),
      },
      // l: {
      //   activate: () => Keymap.sandWall(engine),
      //   label: 'sandWall',
      // },
      // k: {
      //   activate: () => Keymap.sandPulse(engine),
      //   label: 'sandPulse',
      // },
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
    // keymap: keymap(engine),
    presentingUI: true,
  })

  actor.keymap = keymap(engine, actor);

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