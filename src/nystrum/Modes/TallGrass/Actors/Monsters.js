import * as Behaviors from '../../../Entities/AI/Behaviors';
import { COLORS } from '../theme';
import * as Helper from '../../../../helper';
import * as Constant from '../../../constants';
import {JacintoAI} from '../../../Entities/index';
import { ContainerSlot } from '../../../Entities/Containing';
import { Gnasher } from '../../../Items/Weapons/Gnasher';
import { HammerBurst } from '../../../Items/Weapons/HammerBurst';
import { GrenadeThrower } from '../../../Items/Weapons/GrenadeThrower';
import { Ammo } from '../../../Items/Pickups/Ammo';
import { ExplodingAmmo } from '../../../Items/Pickups/ExplodingAmmo';
import { SandSkin } from '../../../StatusEffects/SandSkin';
import { MeleeDamage } from '../../../StatusEffects/MeleeDamage';
import { JACINTO_SOUNDS } from '../../Jacinto/sounds';
import { SpitterSac } from '../Items/Weapons/Spitter';

export function addAbomination (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.abomination())
}

export function addAdult (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.adult())
}

export function addCamoCritter (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.camoCritter())
}

export function addSpitter (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.spitter())
}

export function addHider (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.hider())
}

export function addJuvenile (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.juvenile())
}

export function addRandom (mode, pos) {
  addRandomBasicGrubToMap(mode, pos)
}

const GRUB_STATS = {
  adolescent: () => {
    return {
      name: 'adolescent',
      renderer: {
        character: 'a',
        color: COLORS.flesh1,
        background: COLORS.flesh3,
        sprite: '',
      },
      durability: 2,
      attackDamage: 1,
      baseDescription: 'a wrinkled, pale-fleshed abomination.',
      baseDescriptors: ['gutteral chirps and bloodthirst keep you at bay.'],
      behaviors: [
        new Behaviors.MoveTowardsEnemy({repeat: 5}),
        new Behaviors.TelegraphOnEnemy({repeat: 1, attackPattern: Constant.CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          extraActionParams: {
            onSuccess: () => {
              Helper.getRandomInArray([
                JACINTO_SOUNDS.wretch_melee_01,
                JACINTO_SOUNDS.wretch_melee_02,
                JACINTO_SOUNDS.wretch_melee_03,
              ]).play()
            }
          }
        }),
      ],
    }
  },
  juvenile: () => {
    return {
      name: 'juvenile',
      renderer: {
        character: 'j',
        color: COLORS.ebony,
        background: COLORS.flesh3,
        sprite: '',
      },
      durability: 1,
      attackDamage: 2,
      baseDescription: 'a hunched, ebon-fleshed abomination.',
      baseDescriptors: ['the grass is ingrown into its skin', 'this must be an older one'],
      onDestroy: (actor) => {
        const position = actor.getPosition()
        const allPositions = Helper.getPointsWithinRadius(position, 3)
        const positions = Helper.getNumberOfItemsInArray(10, allPositions)
        positions.forEach((pos) => {
          actor.attack(pos)
          actor.game.mode.placeTallGrass(pos, true)
        })
        actor.game.addMessage(
          `${actor.name} withers, and then bursts sending sharp stalks of tall grass in every direction`,
          {
            color: COLORS.sunset,
            backgroundColor: COLORS.ebony,
          }
        );
      },
      behaviors: [
        new Behaviors.MoveTowardsEnemy({repeat: 5}),
        new Behaviors.TelegraphOnEnemy({repeat: 1, attackPattern: Constant.CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          extraActionParams: {
            onSuccess: () => {
              Helper.getRandomInArray([
                JACINTO_SOUNDS.wretch_melee_01,
                JACINTO_SOUNDS.wretch_melee_02,
                JACINTO_SOUNDS.wretch_melee_03,
              ]).play()
            }
          }
        }),
      ],
    }
  },
  adult: () => {
    return {
      name: 'adult',
      renderer: {
        character: 'A',
        color: COLORS.flesh3,
        background: COLORS.ebony,
        sprite: '',
      },
      durability: 8,
      attackDamage: 2,
      baseDescription: 'a fully-grown, myth of Layoria.',
      baseDescriptors: ['the grass is ingrown into its skin'],
      onDestroy: (actor) => {
        const position = actor.getPosition()
        const allPositions = Helper.getPointsWithinRadius(position, 5)
        const positions = Helper.getNumberOfItemsInArray(20, allPositions)
        positions.forEach((pos) => {
          actor.attack(pos)
          actor.game.mode.placeTallGrass(pos, true)
        })
        actor.game.addMessage(
          `${actor.name} withers, and then bursts sending sharp stalks of tall grass in every direction`,
          {
            color: COLORS.sunset,
            backgroundColor: COLORS.ebony,
          }
        );
      },
      behaviors: [
        new Behaviors.MoveTowardsEnemy({repeat: 2}),
        new Behaviors.TelegraphOnEnemy({repeat: 1, attackPattern: Constant.CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          extraActionParams: {
            onSuccess: () => {
              Helper.getRandomInArray([
                JACINTO_SOUNDS.scion_melee_01,
                JACINTO_SOUNDS.scion_melee_02,
                JACINTO_SOUNDS.scion_melee_03,
              ]).play()
            }
          }
        }),
      ],
    }
  },
  camoCritter: () => {
    return {
      name: 'camo critter',
      renderer: {
        character: 'c',
        color: 'transparent',
        background: 'transparent',
        sprite: '',
      },
      durability: 2,
      attackDamage: 2,
      baseDescription: 'you\'ve never seen it, but you\'ll feel it.',
      behaviors: [
        new Behaviors.MoveTowardsEnemy({repeat: 1}),
        new Behaviors.TelegraphOnEnemy({repeat: 1, attackPattern: Constant.CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          extraActionParams: {
            onSuccess: () => {
              Helper.getRandomInArray([
                JACINTO_SOUNDS.wretch_melee_01,
                JACINTO_SOUNDS.wretch_melee_02,
                JACINTO_SOUNDS.wretch_melee_03,
              ]).play()
            }
          }
        }),
      ],
    }
  },
  spitter: () => {
    return {
      name: 'spitter',
      baseDescription: 'green pus drips from its maw. its belly inflates.',
      renderer: {
        character: 's',
        color: COLORS.flesh1,
        background: COLORS.green,
        sprite: '',
      },
      durability: 1,
      attackDamage: 1,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({repeat: 2, maintainDistanceOf: 4}),
        new Behaviors.TelegraphRangedAttack({repeat: 1}),
        new Behaviors.ExecuteRangedAttack({repeat: 1}),
      ],
      loadout: {
        equipmentCreators: [SpitterSac],
        inventoryCreators: [{amount: 1000, creator: Ammo}]
      },
    }
  },
  hider: () => {
    return {
      name: 'grass hopper',
      baseDescription: 'often hidden in plain sight, clawing at passers-by.',
      baseDescriptors: ['needless to say, the C.C.C reccomends avoiding the deep grass altogether.'],
      renderer: {
        character: 'h',
        color: COLORS.flesh1,
        background: COLORS.sunset,
        sprite: '',
      },
      durability: 1,
      attackDamage: 1,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({repeat: 5}),
        new Behaviors.TelegraphOnEnemy({repeat: 1, attackPattern: Constant.CLONE_PATTERNS.clover}),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          extraActionParams: {
            onSuccess: () => {
              Helper.getRandomInArray([
                JACINTO_SOUNDS.wretch_melee_01,
                JACINTO_SOUNDS.wretch_melee_02,
                JACINTO_SOUNDS.wretch_melee_03,
              ]).play()
            }
          }
        }),
        new Behaviors.MoveTowardsEntityInRangeByAttr({
          repeat: 3,
          range: 5,
          attribute: 'name',
          attributeValue: 'tall grass',
        }),
        new Behaviors.Wait({repeat: 3}),
      ],
    }
  },
};

