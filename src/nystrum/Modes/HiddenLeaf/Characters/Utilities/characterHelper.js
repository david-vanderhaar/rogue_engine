import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../sounds';
import { getRandomInArray } from '../../../../../helper';
import * as Constant from '../../../../constants';
import { checkIsWalkingOnFire, checkIsWalkingOnWater, } from '../../../../Modes/HiddenLeaf/StatusEffects/helper';
import { MoveOrAttackWithTileSound } from '../../../../Actions/MoveOrAttackWithTileSound';
import { StandStill } from '../../../../Actions/StandStill';
import { OpenInventory } from '../../../../Actions/OpenInventory';
import { OpenDropInventory } from '../../../../Actions/OpenDropInventory';
import { PickupRandomItem } from '../../../../Actions/PickupRandomItem';
import { MoveTowards } from '../../../../Actions/MoveTowards';
import { GoToPreviousKeymap } from '../../../../Actions/GoToPreviousKeymap';
import { StatChangeOnSelf } from '../../../../Actions/StatChangeOnSelf';


export function generatePlayerCharacterOptions(basicInfo, engine, keymap) {
 return {
  pos: { x: 23, y: 7 },
  renderer: basicInfo.renderer,
  name: basicInfo.name,
  // enemyFactions: ['ALL'],
  enemyFactions: ['OPPONENT'],
  faction: 'PLAYER',
  actions: [],
  traversableTiles: ['WATER'],
  speed: basicInfo.speed,
  durability: basicInfo.durability,
  onDecreaseDurability: () => onDecreaseDurabilitySound(basicInfo?.soundOptions?.onDecreaseDurability || {}),
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
  charge: basicInfo.charge,
  game: engine.game,
  presentingUI: true,
  initializeKeymap: keymap,
 }
}

export function onDecreaseDurabilitySound(soundOptions = {}) {
  playRandomSoundFromArray([
    'take_damage_01',
    'take_damage_02',
    'take_damage_03',
    'take_damage_04',
    'take_damage_05',
    'take_damage_06',
    'take_damage_07',
    'take_damage_08',
    'take_damage_09',
    'take_damage_10',
    'take_damage_11',
  ], soundOptions);
}

export function playRandomSoundFromArray(soundArray, soundOptions = {}) {
  const soundKey = getRandomInArray(soundArray)
  const sound = HIDDEN_LEAF_SOUNDS[soundKey]
  
  if (!sound) return;

  const rate = soundOptions?.rate || 1;
  sound.rate(rate);
  sound.play();
}

function onAfterMoveOrAttack(engine, actor) {
  checkIsWalkingOnWater(engine, actor)
  checkIsWalkingOnFire(engine, actor)
}

export function generateDefaultKeymapActions(engine, actor) {
  return {
    'w,ArrowUp': () => {
      const direction = Constant.DIRECTIONS.N;
      let newX = actor.pos.x + direction[0];
      let newY = actor.pos.y + direction[1];
      return new MoveOrAttackWithTileSound({
        hidden: true,
        targetPos: { x: newX, y: newY },
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        onAfter: () => onAfterMoveOrAttack(engine, actor),
      });
    },
    's,ArrowDown': () => {
      const direction = Constant.DIRECTIONS.S;
      let newX = actor.pos.x + direction[0];
      let newY = actor.pos.y + direction[1];
      return new MoveOrAttackWithTileSound({
        hidden: true,
        targetPos: { x: newX, y: newY },
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        onAfter: () => onAfterMoveOrAttack(engine, actor),
      });
    },
    'a,ArrowLeft': () => {
      const direction = Constant.DIRECTIONS.W;
      let newX = actor.pos.x + direction[0];
      let newY = actor.pos.y + direction[1];
      return new MoveOrAttackWithTileSound({
        hidden: true,
        targetPos: { x: newX, y: newY },
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        onAfter: () => onAfterMoveOrAttack(engine, actor),
      });
    },
    'd,ArrowRight': () => {
      const direction = Constant.DIRECTIONS.E;
      let newX = actor.pos.x + direction[0];
      let newY = actor.pos.y + direction[1];
      return new MoveOrAttackWithTileSound({
        hidden: true,
        targetPos: { x: newX, y: newY },
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD,
        onAfter: () => onAfterMoveOrAttack(engine, actor),
      });
    },
    p: () => new StandStill({
      label: 'Stay',
      game: engine.game,
      actor,
      energyCost: Constant.ENERGY_THRESHOLD,
    }),
    Escape: () => new StandStill({
      label: 'Pass turn',
      message: '...',
      game: engine.game,
      actor,
      energyCost: actor.energy,
    }),
    i: () => new OpenInventory({
      label: 'Inventory',
      game: engine.game,
      actor,
    }),
    o: () => new StatChangeOnSelf({
      label: 'Chakra Gain 1',
      game: engine.game,
      actor,
      energyCost: Constant.ENERGY_THRESHOLD,
      changeByValue: 1,
      statAttributePath: 'charge',
      statAttributePathMax: 'chargeMax',
      statAttributeValueMin: 0,
    }),
    // o: () => new OpenEquipment({
    //   label: 'Equipment',
    //   game: engine.game,
    //   actor,
    // }),
    u: () => new OpenDropInventory({
      label: 'Drop Items',
      game: engine.game,
      actor,
    }),
    g: () => new PickupRandomItem({
      label: 'Pickup',
      game: engine.game,
      actor,
    }),
    // mouseOver: (mousePosition) => {
    //   return new MoveTargetingCursor({
    //     hidden: true,
    //     actor: actor,
    //     game: engine.game,
    //     targetPos: mousePosition,
    //   })
    // },
    mouseLeftButton: (mousePosition) => {
      return new MoveTowards({
        hidden: true,
        actor,
        game: engine.game,
        targetPos: mousePosition,
      })
    },
    mouseRightButton: (mousePosition) => {
      return new GoToPreviousKeymap({
        hidden: true,
        actor,
        game: engine.game,
      })
    },
  };
}