import * as Helper from '../../../../helper';
import TelegraphPattern from './TelegraphPattern';

export default class TelegraphOnEnemy extends TelegraphPattern {
  constructor({ ...args }) {
    super({ ...args });
    this.chainOnSuccess = true;
  }

  isValid () {
    let valid = false
    // check if actor is next to enemy
    const positions = Helper.getPositionsFromStructure(this.attackPattern, this.getTargetPosition());
    positions.forEach((pos) => {
      let tile = this.actor.game.map[Helper.coordsToString(pos)];
      if (tile) {
        let targets = Helper.getDestructableEntities(tile.entities);
        targets.forEach((target) => {
          if (this.actor.isEnemy(target)) {
            valid = true
          }
        })
      }
      })
    return valid
  }
}
