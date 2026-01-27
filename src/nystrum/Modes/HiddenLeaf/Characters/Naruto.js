// import deps
import * as Constant from '../../../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../Modes/HiddenLeaf/theme';
import { Player } from '../../../Entities/index';
import {ChakraResource} from '../../../Actions/ActionResources/ChakraResource';
import {PrepareRangedAttack} from '../../../Actions/PrepareRangedAttack';
import { AddNineTailsStatusEffect } from '../../../Actions/AddNineTailsStatusEffect';
import { SpawnShadowClones } from '../../../Actions/SpawnShadowClones';
import { DurabilityResource } from '../../../Actions/ActionResources/DurabilityResource';
import { UzumakiBarrage } from '../../../Modes/HiddenLeaf/Items/Weapons/UzumakiBarrage';
import { checkIsWalkingOnFire, checkIsWalkingOnWater, } from '../../../Modes/HiddenLeaf/StatusEffects/helper';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions } from '../../../Modes/HiddenLeaf/Characters/Utilities/characterHelper';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../../Modes/HiddenLeaf/sounds';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/naruto.png`;

const speedRating = 1
const durabilityRating = 2
const chakraRating = 3

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

  function onAfterMoveOrAttack(enginee, actor) {
    checkIsWalkingOnWater(enginee, actor)
    checkIsWalkingOnFire(enginee, actor)
  }
  // define keymap
  const keymap = (engine, actor) => {
    return {
      ...generateDefaultKeymapActions(engine, actor),
      c: () => new SpawnShadowClones({
        label: 'Shadow Clone Jutsu',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD * 1,
        requiredResources: [
          new ChakraResource({ getResourceCost: () => 9 }),
        ],
        onSuccess: () => HIDDEN_LEAF_SOUNDS.summon_1.play(),
      }),
      h: () => new AddNineTailsStatusEffect({
        label: 'Tailed Beast',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD * 3,
        requiredResources: [
          new DurabilityResource({ getResourceCost: () => 2 }),
        ],
        onSuccess: () => HIDDEN_LEAF_SOUNDS.scion_melee_01.play(),
      }),
      // t: () => new PrepareDirectionalThrow({
      //   label: 'Throw',
      //   game: engine.game,
      //   actor,
      //   passThroughEnergyCost: Constant.ENERGY_THRESHOLD,
      // }),
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