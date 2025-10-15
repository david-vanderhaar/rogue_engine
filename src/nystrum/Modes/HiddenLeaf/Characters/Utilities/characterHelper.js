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
  onDecreaseDurability: () => onDecreaseDurabilitySound(),
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

export function onDecreaseDurabilitySound() {
  playRandomSoundFromArray([
    'take_melee_hit',
  ])
}

function playRandomSoundFromArray(soundArray) {
  const soundKey = getRandomInArray(soundArray)
  HIDDEN_LEAF_SOUNDS[soundKey]?.play()
}