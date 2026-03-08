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
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../sounds'
import { SpitterSac } from '../../TallGrass/Items/Weapons/Spitter';
import FollowAndAttack from '../../../Entities/AI/BehaviorChains/FollowAndAttack';
import { onAfterMoveOrAttack } from '../Characters/Utilities/characterHelper';
import { checkIsWalkingOnFire, checkIsWalkingOnFreeFall } from '../../HiddenLeaf/StatusEffects/helper';
import { NailGun, Pistol } from '../Items/Weapons/RangedWeapons';
import SpecialMove from '../../../Entities/AI/BehaviorChains/SpecialMove';


export function addRandom (mode, pos) {
  addRandomBasicGrubToMap(mode, pos)
}
export function addByKey (mode, pos, key) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS[key]())
}
export function addsecurityGuard (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.securityGuard())
}
export function addConstructionJunkie (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.construction_0())
}
export function addDrone (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.drone())
}

const GRUB_STATS = {
  // EVERY LEVEL
  lab_rat: () => {
    return {
      name: 'lab rat',
      renderer: {
        character: 'r',
        color: COLORS.dark_accent,
        background: COLORS.flesh3,
        sprite: 'r',
      },
      durability: 1,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      baseDescription: 'actually a person. but they spend all their time in the lab, experimenting on you.',
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  securityGuard: () => {
    return {
      name: 'security guard',
      renderer: {
        character: 'g',
        color: COLORS.light,
        background: COLORS.blue_mid,
        sprite: 'g',
      },
      durability: 2,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      baseDescription: 'a gruntled, square-faced corpo guard.',
      baseDescriptors: ['with baton and bad health insurance'],
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  drone: () => {
    return {
      name: 'flying drone',
      renderer: {
        character: '¤',
        color: COLORS.light,
        background: COLORS.drone,
        sprite: '¤',
      },
      durability: 1,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      baseDescription: 'can\'t be thrown over the edge',
      traversableTiles: ['FREE_FALL', 'WATER'],
      onMove: () => null,
      // baseDescriptors: ['with baton and bad health insurance'],
      // behaviors: [...new FollowAndAttack({repeat: 1}).create()],
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
          ignoreObstacles: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  // OFFICE
  office_0: () => {
    return {
      name: 'cubicle dweller',
      renderer: {
        character: 'c',
        color: COLORS.mid_yellow,
        background: COLORS.light_mid,
        sprite: 'c',
      },
      durability: 1,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      baseDescription: 'lives to work, works to live',
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  office_1: () => {
    return {
      name: 'break roomer',
      renderer: {
        character: 'b',
        color: COLORS.red,
        background: COLORS.light_mid,
        sprite: 'b',
      },
      durability: 1,
      attackDamage: 2,
      bloodSpatterOnHit: true,
      baseDescription: 'lives to work, works to live',
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  office_2: () => {
    return {
      name: 'a yes man',
      renderer: {
        character: 'y',
        color: COLORS.blue,
        background: COLORS.light_mid,
        sprite: 'y',
      },
      durability: 1,
      attackDamage: 2,
      bloodSpatterOnHit: true,
      baseDescription: 'whatever you say boss',
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 2,
          maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
          // chainOnFail: true,
        }),
      ],
    }
  },
  office_boss: () => {
    return {
      name: 'floor manager',
      renderer: {
        character: 'f',
        color: COLORS.light_mid,
        background: COLORS.dark_accent,
        sprite: 'f',
      },
      durability: 5,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      baseDescription: 'no breaks, we need the numbers',
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 3,
          maintainDistanceOf: -1, // causes to move and attack in same turn if close enough
          // chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  // CONTRUCTION
  construction_0: () => {
    return {
      name: 'construction hand',
      renderer: {
        character: 'c',
        color: COLORS.mid_yellow,
        background: COLORS.dirt00,
        sprite: 'c',
      },
      durability: 1,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  construction_1: () => {
    return {
      name: 'jacked construction hand',
      renderer: {
        character: 'c',
        color: COLORS.red,
        background: COLORS.dirt00,
        sprite: 'c',
      },
      durability: 1,
      attackDamage: 3,
      bloodSpatterOnHit: true,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  construction_2: () => {
    return {
      name: 'zooted construction hand',
      renderer: {
        character: 'c',
        color: COLORS.blue,
        background: COLORS.dirt00,
        sprite: 'c',
      },
      durability: 1,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 2,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  construction_3: () => {
    return {
      name: 'nail gun operator',
      renderer: {
        character: 'c',
        color: COLORS.light,
        background: COLORS.dirt00,
        sprite: 'c',
      },
      durability: 1,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 3,
          chainOnFail: true
        }),
        new Behaviors.ExecuteEquipItem({
          repeat: 1,
          getItem: NailGun,
          itemName: 'nail gun',
          chainOnFail: true,
        }),
        new Behaviors.TelegraphRangedAttack({repeat: 1, chainOnSuccess: false}),
        new Behaviors.ExecuteRangedAttack({repeat: 1}),
        new Behaviors.MoveAwayFromEnemy({
          repeat: 1,
          maintainDistanceOf: 4,
          chainOnFail: true
        }),
      ],
    }
  },
  construction_boss: () => {
    return {
      name: 'flying tank drone',
      renderer: {
        character: '¤',
        color: COLORS.dark_accent,
        background: COLORS.drone,
        sprite: '¤',
      },
      durability: 10,
      attackDamage: 2,
      bloodSpatterOnHit: true,
      baseDescription: 'can\'t be thrown over the edge',
      traversableTiles: ['FREE_FALL', 'WATER'],
      onMove: () => null,
      // baseDescriptors: ['with baton and bad health insurance'],
      // behaviors: [...new FollowAndAttack({repeat: 1}).create()],
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 2,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
          ignoreObstacles: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  // PARKING GARAGE
  parking_0: () => {
    return {
      name: 'private security guard',
      renderer: {
        character: 'g',
        color: COLORS.mid_yellow,
        background: COLORS.blue_mid,
        sprite: 'g',
      },
      durability: 1,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  parking_1: () => {
    return {
      name: 'jacked security guard',
      renderer: {
        character: 'g',
        color: COLORS.red,
        background: COLORS.blue_mid,
        sprite: 'g',
      },
      durability: 1,
      attackDamage: 3,
      bloodSpatterOnHit: true,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  parking_2: () => {
    return {
      name: 'armored security guard',
      renderer: {
        character: 'g',
        color: COLORS.blue,
        background: COLORS.blue_mid,
        sprite: 'g',
      },
      durability: 1,
      attackDamage: 2,
      defense: 1,
      bloodSpatterOnHit: true,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 0, // causes to move and attack in same turn if close enough
          chainOnFail: true,
        }),
        new Behaviors.TelegraphOnEnemy({
          repeat: 1,
          attackPattern: Constant.CLONE_PATTERNS.clover,
          chainOnSuccess: true,
        }),
        new Behaviors.ExecuteAttack({
          repeat: 1,
          chainOnFail: true
        }),
      ],
    }
  },
  parking_3: () => {
    return {
      name: 'private security pistoleer',
      renderer: {
        character: 'g',
        color: COLORS.light,
        background: COLORS.blue_mid,
        sprite: 'g',
      },
      durability: 1,
      attackDamage: 1,
      bloodSpatterOnHit: true,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({
          repeat: 1,
          maintainDistanceOf: 5,
          chainOnFail: true
        }),
        new Behaviors.ExecuteEquipItem({
          repeat: 1,
          getItem: Pistol,
          itemName: 'pistol',
          chainOnFail: true,
        }),
        new Behaviors.TelegraphRangedAttack({repeat: 1, chainOnSuccess: false}),
        new Behaviors.ExecuteRangedAttack({repeat: 1}),
        new Behaviors.MoveAwayFromEnemy({
          repeat: 1,
          maintainDistanceOf: 6,
          chainOnFail: true
        }),
      ],
    }
  },
  parking_boss: () => {
    return {
      name: 'The CEO',
      renderer: {
        character: '¤',
        color: COLORS.dark_accent,
        background: COLORS.blue_light,
        sprite: '¤',
      },
      durability: 20,
      attackDamage: 3,
      bloodSpatterOnHit: true,
      baseDescription: 'in a military-grade mech suit',
      traversableTiles: ['FREE_FALL', 'WATER'],
      onMove: () => null,
      // baseDescriptors: ['with baton and bad health insurance'],
      behaviors: [
        ...new FollowAndAttack({repeat: 6, moveRepeat: 1}).create(),
        new Behaviors.Wait({repeat: 2}),
        // Phase 2: Special Move
        ...new SpecialMove({repeat: 3, moveRepeat: 4}).create(),
      ],
    }
  },
};

const createBaseGrubStats = (mode, pos) => {
  return {
    pos,
    game: mode.game,
    faction: 'OPPONENT',
    enemyFactions: ['PLAYER'],
    equipment: Constant.EQUIPMENT_LAYOUTS.gear(),
    traversableTiles: [],
    onMove: ({actor}) => {
      // onAfterMoveOrAttack(actor.game.engine, actor)
      checkIsWalkingOnFire(actor.game.engine, actor)
      checkIsWalkingOnFreeFall(actor.game.engine, actor)
    },
    meleeSounds: [
      HIDDEN_LEAF_SOUNDS.punch_01,
      HIDDEN_LEAF_SOUNDS.punch_02,
      HIDDEN_LEAF_SOUNDS.punch_03,
      HIDDEN_LEAF_SOUNDS.punch_04,
      HIDDEN_LEAF_SOUNDS.punch_05,
      HIDDEN_LEAF_SOUNDS.punch_06,
      HIDDEN_LEAF_SOUNDS.punch_07,
      HIDDEN_LEAF_SOUNDS.punch_08,
    ],
  }
}

export function createRandomBasic(mode, pos) {
  const createStats = Helper.getRandomInArray(
    Object
    .keys(GRUB_STATS)
    .filter((key) => !key.endsWith('_boss'))
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
    mode.game.draw()
  };
}
