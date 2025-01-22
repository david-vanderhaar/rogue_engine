import { Base } from './Base';
import { PlaceActor } from './PlaceActor';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { TYPE } from '../items';
import { DIRECTIONS, ENERGY_THRESHOLD, THEMES } from '../constants';
import * as Helper from '../../helper';
import { PrepareDirectionalThrowInDirection } from './PrepareDirectionalThrowInDirection';

export class PrepareDirectionalThrow extends Base {
  constructor({ 
    passThroughOnSuccess = () => null,
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    projectileType = TYPE.DIRECTIONAL_KUNAI,
    ...args 
  }) {
    super({ ...args });
    this.passThroughOnSuccess = passThroughOnSuccess;
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.projectileType = projectileType;
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {
    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => this.actor.deactivateCursor(),
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      'w,ArrowUp': () => new PrepareDirectionalThrowInDirection({
        label: `throw N?`,
        projectileType: this.projectileType,
        directionToPrepareThrow: 'N',
        activateKey: 'w,ArrowUp',
        game: this.game,
        actor: this.actor,
        passThroughEnergyCost: this.passThroughEnergyCost,
        passThroughRequiredResources: this.passThroughRequiredResources,
        passThroughOnSuccess: this.passThroughOnSuccess,
      }),
      'd,ArrowRight': () => new PrepareDirectionalThrowInDirection({
        label: `throw E?`,
        projectileType: this.projectileType,
        directionToPrepareThrow: 'E',
        activateKey: 'd,ArrowRight',
        game: this.game,
        actor: this.actor,
        passThroughEnergyCost: this.passThroughEnergyCost,
        passThroughRequiredResources: this.passThroughRequiredResources,
        passThroughOnSuccess: this.passThroughOnSuccess,
      }),
      's,ArrowDown': () => new PrepareDirectionalThrowInDirection({
        label: `throw S?`,
        projectileType: this.projectileType,
        directionToPrepareThrow: 'S',
        activateKey: 's,ArrowDown',
        game: this.game,
        actor: this.actor,
        passThroughEnergyCost: this.passThroughEnergyCost,
        passThroughRequiredResources: this.passThroughRequiredResources,
        passThroughOnSuccess: this.passThroughOnSuccess,
      }),
      'a,ArrowLeft': () => new PrepareDirectionalThrowInDirection({
        label: `throw W?`,
        projectileType: this.projectileType,
        directionToPrepareThrow: 'W',
        activateKey: 'a,ArrowLeft',
        game: this.game,
        actor: this.actor,
        passThroughEnergyCost: this.passThroughEnergyCost,
        passThroughRequiredResources: this.passThroughRequiredResources,
        passThroughOnSuccess: this.passThroughOnSuccess,
      }),
    };
    this.actor.setKeymap(keymap);
    return {
      success: true,
      alternative: null,
    };
  }
};
