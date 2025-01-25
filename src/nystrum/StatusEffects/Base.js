import uuid from 'uuid/v1'
import * as Helper from '../../helper';

export class Base {
  constructor({ 
    game, 
    actor, 
    name = 'Effect',
    description = '',
    lifespan = 100,
    stepInterval = 100,
    allowDuplicates = true,
    onStart = () => null,
    onStep = () => null,
    onStop = () => null,
    renderer = {background: 'green', color: 'white', character: '*'},
    processOnlyOnPlayerTurn = false,
  }) {
    this.id = uuid()
    this.game = game
    this.actor = actor
    this.name = name
    this.description = description
    this.lifespan = lifespan
    this.timeToLive = lifespan
    this.stepInterval = stepInterval
    this.allowDuplicates = allowDuplicates
    this.timeSinceLastStep = 0;
    this.onStart = onStart
    this.onStep = onStep
    this.onStop = onStop
    this.renderer = renderer
    this.processOnlyOnPlayerTurn = processOnlyOnPlayerTurn
  }

  static displayName = 'Base Effect'
  static getValidTargetsOnTile (tile, actor) {
    return Helper.getDestructableEntities(tile.entities);
  }

  remove() {
    this.game.engine.removeStatusEffectById(this.id)
  }

  start() {
    this.onStart();
  }

  step(timePassed) {
    this.onStep(timePassed);
  }

  stop() {
    this.onStop();
  }
}