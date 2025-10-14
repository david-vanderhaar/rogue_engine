import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../../sounds';

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
  onDecreaseDurability: () => HIDDEN_LEAF_SOUNDS.take_melee_hit.play(),
  charge: basicInfo.charge,
  game: engine.game,
  presentingUI: true,
  initializeKeymap: keymap,
 }
}
