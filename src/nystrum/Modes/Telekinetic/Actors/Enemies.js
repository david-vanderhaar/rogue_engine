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

export function addsecurityGuard (mode, pos) {
  addGrubToMapWithStats(mode, pos, GRUB_STATS.securityGuard())
}

export function addRandom (mode, pos) {
  addRandomBasicGrubToMap(mode, pos)
}

const GRUB_STATS = {
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
      baseDescription: 'a gruntled, square-faced corpo gaurd.',
      baseDescriptors: ['with baton and bad health insurance'],
      behaviors: [...new FollowAndAttack({repeat: 1}).create()],
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
