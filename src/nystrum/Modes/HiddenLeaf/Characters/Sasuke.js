// import deps
import * as Constant from '../../../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../Modes/HiddenLeaf/theme';
import { Player } from '../../../Entities/index';
import {ChakraResource} from '../../../Actions/ActionResources/ChakraResource';
import {PrepareRangedAttack} from '../../../Actions/PrepareRangedAttack';
import { PrepareDirectionalAction } from '../../../Actions/PrepareDirectionalAction';
import SpatterEmitter from '../../../Engine/Particle/Emitters/spatterEmitter';
import GradientRadialEmitter from '../../../Engine/Particle/Emitters/gradientRadialEmitter';
import { getPositionInDirection } from '../../../../helper';
import { Katon } from '../../../Modes/HiddenLeaf/Items/Weapons/Katon';
import { TackleByRange } from '../../../Actions/TackleByRange';
import { AddSharinganStatusEffect } from '../../../Actions/AddSharinganStatusEffect';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../../Modes/HiddenLeaf/sounds';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions } from '../../../Modes/HiddenLeaf/Characters/Utilities/characterHelper';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/sasuke.png`;

const speedRating = 2
const durabilityRating = 2
const chakraRating = 2

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
  speedRating,
  durabilityRating,
  chakraRating,
  speed: speedRating * 200,
  durability: durabilityRating * 3,
  charge: chakraRating * 3,
  chargeMax: chakraRating * 3,
  attackDamage: 1,
  portrait,
}

function initialize (engine) {

  // define keymap
  const keymap = (engine, actor) => {
    return {
      ...generateDefaultKeymapActions(engine, actor),
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
          range: 5,
          onAfter: () => {
            if (actor.energy <= 0) {
              HIDDEN_LEAF_SOUNDS.jutsu_strike.play();
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
    };
  }
  // instantiate class
  let actor = new Player({
    ...generatePlayerCharacterOptions(basicInfo, engine, keymap),
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