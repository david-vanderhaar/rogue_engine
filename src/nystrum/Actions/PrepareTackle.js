import { Base } from './Base';
import { Tackle } from './Tackle';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import { DIRECTIONS, ENERGY_THRESHOLD, PARTICLE_TEMPLATES } from '../constants';

export class PrepareTackle extends Base {
  constructor({ 
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [], 
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.processDelay = 0;
    this.energyCost = 0;
  }
  perform() {

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
    })

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      w: () => { 
        return new Tackle({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'tackle N',
          direction: DIRECTIONS.N,
          particleTemplate: PARTICLE_TEMPLATES.leaf,
          onSuccess: () => {
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      d: () => { 
        return new Tackle({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'tackle E',
          direction: DIRECTIONS.E,
          particleTemplate: PARTICLE_TEMPLATES.leaf,
          onSuccess: () => {
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      s: () => { 
        return new Tackle({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'tackle S',
          direction: DIRECTIONS.S,
          particleTemplate: PARTICLE_TEMPLATES.leaf,
          onSuccess: () => {
            this.actor.setNextAction(goToPreviousKeymap);
          },
        })
      },
      a: () => { 
        return new Tackle({
          actor: this.actor,
          game: this.game,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'tackle W',
          direction: DIRECTIONS.W,
          particleTemplate: PARTICLE_TEMPLATES.leaf,
          onSuccess: () => {
            this.actor.setNextAction(goToPreviousKeymap);
          },
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
