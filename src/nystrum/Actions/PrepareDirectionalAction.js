import { Base } from './Base';
import { Tackle } from './Tackle';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD, PARTICLE_TEMPLATES } from '../constants';
import { getPositionInDirection } from '../../helper';

export class PrepareDirectionalAction extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    actionClass = Tackle,
    actionLabel = 'tackle',
    actionParams = {},
    positionsByDirection = (actor, direction) => [],
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

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      'w,ArrowUp': () => { 
        return new this.actionClass({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: `${this.actionLabel} N`,
          direction: DIRECTIONS.N,
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
          ...this.actionParams,
        })
      },
      'd,ArrowRight': () => { 
        return new this.actionClass({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: `${this.actionLabel} E`,
          direction: DIRECTIONS.E,
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
          ...this.actionParams,
        })
      },
      's,ArrowDown': () => { 
        return new this.actionClass({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: `${this.actionLabel} S`,
          direction: DIRECTIONS.S,
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
          ...this.actionParams,
        })
      },
      'a,ArrowLeft': () => { 
        return new this.actionClass({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: `${this.actionLabel} W`,
          direction: DIRECTIONS.W,
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
          },
          ...this.actionParams,
        })
      },
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
