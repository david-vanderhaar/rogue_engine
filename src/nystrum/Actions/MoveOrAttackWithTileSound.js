import { getRandomInArray, getTileAtPosition } from '../../helper';
import { MoveOrAttack } from './MoveOrAttack';
import { SOUNDS as HIDDEN_LEAF_SOUNDS } from '../Modes/HiddenLeaf/sounds';
import { TILE_STEP_SOUNDS } from '../Modes/HiddenLeaf/theme';

export class MoveOrAttackWithTileSound extends MoveOrAttack {
  constructor({ ...args }) {
    super({ ...args });
  }

  perform() {
    const result = super.perform();
    if (result.success) this.playStepSoundByTile()
    return result;
  }

  playStepSoundByTile() {
    const tile = getTileAtPosition(this.actor.game, this.actor.getPosition())
    if (!tile) return;
    const tileSounds = this.sounds(tile);
    if (tileSounds.length === 0) return;
    const soundKey = getRandomInArray(tileSounds)

    HIDDEN_LEAF_SOUNDS[soundKey]?.play()
  }

  sounds(tile) {
    return TILE_STEP_SOUNDS[tile.type] || [];
  }
}

