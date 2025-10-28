import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../sounds';
import { getRandomInArray } from '../../../../../helper';

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

function playRandomSoundFromArray(soundArray, soundOptions = {}) {
  const soundKey = getRandomInArray(soundArray)
  const sound = HIDDEN_LEAF_SOUNDS[soundKey]
  if (!sound) return;

  const rate = soundOptions?.rate || 1;
  sound.rate(rate);
  sound.play();
}