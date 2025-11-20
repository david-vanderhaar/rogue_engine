import { Base } from './Base';
import { PlaceActor } from './PlaceActor';
import { GoToPreviousKeymap } from './GoToPreviousKeymap';
import * as Cogs from '../Modes/Jacinto/Actors/Cogs';
import { DIRECTIONS, ENERGY_THRESHOLD } from '../constants';
import { getPositionInDirection } from '../../helper';
import { Bandit } from '../Entities';

export class PreparePlaceActorInDirection extends Base {
  constructor({
    entityCreator = () => null,
    actorClass = Bandit,
    actorParameters = {
      name: 'Slingshot',
      renderer: {
        character: 'a',
        color: '#ced5dd',
        background: 'black',
      },
      durability: 1,
      attackDamage: 1,
      speed: 100,
    },
    // actorParameters = {},
    passThroughEnergyCost = ENERGY_THRESHOLD, 
    passThroughRequiredResources = [],
    passThroughOnSuccess = () => null,
    ...args 
  }) {
    super({ ...args });
    this.passThroughEnergyCost = passThroughEnergyCost;
    this.passThroughRequiredResources = passThroughRequiredResources;
    this.processDelay = 0;
    this.energyCost = 0;
    this.entityCreator = entityCreator;
    this.actorClass = actorClass;
    this.actorParameters = actorParameters;
    this.passThroughOnSuccess = passThroughOnSuccess;
  }

  perform() {
    const pos = this.actor.getPosition();
    // tackle in 4 directions a sfar as the actor has energy
    const cursor_positions = [
      DIRECTIONS.N,
      DIRECTIONS.S,
      DIRECTIONS.E,
      DIRECTIONS.W,
    ].map((direction) => getPositionInDirection(pos, direction));
    this.actor.activateCursor(cursor_positions)

    const goToPreviousKeymap = new GoToPreviousKeymap({
      actor: this.actor,
      game: this.game,
      onAfter: () => this.actor.deactivateCursor(),
    })

    // const entity = entityCreator(this.actor, this.game)
    const entity = new this.actorClass({game: this.game, ...this.actorParameters})

    let keymap = {
      Escape: () => goToPreviousKeymap,
      
      'w,ArrowUp': () => { 
        return new PlaceActor({
          actor: this.actor,
          game: this.game,
          interrupt: false,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'target N',
          entity: entity,
          targetPos: getPositionInDirection(pos, DIRECTIONS.N),
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
            this.passThroughOnSuccess();
          },
        })
      },
      'd,ArrowRight': () => { 
        return new PlaceActor({
          actor: this.actor,
          game: this.game,
          interrupt: false,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'target E',
          entity: entity,
          targetPos: getPositionInDirection(pos, DIRECTIONS.E),
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
            this.passThroughOnSuccess();
          },
        })
      },
      's,ArrowDown': () => { 
        return new PlaceActor({
          actor: this.actor,
          game: this.game,
          interrupt: false,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'target S',
          entity: entity,
          targetPos: getPositionInDirection(pos, DIRECTIONS.S),
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
            this.passThroughOnSuccess();
          },
        })
      },
      'a,ArrowLeft': () => { 
        return new PlaceActor({
          actor: this.actor,
          game: this.game,
          interrupt: false,
          energyCost: this.passThroughEnergyCost,
          requiredResources: this.passThroughRequiredResources,
          label: 'target W',
          entity: entity,
          targetPos: getPositionInDirection(pos, DIRECTIONS.W),
          onSuccess: () => {
            this.actor.deactivateCursor();
            this.actor.setNextAction(goToPreviousKeymap);
            this.passThroughOnSuccess();
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
