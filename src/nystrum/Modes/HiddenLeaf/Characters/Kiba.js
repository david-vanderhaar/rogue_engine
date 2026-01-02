// import deps
import * as Constant from '../../../constants';
import { COLORS as HIDDEN_LEAF_COLORS } from '../../../Modes/HiddenLeaf/theme';
import { JacintoAI, Player } from '../../../Entities/index';
import {ChakraResource} from '../../../Actions/ActionResources/ChakraResource';
import { AddStatusEffect } from '../../../Actions/AddStatusEffect';
import { WolfSpeed } from '../../../Modes/HiddenLeaf/StatusEffects/WolfSpeed';
import { PreparePlaceActorInDirection } from '../../../Actions/PreparePlaceActorInDirection';
import * as Behaviors from '../../../Entities/AI/Behaviors/index';
import { generateDefaultKeymapActions, generatePlayerCharacterOptions, playRandomSoundFromArray } from '../../../Modes/HiddenLeaf/Characters/Utilities/characterHelper';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../../Modes/HiddenLeaf/sounds';
import { FangOverFang } from '../../../Actions/FangOverFang';

const portrait =  `${window.PUBLIC_URL}/hidden_leaf/kiba.png`;
const basicInfo = {
  name: 'Kiba',
  description: 'Wolf Pack!',
  renderer: {
    character: 'K',
    color: HIDDEN_LEAF_COLORS.kiba_alt,
    background: HIDDEN_LEAF_COLORS.kiba,
    portrait,
    basePortrait: portrait,
    damageFlashPortrait: `${window.PUBLIC_URL}/hidden_leaf/white.png`,
  },
  abilities: [
    {
      name: 'Fang Over Fang',
      description: 'A technique where the user spins rapidly to attack their opponent.',
    },
    {
      name: 'Wolf Speed',
      description: 'Tapping into the power of the wolf.',
    },
    {
      name: 'Summon Akamaru',
      description: 'Summoning his trusty companion.',
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
      ...generateDefaultKeymapActions(engine, actor),
      l: () => new FangOverFang({
        game: engine.game,
        actor,
        passThroughEnergyCost: Constant.ENERGY_THRESHOLD * (basicInfo.speed/100),
        passThroughRequiredResources: [new ChakraResource({ getResourceCost: () => 1 })],
        additionalFangDamage: 3,
        fangRange: 8,
      }),
      k: () => new AddStatusEffect({
        label: 'Wolf Speed',
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        requiredResources: [ new ChakraResource({ getResourceCost: () => 2 }) ],
        effect: new WolfSpeed({
          lifespan: Constant.ENERGY_THRESHOLD * 10,
          speedBuff: Constant.ENERGY_THRESHOLD * 2,
          damageBuff: 0,
          game: engine.game,
          actor,
        }),
      }),
      t: () => new PreparePlaceActorInDirection({
          label: 'Summon Akamaru',
          game: engine.game,
          actor,
          passThroughEnergyCost: Constant.ENERGY_THRESHOLD * 1,
          passThroughRequiredResources: [
            new ChakraResource({ getResourceCost: () => 1 }),
          ],
          passThroughOnSuccess: () => HIDDEN_LEAF_SOUNDS.summon_1.play(),
          actorClass: JacintoAI,
          actorParameters: {
            name: 'Akamaru',
            renderer: {
              character: 'a',
              color: HIDDEN_LEAF_COLORS.kiba_alt,
              background: HIDDEN_LEAF_COLORS.white,
            },
            durability: 4,
            attackDamage: 1,
            // speed: Constant.ENERGY_THRESHOLD * 6,
            onDecreaseDurability: () => {
              playRandomSoundFromArray([
                'wretch_melee_01',
              ], {rate: 1.6});
            },
            meleeSounds: [
              HIDDEN_LEAF_SOUNDS.wretch_melee_01,
              HIDDEN_LEAF_SOUNDS.wretch_melee_02,
              HIDDEN_LEAF_SOUNDS.wretch_melee_03,
            ],
            behaviors: [
              // new Behaviors.MoveTowardsEnemy({repeat: 6, maintainDistanceOf: 0, chainOnSuccess: true}),
              new Behaviors.MoveTowardsEnemy({repeat: 6, maintainDistanceOf: 0, chainOnFail: true}),
              new Behaviors.MoveOrAttackTowardsEnemy({repeat: 1, maintainDistanceOf: 0, chainOnSuccess: true, chainOnFail: true}),
              new Behaviors.Wait({repeat: 1}),
            ],
            faction: actor.faction,
            enemyFactions: actor.enemyFactions,
          },
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

  // const katon = Katon(engine, actor.getPosition());
  // actor.addEquipmentSlot({type: katon.equipmentType})
  // actor.equip(katon.equipmentType, katon);
  return actor;
}

export default function () {
  return {
    basicInfo,
    initialize,
  }
}