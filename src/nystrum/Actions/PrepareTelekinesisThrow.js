import { Base } from './Base';
import { Tackle } from './Tackle';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD, PARTICLE_TEMPLATES } from '../constants';
import { getEntitiesByPosition, getPositionInDirection } from '../../helper';
import { Say } from './Say';
import { AddStatusEffectAtPositions } from './AddStatusEffectAtPositions';
import Thrown from '../Modes/Telekinetic/StatusEffects/Thrown';
import { COLORS } from '../Modes/Telekinetic/theme';
import { GLOBAL_EVENT_BUS } from '../Events/EventBus';

export class PrepareTelekinesisThrow extends Base {
  constructor({ 
    targetPositions,
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    actionParams = {},
    throwRange = 3,
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.processDelay = 0;
    this.energyCost = 0;
    this.targetPositions = targetPositions;
    this.actionParams = actionParams
    this.throwRange = throwRange
  }
  perform() {
    // if not entity at target position, fail and exit keymap
    const targets = []
    this.targetPositions.forEach((position) => {
       const entities = getEntitiesByPosition({game: this.game, position: position});
       if (entities.length) targets.push(entities[0]);
    })

    if (!targets.length) {
      return {
        success: false,
        alternative: null,
      }
    }
    

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => {
        this.actor.deactivateCursor()
        this.actor.popToTopKeymap();

        // OR, back out one keymap at a time.
        // this.actor.updateAllCursorNodes([
        //   {key: 'fill', value: 'transparent'}, 
        //   {key: 'stroke', value: COLORS.white}, 
        // ]);

        // this.actor.resetAnimations()
      }
    })

    const actionParams = (direction, label) => ({
      actor: this.actor,
      game: this.game,
      // passThroughEnergyCost: this.passThroughEnergyCost,
      // passThroughRequiredResources: this.passThroughRequiredResources,
      energyCost: this.passThroughEnergyCost,
      requiredResources: this.passThroughRequiredResources,
      label: `Throw ${label}`,
      message: `${this.targetPositions.at(0).x}, ${this.targetPositions.at(0).y}`,
      direction: direction,
      targetPositions: this.targetPositions,
      createEffect: () => new Thrown({ game: this.game, direction, range: this.throwRange }),
      onSuccess: () => {
        this.actor.deactivateCursor();
        // this.actor.setNextAction(goToPreviousKeymap);
        this.actor.popToTopKeymap();
      },
      ...this.actionParams,
    });

    let keymap = {
      Escape: () => goToPreviousKeymap,
      'w,ArrowUp': () => new AddStatusEffectAtPositions(actionParams(DIRECTIONS.N, 'N')),
      'd,ArrowRight': () => new AddStatusEffectAtPositions(actionParams(DIRECTIONS.E, 'E')),
      's,ArrowDown': () => new AddStatusEffectAtPositions(actionParams(DIRECTIONS.S, 'S')),
      'a,ArrowLeft': () => new AddStatusEffectAtPositions(actionParams(DIRECTIONS.W, 'W')),
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
