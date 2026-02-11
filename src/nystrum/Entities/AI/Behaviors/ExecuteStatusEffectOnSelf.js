import ExecuteStatusEffects from './ExecuteStatusEffects';

export default class ExecuteStatusEffectOnSelf extends ExecuteStatusEffects {
  constructor({ ...args }) {
    super({ ...args });
  }

  isValid () {
    return true;
  }

  getTargetPositions () {
    return [this.actor.getPosition()];
  }

  getTargetsOnTile(tile) {
    return tile.entities.filter((entity) => this.actor.id === entity.id);
  }
}
