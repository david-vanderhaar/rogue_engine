import { Base } from './Base';
import { Tackle } from './Tackle';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD, PARTICLE_TEMPLATES } from '../constants';
import { getPositionInDirection } from '../../helper';

function defaultPositionsByDirection(actor, direction) {
  const pos = actor.getPosition();
  return Array(2).fill('').map((none, distance) => {
    if (distance > 0) {
      return getPositionInDirection(pos, direction.map((dir) => dir * (distance)))
    } else {
      return null;
    }
  }).filter((pos) => pos !== null);
}
export class PrepareDirectionalAction extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    actionClass = Tackle,
    actionLabel = 'tackle',
    actionParams = {},
    positionsByDirection = defaultPositionsByDirection,
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.processDelay = 0;
    this.energyCost = 0;
    this.actionClass = actionClass;
    this.actionLabel = actionLabel;
    this.actionParams = actionParams;
    this.positionsByDirection = positionsByDirection;
  }
  perform() {
    const cursor_positions = [];
    [
      DIRECTIONS.N,
      DIRECTIONS.S,
      DIRECTIONS.E,
      DIRECTIONS.W,
    ].forEach((direction, i) => {
      const positions = this.positionsByDirection(this.actor, direction)
      cursor_positions.push(...positions);
    });

    this.actor.activateCursor(cursor_positions)

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => this.actor.deactivateCursor(),
    })

    const actionParams = (direction, label) => ({
      actor: this.actor,
      game: this.game,
      energyCost: this.passThroughEnergyCost,
      requiredResources: this.passThroughRequiredResources,
      label: `${this.actionLabel} ${label}`,
      direction: direction,
      targetPos: getPositionInDirection(this.actor.getPosition(), direction),
      onSuccess: () => {
        this.actor.deactivateCursor();
        this.actor.setNextAction(goToPreviousKeymap);
      },
      ...this.actionParams,
    });

    let keymap = {
      Backspace: () => goToPreviousKeymap,
      'w,ArrowUp': () => new this.actionClass(actionParams(DIRECTIONS.N, 'N')),
      'd,ArrowRight': () => new this.actionClass(actionParams(DIRECTIONS.E, 'E')),
      's,ArrowDown': () => new this.actionClass(actionParams(DIRECTIONS.S, 'S')),
      'a,ArrowLeft': () => new this.actionClass(actionParams(DIRECTIONS.W, 'W')),
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
