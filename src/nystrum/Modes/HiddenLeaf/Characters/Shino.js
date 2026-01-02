// import deps
import * as Constant from '../../../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../Modes/HiddenLeaf/theme';
import { Player } from '../../../Entities/index';
import { ContainerSlot } from '../../../Entities/Containing';
import {ChakraResource} from '../../../Actions/ActionResources/ChakraResource';
import { PrepareDirectionalAction } from '../../../Actions/PrepareDirectionalAction';
import { SpawnKikaichu } from '../../../Actions/SpawnKikaichu';
import { StatChakraLeechAttack } from '../../../Actions/StatChakraLeechAttack';
import { PrepareDirectionalThrow } from '../../../Actions/PrepareDirectionalThrow';
import { ShinoBugCage } from '../../../Modes/HiddenLeaf/Items/Weapons/ShinoBugCage';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions } from '../../../Modes/HiddenLeaf/Characters/Utilities/characterHelper';

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
      name: 'Kikaichu Cage',
      description: 'Surround the enemy with insects such that they struggle to even move.',
    },
    {
      name: 'Chakra Leech',
      description: 'Drain the enemy of their chakra.',
    },
  ],
  speedRating: 1,
  durabilityRating: 1,
  chakraRating: 3,
  speed: 300,
  durability: 4,
  charge: 8,
  portrait,
}

function initialize (engine) {

  // define keymap
  const keymap = (engine, actor) => {
    return {
      ...generateDefaultKeymapActions(engine, actor),
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
        label: 'Kikaichu Cage',
        projectileType: 'Kikaichu Cage',
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 3 })],
      }),
    };
  }
  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
  })

  // add default items to container
  const items = Array(100).fill('').map(() => ShinoBugCage({engine, range: 5}));
  actor.container = [
    new ContainerSlot({
      itemType: items[0].name,
      items: items,
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