const createBaseGrubStats = (mode, pos) => {
  return {
    pos,
    game: mode.game,
    faction: 'MONSTER',
    enemyFactions: ['PEOPLE'],
    equipment: Constant.EQUIPMENT_LAYOUTS.gear(),
  }
}

export function createRandomBasic(mode, pos) {
  const createStats = Helper.getRandomInArray(
    Object
    .keys(GRUB_STATS)
    .filter((key) => key !== 'skorge')
    .map((key) => GRUB_STATS[key])
  )
  return createNewJacintoAIEntity({
    ...createBaseGrubStats(mode, pos),
    ...createStats(),
  });
}

function createGrubWithStats(mode, pos, stats) {
  return createNewJacintoAIEntity({
    ...createBaseGrubStats(mode, pos),
    ...stats,
  });
}

function createNewJacintoAIEntity(params) {
  const {loadout, ...entityParams} = params;
  const entity = new JacintoAI({...entityParams})

  if (loadout) equipAndFillInventory(entity, loadout)
  return entity;
}

function equipAndFillInventory(entity, loadout) {
  const {equipmentCreators, inventoryCreators} = loadout;
  const engine = entity.game.engine;
  const container = inventoryCreators.map(({amount, creator}) => createInventorySlot(engine, amount, creator));
  entity.container = container;

  equipmentCreators.forEach((creator) => {
    const equipmentPiece = creator(engine);
    entity.equip(equipmentPiece.equipmentType, equipmentPiece);
  })
}

function createInventorySlot (engine, amount, creator) {
  const item = Array(amount).fill('').map(() => creator(engine));
  return new ContainerSlot({
    itemType: item[0].name,
    items: item,
  });
} 

function addRandomBasicGrubToMap (mode, pos) {
  const entityCreator = () => createRandomBasic(mode, pos)
  addEntityToMapWithStatsUsingCreator(mode, entityCreator)
}

function addGrubToMapWithStats (mode, pos, stats) {
  const entityCreator = () => createGrubWithStats(mode, pos, stats)
  addEntityToMapWithStatsUsingCreator(mode, entityCreator)
}

function addEntityToMapWithStatsUsingCreator (mode, entityCreator) {
  const entity = entityCreator();
  if (mode.game.placeActorOnMap(entity)) {
    mode.game.engine.addActor(entity);
  };
}
