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

export function addRandom (mode, pos) {
  addRandomBasicGrubToMap(mode, pos)
}

const GRUB_STATS = {
  rifleman: () => {
    return {
      name: 'Wermacht Rifleman',
      baseDescription: 'a German soldier in field gray uniform, aiming carefully.',
      renderer: {
        character: 'r',
        color: COLORS.white,
        background: COLORS.blue_1,
        sprite: 'r',
      },
      durability: 1,
      attackDamage: 1,
      behaviors: [
        new Behaviors.MoveTowardsEnemy({repeat: 2, maintainDistanceOf: 4}),
        new Behaviors.TelegraphRangedAttack({repeat: 1}),
        new Behaviors.ExecuteRangedAttack({repeat: 1}),
        new Behaviors.MoveTowardsEntityInRangeByAttr({
          repeat: 3,
          range: 5,
          attribute: 'name',
          attributeValue: 'trench wall',
        }),
        new Behaviors.Wait({repeat: 3}),
      ],
      loadout: {
        equipmentCreators: [HammerBurst],
        inventoryCreators: [{amount: 1000, creator: Ammo}]
      },
    }
  },
};

const createBaseGrubStats = (mode, pos) => {
  return {
    pos,
    game: mode.game,
    faction: 'AXIS',
    enemyFactions: ['ALLIES'],
    equipment: Constant.EQUIPMENT_LAYOUTS.gear(),
  }
}

export function createRandomBasic(mode, pos) {
  const createStats = Helper.getRandomInArray(
    Object
    .keys(GRUB_STATS)
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
